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

export type BlockKind = 'encode' | 'recall'

export interface BlockPlan {
  /** Eindeutig innerhalb der Einheit, z. B. `r2-encode`. */
  id: string
  kind: BlockKind
  /** Ab 1 gezählt — die Runde, zu der dieser Block gehört. */
  round: number
  seconds: number
  /** Die Wörter dieser Runde. Beim Abruf das, was gesucht wird. */
  items: readonly string[]
}

export interface SessionPlan {
  mode: TrainingMode
  day: DayKey
  /** Aus ihm folgt die Wortauswahl — gleicher Seed, gleiche Einheit. */
  seed: string
  totalSeconds: number
  blocks: readonly BlockPlan[]
}

export interface PlanInput {
  mode: TrainingMode
  day: DayKey
  seed: string
  /** Der Wortvorrat der Trainingssprache. */
  pool: readonly string[]
}

export function planSession(input: PlanInput): SessionPlan {
  const totalSeconds = MODES[input.mode].seconds
  const rounds = Math.min(MAX_ROUNDS, Math.max(1, Math.floor(totalSeconds / SECONDS_PER_ROUND)))
  const rng = createRng(input.seed)

  const roundBudgets = share(totalSeconds, rounds)
  const blocks: BlockPlan[] = []

  // Über die ganze Einheit ohne Zurücklegen ziehen: Ein Wort, das in Runde 1
  // vorkam, darf in Runde 3 nicht noch einmal auftauchen — sonst misst der
  // spätere Abruf Wiedererkennen statt Erinnern.
  const remaining = rng.shuffle(input.pool)
  let taken = 0

  for (let round = 1; round <= rounds; round++) {
    const roundSeconds = roundBudgets[round - 1] as number
    const itemCount = itemsForRound(roundSeconds, remaining.length - taken)
    const encodeSeconds = itemCount * SECONDS_PER_ITEM
    const items = remaining.slice(taken, taken + itemCount)
    taken += itemCount

    blocks.push({
      id: `r${round}-encode`,
      kind: 'encode',
      round,
      seconds: encodeSeconds,
      items,
    })
    blocks.push({
      id: `r${round}-recall`,
      kind: 'recall',
      round,
      // Was vom Rundenbudget übrig ist — dadurch stimmt die Summe exakt,
      // ganz ohne Nachkommastellen.
      seconds: roundSeconds - encodeSeconds,
      items,
    })
  }

  return { mode: input.mode, day: input.day, seed: input.seed, totalSeconds, blocks }
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

/** Alle Wörter einer Einheit, in der Reihenfolge ihres Auftretens. */
export function itemsOf(plan: SessionPlan): string[] {
  return plan.blocks.filter((block) => block.kind === 'encode').flatMap((block) => [...block.items])
}
