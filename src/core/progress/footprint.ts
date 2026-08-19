/**
 * Die Trainingsbilanz (V2: sichtbare Entwicklung) — trainierte Tage je
 * Sieben-Tage-Fenster, rückwärts vom Heute gezählt.
 *
 * Das ist ausdrücklich **Übungsstand**, keine Gedächtnisaussage (R-1):
 * Gezählt wird, ob an einem Tag trainiert wurde — mehr behauptet die
 * Anzeige nicht, und genau das macht sie unangreifbar. Kein Zielwert,
 * kein Soll, keine Färbung nach „zu wenig“ (K7): Balken sagen, was war.
 */

import { type DayKey, daysBetween } from '../time.ts'

export interface FootprintWeek {
  /** Tage mit mindestens einer Einheit in diesem Fenster (0..7). */
  readonly daysTrained: number
}

/**
 * Fenster in Lesereihenfolge: das älteste zuerst, ganz rechts die
 * laufenden sieben Tage. Doppelte Tage zählen einmal; Zukunft und
 * alles vor dem Zeitraum fällt heraus.
 */
export function trainingFootprint(
  trained: readonly DayKey[],
  today: DayKey,
  weeks: number,
): FootprintWeek[] {
  const counts = Array.from({ length: Math.max(0, weeks) }, () => 0)
  const seen = new Set<DayKey>()
  for (const day of trained) {
    if (seen.has(day)) continue
    seen.add(day)
    const back = daysBetween(day, today)
    if (back < 0) continue
    const index = Math.floor(back / 7)
    if (index >= counts.length) continue
    counts[index] = (counts[index] ?? 0) + 1
  }
  return counts.map((daysTrained) => ({ daysTrained })).reverse()
}
