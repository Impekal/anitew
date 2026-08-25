import { describe, expect, it } from 'vitest'

import {
  FALLBACK_LANGUAGE,
  SUPPORTED_LANGUAGES,
  canTrainIn,
  hasBenchmarkPool,
  hasGazePool,
  hasMissionPool,
  hasNamePool,
  hasPalacePool,
  hasTwinPool,
  hasWordPool,
  resolveTrainingLanguage,
  trainingLanguages,
} from '../../src/core/index.ts'

/**
 * Die Trainingssprache (Backlog L5, L7).
 *
 * Die Regel, um die es geht: **Trainiert wird nur, wofür es eigenen Inhalt
 * gibt.** Für die Oberfläche ist der Rückfall auf Englisch in Ordnung und
 * wird angesagt; für den Inhalt ist er es nicht, weil der Inhalt die Übung
 * ist.
 */
describe('worin sich trainieren lässt', () => {
  it('verlangt alle Vorräte, nicht die meisten', () => {
    for (const language of SUPPORTED_LANGUAGES) {
      const complete =
        hasWordPool(language) &&
        hasNamePool(language) &&
        hasMissionPool(language) &&
        hasPalacePool(language) &&
        hasTwinPool(language) &&
        hasGazePool(language) &&
        hasBenchmarkPool(language)
      expect(canTrainIn(language)).toBe(complete)
    }
  })

  it('bietet heute genau die an, die vollständig sind', () => {
    expect([...trainingLanguages()]).toEqual(['de', 'en', 'fr', 'es', 'it'])
  })

  it('folgt ohne eigene Wahl der Oberfläche', () => {
    expect(resolveTrainingLanguage(undefined, 'de')).toBe('de')
    expect(resolveTrainingLanguage(undefined, 'en')).toBe('en')
  })

  it('weicht aus, wenn sich in der Oberflächensprache nicht trainieren lässt', () => {
    expect(resolveTrainingLanguage(undefined, 'ja')).toBe(FALLBACK_LANGUAGE)
  })

  it('behält eine Wahl, die es hergibt', () => {
    expect(resolveTrainingLanguage('en', 'de')).toBe('en')
    expect(resolveTrainingLanguage('de', 'en')).toBe('de')
    expect(resolveTrainingLanguage('es', 'de')).toBe('es')
    expect(resolveTrainingLanguage('it', 'de')).toBe('it')
  })

  it('behält eine Wahl nicht, für die es keinen Inhalt gibt', () => {
    expect(resolveTrainingLanguage('ja', 'de')).toBe('de')
    expect(resolveTrainingLanguage('unsinn', 'de')).toBe('de')
  })
})
