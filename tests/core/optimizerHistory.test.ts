import { describe, expect, it } from 'vitest'

import {
  MIN_OPTIMIZER_RETURNS,
  hasEnoughOptimizerHistory,
  optimizerHistoriesOf,
  optimizerReturnCount,
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

  it('zählt Erstkontakte ausdrücklich nicht als persönliche Wiedersehen', () => {
    const onlyFirstContacts = optimizerHistoriesOf(
      Array.from({ length: MIN_OPTIMIZER_RETURNS + 20 }, (_, index) => ({
        itemId: `words:de:first-${index}`,
        day: '2026-08-20' as const,
        recalled: true,
      })),
    )

    expect(optimizerReturnCount(onlyFirstContacts)).toBe(0)
    expect(hasEnoughOptimizerHistory(onlyFirstContacts)).toBe(false)
  })

  it('aktiviert Optimierung erst ab genügend zeitversetzten Wiedersehen', () => {
    const facts = (returns: number): SchedulerReviewFact[] => {
      const result: SchedulerReviewFact[] = []
      for (let index = 0; index < returns; index++) {
        const itemId = `words:de:item-${index}`
        result.push({ itemId, day: '2026-08-20', recalled: true })
        result.push({ itemId, day: '2026-08-21', recalled: index % 2 === 0 })
      }
      return result
    }

    const below = optimizerHistoriesOf(facts(MIN_OPTIMIZER_RETURNS - 1))
    const enough = optimizerHistoriesOf(facts(MIN_OPTIMIZER_RETURNS))

    expect(optimizerReturnCount(below)).toBe(MIN_OPTIMIZER_RETURNS - 1)
    expect(hasEnoughOptimizerHistory(below)).toBe(false)
    expect(hasEnoughOptimizerHistory(enough)).toBe(true)
  })
})
