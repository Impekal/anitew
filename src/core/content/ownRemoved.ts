/**
 * Was von den eigenen Inhalten noch da ist (G3 · I · N9).
 *
 * Seit die eigenen Paläste und Paare über Drive vereinigt werden, braucht
 * jede Seite einen Merkzettel des Weggeworfenen: Eine reine Vereinigung kann
 * nichts löschen, das andere Gerät brächte jedes gelöschte Stück beim nächsten
 * Abgleich zurück. Dieselbe Lösung, die der Memory-Graph (D-036) schon benutzt.
 *
 * Hier steht nur das **Lesen** — es läuft beim Öffnen der Seiten und damit im
 * Kaltstart. Das Zusammenführen zweier Stände steht in `sync/ownContent.ts`
 * und wird erst geladen, wenn wirklich abgeglichen wird (P4).
 */

import type { OwnPalace } from '../content/palace.ts'
import type { OwnFact } from '../content/own.ts'

/** Der Speicher der eigenen Paläste, so wie er in den Einstellungen liegt. */
export interface OwnPalaceStore {
  readonly palaces: readonly OwnPalace[]
  /** Die nächste zu vergebende laufende Nummer. Sie geht nur nach vorn. */
  readonly nextOrdinal: number
}

/** Weggeworfenes: Kennung beziehungsweise Frage → wann es wegkam. */
export type RemovedMarks = Readonly<Record<string, number>>

export function readRemovedMarks(value: unknown): RemovedMarks | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return undefined
  const marks: Record<string, number> = {}
  for (const [key, at] of Object.entries(value as Record<string, unknown>)) {
    if (typeof at === 'number' && Number.isFinite(at)) marks[key] = at
  }
  return marks
}

/**
 * Die Paläste, die es noch gibt.
 *
 * `nextOrdinal` bleibt unangetastet: Eine weggeworfene Nummer darf nie ein
 * zweites Mal vergeben werden, sonst erbte der neue Palast die Termine des
 * alten — dieselbe Regel, aus der `data/palace.ts` seine Kennungen vergibt.
 */
export function activeOwnPalaces(store: OwnPalaceStore, removed: unknown): OwnPalaceStore {
  const marks = readRemovedMarks(removed)
  if (marks === undefined || Object.keys(marks).length === 0) return store
  return {
    palaces: store.palaces.filter((palace) => marks[palace.id] === undefined),
    nextOrdinal: store.nextOrdinal,
  }
}

/** Die Paare, die es noch gibt. Der Schlüssel ist die Frage. */
export function activeOwnFacts(facts: readonly OwnFact[], removed: unknown): readonly OwnFact[] {
  const marks = readRemovedMarks(removed)
  if (marks === undefined || Object.keys(marks).length === 0) return facts
  return facts.filter((fact) => marks[fact.prompt] === undefined)
}
