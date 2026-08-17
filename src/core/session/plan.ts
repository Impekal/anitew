/**
 * Der Bauplan einer Trainingseinheit (Backlog B2/B3).
 *
 * Das Zeitbudget ist eine **Zusage, keine Schätzung**: Die Summe aller Blöcke
 * ist auf die Sekunde genau die Länge des Modus. Wer „5 Minuten“ verspricht
 * und dann 5:40 braucht, hat das eine Versprechen gebrochen, auf dem diese App
 * steht — und der Nutzer merkt es beim dritten Mal.
 *
 * Umgekehrt ist das Budget eine **Obergrenze**: Wer einen Abrufblock früher
 * beendet, ist früher fertig. Zeit zurückzuhalten, nur damit die Zahl stimmt,
 * wäre Beschäftigung statt Training.
 *
 * B3 nennt für die volle Einheit fünf Blöcke (Focus, Encode, Recall, Working
 * Memory, Spaced Recall). Von deren Modulen gibt es bisher zwei. Statt die
 * fehlenden zu behaupten, plant ANITEW **Runden aus Einprägen und Abrufen** —
 * und wächst, sobald die anderen Module da sind (M2/M4).
 */

import { MODES, type TrainingMode } from '../modes.ts'
import { createRng } from '../rng.ts'
import type { DayKey } from '../time.ts'
import { nextToTeach } from '../technique/major.ts'
import type { Leniency } from './grading.ts'

/** Sekunden, die ein einzelnes Wort beim Einprägen bekommt. */
export const SECONDS_PER_ITEM = 4

/** Nie weniger als 3 und nie mehr als 8 Wörter je Runde. */
export const MIN_ITEMS_PER_ROUND = 3
export const MAX_ITEMS_PER_ROUND = 8

/** Kürzeste sinnvolle Runde. Darunter lohnt das Aufteilen nicht. */
const SECONDS_PER_ROUND = 90
const MAX_ROUNDS = 8

/** Anteil einer Runde, der aufs Einprägen entfällt. Der Rest ist Abruf. */
const ENCODE_SHARE = 0.4

/**
 * Anteil der Einheit für das Wiedersehen mit früheren Tagen (Backlog D8).
 *
 * B3 sieht dafür 30 von 300 Sekunden vor, also ein Zehntel. Etwas mehr, weil
 * hier das eigentliche Training steckt: Neues einzuprägen kann jeder, das
 * Behalten entscheidet sich beim Abruf nach Tagen. Der Block entfällt
 * vollständig, wenn nichts fällig ist — dann gibt es nichts vorzutäuschen.
 */
const REVIEW_SHARE = 0.15
const MIN_REVIEW_SECONDS = 20

/**
 * Sekunden für eine Lektion (Backlog D5).
 *
 * Vierzehn, weil eine Lektion aus einer Ziffer, zwei Buchstaben und einem Satz
 * besteht — mehr Zeit macht sie nicht besser, weniger reicht nicht zum Lesen.
 * Wer schneller ist, tippt weiter; das Budget ist auch hier eine Obergrenze.
 */
export const TEACH_SECONDS = 14

/**
 * Ab wann überhaupt gelehrt wird.
 *
 * Im Notfallmodus nicht. Sechzig Sekunden sind für den Fall gedacht, dass
 * jemand zwischen Tür und Angel übt — vierzehn davon für eine Lektion wäre
 * ein Viertel der Einheit, und wer es eilig hat, will trainieren und nicht
 * unterrichtet werden. Eine Technik lernt man in Ruhe oder gar nicht.
 */
export const MIN_SECONDS_FOR_TEACHING = 180

export type BlockKind = 'teach' | 'encode' | 'recall' | 'review'

/**
 * Die Trainingsmodule (Backlog D1).
 *
 * Ab hier wird die Modulschnittstelle konkret, und zwar an der einzigen
 * Stelle, an der sie es sein muss: Der Planer weiß, dass es mehrere gibt, und
 * mischt sie. Was ein Modul *zeigt*, weiß er nicht — er kennt nur Kennungen,
 * Zeiten und die Frage, ob der Abruf frei oder gestützt ist.
 */
export const TRAINING_MODULES = ['words', 'faces', 'numbers'] as const
export type ModuleId = (typeof TRAINING_MODULES)[number]

