/**
 * Mehrsprachigkeit ab der ersten Zeile (Backlog L1).
 *
 * Nachträglich eingezogen kostet i18n das Zehnfache, weil dann jeder Text
 * einzeln aus dem Code gesucht werden muss. Deshalb steht sie schon in M0 —
 * obwohl es bisher nur zwei Sprachen und kaum Texte gibt.
 */

import { FALLBACK_LANGUAGE, type Language } from '../core/index.ts'

import { de } from './de.ts'
import { en } from './en.ts'

type Widen<T> = T extends string ? string : { [K in keyof T]: Widen<T[K]> }

type SourceDictionary = Widen<typeof de>

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

interface PushTruthCopy {
  readonly reminderNote: string
  readonly whileOpen: string
  readonly scheduled: string
  readonly privacyLead: string
  readonly privacyPush: string
  readonly privacyDelete: string
  readonly privacyHonest: string
}

/*
 * Nur Aussagen, die sich durch Web Push tatsächlich geändert haben, stehen
 * hier. Die übrigen drei Datenschutzpunkte kommen aus dem normalen Wörterbuch;
 * sie ein zweites Mal zu kopieren blähte den Kaltstart ohne Informationsgewinn auf.
 */
const PUSH_TRUTH: Readonly<Partial<Record<Language, PushTruthCopy>>> = {
  de: {
    reminderNote:
      'Kein ANITEW-Konto. Push speichert nur Geräteadresse, Uhrzeit und Zeitzone — keine Trainingsdaten.',
    whileOpen:
      'Hier nur **solange es offen ist**. Auf iPhone/iPad braucht Push nach dem Schließen die installierte Home-Screen-App.',
    scheduled: 'Erinnerungen kommen als Systemmitteilung an, auch wenn ANITEW geschlossen ist.',
    privacyLead: 'ANITEW bleibt local-first.',
    privacyPush:
      'Für Push speichert ANITEW nur Geräteadresse, Fälligkeit und Zeitzone — keine Trainings- oder Gedächtnisinhalte.',
    privacyDelete:
      '„Keine Erinnerung“ stoppt täglich; „Neu anfangen“ widerruft die Push-Adresse.',
    privacyHonest:
      'Beim Laden sieht der Hoster übliche Webserverdaten; aktivierter Push braucht zusätzlich Netz. Training bleibt offlinefähig.',
  },
  en: {
    reminderNote:
      'No ANITEW account. Push stores only device address, time and time zone — no training data.',
    whileOpen:
      'Here only **while it is open**. On iPhone/iPad, push after closing needs the installed Home Screen app.',
    scheduled: 'Reminders arrive as system notifications even when ANITEW is closed.',
    privacyLead: 'ANITEW stays local-first.',
    privacyPush:
      'Push stores only device address, due time and time zone — no training or memory content.',
    privacyDelete:
      '“No reminder” stops the daily reminder; “Start over” revokes the push address.',
    privacyHonest:
      'The host sees ordinary web-server data while loading; enabled push also needs network. Training stays offline-capable.',
  },
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

function withPushTruth(dictionary: Dictionary, language: Language): Dictionary {
  const copy = PUSH_TRUTH[language] ?? PUSH_TRUTH[FALLBACK_LANGUAGE] ?? PUSH_TRUTH.de
  if (copy === undefined) return dictionary
  const points = dictionary.privacy.points
  return {
    ...dictionary,
    reminder: {
      ...dictionary.reminder,
      note: copy.reminderNote,
      whileOpen: copy.whileOpen,
      scheduled: copy.scheduled,
    },
    privacy: {
      ...dictionary.privacy,
      lead: copy.privacyLead,
      points: [points[0], points[1], points[2], copy.privacyPush, copy.privacyDelete],
      honest: copy.privacyHonest,
    },
  }
}

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
  return withPushTruth(withMissionLocation(resolved, copyLanguage), copyLanguage)
}

export function isTranslated(language: Language): boolean {
  return DICTIONARIES[language] !== undefined
}
