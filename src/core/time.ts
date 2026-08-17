/**
 * Was ist „heute“?
 *
 * Für eine App, die Streaks zählt (D-008) und Wiederholungen auf Tage plant
 * (D-004), ist das keine triviale Frage. Zwei Dinge werden hier bewusst anders
 * gemacht als in der naiven Lösung:
 *
 * 1. **Der Tag beginnt um 4 Uhr morgens, nicht um Mitternacht.** Wer um 0:30
 *    trainiert, meint den Tag davor. Mitternacht als Grenze würde ihm eine
 *    Streak zerreißen, die er gerade gehalten hat — und ihn zusätzlich zwingen,
 *    binnen 23,5 Stunden zweimal zu trainieren. Anki macht das seit Jahren so,
 *    aus demselben Grund.
 *
 * 2. **Die Zeitzone kommt von außen.** Der Kern kennt keinen Browser (D-010),
 *    also auch keine Geräte-Zeitzone. Sie wird als Versatz hereingereicht.
 *
 * Vorzeichen des Versatzes, weil hier klassischerweise Fehler passieren:
 * `offsetMinutes` sind die Minuten, die man zu UTC **addiert**, um Ortszeit zu
 * erhalten. Berlin im Sommer: +120. New York im Winter: −300.
 * Achtung: `Date.prototype.getTimezoneOffset()` liefert genau das Gegenteil —
 * der Web-Adapter dreht das Vorzeichen um (siehe src/platform/web/clock.ts).
 */

/** Millisekunden seit 1970-01-01T00:00:00Z. */
export type Instant = number

/** Ein Trainingstag, als `YYYY-MM-DD`. Sortierbar als Text. */
export type DayKey = string

export const DEFAULT_DAY_START_HOUR = 4

const MS_PER_MINUTE = 60_000
const MS_PER_HOUR = 3_600_000
const MS_PER_DAY = 86_400_000

export interface DayBoundary {
  /** Minuten, die zu UTC addiert Ortszeit ergeben. Berlin im Sommer: +120. */
  offsetMinutes: number
  /** Stunde, zu der ein neuer Trainingstag beginnt. Voreinstellung: 4. */
  dayStartHour?: number
}

function startHourOf(boundary: DayBoundary): number {
  const hour = boundary.dayStartHour ?? DEFAULT_DAY_START_HOUR
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
    throw new RangeError(`dayStartHour muss 0..23 sein, war ${hour}`)
  }
  return hour
}

/** Der Trainingstag, in den ein Zeitpunkt fällt. */
export function dayKeyOf(at: Instant, boundary: DayBoundary): DayKey {
  const shifted = at + boundary.offsetMinutes * MS_PER_MINUTE - startHourOf(boundary) * MS_PER_HOUR
  const date = new Date(shifted)
  const year = date.getUTCFullYear().toString().padStart(4, '0')
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
  const day = date.getUTCDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Der Zeitpunkt, an dem dieser Trainingstag beginnt. */
export function startOfDay(key: DayKey, boundary: DayBoundary): Instant {
  return (
    parseDayKey(key) + startHourOf(boundary) * MS_PER_HOUR - boundary.offsetMinutes * MS_PER_MINUTE
  )
}

/** Ganze Tage von `from` bis `to`. Negativ, wenn `to` davor liegt. */
export function daysBetween(from: DayKey, to: DayKey): number {
  return Math.round((parseDayKey(to) - parseDayKey(from)) / MS_PER_DAY)
}

/** Der Trainingstag `count` Tage nach `key` (negativ erlaubt). */
export function addDays(key: DayKey, count: number): DayKey {
  const date = new Date(parseDayKey(key) + count * MS_PER_DAY)
  const year = date.getUTCFullYear().toString().padStart(4, '0')
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
  const day = date.getUTCDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Hält die Streak, wenn zwischen zwei Trainingstagen höchstens die erlaubte
 * Lücke liegt. Ein Schutztag (D-008) deckt genau einen fehlenden Tag ab.
 */
export function isConsecutive(previous: DayKey, current: DayKey, allowedGapDays = 1): boolean {
  const gap = daysBetween(previous, current)
  return gap >= 1 && gap <= allowedGapDays
}

function parseDayKey(key: DayKey): number {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key)
  if (!match) throw new RangeError(`Kein Tagesschlüssel: ${key}`)
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    throw new RangeError(`Kein gültiges Datum: ${key}`)
  }
  return Date.UTC(year, month - 1, day)
}
