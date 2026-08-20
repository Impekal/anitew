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
  namePool,
  trainingLanguages,
  twinPairs,
  wordPool,
} from '../../src/core/index.ts'

describe('Spanisch trainieren', () => {
  it('hat jeden Inhaltsvorrat und wird erst dann freigeschaltet', () => {
    expect(hasWordPool('es')).toBe(true)
    expect(hasNamePool('es')).toBe(true)
    expect(hasMissionPool('es')).toBe(true)
    expect(hasPalacePool('es')).toBe(true)
    expect(hasTwinPool('es')).toBe(true)
    expect(hasGazePool('es')).toBe(true)
    expect(hasBenchmarkPool('es')).toBe(true)
    expect(benchmarkPool('es').length).toBeGreaterThanOrEqual(60)
    expect(canTrainIn('es')).toBe(true)
    expect([...trainingLanguages()]).toContain('es')
  })

  it('verwendet eigene spanische Inhalte statt Rückfalllisten', () => {
    expect(wordPool('es')).not.toEqual(wordPool('de'))
    expect(namePool('es')).not.toEqual(namePool('en'))
    expect(twinPairs('es').length).toBeGreaterThanOrEqual(15)
    expect(gazeVocabulary('es')).toContain('paraguas')
    expect(gazeVocabulary('es')).toContain('morado')
  })

  it('stellt die Farbe in Missionen hinter den Gegenstand', () => {
    const colours = ['rojo', 'azul', 'verde', 'amarillo', 'negro', 'blanco', 'gris', 'marrón']
    for (const person of namePool('es').slice(0, 12)) {
      // H2 zeigt in der Szene zusätzlich die Lage (`balón negro · sobre la
      // cómoda`). Für die Grammatikfrage zählt der eigentliche Gegenstand —
      // genau der Wert, der später bei `#object` abgefragt wird.
      const object = missionObjectFor(person, 'es')
      const pieces = object.split(' ')
      const colour = pieces.at(-1) ?? ''
      expect(colours, `„${object}“ endet nicht auf einer spanischen Farbe`).toContain(colour)
      expect(colours).not.toContain(pieces[0])
    }
  })

  it('erzeugt dieselbe spanische Szene reproduzierbar und getrennt von Deutsch', () => {
    expect(missionFor('Joaquín', 'es')).toEqual(missionFor('Joaquín', 'es'))
    expect(missionFor('Joaquín', 'es')).not.toEqual(missionFor('Joaquín', 'de'))
  })

  it('hält den Benchmark vom freien Worttraining getrennt', () => {
    const training = new Set(wordPool('es').map((word) => word.toLocaleLowerCase('es')))
    const overlap = benchmarkPool('es').filter((word) => training.has(word.toLocaleLowerCase('es')))
    expect(overlap).toEqual([])
  })
})
