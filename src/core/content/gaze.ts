/**
 * Bilder mit Einzelheiten — das visuelle Modul (Backlog E2: Achse „Visuell“).
 *
 * Eine Szene aus vier einfachen Dingen, jedes in einer Farbe. Eingeprägt
 * wird das Bild als Ganzes; gefragt wird nach der Einzelheit: „Der Schirm —
 * welche Farbe?“ Das ist visuelles Gedächtnis im Alltagsformat — nicht „male
 * das Bild nach“, sondern „war der Schirm rot oder blau?“.
 *
 * Gebaut wie der Palast (D-014): Die Szene ist eine **Szene**, keine Liste.
 * Ihre Kennung erzeugt ihren Inhalt (`bild~7` → immer dieselben vier Dinge
 * in denselben Farben) — dadurch lässt sich ein Wiedersehen nach Tagen
 * stellen, ohne das Bild zu speichern. Der Kern liefert nur die
 * **Beschreibung**; gezeichnet wird in der Oberfläche (D-010, wie bei den
 * Gesichtern).
 */

import { createRng } from '../rng.ts'
import type { Language } from '../language.ts'

/** Kennungsform: `bild~7` für die Szene, `bild~7#umbrella` für ein Ding. */
export const GAZE_PREFIX = 'bild'
const SCENE_SEPARATOR = '~'
const ITEM_SEPARATOR = '#'

/** Wie viele Dinge eine Szene trägt — vier: genug zum Binden, kein Suchbild. */
export const GAZE_SCENE_SIZE = 4

export const GAZE_OBJECTS = [
  'umbrella',
  'sun',
  'boat',
  'kite',
  'fish',
  'bird',
  'tree',
  'moon',
  'key',
  'bell',
] as const

export type GazeObject = (typeof GAZE_OBJECTS)[number]

export const GAZE_COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'] as const
export type GazeColor = (typeof GAZE_COLORS)[number]

const OBJECT_NAMES: Readonly<Partial<Record<Language, Readonly<Record<GazeObject, string>>>>> = {
  de: {
    umbrella: 'Schirm', sun: 'Sonne', boat: 'Boot', kite: 'Drachen', fish: 'Fisch',
    bird: 'Vogel', tree: 'Baum', moon: 'Mond', key: 'Schlüssel', bell: 'Glocke',
  },
  en: {
    umbrella: 'umbrella', sun: 'sun', boat: 'boat', kite: 'kite', fish: 'fish',
    bird: 'bird', tree: 'tree', moon: 'moon', key: 'key', bell: 'bell',
  },
  fr: {
    umbrella: 'parapluie', sun: 'soleil', boat: 'bateau', kite: 'cerf-volant', fish: 'poisson',
    bird: 'oiseau', tree: 'arbre', moon: 'lune', key: 'clé', bell: 'cloche',
  },
  es: {
    umbrella: 'paraguas', sun: 'sol', boat: 'barco', kite: 'cometa', fish: 'pez',
    bird: 'pájaro', tree: 'árbol', moon: 'luna', key: 'llave', bell: 'campana',
  },
}

const COLOR_NAMES: Readonly<Partial<Record<Language, Readonly<Record<GazeColor, string>>>>> = {
  de: { red: 'Rot', blue: 'Blau', green: 'Grün', yellow: 'Gelb', purple: 'Lila', orange: 'Orange' },
  en: { red: 'red', blue: 'blue', green: 'green', yellow: 'yellow', purple: 'purple', orange: 'orange' },
  fr: { red: 'rouge', blue: 'bleu', green: 'vert', yellow: 'jaune', purple: 'violet', orange: 'orange' },
  es: { red: 'rojo', blue: 'azul', green: 'verde', yellow: 'amarillo', purple: 'morado', orange: 'naranja' },
}

/** Gibt es dieses Modul in dieser Sprache? */
export function hasGazePool(language: Language): boolean {
  return OBJECT_NAMES[language] !== undefined && COLOR_NAMES[language] !== undefined
}

export interface GazeDetail {
  /** Der sprachfreie Schlüssel des Dings — steht auch in der Kennung. */
  object: GazeObject
  /** Die sprachfreie Farbe — für die Zeichnung. */
  color: GazeColor
}

export function gazeSpec(sceneId: string): readonly GazeDetail[] {
  const rng = createRng(`gaze:${sceneId}`)
  const objects = rng.shuffle([...GAZE_OBJECTS]).slice(0, GAZE_SCENE_SIZE)
  const colors = rng.shuffle([...GAZE_COLORS]).slice(0, GAZE_SCENE_SIZE)
  return objects.map((object, index) => ({ object, color: colors[index] as GazeColor }))
}

/** Der Vorrat: fortlaufend nummerierte Szenen, Reihenfolge aus dem Seed. */
export function gazePool(seed: string, count: number): string[] {
  const rng = createRng(`gaze-pool:${seed}`)
  const seen = new Set<string>()
  const pool: string[] = []
  while (pool.length < count) {
    const id = `${GAZE_PREFIX}${SCENE_SEPARATOR}${rng.int(100000)}`
    if (seen.has(id)) continue
    seen.add(id)
    pool.push(id)
  }
  return pool
}

export function gazePlacements(sceneId: string): readonly string[] {
  return gazeSpec(sceneId).map((detail) => `${sceneId}${ITEM_SEPARATOR}${detail.object}`)
}

export function gazeSceneOf(item: string): string {
  return item.split(ITEM_SEPARATOR)[0] ?? item
}

export function gazeObjectOf(item: string): GazeObject | undefined {
  const key = item.split(ITEM_SEPARATOR)[1]
  return (GAZE_OBJECTS as readonly string[]).includes(key ?? '') ? (key as GazeObject) : undefined
}

export function isGazeId(value: string): boolean {
  return value.startsWith(`${GAZE_PREFIX}${SCENE_SEPARATOR}`)
}

export function gazeAnswer(item: string, language: Language): string | undefined {
  const object = gazeObjectOf(item)
  if (object === undefined) return undefined
  const detail = gazeSpec(gazeSceneOf(item)).find((entry) => entry.object === object)
  if (detail === undefined) return undefined
  return COLOR_NAMES[language]?.[detail.color]
}

export function gazeObjectName(item: string, language: Language): string | undefined {
  const object = gazeObjectOf(item)
  if (object === undefined) return undefined
  return OBJECT_NAMES[language]?.[object]
}

/** Alle Ding- und Farbnamen einer Sprache — für die Vorratsprüfungen (C6). */
export function gazeVocabulary(language: Language): readonly string[] {
  return [
    ...Object.values(OBJECT_NAMES[language] ?? {}),
    ...Object.values(COLOR_NAMES[language] ?? {}),
  ]
}
