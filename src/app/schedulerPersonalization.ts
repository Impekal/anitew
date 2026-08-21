import {
  optimizerHistoriesOf,
  type MemorySchedulerWeights,
  type OptimizerItemHistory,
  type SchedulerReviewFact,
} from '../core/index.ts'
import {
  loadLastOptimizedReturnCount,
  saveLastOptimizedReturnCount,
  saveOptimizedSchedulerWeights,
} from '../data/schedulerWeights.ts'
import { loadSchedulerReviewFacts } from '../data/sessions.ts'

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
  readonly optimize: (
    histories: readonly OptimizerItemHistory[],
    lastOptimizedReturnCount: number | undefined,
  ) => Promise<SchedulerPersonalizationOptimizationResult>
  readonly saveWeights: (weights: MemorySchedulerWeights) => Promise<unknown>
  readonly saveLastOptimizedReturnCount: (returnCount: number) => Promise<unknown>
}

const defaultPorts: SchedulerPersonalizationPorts = {
  loadFacts: loadSchedulerReviewFacts,
  loadLastOptimizedReturnCount,
  optimize: async (histories, lastOptimizedReturnCount) => {
    // Keep the heavy public-beta WASI runtime out of the ordinary startup path.
    // It is loaded only after a real scheduler answer asks for personalization.
    const { optimizeBrowserFsrsWeightsIfDue } = await import(
      '../platform/web/fsrsOptimizerWasi.ts'
    )
    return optimizeBrowserFsrsWeightsIfDue(histories, lastOptimizedReturnCount)
  },
  saveWeights: saveOptimizedSchedulerWeights,
  saveLastOptimizedReturnCount,
}

/**
 * One complete C10 personalization cycle over verified local history.
 *
 * Only an `optimized` result can reach storage. Runtime/WASM/optimizer failures
 * and not-due histories leave both the persisted weights and cadence marker
 * untouched, so the existing scheduler keeps running unchanged.
 */
export async function runSchedulerPersonalizationCycle(
  ports: SchedulerPersonalizationPorts = defaultPorts,
): Promise<SchedulerPersonalizationOptimizationResult> {
  const histories = optimizerHistoriesOf(await ports.loadFacts())
  const lastOptimizedReturnCount = await ports.loadLastOptimizedReturnCount()
  const result = await ports.optimize(histories, lastOptimizedReturnCount)

  if (result.status === 'optimized') {
    // Persist validated weights first. If storage fails, do not consume the
    // cadence threshold: a later safe retry remains possible.
    await ports.saveWeights(result.weights)
    await ports.saveLastOptimizedReturnCount(result.returnCount)
  }

  return result
}

let activeRefresh: Promise<void> | undefined

/** Deduplicate overlapping recall blocks while a local optimization is running. */
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
