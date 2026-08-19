import { describe, expect, it } from 'vitest'

import { TRAINING_MODES, MODES } from '../../src/core/modes.ts'
import { wordPool } from '../../src/core/content/words.ts'
import {
  MAX_ITEMS_PER_ROUND,
  MIN_ITEMS_PER_ROUND,
  SECONDS_PER_ITEM,
  itemsOf,
  planSession,
  reviewItemsOf,
} from '../../src/core/session/plan.ts'

const pool = wordPool('de')
/*
 * Diese Datei prüft den **Aufbau** einer Einheit, nicht das Mischen der
 * Module — deshalb wird hier auf ein Modul festgelegt. Das Mischen hat seinen
 * eigenen Abschnitt am Ende.
 */
const plan = (mode: (typeof TRAINING_MODES)[number], seed = 'test', due: string[] = []) =>
  planSession({
    mode,
    day: '2026-08-17',
    language: 'de',
    seed,
    pools: { words: pool, faces: [], numbers: [], missions: [], palace: [], reverse: [], twins: [], gaze: [], facts: [] },
    due: { words: due },
    modules: ['words'],
  })

describe('das Zeitbudget', () => {
  it('stimmt für jeden Modus auf die Sekunde', () => {
    for (const mode of TRAINING_MODES) {
      const session = plan(mode)
      const sum = session.blocks.reduce((total, block) => total + block.seconds, 0)
      expect(sum).toBe(MODES[mode].seconds)
      expect(session.totalSeconds).toBe(MODES[mode].seconds)
    }
  })

  it('gibt keinem Block eine negative oder leere Länge', () => {
    for (const mode of TRAINING_MODES) {
      for (const block of plan(mode).blocks) {
        expect(block.seconds).toBeGreaterThan(0)
      }
    }
  })

  it('lässt auch die kürzeste Einheit eine ganze Runde sein', () => {
    const session = plan('emergency')
    expect(session.blocks).toHaveLength(2)
    expect(session.blocks[0]?.kind).toBe('encode')
    expect(session.blocks[1]?.kind).toBe('recall')
  })

  it('teilt längere Einheiten in mehrere Runden', () => {
    expect(rounds(plan('emergency'))).toBe(1)
    expect(rounds(plan('short'))).toBe(2)
    expect(rounds(plan('daily'))).toBe(3)
    expect(rounds(plan('extended'))).toBe(8)
  })
})

describe('der Aufbau einer Runde', () => {
  it('lässt auf jedes Einprägen ein Abrufen derselben Wörter folgen', () => {
    for (const mode of TRAINING_MODES) {
      const blocks = plan(mode).blocks.filter((block) => block.kind !== 'review')
      for (let i = 0; i < blocks.length; i += 2) {
        const encode = blocks[i]!
        const recall = blocks[i + 1]!
        expect(encode.kind).toBe('encode')
        expect(recall.kind).toBe('recall')
        expect(recall.round).toBe(encode.round)
        expect(recall.items).toEqual(encode.items)
      }
    }
  })

  it('gibt jedem Wort seine Zeit beim Einprägen', () => {
    for (const mode of TRAINING_MODES) {
      for (const block of plan(mode).blocks) {
        if (block.kind !== 'encode') continue
        expect(block.seconds).toBe(block.items.length * SECONDS_PER_ITEM)
      }
    }
  })

  it('bleibt zwischen 3 und 8 Wörtern je Runde', () => {
    for (const mode of TRAINING_MODES) {
      for (const block of plan(mode).blocks) {
        if (block.kind !== 'encode') continue
        expect(block.items.length).toBeGreaterThanOrEqual(MIN_ITEMS_PER_ROUND)
        expect(block.items.length).toBeLessThanOrEqual(MAX_ITEMS_PER_ROUND)
      }
    }
  })

  it('lässt fürs Abrufen mehr Zeit als fürs Einprägen', () => {
    // Abrufen ist die Arbeit, Einprägen nur die Vorlage.
    for (const mode of TRAINING_MODES) {
      const blocks = plan(mode).blocks.filter((block) => block.kind !== 'review')
      for (let i = 0; i < blocks.length; i += 2) {
        expect(blocks[i + 1]!.seconds).toBeGreaterThan(blocks[i]!.seconds)
      }
    }
  })
})

