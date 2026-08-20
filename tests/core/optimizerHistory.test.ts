import { describe, expect, it } from 'vitest'

import {
  MIN_OPTIMIZER_REVIEWS,
  hasEnoughOptimizerHistory,
  optimizerHistoriesOf,
  optimizerReviewCount,
  type SchedulerReviewFact,
} from '../../src/core/index.ts'

describe('C10 — belegbare Optimizer-Historie', () => {
  it('übersetzt binäre ANITEW-Antworten nur in Again und Good', () => {
    const histories = optimizerHistoriesOf([
      { itemId: 'words:de:Anker', day: '2026-08-20', recalled: false },
      { itemId: 'words:de:Anker', day: '2026-08-24', recalled: true },
      { itemId: 'words:de:Anker', day: '2026-08-31', recalled: true },
    ])

    expect(histories).toEqual([
      {
        itemId: 'words:de:Anker',
        reviews: [
          { rating: 1, deltaDays: 0 },
          { rating: 3, deltaDays: 4 },
          { rating: 3, deltaDays: 7 },
        ],
      },
    ])
  })

  it('nimmt je Item und Tag nur die erste belegbare Antwort', () => {
    const histories = optimizerHistoriesOf([
      { itemId: 'words:de:Anker', day: '2026-08-20', recalled: false },
      { itemId: 'words:de:Anker', day: '2026-08-20', recalled: true },
      { itemId: 'words:de:Anker', day: '2026-08-21', recalled: true },
    ])

    expect(histories[0]?.reviews).toEqual([
      { rating: 1, deltaDays: 0 },
      { rating: 3, deltaDays: 1 },
    ])
  })

  it('sortiert Items und Tage deterministisch, nicht nach Eingabereihenfolge', () => {
    const histories = optimizerHistoriesOf([
      { itemId: 'words:de:Baum', day: '2026-08-23', recalled: true },
      { itemId: 'words:de:Anker', day: '2026-08-22', recalled: true },
      { itemId: 'words:de:Baum', day: '2026-08-20', recalled: false },
    ])

    expect(histories.map((history) => history.itemId)).toEqual([
      'words:de:Anker',
      'words:de:Baum',
    ])
    expect(histories[1]?.reviews).toEqual([
      { rating: 1, deltaDays: 0 },
      { rating: 3, deltaDays: 3 },
    ])
  })

  it('aktiviert Optimierung erst ab dem konservativen C10-Gate', () => {
    const facts = (count: number): SchedulerReviewFact[] =>
      Array.from({ length: count }, (_, index) => ({
        itemId: `words:de:item-${index}`,
        day: '2026-08-20',
        recalled: index % 2 === 0,
      }))

    const below = optimizerHistoriesOf(facts(MIN_OPTIMIZER_REVIEWS - 1))
    const enough = optimizerHistoriesOf(facts(MIN_OPTIMIZER_REVIEWS))

    expect(optimizerReviewCount(below)).toBe(MIN_OPTIMIZER_REVIEWS - 1)
    expect(hasEnoughOptimizerHistory(below)).toBe(false)
    expect(hasEnoughOptimizerHistory(enough)).toBe(true)
  })
})
