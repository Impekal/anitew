/**
 * Die gewählte Erinnerungszeit auf dem Gerät (Backlog B8).
 *
 * Eine Zeile in den Einstellungen, wie der Lernstand: Sie wandert mit der
 * Sicherung (N2) und überlebt einen Gerätewechsel. Das ist hier mehr als
 * Bequemlichkeit — sie gilt weiter, wenn ANITEW später als App aus dem Store
 * läuft und die Erinnerung dort wirklich zugesagt werden kann (D-022).
 */

import { type TimeOfDay, isTimeOfDay } from '../core/index.ts'

import { db } from './db.ts'

const KEY = 'reminders.daily'

/** Die gewählte Uhrzeit, oder `undefined` für „keine Erinnerung“. */
export async function loadDailyTime(): Promise<TimeOfDay | undefined> {
  const stored = (await db.settings.get(KEY))?.value
  return isTimeOfDay(stored) ? stored : undefined
}

export async function saveDailyTime(time: TimeOfDay): Promise<boolean> {
  if (!isTimeOfDay(time)) return false
  await db.settings.put({ key: KEY, value: time })
  return true
}

export async function clearDailyTime(): Promise<void> {
  await db.settings.delete(KEY)
}
