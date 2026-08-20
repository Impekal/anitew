/**
 * Wann kommt eine Information wieder? (D-004, Backlog C1–C4)
 *
 * Hier liegt der Kern des Versprechens aus dem Produktgespräch:
 * *„Diese Information vergisst DU wahrscheinlich in ungefähr 5 Tagen.“*
 *
 * Gerechnet wird mit **FSRS** (`ts-fsrs`, MIT, ohne eigene Abhängigkeiten).
 * FSRS führt für jede einzelne Information zwei Werte mit — **Stabilität**
 * (wie fest sie sitzt) und **Schwierigkeit** (wie schwer sie dir fällt) — und
 * sagt daraus voraus, wann die Erinnerungswahrscheinlichkeit unter die
 * Zielmarke fällt. Genau dann wird wieder gefragt.
 *
 * Vier Anpassungen an ANITEW, jede mit Grund:
 *
 * 1. **Keine Zufallsstreuung.** FSRS kann Intervalle leicht verwürfeln, damit
 *    sich Stapel nicht auftürmen. Das braucht Zufall und würde A11 brechen —
 *    eine Einheit ließe sich nicht mehr aus ihrem Seed wiederherstellen.
 *    Gegen Stapelbildung hilft hier die Obergrenze in `due.ts`.
 *
 * 2. **Keine Schritte innerhalb eines Tages.** FSRS kann eine Karte nach
 *    zehn Minuten erneut zeigen. ANITEW ist eine App für einmal am Tag; ein
 *    Intervall, das kürzer als ein Tag ist, hätte hier keinen Ort.
 *
 * 3. **Tage statt Zeitstempel.** Nach außen spricht dieses Modul nur in
 *    `DayKey`. Intern werden daraus Zeitpunkte um 12 Uhr UTC — die Mitte des
 *    Tages, damit keine Zeitumstellung und keine Rundung ein Intervall um
 *    einen Tag verschieben kann.
 *
 * 4. **Zwei Noten statt vier.** FSRS kennt „nochmal / schwer / gut / leicht“.
 *    Der freie Abruf in ANITEW kennt nur „erinnert“ oder „nicht erinnert“ —
 *    und mehr wird auch nicht behauptet. Nach „gut“ und „nochmal“ zu
 *    unterscheiden ist ehrlich; den Nutzer nach seinem Gefühl zu fragen und
 *    das als Messung zu verbuchen, wäre es nicht (R-1).
 */

import {
  Rating,
  State,
  checkParameters,
  createEmptyCard,
  fsrs,
  generatorParameters,
  type Card,
  type FSRSParameters,
} from 'ts-fsrs'

import { type DayKey, daysBetween } from '../time.ts'

/**
 * Zielretention: Bei welcher Erinnerungswahrscheinlichkeit wird wieder
 * gefragt? 0,9 heißt „frag mich wieder, wenn ich es zu 90 % noch weiß“.
 * Höher wäre gründlicher und anstrengender, niedriger lockerer und lückiger.
 */
export const TARGET_RETENTION = 0.9

/**
 * Kein Intervall länger als zehn Jahre — darüber wird die Zahl albern.
 *
 * Nachgemessen: `ts-fsrs` überschreitet diese Grenze am Anschlag um **genau
 * einen Tag** (3651 statt 3650). Das ist eine Eigenheit der Bibliothek, keine
 * unsrige, und in zehn Jahren Abstand belanglos — es steht hier nur, damit
 * niemand die Grenze für exakt hält und später eine Stunde mit der Suche
 * verbringt.
 */
export const MAX_INTERVAL_DAYS = 3650

/**
 * Von einem Optimizer gelernte FSRS-Gewichte.
 *
 * C10 speichert später nur diesen Vektor. Retention, Maximalintervall,
 * Kurzzeitschritte und Zufallsstreuung bleiben Produktregeln von ANITEW und
 * dürfen durch Optimierung nicht nebenbei verändert werden.
 */
export type MemorySchedulerWeights = readonly number[]

/**
 * Baut die vollständige Scheduler-Konfiguration aus optionalen persönlichen
 * Gewichten. Extern gelernte Werte werden an der Kern-Grenze validiert; die
 * übrigen ANITEW-Regeln bleiben unverändert.
 */
export function memorySchedulerParameters(weights?: MemorySchedulerWeights): FSRSParameters {
  const validated = weights === undefined ? undefined : [...checkParameters(weights)]
  return generatorParameters({
    request_retention: TARGET_RETENTION,
    maximum_interval: MAX_INTERVAL_DAYS,
    enable_fuzz: false,
    enable_short_term: false,
    ...(validated === undefined ? {} : { w: validated }),
  })
}

