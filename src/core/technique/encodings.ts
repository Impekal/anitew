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
