import { trainingFootprint } from '../../src/core/progress/footprint.ts'
import { describe, expect, it } from 'vitest'

import {
  DIMENSIONS,
  MIN_CHANCES,
  SOURCES,
  TRAINING_MODULES,
  dimensionOf,
  hasProfile,
  learnableModules,
  planSession,
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
  it('hat für jedes eigenständig gemessene Trainingsmodul genau eine Achse', () => {
    /*
     * Eigene Inhalte (D-032) und der Memory-Graph (D-036) sind gewählt und
     * deshalb keine vergleichbaren Messquellen. Seit D12 ist außerdem der
     * Gedächtnispalast bewusst nur noch Technik/Übung: Die räumliche Achse
     * wird ausschließlich durch das eigenständige `spatial`-Modul gemessen.
     * Seit D13 ist auch die Mission selbst die Szene/Übung; die Achse
     * „Zusammenhänge“ misst den separaten fact-to-person-Querabruf aus
     * `associative`, damit dieselbe Mission nicht zweimal als Profilwert zählt.
     */
    const chosen = new Set(['facts', 'memory', 'palace', 'missions'])
    const measured = TRAINING_MODULES.filter((moduleId) => !chosen.has(moduleId))
    for (const moduleId of measured) {
      expect(dimensionOf(moduleId), `${moduleId} ohne Achse`).toBeDefined()
    }
    expect(dimensionOf('facts')).toBeUndefined()
    expect(dimensionOf('memory')).toBeUndefined()
    expect(dimensionOf('palace')).toBeUndefined()
    expect(dimensionOf('missions')).toBeUndefined()
    const mapped = measured.map(dimensionOf)
    expect(new Set(mapped).size).toBe(measured.length)
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
    const [words] = profileOf({ words: full(MIN_CHANCES - 1, 0) })
    expect(words?.kind).toBe('tooFew')
    expect(words).not.toHaveProperty('rate')
  })

  it('unterscheidet „nichts gemessen“ von „schlecht abgeschnitten“', () => {
    const results = profileOf({})
    const words = results.find((result) => result.id === 'words')
    expect(words?.kind).toBe('tooFew')
    for (const result of results) {
      expect(result.kind, result.id).not.toBe('notMeasured')
    }
    expect(results.find((result) => result.id === 'visual')?.kind).toBe('tooFew')
    expect(results.find((result) => result.id === 'attention')?.kind).toBe('tooFew')
    expect(results.find((result) => result.id === 'working')?.kind).toBe('tooFew')
  })

  it('nennt eine Sofort-Achse nie als schwächste — zwei Währungen (D-026)', () => {
    const results = profileOf({
      working: full(60, 30),
      words: full(60, 6),
      faces: full(60, 8),
    })
    const weak = weakest(results)
    expect(weak).not.toBe('working')
    expect(weak === undefined || weak === 'words' || weak === 'faces').toBe(true)
  })

  it('überlässt den langfristigen Abruf der Messung (F1)', () => {
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
    const results = profileOf({ words: full(20, 5), numbers: full(20, 6) })
    expect(weakest(results)).toBeUndefined()
  })

  it('nennt sie, wenn der Unterschied deutlich ist', () => {
    const results = profileOf({ words: full(60, 3), numbers: full(60, 40) })
    expect(weakest(results)).toBe('numbers')
  })

  it('schweigt, solange nur eine Achse überhaupt trägt', () => {
    expect(weakest(profileOf({ words: full(40, 20) }))).toBeUndefined()
  })
})

describe('der Schwerpunkt im Bauplan (E5)', () => {
  const base = {
    mode: 'extended' as const,
    day: '2026-08-18',
    language: 'de',
    seed: 'schwerpunkt',
  }
  const many = (prefix: string) => Array.from({ length: 60 }, (_, index) => `${prefix}${index}`)
  const pools = {
    words: many('w'),
    faces: many('f'),
    numbers: many('9'),
    missions: many('p'),
    palace: many('home~'),
    reverse: ['48293', '17546', '90287', '35761', '82154', '46029'],
    twins: ['Kirche%Kirsche', 'Mantel%Mangel', 'Fliege%Fliese', 'Karte%Kante', 'Bogen%Boden', 'Wolke%Wolle'],
    gaze: ['bild~1', 'bild~2', 'bild~3', 'bild~4', 'bild~5', 'bild~6'], facts: [], memory: [],
  }

  const modulesOf = (plan: ReturnType<typeof planSession>) =>
    plan.blocks.filter((block) => block.kind === 'encode').map((block) => block.moduleId)

  it('gibt dem Schwerpunkt jede zweite Runde', () => {
    const plan = planSession({ ...base, pools, modules: ['words', 'faces', 'numbers'], focus: 'numbers' })
    const rounds = modulesOf(plan)
    expect(rounds.length).toBeGreaterThan(2)
    rounds.forEach((moduleId, index) => {
      if (index % 2 === 0) expect(moduleId).toBe('numbers')
      else expect(moduleId).not.toBe('numbers')
    })
    expect(plan.focus).toBe('numbers')
  })

  it('lässt die anderen Module weiterlaufen', () => {
    const plan = planSession({ ...base, pools, modules: ['words', 'faces', 'numbers'], focus: 'numbers' })
    const others = modulesOf(plan).filter((moduleId) => moduleId !== 'numbers')
    expect(new Set(others).size).toBeGreaterThan(1)
  })

  it('übergeht einen Schwerpunkt, der in dieser Zeit gar nicht vorkommt', () => {
    expect(learnableModules(60)).not.toContain('palace')
    expect(learnableModules(300)).toContain('palace')
    const plan = planSession({ ...base, mode: 'emergency', pools, focus: 'palace' })
    expect(plan.focus).toBeUndefined()
  })

  it('lässt der Lektion den Vortritt', () => {
    const plan = planSession({
      ...base,
      mode: 'daily',
      pools,
      modules: ['words', 'numbers'],
      taught: [],
      focus: 'words',
    })
    expect(plan.blocks[0]?.kind).toBe('teach')
    expect(modulesOf(plan)[0]).toBe('numbers')
    expect(plan.focus).toBeUndefined()
  })

  it('plant ohne Schwerpunkt genauso wie bisher', () => {
    const plain = planSession({ ...base, pools, modules: ['words', 'faces', 'numbers'] })
    expect(plain.focus).toBeUndefined()
    const rounds = modulesOf(plain)
    expect(new Set(rounds).size).toBeGreaterThan(1)
  })
})

describe('die Trainingsbilanz (V2)', () => {
  it('zählt Tage je Sieben-Tage-Fenster — dedupliziert, Zukunft und Uraltes fallen', () => {
    const bars = trainingFootprint(
      [
        '2026-08-19',
        '2026-08-19',
        '2026-08-13',
        '2026-08-12',
        '2026-08-20',
        '2026-01-01',
      ],
      '2026-08-19',
      8,
    )
    expect(bars).toHaveLength(8)
    expect(bars[7]?.daysTrained).toBe(2)
    expect(bars[6]?.daysTrained).toBe(1)
    expect(bars.slice(0, 6).every((week) => week.daysTrained === 0)).toBe(true)
  })

  it('bleibt bei leerem Verlauf leer — und bei null Fenstern still', () => {
    expect(trainingFootprint([], '2026-08-19', 4).every((week) => week.daysTrained === 0)).toBe(
      true,
    )
    expect(trainingFootprint(['2026-08-19'], '2026-08-19', 0)).toHaveLength(0)
  })
})
