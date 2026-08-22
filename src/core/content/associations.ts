import type { Language } from '../language.ts'
import { answerFor, factKindOf, personOf, type FactKind } from './missions.ts'

/**
 * D13 — assoziativer Querabruf.
 *
 * Missionen fragen bisher vom Menschen zur Tatsache: „Elena — welches Zimmer?“.
 * Im Alltag läuft dieselbe Bindung ebenso oft rückwärts: „Wie hieß die Person
 * aus Zimmer 314?“ oder „Wer hatte den roten Koffer?“. Dieses kleine Format
 * macht genau diese Gegenrichtung zu einem eigenen Gedächtnis-Item, ohne eine
 * neue Szene oder rückwirkend erfundene Daten einzuführen.
 *
 * Die Kennung enthält weiterhin die ursprüngliche Person und Tatsachenart.
 * Daraus wird die Szene deterministisch neu erzeugt; weder Cue noch Antwort
 * werden separat gespeichert oder geraten.
 */
const REVERSE_SUFFIX = '~person'

export type AssociationDirection = 'fact-to-person'

export interface AssociationCue {
  readonly direction: AssociationDirection
  readonly kind: FactKind
  /** Die tatsächlich gelernte Tatsache, z. B. „314“ oder „roter Koffer“. */
  readonly cue: string
  /** Die gesuchte Person. */
  readonly target: string
}

/** Aus `Elena#room` wird das separate Querabruf-Item `Elena#room~person`. */
export function associationId(missionItem: string): string | undefined {
  return factKindOf(missionItem) === undefined ? undefined : `${missionItem}${REVERSE_SUFFIX}`
}

/** Das ursprüngliche Mission-Item hinter einem Querabruf. */
export function baseMissionItem(item: string): string {
  return item.endsWith(REVERSE_SUFFIX) ? item.slice(0, -REVERSE_SUFFIX.length) : item
}

export function isAssociationId(item: string): boolean {
  return item.endsWith(REVERSE_SUFFIX) && factKindOf(baseMissionItem(item)) !== undefined
}

/**
 * Liefert Cue und Ziel ausschließlich aus der deterministischen Mission.
 * Ungültige IDs werden nicht still interpretiert.
 */
export function associationCueFor(item: string, language: Language): AssociationCue | undefined {
  if (!item.endsWith(REVERSE_SUFFIX)) return undefined
  const base = item.slice(0, -REVERSE_SUFFIX.length)
  const kind = factKindOf(base)
  if (kind === undefined) return undefined
  const cue = answerFor(base, language)
  if (cue === undefined) return undefined
  return {
    direction: 'fact-to-person',
    kind,
    cue,
    target: personOf(base),
  }
}

/**
 * Querabrufe einer Szene. Die Lage bleibt enthalten: „neben dem Fenster — wer?“
 * ist eine echte Bindung wie Zimmer, Gegenstand, Zeit oder Ort.
 */
export function associationItems(person: string): readonly string[] {
  return [
    `${person}#room${REVERSE_SUFFIX}`,
    `${person}#object${REVERSE_SUFFIX}`,
    `${person}#location${REVERSE_SUFFIX}`,
    `${person}#time${REVERSE_SUFFIX}`,
    `${person}#place${REVERSE_SUFFIX}`,
  ]
}
