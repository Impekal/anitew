import { describe, expect, it } from 'vitest'

import {
  benchmarkPool,
  canTrainIn,
  gazeVocabulary,
  hasBenchmarkPool,
  hasGazePool,
  hasMissionPool,
  hasNamePool,
  hasPalacePool,
  hasTwinPool,
  hasWordPool,
  missionFor,
  missionObjectFor,
  missionPool,
  missionWorldOf,
  namePool,
  trainingLanguages,
  twinPairs,
  wordPool,
} from '../../src/core/index.ts'

describe('Italienisch trainieren', () => {
  it('hat jeden Inhaltsvorrat und wird erst dann freigeschaltet', () => {
    expect(hasWordPool('it')).toBe(true)
    expect(hasNamePool('it')).toBe(true)
    expect(hasMissionPool('it')).toBe(true)
    expect(hasPalacePool('it')).toBe(true)
    expect(hasTwinPool('it')).toBe(true)
    expect(hasGazePool('it')).toBe(true)
    expect(hasBenchmarkPool('it')).toBe(true)
    expect(benchmarkPool('it').length).toBeGreaterThanOrEqual(60)
    expect(canTrainIn('it')).toBe(true)
    expect([...trainingLanguages()]).toContain('it')
  })

  it('verwendet eigene italienische Inhalte statt Rückfalllisten', () => {
    expect(wordPool('it')).not.toEqual(wordPool('en'))
    expect(namePool('it')).not.toEqual(namePool('en'))
    expect(wordPool('it').length).toBeGreaterThanOrEqual(60)
    expect(namePool('it').length).toBeGreaterThanOrEqual(40)
    expect(twinPairs('it').length).toBeGreaterThanOrEqual(15)
    expect(gazeVocabulary('it')).toContain('ombrello')
    expect(gazeVocabulary('it')).toContain('viola')
  })

  it('hält Messwörter und Interferenz-Zwillinge aus dem freien Worttraining heraus', () => {
    const training = new Set(wordPool('it').map((word) => word.toLocaleLowerCase('it')))
    expect(benchmarkPool('it').filter((word) => training.has(word.toLocaleLowerCase('it')))).toEqual([])
    expect(
      twinPairs('it').flat().filter((word) => training.has(word.toLocaleLowerCase('it'))),
    ).toEqual([])
  })

  it('stellt in italienischen Missionen das Farbadjektiv hinter ein maskulines Objekt', () => {
    const colours = ['rosso', 'blu', 'verde', 'giallo', 'nero', 'bianco', 'grigio', 'marrone']
    for (const person of namePool('it').slice(0, 12)) {
      const object = missionObjectFor(person, 'it')
      const pieces = object.split(' ')
      expect(colours).toContain(pieces.at(-1))
      expect(colours).not.toContain(pieces[0])
    }
  })

  it('liefert Hotel, Konferenz und Coworking als getrennte reproduzierbare Welten', () => {
    const pool = missionPool(namePool('it'), 'it')
    expect(new Set(pool.map((person) => missionWorldOf(person, 'it')))).toEqual(
      new Set(['hotel', 'conference', 'coworking']),
    )
    for (const person of pool.slice(-16)) {
      expect(missionFor(person, 'it')).toEqual(missionFor(person, 'it'))
    }
  })
})
