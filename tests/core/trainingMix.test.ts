import { describe, expect, it } from 'vitest'

import { adaptiveTrainingMix, type DimensionCounts } from '../../src/core/index.ts'

const full = (chances: number, lost: number): DimensionCounts => ({ chances, lost })

describe('Phase 6.1 — persönlicher Trainingsmix', () => {
  it('bleibt neutral, solange die Daten keine klare Schwäche tragen', () => {
    expect(adaptiveTrainingMix({}, 300)).toEqual({ kind: 'balanced' })
    expect(
      adaptiveTrainingMix({ words: full(20, 5), numbers: full(20, 6) }, 300),
    ).toEqual({ kind: 'balanced' })
  })

  it('fokussiert nur eine statistisch klar schwächere verzögerte Achse', () => {
    const decision = adaptiveTrainingMix(
      { words: full(60, 3), numbers: full(60, 40), faces: full(60, 5) },
      300,
    )
    expect(decision).toEqual({ kind: 'focus', moduleId: 'numbers', dimensionId: 'numbers' })
  })

  it('vergleicht Sofort-Arbeitsgedächtnis nicht mit Behalten nach Tagen', () => {
    const decision = adaptiveTrainingMix(
      { working: full(60, 45), words: full(60, 3), faces: full(60, 5) },
      300,
    )
    expect(decision.kind).toBe('balanced')
  })

  it('verspricht keinen Schwerpunkt, der in der gewählten Zeit nicht trainierbar ist', () => {
    const counts = { spatial: full(60, 40), words: full(60, 3), faces: full(60, 5) }
    expect(adaptiveTrainingMix(counts, 60)).toEqual({ kind: 'balanced' })
    expect(adaptiveTrainingMix(counts, 300)).toEqual({
      kind: 'focus',
      moduleId: 'palace',
      dimensionId: 'spatial',
    })
  })
})
