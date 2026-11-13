/**
 * Der Aufbau einer Messung (Backlog F2 · D-006).
 *
 * Rund drei Minuten, am Tag 0 und danach alle vierzehn Tage. **Immer gleich
 * aufgebaut** — gleiche Anzahl, gleiche Zeiten, gleiche Abstände; nur der
 * Inhalt ist jedes Mal neu. Sonst vergliche man später zwei verschiedene
 * Tests miteinander und nennte das Fortschritt.
 *
 * Gemessen wird an drei Stellen, und das ist der eigentliche Kunstgriff:
 * **sofort**, **nach zwanzig Minuten** und **am Folgetag**. Behalten über
 * Zeit ist der Punkt, nicht Auffassung im Moment — wer zwanzig Wörter
 * unmittelbar nachsprechen kann, hat sie noch im Arbeitsgedächtnis und nicht
 * unbedingt behalten.
 */

import { type DayKey, type Instant, addDays } from '../time.ts'

export const BENCHMARK_PHASES = ['immediate', 'after20Minutes', 'nextDay'] as const
export type BenchmarkPhase = (typeof BENCHMARK_PHASES)[number]

/**
 * Sekunden je Wort beim Einprägen.
 *
 * Bewusst ein eigener Wert und nicht der aus dem Training: Der darf sich mit
 * der Schwierigkeit ändern (H6, D2), dieser **nicht**. „Immer gleich
 * aufgebaut“ (D-006) heißt, dass die Messung von Änderungen am Training
 * unberührt bleibt — sonst verglichen zwei Messungen zwei verschiedene Tests.
 */
export const BENCHMARK_SECONDS_PER_ITEM = 5

/** Sekunden für einen Abruf — für alle drei Stellen gleich. */
export const RECALL_SECONDS = 60

/** Tage zwischen zwei Messungen (D-006). */
export const DAYS_BETWEEN_RUNS = 14

/**
 * Das Zeitfenster für den Abruf nach zwanzig Minuten.
 *
 * Ein Fenster und kein Zeitpunkt, weil niemand auf die Sekunde zurückkommt —
 * und **mit Obergrenze**, weil eine Messung nach drei Stunden keine Messung
 * „nach zwanzig Minuten“ mehr ist. Wer das Fenster verpasst, dessen Messung
 * bleibt unvollständig; sie wird dann nicht mitgezählt, statt sie als etwas
 * auszugeben, das sie nicht ist (F1, R-1).
 */
export const AFTER_20_MIN_FROM = 15 * 60_000
export const AFTER_20_MIN_UNTIL = 45 * 60_000

/** Wie lange eine Messung insgesamt dauert — ohne die Wartezeiten. */
export function benchmarkSeconds(items: number): number {
  return items * BENCHMARK_SECONDS_PER_ITEM + RECALL_SECONDS * BENCHMARK_PHASES.length
}

/** Der Stand einer laufenden oder abgeschlossenen Messung. */
export interface BenchmarkRun {
  /** Fortlaufende Nummer, ab 1. Die ersten beiden sind Eichung (F2b). */
  ordinal: number
  /** Der Trainingstag, an dem eingeprägt wurde. */
  day: DayKey
  /** Wann der erste Abruf endete — daran hängen die beiden Fenster. */
  encodedAt?: Instant
  immediate?: number
  after20Minutes?: number
  nextDay?: number
  total: number
}

/**
 * Was als Nächstes zu tun ist.
 *
 * `waiting` heißt: Der nächste Abruf ist noch nicht dran. `missed` heißt: Er
 * ist vorbei, und die Messung bleibt unvollständig — daraus wird keine Zahl
 * mehr.
 */
export type BenchmarkStep =
  | { kind: 'encode' }
  | { kind: 'recall'; phase: BenchmarkPhase }
  | { kind: 'waiting'; phase: BenchmarkPhase; readyAt: Instant }
  | { kind: 'missed'; phase: BenchmarkPhase }
  | { kind: 'done' }

export function nextStep(run: BenchmarkRun, now: Instant, today: DayKey): BenchmarkStep {
  if (run.immediate === undefined || run.encodedAt === undefined) return { kind: 'encode' }

  if (run.after20Minutes === undefined) {
    const since = now - run.encodedAt
    if (since < AFTER_20_MIN_FROM) {
      return { kind: 'waiting', phase: 'after20Minutes', readyAt: run.encodedAt + AFTER_20_MIN_FROM }
    }
    if (since > AFTER_20_MIN_UNTIL) return { kind: 'missed', phase: 'after20Minutes' }
    return { kind: 'recall', phase: 'after20Minutes' }
  }

  if (run.nextDay === undefined) {
    /*
     * Der Folgetag ist der Trainingstag nach dem Einprägen — die Tagesgrenze
     * liegt um 4 Uhr (D-008). Wer um 1 Uhr nachts einprägt und um 9 Uhr
     * zurückkommt, ist damit am selben Trainingstag; „am Folgetag“ heißt
     * ausgeschlafen und nicht acht Stunden später.
     */
    const due = addDays(run.day, 1)
    if (today < due) return { kind: 'waiting', phase: 'nextDay', readyAt: 0 }
    if (today > due) return { kind: 'missed', phase: 'nextDay' }
    return { kind: 'recall', phase: 'nextDay' }
  }

  return { kind: 'done' }
}

