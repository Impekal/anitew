import { describe, expect, it } from 'vitest'

import {
  DIMENSIONS,
  MIN_CHANCES,
  SOURCES,
  TRAINING_MODULES,
  type DimensionId,
  dimensionOf,
  hasProfile,
  profileOf,
  weakest,
} from '../../src/core/index.ts'
import { de } from '../../src/i18n/de.ts'
import { en } from '../../src/i18n/en.ts'

/**
 * Das Gedächtnisprofil (Backlog E2, E3, E7 · D-021).
 *
 * Die gefährlichste Anzeige der App, und deshalb der Test mit den meisten
 * Gegenproben: Geprüft wird vor allem, dass **„nicht gemessen“ nirgends wie
 * „schlecht“ aussieht** und dass keine Aussage entsteht, wo die Datenlage
 * keine trägt.
 */

const full = (chances: number, lost: number) => ({ chances, lost })

describe('die Achsen', () => {
  it('hat für jedes Trainingsmodul genau eine Achse', () => {
    for (const moduleId of TRAINING_MODULES) {
      expect(dimensionOf(moduleId), `${moduleId} ohne Achse`).toBeDefined()
    }
    const mapped = TRAINING_MODULES.map(dimensionOf)
    expect(new Set(mapped).size).toBe(TRAINING_MODULES.length)
  })

  it('nennt für jede Achse, woher sie ihre Zahlen hat', () => {
    for (const id of DIMENSIONS) expect(SOURCES[id]).toBeDefined()
  })

  it('hat für jede Achse einen Namen in beiden Sprachen', () => {
    for (const dictionary of [de, en]) {
      for (const id of DIMENSIONS) {
        expect(dictionary.profile.names[id].length, `${id} ohne Namen`).toBeGreaterThan(0)
      }
    }
  })
})

describe('was das Profil sagt — und was nicht', () => {
  it('sagt nichts, solange zu wenige Gelegenheiten da sind (E7)', () => {
    /*
     * Der Kern von E7: „82 nach drei Aufgaben wäre eine erfundene Zahl.“
     * Wichtig ist dabei die **Art** der Antwort — nicht `rate: 0`, sondern
     * ein eigener Fall. Eine Null ließe sich als schlechtes Ergebnis lesen.
     */
    const [words] = profileOf({ words: full(MIN_CHANCES - 1, 0) })
    expect(words?.kind).toBe('tooFew')
    expect(words).not.toHaveProperty('rate')
  })

  it('unterscheidet „nichts gemessen“ von „schlecht abgeschnitten“', () => {
    const results = profileOf({})
    const words = results.find((result) => result.id === 'words')
    expect(words?.kind).toBe('tooFew')
    // Und drei Achsen misst diese App überhaupt nicht — dort steht das, statt
    // eines leeren Balkens mit Hoffnung daneben (D-016).
    for (const id of ['visual', 'attention', 'working'] as DimensionId[]) {
      expect(results.find((result) => result.id === id)?.kind).toBe('notMeasured')
    }
  })

  it('überlässt den langfristigen Abruf der Messung (F1)', () => {
    // Zwei Zahlen über dasselbe zu haben hieße, dass eine davon die
    // schlechtere ist — und niemand wüsste, welche.
    const long = profileOf({}).find((result) => result.id === 'longTerm')
    expect(long?.kind).toBe('elsewhere')
  })

  it('rechnet den Anteil aus dem, was zurückkam', () => {
    const [words] = profileOf({ words: full(20, 4) })
    expect(words).toMatchObject({ kind: 'measured', held: 16, chances: 20, rate: 80 })
  })

  it('stellt eine Spanne daneben und keinen exakten Wert', () => {
    const [words] = profileOf({ words: full(20, 4) })
    if (words?.kind !== 'measured') throw new Error('nicht gemessen')
    expect(words.low).toBeLessThan(words.rate)
    expect(words.high).toBeGreaterThan(words.rate)
    // Und sie bleibt in den Grenzen, die ein Anteil hat.
    expect(words.low).toBeGreaterThanOrEqual(0)
    expect(words.high).toBeLessThanOrEqual(100)
  })

  it('wird enger, je mehr Gelegenheiten es gab', () => {
    const few = profileOf({ words: full(20, 4) })[0]
    const many = profileOf({ words: full(200, 40) })[0]
    if (few?.kind !== 'measured' || many?.kind !== 'measured') throw new Error('nicht gemessen')
    expect(many.high - many.low).toBeLessThan(few.high - few.low)
  })

  it('hat erst dann etwas zu zeigen, wenn eine Achse trägt', () => {
    expect(hasProfile(profileOf({}))).toBe(false)
    expect(hasProfile(profileOf({ words: full(MIN_CHANCES, 1) }))).toBe(true)
  })
})

describe('die schwächste Achse (E5)', () => {
  it('schweigt, solange sich die Spannen überlappen', () => {
    /*
     * Der eigentliche Punkt: Eine App, die auf einen zufälligen Unterschied
     * hin den Trainingsplan umbaut, baut ihn auf Rauschen um.
     */
    const results = profileOf({ words: full(20, 5), numbers: full(20, 6) })
    expect(weakest(results)).toBeUndefined()
  })

  it('nennt sie, wenn der Unterschied deutlich ist', () => {
    const results = profileOf({ words: full(60, 3), numbers: full(60, 40) })
    expect(weakest(results)).toBe('numbers')
  })

  it('schweigt, solange nur eine Achse überhaupt trägt', () => {
    // Ohne Vergleich gibt es keine schwächste — nur eine einzige.
    expect(weakest(profileOf({ words: full(40, 20) }))).toBeUndefined()
  })
})
