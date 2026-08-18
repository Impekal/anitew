/**
 * Was von der Merktechnik schon gelehrt wurde (Backlog D5).
 *
 * Eine Zeile in den Einstellungen, mehr braucht es nicht: die Ziffern des
 * Major-Systems, die der Nutzer schon kennt. Sie liegt bewusst dort und nicht
 * in einer eigenen Tabelle — dadurch wandert sie mit der Sicherung (N2) mit,
 * ohne dass jemand daran denken muss. Wer sein Gerät wechselt, fängt nicht
 * wieder bei der Eins an.
 */

import { TEACH_ORDER } from '../core/index.ts'

import { db } from './db.ts'

const KEY = 'technique.major.taught'

/**
 * Die gelernten Ziffern, aufgeräumt.
 *
 * Fremde Werte fliegen raus — die Einstellungen können aus einer Sicherung
 * kommen, und eine Sicherung kann alles enthalten. Was hier zurückkommt, ist
 * eine Liste von Ziffern, die es im Major-System wirklich gibt.
 */
export async function loadTaught(): Promise<number[]> {
  const stored = (await db.settings.get(KEY))?.value
  if (!Array.isArray(stored)) return []
  return TEACH_ORDER.filter((digit) => stored.includes(digit))
}

/** Merkt sich, dass diese Ziffer erklärt wurde. Zweimal schadet nicht. */
export async function markTaught(digit: number): Promise<void> {
  if (!TEACH_ORDER.includes(digit)) return
  const taught = await loadTaught()
  if (taught.includes(digit)) return
  await db.settings.put({ key: KEY, value: [...taught, digit] })
}

/**
 * Der Gedächtnispalast wird **einmal** erklärt (Backlog G).
 *
 * Kein Fortschritt wie bei den zehn Ziffern, nur ein Ja oder Nein: Die
 * Technik ist in drei Schritten erzählt. Sie liegt aus demselben Grund in den
 * Einstellungen — sie wandert mit der Sicherung, ohne dass jemand daran
 * denken muss.
 */
const PALACE_KEY = 'technique.palace.taught'

export async function loadPalaceTaught(): Promise<boolean> {
  return (await db.settings.get(PALACE_KEY))?.value === true
}

export async function markPalaceTaught(): Promise<void> {
  await db.settings.put({ key: PALACE_KEY, value: true })
}
