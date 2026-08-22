/**
 * Zahlen fürs Modul „Zahlen“ (Backlog D10).
 *
 * Anders als Wörter und Namen kommen Zahlen nicht aus einer Liste, sondern
 * werden erzeugt. Das ist kein Sparen an Inhalt, sondern der Sache
 * geschuldet: Eine feste Liste von achtzig Zahlen wäre nach zwei Wochen
 * durchgesehen, und die App misst dann Wiedererkennen statt Gedächtnis —
 * derselbe Grund wie beim Gesichtsgenerator (D-005).
 *
 * ── Gruppierte Schreibweise ────────────────────────────────────────────────
 *
 * Die Scheduler-ID einer Zahl bleibt immer die reine Ziffernfolge. Für die
 * Anzeige darf dieselbe Zahl aber gruppiert werden, und eine gruppiert
 * eingegebene Antwort wird wieder auf genau diese Ziffernfolge reduziert.
 * Damit verändert eine Darstellungsverbesserung weder bereits gelernte Items
 * noch ihre FSRS-Historie.
 *
 * Mehrere Zahlen werden bewusst nur durch Zeilenumbruch, Komma oder Semikolon
 * getrennt. Leerzeichen gehören innerhalb einer Zahl zur Gruppierung. So ist
 * „0176 4392 118“ eine Antwort und nicht drei scheinbare Antworten.
 *
 * ── Keine führenden Nullen im bisherigen Generator ────────────────────────
 *
 * Der bestehende 3–6-Ziffern-Vorrat bleibt unverändert. Das ist Absicht:
 * Bereits erzeugte Trainingstage sollen durch diesen UI-/Eingabe-Slice nicht
 * unter den Füßen der Nutzer neu ausgewürfelt werden. Längere Telefonnummern
 * können darauf aufbauen, ohne alte IDs umzudeuten.
 */

import { createRng } from '../rng.ts'

/** Kürzeste und längste Folge. Sechs liegt in der Nähe der Merkspanne. */
export const MIN_DIGITS = 3
export const MAX_DIGITS = 6

/**
 * Gruppiert eine Ziffernfolge nur für die Anzeige.
 *
 * Von rechts in Dreiergruppen, weil dadurch die zugrunde liegende ID nie
 * verändert wird und jede Länge deterministisch dargestellt werden kann.
 * Nicht-numerische Werte werden unverändert gelassen; diese Funktion erfindet
 * keine Bedeutung für fremde IDs.
 */
export function displayNumber(value: string): string {
  if (!/^\d+$/.test(value) || value.length <= 4) return value
  const first = value.length % 3 || 3
  const groups = [value.slice(0, first)]
  for (let index = first; index < value.length; index += 3) {
    groups.push(value.slice(index, index + 3))
  }
  return groups.join(' ')
}

/**
 * Zerlegt freien Zahlabruf, ohne Gruppierungsleerzeichen zu zerstören.
 *
 * Eine Zahl pro Zeile ist der natürliche Mehrfachabruf. Komma und Semikolon
 * funktionieren ebenfalls. Innerhalb eines Eintrags werden nur sichtbare
 * Gruppierungszeichen entfernt; übrig bleiben muss eine reine Ziffernfolge.
 * Ungültige Einträge bleiben erhalten, damit die Bewertung sie als `extra`
 * statt stillschweigend als Treffer verbuchen kann.
 */
export function splitNumberEntries(text: string): string[] {
  return text
    .split(/[\n,;]+/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
    .map((entry) => (/^[\d\s]+$/.test(entry) ? entry.replace(/\s+/g, '') : entry))
}

/**
 * Ist die Folge zu leicht, um etwas zu messen?
 *
 * „1111“ merkt sich als ein Zeichen, „3456“ als eine Regel — beide sagen
 * nichts über das Gedächtnis für Ziffernfolgen aus. Sie kommen selten vor,
 * aber wer eine davon zieht, hat einen geschenkten Treffer, und der geht in
 * dieselbe Zahl ein wie die verdienten (Regel R-1).
 */
export function isTooEasy(value: string): boolean {
  if (new Set(value).size === 1) return true
  let ascending = true
  let descending = true
  for (let index = 1; index < value.length; index++) {
    const step = Number(value[index]) - Number(value[index - 1])
    if (step !== 1) ascending = false
    if (step !== -1) descending = false
  }
  return ascending || descending
}

/**
 * Ein Vorrat an Zahlen, aus einem Seed erzeugt.
 *
 * Derselbe Seed ergibt denselben Vorrat — die Einheit bleibt damit
 * reproduzierbar (A11), so wie bei Wörtern und Gesichtern.
 *
 * Die Länge streut über die ganze Spanne, damit eine Runde nicht aus fünf
 * gleich langen Folgen besteht: Gleichförmigkeit macht den Abruf leichter,
 * als er sein sollte, weil man nur noch die Ziffern und nicht mehr die Länge
 * behalten muss.
 */
export function numberPool(seed: string, count: number): readonly string[] {
  const rng = createRng(`numbers:${seed}`)
  const pool = new Set<string>()

  /*
   * Die Schranke ist kein Misstrauen gegen den Zufall, sondern gegen mich:
   * Würde `count` je größer als der Vorrat brauchbarer Folgen, liefe die
   * Schleife für immer — und zwar auf dem Telefon eines Nutzers, nicht hier.
   */
  for (let attempt = 0; pool.size < count && attempt < count * 40; attempt++) {
    const digits = MIN_DIGITS + rng.int(MAX_DIGITS - MIN_DIGITS + 1)
    // Die erste Ziffer nie null (siehe oben), die übrigen frei.
    let value = String(1 + rng.int(9))
    for (let index = 1; index < digits; index++) value += String(rng.int(10))
    if (!isTooEasy(value)) pool.add(value)
  }

  return [...pool]
}
