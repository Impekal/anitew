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

/** Form, die sich ohne Browser/WASM testen und später 1:1 ins Binding übersetzen lässt. */
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
 * Nur eine Fortschrittszahl für die technische Entscheidung, nicht für die UI.
 * Anki/FSRS kann heute auch kleine Datenmengen optimieren; ANITEW startet
 * trotzdem nicht bei der ersten Handvoll Antworten. 100 belegbare Tagesreviews
 * ist ein konservativer Produkt-Gate und zugleich der erste Verdopplungspunkt,
 * den die aktuelle FSRS-FAQ für Re-Optimierung nennt.
 */
export const MIN_OPTIMIZER_REVIEWS = 100

export function optimizerReviewCount(histories: readonly OptimizerItemHistory[]): number {
  return histories.reduce((total, history) => total + history.reviews.length, 0)
}

export function hasEnoughOptimizerHistory(histories: readonly OptimizerItemHistory[]): boolean {
  return optimizerReviewCount(histories) >= MIN_OPTIMIZER_REVIEWS
}
