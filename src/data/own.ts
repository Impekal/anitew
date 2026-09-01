/**
 * Eigene Inhalte im Speicher (Backlog I · D-032).
 *
 * Eine Zeile in den Einstellungen je Trainingssprache — bewusst dort und
 * nicht in einer eigenen Tabelle: So wandern die Paare mit der Sicherung
 * (N2) mit, ohne dass jemand daran denken muss (dasselbe Muster wie der
 * Lehr-Stand der Merktechnik). Und sie bleiben lokal (I6): Es gibt keinen
 * Weg von hier ins Netz.
 */

import { type OwnFact, activeOwnFacts, encodeFact, factPrompt } from '../core/index.ts'

import { db } from './db.ts'
import { itemIdOf, wordOf } from './items.ts'

const keyFor = (language: string): string => `own.facts.${language}`
/**
 * Was weggeworfen wurde, mit Zeitpunkt — je Trainingssprache.
 *
 * Nötig, seit die Paare über Drive vereinigt werden (`core/sync/ownContent.ts`):
 * Eine reine Vereinigung kann nichts löschen, das andere Gerät brächte jedes
 * gelöschte Paar zurück. Eine eigene Zeile, damit die Paarliste ein Feld
 * bleibt, das eine ältere App unverändert liest.
 */
const removedKeyFor = (language: string): string => `own.facts.removed.${language}`

async function removedMarks(language: string): Promise<Record<string, number>> {
  const stored = (await db.settings.get(removedKeyFor(language)))?.value
  if (typeof stored !== 'object' || stored === null || Array.isArray(stored)) return {}
  return stored as Record<string, number>
}

/**
 * Die gespeicherten Paare, aufgeräumt. Fremde Werte fliegen raus — die
 * Einstellungen können aus einer Sicherung kommen, und eine Sicherung kann
 * alles enthalten.
 */
export async function loadOwnFacts(language: string): Promise<OwnFact[]> {
  const stored = (await db.settings.get(keyFor(language)))?.value
  if (!Array.isArray(stored)) return []
  const facts = stored.filter(
    (entry): entry is OwnFact =>
      typeof entry === 'object' &&
      entry !== null &&
      typeof (entry as OwnFact).prompt === 'string' &&
      typeof (entry as OwnFact).answer === 'string' &&
      (entry as OwnFact).prompt !== '' &&
      (entry as OwnFact).answer !== '',
  )
  return [...activeOwnFacts(facts, await removedMarks(language))]
}

/**
 * Nimmt neue Paare auf. Eine Frage gibt es nur einmal je Sprache — wer sie
 * erneut einfügt, behält die **bestehende** Karte samt ihrer Termine; still
 * eine neue daneben zu legen hieße, dieselbe Frage zweimal zu prüfen.
 */
export async function addOwnFacts(language: string, facts: readonly OwnFact[]): Promise<void> {
  const existing = await loadOwnFacts(language)
  const known = new Set(existing.map((fact) => fact.prompt))
  const fresh = facts.filter((fact) => {
    if (known.has(fact.prompt)) return false
    known.add(fact.prompt)
    return true
  })
  if (fresh.length === 0) return

  /*
   * Wer eine weggeworfene Frage erneut einträgt, will sie wiederhaben. Der
   * Merkzettel muss sie dann loslassen — sonst filterte er sie beim nächsten
   * Laden gleich wieder weg, und das Eintragen sähe folgenlos aus.
   */
  const marks = await removedMarks(language)
  const revived = fresh.filter((fact) => marks[fact.prompt] !== undefined)
  if (revived.length > 0) {
    const kept = { ...marks }
    for (const fact of revived) delete kept[fact.prompt]
    await db.settings.put({ key: removedKeyFor(language), value: kept })
  }

  await db.settings.put({ key: keyFor(language), value: [...existing, ...fresh] })
}

/**
 * Entfernt ein Paar — und seinen Termin gleich mit. Eine gelöschte Karte,
 * die nach Tagen als Frage wiederkäme, wäre die unangenehmste Sorte
 * Überraschung.
 */
export async function removeOwnFact(language: string, prompt: string, now: number): Promise<void> {
  const existing = await loadOwnFacts(language)
  await db.settings.put({
    key: removedKeyFor(language),
    value: { ...(await removedMarks(language)), [prompt]: now },
  })
  await db.settings.put({
    key: keyFor(language),
    value: existing.filter((fact) => fact.prompt !== prompt),
  })
  const gone = existing.find((fact) => fact.prompt === prompt)
  if (gone !== undefined) {
    await db.itemStates.delete(itemIdOf('facts', language, encodeFact(gone)))
  }
}

/**
 * Der Vorrat des Moduls: alle Paare, die **noch keinen Termin** haben —
 * kodiert als Kennungen, wie der Planer sie erwartet. Terminierte Paare
 * kommen über das Wiedersehen zurück, nicht über den Vorrat (D-004).
 */
export async function loadOwnPool(language: string): Promise<string[]> {
  const facts = await loadOwnFacts(language)
  const rows = await db.itemStates.where('language').equals(language).toArray()
  const tracked = new Set(
    rows.filter((row) => row.moduleId === 'facts').map((row) => factPrompt(wordOf(row.itemId))),
  )
  return facts.filter((fact) => !tracked.has(fact.prompt)).map(encodeFact)
}
