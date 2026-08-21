import { type DayKey, daysBetween } from '../time.ts'

/**
 * Eine belegbare FSRS-Antwort aus dem lokalen Ereignisprotokoll.
 *
 * Die Kennung ist absichtlich bereits die vollständige Scheduler-ID
 * (`modul:sprache:item`). C10 darf ältere, unvollständige Ereignisse nicht
 * rückwirkend erraten: Ohne diese ID gehört eine Zeile nicht ins Training.
 */
export interface SchedulerReviewFact {
  readonly itemId: string
  readonly day: DayKey
  readonly recalled: boolean
}

/** Form, die sich ohne Browser/WASM testen und später ins Binding übersetzen lässt. */
export interface OptimizerReview {
  /** FSRS: 1 = Again, 3 = Good. ANITEW misst binär und erfindet kein Hard/Easy. */
  readonly rating: 1 | 3
  /** Tage seit der vorherigen berücksichtigten Antwort dieses Items. */
  readonly deltaDays: number
}

export interface OptimizerItemHistory {
  readonly itemId: string
  readonly reviews: readonly OptimizerReview[]
}

/**
 * Bereitet ANITEWs binäre, tagesbasierte Rohhistorie für den FSRS-Optimizer vor.
 *
 * Regeln:
 * - vollständig deterministisch;
 * - je Item höchstens eine Antwort pro Tag (die chronologisch erste Eingabe
 *   in `facts` gewinnt, wie beim offiziellen FSRS-Preprocessing);
 * - erste Antwort hat `deltaDays = 0`;
 * - richtig = Good (3), falsch = Again (1); niemals erfundene Zwischenratings;
 * - Items werden stabil nach Kennung sortiert, damit identische Daten identische
 *   Optimizer-Eingaben ergeben.
 */
export function optimizerHistoriesOf(
  facts: readonly SchedulerReviewFact[],
): readonly OptimizerItemHistory[] {
  const grouped = new Map<string, { fact: SchedulerReviewFact; order: number }[]>()

  facts.forEach((fact, order) => {
    if (fact.itemId.length === 0) return
    const bucket = grouped.get(fact.itemId) ?? []
    bucket.push({ fact, order })
    grouped.set(fact.itemId, bucket)
  })

  return [...grouped.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([itemId, rows]) => {
      const ordered = [...rows].sort((a, b) => {
        const day = a.fact.day.localeCompare(b.fact.day)
        return day === 0 ? a.order - b.order : day
      })

      const seenDays = new Set<DayKey>()
      const unique = ordered.filter(({ fact }) => {
        if (seenDays.has(fact.day)) return false
        seenDays.add(fact.day)
        return true
      })

      let previous: DayKey | undefined
      const reviews = unique.map(({ fact }) => {
        const deltaDays = previous === undefined ? 0 : Math.max(0, daysBetween(previous, fact.day))
        previous = fact.day
        return {
          rating: fact.recalled ? (3 as const) : (1 as const),
          deltaDays,
        }
      })

      return { itemId, reviews }
    })
    .filter((history) => history.reviews.length > 0)
}

/**
 * Technischer Sicherheits-Gate, nicht Nutzer-Score.
 *
 * Moderne FSRS-Versionen können auch kleine Datenmengen optimieren. Für ANITEW
 * genügt aber nicht, dass viele Dinge einmal gezeigt wurden: Personalisierung
 * soll erst einsetzen, wenn genügend **zeitversetzte Wiedersehen** vorliegen.
 * Ein Review mit `deltaDays > 0` enthält genau dieses persönliche Signal.
 *
 * 100 ist bewusst konservativ und entspricht zugleich dem ersten in der
 * aktuellen FSRS-FAQ genannten Verdopplungspunkt (100, 200, 400, …) für
 * Re-Optimierung. Bis dahin bleiben die breit trainierten Standardparameter.
 */
export const MIN_OPTIMIZER_RETURNS = 100

export function optimizerReturnCount(histories: readonly OptimizerItemHistory[]): number {
  return histories.reduce(
    (total, history) =>
      total + history.reviews.filter((review) => review.deltaDays > 0).length,
    0,
  )
}

export function hasEnoughOptimizerHistory(histories: readonly OptimizerItemHistory[]): boolean {
  return optimizerReturnCount(histories) >= MIN_OPTIMIZER_RETURNS
}
