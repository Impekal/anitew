import { describe, expect, it } from 'vitest'

import { MAX_ADVICE, adviceOf } from '../../src/core/coach/advice.ts'
import { coachQuestion, coachSystem } from '../../src/core/coach/prompt.ts'

/**
 * Der Coach (Backlog M · D-031).
 *
 * Die Regeln hinter den Fällen: **nur Belegtes** (R-1), **kein Druck** (K7),
 * und der Offline-Teil ist der Pflichtteil — er sagt immer etwas, aber nie
 * mehr, als die Zahlen hergeben.
 */
describe('der Coach ohne Netz', () => {
  it('sagt ohne Zahlen genau eines: erst trainieren, dann beraten', () => {
    expect(adviceOf({ deltas: {}, benchmarkDue: false })).toEqual([{ id: 'firstSteps' }])
  })

  it('nennt den Schwerpunkt nur, wenn er belegt ist', () => {
    const advice = adviceOf({ weakest: 'faces', deltas: {}, benchmarkDue: false })
    expect(advice[0]).toEqual({ id: 'focusWeakest', dimension: 'faces' })
    // Ohne Beleg kein Schwerpunkt — und kein Ersatz aus dem Bauch.
    expect(
      adviceOf({ deltas: {}, benchmarkDue: true }).some((entry) => entry.id === 'focusWeakest'),
    ).toBe(false)
  })

  it('ordnet die Verschiebungen ein, statt sie zu verstecken (D2)', () => {
    const advice = adviceOf({
      deltas: { words: -1, faces: 1, numbers: 0 },
      benchmarkDue: false,
    })
    expect(advice).toContainEqual({ id: 'smallerRounds', moduleId: 'words' })
    expect(advice).toContainEqual({ id: 'largerRounds', moduleId: 'faces' })
  })

  it('bleibt bei höchstens drei Hinweisen — mehr wäre eine Liste', () => {
    const advice = adviceOf({
      weakest: 'numbers',
      deltas: { words: -1, faces: 1 },
      benchmarkDue: true,
    })
    expect(advice.length).toBeLessThanOrEqual(MAX_ADVICE)
    // Die Vorrangfolge: Schwerpunkt zuerst, die Messung fällt hinten runter.
    expect(advice[0]?.id).toBe('focusWeakest')
    expect(advice.some((entry) => entry.id === 'benchmarkDue')).toBe(false)
  })

  it('der ehrliche Anfang verschwindet, sobald es etwas Belegtes gibt', () => {
    const advice = adviceOf({ deltas: {}, benchmarkDue: true })
    expect(advice).toEqual([{ id: 'benchmarkDue' }])
  })
})

describe('die Coach-Anweisung für das Modell', () => {
  it('trägt die Hausregeln: nur Zahlen, kein Druck, keine fertigen Bilder', () => {
    const system = coachSystem()
    expect(system).toContain('mitgegebenen Zahlen')
    expect(system).toContain('Kein Druck')
    expect(system).toContain('eigenes Bild')
  })

  it('verkleidet fehlende Achsen nicht als Null (K7)', () => {
    const text = coachQuestion(
      {
        language: 'de',
        streak: { current: 3, best: 7 },
        counts: { words: { chances: 12, lost: 2 }, faces: { chances: 0, lost: 0 } },
        deltas: { words: -1, numbers: 0 },
        taughtDigits: 0,
        hasPalace: false,
      },
      'Wie halte ich Namen besser?',
    )
    expect(text).toContain('Achse words: 12 Gelegenheiten, 2 verloren')
    expect(text).not.toContain('faces')
    expect(text).not.toContain('numbers')
    expect(text).not.toContain('Major-System')
    expect(text).toContain('Frage: Wie halte ich Namen besser?')
  })
})
