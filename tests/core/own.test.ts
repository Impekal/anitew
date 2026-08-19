import { describe, expect, it } from 'vitest'

import {
  OWN_SEPARATOR,
  encodeFact,
  factAnswer,
  factPrompt,
  parseOwnText,
} from '../../src/core/content/own.ts'
import { MODES } from '../../src/core/modes.ts'
import {
  type Pools,
  displayOf,
  isPrompted,
  leniencyFor,
  planSession,
  targetOf,
} from '../../src/core/session/plan.ts'

/**
 * Eigene Inhalte (I · D-032).
 *
 * Die Regeln hinter den Fällen: **halbautomatisch** (der Parser schlägt vor,
 * nichts wird halb erkannt), **sichtbar statt verschluckt** (was nicht
 * bricht, steht unter `rejected`), und die Strenge folgt dem Gegenstand.
 */
describe('der Paar-Parser', () => {
  it('versteht Strich, Doppelpunkt und Tabulator — je Zeile ein Paar', () => {
    const { facts, rejected } = parseOwnText(
      'Hauptstadt von Portugal – Lissabon\nNotruf: 112\nlinks\tgauche',
    )
    expect(facts).toEqual([
      { prompt: 'Hauptstadt von Portugal', answer: 'Lissabon' },
      { prompt: 'Notruf', answer: '112' },
      { prompt: 'links', answer: 'gauche' },
    ])
    expect(rejected).toEqual([])
  })

  it('bricht „19:30 – Abfahrt“ am Strich, nicht in der Uhrzeit', () => {
    expect(parseOwnText('19:30 – Abfahrt nach Basel').facts).toEqual([
      { prompt: '19:30', answer: 'Abfahrt nach Basel' },
    ])
  })

  it('verschluckt nichts: Zeilen ohne Trennung stehen sichtbar draußen', () => {
    const { facts, rejected } = parseOwnText('nur ein Wort\nEbbe – Flut')
    expect(facts).toEqual([{ prompt: 'Ebbe', answer: 'Flut' }])
    expect(rejected).toEqual(['nur ein Wort'])
  })

  it('behält bei doppelter Frage die erste Antwort', () => {
    const { facts } = parseOwnText('Tor – Goal\nTor – Gate')
    expect(facts).toEqual([{ prompt: 'Tor', answer: 'Goal' }])
  })

  it('wäscht Steuerzeichen aus — die Kennung bleibt dadurch eindeutig', () => {
    const dirty = `Frage${OWN_SEPARATOR}mitten – drin`
    const { facts } = parseOwnText(dirty)
    expect(facts).toEqual([{ prompt: 'Frage mitten', answer: 'drin' }])
    const item = encodeFact(facts[0] as { prompt: string; answer: string })
    expect(factPrompt(item)).toBe('Frage mitten')
    expect(factAnswer(item)).toBe('drin')
  })
})

describe('das Modul Eigenes', () => {
  const item = encodeFact({ prompt: 'Hauptstadt von Portugal', answer: 'Lissabon' })

  it('fragt gestützt: die Frage steht da, gesucht ist die Antwort', () => {
    expect(isPrompted('facts')).toBe(true)
    expect(targetOf('facts', item, 'de')).toBe('Lissabon')
    expect(displayOf('facts', item, 'de')).toBe('Hauptstadt von Portugal · Lissabon')
  })

  it('vergleicht nach dem Gegenstand: Zahlen genau, Wörter nachsichtig', () => {
    expect(leniencyFor('facts', encodeFact({ prompt: 'Notruf', answer: '112' }))).toBe('exact')
    expect(leniencyFor('facts', item)).toBe('typos')
  })

  it('fällt ohne Vorrat still aus der Lernrotation — mit Vorrat ist es drin', () => {
    const pools: Pools = {
      words: Array.from({ length: 30 }, (_, index) => `w${index}`),
      faces: [],
      numbers: [],
      missions: [],
      palace: [],
      reverse: [],
      twins: [],
      gaze: [],
      facts: [], memory: [],
    }
    const base = { day: '2026-08-19', language: 'de', seed: 'own', mode: 'daily' } as const

    const without = planSession({ ...base, pools, modules: ['words', 'facts'] })
    expect(without.blocks.some((block) => block.moduleId === 'facts')).toBe(false)

    const cards = Array.from({ length: 8 }, (_, index) =>
      encodeFact({ prompt: `Frage ${index}`, answer: `Antwort ${index}` }),
    )
    const with_ = planSession({
      ...base,
      pools: { ...pools, facts: cards },
      modules: ['words', 'facts'],
    })
    expect(with_.blocks.some((block) => block.moduleId === 'facts')).toBe(true)
    const total = with_.blocks.reduce((sum, block) => sum + block.seconds, 0)
    expect(total).toBe(MODES.daily.seconds)
  })
})
