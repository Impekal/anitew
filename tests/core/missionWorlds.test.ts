import { describe, expect, it } from 'vitest'

import {
  MISSION_WORLDS,
  answerFor,
  hasMissionPool,
  missionFacts,
  missionFor,
  missionPool,
  missionWorldLabel,
  missionWorldOf,
  personOf,
} from '../../src/core/content/missions.ts'
import { namePool } from '../../src/core/content/names.ts'

describe('Missionswelten (H4/H5)', () => {
  it('lässt alle historischen Hotel-IDs und -Personen unangetastet', () => {
    const legacy = namePool('de')
    const pool = missionPool(legacy, 'de')

    expect(pool.slice(0, legacy.length)).toEqual(legacy)
    expect(missionFacts('Elena')).toEqual([
      'Elena#room',
      'Elena#object',
      'Elena#location',
      'Elena#time',
      'Elena#place',
    ])
    expect(missionWorldOf('Elena#room', 'de')).toBe('hotel')
    expect(missionFor('Elena', 'de')).toEqual(missionFor('Elena#room', 'de'))
  })

  it('gibt neuen Welten neue menschliche IDs statt technischer Suffixe', () => {
    const legacy = namePool('de')
    const pool = missionPool(legacy, 'de')
    const conferencePerson = pool[legacy.length]
    const coworkingPerson = pool[legacy.length + 8]

    expect(conferencePerson).toBe('Amandine')
    expect(coworkingPerson).toBe('Bridget')
    expect(personOf(`${conferencePerson}#room`)).toBe('Amandine')
    expect(missionWorldOf(`${conferencePerson}#room`, 'de')).toBe('conference')
    expect(missionWorldOf(`${coworkingPerson}#room`, 'de')).toBe('coworking')
    expect(missionFacts(conferencePerson!)[0]).toBe('Amandine#room')
  })

  it('erzeugt für die drei Welten wirklich verschiedene Szenen', () => {
    const legacy = namePool('de')
    const pool = missionPool(legacy, 'de')
    const hotel = missionFor(legacy[0]!, 'de')
    const conference = missionFor(pool[legacy.length]!, 'de')
    const coworking = missionFor(pool[legacy.length + 8]!, 'de')

    expect(conference).not.toEqual(hotel)
    expect(coworking).not.toEqual(hotel)
    expect(coworking).not.toEqual(conference)
    expect(conference.facts.find((fact) => fact.kind === 'room')?.value).toMatch(/^\d+$/)
    expect(coworking.facts.find((fact) => fact.kind === 'room')?.value).toMatch(/^\d+$/)
  })

  it('trägt eine neue Welt bis in einzelne FSRS-fähige Tatsachen', () => {
    const legacy = namePool('de')
    const conferencePerson = missionPool(legacy, 'de')[legacy.length]!
    const room = `${conferencePerson}#room`
    const object = `${conferencePerson}#object`

    expect(answerFor(room, 'de')).toMatch(/^\d+$/)
    expect(answerFor(object, 'de')).toBeTruthy()
    expect(answerFor(room, 'de')).toBe(answerFor(room, 'de'))
  })

  it('mischt neue Personen nicht in den alten Namensvorrat derselben Sprache', () => {
    for (const language of ['de', 'en', 'fr', 'es'] as const) {
      const legacy = namePool(language)
      const pool = missionPool(legacy, language)
      const added = pool.slice(legacy.length)

      expect(added).toHaveLength(16)
      expect(added.every((person) => !legacy.includes(person))).toBe(true)
      expect(new Set(pool).size).toBe(pool.length)
    }
  })

  it('hat in jeder freigeschalteten Trainingssprache alle drei Welten', () => {
    for (const language of ['de', 'en', 'fr', 'es'] as const) {
      expect(hasMissionPool(language)).toBe(true)
      const legacy = namePool(language)
      const pool = missionPool(legacy, language)
      const worlds = new Set(pool.map((person) => missionWorldOf(person, language)))

      expect([...worlds].sort()).toEqual([...MISSION_WORLDS].sort())
      for (const person of pool.slice(0, legacy.length + 2)) {
        expect(missionFor(person, language).facts).toHaveLength(5)
        expect(missionWorldLabel(person, language)).toBeTruthy()
      }
    }
  })
})
