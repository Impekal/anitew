/**
 * Das Gedächtnisprofil (Backlog E3, E4, E7 · D-021).
 *
 * Die Rechnung ist absichtlich dieselbe wie bei der Messung
 * (`benchmark/progress.ts`), bis hin zur Breite der Spanne: Ein Anteil aus
 * wenigen Gelegenheiten schwankt allein durch Zufall, und wer daraus einen
 * exakten Wert macht, behauptet eine Genauigkeit, die er nicht hat.
 *
 * Der Unterschied zur Messung ist der Gegenstand: Dort sind es zwanzig Wörter
 * unter festen Bedingungen, hier ist es das, was das Training nebenbei
 * hergibt. Deshalb steht das Profil auch **nicht** neben der Messung, sondern
 * an seinem eigenen Platz (F1).
 */

import { type DimensionId, DIMENSIONS, isImmediate, SOURCES } from './dimensions.ts'

/**
 * Ab wie vielen Gelegenheiten eine Achse etwas sagt.
 *
 * Fünfzehn. Darunter ist die Spanne breiter als jede Aussage, die man daraus
 * ziehen wollte: Bei zehn Gelegenheiten sind zwei Fehler mehr schon zwanzig
 * Prozentpunkte. Die Zahl ist eine Setzung — sie steht hier und nicht
 * verstreut im Code, damit sie sich begründet ändern lässt.
 */
export const MIN_CHANCES = 15

/** Breite der Spanne in Standardfehlern — wie bei der Messung. */
const SPREAD = 2

/** Was in den Terminen einer Achse steht. */
export interface DimensionCounts {
  /** Wie oft etwas nach seinem ersten Tag zurückkam. */
  chances: number
  /** Wie oft es dabei weg war. */
  lost: number
}

export type DimensionResult =
  /** Gemessen — Anteil in Prozentpunkten, mit Spanne. */
  | {
      kind: 'measured'
      id: DimensionId
      held: number
      chances: number
      rate: number
      low: number
      high: number
    }
  /** Es gibt Daten, aber zu wenige für eine Aussage (E7). */
  | { kind: 'tooFew'; id: DimensionId; chances: number; needed: number }
  /** Diese Achse misst die Messung, nicht das Training (F1). */
  | { kind: 'elsewhere'; id: DimensionId }
  /** Es gibt in dieser App nichts, was sie misst. */
  | { kind: 'notMeasured'; id: DimensionId }

/**
 * Das Profil aus den Terminen.
 *
 * Fehlt eine Achse in `counts`, gilt sie als „noch keine Gelegenheit“ und
 * nicht als „schlecht“. Das ist kein Detail: Der Unterschied zwischen
 * *nichts gemessen* und *schlecht abgeschnitten* ist die ganze Regel R-1.
 */
export function profileOf(
  counts: Partial<Record<DimensionId, DimensionCounts>>,
): readonly DimensionResult[] {
  return DIMENSIONS.map((id) => {
    const source = SOURCES[id]
    if (source.kind === 'benchmark') return { kind: 'elsewhere', id } as const
    if (source.kind === 'none') return { kind: 'notMeasured', id } as const

    const entry = counts[id] ?? { chances: 0, lost: 0 }
    if (entry.chances < MIN_CHANCES) {
      return { kind: 'tooFew', id, chances: entry.chances, needed: MIN_CHANCES } as const
    }

    const held = Math.max(0, entry.chances - entry.lost)
    const rate = held / entry.chances
    /*
     * Der Standardfehler eines Anteils. Dieselbe grobe Schätzung wie bei der
     * Messung: Sie sagt, wie stark dieselbe Person allein durch Zufall
     * schwanken kann — nicht, wie gut ihr Gedächtnis ist.
     */
    const error = Math.sqrt((rate * (1 - rate)) / entry.chances)
    return {
      kind: 'measured',
      id,
      held,
      chances: entry.chances,
      rate: Math.round(rate * 100),
      low: Math.max(0, Math.round((rate - SPREAD * error) * 100)),
      high: Math.min(100, Math.round((rate + SPREAD * error) * 100)),
    } as const
  })
}

/** Hat das Profil überhaupt schon etwas zu sagen? */
export function hasProfile(results: readonly DimensionResult[]): boolean {
  return results.some((result) => result.kind === 'measured')
}

/**
 * Die schwächste gemessene Achse — die Grundlage für E5.
 *
 * Sie wird erst genannt, wenn sich **zwei** Achsen wirklich unterscheiden:
 * Ihre Spannen dürfen sich nicht überlappen. Sonst hieße „Zahlen sind deine
 * Schwachstelle“ nur, dass der Zufall an diesem Tag so lag — und eine App,
 * die daraufhin den Trainingsplan umbaut, baut ihn auf Rauschen um.
 */
export function weakest(results: readonly DimensionResult[]): DimensionId | undefined {
  const measured = results.filter(
    (result): result is Extract<DimensionResult, { kind: 'measured' }> =>
      /*
       * Sofort-Achsen (D-026) bleiben draußen — nicht weil sie weniger
       * zählen, sondern weil sie anderes zählen: Eine Sofort-Quote mit einer
       * Wiedersehens-Quote zu vergleichen und das Ergebnis „am schwächsten“
       * zu nennen wäre ein Vergleich zweier Währungen (R-1). Der Schwerpunkt
       * bleibt eine Aussage über das Behalten.
       */
      result.kind === 'measured' && !isImmediate(result.id),
  )
  if (measured.length < 2) return undefined

  const sorted = [...measured].sort((a, b) => a.rate - b.rate)
  const low = sorted[0] as Extract<DimensionResult, { kind: 'measured' }>
  const next = sorted[1] as Extract<DimensionResult, { kind: 'measured' }>
  return low.high < next.low ? low.id : undefined
}
