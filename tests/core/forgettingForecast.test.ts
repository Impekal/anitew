import { describe, expect, it } from 'vitest'

import {
  MEMORY_ID_SEPARATOR,
  MEMORY_ITEM_SEPARATOR,
  MIN_PERSONAL_FORECAST_REVIEWS,
  memoryForgettingForecasts,
  type DueItem,
  type Memory,
} from '../../src/core/index.ts'

function memory(reviews: number, dueDay: string): Memory {
  return {
    stability: 4,
    difficulty: 5,
    reviews,
    lapses: 0,
    state: 2,
    lastDay: '2026-08-20',
    dueDay,
  }
}

function memoryItem(nodeId: string, reviews: number, dueDay: string): DueItem {
  const payload = `Daniel${MEMORY_ITEM_SEPARATOR}Berlin${MEMORY_ID_SEPARATOR}person:daniel${MEMORY_ID_SEPARATOR}${nodeId}`
  return { itemId: `memory:de:${payload}`, memory: memory(reviews, dueDay) }
}

describe('C3 — persönliche Vergessensprognose', () => {
  it('bleibt still, solange ein Item noch nicht drei echte Wiedersehen hatte', () => {
    const result = memoryForgettingForecasts([
      memoryItem('place:berlin', MIN_PERSONAL_FORECAST_REVIEWS - 1, '2026-08-27'),
    ])
    expect(result.size).toBe(0)
  })

  it('zeigt danach exakt das FSRS-Intervall bis zur 90%-Schwelle', () => {
    const result = memoryForgettingForecasts([
      memoryItem('place:berlin', MIN_PERSONAL_FORECAST_REVIEWS, '2026-08-27'),
    ])
    expect(result.get('place:berlin')).toEqual({
      days: 7,
      reviews: MIN_PERSONAL_FORECAST_REVIEWS,
    })
  })

  it('nimmt bei mehreren Beziehungen desselben Knotens die früheste belastbare Schwelle', () => {
    const result = memoryForgettingForecasts([
      memoryItem('place:berlin', 6, '2026-09-02'),
      memoryItem('place:berlin', 5, '2026-08-25'),
    ])
    expect(result.get('place:berlin')).toEqual({ days: 5, reviews: 5 })
  })

  it('mischt keine anderen Module in die persönliche Memory-Prognose', () => {
    const result = memoryForgettingForecasts([
      { itemId: 'words:de:Anker', memory: memory(9, '2026-08-30') },
    ])
    expect(result.size).toBe(0)
  })
})
