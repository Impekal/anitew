/**
 * Der Coach ohne Netz (Backlog M · D-031).
 *
 * Der Pflichtteil des Coaches: Er funktioniert **immer**, ohne Schlüssel,
 * ohne Verbindung — und er sagt nur, was die eigenen Zahlen hergeben (R-1).
 * Kein Ratschlag aus dem Nichts, kein Lob, das nichts belegt, keine
 * Aufforderung, die Druck macht (K7). Was er sagt, ist dieselbe Sorte
 * Auskunft wie der Schwerpunkt (E5): gerechnet, mit Quelle.
 *
 * Der Kern liefert **Kennungen mit Anlass**, keine Sätze — die Sätze stehen
 * im Wörterbuch (dasselbe Muster wie überall). Und er bekommt fertige
 * Befunde (die schwächste Achse, die Verschiebungen), nicht die Rohdaten:
 * Wer rechnet, ist anderswo entschieden, und zwei Rechnungen über dasselbe
 * wären zwei Wahrheiten.
 */

import type { DimensionId } from '../profile/dimensions.ts'
import type { ModuleId } from '../session/plan.ts'

/** Die Anlässe, zu denen der Coach etwas zu sagen hat. */
export const ADVICE_IDS = [
  /** Eine Achse ist belegt am schwächsten — der Schwerpunkt-Hinweis. */
  'focusWeakest',
  /** Ein Modul wurde kleiner gestellt (D2) — einordnen, nicht beschönigen. */
  'smallerRounds',
  /** Ein Modul wurde größer gestellt (D2) — feststellen, nicht feiern. */
  'largerRounds',
  /** Die nächste Messung ist fällig (F). */
  'benchmarkDue',
  /** Noch keine Zahlen, die etwas hergeben — der ehrliche Anfang. */
  'firstSteps',
] as const

export type AdviceId = (typeof ADVICE_IDS)[number]

export interface Advice {
  readonly id: AdviceId
  /** Das betroffene Modul (bei den Verschiebungen). */
  readonly moduleId?: ModuleId
  /** Die betroffene Achse (beim Schwerpunkt). */
  readonly dimension?: DimensionId
}

export interface CoachInput {
  /** Die belegt schwächste Achse — `weakest(profileOf(...))`, sonst nichts. */
  readonly weakest?: DimensionId
  /** Die Verschiebungen der adaptiven Schwierigkeit je Modul (D2). */
  readonly deltas: Readonly<Partial<Record<ModuleId, -1 | 0 | 1>>>
  /** Ist die nächste Messung fällig? (F) */
  readonly benchmarkDue: boolean
}

/** Mehr als drei Hinweise sind keine Hinweise mehr, sondern eine Liste. */
export const MAX_ADVICE = 3

/**
 * Was der Coach heute zu sagen hat — in fester Vorrangfolge, höchstens drei
 * Stücke. Gibt es nichts Belegtes, bleibt genau ein ehrlicher Satz: erst
 * trainieren, dann beraten.
 */
export function adviceOf(input: CoachInput): readonly Advice[] {
  const advice: Advice[] = []

  if (input.weakest !== undefined) {
    advice.push({ id: 'focusWeakest', dimension: input.weakest })
  }

  const modules = Object.keys(input.deltas) as ModuleId[]
  const smaller = modules.find((moduleId) => input.deltas[moduleId] === -1)
  if (smaller !== undefined) advice.push({ id: 'smallerRounds', moduleId: smaller })
  const larger = modules.find((moduleId) => input.deltas[moduleId] === 1)
  if (larger !== undefined) advice.push({ id: 'largerRounds', moduleId: larger })

  if (input.benchmarkDue) advice.push({ id: 'benchmarkDue' })

  if (advice.length === 0) return [{ id: 'firstSteps' }]
  return advice.slice(0, MAX_ADVICE)
}
