/**
 * Die Schnittstellen zur Außenwelt.
 *
 * Der Kern beschreibt hier, *was* er von der Plattform braucht. *Wie* das
 * erfüllt wird — IndexedDB, Web-Benachrichtigungen, die Uhr des Browsers, oder
 * später Android und iOS — steht in src/platform/ und geht den Kern nichts an
 * (D-010).
 *
 * Praktischer Nebeneffekt, auf den es beim Testen ankommt: Jede dieser
 * Schnittstellen lässt sich in drei Zeilen fälschen. Eine Uhr, die auf Befehl
 * springt, ist die einzige Art, Zeitzonenwechsel und Streak-Regeln zu prüfen,
 * ohne 60 Tage zu warten.
 */

import type { Instant } from './time.ts'

export interface Clock {
  /** Jetzt, in Millisekunden seit 1970. */
  now(): Instant
  /**
   * Minuten, die zu UTC addiert Ortszeit ergeben (Berlin im Sommer: +120).
   * Als Funktion des Zeitpunkts, weil sich das mit der Sommerzeit ändert.
   */
  offsetMinutes(at: Instant): number
  /**
   * Eine Uhr, die nur vorwärts läuft und von Zeitumstellungen unberührt
   * bleibt — für Dauer­messungen innerhalb einer Session. Die Wanduhr taugt
   * dafür nicht: Sie kann während eines laufenden Blocks springen.
   */
  elapsed(): number
}

export interface SettingsStore {
  read<T>(key: string): Promise<T | undefined>
  write<T>(key: string, value: T): Promise<void>
  remove(key: string): Promise<void>
}

/**
 * Die Anlässe, zu denen ANITEW klingt (D-011/G-9).
 *
 * Absichtlich wenige und absichtlich benannt nach dem *Ereignis*, nicht nach
 * dem Klang: Der Kern sagt „hier ist ein Wort erschienen“, nicht „spiel ein
 * F-Dur“. Wie das klingt, entscheidet die Plattform — und lässt sich ändern,
 * ohne den Kern anzufassen.
 */
export type SoundCue =
  /** Die Einheit beginnt. Zugleich der Griff, der auf iOS die Tonausgabe freischaltet. */
  | 'start'
  /** Ein neues Wort erscheint beim Einprägen. */
  | 'word'
  /** Ein getipptes Wort ist gelandet. */
  | 'type'
  /** Ein Block ist zu Ende. */
  | 'block'
  /** Die Einheit ist geschafft. */
  | 'done'

export interface Sound {
  /**
   * `step` verschiebt die Tonhöhe innerhalb der Tonleiter — beim Einprägen
   * steigt sie mit jedem Wort, damit man den Fortschritt hört, ohne
   * hinzusehen.
   */
  play(cue: SoundCue, step?: number): void
  setEnabled(on: boolean): void
  isEnabled(): boolean
}

/** Alles, was die App von der Plattform bekommt, an einer Stelle. */
export interface Platform {
  clock: Clock
  settings: SettingsStore
  sound: Sound
}
