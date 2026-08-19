import { describe, expect, it } from 'vitest'

import { MODES } from '../../src/core/modes.ts'
import { type Pools, planSession } from '../../src/core/session/plan.ts'
import {
  DIFFICULTY_WINDOW,
  MIN_ANSWERS_TO_ADAPT,
  SPAN_BASE,
  SPAN_MAX,
  SPAN_MIN,
  itemsDeltaFor,
  spanLengthFor,
} from '../../src/core/session/difficulty.ts'

/**
 * Adaptive Schwierigkeit (D2).
 *
 * Die Regeln hinter den Fällen: **klein stellen, nie springen** (±1), **erst
 * ab genug Antworten** (dieselbe Vorsicht wie E7), und **gerechnet, nicht
 * fortgeschrieben** — dieselben Antworten ergeben immer dieselbe Anpassung.
 */

const runs = (correct: number, wrong: number): boolean[] => [
  ...Array.from({ length: correct }, () => true),
  ...Array.from({ length: wrong }, () => false),
]

describe('die adaptive Schwierigkeit', () => {
  it('stellt nichts, solange zu wenige Antworten da sind (E7-Vorsicht)', () => {
    expect(itemsDeltaFor({ recent: runs(MIN_ANSWERS_TO_ADAPT - 1, 0) })).toBe(0)
    expect(itemsDeltaFor({ recent: [] })).toBe(0)
  })

  it('gibt mehr, wenn fast alles sitzt — und nur ein Stück', () => {
    expect(itemsDeltaFor({ recent: runs(19, 1) })).toBe(1)
    expect(itemsDeltaFor({ recent: runs(20, 0) })).toBe(1)
  })

  it('nimmt weg, wenn ständig verloren geht — und nur ein Stück', () => {
    expect(itemsDeltaFor({ recent: runs(12, 8) })).toBe(-1)
  })

  it('lässt den Korridor in Ruhe — ~80 % ist das Ziel, kein Fehler', () => {
    expect(itemsDeltaFor({ recent: runs(16, 4) })).toBe(0)
    expect(itemsDeltaFor({ recent: runs(15, 5) })).toBe(0)
  })

  it('zählt nur das Fenster — alte Antworten verjähren', () => {
    // Ein katastrophaler Anfang, dann zwanzig Treffer: Es zählt das Fenster.
    const history = [...runs(0, 30), ...runs(DIFFICULTY_WINDOW, 0)]
    expect(itemsDeltaFor({ recent: history })).toBe(1)
  })

  it('hält die Rückwärtsspanne zwischen Boden und Decke', () => {
    expect(spanLengthFor({ recent: [] })).toBe(SPAN_BASE)
    expect(spanLengthFor({ recent: runs(20, 0) })).toBe(SPAN_MAX)
    expect(spanLengthFor({ recent: runs(10, 10) })).toBe(SPAN_MIN)
  })

  it('rechnet, statt fortzuschreiben — gleiche Antworten, gleiche Anpassung', () => {
    const history = runs(17, 3)
    expect(itemsDeltaFor({ recent: history })).toBe(itemsDeltaFor({ recent: history }))
  })
})

describe('die Verschiebung im Bauplan (D2)', () => {
  const pools: Pools = {
    words: Array.from({ length: 60 }, (_, index) => `w${index}`),
    faces: [],
    numbers: [],
    missions: [],
    palace: [],
    reverse: [],
    twins: [],
    gaze: [], facts: [],
  }
  const base = { day: '2026-08-19', language: 'de', seed: 'd2', pools, modules: ['words'] as const }

  const sizes = (difficulty?: { words: -1 | 0 | 1 }) =>
    planSession({ ...base, mode: 'daily', ...(difficulty ? { difficulty } : {}) })
      .blocks.filter((block) => block.kind === 'encode')
      .map((block) => block.items.length)

  it('verschiebt die Rundengröße um ein Stück — in beide Richtungen', () => {
    const plain = sizes()
    const more = sizes({ words: 1 })
    const less = sizes({ words: -1 })
    for (let index = 0; index < plain.length; index++) {
      expect(more[index]).toBe(Math.min(8, (plain[index] as number) + 1))
      expect(less[index]).toBe(Math.max(3, (plain[index] as number) - 1))
    }
  })

  it('hält Grenzen und Budget — die Zusage bleibt exakt', () => {
    for (const delta of [-1, 1] as const) {
      const plan = planSession({ ...base, mode: 'daily', difficulty: { words: delta } })
      for (const block of plan.blocks.filter((entry) => entry.kind === 'encode')) {
        expect(block.items.length).toBeGreaterThanOrEqual(3)
        expect(block.items.length).toBeLessThanOrEqual(8)
      }
      const total = plan.blocks.reduce((sum, block) => sum + block.seconds, 0)
      expect(total).toBe(MODES.daily.seconds)
    }
  })

  it('ohne Angabe ändert sich nichts — Planung wie bisher', () => {
    expect(sizes()).toEqual(sizes({ words: 0 }))
  })
})

