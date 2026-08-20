import { useState } from 'react'

import {
  AGE_BANDS,
  type AgeBand,
  DAY_PARTS,
  type DayPart,
  GOALS,
  type Goal,
  type OnboardingProfile,
  TRAINING_MODES,
  type TrainingMode,
  sanitizeName,
} from '../../core/index.ts'
import type { Dictionary } from '../../i18n/index.ts'

/**
 * Die Schritte des Ankommens — drei Bildschirme im Hauptpfad (D-011/G-2).
 * `welcome` ist keine Frage, sondern die Erklärung samt Ausgang: Wer nichts
 * beantworten will, ist mit einem Tipp draußen und wird nie wieder gefragt.
 * Alte Profilfelder bleiben für gespeicherte Profile und „Über dich“ erhalten.
 */
const STEPS = ['welcome', 'memory', 'time', 'name', 'goal', 'day', 'age'] as const

type Step = (typeof STEPS)[number]

interface OnboardingScreenProps {
  dictionary: Dictionary
  onDone: (profile: OnboardingProfile, firstMemory?: string) => void
}

/**
 * Das Ankommen (Onboarding).
 *
 * Jede Antwort tut genau das, was ihr Begleitsatz sagt — und der steht
 * daneben, nicht in einer Fußnote. Antworten rückt einen Schritt weiter;
 * Überspringen auch. Es gibt keinen Zwang und keinen Fortschrittsbalken:
 * Produktidee, erste Erinnerung, Zeit — dann ist man drin.
 */
export function OnboardingScreen({ dictionary, onDone }: OnboardingScreenProps) {
  const [step, setStep] = useState<Step>('welcome')
  const [draft, setDraft] = useState<OnboardingProfile>({})
  const [name, setName] = useState('')
  const [firstMemory, setFirstMemory] = useState('')
  const texts = dictionary.onboarding

  const stepAfter = (current: Step): Step | undefined => {
    if (current === 'welcome') return 'memory'
    if (current === 'memory') return 'time'
    if (current === 'time') return undefined
    return STEPS[STEPS.indexOf(current) + 1]
  }

  /** Einen Schritt weiter — und nach dem letzten hinaus. */
  const advance = (current: Step, next: OnboardingProfile, memory = firstMemory) => {
    setDraft(next)
    const following = stepAfter(current)
    if (following === undefined) onDone(next, memory.trim() || undefined)
    else setStep(following)
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
            {/*
              Der Ausgang ist ein echter Knopf und kein grauer Kleintext-Link
              (D-015): Wer nichts sagen will, wird dafür nicht mit Suchen
              bestraft. Ein leeres Profil wird gespeichert, damit die Frage
              nie wiederkommt.
            */}
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
            <button type="button" className="quiet arrival-next" onClick={() => advance('memory', draft)} disabled={firstMemory.trim() === ''}>{texts.keepMemory}</button>
            <button type="button" className="quiet" onClick={() => advance('memory', draft, '')}>{texts.skip}</button>
          </div>
        </section>
      )}

      {step === 'name' && (
        <section className="arrival" aria-label={texts.nameQuestion}>
          <h2>{texts.nameQuestion}</h2>
          <input
            className="arrival-name"
            type="text"
            value={name}
            placeholder={texts.namePlaceholder}
            autoComplete="off"
            // Kein `autoFocus`: Auf dem Telefon spränge sonst sofort die
            // Tastatur hoch, bevor die Frage gelesen ist.
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') advance('name', { ...draft, name: sanitizeName(name) })
            }}
          />
          <p className="hint">{texts.nameNote}</p>
          <div className="arrival-actions">
            <button
              type="button"
              className="quiet arrival-next"
              onClick={() => advance('name', { ...draft, name: sanitizeName(name) })}
            >
              {texts.next}
            </button>
            <button type="button" className="quiet" onClick={() => advance('name', draft)}>
              {texts.skip}
            </button>
          </div>
        </section>
      )}

      {step === 'goal' && (
        <section className="arrival" aria-label={texts.goalQuestion}>
          <h2>{texts.goalQuestion}</h2>
          <div className="choices">
            {GOALS.map((goal: Goal) => (
              <button
                key={goal}
                type="button"
                className="choice"
                onClick={() => advance('goal', { ...draft, goal })}
              >
                {texts.goals[goal]}
              </button>
            ))}
          </div>
          <p className="hint">{texts.goalNote}</p>
          <div className="arrival-actions">
            <button type="button" className="quiet" onClick={() => advance('goal', draft)}>
              {texts.skip}
            </button>
          </div>
        </section>
      )}

      {step === 'time' && (
        <section className="arrival" aria-label={texts.timeQuestion}>
          <h2>{texts.timeQuestion}</h2>
          <div className="choices">
            {/* Dieselben vier Modi wie auf dem Startbildschirm — die Frage
                erfindet keine eigene Zeitrechnung. */}
            {TRAINING_MODES.map((mode: TrainingMode) => (
              <button
                key={mode}
                type="button"
                className="choice"
                onClick={() => advance('time', { ...draft, mode })}
              >
                {dictionary.start.modes[mode]}
              </button>
            ))}
          </div>
          <p className="hint">{texts.timeNote}</p>
          <div className="arrival-actions">
            <button type="button" className="quiet" onClick={() => advance('time', draft)}>
              {texts.skip}
            </button>
          </div>
        </section>
      )}

      {step === 'day' && (
        <section className="arrival" aria-label={texts.dayQuestion}>
          <h2>{texts.dayQuestion}</h2>
          <div className="choices">
            {DAY_PARTS.map((dayPart: DayPart) => (
              <button
                key={dayPart}
                type="button"
                className="choice"
                onClick={() => advance('day', { ...draft, dayPart })}
              >
                {texts.dayParts[dayPart]}
              </button>
            ))}
          </div>
          <p className="hint">{texts.dayNote}</p>
          <div className="arrival-actions">
            <button type="button" className="quiet" onClick={() => advance('day', draft)}>
              {texts.skip}
            </button>
          </div>
        </section>
      )}

      {step === 'age' && (
        <section className="arrival" aria-label={texts.ageQuestion}>
          <h2>{texts.ageQuestion}</h2>
          <div className="choices">
            {AGE_BANDS.map((ageBand: AgeBand) => (
              <button
                key={ageBand}
                type="button"
                className="choice"
                onClick={() => advance('age', { ...draft, ageBand })}
              >
                {texts.ageBands[ageBand]}
              </button>
            ))}
          </div>
          <p className="hint">{texts.ageNote}</p>
          <div className="arrival-actions">
            <button type="button" className="quiet" onClick={() => advance('age', draft)}>
              {texts.skip}
            </button>
          </div>
        </section>
      )}
    </main>
  )
}
