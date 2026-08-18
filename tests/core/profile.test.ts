import { describe, expect, it } from 'vitest'

import {
  DIMENSIONS,
  MIN_CHANCES,
  SOURCES,
  TRAINING_MODULES,
  type DimensionId,
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
  }

  const modulesOf = (plan: ReturnType<typeof planSession>) =>
    plan.blocks.filter((block) => block.kind === 'encode').map((block) => block.moduleId)

  it('gibt dem Schwerpunkt jede zweite Runde', () => {
    /*
     * Nicht alle Runden: Eine Einheit, die nur noch das Schwächste übt, ist
     * keine Personalisierung, sondern eine Strafe für eine Schwäche — und sie
     * ließe alles andere verfallen, obwohl der Wiederholungsplan es weiter für
     * fällig hält.
     */
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
    /*
     * Der Palast wird unter drei Minuten nicht gelernt (D-020). Ihn dann als
     * Schwerpunkt zu setzen hieße, einen Schwerpunkt zu versprechen, den der
     * Plan nicht einhält — deshalb benutzt der Startbildschirm dieselbe Regel
     * (`learnableModules`) und kündigt ihn gar nicht erst an.
     */
    expect(learnableModules(60)).not.toContain('palace')
    expect(learnableModules(300)).toContain('palace')
    const plan = planSession({ ...base, mode: 'emergency', pools, focus: 'palace' })
    expect(plan.focus).toBeUndefined()
  })

  it('lässt der Lektion den Vortritt', () => {
    // Unterricht ohne Anwendung ist am nächsten Tag wieder weg (D5). Wer heute
    // die erste Ziffer lernt, fängt mit Zahlen an, auch wenn Wörter schwächer
    // sind.
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
    // Die Gegenprobe: Ohne Profilaussage ändert sich am Plan nichts.
    const plain = planSession({ ...base, pools, modules: ['words', 'faces', 'numbers'] })
    expect(plain.focus).toBeUndefined()
    const rounds = modulesOf(plain)
    expect(new Set(rounds).size).toBeGreaterThan(1)
  })
})
