import { describe, expect, it } from 'vitest'

import {
  benchmarkPool,
  canTrainIn,
  hasMissionPool,
  hasNamePool,
  hasPalacePool,
  hasWordPool,
  missionFor,
  namePool,
  trainingLanguages,
  wordPool,
} from '../../src/core/index.ts'

/**
 * Französisch als **Trainingssprache** (Backlog L2, L6, L7).
 *
 * Nicht die Oberfläche — die bleibt Deutsch oder Englisch (L7). Geprüft wird,
 * dass der Inhalt vollständig da ist und dass die eine Stelle stimmt, an der
 * Französisch anders ist als Deutsch: die **Farbe steht hinter dem
 * Substantiv** („sac rouge“, nicht „rouge sac“).
 */
describe('Französisch trainieren', () => {
  it('hat alle fünf Vorräte — sonst wäre es keine Trainingssprache', () => {
    expect(hasWordPool('fr')).toBe(true)
    expect(hasNamePool('fr')).toBe(true)
    expect(hasMissionPool('fr')).toBe(true)
    expect(hasPalacePool('fr')).toBe(true)
    expect(benchmarkPool('fr').length).toBeGreaterThanOrEqual(20)
    expect(canTrainIn('fr')).toBe(true)
    expect([...trainingLanguages()]).toContain('fr')
  })

  it('zieht aus einem eigenen Wortschatz, nicht dem deutschen', () => {
    expect(wordPool('fr')).not.toEqual(wordPool('de'))
    expect(namePool('fr')).not.toEqual(namePool('en'))
  })

  it('stellt die Farbe hinter den Gegenstand', () => {
    /*
     * Die Reihenfolge der Ziehung bleibt (Farbe zuerst), damit sich die
     * deutschen und englischen Szenen nicht ändern — nur der zusammengesetzte
     * Text dreht sich. Geprüft über die Grundfarben, die im Französischen
     * maskulin und einwortig sind.
     */
    const colours = ['rouge', 'bleu', 'vert', 'jaune', 'noir', 'blanc', 'gris', 'brun']
    for (const person of namePool('fr').slice(0, 12)) {
      const object = missionFor(person, 'fr').facts.find((f) => f.kind === 'object')?.value ?? ''
      const [noun, colour] = object.split(' ')
      expect(colour, `„${object}“ endet nicht auf einer Farbe`).toBeDefined()
      expect(colours, `„${object}“: „${colour}“ ist keine der Grundfarben`).toContain(colour)
      // Das Substantiv steht vorn und ist keine Farbe.
      expect(colours).not.toContain(noun)
    }
  })

  it('ergibt dieselbe Szene für dieselbe Person — auch auf Französisch', () => {
    expect(missionFor('Hugo', 'fr')).toEqual(missionFor('Hugo', 'fr'))
    // Und eine andere als auf Deutsch: gleiche Person, andere Sprache, andere
    // Gedächtnisinhalte.
    expect(missionFor('Hugo', 'fr')).not.toEqual(missionFor('Hugo', 'de'))
  })
})
