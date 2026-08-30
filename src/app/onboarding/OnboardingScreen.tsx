import { useMemo, useState } from 'react'

import {
  type Language,
  type OnboardingProfile,
  TRAINING_MODES,
  type TrainingMode,
} from '../../core/index.ts'
import type { Dictionary } from '../../i18n/index.ts'
import { createWebPlatform } from '../../platform/web/index.ts'
import { persistInterfaceLanguageChoice } from '../useLanguage.ts'

type Step = 'welcome' | 'memory' | 'time'

const FIRST_RUN_LANGUAGES = ['de', 'en'] as const satisfies readonly Language[]

interface OnboardingScreenProps {
  dictionary: Dictionary
  /** Die aufgelöste App-Sprache aus useLanguage — dieselbe Quelle wie überall. */
  language: Language
  onDone: (profile: OnboardingProfile, firstMemory?: string) => void
}

/**
 * Welche der beiden übersetzten Fassungen tatsächlich auf dem Bildschirm
 * steht. Für unübersetzte Sprachen fällt `dictionaryFor` auf Englisch zurück
 * (FALLBACK_LANGUAGE) — dann ist Englisch die ehrliche aktive Wahl.
 *
 * Vorher wurde hier aus `document.documentElement.lang` geraten, mit Deutsch
 * als Auffangwert. Gemessen am 30.08. mit Systemsprache Türkisch: Die Seite
 * sprach Englisch (Fallback), markiert war „DE“ — samt `aria-pressed="true"`
 * auf einer Sprache, die gar nicht zu sehen war.
 */
function shownFirstRunLanguage(language: Language): (typeof FIRST_RUN_LANGUAGES)[number] {
  return language === 'de' ? 'de' : 'en'
}

/**
 * Das Ankommen (Onboarding).
 *
 * Der reale Produktpfad besteht absichtlich nur aus drei Bildschirmen:
 * Willkommen, erste Erinnerung, Zeitbudget. Die übrigen Profilfelder werden
 * später unter „Über dich“ gepflegt und gehören deshalb nicht als tote,
 * unerreichbare Screens in den Kaltstart.
 */
