/**
 * Zahlen fürs Modul „Zahlen“ (Backlog D10).
 *
 * Anders als Wörter und Namen kommen Zahlen nicht aus einer Liste, sondern
 * werden erzeugt. Das ist kein Sparen an Inhalt, sondern der Sache
 * geschuldet: Eine feste Liste von achtzig Zahlen wäre nach zwei Wochen
 * durchgesehen, und die App misst dann Wiedererkennen statt Gedächtnis —
 * derselbe Grund wie beim Gesichtsgenerator (D-005).
 *
 * ── Warum die Ziffern zusammenhängen und keine Leerzeichen haben ──────────
 *
 * D10 nennt „Ziffernfolgen, Jahreszahlen, PINs, Telefonnummern“. Eine
 * Telefonnummer schriebe man gern als „0176 4392 118“ — und genau das geht
 * nicht: Der freie Abruf zerlegt die Eingabe an Leerzeichen (`splitEntries`),
 * aus einer Nummer würden drei Antworten. Gruppierte Zahlen brauchen also
 * erst eine Eingabe, die weiß, dass sie **eine** Antwort erwartet. Bis dahin
 * sind alle Zahlen zusammenhängend — eine Einschränkung, und sie wird hier
 * benannt statt versteckt.
 *
 * ── Keine führenden Nullen ────────────────────────────────────────────────
 *
 * „0473“ und „473“ wären zwei verschiedene Gegenstände, und wer die Zahl
 * abtippt, lässt die Null vorne ganz selbstverständlich weg. Gemessen würde
 * dann Schreibweise statt Gedächtnis.
 */

import { createRng } from '../rng.ts'

/** Kürzeste und längste Folge. Sechs liegt in der Nähe der Merkspanne. */
export const MIN_DIGITS = 3
export const MAX_DIGITS = 6

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