/** Ist die Messung vollständig — und damit überhaupt vergleichbar? */
export function isComplete(run: BenchmarkRun): boolean {
  return (
    run.immediate !== undefined && run.after20Minutes !== undefined && run.nextDay !== undefined
  )
}

/**
 * Wann die nächste Messung fällig ist.
 *
 * Vierzehn Tage nach der letzten — und die allererste sofort. Eine Messung,
 * die man erst nach zwei Wochen Training zum ersten Mal macht, hätte keinen
 * Tag 0 mehr, gegen den sie sich vergleichen ließe.
 *
 * ── Der abgebrochene Fall ─────────────────────────────────────────────────
 *
 * Eine Messung lässt sich jederzeit abbrechen; das ist keine Frage, sondern
 * eine Selbstverständlichkeit (D-015). Was daraus folgt, hängt aber daran, ob
 * schon **eine Zahl entstanden** ist:
 *
 * - **Noch keine** — abgebrochen im Einprägen oder vor dem ersten Abschicken.
 *   Dann ist nichts gemessen worden, und die nächste ist sofort wieder
 *   fällig. Jemanden vierzehn Tage warten zu lassen, weil das Telefon
 *   geklingelt hat, wäre eine Strafe für nichts.
 * - **Schon eine** — der erste Abruf steht in der Zeile. Dann gilt der übliche
 *   Abstand, und zwar aus einem Grund, der wichtiger ist als die Bequemlichkeit:
 *   **Wer eine begonnene Messung wiederholen kann, bis ihm das Gefühl dabei
 *   gefällt, misst nicht mehr sein Gedächtnis.** Die Zahl selbst bekommt er
 *   zwar nie zu sehen — aber schon die Möglichkeit, es „nochmal richtig“ zu
 *   versuchen, macht aus einer Messung eine Bestleistung.
 *
 * Die Wörter des abgebrochenen Laufs sind in beiden Fällen verbraucht: Sie
 * wurden gesehen. Die nächste Messung nimmt die nächsten zwanzig — und rückt
 * damit näher an die Stelle, an der sich der Vorrat wiederholt. Auch das sagt
 * die App, statt es zu verschlucken (`poolCycles`).
 */
export function nextRunDue(lastRun: BenchmarkRun | undefined): DayKey | undefined {
  if (lastRun === undefined) return undefined
  if (lastRun.immediate === undefined) return lastRun.day
  return addDays(lastRun.day, DAYS_BETWEEN_RUNS)
}

/**
 * Eine gespeicherte Messzeile, so weit die Startregel sie braucht.
 *
 * Bewusst schmaler als die Datenbankzeile: Was hier steht, ist alles, was
 * über einen **Start** entscheidet — nicht über eine Auswertung.
 */
export interface BenchmarkSlot {
  ordinal: number
  day: DayKey
  completed: boolean
  abandoned?: boolean
  immediate?: number
}

/** Warum eine Messung gerade **nicht** begonnen werden darf. */
export type BenchmarkStartRefusal = 'open-run' | 'not-due'

/**
 * Die Startregel der Messung — als Tatsache im Kern, nicht als Zustand der
 * Oberfläche (R3-04, Runde 3).
 *
 * Bisher entschied allein die Oberfläche, ob der Startknopf sichtbar ist.
 * Das ist keine Invariante: Ein schneller Doppeltipp oder zwei offene
 * Fenster konnten zwei Messungen anlegen, und der feste Abstand von
 * vierzehn Tagen war nirgends unterhalb der Anzeige abgesichert. Wer misst,
 * bis das Ergebnis gefällt, misst nicht mehr sein Gedächtnis (F2b) — deshalb
 * gehört diese Regel unter die Oberfläche.
 */
export function benchmarkStartRefusal(
  slots: readonly BenchmarkSlot[],
  today: DayKey,
): BenchmarkStartRefusal | undefined {
  if (slots.some((slot) => !slot.completed && slot.abandoned !== true)) return 'open-run'

  const last = [...slots].sort((a, b) => a.ordinal - b.ordinal)[slots.length - 1]
  if (last === undefined) return undefined

  // `nextRunDue` liest von der Messung nur Tag und Sofortabruf; die Anzahl
  // spielt für den Termin keine Rolle.
  const due = nextRunDue({
    ordinal: last.ordinal,
    day: last.day,
    immediate: last.immediate,
    total: 0,
  })
  return due !== undefined && today < due ? 'not-due' : undefined
}
