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

  if (key === 'technique.major.taught') return mergeMajorDigits(local, remote)
  if (/^technique\..+\.taught$/u.test(key)) {
    if (typeof local === 'boolean' && typeof remote === 'boolean') return local || remote
    return local
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