export function OnboardingScreen({ dictionary, language, onDone }: OnboardingScreenProps) {
  const [step, setStep] = useState<Step>('welcome')
  const [draft, setDraft] = useState<OnboardingProfile>({})
  const [firstMemory, setFirstMemory] = useState('')
  const [languageBusy, setLanguageBusy] = useState(false)
  const [languageSaveFailed, setLanguageSaveFailed] = useState(false)
  const languagePlatform = useMemo(() => createWebPlatform(), [])
  const texts = dictionary.onboarding
  const shownLanguage = shownFirstRunLanguage(language)

  const changeInterfaceLanguage = async (next: Language) => {
    // Verglichen wird mit der App-Sprache, nicht mit der gezeigten Fassung:
    // Wer mit Systemsprache Türkisch (englischer Fallback) auf „EN“ tippt,
    // trifft damit eine echte Wahl, die gespeichert gehört.
    if (languageBusy || next === language) return
    setLanguageBusy(true)
    setLanguageSaveFailed(false)
    // Die sichtbare Umschaltung kommt über das Ereignis aus useLanguage
    // zurück (dictionary/language als Props) — hier gibt es keinen zweiten
    // Sprachzustand mehr, der davon abweichen könnte.
    const saved = await persistInterfaceLanguageChoice(languagePlatform, next)
    if (!saved) setLanguageSaveFailed(true)
    setLanguageBusy(false)
  }

  const finishOrAdvance = (
    current: Exclude<Step, 'welcome'>,
    next: OnboardingProfile,
    memory = firstMemory,
  ) => {
    setDraft(next)
    if (current === 'memory') {
      setStep('time')
      return
    }
    onDone(next, memory.trim() || undefined)
  }

  return (
    <main className="app onboarding">
      <header className="brand">
        {step === 'welcome' && (
          <>
            <div className="arrival-language" role="group" aria-label={dictionary.language.label}>
              {FIRST_RUN_LANGUAGES.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={
                    tag === shownLanguage
                      ? 'arrival-language-choice arrival-language-choice-active'
                      : 'arrival-language-choice'
                  }
                  aria-label={dictionary.language.names[tag]}
                  aria-pressed={tag === shownLanguage}
                  disabled={languageBusy}
                  onClick={() => void changeInterfaceLanguage(tag)}
                >
                  {tag.toUpperCase()}
                </button>
              ))}
            </div>
            {languageSaveFailed && (
              <p className="arrival-language-error" role="alert">
                {dictionary.settings.saveFailed}
              </p>
            )}
          </>
        )}
        <h1>{dictionary.app.name}</h1>
        <p className="greeting">{texts.welcomeTitle}</p>
      </header>

      {step === 'welcome' && (
        /*
         * `key={shownLanguage}` ist die eigentliche Übersetzung dieses
         * Bildschirms — nicht nur eine React-Feinheit.
         *
         * Der Welcome-Screen wird nach dem Mount von zwei verzögerten
         * Schichten imperativ ausgebaut (firstRunExperience und
         * experienceRefinement). Beide markieren das `.arrival`-Element als
         * erledigt und fassen es danach nie wieder an. Ohne Remount blieb
         * beim Sprachwechsel deshalb alles Eingebaute in der alten Sprache
         * stehen — gemessen am 30.08.: Nach DE→EN sprachen Überschrift und
         * Knöpfe Englisch, aber Philosophie, alle sechs Karten, Trust-Zeile,
         * Fragen-Absatz, Drive-Karte und Scroll-Cue weiter Deutsch.
         *
         * Ein neues Element trägt keine Erledigt-Marken: Beide Schichten
         * bauen es über ihre MutationObserver sofort (vor dem nächsten
         * Paint) in der neuen Sprache wieder aus. Der Core heilt sich beim
         * Sprachwechsel auf genau demselben Weg — er wird beim Schließen
         * entsorgt und beim Öffnen frisch verfeinert.
         */
        <section className="arrival" key={shownLanguage} aria-label={texts.welcomeTitle}>
          <p className="arrival-note">{texts.welcomeNote}</p>
          <div className="arrival-actions">
            <button type="button" className="start arrival-begin" onClick={() => setStep('memory')}>
              <span className="start-label">{texts.begin}</span>
            </button>
            {/* Ein leeres Profil ist eine bewusste Antwort und verhindert,
                dass das Onboarding beim nächsten Start wiederkommt. */}
            <button type="button" className="quiet" onClick={() => onDone({})}>
              {texts.skipAll}
            </button>
          </div>
        </section>
      )}

      {step === 'memory' && (
        <section className="arrival arrival-memory" aria-label={texts.memoryQuestion}>
          <p className="arrival-system">{texts.promise}</p>
          <h2>{texts.memoryQuestion}</h2>
          <textarea
            className="remember-input"
            rows={3}
            value={firstMemory}
            placeholder={texts.memoryPlaceholder}
            aria-label={texts.memoryQuestion}
            onChange={(event) => setFirstMemory(event.target.value)}
          />
          <p className="hint">{texts.memoryNote}</p>
          <div className="arrival-actions">
            <button
              type="button"
              className="quiet arrival-next"
              onClick={() => finishOrAdvance('memory', draft)}
              disabled={firstMemory.trim() === ''}
            >
              {texts.keepMemory}
            </button>
            <button
              type="button"
              className="quiet"
              onClick={() => finishOrAdvance('memory', draft, '')}
            >
              {texts.skip}
            </button>
          </div>
        </section>
      )}

      {step === 'time' && (
        <section className="arrival" aria-label={texts.timeQuestion}>
          <h2>{texts.timeQuestion}</h2>
          <div className="choices">
            {TRAINING_MODES.map((mode: TrainingMode) => (
              <button
                key={mode}
                type="button"
                className="choice"
                onClick={() => finishOrAdvance('time', { ...draft, mode })}
              >
                {dictionary.start.modes[mode]}
              </button>
            ))}
          </div>
          <p className="hint">{texts.timeNote}</p>
          <div className="arrival-actions">
            <button type="button" className="quiet" onClick={() => finishOrAdvance('time', draft)}>
              {texts.skip}
            </button>
          </div>
        </section>
      )}
    </main>
  )
}
