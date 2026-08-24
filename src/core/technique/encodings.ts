/**
 * Die Einpräge-Lektionen: Geschichte und Verknüpfung (Backlog D5 · D-013).
 *
 * Zwei Techniken, je **eine** Lektion — wie beim Palast: in vier Sätzen
 * erzählt, der Rest ist Übung. Die **Geschichte** gehört zu den Wörtern
 * (verbinde sie zu einer absurden Handlung — die Reihenfolge trägt sich
 * selbst), die **Verknüpfung** zu den Gesichtern (such ein Merkmal und
 * baue den Namen daran fest).
 *
 * Der Vorrang ist eine Entscheidung: Diese beiden kommen **vor** den zehn
 * Ziffern des Major-Systems dran. Wer zuerst zehn Einheiten lang Ziffern
 * lernt, sieht die Geschichten-Methode erst in Woche zwei — dabei trägt
 * sie vom ersten Wort an. Der Palast bleibt davor (ohne seine Erklärung
 * ist ein Gang unverständlich; eine ungelehrte Technik kostet nur Kraft).
 */

import type { ModuleId } from '../session/planBase.ts'

export const ENCODING_LESSONS = ['story', 'link'] as const

export type EncodingLesson = (typeof ENCODING_LESSONS)[number]

/** Das Modul, in dem die Technik sofort angewandt wird (D5: Unterricht
 *  ohne Anwendung ist am nächsten Tag wieder weg). */
export function encodingModuleOf(lesson: EncodingLesson): ModuleId {
  return lesson === 'story' ? 'words' : 'faces'
}

export interface EncodingState {
  /** Wie `palaceTaught`: fehlt der Wert, wird nicht gelehrt. */
  readonly storyTaught?: boolean
  readonly linkTaught?: boolean
}

/**
 * Welche Einpräge-Lektion heute dran wäre — oder keine.
 *
 * Nur eine je Einheit, nur wenn ihr Modul heute überhaupt lernbar ist
 * (sonst wäre es Unterricht ohne Anlass), und nur solange sie nie gehalten
 * wurde. Die Reihenfolge Geschichte→Verknüpfung ist fest: Zwei Lektionen,
 * die um den ersten Platz losen, wären zwei Einheiten, die sich
 * widersprechen.
 */
export function nextEncodingLesson(
  state: EncodingState,
  learnFrom: readonly ModuleId[],
): EncodingLesson | undefined {
  for (const lesson of ENCODING_LESSONS) {
    const taught = lesson === 'story' ? state.storyTaught : state.linkTaught
    if (taught === false && learnFrom.includes(encodingModuleOf(lesson))) return lesson
  }
  return undefined
}

/**
 * V4.2 — der schmale Technik-Matcher.
 *
 * Er behauptet **nicht**, welche Technik bei einem Menschen „am besten“
 * funktioniert. Dafür fehlt ohne spätere Abrufe die Evidenz. Er beantwortet
 * nur die strukturelle Frage: Welche bereits vorhandene Technik passt zur
 * Form des Materials überhaupt? So kann die Oberfläche später Vorschläge
 * machen und deren Wirkung an echten Wiedersehen prüfen, ohne KI-Pflicht und
 * ohne eine zweite Trainingslogik einzubauen.
 */
export type TechniqueMatch = 'major' | 'palace' | 'story' | 'link'
export type TechniqueMaterial =
  | 'person'
  | 'place'
  | 'number'
  | 'date'
  | 'sequence'
  | 'fact'
  | 'concept'
  | 'custom'

export function techniqueForMaterial(
  material: TechniqueMaterial,
  itemCount = 1,
): TechniqueMatch | undefined {
  if (material === 'person') return 'link'
  if (material === 'place') return 'palace'
  if (material === 'number' || material === 'date') return 'major'
  if (material === 'sequence') return 'story'
  // Lose Fakten erst dann als Geschichte vorschlagen, wenn wirklich mehrere
  // Dinge verbunden werden sollen. Für eine einzelne Tatsache wäre das nur
  // zusätzlicher Aufwand und damit keine sinnvolle Empfehlung.
  if ((material === 'fact' || material === 'concept' || material === 'custom') && itemCount >= 3) {
    return 'story'
  }
  return undefined
}
