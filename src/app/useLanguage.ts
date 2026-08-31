import { useCallback, useEffect, useState } from 'react'

import { persistThenApply } from './persistThenApply.ts'

import {
  type Language,
  type Platform,
  isRightToLeft,
  resolveLanguage,
} from '../core/index.ts'
import { type Dictionary, dictionaryFor, ensureDictionary, isTranslated } from '../i18n/index.ts'

const SETTING_KEY = 'language'
const LANGUAGE_CHANGE_EVENT = 'anitew:interface-language-change'

function announceLanguageChange(language: Language): void {
  window.dispatchEvent(
    new CustomEvent<Language>(LANGUAGE_CHANGE_EVENT, {
      detail: language,
    }),
  )
}

/**
 * Persistiert eine Sprachwahl außerhalb des regulären Einstellungs-Panels.
 *
 * Der First-Run braucht denselben Wahrheitsvertrag wie die Einstellungen:
 * erst speichern, dann sichtbar umschalten. Das Ereignis hält den bereits
 * gemounteten App-Hook synchron, ohne eine zweite Sprachquelle einzuführen.
 */
export async function persistInterfaceLanguageChoice(
  platform: Platform,
  next: Language,
): Promise<boolean> {
  try {
    await platform.settings.write(SETTING_KEY, next)
    // Erst das Wörterbuch, dann das Ereignis: Wer das Ereignis vor dem
    // Laden feuerte, zeigte für einen Moment fremde Texte unter richtig
    // markierter Sprache — genau die Halbwahrheit, die F-2 beseitigt hat.
    await ensureDictionary(next)
    announceLanguageChange(next)
    return true
  } catch {
    return false
  }
}

export interface LanguageState {
  language: Language
  dictionary: Dictionary
  translated: boolean
  ready: boolean
  choose: (language: Language) => void
  /** Ließ sich die zuletzt gewählte Sprache nicht speichern? (R3-06) */
  saveFailed: boolean
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
  const [saveFailed, setSaveFailed] = useState(false)

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
      const resolved = resolveLanguage(chosen, systemLanguages())
      /*
       * Nachladbare Sprache (fr/es/it/pt): erst das Wörterbuch, dann die
       * Freigabe. `ready` hält die Anzeige ohnehin zurück, bis die
       * gespeicherte Wahl gelesen ist — dieselbe Wartezeit deckt jetzt auch
       * den kleinen Sprachchunk ab (vorab gecacht, offline eingeschlossen).
       * Schlägt das Laden fehl, zeigt dictionaryFor geschlossen Englisch.
       */
      await ensureDictionary(resolved).catch(() => undefined)
      if (cancelled) return
      setLanguage(resolved)
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

  /*
   * Der First-Run sitzt innerhalb derselben App, bekommt `dictionary` aber als
   * Prop. Wenn dort die Sprache gespeichert wurde, teilt dieses Ereignis dem
   * bereits laufenden Hook die neue Wahrheit mit; dadurch übersetzt sich der
   * Welcome-Screen sofort, ohne Neuladen und ohne zweiten Sprachzustand.
   *
   * „Sofort übersetzt“ galt dabei nur für die React-eigenen Texte: Die
   * imperativ eingebauten Teile hängen am Remount des `.arrival`-Elements
   * (key in OnboardingScreen.tsx, gemessen 30.08.) — erst beides zusammen
   * macht den Satz oben wahr.
   */
  useEffect(() => {
    const onLanguageChange = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail
      if (typeof detail !== 'string') return
      const next = resolveLanguage(detail, [detail])
      if (next !== detail) return
      void ensureDictionary(next)
        .catch(() => undefined)
        .then(() => {
          setSaveFailed(false)
          setLanguage(next)
        })
    }
    window.addEventListener(LANGUAGE_CHANGE_EVENT, onLanguageChange)
    return () => window.removeEventListener(LANGUAGE_CHANGE_EVENT, onLanguageChange)
  }, [])

  /*
   * R3-06: Dieselbe Regel wie bei Ton und Trainingssprache — die Oberfläche
   * wechselt erst, wenn die Wahl wirklich gespeichert ist. Vorher wechselte
   * sie optimistisch und verschluckte den Fehler; nach einem Neuladen stand
   * dann wieder die alte Sprache da, ohne dass es jemand gesagt hätte.
   */
  const choose = useCallback(
    (next: Language) => {
      void persistThenApply(
        async () => {
          await platform.settings.write(SETTING_KEY, next)
          // Gehört zum Wahrheitsvertrag: sichtbar wird erst der vollständig
          // geladene Zustand, nie ein englischer Zwischenstand unter
          // fremdem Etikett.
          await ensureDictionary(next)
        },
        () => {
          setSaveFailed(false)
          setLanguage(next)
          announceLanguageChange(next)
        },
        () => setSaveFailed(true),
      )
    },
    [platform],
  )

  return {
    language,
    dictionary: withSpatialModuleLabel(dictionaryFor(language)),
    translated: isTranslated(language),
    ready,
    choose,
    saveFailed,
  }
}

function systemLanguages(): readonly string[] {
  return navigator.languages ?? [navigator.language]
}
