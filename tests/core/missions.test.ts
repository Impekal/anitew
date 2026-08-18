import { describe, expect, it } from 'vitest'

import {
  FACT_KINDS,
  answerFor,
  factKindOf,
  missionFacts,
  missionFor,
  personOf,
} from '../../src/core/content/missions.ts'
import { namePool } from '../../src/core/content/names.ts'
import { gradePrompted, promptedHits } from '../../src/core/session/grading.ts'
import {
  displayOf,
  leniencyFor,
  planSession,
  secondsPerItemFor,
  subjectOf,
  targetOf,
  type Pools,
} from '../../src/core/session/plan.ts'

describe('die Szene einer Mission (H1, H2, H4)', () => {
  it('ergibt aus derselben Person immer dieselbe Szene', () => {
    // Darauf beruht das Wiedersehen: „Elena — welches Zimmer?“ hat in drei
    // Wochen dieselbe Antwort wie heute.
    expect(missionFor('Elena', 'de')).toEqual(missionFor('Elena', 'de'))
    expect(missionFor('Elena', 'de')).not.toEqual(missionFor('Elias', 'de'))
  })

  it('gibt derselben Person in zwei Sprachen zwei Szenen', () => {
    // Sie sind auch zwei Gedächtnisinhalte — genauso wie „Anker“ und „anchor“.
    expect(missionFor('Elena', 'de')).not.toEqual(missionFor('Elena', 'en'))
  })

  it('hat jede Art Tatsache genau einmal', () => {
    const mission = missionFor('Elena', 'de')
    expect(mission.facts.map((fact) => fact.kind)).toEqual([...FACT_KINDS])
  })

  it('bleibt in sinnvollen Werten', () => {
    for (const person of namePool('de')) {
      const mission = missionFor(person, 'de')
      const value = (kind: string) => mission.facts.find((fact) => fact.kind === kind)?.value ?? ''
      // Zimmer dreistellig, erste Ziffer nie null — eine „014“ gibt es nicht.
      expect(value('room')).toMatch(/^[1-9][0-9]{2}$/)
      // Uhrzeit im Fünf-Minuten-Raster zwischen 6 und 23 Uhr.
      expect(value('time')).toMatch(/^(0[6-9]|1[0-9]|2[0-3]):[0-5][05]$/)
      expect(value('object')).toMatch(/^\S+ \S+$/)
      expect(value('place').length).toBeGreaterThan(2)
    }
  })

  it('streut die Bausteine, statt allen dasselbe zu geben', () => {
    // Eine feste Szene wäre nach dem zweiten Mal auswendig gelernt.
    const people = namePool('de').slice(0, 24)
    const rooms = new Set(people.map((person) => answerFor(`${person}#room`, 'de')))
    const objects = new Set(people.map((person) => answerFor(`${person}#object`, 'de')))
    expect(rooms.size).toBeGreaterThan(people.length * 0.8)
    expect(objects.size).toBeGreaterThan(8)
  })

  it('zerlegt eine Kennung wieder in Anker und Art', () => {
    expect(missionFacts('Elena')).toEqual([
      'Elena#room',
      'Elena#object',
      'Elena#time',
      'Elena#place',
    ])
    expect(personOf('Elena#room')).toBe('Elena')
    expect(factKindOf('Elena#room')).toBe('room')
    // Fremde Kennungen ergeben nichts, statt etwas zu erfinden.
    expect(factKindOf('Elena')).toBeUndefined()
    expect(factKindOf('Elena#haarfarbe')).toBeUndefined()
    expect(personOf('Elena')).toBe('Elena')
  })

  it('findet die Antwort zu einer Kennung zurück', () => {
    const mission = missionFor('Elena', 'de')
    const room = mission.facts.find((fact) => fact.kind === 'room')?.value
    expect(answerFor('Elena#room', 'de')).toBe(room)
    expect(answerFor('Elena', 'de')).toBeUndefined()
  })
})

