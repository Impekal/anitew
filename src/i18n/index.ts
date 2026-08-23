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
  readonly privacyPoints: readonly string[]
  readonly privacyHonest: string
}

const PUSH_TRUTH: Readonly<Partial<Record<Language, PushTruthCopy>>> = {
  de: {
    reminderNote:
      'Ohne ANITEW-Konto. Für Systembenachrichtigungen speichert ANITEW nur die technische Push-Adresse dieses Geräts sowie Uhrzeit und Zeitzone — keine Trainings- oder Erinnerungsinhalte.',
    whileOpen:
      'Auf diesem Gerät kann ANITEW nur erinnern, **solange es offen ist**. Systemmitteilungen nach dem Schließen brauchen Web Push; auf iPhone und iPad funktioniert das nur aus der installierten Home-Screen-App.',
    scheduled: 'Erinnerungen kommen als Systemmitteilung an, auch wenn ANITEW geschlossen ist.',
    privacyLead: 'ANITEW bleibt local-first.',
    privacyPoints: [
      'Kein ANITEW-Konto, keine Werbung, keine Tracker.',
      'Training, Erinnerungen, Messungen und Profil bleiben auf diesem Gerät — außer du wählst selbst Drive-Abgleich oder eine Coach-Frage mit eigenem Schlüssel.',
      'Für aktivierte Systembenachrichtigungen speichert ANITEW nur die technische Push-Adresse dieses Geräts, Fälligkeit und Zeitzone. Keine Trainings- oder Gedächtnisinhalte werden dafür übertragen.',
      'Die Push-Adresse wird beim vollständigen Zurücksetzen widerrufen. „Keine Erinnerung“ beendet die tägliche Erinnerung.',
      'Sicherung und Drive-Abgleich bleiben davon getrennt; die Sicherungsdatei liegt bei dir bzw. in deinem eigenen Google Drive.',
    ],
    privacyHonest:
      'Zum Laden der App sieht der Hoster die üblichen Webserverdaten. Nur wenn du Systembenachrichtigungen aktivierst, braucht der Push-Dienst zusätzlich Netz; das Training selbst bleibt offlinefähig.',
  },
  en: {
    reminderNote:
      'No ANITEW account. For system notifications ANITEW stores only this device’s technical push address plus time and time zone — no training or memory content.',
    whileOpen:
      'On this device ANITEW can only remind you **while it is open**. Notifications after closing need Web Push; on iPhone and iPad that works only from the installed Home Screen app.',
    scheduled: 'Reminders arrive as system notifications even when ANITEW is closed.',
    privacyLead: 'ANITEW stays local-first.',
    privacyPoints: [
      'No ANITEW account, no ads, no trackers.',
      'Training, memories, measurements and profile stay on this device unless you explicitly choose Drive sync or a coach question with your own key.',
      'For enabled system notifications ANITEW stores only this device’s technical push address, due time and time zone. No training or memory content is sent for push.',
      'A full reset revokes the push address. “No reminder” stops the daily reminder.',
      'Backup and Drive sync remain separate; the backup file stays with you or in your own Google Drive.',
    ],
    privacyHonest:
      'The host sees ordinary web-server data while the app is loaded. Only enabled system notifications need the push service afterwards; training itself remains offline-capable.',
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
      points: [...copy.privacyPoints],
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
