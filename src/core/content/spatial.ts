/**
 * Räumliches Gedächtnis (Backlog D12).
 *
 * Die Aufgabe ist absichtlich klein und sprachfrei: Eine Markierung erscheint
 * in einem 3×3-Feld und wird später an derselben Position abgefragt. Der Kern
 * kennt dabei weder DOM noch SVG. Er liefert ausschließlich stabile Kennungen
 * und die daraus deterministisch folgende Position; gezeichnet wird erst in
 * der Oberfläche (A4/D-010).
 *
 * Wichtig für R-1 und den Scheduler: Die Position wird nie geraten oder
 * nachträglich rekonstruiert. Sie folgt vollständig aus der Item-Kennung.
 * Dieselbe Kennung ergibt heute und beim Wiedersehen in drei Wochen exakt
 * dieselbe Position.
 */

import { createRng } from '../rng.ts'

export const SPATIAL_PREFIX = 'space'
const SCENE_SEPARATOR = '~'

/** Neun feste Zellen, von links oben zeilenweise gelesen. */
export const SPATIAL_CELLS = [
  'nw',
  'n',
  'ne',
  'w',
  'c',
  'e',
  'sw',
  's',
  'se',
] as const

export type SpatialCell = (typeof SPATIAL_CELLS)[number]

/**
 * Erzeugt einen praktisch unerschöpflichen, deterministischen Vorrat.
 *
 * Die Kennung trägt nur die Szene. Die Zielposition wird daraus gerechnet,
 * damit es genau eine Wahrheit gibt und keine gespeicherte Antwort neben der
 * Kennung auseinanderlaufen kann.
 */
export function spatialPool(seed: string, count: number): string[] {
  if (!Number.isInteger(count) || count < 0) {
    throw new RangeError('count muss eine nichtnegative ganze Zahl sein')
  }

  const rng = createRng(`spatial-pool:${seed}`)
  const seen = new Set<string>()
  const pool: string[] = []

  while (pool.length < count) {
    const id = `${SPATIAL_PREFIX}${SCENE_SEPARATOR}${rng.int(1_000_000_000)}`
    if (seen.has(id)) continue
    seen.add(id)
    pool.push(id)
  }

  return pool
}

/** Ist die Kennung eine räumliche Aufgabe? */
export function isSpatialId(value: string): boolean {
  if (!value.startsWith(`${SPATIAL_PREFIX}${SCENE_SEPARATOR}`)) return false
  const suffix = value.slice(SPATIAL_PREFIX.length + SCENE_SEPARATOR.length)
  return /^\d+$/.test(suffix)
}

/**
 * Die richtige Zelle einer Aufgabe.
 *
 * Kein Zufall zur Laufzeit: `createRng` wird aus der Kennung neu aufgebaut.
 * Dadurch ist die Antwort reproduzierbar und kann vom Wiederholungsplan nur
 * über die Item-ID gespeichert werden.
 */
export function spatialCellOf(itemId: string): SpatialCell | undefined {
  if (!isSpatialId(itemId)) return undefined
  const rng = createRng(`spatial-cell:${itemId}`)
  return SPATIAL_CELLS[rng.int(SPATIAL_CELLS.length)] as SpatialCell
}

/** Zeile und Spalte für eine renderer-neutrale 3×3-Darstellung. */
export function spatialCoordinatesOf(
  itemId: string,
): { readonly row: 0 | 1 | 2; readonly column: 0 | 1 | 2 } | undefined {
  const cell = spatialCellOf(itemId)
  if (cell === undefined) return undefined
  const index = SPATIAL_CELLS.indexOf(cell)
  return {
    row: Math.floor(index / 3) as 0 | 1 | 2,
    column: (index % 3) as 0 | 1 | 2,
  }
}
