import { describe, expect, it } from 'vitest'

import { MODES, TRAINING_MODES } from '../../src/core/modes.ts'
import { wordPool } from '../../src/core/content/words.ts'
import { planSession, secondsPerItemFor } from '../../src/core/session/plan.ts'
import { missionSecondsPerFact } from '../../src/core/session/difficulty.ts'

/**
 * Zeit zum Einprägen (Nutzerbefund 05.09.).
 *
 * Wörtlich: „Ich habe den Eindruck, dass die Übungen zu schnell gehen. Man hat
 * kaum Zeit, sich was auszudenken … da man die Methoden lernen muss. Wenn das
 * so schnell geht, schafft man es nicht, was zu lernen."
 *
 * **Gemessen vor dem Eingriff:** vier Sekunden je Stück — für Wörter, Namen
 * und Zahlen, in **jedem** Modus. Die Viertelstunde gab je Wort genau so viel
 * Zeit wie die Notfall-Minute, nur mehr Runden. Es gab keinen Zustand, in dem
 * man sich Zeit nehmen konnte.
 */

const pool = wordPool('de')

const plane = (extra: Record<string, unknown> = {}) =>
  planSession({
    mode: 'daily',
    day: '2026-09-05',
    language: 'de',
    seed: 'tempo',
    pools: {
      words: pool, faces: [], numbers: [], missions: [], palace: [],
      reverse: [], twins: [], gaze: [], facts: [], memory: [], people: [], math: [],
    },
    due: {},
    modules: ['words'],
    ...extra,
  } as never)

describe('der Takt beim Einprägen', () => {
  it('behält seine Ordnung: Wort, Tatsache in einer Szene, Bild an einem Ort', () => {
    /*
     * Diese Reihenfolge stand schon vorher fest und hat den Eingriff
     * überstanden — sie war es, die ihn korrigiert hat: Als nur die Wörter
     * stiegen, gab eine Mission plötzlich weniger Zeit je Tatsache als ein
     * einzelnes Wort. Ein Kerntest war rot und hatte recht.
     */
    expect(secondsPerItemFor('missions')).toBeGreaterThan(secondsPerItemFor('words'))
    expect(secondsPerItemFor('palace')).toBeGreaterThan(secondsPerItemFor('missions'))
  })

  it('gibt mehr Zeit, solange die Technik noch gelehrt wird', () => {
    for (const modul of ['words', 'faces', 'numbers', 'palace'] as const) {
      expect(
        secondsPerItemFor(modul, { practised: false }),
        `${modul} gibt Anfängern nicht mehr Zeit`,
      ).toBeGreaterThan(secondsPerItemFor(modul, { practised: true }))
    }
  })

  it('folgt dem Wunsch des Menschen — den keine Trefferquote kennen kann', () => {
    const viel = secondsPerItemFor('words', { pace: 'much' })
    const normal = secondsPerItemFor('words', { pace: 'normal' })
    const wenig = secondsPerItemFor('words', { pace: 'little' })
    expect(viel).toBeGreaterThan(normal)
    expect(normal).toBeGreaterThan(wenig)
  })

  it('bleibt in jedem Fall zwischen drei und vierzehn Sekunden', () => {
    for (const modul of ['words', 'missions', 'palace'] as const) {
      for (const practised of [true, false]) {
        for (const pace of ['much', 'normal', 'little'] as const) {
          const takt = secondsPerItemFor(modul, { practised, pace })
          expect(takt).toBeGreaterThanOrEqual(3)
          expect(takt).toBeLessThanOrEqual(14)
        }
      }
    }
  })
})

describe('was mehr Zeit für die Einheit bedeutet', () => {
  it('nicht mehr Zeit, sondern weniger Stücke', () => {
    /*
     * Der Kern des Eingriffs. Die Stückzahl wird aus der Zeit gerechnet —
     * wer neun Sekunden je Wort bekommt, bekommt vier Wörter statt acht.
     * Ohne das wäre „mehr Zeit" nur eine längere Einheit gewesen, und darum
     * ging es nicht.
     */
    const ruhig = plane({ pace: 'much' }).blocks.find((b) => b.kind === 'encode')!
    const hastig = plane({ pace: 'little' }).blocks.find((b) => b.kind === 'encode')!
    expect(ruhig.items.length).toBeLessThan(hastig.items.length)
    expect(ruhig.seconds / ruhig.items.length).toBeGreaterThan(
      hastig.seconds / hastig.items.length,
    )
  })

  it('lässt das Zeitbudget der Einheit auf die Sekunde unberührt', () => {
    // Die Zusage, an der alles hängt: Wer fünf Minuten wählt, bekommt fünf
    // Minuten — bei jedem Tempo und in jedem Modus.
    for (const mode of TRAINING_MODES) {
      for (const pace of ['much', 'normal', 'little'] as const) {
        const plan = plane({ mode, pace })
        const summe = plan.blocks.reduce((n, block) => n + block.seconds, 0)
        expect(summe, `${mode} / ${pace}`).toBe(MODES[mode].seconds)
      }
    }
  })

  it('lässt dem Abruf in jeder Runde noch Zeit', () => {
    // Eine Einprägezeit, die den ganzen Block frisst, wäre keine Übung mehr.
    for (const pace of ['much', 'normal', 'little'] as const) {
      for (const block of plane({ pace }).blocks) {
        if (block.kind === 'recall') expect(block.seconds, pace).toBeGreaterThan(0)
      }
    }
  })
})

describe('die adaptive Missionszeit (H6)', () => {
  it('verschiebt gegen den geplanten Takt, nicht gegen eine feste Fünf', () => {
    /*
     * Hier lag ein stiller Bruch: `missionSecondsPerFact` rechnete absolut
     * (vier, fünf, sechs). Bei `delta = 0` ließ H6 den Plan in Ruhe — mit dem
     * neuen Takt also sieben Sekunden —, bei ±1 schrieb es ihn auf sechs oder
     * vier um. „Leichter" hätte damit weniger Zeit bedeutet als „normal".
     */
    expect(missionSecondsPerFact(-1, 7)).toBe(8)
    expect(missionSecondsPerFact(0, 7)).toBe(7)
    expect(missionSecondsPerFact(1, 7)).toBe(6)
    // Ohne eigenen Takt bleibt die alte Bedeutung erhalten.
    expect(missionSecondsPerFact(-1)).toBe(6)
    expect(missionSecondsPerFact(0)).toBe(5)
    expect(missionSecondsPerFact(1)).toBe(4)
  })
})