describe('Kennung und Antwort sind nicht dasselbe (H1)', () => {
  it('fragt nach dem Wert und verbucht die Kennung', () => {
    /*
     * Der Unterschied fällt nur bei den Missionen auf, und dort entscheidet
     * er alles: Gefragt wird „314“, gemerkt wird `Elena#room`. Wer nur die
     * Werte zurückbekommt, kann daraus keinen Wiederholungstermin machen —
     * und zwei Szenen mit demselben Zimmer wären nicht auseinanderzuhalten.
     */
    const room = answerFor('Elena#room', 'de') as string
    expect(targetOf('missions', 'Elena#room', 'de')).toBe(room)
    expect(displayOf('missions', 'Elena#room', 'de')).toBe(`Elena · ${room}`)

    // Überall sonst ist beides dasselbe.
    expect(targetOf('words', 'Anker', 'de')).toBe('Anker')
    expect(displayOf('words', 'Anker', 'de')).toBe('Anker')
  })

  it('kennt den Anker eines Gegenstands', () => {
    expect(subjectOf('missions', 'Elena#time')).toBe('Elena')
    expect(subjectOf('faces', 'Elena')).toBe('Elena')
  })

  it('gibt Zahlen und Wörtern innerhalb einer Szene die richtige Strenge', () => {
    // 314 und 341 sind nicht dasselbe Zimmer, 18:40 nicht 18:04 — der
    // Gegenstand und der Name des Lokals sind Wörter (D-012).
    expect(leniencyFor('missions', 'Elena#room')).toBe('exact')
    expect(leniencyFor('missions', 'Elena#time')).toBe('exact')
    expect(leniencyFor('missions', 'Elena#object')).toBe('typos')
    expect(leniencyFor('missions', 'Elena#place')).toBe('typos')
  })

  it('wendet die Strenge Stelle für Stelle an', () => {
    /*
     * Der Kern der gemischten Szene: In *einer* Abfrage stehen eine Zahl und
     * ein Wort nebeneinander. Eine gemeinsame Strenge müsste sich für eine
     * Sorte entscheiden und läge bei der anderen falsch.
     */
    const targets = ['314', 'roter Koffer']
    const answers = ['341', 'roter Kofer']
    expect(promptedHits(answers, targets, ['exact', 'typos'])).toEqual([false, true])
    // Zur Gegenprobe: mit einer gemeinsamen Strenge stimmt immer eine Seite nicht.
    expect(promptedHits(answers, targets, 'exact')).toEqual([false, false])
    expect(gradePrompted(answers, targets, ['exact', 'typos']).correct).toEqual(['roter Koffer'])
  })
})

describe('die Mission im Plan (H1)', () => {
  const people = namePool('de')
  const pools: Pools = {
    words: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
    faces: [],
    numbers: [],
    missions: people,
    palace: [],
  }
  const base = { day: '2026-08-17', language: 'de', seed: 'mission', pools }

  it('macht aus einer Runde genau eine Szene', () => {
    /*
     * Der übliche Weg — so viele Gegenstände, wie in die Sekunden passen —
     * ergäbe drei halbe Szenen. Eine Mission ist keine Vorratsmenge, aus der
     * man abzählt, sondern eine Einheit.
     */
    const plan = planSession({ ...base, mode: 'daily', modules: ['missions'] })
    for (const block of plan.blocks) {
      expect(block.items).toHaveLength(FACT_KINDS.length)
      // Alle Tatsachen einer Runde gehören zu derselben Person.
      expect(new Set(block.items.map(personOf)).size).toBe(1)
    }
  })

  it('gibt der Szene mehr Zeit als einem Wort', () => {
    // Person, Zimmer, Gegenstand, Uhrzeit und Ort stehen gleichzeitig da, und
    // gemerkt werden soll ihr Zusammenhang.
    expect(secondsPerItemFor('missions')).toBeGreaterThan(secondsPerItemFor('words'))
  })

  it('hält das Zeitbudget trotzdem auf die Sekunde ein', () => {
    for (const mode of ['emergency', 'short', 'daily', 'extended'] as const) {
      const plan = planSession({ ...base, mode, modules: ['missions'] })
      const sum = plan.blocks.reduce((total, block) => total + block.seconds, 0)
      expect(sum, mode).toBe(plan.totalSeconds)
    }
  })

  it('nimmt eine Person nicht noch einmal, wenn ihre Szene fällig ist', () => {
    /*
     * Ohne das könnte Elena am selben Tag als **neue** Szene eingeprägt und
     * am Ende als Wiedersehen abgefragt werden — der Abruf hätte dann nicht
     * die Erinnerung von vorgestern gemessen, sondern die von vor zwei
     * Minuten. Denselben Fall gab es bei den Wörtern schon einmal; nur
     * greift der Vergleich hier nicht am Gegenstand, sondern am Anker.
     */
    const plan = planSession({
      ...base,
      mode: 'extended',
      modules: ['missions'],
      due: { missions: people.slice(0, 20).map((person) => `${person}#room`) },
    })
    const learned = plan.blocks
      .filter((block) => block.kind === 'encode')
      .flatMap((block) => block.items.map(personOf))
    for (const person of learned) {
      expect(people.slice(0, 20)).not.toContain(person)
    }
  })

  it('sagt es deutlich, wenn der Personenvorrat leer ist', () => {
    expect(() =>
      planSession({ ...base, mode: 'daily', pools: { ...pools, missions: [] }, modules: ['missions'] }),
    ).toThrow(RangeError)
  })
})
