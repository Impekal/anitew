import { describe, expect, it } from 'vitest'

import {
  MODES,
  type Pools,
  SECONDS_PER_REVERSE_PROMPT,
  asksOnSight,
  displayOf,
  entersReview,
  isPrompted,
  leniencyFor,
  planSession,
  reversed,
  spanPool,
  targetOf,
} from '../../src/core/index.ts'

/**
 * Das Arbeitsgedächtnis-Modul (D7 · D-026).
 *
 * Zwei Regeln tragen alles: **Zeigen und Fragen in einem Atemzug** (kein
 * Einprägeblock — sonst prüfte es Behalten statt Umbauen), und **kein
 * Termin** (Umbauen im Moment ist kein Behalten; ein „Wiedersehen“ nach
 * Tagen fragte das Falsche).
 */

const pools: Pools = {
  words: [],
  faces: [],
  numbers: [],
  missions: [],
  palace: [],
  // Sechzig: Die erzwungene Nur-Rückwärts-Einheit in „extended“ zieht bis
  // zu 48 Folgen — mehr, als der echte Betrieb je verlangt.
  reverse: spanPool('probe', 60),
}

const base = { day: '2026-08-18', language: 'de', seed: 'probe', pools } as const

describe('das Rückwärts-Modul', () => {
  it('fragt gestützt, vergleicht exakt und sucht den Spiegel', () => {
    expect(isPrompted('reverse')).toBe(true)
    // Vertauschte Ziffern sind eine andere Folge — genau das ist die Übung.
    expect(leniencyFor('reverse')).toBe('exact')
    expect(targetOf('reverse', '48293', 'de')).toBe('39284')
    // In der Zusammenfassung steht die geleistete (gesuchte) Folge.
    expect(displayOf('reverse', '48293', 'de')).toBe('39284')
  })

  it('rechnet nicht mit dem Wiederholungsplan ab — Umbauen ist kein Behalten', () => {
    expect(entersReview('reverse')).toBe(false)
    expect(asksOnSight('reverse')).toBe(true)
    // Und alle anderen Module bleiben, was sie waren.
    for (const moduleId of ['words', 'faces', 'numbers', 'missions', 'palace'] as const) {
      expect(entersReview(moduleId)).toBe(true)
      expect(asksOnSight(moduleId)).toBe(false)
    }
  })

  it('plant eine Runde ohne Einprägeblock — das ganze Budget gehört dem Abruf', () => {
    for (const mode of ['emergency', 'short', 'daily', 'extended'] as const) {
      const plan = planSession({ ...base, mode, modules: ['reverse'] })
      const encodes = plan.blocks.filter((block) => block.kind === 'encode')
      expect(encodes).toHaveLength(0)
      // Die Zusage bleibt exakt: Die Summe der Blöcke ist die Länge des Modus.
      const total = plan.blocks.reduce((sum, block) => sum + block.seconds, 0)
      expect(total).toBe(MODES[mode].seconds)
    }
  })

  it('bemisst die Fragen nach der Zeit — nie unter zwei, nie über sechs', () => {
    for (const mode of ['emergency', 'short', 'daily', 'extended'] as const) {
      const plan = planSession({ ...base, mode, modules: ['reverse'] })
      for (const block of plan.blocks.filter((entry) => entry.kind === 'recall')) {
        expect(block.items.length).toBeGreaterThanOrEqual(2)
        expect(block.items.length).toBeLessThanOrEqual(6)
        // Grob nach dem Prompt-Takt bemessen — mit Rundungsluft.
        expect(block.items.length * SECONDS_PER_REVERSE_PROMPT).toBeLessThanOrEqual(
          block.seconds + SECONDS_PER_REVERSE_PROMPT,
        )
      }
    }
  })

  it('wiederholt keine Folge innerhalb einer Einheit', () => {
    const plan = planSession({ ...base, mode: 'extended', modules: ['reverse'] })
    const all = plan.blocks.flatMap((block) => block.items)
    expect(new Set(all).size).toBe(all.length)
  })

  it('dreht zweimal gedreht auf sich selbst zurück', () => {
    for (const digits of spanPool('x', 20)) {
      expect(reversed(reversed(digits))).toBe(digits)
    }
  })
})
