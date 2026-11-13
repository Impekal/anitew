import { DIMENSIONS } from '../profile/dimensions.ts'
import { mergeOwnFacts, mergeOwnPalaces, mergeRemovedMarks } from './ownContent.ts'
import {
  PROFILE_HISTORY_LIMIT,
  readProfileHistory,
  type ProfileSnapshot,
} from '../profile/history.ts'

function finiteNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

function mergeProfileHistory(local: unknown, remote: unknown): readonly ProfileSnapshot[] {
  const byDay = new Map<string, ProfileSnapshot>()

  // Remote zuerst, lokal danach: Bei exakt gleichem Informationsstand bleibt
  // die lokale Momentaufnahme maßgeblich. Pro Dimension gewinnt sonst die
  // Momentaufnahme mit mehr realen Abfragen (`chances`).
  for (const snapshot of [...readProfileHistory(remote), ...readProfileHistory(local)]) {
    const previous = byDay.get(snapshot.day)
    if (previous === undefined) {
      byDay.set(snapshot.day, snapshot)
      continue
    }

    const counts: ProfileSnapshot['counts'] = {}
    for (const dimension of DIMENSIONS) {
      const mine = snapshot.counts[dimension]
      const theirs = previous.counts[dimension]
      if (mine === undefined) {
        if (theirs !== undefined) counts[dimension] = theirs
        continue
      }
      if (theirs === undefined || mine.chances >= theirs.chances) counts[dimension] = mine
      else counts[dimension] = theirs
    }
    byDay.set(snapshot.day, { day: snapshot.day, counts })
  }

  return [...byDay.values()]
    .sort((a, b) => a.day.localeCompare(b.day))
    .slice(-PROFILE_HISTORY_LIMIT)
}

function mergeMajorDigits(local: unknown, remote: unknown): unknown {
  if (!Array.isArray(local) || !Array.isArray(remote)) return local
  const digits = new Set<number>()
  for (const value of [...local, ...remote]) {
    if (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 9) {
      digits.add(value)
    }
  }
  return [...digits].sort((a, b) => a - b)
}

/**
 * Ein Lernstand mit Zeitpunkt (Nutzerwunsch 03.09.).
 *
 * `at` ist der Zeitpunkt der letzten Änderung, `clearedAt` der eines
 * bewussten „neu anfangen". Altbestand hat beides nicht und wird weiterhin
 * einfach vereinigt.
 */
interface Gelernt {
  readonly at?: number
  readonly clearedAt?: number
  readonly digits?: unknown
  readonly taught?: unknown
}

function alsGelernt(value: unknown): Gelernt | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return undefined
  const eintrag = value as Gelernt
  return typeof eintrag.at === 'number' ? eintrag : undefined
}

/** Der Inhalt eines Lernstands — die Liste, das Ja/Nein oder der nackte Altwert. */
function inhalt(value: unknown): unknown {
  const eintrag = alsGelernt(value)
  if (eintrag === undefined) return value
  return eintrag.digits ?? eintrag.taught
}

/**
 * Lernstand zusammenführen: vereinigen — außer, jemand hat bewusst
 * zurückgesetzt.
 *
 * ── Warum es die Ausnahme braucht ─────────────────────────────────────────
 *
 * Vereinigen ist für **Lernen** richtig: Wer auf dem Telefon die Vier lernt
 * und auf dem Rechner die Sieben, soll beide behalten, und keine ältere
 * Drive-Datei darf Gelerntes wegnehmen.
 *
 * Dieselbe Regel machte „neu anfangen" unmöglich: Das andere Gerät kennt die
 * Ziffern noch, der nächste Abgleich holt sie zurück. Auf dem Gerät, an dem
 * man gedrückt hat, sähe es nach Erfolg aus — bis zum nächsten Abgleich.
 *
 * Die Auflösung ist dieselbe wie beim Berichtigen eigener Karten: Ein
 * bewusster Eingriff bekommt einen Zeitpunkt, und der jüngere gewinnt. Ein
 * Zurücksetzen schlägt alles, was **davor** gelernt wurde — und verliert
 * gegen alles, was **danach** gelernt wurde. Sonst könnte man nach einem
 * Zurücksetzen nie wieder etwas lernen.
 */
