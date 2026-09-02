/**
 * Eigene Inhalte über zwei Geräte zusammenführen (G3 · I · N9 · D-033).
 *
 * Selbst angelegte Paläste und selbst eingegebene Frage-Antwort-Paare liegen
 * als Einstellung in der Datenbank — bewusst, damit sie mit der Sicherung
 * mitwandern, ohne dass jemand daran denken muss. Beim stillen Drive-Abgleich
 * gilt für Einstellungen aber „lokal gewinnt“ (`sync/settings.ts`), und das
 * ist für eine Vorliebe richtig und für Inhalt falsch: Wer sich die Orte
 * seiner Wohnung überlegt hat, will sie auf dem zweiten Gerät wiederfinden.
 *
 * Hier steht die Regel für den Inhalt. Sie ist die der Sicherung (N9):
 * vereinigen, nie löschen — mit zwei Vorbehalten, die beide aus der
 * Wirklichkeit zweier Geräte kommen und nicht aus Vorsicht.
 *
 * ── Vorbehalt 1: gleiche Kennung, verschiedener Palast ────────────────────
 *
 * `nextOrdinal` läuft auf jedem Gerät für sich. Zwei Geräte, die je einen
 * ersten eigenen Palast anlegen, nennen beide ihren `own`. Die Kennung sagt
 * dann nicht mehr, welcher Palast gemeint ist.
 *
 * Bei gleicher Kennung bleibt deshalb **der lokale stehen** und der fremde
 * bleibt draußen. Kein Gerät verliert etwas, das es hatte, und beide Geräte
 * kommen ohne Absprache zum selben Ergebnis — jedes behält seinen eigenen.
 * Den fremden unter einer neuen Nummer aufzunehmen wäre schlimmer: An den
 * Kennungen hängen Termine, und zwei Geräte, die sich gegenseitig umnummerieren,
 * kämen nie zur Ruhe.
 *
 * Was das offenlässt, steht offen: Ein Palast, der auf beiden Geräten dieselbe
 * Nummer trägt, wandert nicht. Das zu lösen hieße, die Kennungen zu ändern —
 * und an ihnen hängt der Wiederholungsverlauf jedes Gegenstands, der dort
 * abgelegt wurde.
 *
 * ── Vorbehalt 2: Weggeworfenes muss weg bleiben ───────────────────────────
 *
 * Eine reine Vereinigung kann nichts löschen: Was ein Gerät wegwirft, bringt
 * das andere beim nächsten Abgleich zurück, und zwar für immer. Deshalb führt
 * jede Seite einen Merkzettel des Weggeworfenen — dieselbe Lösung, die der
 * Memory-Graph (D-036) schon benutzt. Er wird mitvereinigt, und die Speicher
 * lesen ihn beim Laden.
 */

import { OWN_MAX_PALACES, type OwnPalace, isOwnPalace } from '../content/palace.ts'
import type { OwnFact } from '../content/own.ts'
import { type OwnPalaceStore, readRemovedMarks } from '../content/ownRemoved.ts'

/**
 * Die laufende Nummer aus einer Kennung. `own` ist der erste, `own5` der
 * fünfte — so vergibt `data/palace.ts` sie, und so muss sie hier zurückgelesen
 * werden, damit die nächste Nummer wirklich hinter allen Vergebenen liegt.
 */
function ordinalOf(id: string): number {
  if (id === 'own') return 1
  const digits = id.slice(3)
  const value = Number.parseInt(digits, 10)
  return Number.isInteger(value) && value >= 1 ? value : 1
}

function readPalaceStore(value: unknown): OwnPalaceStore | undefined {
  if (typeof value !== 'object' || value === null) return undefined
  const candidate = value as Record<string, unknown>
  const palaces = candidate['palaces']
  const next = candidate['nextOrdinal']
  if (!Array.isArray(palaces) || !palaces.every(isOwnPalace)) return undefined
  if (typeof next !== 'number' || !Number.isInteger(next) || next < 1) return undefined
  return { palaces: palaces as readonly OwnPalace[], nextOrdinal: next }
}

/**
 * Vereinigt die eigenen Paläste beider Geräte.
 *
 * Unlesbares auf einer Seite lässt den lokalen Stand unangetastet: Eine Datei,
 * die keine gültige Liste enthält, ist kein Grund, eine gültige zu leeren.
 */