const engine = fsrs(memorySchedulerParameters())

function engineFor(weights?: MemorySchedulerWeights) {
  return weights === undefined ? engine : fsrs(memorySchedulerParameters(weights))
}

/** Was ANITEW sich über eine einzelne Information merkt. */
export interface Memory {
  /** Wie fest sie sitzt, in Tagen. Größer heißt länger haltbar. */
  stability: number
  /** Wie schwer sie diesem Nutzer fällt, 1 bis 10. */
  difficulty: number
  /** Wie oft sie abgefragt wurde. */
  reviews: number
  /** Wie oft sie vergessen war. */
  lapses: number
  /** FSRS-eigener Zustand, damit ein Neuaufbau exakt weiterrechnet. */
  state: number
  /** Der Tag der letzten Abfrage. */
  lastDay?: DayKey
  /** Der Tag, an dem wieder gefragt werden soll. */
  dueDay: DayKey
}

/**
 * Eine Information, die gerade zum ersten Mal gezeigt wurde.
 *
 * Der Kaltstart (C4) kommt von FSRS selbst: Aus der ersten Note folgt die
 * erste Stabilität. Wir setzen nichts eigenes davor — eine geratene
 * Anfangsstabilität wäre genau die erfundene Zahl aus R-1.
 */
export function newMemory(
  day: DayKey,
  recalled: boolean,
  weights?: MemorySchedulerWeights,
): Memory {
  return review(fromCard(createEmptyCard(dayToDate(day)), day), day, recalled, weights)
}

/** Eine Abfrage verbuchen und den nächsten Termin berechnen. */
export function review(
  memory: Memory,
  day: DayKey,
  recalled: boolean,
  weights?: MemorySchedulerWeights,
): Memory {
  const { card } = engineFor(weights).next(
    toCard(memory),
    dayToDate(day),
    recalled ? Rating.Good : Rating.Again,
  )
  return fromCard(card, day)
}

/**
 * In wie vielen Tagen wird diese Information voraussichtlich vergessen sein?
 *
 * Das ist keine eigene Rechnung, sondern die Aussage des Termins selbst: FSRS
 * legt ihn genau dorthin, wo die Erinnerungswahrscheinlichkeit auf die
 * Zielmarke fällt. Der Abstand von der letzten Abfrage bis dahin **ist** die
 * Vorhersage.
 */
export function forgetsInDays(memory: Memory): number {
  if (memory.lastDay === undefined) return 0
  return Math.max(0, daysBetween(memory.lastDay, memory.dueDay))
}

/** Ist diese Information heute (oder überfällig) dran? */
export function isDue(memory: Memory, today: DayKey): boolean {
  return daysBetween(memory.dueDay, today) >= 0
}

/** Wie viele Tage überfällig? Negativ, wenn noch nicht fällig. */
export function overdueBy(memory: Memory, today: DayKey): number {
  return daysBetween(memory.dueDay, today)
}

function toCard(memory: Memory): Card {
  const last = memory.lastDay
  return {
    due: dayToDate(memory.dueDay),
    stability: memory.stability,
    difficulty: memory.difficulty,
    elapsed_days: 0,
    scheduled_days: 0,
    learning_steps: 0,
    reps: memory.reviews,
    lapses: memory.lapses,
    state: memory.state as State,
    ...(last === undefined ? {} : { last_review: dayToDate(last) }),
  }
}

function fromCard(card: Card, day: DayKey): Memory {
  return {
    stability: card.stability,
    difficulty: card.difficulty,
    reviews: card.reps,
    lapses: card.lapses,
    state: card.state,
    lastDay: card.last_review === undefined ? undefined : day,
    dueDay: dateToDay(card.due),
  }
}

/**
 * Ein Tag wird zur Tagesmitte in UTC.
 *
 * Nicht Mitternacht: Ein Intervall von „genau einem Tag“ landet dann auf der
 * Grenze, und jede Rundung — oder eine Zeitumstellung von einer Stunde —
 * kippt es auf die falsche Seite. Von der Mitte aus sind es zu beiden Rändern
 * zwölf Stunden Luft.
 */
function dayToDate(key: DayKey): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key)
  if (match === null) throw new RangeError(`Kein Tagesschlüssel: ${key}`)
  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12))
}

function dateToDay(at: Date): DayKey {
  const year = at.getUTCFullYear().toString().padStart(4, '0')
  const month = (at.getUTCMonth() + 1).toString().padStart(2, '0')
  const day = at.getUTCDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}
