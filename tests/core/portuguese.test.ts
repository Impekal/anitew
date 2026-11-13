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

describe('Portugiesisch trainieren', () => {
  it('hat jeden Inhaltsvorrat und wird erst dann freigeschaltet', () => {
    expect(hasWordPool('pt')).toBe(true)
    expect(hasNamePool('pt')).toBe(true)
    expect(hasMissionPool('pt')).toBe(true)
    expect(hasPalacePool('pt')).toBe(true)
    expect(hasTwinPool('pt')).toBe(true)
    expect(hasGazePool('pt')).toBe(true)
    expect(hasBenchmarkPool('pt')).toBe(true)
    expect(benchmarkPool('pt').length).toBeGreaterThanOrEqual(60)
    expect(canTrainIn('pt')).toBe(true)
    expect([...trainingLanguages()]).toContain('pt')
  })

  it('verwendet eigene portugiesische Inhalte statt Rückfalllisten', () => {
    expect(wordPool('pt')).not.toEqual(wordPool('en'))
    expect(namePool('pt')).not.toEqual(namePool('en'))
    expect(wordPool('pt').length).toBeGreaterThanOrEqual(60)
    expect(namePool('pt').length).toBeGreaterThanOrEqual(40)
    expect(twinPairs('pt').length).toBeGreaterThanOrEqual(15)
    expect(gazeVocabulary('pt')).toContain('guarda-chuva')
    expect(gazeVocabulary('pt')).toContain('roxo')
  })

  it('hält Messwörter und Interferenz-Zwillinge aus dem freien Worttraining heraus', () => {
    const training = new Set(wordPool('pt').map((word) => word.toLocaleLowerCase('pt')))
    expect(benchmarkPool('pt').filter((word) => training.has(word.toLocaleLowerCase('pt')))).toEqual([])
    expect(
      twinPairs('pt').flat().filter((word) => training.has(word.toLocaleLowerCase('pt'))),
    ).toEqual([])
  })

  it('stellt in portugiesischen Missionen das Farbadjektiv hinter das Objekt', () => {
    const colours = ['vermelho', 'azul', 'verde', 'amarelo', 'preto', 'branco', 'cinza', 'marrom']
    for (const person of namePool('pt').slice(0, 12)) {
      const object = missionObjectFor(person, 'pt')
      const pieces = object.split(' ')
      expect(colours).toContain(pieces.at(-1))
      expect(colours).not.toContain(pieces[0])
    }
  })

  it('liefert Hotel, Konferenz und Coworking als getrennte reproduzierbare Welten', () => {
    const pool = missionPool(namePool('pt'), 'pt')
    expect(new Set(pool.map((person) => missionWorldOf(person, 'pt')))).toEqual(
      new Set(['hotel', 'conference', 'coworking']),
    )
    for (const person of pool.slice(-16)) {
      expect(missionFor(person, 'pt')).toEqual(missionFor(person, 'pt'))
    }
  })
})
