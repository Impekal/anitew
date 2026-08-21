import {
  optimizerHistoriesOf,
  optimizerReturnCount,
  shouldOptimizeParameters,
  type MemorySchedulerWeights,
  type OptimizerItemHistory,
  type SchedulerReviewFact,
} from '../core/index.ts'
import { db } from './db.ts'
import {
  loadLastOptimizedReturnCount,
  saveLastOptimizedReturnCount,
  saveOptimizedSchedulerWeights,
} from './schedulerWeights.ts'

export type SchedulerPersonalizationOptimizationResult =
  | { readonly status: 'not-due'; readonly returnCount: number }
  | {
      readonly status: 'optimized'
      readonly returnCount: number
      readonly weights: MemorySchedulerWeights
    }
  | { readonly status: 'runtime-unavailable'; readonly returnCount: number }
  | { readonly status: 'optimizer-failed'; readonly returnCount: number }

export interface SchedulerPersonalizationPorts {
  readonly loadFacts: () => Promise<readonly SchedulerReviewFact[]>
  readonly loadLastOptimizedReturnCount: () => Promise<number | undefined>
  readonly optimizeDue: (
    histories: readonly OptimizerItemHistory[],
    lastOptimizedReturnCount: number | undefined,
  ) => Promise<SchedulerPersonalizationOptimizationResult>
  readonly saveWeights: (weights: MemorySchedulerWeights) => Promise<unknown>
  readonly saveLastOptimizedReturnCount: (returnCount: number) => Promise<unknown>
}

async function loadVerifiedFacts(): Promise<SchedulerReviewFact[]> {
  const rows = await db.events
    .filter(
      (event) =>
        event.kind === 'answered' &&
        event.correct !== undefined &&
        event.schedulerItemId !== undefined &&
        event.schedulerDay !== undefined,
    )
    .toArray()

  return rows
    .sort((a, b) => a.at - b.at || (a.id ?? 0) - (b.id ?? 0))
    .map((event) => ({
      itemId: event.schedulerItemId as string,
      day: event.schedulerDay as SchedulerReviewFact['day'],
      recalled: event.correct === true,
    }))
}

const defaultPorts: SchedulerPersonalizationPorts = {
  loadFacts: loadVerifiedFacts,
  loadLastOptimizedReturnCount,
  optimizeDue: async (histories, lastOptimizedReturnCount) => {
    const returnCount = optimizerReturnCount(histories)
    if (!shouldOptimizeParameters(returnCount, lastOptimizedReturnCount)) {
      return { status: 'not-due', returnCount }
    }

    // Only a genuinely due threshold loads the public-beta WASI chunk.
    const { optimizeBrowserFsrsWeightsIfDue } = await import(
      '../platform/web/fsrsOptimizerWasi.ts'
    )
    return optimizeBrowserFsrsWeightsIfDue(histories, lastOptimizedReturnCount)
  },
  saveWeights: saveOptimizedSchedulerWeights,
  saveLastOptimizedReturnCount,
}

/**
 * Complete verified-history -> optimization -> persistence cycle.
 * Only successful, already validated optimizer output reaches storage.
 */
export async function runSchedulerPersonalizationCycle(
  ports: SchedulerPersonalizationPorts = defaultPorts,
): Promise<SchedulerPersonalizationOptimizationResult> {
  const histories = optimizerHistoriesOf(await ports.loadFacts())
  const lastOptimizedReturnCount = await ports.loadLastOptimizedReturnCount()
  const result = await ports.optimizeDue(histories, lastOptimizedReturnCount)

  if (result.status === 'optimized') {
    await ports.saveWeights(result.weights)
    await ports.saveLastOptimizedReturnCount(result.returnCount)
  }

  return result
}

let activeRefresh: Promise<void> | undefined

/**
 * Best-effort background refresh after a real scheduling write.
 * Failures never escape into recordOutcome, so the previous scheduler remains
 * authoritative if runtime, WASM, optimizer, validation or storage fails.
 */
export function refreshSchedulerPersonalization(): Promise<void> {
  if (activeRefresh !== undefined) return activeRefresh

  activeRefresh = runSchedulerPersonalizationCycle()
    .then(() => undefined)
    .catch(() => undefined)
    .finally(() => {
      activeRefresh = undefined
    })

  return activeRefresh
}
