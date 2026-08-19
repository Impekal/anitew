import { describe, expect, it } from 'vitest'

import { normalizeWord } from '../../src/core/session/grading.ts'
import { MODES } from '../../src/core/modes.ts'
import {
  type Pools,
  leniencyFor,
  planSession,
  subjectOf,
  targetOf,
} from '../../src/core/session/plan.ts'
import { benchmarkPool } from '../../src/core/benchmark/pool.ts'
import { objectFor, walkPlacements, walkPool } from '../../src/core/content/palace.ts'
import {
  TWIN_SEPARATOR,
  hasTwinPool,
  twinChoices,
  twinFoil,
  twinPairs,
  twinPool,
  twinShown,
} from '../../src/core/content/twins.ts'
import { wordPool } from '../../src/core/content/words.ts'
import type { Language } from '../../src/core/language.ts'
import { trainingLanguages } from '../../src/core/training.ts'

/**
 * Die Zwillingspaare (C6/D3).
 *
 * Zwei Regeln tragen alles: **Kein Zwilling läuft in einem anderen Vorrat
 * mit** (sonst laufen zwei Übungen ineinander — C6 — oder die Messung ist
 * verseucht — F2a), und **welche Seite gezeigt wird, entscheidet der Seed**
 * (sonst wäre die richtige Antwort auswendig lernbar).
 */

const LANGUAGES = trainingLanguages()

/** Alle Wörter, die anderswo schon vergeben sind — normalisiert. */
function reservedWords(language: Language): Set<string> {
  const reserved = new Set<string>()
  for (const word of wordPool(language)) reserved.add(normalizeWord(word))
  for (const word of benchmarkPool(language)) reserved.add(normalizeWord(word))
  for (const walk of walkPool(`probe:${language}`, 30)) {
    for (const placement of walkPlacements(walk)) {
      const object = objectFor(placement, language)
      if (object !== undefined) reserved.add(normalizeWord(object))
    }
  }
  return reserved
}

describe('die Zwillingspaare', () => {
  it('gibt es in jeder Trainingssprache', () => {
    expect(LANGUAGES.length).toBeGreaterThan(0)
    for (const language of LANGUAGES) {
      expect(hasTwinPool(language), language).toBe(true)
      expect(twinPairs(language).length, language).toBeGreaterThanOrEqual(12)
    }
  })

  it('hält jedes Paar aus allen anderen Vorräten heraus (C6, F2a)', () => {
    for (const language of LANGUAGES) {
      const reserved = reservedWords(language)
      for (const [first, second] of twinPairs(language)) {
        expect(reserved.has(normalizeWord(first)), `${language}: ${first}`).toBe(false)
        expect(reserved.has(normalizeWord(second)), `${language}: ${second}`).toBe(false)
      }
    }
  })

  it('lässt kein Wort in zwei Paaren auftreten — ein Zwilling hat einen Zwilling', () => {
    for (const language of LANGUAGES) {
      const seen = new Set<string>()
      for (const pair of twinPairs(language)) {
        for (const word of pair) {
          expect(seen.has(normalizeWord(word)), `${language}: ${word}`).toBe(false)
          seen.add(normalizeWord(word))
        }
      }
    }
  })

  it('zerlegt die Kennung sauber — und keines der Wörter trägt das Trennzeichen', () => {
    for (const language of LANGUAGES) {
      for (const [first, second] of twinPairs(language)) {
        expect(first.includes(TWIN_SEPARATOR)).toBe(false)
        expect(second.includes(TWIN_SEPARATOR)).toBe(false)
      }
      for (const item of twinPool(language, 's')) {
        expect(item.split(TWIN_SEPARATOR)).toHaveLength(2)
        expect(twinShown(item)).not.toBe(twinFoil(item))
      }
    }
  })

  it('lässt den Seed entscheiden, welche Seite gezeigt wird', () => {
    const shownA = twinPool('de', 'tag-eins').map(twinShown).sort()
    const shownB = twinPool('de', 'tag-zwei').map(twinShown).sort()
    // Gleicher Seed, gleiche Wahl — verschiedene Seeds, andere Seiten.
    expect(twinPool('de', 'tag-eins')).toEqual(twinPool('de', 'tag-eins'))
    expect(shownA).not.toEqual(shownB)
  })

  it('stellt die Wahl in neutraler Reihenfolge — der Ort verrät nichts', () => {
    for (const item of twinPool('de', 's')) {
      const [a, b] = twinChoices(item)
      expect(a.localeCompare(b, 'de')).toBeLessThan(0)
      expect(new Set([a, b])).toEqual(new Set([twinShown(item), twinFoil(item)]))
    }
  })
})

describe('die Zwillinge im Bauplan (D-027)', () => {
  const basePools = (twins: readonly string[]): Pools => ({
    words: Array.from({ length: 40 }, (_, index) => `w${index}`),
    faces: [],
    numbers: [],
    missions: [],
    palace: [],
    reverse: [],
    twins,
  })

  it('fragt exakt und sucht die gezeigte Seite', () => {
    // Exakt zwingend: Der Köder liegt eine Tippfehler-Nachsicht entfernt.
    expect(leniencyFor('twins')).toBe('exact')
    expect(targetOf('twins', 'Kirche%Kirsche', 'de')).toBe('Kirche')
  })

  it('kennt als Anker das Paar — Orientierung ist keine zweite Unterscheidung', () => {
    expect(subjectOf('twins', 'Kirche%Kirsche')).toBe(subjectOf('twins', 'Kirsche%Kirche'))
  })

  it('zieht ein fälliges Paar nicht noch einmal als neu — auch gedreht nicht', () => {
    /*
     * Heute fällig: `Kirche%Kirsche`. Im Vorrat steht das Paar gedreht.
     * Ohne den kanonischen Anker käme dieselbe Unterscheidung als „neu“ —
     * zwei Termine, zwei gegensätzliche Antworten auf dieselbe Frage.
     */
    const plan = planSession({
      mode: 'daily',
      day: '2026-08-18',
      language: 'de',
      seed: 'probe',
      pools: basePools(['Kirsche%Kirche', 'Mantel%Mangel', 'Fliege%Fliese', 'Karte%Kante']),
      due: { twins: ['Kirche%Kirsche'] },
      modules: ['twins', 'words'],
    })
    const learned = plan.blocks
      .filter((block) => block.kind === 'encode' || block.kind === 'recall')
      .flatMap((block) => block.items)
    expect(learned).not.toContain('Kirsche%Kirche')
    // Und das Wiedersehen selbst steht da.
    const review = plan.blocks.find((block) => block.kind === 'review')
    expect(review?.items).toEqual(['Kirche%Kirsche'])
  })

  it('fällt mit erschöpftem Vorrat aus der Lernrotation — das Wiedersehen bleibt', () => {
    const plan = planSession({
      mode: 'daily',
      day: '2026-08-18',
      language: 'de',
      seed: 'probe',
      // Zwei übrig — zu wenig für eine Runde (drei ist das Minimum).
      pools: basePools(['Wanne%Wange', 'Rose%Dose']),
      due: { twins: ['Kirche%Kirsche'] },
      modules: ['twins', 'words'],
    })
    const encodes = plan.blocks.filter((block) => block.kind === 'encode')
    expect(encodes.every((block) => block.moduleId === 'words')).toBe(true)
    expect(plan.blocks.find((block) => block.kind === 'review')?.items).toEqual([
      'Kirche%Kirsche',
    ])
    // Die Zusage bleibt exakt.
    const total = plan.blocks.reduce((sum, block) => sum + block.seconds, 0)
    expect(total).toBe(MODES.daily.seconds)
  })
})
