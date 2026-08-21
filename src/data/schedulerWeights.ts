import {
  requireValidMemorySchedulerWeights,
  validatedMemorySchedulerWeights,
  type MemorySchedulerWeights,
} from '../core/index.ts'
import { db } from './db.ts'

const OPTIMIZED_WEIGHTS_KEY = 'scheduler.fsrs.optimizedWeights.v1'
const LAST_OPTIMIZED_RETURN_COUNT_KEY = 'scheduler.fsrs.lastOptimizedReturnCount.v1'

/**
 * Read learned FSRS weights from local storage. Invalid or stale payloads are
 * ignored rather than allowed to affect scheduling.
 */
export async function loadOptimizedSchedulerWeights(): Promise<MemorySchedulerWeights | undefined> {
  const row = await db.settings.get(OPTIMIZED_WEIGHTS_KEY)
  return validatedMemorySchedulerWeights(row?.value)
}

/** Persist only output that passes the same FSRS validation as the scheduler. */
export async function saveOptimizedSchedulerWeights(value: unknown): Promise<MemorySchedulerWeights> {
  const weights = requireValidMemorySchedulerWeights(value)
  await db.settings.put({ key: OPTIMIZED_WEIGHTS_KEY, value: [...weights] })
  return weights
}

/**
 * Number of verified time-separated returns consumed by the last successful
 * optimizer run. This is a technical cadence marker, never a user score.
 */
export async function loadLastOptimizedReturnCount(): Promise<number | undefined> {
  const row = await db.settings.get(LAST_OPTIMIZED_RETURN_COUNT_KEY)
  const value = row?.value
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : undefined
}

export async function saveLastOptimizedReturnCount(value: number): Promise<void> {
  if (!Number.isInteger(value) || value < 0) throw new RangeError('Invalid optimizer return count')
  await db.settings.put({ key: LAST_OPTIMIZED_RETURN_COUNT_KEY, value })
}

/** Reset personalization without touching review history or other settings. */
export async function clearOptimizedSchedulerWeights(): Promise<void> {
  await db.transaction('rw', db.settings, async () => {
    await db.settings.delete(OPTIMIZED_WEIGHTS_KEY)
    await db.settings.delete(LAST_OPTIMIZED_RETURN_COUNT_KEY)
  })
}
