import { describe, expect, it } from 'vitest'

import { longestRecalledNumber } from '../../src/core/progress/numberRecord.ts'

describe('K5 longest recalled number', () => {
  it('uses only actual correct number-module recall facts', () => {
    expect(
      longestRecalledNumber([
        { module: 'numbers', itemId: '314', correct: true },
        { module: 'numbers', itemId: '27182', correct: false },
        { module: 'words', itemId: '123456789', correct: true },
        { module: 'numbers', itemId: '007531', correct: true },
        { module: 'numbers', itemId: '12 34', correct: true },
      ]),
    ).toEqual({ digits: 6, itemId: '007531' })
  })

  it('does not invent a record without a verified correct number recall', () => {
    expect(
      longestRecalledNumber([
        { module: 'numbers', itemId: '123456', correct: false },
        { module: 'numbers', itemId: 'not-a-number', correct: true },
      ]),
    ).toBeUndefined()
  })

  it('keeps the first fact when equal-length records tie', () => {
    expect(
      longestRecalledNumber([
        { module: 'numbers', itemId: '12345', correct: true },
        { module: 'numbers', itemId: '67890', correct: true },
      ]),
    ).toEqual({ digits: 5, itemId: '12345' })
  })
})