/**
 * Freier Abruf oder gestützter?
 *
 * **Wörter frei** — leeres Feld, schreib auf, was geblieben ist. Das ist die
 * stärkere Übung (C5).
 *
 * **Gesichter gestützt** — das Gesicht steht da, gesucht ist der Name. Anders
 * geht es nicht: „Nenne alle Gesichter“ ist keine Frage, die sich beantworten
 * lässt. Das ist keine Bequemlichkeit, sondern die Natur der Aufgabe — und
 * genau die Aufgabe, die im Alltag vorkommt.
 */
export function isPrompted(moduleId: ModuleId): boolean {
  return moduleId === 'faces'
}

/**
 * Wie streng dieses Modul vergleicht.
 *
 * **Zahlen genau, alles andere nachsichtig.** Bei Wörtern und Namen ist ein
 * Tippfehler ein Tippfehler — gemessen werden soll das Gedächtnis, nicht die
 * Tastatur. Bei einer Zahl sind zwei vertauschte Ziffern eine *andere Zahl*:
 * 4719 und 4791 sind nicht dieselbe PIN. Dort milde zu sein hieße, die
 * Aufgabe abzuschaffen und trotzdem einen Punkt zu geben.
 *
 * Die Strenge gehört zum Modul und nicht in die Bewertungsfunktion, weil sie
 * eine Aussage über den **Gegenstand** ist und nicht über das Verfahren.
 */
export function leniencyFor(moduleId: ModuleId): Leniency {
  return moduleId === 'numbers' ? 'exact' : 'typos'
}

export interface BlockPlan {
  /** Eindeutig innerhalb der Einheit, z. B. `r2-encode`. */
  id: string
  kind: BlockKind
  moduleId: ModuleId
  /** Ab 1 gezählt — die Runde, zu der dieser Block gehört. */
  round: number
  seconds: number
  /** Die Wörter dieser Runde. Beim Abruf das, was gesucht wird. */
  items: readonly string[]
}

export interface SessionPlan {
  mode: TrainingMode
  day: DayKey
  /** Die Trainingssprache. Sie gehört zur Einheit, nicht zur Oberfläche —
      dieselbe Einheit auf Deutsch und auf Japanisch sind zwei Einheiten. */
  language: string
  /** Aus ihm folgt die Wortauswahl — gleicher Seed, gleiche Einheit. */
  seed: string
  totalSeconds: number
  blocks: readonly BlockPlan[]
}

export interface PlanInput {
  mode: TrainingMode
  day: DayKey
  language: string
  seed: string
  /** Der Vorrat je Modul in der Trainingssprache. */
  pools: Pools
  /**
   * Einträge aus früheren Tagen, die heute fällig sind — je Modul, bereits
   * ausgewählt und gedeckelt (siehe `scheduler/due.ts`). Leer heißt: kein
   * Wiederholungsblock.
   */
  due?: Partial<Record<ModuleId, readonly string[]>>
  /**
   * Ziffern des Major-Systems, die schon gelehrt wurden (D5). Fehlt der Wert,
   * wird nicht gelehrt — eine Einheit ohne diese Angabe soll nicht plötzlich
   * bei der Eins anfangen.
   */
  taught?: readonly number[]
  /**
   * Welche Module dürfen heute vorkommen? Voreingestellt alle. Der Parameter
   * ist da, damit ein Test ein einzelnes Modul erzwingen kann, ohne dass der
   * Planer dafür eine Sonderregel bekommt.
   */
  modules?: readonly ModuleId[]
}

export type Pools = Readonly<Record<ModuleId, readonly string[]>>

