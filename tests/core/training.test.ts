import { describe, expect, it } from 'vitest'

import {
  FALLBACK_LANGUAGE,
  SUPPORTED_LANGUAGES,
  canTrainIn,
  hasBenchmarkPool,
  hasMissionPool,
  hasNamePool,
  hasPalacePool,
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
    /*
     * Ein Modul, das mitten in einer Einheit auf Englisch umschaltet, wäre
     * schlimmer als eines, das gar nicht kommt — und die Messung hinge an
     * einem Quarantänevorrat, den es in dieser Sprache nicht gibt (F2a).
     */
    for (const language of SUPPORTED_LANGUAGES) {
      const complete =
        hasWordPool(language) &&
        hasNamePool(language) &&
        hasMissionPool(language) &&
        hasPalacePool(language) &&
        hasBenchmarkPool(language)
      expect(canTrainIn(language)).toBe(complete)
    }
  })

  it('bietet heute genau die an, die vollständig sind', () => {
    expect([...trainingLanguages()]).toEqual(['de', 'en'])
  })

  it('folgt ohne eigene Wahl der Oberfläche', () => {
    // Wer die App auf Deutsch bedient, trainiert auf Deutsch, bis er etwas
    // anderes sagt.
    expect(resolveTrainingLanguage(undefined, 'de')).toBe('de')
    expect(resolveTrainingLanguage(undefined, 'en')).toBe('en')
  })

  it('weicht aus, wenn sich in der Oberflächensprache nicht trainieren lässt', () => {
    // Japanisch ist wählbar, aber es gibt keine japanischen Wörter — dann
    // trainiert man auf der Rückfallsprache, statt japanisch beschriftete
    // englische Wörter zu bekommen.
    expect(resolveTrainingLanguage(undefined, 'ja')).toBe(FALLBACK_LANGUAGE)
  })

  it('behält eine Wahl, die es hergibt', () => {
    expect(resolveTrainingLanguage('en', 'de')).toBe('en')
    expect(resolveTrainingLanguage('de', 'en')).toBe('de')
  })

  it('behält eine Wahl nicht, für die es keinen Inhalt gibt', () => {
    /*
     * Wichtig für später: Fällt ein Vorrat weg oder kommt jemand mit einer
     * eingelesenen Sicherung von einem Gerät mit mehr Inhalt, darf daraus
     * keine Einheit werden, die es nicht geben kann.
     */
    expect(resolveTrainingLanguage('ja', 'de')).toBe('de')
    expect(resolveTrainingLanguage('unsinn', 'de')).toBe('de')
  })
})
