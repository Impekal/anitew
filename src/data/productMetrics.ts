import { loadMemoryGraph } from './memoryStore.ts'
import { db } from './db.ts'

export interface ProductMetricsReport {
  readonly schema: 2
  readonly completedSessions: number
  readonly trainingDays: number
  readonly firstTrainingDay?: string
  readonly lastTrainingDay?: string
  readonly sessionsPerTrainingDay?: number
  /** Abstände in Kalendertagen vom ersten Trainingstag zu allen Rückkehrtagen. */
  readonly returnOffsets: readonly number[]
  readonly answeredItems: number
  readonly correctItems: number
  readonly recallRate?: number
  readonly completedBenchmarks: number
  readonly personalMemoryNodes: number
  readonly personalMemoryConnections: number
  readonly moduleAnswers: Readonly<Record<string, number>>
}

function dayNumber(day: string): number | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day)
  if (match === null) return undefined
  const year = Number(match[1])
  const month = Number(match[2])
  const date = Number(match[3])
  if (![year, month, date].every(Number.isFinite)) return undefined
  return Math.floor(Date.UTC(year, month - 1, date) / 86_400_000)
}

/**
 * Aggregierte Produktmetriken für freiwillige Beta-Berichte.
 *
 * Es werden ausschließlich Zählwerte und Trainingstage aus der lokalen
 * Datenbank berechnet. Keine Wörter, Namen, Antworten, persönlichen
 * Erinnerungstexte oder Item-IDs verlassen diese Funktion. Es gibt außerdem
 * keinen Upload: Der Nutzer muss den Bericht ausdrücklich als Datei exportieren.
 *
 * `returnOffsets` vermeidet vorschnelle D1/D7-Behauptungen: Der Auswerter sieht
 * exakt, an welchen Abständen jemand wirklich zurückkam. Wer erst drei Tage
 * dabei ist, wird dadurch nicht fälschlich als D7-Abbruch gezählt.
 */
export async function loadProductMetrics(): Promise<ProductMetricsReport> {
  const [sessions, events, benchmarks, memoryGraph] = await Promise.all([
    db.sessions.toArray().catch(() => []),
    db.events.toArray().catch(() => []),
    db.benchmarks.toArray().catch(() => []),
    loadMemoryGraph(),
  ])

  const completed = sessions.filter((session) => session.completed)
  const days = [...new Set(completed.map((session) => session.day))].sort()
  const firstDayNumber = days[0] === undefined ? undefined : dayNumber(days[0])
  const returnOffsets =
    firstDayNumber === undefined
      ? []
      : days
          .slice(1)
          .map(dayNumber)
          .filter((day): day is number => day !== undefined)
          .map((day) => day - firstDayNumber)
          .filter((offset) => offset > 0)

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
    schema: 2,
    completedSessions: completed.length,
    trainingDays: days.length,
    ...(days[0] === undefined ? {} : { firstTrainingDay: days[0] }),
    ...(days.at(-1) === undefined ? {} : { lastTrainingDay: days.at(-1) }),
    ...(days.length === 0
      ? {}
      : { sessionsPerTrainingDay: Math.round((completed.length / days.length) * 100) / 100 }),
    returnOffsets,
    answeredItems: answered.length,
    correctItems: correct,
    ...(answered.length === 0
      ? {}
      : { recallRate: Math.round((correct / answered.length) * 1000) / 1000 }),
    completedBenchmarks: benchmarks.filter(
      (benchmark) => benchmark.completed && benchmark.abandoned !== true,
    ).length,
    personalMemoryNodes: memoryGraph.nodes.length,
    personalMemoryConnections: memoryGraph.edges.length,
    moduleAnswers,
  }
}
