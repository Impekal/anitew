import { describe, expect, it } from 'vitest'

import {
  MEMORY_ID_SEPARATOR,
  MEMORY_ITEM_SEPARATOR,
  memoryReviewDays,
  type DueItem,
} from '../../src/core/index.ts'

function scheduled(targetId: string, dueDay: string, subjectId = 'person:daniel'): DueItem {
  const payload = `Daniel${MEMORY_ITEM_SEPARATOR}Madrid${MEMORY_ID_SEPARATOR}${subjectId}${MEMORY_ID_SEPARATOR}${targetId}`
  return {
    itemId: `memory:de:${payload}`,
    memory: {
      stability: 2,
      difficulty: 5,
      reviews: 1,
      lapses: 0,
      state: 2,
      lastDay: '2026-08-20',
      dueDay,
    },
  }
}

describe('memoryReviewDays', () => {
  it('nimmt bei mehreren Beziehungen zum selben Knoten den frühesten echten FSRS-Termin', () => {
    const schedule = memoryReviewDays([
      scheduled('place:madrid', '2026-08-29'),
      scheduled('place:madrid', '2026-08-24', 'person:mira'),
    ])

    expect(schedule.get('place:madrid')).toBe('2026-08-24')
  })

  it('ignoriert fremde Module selbst dann, wenn ihr Text zufällig die Memory-Trennzeichen enthält', () => {
    const fake = scheduled('place:madrid', '2026-08-21')
    const schedule = memoryReviewDays([{ ...fake, itemId: fake.itemId.replace('memory:', 'facts:') }])
    expect(schedule.size).toBe(0)
  })

  it('rät bei alten ID-losen Memory-Terminen keinen Knoten per Label', () => {
    const item = scheduled('place:madrid', '2026-08-21')
    const legacy: DueItem = {
      ...item,
      itemId: `memory:de:Daniel${MEMORY_ITEM_SEPARATOR}Madrid`,
    }
    expect(memoryReviewDays([legacy]).size).toBe(0)
  })
})
