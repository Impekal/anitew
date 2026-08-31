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

/*
 * Übersetzte Oberflächensprachen — die statische Wahrheit für die Auswahl.
 *
 * Getrennt vom Ladezustand, und zwar absichtlich: Ob eine Sprache angeboten
 * wird, entscheidet diese Liste; ob ihr Wörterbuch schon im Speicher ist,
 * entscheidet die Registry darunter. de/en liegen im Kaltstart (Englisch ist
 * die Rückfallsprache und muss synchron da sein); fr/es/it/pt kommen als
 * eigene, vorab gecachte Chunks — vier volle Wörterbücher im Kaltstart
 * hätten das Budget (P4) um ein Vielfaches der restlichen Luft gesprengt.
 */
export const TRANSLATED_LANGUAGES = ['de', 'en', 'fr', 'es', 'it', 'pt'] as const

const DICTIONARIES: Partial<Record<Language, Dictionary>> = {
  de,
  en,
}

/** Die Overlay-Texte eines nachgeladenen Sprachpakets (Wahrheitsschicht). */
export interface LanguageExtras {
  readonly missionLocation: { readonly ask: string; readonly placeholder: string }
  readonly missionNeutral: MissionNeutralCopy
  readonly pushTruth: PushTruthCopy
  readonly memoryForecast: MemoryForecastCopy
  readonly memoryCount: MemoryCountCopy
}

const pendingLoads: Partial<Record<Language, Promise<void>>> = {}

function registerLanguage(tag: Language, dictionary: Dictionary, extras: LanguageExtras): void {
  DICTIONARIES[tag] = dictionary
  MISSION_LOCATION_COPY[tag] = extras.missionLocation
  MISSION_NEUTRAL_COPY[tag] = extras.missionNeutral
  PUSH_TRUTH[tag] = extras.pushTruth
  MEMORY_FORECAST_COPY[tag] = extras.memoryForecast
  MEMORY_COUNT_COPY[tag] = extras.memoryCount
}

/**
 * Lädt das Wörterbuch einer übersetzten Sprache nach, falls es noch fehlt.
 *
 * Wer hier wartet, bevor er die Sprache sichtbar umschaltet, zeigt nie einen
 * halbübersetzten Zustand: `dictionaryFor` fällt bis dahin geschlossen auf
 * Englisch zurück. Ein fehlgeschlagenes Laden (kein Netz und noch kein
 * Cache-Eintrag) lässt den Fallback einfach stehen — beim nächsten Versuch
 * wird erneut geladen.
 */
export async function ensureDictionary(tag: Language): Promise<void> {
  if (DICTIONARIES[tag] !== undefined || !isTranslated(tag)) return
  const running = pendingLoads[tag]
  if (running !== undefined) return running
  const load = (async () => {
    try {
      if (tag === 'fr') {
        const m = await import('./fr.ts')
        registerLanguage('fr', m.fr, m.frExtras)
      } else if (tag === 'es') {
        const m = await import('./es.ts')
        registerLanguage('es', m.es, m.esExtras)
      } else if (tag === 'it') {
        const m = await import('./it.ts')
        registerLanguage('it', m.it, m.itExtras)
      } else if (tag === 'pt') {
        const m = await import('./pt.ts')
        registerLanguage('pt', m.pt, m.ptExtras)
      }
    } finally {
      delete pendingLoads[tag]
    }
  })()
  pendingLoads[tag] = load
  return load
}

/** Ist das Wörterbuch dieser Sprache gerade im Speicher? */
export function isDictionaryLoaded(tag: Language): boolean {
  return DICTIONARIES[tag] !== undefined
}

const MISSION_LOCATION_COPY: Partial<Record<Language, { ask: string; placeholder: string }>> = {
  de: { ask: 'Wo lag der Gegenstand?', placeholder: 'Position' },
  en: { ask: 'Where was the object?', placeholder: 'Position' },
}

/**
 * H4/H5: Hotel, Konferenz und Coworking teilen dieselben stabilen Fact-Kinds.
 * Die Oberfläche darf daraus deshalb keine Hotelbedeutung ableiten. „Zimmer“
 * und „Restaurant“ wären bei einer Konferenz oder im Coworking sachlich falsch.
 * Die sichtbaren Begriffe bleiben bewusst knapp und weltneutral; die konkrete
 * Welt steckt in Person, Gegenstand, Position und Ort der Szene.
 */
interface MissionNeutralCopy {
  readonly numberLabel: string
  readonly timeLabel: string
  readonly placeLabel: string
  readonly numberAsk: string
  readonly timeAsk: string
  readonly placeAsk: string
  readonly numberPlaceholder: string
  readonly placePlaceholder: string
}

const MISSION_NEUTRAL_COPY: Partial<Record<Language, MissionNeutralCopy>> = {
  de: {
    numberLabel: 'Nummer',
    timeLabel: 'Zeit',
    placeLabel: 'Ort',
    numberAsk: 'Welche Nummer?',
    timeAsk: 'Wann war es?',
    placeAsk: 'Wie hieß der Ort?',
    numberPlaceholder: 'Nummer',
    placePlaceholder: 'Name',
  },
  en: {
    numberLabel: 'Number',
    timeLabel: 'Time',
    placeLabel: 'Place',
    numberAsk: 'Which number?',
    timeAsk: 'When was it?',
    placeAsk: 'What was the place called?',
    numberPlaceholder: 'Number',
    placePlaceholder: 'Name',
  },
}

