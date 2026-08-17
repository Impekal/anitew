import { describe, expect, it } from 'vitest'

import {
  addDays,
  dayKeyOf,
  daysBetween,
  isConsecutive,
  startOfDay,
} from '../../src/core/time.ts'

/** Berlin im Sommer: UTC+2. */
const BERLIN_SUMMER = { offsetMinutes: 120 }
/** New York im Winter: UTC−5. */
const NEW_YORK_WINTER = { offsetMinutes: -300 }

const at = (iso: string) => Date.parse(iso)

describe('dayKeyOf', () => {
  it('ordnet den Vormittag dem laufenden Tag zu', () => {
    expect(dayKeyOf(at('2026-08-17T10:00:00+02:00'), BERLIN_SUMMER)).toBe('2026-08-17')
  })

  it('zählt 0:30 Uhr noch zum Vortag — sonst zerreißt die Nachteule ihre Streak', () => {
    expect(dayKeyOf(at('2026-08-18T00:30:00+02:00'), BERLIN_SUMMER)).toBe('2026-08-17')
  })

  it('beginnt den neuen Tag um 4 Uhr', () => {
    expect(dayKeyOf(at('2026-08-18T03:59:00+02:00'), BERLIN_SUMMER)).toBe('2026-08-17')
    expect(dayKeyOf(at('2026-08-18T04:00:00+02:00'), BERLIN_SUMMER)).toBe('2026-08-18')
  })

  it('rechnet in Ortszeit, nicht in UTC', () => {
    // Derselbe Augenblick: in Berlin ist es der 18., in New York der 17.
    const moment = at('2026-08-18T05:00:00+02:00')
    expect(dayKeyOf(moment, BERLIN_SUMMER)).toBe('2026-08-18')
    expect(dayKeyOf(moment, NEW_YORK_WINTER)).toBe('2026-08-17')
  })

  it('lässt sich die Tagesgrenze umstellen', () => {
    const midnight = { offsetMinutes: 120, dayStartHour: 0 }
    expect(dayKeyOf(at('2026-08-18T00:30:00+02:00'), midnight)).toBe('2026-08-18')
  })

  it('weist eine unmögliche Tagesgrenze zurück', () => {
    expect(() => dayKeyOf(0, { offsetMinutes: 0, dayStartHour: 24 })).toThrow(RangeError)
  })
})

describe('startOfDay', () => {
  it('ist die Umkehrung von dayKeyOf', () => {
    const key = dayKeyOf(at('2026-08-17T22:15:00+02:00'), BERLIN_SUMMER)
    const start = startOfDay(key, BERLIN_SUMMER)
    expect(new Date(start).toISOString()).toBe('2026-08-17T02:00:00.000Z') // 4 Uhr Berlin
    expect(dayKeyOf(start, BERLIN_SUMMER)).toBe(key)
  })
})

describe('daysBetween', () => {
  it('zählt ganze Tage', () => {
    expect(daysBetween('2026-08-17', '2026-08-24')).toBe(7)
    expect(daysBetween('2026-08-24', '2026-08-17')).toBe(-7)
    expect(daysBetween('2026-08-17', '2026-08-17')).toBe(0)
  })

  it('stolpert nicht über Monats- und Jahresgrenzen', () => {
    expect(daysBetween('2026-02-27', '2026-03-01')).toBe(2) // 2026 ist kein Schaltjahr
    expect(daysBetween('2024-02-27', '2024-03-01')).toBe(3) // 2024 schon
    expect(daysBetween('2026-12-31', '2027-01-01')).toBe(1)
  })

  it('bleibt über die Zeitumstellung hinweg richtig', () => {
    // In dieser Nacht hat der Tag 23 Stunden. Wer in Stunden rechnet statt in
    // Tagesschlüsseln, bekommt hier 27 statt 28.
    expect(daysBetween('2026-03-15', '2026-04-12')).toBe(28)
  })

  it('weist Unfug zurück', () => {
    expect(() => daysBetween('17.08.2026', '2026-08-18')).toThrow(RangeError)
    expect(() => daysBetween('2026-13-01', '2026-08-18')).toThrow(RangeError)
  })
})

describe('addDays', () => {
  it('rechnet vorwärts und rückwärts', () => {
    expect(addDays('2026-08-17', 1)).toBe('2026-08-18')
    expect(addDays('2026-08-31', 1)).toBe('2026-09-01')
    expect(addDays('2027-01-01', -1)).toBe('2026-12-31')
    expect(addDays('2026-08-17', 0)).toBe('2026-08-17')
  })
})

describe('isConsecutive', () => {
  it('hält die Streak am Folgetag', () => {
    expect(isConsecutive('2026-08-17', '2026-08-18')).toBe(true)
  })

  it('bricht sie nach einer Lücke — es sei denn, ein Schutztag deckt sie ab', () => {
    expect(isConsecutive('2026-08-17', '2026-08-19')).toBe(false)
    expect(isConsecutive('2026-08-17', '2026-08-19', 2)).toBe(true)
    expect(isConsecutive('2026-08-17', '2026-08-20', 2)).toBe(false)
  })

  it('zählt zweimal am selben Tag nicht als zwei Tage', () => {
    expect(isConsecutive('2026-08-17', '2026-08-17')).toBe(false)
  })
})
