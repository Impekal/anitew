import { describe, expect, it } from 'vitest'

import {
  MIN_PERSONAL_FORECAST_REVIEWS,
  MEMORY_ID_SEPARATOR,
  MEMORY_ITEM_SEPARATOR,
  isCognitivelyHeavy,
  memoryForgettingForecasts,
  planSession,
  recordProfileSnapshot,
  type DueItem,
  type Memory,
  type Pools,
} from '../../src/core/index.ts'
import { withoutInterference } from '../../src/core/content/interference.ts'

const pools: Pools = {
  words: Array.from({ length: 40 }, (_, index) => `wort-${index}`),
  faces: [],
  numbers: [],
  missions: ['Elena', 'Mara', 'Jonas', 'Luca', 'Nora', 'Amir', 'Sofia', 'Theo'],
  palace: [],
  reverse: Array.from({ length: 20 }, (_, index) => String(1000 + index)),
  twins: Array.from({ length: 20 }, (_, index) => `paar${index}a%paar${index}b`),
  gaze: [],
  facts: [],
  memory: [], people: [],
}

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

describe('Training Intelligence Final — Paket A', () => {
  it('C3 zeigt eine persönliche Prognose erst nach belastbarer eigener Historie', () => {
    expect(
      memoryForgettingForecasts([
        memoryItem('place:berlin', MIN_PERSONAL_FORECAST_REVIEWS - 1, '2026-08-27'),
      ]).size,
    ).toBe(0)

    expect(
      memoryForgettingForecasts([
        memoryItem('place:berlin', MIN_PERSONAL_FORECAST_REVIEWS, '2026-08-27'),
      ]).get('place:berlin'),
    ).toEqual({ days: 7, reviews: MIN_PERSONAL_FORECAST_REVIEWS })
  })

  it('E4 hält Rohzählungen als Tagesverlauf statt einen erfundenen Score fest', () => {
    const first = recordProfileSnapshot([], '2026-08-20', {
      words: { chances: 20, lost: 5 },
    })
    const updated = recordProfileSnapshot(first, '2026-08-20', {
      words: { chances: 24, lost: 5 },
    })

    expect(updated).toHaveLength(1)
    expect(updated[0]?.counts.words).toEqual({ chances: 24, lost: 5 })
    expect(updated[0]).not.toHaveProperty('score')
  })

  it('C6 entfernt Fast-Dubletten deterministisch vor dem Training', () => {
    expect(withoutInterference(['Insel', 'Pinsel', 'Vulkan', 'Volkan'])).toEqual([
      'Insel',
      'Vulkan',
    ])
  })

  it('H6 macht Missionsblöcke adaptiv, ohne das Sessionbudget zu verändern', () => {
    const normal = planSession({
      mode: 'daily',
      day: '2026-08-20',
      language: 'de',
      seed: 'package-a-mission',
      pools,
      modules: ['missions'],
      difficulty: { missions: 0 },
    })
    const harder = planSession({
      mode: 'daily',
      day: '2026-08-20',
      language: 'de',
      seed: 'package-a-mission',
      pools,
      modules: ['missions'],
      difficulty: { missions: 1 },
    })

    const normalEncode = normal.blocks.find(
      (block) => block.kind === 'encode' && block.moduleId === 'missions',
    )
    const harderEncode = harder.blocks.find(
      (block) => block.kind === 'encode' && block.moduleId === 'missions',
    )

    expect(harderEncode?.seconds).toBe((normalEncode?.seconds ?? 0) - 5)
    expect(harder.blocks.reduce((sum, block) => sum + block.seconds, 0)).toBe(
      normal.blocks.reduce((sum, block) => sum + block.seconds, 0),
    )
  })

  it('O7 trennt schwere Runden, sobald eine leichte Alternative vorhanden ist', () => {
    const session = planSession({
      mode: 'extended',
      day: '2026-08-20',
      language: 'de',
      seed: 'package-a-load',
      pools,
      modules: ['reverse', 'twins', 'words'],
    })
    const rounds = session.blocks
      .filter((block) => block.kind === 'recall')
      .map((block) => block.moduleId)

    expect(rounds.length).toBeGreaterThan(2)
    for (let index = 1; index < rounds.length; index += 1) {
      expect(
        isCognitivelyHeavy(rounds[index - 1]!) && isCognitivelyHeavy(rounds[index]!),
      ).toBe(false)
    }
  })
})