export function planSession(input: PlanInput): SessionPlan {
  const totalSeconds = MODES[input.mode].seconds
  const modules = input.modules ?? TRAINING_MODULES

  // Nur Module, für die heute wirklich etwas fällig ist. Ein leerer
  // Wiederholungsblock wäre eine Frage ohne Gegenstand.
  const dueByModule = modules
    .map((moduleId) => ({ moduleId, items: input.due?.[moduleId] ?? [] }))
    .filter((entry) => entry.items.length > 0)

  // Erst das Wiedersehen abzweigen, dann den Rest in Runden teilen. Anders
  // herum bliebe für die Wiederholung übrig, was zufällig übrig ist — und
  // genau sie ist der Teil, der das Behalten ausmacht.
  const reviewSeconds =
    dueByModule.length === 0
      ? 0
      : Math.max(MIN_REVIEW_SECONDS * dueByModule.length, Math.round(totalSeconds * REVIEW_SHARE))
  const learnSeconds = totalSeconds - reviewSeconds

  const rounds = Math.min(MAX_ROUNDS, Math.max(1, Math.floor(learnSeconds / SECONDS_PER_ROUND)))
  const rng = createRng(input.seed)

  /*
   * Welches Modul in welcher Runde? Reihum, mit einem Startversatz aus dem
   * Seed. Ohne den Versatz käme in der kürzesten Einheit — die nur eine Runde
   * hat — immer dasselbe Modul dran, und wer nur den Notfallmodus benutzt,
   * sähe nie ein Gesicht.
   */
  const drawn = rng.int(modules.length)

  /*
   * Steht heute eine Lektion an, beginnt die Einheit mit **Zahlen** (D5).
   *
   * Der erste Anlauf hat das dem Zufall überlassen, und auf dem Bildschirm
   * sah man sofort, warum das falsch ist: Erst wird das Major-System erklärt,
   * dann kommen drei Runden Wörter, und benutzen darf man die frische Technik
   * in Runde drei. Eine Technik, die man nach dem Lernen nicht sofort
   * anwendet, ist am nächsten Tag wieder weg.
   *
   * Der Wurf fällt trotzdem — auch wenn er verworfen wird. Sonst hinge die
   * ganze folgende Mischung daran, ob heute unterrichtet wird, und dieselbe
   * Einheit sähe je nach Lernstand anders aus. Denselben Fehler hatte der
   * Bartwurf im Gesichtsgenerator schon einmal.
   */
  const numbersAt = modules.indexOf('numbers')
  const wantsLesson =
    totalSeconds >= MIN_SECONDS_FOR_TEACHING &&
    input.taught !== undefined &&
    nextToTeach(input.taught) !== undefined
  const teachesNumbers = wantsLesson && numbersAt >= 0

  const offset = teachesNumbers ? numbersAt : drawn
  const moduleForRound = (round: number): ModuleId =>
    modules[(offset + round - 1) % modules.length] as ModuleId

  // Gelehrt wird nur mit Gegenstand: Das Major-System zu erklären und dann
  // keine einzige Zahl zu zeigen wäre Unterricht ohne Anlass.
  const teachSeconds = teachesNumbers ? TEACH_SECONDS : 0
  const roundBudgets = share(learnSeconds - teachSeconds, rounds)
  const blocks: BlockPlan[] = []

  /*
   * Die Lektion steht **vorn**, vor der ersten Runde: Eine Technik, die man
   * nach der Übung erklärt bekommt, hat man bei der Übung nicht gehabt.
   */
  if (teachesNumbers) {
    blocks.push({
      id: 'teach-major',
      kind: 'teach',
      moduleId: 'numbers',
      // Dieselbe Runde wie das erste Einprägen: Die Lektion gehört dazu und
      // ist keine eigene. Sonst zählte der Kopf des Bildschirms sie mit und
      // zeigte „Runde 0 von 3“.
      round: 1,
      seconds: teachSeconds,
      // Die Ziffer, um die es geht — als Zeichenkette, wie jeder andere
      // Gegenstand auch. Der Block wird nicht bewertet.
      items: [String(nextToTeach(input.taught ?? []))],
    })
  }

  /*
   * Über die ganze Einheit ohne Zurücklegen ziehen: Ein Wort, das in Runde 1
   * vorkam, darf in Runde 3 nicht noch einmal auftauchen — sonst misst der
   * spätere Abruf Wiedererkennen statt Erinnern.
   *
   * Und aus demselben Grund werden die **fälligen Wörter vorher aus dem
   * Vorrat genommen**. Ohne das konnte „Anker“ am selben Tag als neues Wort
   * eingeprägt *und* am Ende als Wiedersehen abgefragt werden — der Abruf
   * hätte dann nicht die Erinnerung von vorgestern gemessen, sondern die von
   * vor zwei Minuten. Ein Test hat genau diesen Fall gefunden.
   */
  const remaining = new Map<ModuleId, string[]>()
  const taken = new Map<ModuleId, number>()
  for (const moduleId of modules) {
    const dueSet = new Set(input.due?.[moduleId] ?? [])
    remaining.set(
      moduleId,
      rng.shuffle((input.pools[moduleId] ?? []).filter((entry) => !dueSet.has(entry))),
    )
    taken.set(moduleId, 0)
  }

  for (let round = 1; round <= rounds; round++) {
    const moduleId = moduleForRound(round)
    const pool = remaining.get(moduleId) as string[]
    const used = taken.get(moduleId) as number

    const roundSeconds = roundBudgets[round - 1] as number
    const itemCount = itemsForRound(roundSeconds, pool.length - used)
    const encodeSeconds = itemCount * SECONDS_PER_ITEM
    const items = pool.slice(used, used + itemCount)
    taken.set(moduleId, used + itemCount)

    blocks.push({
      id: `r${round}-encode`,
      kind: 'encode',
      moduleId,
      round,
      seconds: encodeSeconds,
      items,
    })
    blocks.push({
      id: `r${round}-recall`,
      kind: 'recall',
      moduleId,
      round,
      // Was vom Rundenbudget übrig ist — dadurch stimmt die Summe exakt,
      // ganz ohne Nachkommastellen.
      seconds: roundSeconds - encodeSeconds,
      items,
    })
  }

  // Das Wiedersehen kommt zuletzt — so wie in der Blockfolge aus B3. Wer
  // gerade acht neue Wörter eingeprägt hat, ist für den Abruf von gestern
  // aufgewärmt, und der Abstand zum Einprägen ist am größten.
  //
  // Je Modul ein eigener Block: Wörter werden frei abgerufen, Gesichter
  // gestützt. Beides in einen Block zu werfen ginge nicht, ohne eine der
  // beiden Abrufarten zu verbiegen.
  if (reviewSeconds > 0) {
    const reviewBudgets = share(reviewSeconds, dueByModule.length)
    dueByModule.forEach((entry, index) => {
      blocks.push({
        id: `review-${entry.moduleId}`,
        kind: 'review',
        moduleId: entry.moduleId,
        round: rounds + 1 + index,
        seconds: reviewBudgets[index] as number,
        items: entry.items,
      })
    })
  }

  return {
    mode: input.mode,
    day: input.day,
    language: input.language,
    seed: input.seed,
    totalSeconds,
    blocks,
  }
}