export function mergeOwnPalaces(local: unknown, remote: unknown): unknown {
  const mine = readPalaceStore(local)
  const theirs = readPalaceStore(remote)
  if (mine === undefined || theirs === undefined) return local

  const byId = new Map<string, OwnPalace>()
  for (const palace of mine.palaces) byId.set(palace.id, palace)
  for (const palace of theirs.palaces) {
    // Die Obergrenze gilt auch für den Abgleich. Sie steht nicht aus
    // Sparsamkeit da, sondern weil mehr Paläste niemand auseinanderhält.
    if (byId.size >= OWN_MAX_PALACES) break
    if (!byId.has(palace.id)) byId.set(palace.id, palace)
  }

  const palaces = [...byId.values()]
  const used = palaces.map((palace) => ordinalOf(palace.id) + 1)
  return {
    palaces,
    nextOrdinal: Math.max(mine.nextOrdinal, theirs.nextOrdinal, ...used),
  }
}

function readFacts(value: unknown): readonly OwnFact[] | undefined {
  if (!Array.isArray(value)) return undefined
  const facts: OwnFact[] = []
  for (const entry of value) {
    if (typeof entry !== 'object' || entry === null) continue
    const candidate = entry as Record<string, unknown>
    const prompt = candidate['prompt']
    const answer = candidate['answer']
    if (typeof prompt !== 'string' || prompt === '') continue
    if (typeof answer !== 'string' || answer === '') continue
    const editedAt = candidate['editedAt']
    facts.push({
      prompt,
      answer,
      ...(typeof editedAt === 'number' && Number.isFinite(editedAt) ? { editedAt } : {}),
    })
  }
  return facts
}

/**
 * Vereinigt die eigenen Paare beider Geräte.
 *
 * Die Frage ist der Schlüssel — genau wie beim Einfügen (`data/own.ts`):
 * Dieselbe Frage bedeutet auf beiden Geräten dieselbe Karte. Neue Karten des
 * anderen Geräts kommen dazu.
 *
 * **Bei zwei Antworten auf dieselbe Frage** entscheidet die Berichtigungsmarke
 * (`editedAt`): Seit dem 02.09. lässt sich eine Antwort ändern, also ist
 * „lokal gewinnt immer“ nicht mehr richtig — wer den Tippfehler auf dem einen
 * Gerät berichtigt, fände ihn sonst auf dem anderen für immer wieder. Die
 * jüngste bewusste Änderung gewinnt; trägt keine Seite eine Marke (alle
 * Karten von vor dem 02.09.), bleibt es beim lokalen Eintrag.
 *
 * Der Wiederholungsverlauf reist getrennt: Er hängt an der Kennung
 * `frage ⟂ antwort` und liegt in der Tabelle `itemStates`, die derselbe
 * Abgleich mitnimmt. Das berichtigende Gerät zieht ihn dort auf die neue
 * Kennung um (`data/own.ts`), sodass er beim anderen Gerät unter der neuen
 * Antwort ankommt.
 */
export function mergeOwnFacts(local: unknown, remote: unknown): unknown {
  if (!Array.isArray(local) || !Array.isArray(remote)) return local
  const mine = readFacts(local)
  const theirs = readFacts(remote)
  if (mine === undefined || theirs === undefined) return local

  const byPrompt = new Map<string, OwnFact>()
  for (const fact of mine) byPrompt.set(fact.prompt, fact)
  for (const fact of theirs) {
    const local = byPrompt.get(fact.prompt)
    if (local === undefined) {
      byPrompt.set(fact.prompt, fact)
      continue
    }
    if ((fact.editedAt ?? 0) > (local.editedAt ?? 0)) byPrompt.set(fact.prompt, fact)
  }
  return [...byPrompt.values()]
}

/**
 * Vereinigt zwei Merkzettel des Weggeworfenen; bei zwei Zeitpunkten gilt der
 * jüngere. Der Merkzettel wächst damit nur — und das ist richtig: Er ist der
 * einzige Beleg dafür, dass etwas absichtlich weg ist und nicht bloß fehlt.
 */
export function mergeRemovedMarks(local: unknown, remote: unknown): unknown {
  const mine = readRemovedMarks(local)
  const theirs = readRemovedMarks(remote)
  if (mine === undefined || theirs === undefined) return local

  const merged: Record<string, number> = { ...mine }
  for (const [key, at] of Object.entries(theirs)) {
    const existing = merged[key]
    merged[key] = existing === undefined ? at : Math.max(existing, at)
  }
  return merged
}

