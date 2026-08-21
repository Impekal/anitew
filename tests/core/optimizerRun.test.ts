import { generatorParameters } from 'ts-fsrs'
import { describe, expect, it, vi } from 'vitest'

import {
  optimizeSchedulerWeightsIfDue,
  type OptimizerItemHistory,
} from '../../src/core/index.ts'

function historyWithReturns(count: number): readonly OptimizerItemHistory[] {
  return [{
    itemId: 'words:de:test',
    reviews: [
      { rating: 3, deltaDays: 0 },
      ...Array.from({ length: count }, () => ({ rating: 3 as const, deltaDays: 1 })),
    ],
  }]
}

describe('C10 optimizer orchestration', () => {
  it('does not invoke the expensive runtime before the verified evidence gate', async () => {
    const optimize = vi.fn(async () => generatorParameters().w)
    const result = await optimizeSchedulerWeightsIfDue(historyWithReturns(99), undefined, { optimize })

    expect(result).toEqual({ status: 'not-due', returnCount: 99 })
    expect(optimize).not.toHaveBeenCalled()
  })

  it('runs exactly when a new cadence threshold is due and validates the result', async () => {
    const weights = generatorParameters().w
    const optimize = vi.fn(async () => [...weights])
    const result = await optimizeSchedulerWeightsIfDue(historyWithReturns(200), 100, { optimize })

    expect(optimize).toHaveBeenCalledTimes(1)
    expect(result.status).toBe('optimized')
    if (result.status === 'optimized') {
      expect(result.returnCount).toBe(200)
      expect(result.weights).toEqual(weights)
      expect(Object.isFrozen(result.weights)).toBe(true)
    }
  })

  it('does not rerun inside an already consumed threshold bucket', async () => {
    const optimize = vi.fn(async () => generatorParameters().w)
    const result = await optimizeSchedulerWeightsIfDue(historyWithReturns(399), 200, { optimize })

    expect(result).toEqual({ status: 'not-due', returnCount: 399 })
    expect(optimize).not.toHaveBeenCalled()
  })

  it('rejects malformed runtime output before it can reach persistence', async () => {
    await expect(
      optimizeSchedulerWeightsIfDue(historyWithReturns(100), undefined, {
        optimize: async () => [1, 2, 3],
      }),
    ).rejects.toThrow(RangeError)
  })
})