function itemsForRound(roundSeconds: number, available: number): number {
  const byTime = Math.floor((roundSeconds * ENCODE_SHARE) / SECONDS_PER_ITEM)
  const wanted = Math.min(MAX_ITEMS_PER_ROUND, Math.max(MIN_ITEMS_PER_ROUND, byTime))
  if (available < MIN_ITEMS_PER_ROUND) {
    throw new RangeError(`Der Wortvorrat reicht nicht für eine Runde (${available} übrig)`)
  }
  return Math.min(wanted, available)
}

/**
 * Teilt `total` in `parts` ganze Sekunden, ohne dass eine verloren geht.
 * Der Rest wandert nach vorn — lieber die erste Runde eine Sekunde länger als
 * am Ende eine Einheit, die 4:59 dauert.
 */
function share(total: number, parts: number): number[] {
  const base = Math.floor(total / parts)
  let rest = total - base * parts
  return Array.from({ length: parts }, () => {
    const extra = rest > 0 ? 1 : 0
    rest -= extra
    return base + extra
  })
}

/** Die **neuen** Wörter einer Einheit, in der Reihenfolge ihres Auftretens. */
export function itemsOf(plan: SessionPlan, moduleId?: ModuleId): string[] {
  return plan.blocks
    .filter(
      (block) => block.kind === 'encode' && (moduleId === undefined || block.moduleId === moduleId),
    )
    .flatMap((block) => [...block.items])
}

/** Die Wörter, die heute wiederkommen. Leer, wenn nichts fällig war. */
export function reviewItemsOf(plan: SessionPlan, moduleId?: ModuleId): string[] {
  return plan.blocks
    .filter(
      (block) => block.kind === 'review' && (moduleId === undefined || block.moduleId === moduleId),
    )
    .flatMap((block) => [...block.items])
}

/** Welche Module kommen in dieser Einheit vor? */
export function modulesOf(plan: SessionPlan): ModuleId[] {
  return [...new Set(plan.blocks.map((block) => block.moduleId))]
}
