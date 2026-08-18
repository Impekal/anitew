/**
 * Wann ANITEW erinnert (Backlog B8, H3 · D-022).
 *
 * Nur das **Wann** und das **Warum** stehen hier; ob und wie eine Erinnerung
 * ankommt, entscheidet die Plattform hinter `Reminders` (D-010).
 *
 * Zwei Anlässe, und sie sind grundverschieden:
 *
 * - **Die Tageserinnerung** ist eine Verabredung. Sie steht zu einer Uhrzeit,
 *   die der Nutzer selbst wählt, und sie sagt nichts als „jetzt wäre die
 *   Zeit“. Kein „deine Serie läuft ab“, kein Countdown (D-015).
 * - **Die Messung** ist eine Zusage der App an sich selbst: Sie hat um 14:00
 *   zwanzig Wörter gezeigt und will um 14:20 noch einmal fragen. Ohne
 *   Erinnerung hängt das Fenster daran, dass jemand zufällig zurückkommt —
 *   und eine verpasste Messung zählt nicht (F1).
 */

import { AFTER_20_MIN_FROM } from './benchmark/plan.ts'
import { type DayKey, type Instant, dayKeyOf } from './time.ts'

export const DAILY_REMINDER_ID = 'daily'
export const BENCHMARK_REMINDER_ID = 'benchmark'

/**
 * Wann an die zweite Stufe der Messung erinnert wird.
 *
 * **In der Mitte des Fensters**, nicht an seinem Anfang. Das Fenster ist 15
 * bis 45 Minuten; zwanzig Minuten lassen fünfundzwanzig Minuten Luft, um
 * wirklich zurückzukommen. Am Anfang zu erinnern hieße, die Hälfte der Luft
 * zu verschenken — und wer eine Minute zu früh antwortet, misst etwas anderes
 * als die Messung misst.
 */
export const BENCHMARK_REMINDER_DELAY = AFTER_20_MIN_FROM + 5 * 60_000

export function benchmarkReminderAt(encodedAt: Instant): Instant {
  return encodedAt + BENCHMARK_REMINDER_DELAY
}

/** Eine Uhrzeit als „18:30“. */
export type TimeOfDay = string

const TIME = /^([01]\d|2[0-3]):([0-5]\d)$/

export function isTimeOfDay(value: unknown): value is TimeOfDay {
  return typeof value === 'string' && TIME.test(value)
}

/**
 * Der nächste Zeitpunkt, an dem diese Uhrzeit in **Ortszeit** eintritt.
 *
 * Ortszeit ist hier keine Formalie: Eine Verabredung um 19:30 ist eine
 * Verabredung um 19:30, egal in welcher Zeitzone jemand gerade sitzt. Die
 * Rechnung geht deshalb über denselben Versatz, mit dem auch der Trainingstag
 * gebildet wird (D-008) — zwei Zeitrechnungen in einer App wären eine zu
 * viel.
 */
export function nextDailyAt(time: TimeOfDay, now: Instant, offsetMinutes: number): Instant {
  const match = TIME.exec(time)
  if (match === null) return now
  const hour = Number(match[1])
  const minute = Number(match[2])

  const local = now + offsetMinutes * 60_000
  const startOfLocalDay = Math.floor(local / 86_400_000) * 86_400_000
  const at = startOfLocalDay + hour * 3_600_000 + minute * 60_000 - offsetMinutes * 60_000

  // Ist die Uhrzeit für heute vorbei, gilt sie für morgen. Eine Erinnerung in
  // der Vergangenheit ist keine.
  return at > now ? at : at + 86_400_000
}

/**
 * Soll heute überhaupt erinnert werden?
 *
 * **Nein, wenn heute schon trainiert wurde.** Das ist die halbe Miete gegen
 * das, was Erinnerungen sonst anrichten: Eine App, die abends fragt, ob man
 * heute schon geübt hat, obwohl sie es weiß, ist lästig und wirkt dumm.
 */
export function needsDailyReminder(trainingDays: readonly DayKey[], today: DayKey): boolean {
  return !trainingDays.includes(today)
}

/** Der Tag, für den eine geplante Tageserinnerung gilt. */
export function reminderDay(at: Instant, offsetMinutes: number): DayKey {
  return dayKeyOf(at, { offsetMinutes })
}
