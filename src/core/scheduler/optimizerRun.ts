import { optimizerReturnCount, type OptimizerItemHistory } from './optimizerHistory.ts'
import { shouldOptimizeParameters } from './optimizerCadence.ts'
import {
  requireValidMemorySchedulerWeights,
  type MemorySchedulerWeights,
} from './optimizedWeights.ts'

/** Runtime-independent port for the expensive local FSRS optimizer. */
export interface SchedulerOptimizerPort {
  optimize(histories: readonly OptimizerItemHistory[]): Promise<unknown>
}

export type OptimizerRunResult =
  | { readonly status: 'not-due'; readonly returnCount: number }
  | {
      readonly status: 'optimized'
      readonly returnCount: number
      readonly weights: MemorySchedulerWeights
    }

/**
 * Single policy gate between verified history and any optimizer runtime.
 *
 * The browser/WASI adapter may be slow or unavailable, but it never decides
 * whether enough personal evidence exists and its output never reaches storage
 * or scheduling without the same FSRS validation boundary used on reads.
 */
export async function optimizeSchedulerWeightsIfDue(
  histories: readonly OptimizerItemHistory[],
  lastOptimizedReturnCount: number | undefined,
  optimizer: SchedulerOptimizerPort,
): Promise<OptimizerRunResult> {
  const returnCount = optimizerReturnCount(histories)
  if (!shouldOptimizeParameters(returnCount, lastOptimizedReturnCount)) {
    return { status: 'not-due', returnCount }
  }

  const candidate = await optimizer.optimize(histories)
  return {
    status: 'optimized',
    returnCount,
    weights: requireValidMemorySchedulerWeights(candidate),
  }
}
