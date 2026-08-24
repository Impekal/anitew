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

import type { CoachPort } from './coach/prompt.ts'
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
  /** Eine Erinnerung ist bestätigt und gehört jetzt zum Graphen (D-036). */
  | 'remember'
  /** Eine bestätigte Beziehung ist im persönlichen Graphen entstanden. */
  | 'connection'
  /** Ein fälliger persönlicher Knoten wird bewusst wieder betreten. */
  | 'return'
  /** Ein Abruf wurde aufgelöst. */
  | 'recall'
  /** Ein persönlicher Abruf blieb vollständig offen — weich, nie strafend. */
  | 'error'
  /** Mindestens eine persönliche Erinnerung ist tatsächlich wiedergekommen. */
  | 'landing'
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

/**
 * Was die Plattform an Erinnerungen wirklich kann (Backlog B8).
 *
 * `scheduled` heißt: Die Plattform kann die App auch nach dem Schließen wieder
 * für eine Systembenachrichtigung wecken. Im Web geschieht das über den
 * Standard Web Push + Service Worker, auf unterstütztem iOS ausschließlich
 * aus einer installierten Home-Screen-PWA.
 */
export type ReminderAbility =
  /** Erinnert auch, wenn die App zu ist. */
  | 'scheduled'
  /** Erinnert nur, solange die App offen ist. */
  | 'whileOpen'
  /** Kann nicht erinnern — kein Recht, keine Unterstützung, kein sicherer Kontext. */
  | 'none'

export type ReminderPermission = 'granted' | 'denied' | 'unasked'

export interface Reminder {
  /** Damit sich dieselbe Erinnerung ersetzen statt verdoppeln lässt. */
  id: string
  at: Instant
  title: string
  body: string
}

export interface Reminders {
  ability(): ReminderAbility
  permission(): ReminderPermission
  ask(): Promise<ReminderPermission>
  /** Plant eine Erinnerung. Gibt zurück, ob sie **wirklich** geplant wurde. */
  schedule(reminder: Reminder): Promise<boolean>
  /**
   * Ohne `permanent` darf eine wiederkehrende Tageserinnerung nur den heutigen
   * Termin überspringen. `permanent=true` bedeutet ausdrücklich „ausschalten“.
   */
  cancel(id: string, permanent?: boolean): Promise<void>
}

/** Alles, was die App von der Plattform bekommt, an einer Stelle. */
export interface Platform {
  clock: Clock
  settings: SettingsStore
  sound: Sound
  reminders: Reminders
  /** Der Draht des Coaches (D-031) — die einzige Netzstelle für Inhalte. */
  coach: CoachPort
}
