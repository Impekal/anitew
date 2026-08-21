import {
  requireValidMemorySchedulerWeights,
  validatedMemorySchedulerWeights,
  type MemorySchedulerWeights,
} from '../core/index.ts'
import { db } from './db.ts'

const OPTIMIZED_WEIGHTS_KEY = 'scheduler.fsrs.optimizedWeights.v1'

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

/** Reset personalization without touching review history or other settings. */
export async function clearOptimizedSchedulerWeights(): Promise<void> {
  await db.settings.delete(OPTIMIZED_WEIGHTS_KEY)
}
