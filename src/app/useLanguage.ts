import { useCallback, useEffect, useState } from 'react'

import {
  type Language,
  type Platform,
  isRightToLeft,
  resolveLanguage,
} from '../core/index.ts'
import { type Dictionary, dictionaryFor, isTranslated } from '../i18n/index.ts'

const SETTING_KEY = 'language'

export interface LanguageState {
  language: Language
  dictionary: Dictionary
  translated: boolean
  ready: boolean
  choose: (language: Language) => void
}

/**
 * D12 hat `spatial` als echtes Trainingsmodul ergänzt. Die bestehende
 * Wörterbuch-Schnittstelle führt den sichtbaren Namen bereits als Profilachse,
 * aber die ältere Modulliste kennt den neuen Schlüssel typseitig noch nicht.
 * An dieser einen UI-Grenze spiegeln wir deshalb denselben übersetzten Namen
 * in die Modulliste, damit Schwerpunkt und Coach niemals ein leeres Label
 * anzeigen. Keine zweite Übersetzung, nur dieselbe vorhandene Zeichenkette.
 */
function withSpatialModuleLabel(dictionary: Dictionary): Dictionary {
  const modules = dictionary.profile.modules as Record<string, string>
  if (modules.spatial === dictionary.profile.names.spatial) return dictionary
  return {
    ...dictionary,
    profile: {
      ...dictionary.profile,
      modules: {
        ...dictionary.profile.modules,
        spatial: dictionary.profile.names.spatial,
      } as typeof dictionary.profile.modules,
    },
  }
}

/**
 * Die Sprache der Oberfläche (D-007).
 *
 * Beim ersten Start gilt die Systemsprache, danach die eigene Wahl. Die
 * Entscheidung selbst trifft `resolveLanguage()` im Kern und lässt sich dort
 * ohne Browser prüfen; hier wird nur beschafft und gespeichert.
 *
 * Bis die gespeicherte Wahl aus der Datenbank zurück ist, steht `ready` auf
 * `false`. Das ist der Grund, warum die App in diesem Moment nichts anzeigt:
 * Erst Deutsch zu zeigen und eine Zehntelsekunde später auf Türkisch
 * umzuspringen sieht nach einem Fehler aus.
 */
export function useLanguage(platform: Platform): LanguageState {
  const [language, setLanguage] = useState<Language>(() =>
    resolveLanguage(undefined, systemLanguages()),
  )
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      let chosen: string | undefined
      try {
        chosen = await platform.settings.read<string>(SETTING_KEY)
      } catch {
        // Kein Speicher, kein Drama — dann eben die Systemsprache.
        chosen = undefined
      }
      if (cancelled) return
      setLanguage(resolveLanguage(chosen, systemLanguages()))
      setReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [platform])

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = isRightToLeft(language) ? 'rtl' : 'ltr'
  }, [language])

  const choose = useCallback(
    (next: Language) => {
      setLanguage(next)
      void platform.settings.write(SETTING_KEY, next).catch(() => {
        // Die Wahl gilt für diese Sitzung auch dann, wenn sie sich nicht
        // speichern lässt. Ein Fehlerdialog hilft hier niemandem.
      })
    },
    [platform],
  )

  return {
    language,
    dictionary: withSpatialModuleLabel(dictionaryFor(language)),
    translated: isTranslated(language),
    ready,
    choose,
  }
}

function systemLanguages(): readonly string[] {
  return navigator.languages ?? [navigator.language]
}
