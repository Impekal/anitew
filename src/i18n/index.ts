/**
 * Mehrsprachigkeit ab der ersten Zeile (Backlog L1).
 *
 * Nachträglich eingezogen kostet i18n das Zehnfache, weil dann jeder Text
 * einzeln aus dem Code gesucht werden muss. Deshalb steht sie schon in M0 —
 * obwohl es bisher nur zwei Sprachen und kaum Texte gibt.
 *
 * Übersetzt sind `de` (Quelle, D-007) und `en`. Die übrigen neun Sprachen aus
 * L2 sind bereits als Sprache bekannt (core/language.ts), aber noch nicht
 * geschrieben; bis dahin zeigt die App für sie Englisch und sagt das auch.
 */

import { FALLBACK_LANGUAGE, type Language } from '../core/index.ts'

import { de } from './de.ts'
import { en } from './en.ts'

/**
 * Die Form aller Wörterbücher ergibt sich aus der Quellsprache.
 *
 * `de` ist `as const` und hätte damit die deutschen Texte selbst als Typ —
 * eine Übersetzung müsste wörtlich „Beginnen“ heißen. `Widen` behält deshalb
 * den Aufbau und lässt an den Blättern beliebige Zeichenketten zu. Ergebnis:
 * Ein vergessener Schlüssel in `en.ts` ist ein Übersetzungsfehler, kein leerer
 * Text zur Laufzeit.
 */
type Widen<T> = T extends string ? string : { [K in keyof T]: Widen<T[K]> }

export type Dictionary = Widen<typeof de>

const DICTIONARIES: Partial<Record<Language, Dictionary>> = {
  de,
  en,
}

export function dictionaryFor(language: Language): Dictionary {
  return DICTIONARIES[language] ?? DICTIONARIES[FALLBACK_LANGUAGE] ?? de
}

/** Gibt es für diese Sprache schon Texte, oder behelfen wir uns mit Englisch? */
export function isTranslated(language: Language): boolean {
  return DICTIONARIES[language] !== undefined
}
