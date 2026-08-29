import { useState } from 'react'

import {
  type OnboardingProfile,
  TRAINING_MODES,
  type TrainingMode,
} from '../../core/index.ts'
import type { Dictionary } from '../../i18n/index.ts'

type Step = 'welcome' | 'memory' | 'time'

interface OnboardingScreenProps {
  dictionary: Dictionary
  onDone: (profile: OnboardingProfile, firstMemory?: string) => void
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
  const texts = dictionary.onboarding

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
