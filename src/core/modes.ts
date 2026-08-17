/**
 * Die Zeitmodi (Backlog J1–J4).
 *
 * Wichtig ist, was hier **nicht** steht: vier verschiedene Trainingsabläufe.
 * Ein Modus ist nur ein Zeitbudget. Dieselbe Engine füllt es — der
 * 60-Sekunden-Modus ist keine eigene App, sondern eine kürzere Decke über
 * demselben Bett. Das hält die Versprechen aus dem Produktgespräch
 * beieinander: Die 5 Minuten bleiben die Garantie, und wer mehr will, wird
 * nicht ausgebremst.
 */

export const TRAINING_MODES = ['emergency', 'short', 'daily', 'extended'] as const

export type TrainingMode = (typeof TRAINING_MODES)[number]

export interface ModeDefinition {
  id: TrainingMode
  /** Gesamtbudget in Sekunden. Eine Zusage, keine Schätzung. */
  seconds: number
  /** Hält dieser Modus die Streak am Leben? (D-008) */
  keepsStreak: boolean
  /** Zählt er als volle Tages-Challenge? Getrennt gezählt, ebenfalls D-008. */
  countsAsFullChallenge: boolean
}

export const MODES: Readonly<Record<TrainingMode, ModeDefinition>> = {
  emergency: { id: 'emergency', seconds: 60, keepsStreak: true, countsAsFullChallenge: false },
  short: { id: 'short', seconds: 180, keepsStreak: true, countsAsFullChallenge: false },
  daily: { id: 'daily', seconds: 300, keepsStreak: true, countsAsFullChallenge: true },
  extended: { id: 'extended', seconds: 900, keepsStreak: true, countsAsFullChallenge: true },
}

export const DEFAULT_MODE: TrainingMode = 'daily'

export function modeOf(id: string): ModeDefinition | undefined {
  // `Object.hasOwn` und nicht einfach `MODES[id]`: Ein gespeicherter Modus
  // kommt aus der Datenbank, und `MODES['toString']` liefert sonst brav eine
  // Funktion vom Prototyp statt `undefined`.
  if (!Object.hasOwn(MODES, id)) return undefined
  return MODES[id as TrainingMode]
}
