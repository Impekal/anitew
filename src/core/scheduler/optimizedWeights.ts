import { checkParameters } from 'ts-fsrs'

import type { MemorySchedulerWeights } from './memory.ts'
export type { MemorySchedulerWeights } from './memory.ts'

/**
 * Persisted optimizer output is untrusted data: it may come from an older app
 * build, a partial write, or a future binding version. Normalize it before it
 * can reach the scheduler.
 */
export function validatedMemorySchedulerWeights(value: unknown): MemorySchedulerWeights | undefined {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== 'number' || !Number.isFinite(entry))) {
    return undefined
  }

  try {
    return Object.freeze([...checkParameters(value)])
  } catch {
    return undefined
  }
}

/** Only validated optimizer output is eligible for persistence. */
export function requireValidMemorySchedulerWeights(value: unknown): MemorySchedulerWeights {
  const weights = validatedMemorySchedulerWeights(value)
  if (weights === undefined) throw new RangeError('Invalid FSRS optimizer weights')
  return weights
}
