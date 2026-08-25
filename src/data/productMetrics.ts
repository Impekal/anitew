import { db } from './db.ts'

export interface ProductMetricsReport {
  readonly schema: 1
  readonly completedSessions: number
  readonly trainingDays: number
  readonly firstTrainingDay?: string
  readonly lastTrainingDay?: string
  readonly answeredItems: number
  readonly correctItems: number
  readonly recallRate?: number
  readonly completedBenchmarks: number
  readonly moduleAnswers: Readonly<Record<string, number>>
}

/**
 * Aggregierte Produktmetriken für freiwillige Beta-Berichte.
 *
 * Es werden ausschließlich Zählwerte aus der lokalen Datenbank berechnet.
 * Keine Wörter, Namen, Antworten, persönlichen Erinnerungen oder Item-IDs
 * verlassen diese Funktion. Es gibt außerdem keinen Upload: Der Nutzer muss
 * den Bericht später ausdrücklich als Datei exportieren.
 */
export async function loadProductMetrics(): Promise<ProductMetricsReport> {
  const [sessions, events, benchmarks] = await Promise.all([
    db.sessions.toArray().catch(() => []),
    db.events.toArray().catch(() => []),
    db.benchmarks.toArray().catch(() => []),
  ])

  const completed = sessions.filter((session) => session.completed)
  const days = [...new Set(completed.map((session) => session.day))].sort()
  const answered = events.filter(
    (event) => event.kind === 'answered' && typeof event.correct === 'boolean',
  )
  const correct = answered.filter((event) => event.correct === true).length
  const moduleCounts = new Map<string, number>()

  for (const event of answered) {
    const moduleId = event.module ?? event.moduleId
    moduleCounts.set(moduleId, (moduleCounts.get(moduleId) ?? 0) + 1)
  }

  const moduleAnswers = Object.fromEntries(
    [...moduleCounts.entries()].sort(([left], [right]) => left.localeCompare(right)),
  )

  return {
    schema: 1,
    completedSessions: completed.length,
    trainingDays: days.length,
    ...(days[0] === undefined ? {} : { firstTrainingDay: days[0] }),
    ...(days.at(-1) === undefined ? {} : { lastTrainingDay: days.at(-1) }),
    answeredItems: answered.length,
    correctItems: correct,
    ...(answered.length === 0
      ? {}
      : { recallRate: Math.round((correct / answered.length) * 1000) / 1000 }),
    completedBenchmarks: benchmarks.filter(
      (benchmark) => benchmark.completed && benchmark.abandoned !== true,
    ).length,
    moduleAnswers,
  }
}
