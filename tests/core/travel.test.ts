import { describe, expect, it } from 'vitest'

import {
  AFTER_20_MIN_FROM,
  AFTER_20_MIN_UNTIL,
  type BenchmarkRun,
  DAYS_PER_SHIELD,
  addDays,
  dayKeyOf,
  daysBetween,
  nextStep,
  streakOf,
} from '../../src/core/index.ts'

/**
 * Reisen und verstellte Uhren (Backlog P5, P6).
 *
 * Eine Gedächtnis-App, deren Tagesgrenze und Serie an der Uhr hängen, muss
 * die Frage „was ist heute?“ auch dann richtig beantworten, wenn jemand über
 * Zeitzonen fliegt oder die Geräteuhr verstellt. Der Kern ist dafür gebaut —
 * hier wird es **bewiesen**, nicht behauptet.
 *
 * Die Antwort auf „was ist heute?“ steht in D-023: **der lokale Kalendertag,
 * an dem man gerade ist.** Nicht der Tag am Ort des letzten Trainings, nicht
 * UTC. Das ist, was ein Mensch als „heute“ empfindet — und alles andere
 * verwirrte mehr, als es hülfe.
 */

const BERLIN_SUMMER = 120
const TOKYO = 540
const NEW_YORK_WINTER = -300

describe('was ist heute? — der Ort, an dem man ist (P6)', () => {
  it('gibt denselben Moment je nach Ort als verschiedenen Tag', () => {
    // 18.8. 23:30 in Berlin ist derselbe Augenblick wie 19.8. 06:30 in Tokio.
    // Beide Menschen haben recht — „heute“ ist, wo sie stehen.
    const moment = Date.UTC(2026, 7, 18, 21, 30)
    expect(dayKeyOf(moment, { offsetMinutes: BERLIN_SUMMER })).toBe('2026-08-18')
    expect(dayKeyOf(moment, { offsetMinutes: TOKYO })).toBe('2026-08-19')
    expect(dayKeyOf(moment, { offsetMinutes: NEW_YORK_WINTER })).toBe('2026-08-18')
  })

  it('hält die 4-Uhr-Grenze in jeder Zeitzone', () => {
    // 03:00 Ortszeit zählt überall noch zum Vortag (D-008).
    const tokyo3am = Date.UTC(2026, 7, 18, 18, 0) // 19.8. 03:00 Tokio (UTC+9)
    expect(dayKeyOf(tokyo3am, { offsetMinutes: TOKYO })).toBe('2026-08-18')
  })
})

describe('die Serie auf Reisen (P6)', () => {
  const week = Array.from({ length: DAYS_PER_SHIELD }, (_, i) => addDays('2026-08-01', i))

  it('hält über eine Reise, die einen Tag verschluckt — mit dem Schutztag', () => {
    /*
     * Nach Osten reisen lässt den Kalender vorspringen: In ~27 Stunden können
     * zwei Tagesschlüssel vergehen. Wer eine Woche geübt hat, hat genau
     * dafür einen Schutztag — die Reise kostet die Serie nicht.
     */
    const afterWeek = week[week.length - 1] as string
    const missedByTravel = addDays(afterWeek, 1)
    const today = addDays(afterWeek, 2)
    const streak = streakOf(week, today)

    expect(daysBetween(afterWeek, today)).toBe(2)
    expect(streak.length).toBe(DAYS_PER_SHIELD)
    expect(streak.shieldsUsed).toBe(1)
    expect(streak.heldYesterday).toBe(missedByTravel === addDays(today, -1))
  })

  it('macht aus einem doppelt gelebten Tag keinen zweiten Tag', () => {
    // Nach Westen reisen wiederholt einen Kalendertag. Zwei Einheiten an
    // „demselben“ Tag bleiben ein Tag — die Serie zählt Tage, keine Einheiten.
    const streak = streakOf(['2026-08-10', '2026-08-10', '2026-08-11'], '2026-08-11')
    expect(streak.length).toBe(2)
  })
})

describe('die verstellte Uhr (P5)', () => {
  it('erzeugt aus Zukunftstagen keine Serie', () => {
    // Uhr vorgestellt, trainiert, Uhr zurück: Die „Zukunftstage“ werden
    // übergangen, sonst stünde da eine Serie, die es nicht gibt.
    expect(streakOf(['2026-08-20', '2026-08-21'], '2026-08-18')).toMatchObject({ length: 0 })
  })

  it('behält die echte Serie, wenn nur Zukunftstage danebenliegen', () => {
    const real = ['2026-08-16', '2026-08-17', '2026-08-18']
    const withFuture = [...real, '2026-08-25']
    expect(streakOf(withFuture, '2026-08-18').length).toBe(streakOf(real, '2026-08-18').length)
  })
})

describe('die Messung auf Reisen (P5, P6)', () => {
  const base: BenchmarkRun = {
    ordinal: 3,
    day: '2026-08-18',
    total: 20,
    encodedAt: Date.UTC(2026, 7, 18, 12, 0),
    immediate: 18,
  }

  it('misst das 20-Minuten-Fenster in absoluter Zeit, nicht in Ortszeit', () => {
    /*
     * Das Fenster hängt an `now - encodedAt` — eine Zeitzone verschiebt es
     * nicht. Derselbe Abstand ergibt denselben Schritt, egal welcher Tag
     * gerade „heute“ heißt.
     */
    const at = base.encodedAt! + (AFTER_20_MIN_FROM + AFTER_20_MIN_UNTIL) / 2
    const inBerlin = nextStep(base, at, dayKeyOf(at, { offsetMinutes: BERLIN_SUMMER }))
    const inTokyo = nextStep(base, at, dayKeyOf(at, { offsetMinutes: TOKYO }))
    expect(inBerlin).toEqual({ kind: 'recall', phase: 'after20Minutes' })
    expect(inTokyo).toEqual(inBerlin)
  })

  it('erklärt eine Reise, die den Folgetag überspringt, für verpasst — nicht für falsch', () => {
    /*
     * Reist jemand nach dem zweiten Abruf nach Osten und überspringt so den
     * Folgetag, ist die Messung **missed** und zählt nicht (F1). Das ist
     * ehrlich: Eine Messung zwei Tage später ist keine Messung „am Folgetag“.
     */
    const withSecond: BenchmarkRun = { ...base, after20Minutes: 15 }
    const dayAfterNext = addDays(base.day, 2)
    expect(nextStep(withSecond, Date.now(), dayAfterNext)).toEqual({ kind: 'missed', phase: 'nextDay' })
  })
})