function mergeLearned(
  local: unknown,
  remote: unknown,
  vereinige: (mine: unknown, theirs: unknown) => unknown,
): unknown {
  const meins = alsGelernt(local)
  const ihres = alsGelernt(remote)

  /*
   * Ein Zeitpunkt schlägt keinen Zeitpunkt. Während der Übergangszeit
   * schreibt ein noch nicht aktualisiertes Gerät die nackte Form; ein
   * Zurücksetzen mit Zeitpunkt ist eine bewusste Handlung mit bekannter
   * Zeit, ein nacktes `true` ist es nicht.
   */
  const seitAnderswo = (eintrag: Gelernt | undefined): number => eintrag?.at ?? 0
  if (meins?.clearedAt !== undefined && meins.clearedAt > seitAnderswo(ihres)) return local
  if (ihres?.clearedAt !== undefined && ihres.clearedAt > seitAnderswo(meins)) return remote

  const vereinigt = vereinige(inhalt(local), inhalt(remote))
  if (meins === undefined && ihres === undefined) return vereinigt

  // Der jüngere Zeitpunkt und das ältere Zurücksetzen bleiben stehen: Beides
  // ist Wissen über die Vergangenheit und darf nicht verlorengehen.
  const at = Math.max(seitAnderswo(meins), seitAnderswo(ihres))
  const clearedAt = Math.max(meins?.clearedAt ?? 0, ihres?.clearedAt ?? 0)
  const schluessel = meins?.digits !== undefined || ihres?.digits !== undefined ? 'digits' : 'taught'
  return clearedAt > 0
    ? { [schluessel]: vereinigt, at, clearedAt }
    : { [schluessel]: vereinigt, at }
}

/**
 * Konfliktregel ausschließlich für den automatischen Drive-Abgleich.
 *
 * Eine manuell importierte Sicherung darf weiterhin bewusst Einstellungen
 * wiederherstellen. Beim unsichtbaren Geräteabgleich ist das anders: Eine
 * ältere Drive-Datei darf eine vorhandene lokale Wahl nicht zurückdrehen.
 * Monotoner Lernfortschritt wird dagegen vereinigt, damit kein Gerät bereits
 * Gelerntes wieder „vergisst“.
 */
export function mergeDriveSettingValue(key: string, local: unknown, remote: unknown): unknown {
  if (key === 'memory.graph') return remote

  /*
   * Eigene Inhalte sind keine Vorlieben (G3 · I). Sie werden vereinigt, und
   * ihre Merkzettel des Weggeworfenen gleich mit — sonst käme jedes gelöschte
   * Paar beim nächsten Abgleich vom anderen Gerät zurück. Die Merkzettel
   * stehen zuerst, weil `own.facts.removed.de` sonst als Paarliste gelesen
   * würde.
   */
  if (key === 'palace.own.removed') return mergeRemovedMarks(local, remote)
  if (key.startsWith('own.facts.removed.')) return mergeRemovedMarks(local, remote)
  if (key === 'palace.own.v2') return mergeOwnPalaces(local, remote)
  if (key.startsWith('own.facts.')) return mergeOwnFacts(local, remote)

  if (key === 'technique.major.taught') return mergeLearned(local, remote, mergeMajorDigits)
  if (/^technique\..+\.taught$/u.test(key)) {
    return mergeLearned(local, remote, (mine, theirs) =>
      typeof mine === 'boolean' && typeof theirs === 'boolean' ? mine || theirs : mine,
    )
  }

  if (key.startsWith('profile.history.')) return mergeProfileHistory(local, remote)

  if (key === 'firstSeenAt') {
    const mine = finiteNumber(local)
    const theirs = finiteNumber(remote)
    if (mine !== undefined && theirs !== undefined) return Math.min(mine, theirs)
    return local
  }

  if (key === 'openCount') {
    const mine = finiteNumber(local)
    const theirs = finiteNumber(remote)
    if (mine !== undefined && theirs !== undefined) return Math.max(mine, theirs)
    return local
  }

  // Sprache, Ton, Trainingssprache, Profil, Erinnerungszeit und technische
  // Scheduler-Parameter bleiben auf einem bereits eingerichteten Gerät lokal.
  // Fehlt der Schlüssel lokal, übernimmt der Datenadapter unten Remote normal.
  return local
}
