/**
 * Der eigene Palast auf dem Gerät (Backlog G3).
 *
 * Eine Zeile in den Einstellungen, wie der Lernstand der Technik — dadurch
 * wandert sie mit der Sicherung (N2) mit. Und das ist hier mehr als
 * Bequemlichkeit: Wer sich fünf Orte seiner eigenen Wohnung überlegt und sie
 * bei einem Gerätewechsel verliert, legt sie kein zweites Mal an.
 *
 * Was eine **gültige** Eingabe ist, entscheidet `core/content/palace.ts` und
 * wird dort ohne Browser geprüft (D-010). Hier steht nur lesen und schreiben.
 */

import { type OwnPalace, isOwnPalace } from '../core/index.ts'

import { db } from './db.ts'

const KEY = 'palace.own'

/**
 * Der eigene Palast, oder `undefined`.
 *
 * Was nicht durch die Prüfung kommt, gilt als nicht vorhanden — die
 * Einstellungen können aus einer Sicherung stammen, und eine Sicherung kann
 * alles enthalten. Lieber kein eigener Palast als einer mit einer leeren
 * Station, an der später eine Frage ohne Schild steht.
 */
export async function loadOwnPalace(): Promise<OwnPalace | undefined> {
  const stored = (await db.settings.get(KEY))?.value
  if (!isOwnPalace(stored)) return undefined
  return { name: stored.name.trim(), stations: stored.stations.map((label) => label.trim()) }
}

export async function saveOwnPalace(palace: OwnPalace): Promise<boolean> {
  if (!isOwnPalace(palace)) return false
  await db.settings.put({ key: KEY, value: palace })
  return true
}

/**
 * Wirft den eigenen Palast weg.
 *
 * Die **Gänge bleiben stehen**. Sie hängen an Kennungen wie `own~7#own3`, und
 * die bleiben gültig — nur steht auf dem Schild nichts mehr. Deshalb legt der
 * Vorrat ohne eigenen Palast auch keine neuen Gänge dorthin, und ein fälliger
 * alter wird übergangen statt ohne Schild gefragt.
 */
export async function clearOwnPalace(): Promise<void> {
  await db.settings.delete(KEY)
}
