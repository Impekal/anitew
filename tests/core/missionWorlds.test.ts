import { describe, expect, it } from 'vitest'

import {
  MISSION_WORLDS,
  answerFor,
  hasMissionPool,
  missionAnchor,
  missionAnchorOf,
  missionFacts,
  missionFor,
  missionPool,
  missionWorldLabel,
  missionWorldOf,
  personOf,
} from '../../src/core/content/missions.ts'

describe('Missionswelten (H4/H5)', () => {
  it('lässt das historische Hotel-ID-Format unangetastet', () => {
    expect(missionAnchor('Elena', 'hotel')).toBe('Elena')
    expect(missionFacts('Elena')).toEqual([
      'Elena#room',
      'Elena#object',
      'Elena#location',
      'Elena#time',
      'Elena#place',
    ])
    expect(missionWorldOf('Elena#room')).toBe('hotel')
    expect(missionFor('Elena', 'de')).toEqual(missionFor(missionAnchor('Elena', 'hotel'), 'de'))
  })

  it('gibt neuen Welten eigene stabile Anker ohne den Personennamen zu verfälschen', () => {
    const conference = missionAnchor('Elena', 'conference')
    const coworking = missionAnchor('Elena', 'coworking')

    expect(conference).toBe('Elena~m:conference')
    expect(coworking).toBe('Elena~m:coworking')
    expect(missionAnchorOf(`${conference}#room`)).toBe(conference)
    expect(personOf(`${conference}#room`)).toBe('Elena')
    expect(missionWorldOf(`${conference}#room`)).toBe('conference')
    expect(missionFacts(conference)[0]).toBe('Elena~m:conference#room')
  })

  it('erzeugt aus derselben Person in verschiedenen Welten verschiedene Szenen', () => {
    const hotel = missionFor(missionAnchor('Elena', 'hotel'), 'de')
    const conference = missionFor(missionAnchor('Elena', 'conference'), 'de')
    const coworking = missionFor(missionAnchor('Elena', 'coworking'), 'de')

    expect(conference).not.toEqual(hotel)
    expect(coworking).not.toEqual(hotel)
    expect(coworking).not.toEqual(conference)
    expect(conference.person).toBe('Elena')
    expect(coworking.person).toBe('Elena')
  })

  it('trägt den Weltanker bis in einzelne FSRS-fähige Tatsachen', () => {
    const anchor = missionAnchor('Mira', 'conference')
    const room = `${anchor}#room`
    const object = `${anchor}#object`

    expect(answerFor(room, 'de')).toMatch(/^\d+$/)
    expect(answerFor(object, 'de')).toBeTruthy()
    expect(answerFor(room, 'de')).toBe(answerFor(room, 'de'))
  })

  it('verteilt einen Personenvorrat deterministisch auf genau eine Welt je Person', () => {
    const people = ['Amina', 'Bela', 'Chen', 'Dario', 'Elena', 'Fatou']
    const pool = missionPool(people)

    expect(pool).toHaveLength(people.length)
    expect(pool.map(personOf)).toEqual(people)
    expect(pool.map(missionWorldOf)).toEqual([
      'hotel',
      'conference',
      'coworking',
      'hotel',
      'conference',
      'coworking',
    ])
  })

  it('hat für jede freigeschaltete Trainingssprache alle drei Welten', () => {
    for (const language of ['de', 'en', 'fr', 'es'] as const) {
      expect(hasMissionPool(language)).toBe(true)
      for (const world of MISSION_WORLDS) {
        const anchor = missionAnchor('Elena', world)
        expect(missionFor(anchor, language).facts).toHaveLength(5)
        expect(missionWorldLabel(anchor, language)).toBeTruthy()
      }
    }
  })
})
