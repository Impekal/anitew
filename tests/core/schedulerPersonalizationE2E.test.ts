import { generatorParameters } from 'ts-fsrs'
import { describe, expect, it } from 'vitest'

import {
  newMemory,
  optimizerReturnCount,
  requireValidMemorySchedulerWeights,
  type MemorySchedulerWeights,
  type SchedulerReviewFact,
} from '../../src/core/index.ts'
import {
  runSchedulerPersonalizationCycle,
  type SchedulerPersonalizationPorts,
} from '../../src/data/schedulerPersonalization.ts'

function dayAfter(offset: number): SchedulerReviewFact['day'] {
  const at = new Date(Date.UTC(2026, 0, 1 + offset))
  const year = at.getUTCFullYear().toString().padStart(4, '0')
  const month = (at.getUTCMonth() + 1).toString().padStart(2, '0')
  const day = at.getUTCDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

describe('C10 end-to-end personalization wiring', () => {
  it('verified history optimizes, persists, and the persisted weights affect later scheduling', async () => {
    const facts: SchedulerReviewFact[] = Array.from({ length: 101 }, (_, index) => ({
      itemId: 'words:de:anker',
      day: dayAfter(index),
      recalled: index % 5 !== 0,
    }))

    const candidate = [...generatorParameters().w]
    candidate[2] = (candidate[2] ?? 1) * 1.1
    const validatedCandidate = requireValidMemorySchedulerWeights(candidate)

    let persistedWeights: MemorySchedulerWeights | undefined
    let persistedReturnCount: number | undefined

    const ports: SchedulerPersonalizationPorts = {
      loadFacts: async () => facts,
      loadLastOptimizedReturnCount: async () => undefined,
      optimizeDue: async (histories) => {
        expect(optimizerReturnCount(histories)).toBe(100)
        return {
          status: 'optimized',
          returnCount: 100,
          weights: validatedCandidate,
        }
      },
      saveWeights: async (weights) => {
        persistedWeights = weights
      },
      saveLastOptimizedReturnCount: async (returnCount) => {
        persistedReturnCount = returnCount
      },
    }

    await expect(runSchedulerPersonalizationCycle(ports)).resolves.toMatchObject({
      status: 'optimized',
      returnCount: 100,
    })
    expect(persistedWeights).toEqual(validatedCandidate)
    expect(persistedReturnCount).toBe(100)

    // This is the same core call recordOutcome uses after loading persisted
    // weights. A later new item therefore schedules with the learned vector,
    // not with the global defaults.
    const standard = newMemory('2026-05-01', true)
    const personalized = newMemory('2026-05-01', true, persistedWeights)
    expect(personalized.stability).not.toBe(standard.stability)
  })

  it('does not persist anything when runtime/optimizer fails', async () => {
    let writes = 0
    const ports: SchedulerPersonalizationPorts = {
      loadFacts: async () => [],
      loadLastOptimizedReturnCount: async () => undefined,
      optimizeDue: async () => ({ status: 'optimizer-failed', returnCount: 100 }),
      saveWeights: async () => {
        writes += 1
      },
      saveLastOptimizedReturnCount: async () => {
        writes += 1
      },
    }

    await expect(runSchedulerPersonalizationCycle(ports)).resolves.toEqual({
      status: 'optimizer-failed',
      returnCount: 100,
    })
    expect(writes).toBe(0)
  })
})
