import { describe, expect, it } from 'vitest'

import {
  AFTER_20_MIN_FROM,
  AFTER_20_MIN_UNTIL,
  benchmarkReminderAt,
  dayKeyOf,
  isTimeOfDay,
  needsDailyReminder,
  nextDailyAt,
  reminderDay,
} from '../../src/core/index.ts'

/**
 * Erinnerungen (Backlog B8 · D-022).
 *
 * Der Kern entscheidet **wann**, nicht **ob**: Ob eine Erinnerung ankommt,
 * hängt an der Plattform, und dass das Web es nicht zusagen kann, steht in
 * `platform/web/reminders.ts`. Hier wird gerechnet — und geprüft, dass die
 * Rechnung dieselbe Zeitrechnung benutzt wie der Rest der App (D-008).
 */

describe('die Erinnerung an die Messung', () => {
  it('liegt in der Mitte des Fensters, nicht an seinem Anfang', () => {
    /*
     * Am Anfang zu erinnern verschenkte die halbe Luft: Das Fenster ist 15 bis
     * 45 Minuten. Zwanzig Minuten lassen fünfundzwanzig, um wirklich
     * zurückzukommen.
     */
    const encoded = 1_000_000_000
    const at = benchmarkReminderAt(encoded)
    expect(at - encoded).toBe(20 * 60_000)
    expect(at - encoded).toBeGreaterThan(AFTER_20_MIN_FROM)
    expect(at - encoded).toBeLessThan(AFTER_20_MIN_UNTIL)
  })
})

describe('die Uhrzeit der Tageserinnerung', () => {
  it('nimmt nur an, was eine Uhrzeit ist', () => {
    expect(isTimeOfDay('19:30')).toBe(true)
    expect(isTimeOfDay('00:00')).toBe(true)
    expect(isTimeOfDay('23:59')).toBe(true)
    expect(isTimeOfDay('24:00')).toBe(false)
    expect(isTimeOfDay('7:30')).toBe(false)
    expect(isTimeOfDay('19:60')).toBe(false)
    expect(isTimeOfDay(1930)).toBe(false)
  })

  it('trifft die Uhrzeit in Ortszeit', () => {
    /*
     * Eine Verabredung um 19:30 ist eine Verabredung um 19:30, egal in welcher
     * Zeitzone jemand sitzt. Gerechnet wird deshalb über denselben Versatz
     * wie beim Trainingstag — zwei Zeitrechnungen in einer App wären eine zu
     * viel (D-008).
     */
    const offset = 120 // Berlin im Sommer
    const noon = Date.UTC(2026, 7, 18, 10, 0) // 12:00 Ortszeit
    const at = nextDailyAt('19:30', noon, offset)
    const local = new Date(at + offset * 60_000)
    expect(local.getUTCHours()).toBe(19)
    expect(local.getUTCMinutes()).toBe(30)
    expect(at).toBeGreaterThan(noon)
  })

  it('verschiebt eine vergangene Uhrzeit auf morgen', () => {
    // Eine Erinnerung in der Vergangenheit ist keine.
    const offset = 120
    const evening = Date.UTC(2026, 7, 18, 19, 0) // 21:00 Ortszeit
    const at = nextDailyAt('19:30', evening, offset)
    expect(at - evening).toBeGreaterThan(0)
    expect(at - evening).toBeLessThan(86_400_000)
    const local = new Date(at + offset * 60_000)
    expect(local.getUTCHours()).toBe(19)
    expect(local.getUTCDate()).toBe(19)
  })

  it('gibt bei Unsinn nicht heimlich eine Zeit zurück', () => {
    const now = 1_000_000_000
    expect(nextDailyAt('morgen', now, 0)).toBe(now)
  })
})

describe('ob überhaupt erinnert wird', () => {
  it('schweigt an einem Tag, an dem schon trainiert wurde', () => {
    /*
     * Die halbe Miete gegen das, was Erinnerungen sonst anrichten: Eine App,
     * die abends fragt, ob man heute schon geübt hat, obwohl sie es weiß, ist
     * lästig und wirkt dumm.
     */
    expect(needsDailyReminder(['2026-08-18'], '2026-08-18')).toBe(false)
    expect(needsDailyReminder(['2026-08-17'], '2026-08-18')).toBe(true)
    expect(needsDailyReminder([], '2026-08-18')).toBe(true)
  })

  it('rechnet den Tag der Erinnerung mit der Vier-Uhr-Grenze', () => {
    // Dieselbe Grenze wie der Trainingstag (D-008): Wer um 1 Uhr nachts übt,
    // hat den Tag davor trainiert — und bekommt am Abend keine Erinnerung für
    // einen Tag, den er schon hinter sich hat.
    const offset = 120
    const at = Date.UTC(2026, 7, 19, 1, 0) // 03:00 Ortszeit → noch der 18.
    expect(reminderDay(at, offset)).toBe('2026-08-18')
    expect(reminderDay(at, offset)).toBe(dayKeyOf(at, { offsetMinutes: offset }))
  })
})
