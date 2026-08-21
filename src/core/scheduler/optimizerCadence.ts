import { MIN_OPTIMIZER_RETURNS } from './optimizerHistory.ts'

/**
 * Return counts at which ANITEW may retrain personalized FSRS parameters.
 *
 * This is an internal execution cadence, never a user-facing score. The first
 * optimization is allowed at the existing evidence gate (100 verified
 * delayed reviews). Afterwards the threshold doubles: 200, 400, 800, ...
 * That keeps expensive local training rare while ensuring that substantially
 * more personal evidence can replace older parameters.
 */
export function optimizerThresholdAtOrBelow(returnCount: number): number | undefined {
  if (!Number.isFinite(returnCount) || returnCount < MIN_OPTIMIZER_RETURNS) return undefined

  let threshold = MIN_OPTIMIZER_RETURNS
  while (threshold * 2 <= returnCount) threshold *= 2
  return threshold
}

/**
 * True exactly when the current verified history has crossed a retraining
 * threshold that has not already been consumed.
 *
 * `lastOptimizedReturnCount` is metadata about the previous optimizer run, not
 * a reconstructed memory metric. Passing undefined means no personalized
 * optimization has run yet.
 */
export function shouldOptimizeParameters(
  returnCount: number,
  lastOptimizedReturnCount?: number,
): boolean {
  const currentThreshold = optimizerThresholdAtOrBelow(returnCount)
  if (currentThreshold === undefined) return false

  const previousThreshold =
    lastOptimizedReturnCount === undefined
      ? undefined
      : optimizerThresholdAtOrBelow(lastOptimizedReturnCount)

  return previousThreshold === undefined || currentThreshold > previousThreshold
}
