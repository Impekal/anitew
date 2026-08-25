import { describe, expect, it } from 'vitest'

import { dictionaryFor } from '../../src/i18n/index.ts'

describe('Mission-UI über mehrere Welten', () => {
  it('verwendet auf Deutsch keine Hotel-only-Begriffe mehr', () => {
    const dictionary = dictionaryFor('de')

    expect(dictionary.mission.room).toBe('Nummer')
    expect(dictionary.mission.departure).toBe('Zeit')
    expect(dictionary.mission.restaurant).toBe('Ort')
    expect(dictionary.session.missionAsk.room).toBe('Welche Nummer?')
    expect(dictionary.session.missionAsk.time).toBe('Wann war es?')
    expect(dictionary.session.missionAsk.place).toBe('Wie hieß der Ort?')
    expect(dictionary.session.missionAsk.location).toBe('Wo lag der Gegenstand?')
  })

  it('verwendet dieselbe ehrliche Semantik auf Englisch', () => {
    const dictionary = dictionaryFor('en')

    expect(dictionary.mission.room).toBe('Number')
    expect(dictionary.mission.departure).toBe('Time')
    expect(dictionary.mission.restaurant).toBe('Place')
    expect(dictionary.session.missionAsk.room).toBe('Which number?')
    expect(dictionary.session.missionAsk.time).toBe('When was it?')
    expect(dictionary.session.missionAsk.place).toBe('What was the place called?')
    expect(dictionary.session.missionAsk.location).toBe('Where was the object?')
  })

  it('nimmt bei noch nicht übersetzter UI die englische Copy statt gemischter Sprache', () => {
    const dictionary = dictionaryFor('fr')

    expect(dictionary.mission.room).toBe('Number')
    expect(dictionary.session.missionAsk.room).toBe('Which number?')
    expect(dictionary.session.missionAsk.place).toBe('What was the place called?')
  })
})
