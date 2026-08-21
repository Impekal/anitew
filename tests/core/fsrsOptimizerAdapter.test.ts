import { describe, expect, it } from 'vitest'

import { createFsrsBindingOptimizer } from '../../src/platform/web/fsrsOptimizerAdapter.ts'
import type { OptimizerItemHistory } from '../../src/core/index.ts'

describe('FSRS browser binding adapter', () => {
  it('preserves measured ratings and day gaps and keeps short-term steps disabled', async () => {
    class Review {
      constructor(
        readonly rating: 1 | 3,
        readonly deltaDays: number,
      ) {}
    }

    class Item {
      constructor(readonly reviews: readonly unknown[]) {}
    }

    const calls: { items: readonly unknown[]; options: unknown }[] = []
    const candidateWeights = Array.from({ length: 19 }, (_, index) => index + 1)
    const optimizer = createFsrsBindingOptimizer({
      FSRSBindingReview: Review,
      FSRSBindingItem: Item,
      computeParameters(items, options) {
        calls.push({ items, options })
        return candidateWeights
      },
    })

    const histories: readonly OptimizerItemHistory[] = [
      {
        itemId: 'words:de:alpha',
        reviews: [
          { rating: 3, deltaDays: 0 },
          { rating: 1, deltaDays: 4 },
          { rating: 3, deltaDays: 9 },
        ],
      },
    ]

    await expect(optimizer.optimize(histories)).resolves.toBe(candidateWeights)
    expect(calls).toHaveLength(1)
    expect(calls[0]?.options).toEqual({
      enableShortTerm: false,
      numRelearningSteps: 0,
    })

    const item = calls[0]?.items[0] as Item
    expect(item.reviews).toEqual([
      new Review(3, 0),
      new Review(1, 4),
      new Review(3, 9),
    ])
  })
})
