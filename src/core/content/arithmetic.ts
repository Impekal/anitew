/**
 * Kopfrechnen (Nutzerwunsch 05.09.: „ich habe etwa auch an Rechnen Übungen
 * gedacht").
 *
 * ── Warum das in eine Gedächtnis-App gehört ───────────────────────────────
 *
 * Nicht, weil Rechnen „das Denken schneller macht" — dafür gibt es keine
 * Belege, und die Seite „Was belegt ist" sagt das ausdrücklich. Sondern aus
 * zwei anderen Gründen, die beide tragen:
 *
 * 1. **Das Einmaleins ist eine Gedächtnisaufgabe.** 7 × 8 rechnet niemand
 *    aus, der es kann; er ruft es ab. Quadratzahlen, Zweierpotenzen und die
 *    gängigen Prozentwerte genauso. Das ist Stoff mit Termin — genau das,
 *    wofür Abrufen und verteiltes Üben gebaut sind, und beides führt
 *    `core/science.ts` als `established`.
 * 2. **Es ist ein Alltagskönnen**, wie das Major-System: im Laden, beim
 *    Trinkgeld, beim Abschätzen. Der Nutzen ist die Fähigkeit selbst und
 *    braucht keine Übertragsstudie.
 *
 * ── Warum ein endlicher Vorrat, anders als bei den Zahlen ─────────────────
 *
 * Bei den Ziffernfolgen wäre eine feste Liste falsch: Sie wäre nach zwei
 * Wochen durchgesehen, und die App misst dann Wiedererkennen statt Gedächtnis
 * (D10, D-005). Hier ist es umgekehrt — **das Einmaleins ist endlich, und es
 * auswendig zu können ist das Ziel.** Ein Generator, der endlos neue Aufgaben
 * würfelt, würde genau das verhindern: Man käme nie dazu, dieselbe Tatsache
 * wiederzusehen, und FSRS hätte nichts zu terminieren.
 *
 * ── Die Form ist die der Persönlichkeiten ─────────────────────────────────
 *
 * Ein Eintrag ist ein Frage-Antwort-Paar mit demselben Trennzeichen wie
 * eigene Karten und Persönlichkeiten. Dadurch erbt das Modul Anzeige,
 * Bewertung und Wiedersehen, statt sie ein zweites Mal zu beschreiben — und
 * die Bewertung ist exakt, weil eine Zahl exakt ist (D-012).
 */

import { OWN_SEPARATOR } from './own.ts'
import { createRng } from '../rng.ts'

/** Die Stufen, in der Reihenfolge, in der sie dazukommen. */
export const ARITHMETIC_STAGES = ['times', 'squares', 'powers', 'percent'] as const
export type ArithmeticStage = (typeof ARITHMETIC_STAGES)[number]

/** Mal- und Malzeichen als Zeichen, nicht als Buchstabe: 7 × 8, nicht 7 x 8. */
const TIMES = '×'

function paar(frage: string, antwort: number): string {
  return `${frage}${OWN_SEPARATOR}${String(antwort)}`
}

/**
 * Das kleine Einmaleins ohne die geschenkten Zeilen.
 *
 * Die Reihen 1 und 10 stehen nicht drin: „7 × 1" und „7 × 10" prüfen kein
 * Gedächtnis, sondern ob jemand die Regel kennt — dieselbe Überlegung wie
 * `isTooEasy` bei den Ziffernfolgen. Und jedes Paar kommt nur **einmal** vor:
 * 7 × 8 und 8 × 7 sind dieselbe Tatsache, und wer sie zweimal im Vorrat hat,
 * misst beim zweiten Mal das Wiedersehen von vor zwei Minuten.
 */
function timesTable(): string[] {
  const items: string[] = []
  for (let a = 2; a <= 9; a++) {
    for (let b = a; b <= 9; b++) {
      items.push(paar(`${a} ${TIMES} ${b}`, a * b))
    }
  }
  return items
}

/** Quadratzahlen bis 25 — die, die im Kopf wirklich vorkommen. */
function squares(): string[] {
  const items: string[] = []
  for (let a = 11; a <= 25; a++) items.push(paar(`${a}${TIMES}${a}`.replace(TIMES, ` ${TIMES} `), a * a))
  return items
}

/** Zweierpotenzen bis 1024 — Speichergrößen, Halbierungen, Verdopplungen. */
function powers(): string[] {
  const items: string[] = []
  for (let e = 5; e <= 10; e++) items.push(paar(`2^${e}`, 2 ** e))
  return items
}

/**
 * Prozentwerte, die man im Laden braucht.
 *
 * Bewusst nur glatte Ergebnisse: „19 % von 250" ist eine Rechenaufgabe mit
 * Papier, kein Abruf. Was hier steht, soll man wissen können.
 */
function percent(): string[] {
  const werte: readonly (readonly [number, number])[] = [
    [10, 80], [10, 250], [20, 45], [20, 150], [25, 60], [25, 200],
    [50, 36], [50, 170], [5, 60], [5, 240], [75, 40], [15, 200],
  ]
  return werte.map(([p, von]) => paar(`${p} % von ${von}`, (p * von) / 100))
}

const BY_STAGE: Record<ArithmeticStage, () => string[]> = {
  times: timesTable,
  squares,
  powers,
  percent,
}

/**
 * Der Vorrat für die heutige Einheit.
 *
 * `stages` sagt, welche Stufen offen sind — der Aufrufer entscheidet das aus
 * dem Lernstand, nicht diese Datei. Gemischt wird aus dem Seed, damit
 * dieselbe Einheit reproduzierbar bleibt (A11).
 */
export function arithmeticPool(
  seed: string,
  stages: readonly ArithmeticStage[] = ['times'],
): readonly string[] {
  const items = stages.flatMap((stage) => BY_STAGE[stage]())
  const rng = createRng(`arithmetic:${seed}`)
  return rng.shuffle(items)
}

/** Wie viele Aufgaben eine Stufe überhaupt hat — für die Fortschrittsanzeige. */
export function arithmeticSize(stage: ArithmeticStage): number {
  return BY_STAGE[stage]().length
}