describe('die Wortauswahl', () => {
  it('wiederholt innerhalb einer Einheit kein Wort', () => {
    // Sonst misst der spätere Abruf Wiedererkennen statt Erinnern.
    for (const mode of TRAINING_MODES) {
      const words = itemsOf(plan(mode))
      expect(new Set(words).size).toBe(words.length)
    }
  })

  it('nimmt Wörter aus dem übergebenen Vorrat', () => {
    for (const word of itemsOf(plan('daily'))) {
      expect(pool).toContain(word)
    }
  })

  it('ergibt aus demselben Seed dieselbe Einheit', () => {
    expect(itemsOf(plan('daily', 'montag'))).toEqual(itemsOf(plan('daily', 'montag')))
  })

  it('ergibt aus verschiedenen Seeds verschiedene Einheiten', () => {
    expect(itemsOf(plan('daily', 'montag'))).not.toEqual(itemsOf(plan('daily', 'dienstag')))
  })

  it('sagt deutlich Bescheid, wenn der Vorrat nicht reicht', () => {
    expect(() =>
      planSession({
        mode: 'daily',
        day: '2026-08-17',
        language: 'de',
        seed: 'x',
        pools: { words: ['eins', 'zwei'], faces: [], numbers: [], missions: [], palace: [], reverse: [], twins: [], gaze: [], facts: [] },
        modules: ['words'],
      }),
    ).toThrow(RangeError)
  })
})

function rounds(session: ReturnType<typeof plan>): number {
  return new Set(session.blocks.map((block) => block.round)).size
}

describe('das Wiedersehen mit früheren Tagen (D8)', () => {
  const due = ['Anker', 'Besen', 'Krone']

  it('kommt nur, wenn etwas fällig ist', () => {
    expect(plan('daily').blocks.some((block) => block.kind === 'review')).toBe(false)
    expect(plan('daily', 'test', due).blocks.some((block) => block.kind === 'review')).toBe(true)
  })

  it('steht am Ende der Einheit', () => {
    const blocks = plan('daily', 'test', due).blocks
    expect(blocks[blocks.length - 1]?.kind).toBe('review')
  })

  it('fragt genau die fälligen Wörter ab', () => {
    expect(reviewItemsOf(plan('daily', 'test', due))).toEqual(due)
  })

  it('hält das Zeitbudget trotzdem auf die Sekunde', () => {
    for (const mode of TRAINING_MODES) {
      const session = plan(mode, 'test', due)
      const sum = session.blocks.reduce((total, block) => total + block.seconds, 0)
      expect(sum).toBe(MODES[mode].seconds)
    }
  })

  it('nimmt sich die Zeit vom Lernen, nicht obendrauf', () => {
    // Sonst wäre das Wiedersehen ein heimlicher Aufschlag auf die
    // versprochenen fünf Minuten (B2).
    const withReview = plan('daily', 'test', due)
    const withoutReview = plan('daily')
    expect(withReview.totalSeconds).toBe(withoutReview.totalSeconds)
    expect(itemsOf(withReview).length).toBeLessThanOrEqual(itemsOf(withoutReview).length)
  })

  it('mischt fällige Wörter nicht unter die neuen', () => {
    // Ein Wort, das heute wiederkommt, darf nicht zusätzlich als „neu“
    // eingeprägt werden — sonst misst der Abruf Wiedererkennen.
    const session = plan('daily', 'test', due)
    expect(itemsOf(session).filter((word) => due.includes(word))).toEqual([])
  })
})
