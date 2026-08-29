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
  onDone: (profile: OnboardingProfile, firstMemory?: string) => void
}

function initialInterfaceLanguage(): Language {
  const language = document.documentElement.lang.toLowerCase()
  return language.startsWith('en') ? 'en' : 'de'
}

/**
 * Das Ankommen (Onboarding).
 *
 * Der reale Produktpfad besteht absichtlich nur aus drei Bildschirmen:
 * Willkommen, erste Erinnerung, Zeitbudget. Die übrigen Profilfelder werden
 * später unter „Über dich“ gepflegt und gehören deshalb nicht als tote,
 * unerreichbare Screens in den Kaltstart.
 */
export function OnboardingScreen({ dictionary, onDone }: OnboardingScreenProps) {
  const [step, setStep] = useState<Step>('welcome')
  const [draft, setDraft] = useState<OnboardingProfile>({})
  const [firstMemory, setFirstMemory] = useState('')
  const [interfaceLanguage, setInterfaceLanguage] = useState<Language>(initialInterfaceLanguage)
  const [languageBusy, setLanguageBusy] = useState(false)
  const [languageSaveFailed, setLanguageSaveFailed] = useState(false)
  const languagePlatform = useMemo(() => createWebPlatform(), [])
  const texts = dictionary.onboarding

  const changeInterfaceLanguage = async (next: Language) => {
    if (languageBusy || next === interfaceLanguage) return
    setLanguageBusy(true)
    setLanguageSaveFailed(false)
    const saved = await persistInterfaceLanguageChoice(languagePlatform, next)
    if (saved) {
      setInterfaceLanguage(next)
    } else {
      setLanguageSaveFailed(true)
    }
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
                    tag === interfaceLanguage
                      ? 'arrival-language-choice arrival-language-choice-active'
                      : 'arrival-language-choice'
                  }
                  aria-label={dictionary.language.names[tag]}
                  aria-pressed={tag === interfaceLanguage}
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
        <section className="arrival" aria-label={texts.welcomeTitle}>
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
