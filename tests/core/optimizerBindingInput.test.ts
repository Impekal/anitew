import { describe, expect, it } from 'vitest'
import { fsrsBindingInputsOf } from '../../src/core/scheduler/optimizerBindingInput.ts'

describe('FSRS binding input contract', () => {
  it('preserves verified ratings and day deltas without inventing Hard/Easy', () => {
    expect(
      fsrsBindingInputsOf([
        {
          itemId: 'faces:de:ada',
          reviews: [
            { rating: 3, deltaDays: 0 },
            { rating: 1, deltaDays: 4 },
            { rating: 3, deltaDays: 2 },
          ],
        },
      ]),
    ).toEqual([
      {
        itemId: 'faces:de:ada',
        reviews: [
          [3, 0],
          [1, 4],
          [3, 2],
        ],
      },
    ])
  })

  it('does not reorder histories or reviews', () => {
    const input = [
      { itemId: 'b', reviews: [{ rating: 1 as const, deltaDays: 8 }] },
      { itemId: 'a', reviews: [{ rating: 3 as const, deltaDays: 0 }] },
    ]

    expect(fsrsBindingInputsOf(input).map((item) => item.itemId)).toEqual(['b', 'a'])
  })
})
