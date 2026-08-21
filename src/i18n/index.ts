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

type SourceDictionary = Widen<typeof de>

/**
 * Missions-Tatsachen und renderer-eigene Module wachsen unabhängig von den
 * vorhandenen UI-Texten.
 *
 * `missionAsk` und `missionPlaceholders` waren ursprünglich aus vier festen
 * Schlüsseln abgeleitet. H2 ergänzt eine fünfte Tatsache (`location`), ohne
 * dafür die komplette Quellübersetzung umzuschreiben: Die beiden Verzeichnisse
 * dürfen zusätzliche String-Schlüssel tragen; `dictionaryFor()` setzt die
 * zwei neuen Texte unten explizit ein.
 *
 * D12 hat mit dem 3×3-Raster einen eigenen Renderer. Sein Einprägebild braucht
 * keinen modulspezifischen Satz aus `encodeHints`; trotzdem muss der generische
 * Session-Zweig typseitig weitere Modulkennungen zulassen, weil die Auswahl
 * erst im JSX auf den Spatial-Renderer verzweigt. Das Record hält diese
 * Typgrenze offen, ohne einen Text zu erfinden, der zur Laufzeit nie gelesen
 * wird.
 */
export type Dictionary = Omit<SourceDictionary, 'session'> & {
  session: Omit<SourceDictionary['session'], 'missionAsk' | 'missionPlaceholders' | 'encodeHints'> & {
    missionAsk: SourceDictionary['session']['missionAsk'] & Record<string, string>
    missionPlaceholders: SourceDictionary['session']['missionPlaceholders'] & Record<string, string>
    encodeHints: SourceDictionary['session']['encodeHints'] & Record<string, string>
  }
}

const DICTIONARIES: Partial<Record<Language, Dictionary>> = {
  de,
  en,
}

const MISSION_LOCATION_COPY: Readonly<
  Partial<Record<Language, { ask: string; placeholder: string }>>
> = {
  de: { ask: 'Wo lag der Gegenstand?', placeholder: 'Position' },
  en: { ask: 'Where was the object?', placeholder: 'Position' },
}

export interface MemoryForecastCopy {
  readonly label: string
  readonly value: string
}

const MEMORY_FORECAST_COPY: Readonly<Partial<Record<Language, MemoryForecastCopy>>> = {
  de: {
    label: 'Vergessensprognose',
    value: 'FSRS schätzt etwa {days} Tage bis zur 90%-Schwelle — aus mindestens drei echten Wiedersehen.',
  },
  en: {
    label: 'Forgetting forecast',
    value: 'FSRS estimates about {days} days to the 90% threshold — based on at least three real returns.',
  },
}

/**
 * Ergänzt die H2-Texte ohne das Quellobjekt zu verändern.
 *
 * Das ist wichtig, weil Wörterbücher an mehreren Stellen geteilt werden. Eine
 * Mutation hier würde einen Sprachwechsel davon abhängig machen, welche
 * Sprache vorher geöffnet war. Stattdessen entsteht ein flacher neuer
 * Session-Zweig mit genau den beiden zusätzlichen Schlüsseln.
 */
function withMissionLocation(dictionary: Dictionary, language: Language): Dictionary {
  const copy =
    MISSION_LOCATION_COPY[language] ??
    MISSION_LOCATION_COPY[FALLBACK_LANGUAGE] ??
    MISSION_LOCATION_COPY.de
  if (copy === undefined) return dictionary

  return {
    ...dictionary,
    session: {
      ...dictionary.session,
      missionAsk: { ...dictionary.session.missionAsk, location: copy.ask },
      missionPlaceholders: {
        ...dictionary.session.missionPlaceholders,
        location: copy.placeholder,
      },
    },
  }
}

/**
 * C3 bleibt absichtlich außerhalb der Wörterbuchform: Es sind zwei kleine
 * Ergänzungstexte, während `memory.types` selbst ein verschachteltes Objekt
 * ist. So bleibt die strenge Quellform unangetastet und der Fallback identisch
 * mit dem übrigen UI-Verhalten.
 */
export function memoryForecastCopyFor(language: string): MemoryForecastCopy {
  const copy =
    MEMORY_FORECAST_COPY[language as Language] ??
    MEMORY_FORECAST_COPY[FALLBACK_LANGUAGE] ??
    MEMORY_FORECAST_COPY.de
  return copy ?? { label: 'Forgetting forecast', value: 'FSRS: about {days} days.' }
}

export function dictionaryFor(language: Language): Dictionary {
  const resolved = DICTIONARIES[language] ?? DICTIONARIES[FALLBACK_LANGUAGE] ?? de
  const copyLanguage = DICTIONARIES[language] === undefined ? FALLBACK_LANGUAGE : language
  return withMissionLocation(resolved, copyLanguage)
}

/** Gibt es für diese Sprache schon Texte, oder behelfen wir uns mit Englisch? */
export function isTranslated(language: Language): boolean {
  return DICTIONARIES[language] !== undefined
}
