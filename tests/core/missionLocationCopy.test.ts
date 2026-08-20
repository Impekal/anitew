import { describe, expect, it } from 'vitest'

import { dictionaryFor } from '../../src/i18n/index.ts'

describe('H2 Missions-Lage in der Oberfläche', () => {
  it('hat eine eigene deutsche Frage und Eingabehilfe', () => {
    const dictionary = dictionaryFor('de')
    expect(dictionary.session.missionAsk.location).toBe('Wo lag der Gegenstand?')
    expect(dictionary.session.missionPlaceholders.location).toBe('Position')
  })

  it('hat eine eigene englische Frage und fällt für unübersetzte Oberflächen auf Englisch zurück', () => {
    const english = dictionaryFor('en')
    expect(english.session.missionAsk.location).toBe('Where was the object?')
    expect(english.session.missionPlaceholders.location).toBe('Position')

    const spanishUiFallback = dictionaryFor('es')
    expect(spanishUiFallback.session.missionAsk.location).toBe('Where was the object?')
    expect(spanishUiFallback.session.missionPlaceholders.location).toBe('Position')
  })
})
