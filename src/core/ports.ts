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

/** Alles, was die App von der Plattform bekommt, an einer Stelle. */
export interface Platform {
  clock: Clock
  settings: SettingsStore
}
