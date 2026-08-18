/**
 * Ziffernfolgen für das Arbeitsgedächtnis (Backlog D7).
 *
 * Wie die Zahlen des Zahlenmoduls **aus dem Seed erzeugt**, nicht aus einer
 * Liste (D10): Eine feste Liste wäre nach zwei Wochen durchgesehen. Und wie
 * dort sprachfrei — eine Ziffernfolge ist in jeder Trainingssprache dieselbe
 * Übung.
 *
 * Der Unterschied zum Zahlenmodul steckt nicht in den Ziffern, sondern in
 * der Aufgabe: Dort wird eine Zahl **behalten**, hier wird sie **im Kopf
 * umgebaut** (rückwärts wiedergegeben). Deshalb ein eigener Vorrat mit
 * eigenen Regeln — keine Folge mit Dopplung direkt nebeneinander (aus
 * „335“ rückwärts wird sonst eine Frage, die halb schon beantwortet ist,
 * weil zwei Ziffern gleich bleiben) und keine spiegelgleiche Folge (ein
 * Palindrom rückwärts ist die Folge selbst — die Aufgabe wäre keine).
 */

import { createRng } from '../rng.ts'

/**
 * Wie viele Ziffern eine Folge hat.
 *
 * Fünf ist der Anfang: Die klassische Rückwärtsspanne liegt bei den meisten
 * Menschen zwischen vier und sechs — fünf fordert, ohne zu entmutigen.
 * Dass die Länge später mit der eigenen Trefferquote wandert, ist D2
 * (adaptive Schwierigkeit); bis dahin ist sie eine Konstante mit Namen.
 */
export const SPAN_LENGTH = 5

/** Eine Folge rückwärts — die gesuchte Antwort. */
export function reversed(digits: string): string {
  return [...digits].reverse().join('')
}

/** Ist eine Folge als Aufgabe brauchbar? (Keine Dopplung, kein Palindrom.) */
function usable(digits: string): boolean {
  for (let index = 1; index < digits.length; index++) {
    if (digits[index] === digits[index - 1]) return false
  }
  return reversed(digits) !== digits
}

/**
 * Der Vorrat an Ziffernfolgen für eine Einheit.
 *
 * Deterministisch aus dem Seed (gleicher Seed, gleiche Folgen — A11) und
 * ohne Wiederholung innerhalb des Vorrats: Eine Folge, die zweimal käme,
 * würde beim zweiten Mal Wiedererkennen messen statt Umbauen.
 */
export function spanPool(seed: string, count: number, length: number = SPAN_LENGTH): string[] {
  const rng = createRng(`spans:${seed}`)
  const pool: string[] = []
  const seen = new Set<string>()
  while (pool.length < count) {
    let digits = ''
    for (let index = 0; index < length; index++) {
      digits += String(rng.int(10))
    }
    if (!usable(digits) || seen.has(digits)) continue
    seen.add(digits)
    pool.push(digits)
  }
  return pool
}
