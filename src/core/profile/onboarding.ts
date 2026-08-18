/**
 * Das Ankommens-Profil (Onboarding).
 *
 * Was der Mensch beim ersten Öffnen über sich sagt: Name, Ziel, Zeitbudget,
 * bevorzugte Tageszeit, Altersband. Alles freiwillig, alles überspringbar —
 * ein leeres Profil ist ein vollständiges Profil.
 *
 * Die wichtigste Regel steht nicht im Code, sondern dahinter: **Aus diesen
 * Angaben entsteht keine Aussage über das Gedächtnis** (R-1, D-021). Ein Ziel
 * darf einen Schwerpunkt *vorschlagen* — aber nur, solange die Messung nichts
 * sagt. Sobald es gezählte Wiedersehen gibt, regiert die Zählung, nicht der
 * Wunsch. Das Altersband wird gespeichert und macht bis auf Weiteres gar
 * nichts: Jede „für dein Alter“-Anpassung wäre eine erfundene Behauptung,
 * solange niemand gemessen hat, dass sie stimmt (R-2).
 */

import type { TrainingMode } from '../modes.ts'
import { DEFAULT_MODE, MODES } from '../modes.ts'
import type { ModuleId } from '../session/plan.ts'
import type { TimeOfDay } from '../reminders.ts'

/**
 * Grobe Bänder statt Geburtsjahr — mit Absicht. Ein genaues Alter wäre ein
 * präzises personenbezogenes Datum und löste bei Minderjährigen Pflichten
 * aus, die eine lokale App ohne Konto gar nicht erfüllen kann. Das Band
 * reicht für alles, was hier je damit geschehen soll.
 */
export const AGE_BANDS = ['under16', 'upTo29', 'upTo49', 'from50'] as const

export type AgeBand = (typeof AGE_BANDS)[number]

/**
 * Warum jemand herkommt. Die Liste ist kurz und konkret — „Ich will X“ statt
 * Persönlichkeitstest. `fit` hat bewusst keinen Schwerpunkt: Wer allgemein
 * üben will, bekommt die volle Rotation.
 */
export const GOALS = ['names', 'numbers', 'everyday', 'learning', 'fit'] as const

export type Goal = (typeof GOALS)[number]

/** Bevorzugte Tageszeit — grob, fürs Erinnerungs-Angebot, nicht mehr. */
export const DAY_PARTS = ['morning', 'midday', 'evening'] as const

export type DayPart = (typeof DAY_PARTS)[number]

/**
 * Alles optional. `undefined` im Speicher heißt „noch nie gefragt“; ein
 * gespeichertes leeres Objekt heißt „gefragt, und der Mensch wollte nichts
 * sagen“ — beides muss die App unterscheiden können, sonst fragt sie wieder.
 */
export interface OnboardingProfile {
  readonly name?: string
  readonly goal?: Goal
  readonly ageBand?: AgeBand
  readonly mode?: TrainingMode
  readonly dayPart?: DayPart
}

/** Länger wird kein Rufname — und die Anrede bleibt eine Zeile (G-2). */
export const NAME_MAX = 24

/**
 * Aus freier Eingabe wird ein Rufname: Ränder und Steuerzeichen weg, Länge
 * gedeckelt. Leer bleibt leer — ein Name aus Leerzeichen ist keiner.
 */
export function sanitizeName(raw: string): string | undefined {
  const cleaned = raw
    // eslint-disable-next-line no-control-regex -- genau darum geht es hier
    .replace(/[\u0000-\u001f\u007f]/gu, '')
    .trim()
    .slice(0, NAME_MAX)
    .trim()
  return cleaned.length > 0 ? cleaned : undefined
}

/**
 * Welches Modul zu einem Ziel passt. Nur eine Zuordnung von Wunsch zu
 * Übungsart — keine Aussage darüber, was jemand *kann*.
 */
export function focusForGoal(goal: Goal | undefined): ModuleId | undefined {
  switch (goal) {
    case 'names':
      return 'faces'
    case 'numbers':
      return 'numbers'
    case 'everyday':
      return 'missions'
    case 'learning':
      return 'words'
    default:
      return undefined
  }
}

/**
 * Der vorgeschlagene Startmodus. Nichts wird umgerechnet: Die Frage nach dem
 * Zeitbudget zeigt dieselben vier Modi, die auch der Startbildschirm kennt.
 * Ein gespeicherter Modus, den es nicht mehr gibt, fällt auf den Standard.
 */
export function suggestedMode(profile: OnboardingProfile | undefined): TrainingMode {
  const chosen = profile?.mode
  if (chosen !== undefined && Object.hasOwn(MODES, chosen)) return chosen
  return DEFAULT_MODE
}

/**
 * Eine Uhrzeit als Erinnerungs-**Vorschlag** aus der groben Tageszeit. Die
 * Erinnerung selbst bleibt aus, bis sie ausdrücklich eingeschaltet wird
 * (D-015: kein Angebot wird still zur Zusage).
 */
export function reminderTimeFor(dayPart: DayPart): TimeOfDay {
  switch (dayPart) {
    case 'morning':
      return '07:30'
    case 'midday':
      return '12:30'
    case 'evening':
      return '19:00'
  }
}

/** Typwächter für Gespeichertes — die Datenbank verspricht keine Form. */
export function isOnboardingProfile(value: unknown): value is OnboardingProfile {
  if (typeof value !== 'object' || value === null) return false
  const record = value as Record<string, unknown>
  if (record['name'] !== undefined && typeof record['name'] !== 'string') return false
  if (record['goal'] !== undefined && !GOALS.includes(record['goal'] as Goal)) return false
  if (record['ageBand'] !== undefined && !AGE_BANDS.includes(record['ageBand'] as AgeBand))
    return false
  if (record['mode'] !== undefined && !Object.hasOwn(MODES, record['mode'] as string)) return false
  if (record['dayPart'] !== undefined && !DAY_PARTS.includes(record['dayPart'] as DayPart))
    return false
  return true
}