interface PushTruthCopy {
  readonly reminderNote: string
  readonly whileOpen: string
  readonly scheduled: string
  readonly privacyLead: string
  readonly privacyLocal: string
  readonly privacyPush: string
  readonly privacyDelete: string
  readonly privacyHonest: string
}

const PUSH_TRUTH: Partial<Record<Language, PushTruthCopy>> = {
  de: {
    reminderNote: 'Kein Konto. Push speichert Geräteadresse, Zeit, Zeitzone und den generischen Text — keine Trainingsdaten.',
    whileOpen: 'Hier nur **solange es offen ist**. iPhone/iPad: nach dem Schließen nur als Home-Screen-App.',
    scheduled: 'Kommt als Systemmitteilung an, auch wenn ANITEW geschlossen ist.',
    privacyLead: 'ANITEW bleibt local-first.',
    privacyLocal: 'Training, Erinnerungen, Messungen und Profil bleiben auf diesem Gerät.',
    privacyPush:
      'Für Push speichert ANITEW nur die technische Push-Adresse dieses Geräts, Fälligkeit, Zeitzone und den generischen Benachrichtigungstext. Keine Trainings- oder Gedächtnisinhalte.',
    privacyDelete: '„Keine Erinnerung“ stoppt täglich; „Neu anfangen“ widerruft Push.',
    privacyHonest:
      'Beim Laden sieht der Hoster die üblichen Webserverdaten. Wenn du Systembenachrichtigungen aktivierst, braucht Push zusätzlich Netz; das Training selbst bleibt offlinefähig.',
  },
  en: {
    reminderNote: 'No account. Push stores device address, time, time zone and the generic text — no training data.',
    whileOpen: 'Here only **while it is open**. iPhone/iPad: after closing, only as a Home Screen app.',
    scheduled: 'Arrives as a system notification even when ANITEW is closed.',
    privacyLead: 'ANITEW stays local-first.',
    privacyLocal: 'Training, memories, measurements and profile stay on this device.',
    privacyPush:
      'For push, ANITEW stores only this device’s technical push address, due time, time zone and the generic notification text. No training or memory content.',
    privacyDelete: '“No reminder” stops daily; “Start over” revokes push.',
    privacyHonest:
      'While loading, the host sees ordinary web-server data. If you enable system notifications, push also needs network; training itself stays offline-capable.',
  },
}

export interface MemoryForecastCopy {
  readonly label: string
  readonly value: string
}

const MEMORY_FORECAST_COPY: Partial<Record<Language, MemoryForecastCopy>> = {
  de: {
    label: 'Vergessensprognose',
    value: 'FSRS schätzt etwa {days} Tage bis zur 90%-Schwelle — aus mindestens drei echten Wiedersehen.',
  },
  en: {
    label: 'Forgetting forecast',
    value: 'FSRS estimates about {days} days to the 90% threshold — based on at least three real returns.',
  },
}

export interface MemoryCountCopy {
  readonly memoryOne: string
  readonly memoryMany: string
  readonly connectionOne: string
  readonly connectionMany: string
}

const MEMORY_COUNT_COPY: Partial<Record<Language, MemoryCountCopy>> = {
  de: {
    memoryOne: 'Erinnerung',
    memoryMany: 'Erinnerungen',
    connectionOne: 'Verbindung',
    connectionMany: 'Verbindungen',
  },
  en: {
    memoryOne: 'memory',
    memoryMany: 'memories',
    connectionOne: 'connection',
    connectionMany: 'connections',
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

function withMissionNeutralCopy(dictionary: Dictionary, language: Language): Dictionary {
  const copy =
    MISSION_NEUTRAL_COPY[language] ??
    MISSION_NEUTRAL_COPY[FALLBACK_LANGUAGE] ??
    MISSION_NEUTRAL_COPY.de
  if (copy === undefined) return dictionary

  return {
    ...dictionary,
    mission: {
      ...dictionary.mission,
      room: copy.numberLabel,
      departure: copy.timeLabel,
      restaurant: copy.placeLabel,
    },
    session: {
      ...dictionary.session,
      missionAsk: {
        ...dictionary.session.missionAsk,
        room: copy.numberAsk,
        time: copy.timeAsk,
        place: copy.placeAsk,
      },
      missionPlaceholders: {
        ...dictionary.session.missionPlaceholders,
        room: copy.numberPlaceholder,
        place: copy.placePlaceholder,
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
      points: [copy.privacyLocal, points[1], points[2], copy.privacyPush, copy.privacyDelete],
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

export function memoryCountCopyFor(language: string): MemoryCountCopy {
  const copy =
    MEMORY_COUNT_COPY[language as Language] ??
    MEMORY_COUNT_COPY[FALLBACK_LANGUAGE] ??
    MEMORY_COUNT_COPY.de
  return (
    copy ?? {
      memoryOne: 'memory',
      memoryMany: 'memories',
      connectionOne: 'connection',
      connectionMany: 'connections',
    }
  )
}

export function dictionaryFor(language: Language): Dictionary {
  const resolved = DICTIONARIES[language] ?? DICTIONARIES[FALLBACK_LANGUAGE] ?? de
  const copyLanguage = DICTIONARIES[language] === undefined ? FALLBACK_LANGUAGE : language
  return withMissionNeutralCopy(
    withPushTruth(withMissionLocation(resolved, copyLanguage), copyLanguage),
    copyLanguage,
  )
}

export function isTranslated(language: Language): boolean {
  return (TRANSLATED_LANGUAGES as readonly string[]).includes(language)
}
