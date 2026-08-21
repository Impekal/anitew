import { useEffect, useState } from 'react'

import {
  buildCoachPrompt,
  coachKeySettingFor,
  COACH_PROVIDER_SETTING,
  type CoachProvider,
  LEGACY_COACH_KEY_SETTING,
  type Platform,
} from '../core/index.ts'
import type { Advice } from '../core/coach/advice.ts'
import type { Dictionary } from '../i18n/index.ts'

interface CoachPanelProps {
  platform: Platform
  dictionary: Dictionary
  language: string
  advice: readonly Advice[]
  onBack: () => void
}

export function CoachPanel({
  platform,
  dictionary,
  language,
  advice,
  onBack,
}: CoachPanelProps) {
  const texts = dictionary.coach
  const [provider, setProvider] = useState<CoachProvider>('gemini')
  const [hasKey, setHasKey] = useState(false)
  const [keyDraft, setKeyDraft] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<string>()
  const [failure, setFailure] = useState<string>()
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    void platform.settings
      .read<CoachProvider>(COACH_PROVIDER_SETTING)
      .then((stored) => {
        if (stored === 'gemini' || stored === 'anthropic') setProvider(stored)
      })
      .catch(() => undefined)
  }, [platform])

  // Der Schlüssel gehört zum Anbieter — beim Wechsel wird neu nachgesehen,
  // und ein Anthropic-Schlüssel aus D-031-Zeiten zählt weiterhin.
  useEffect(() => {
    void (async () => {
      const stored =
        (await platform.settings.read<string>(coachKeySettingFor(provider))) ??
        (provider === 'anthropic'
          ? await platform.settings.read<string>(LEGACY_COACH_KEY_SETTING)
          : undefined)
      setHasKey(stored !== undefined && stored.trim() !== '')
    })().catch(() => undefined)
  }, [platform, provider])

  const choose = (next: CoachProvider) => {
    setProvider(next)
    setFailure(undefined)
    setAnswer(undefined)
    void platform.settings.write(COACH_PROVIDER_SETTING, next).catch(() => undefined)
  }

  const line = (entry: Advice): string => {
    const template = texts.advice[entry.id]
    const moduleLabel =
      entry.moduleId === undefined
        ? ''
        : entry.moduleId === 'spatial'
          ? dictionary.profile.names.spatial
          : dictionary.profile.modules[entry.moduleId]
    return template
      .replace('{axis}', entry.dimension === undefined ? '' : dictionary.profile.names[entry.dimension])
      .replace('{module}', moduleLabel)
  }

  const saveKey = () => {
    const key = keyDraft.trim()
    if (key === '') return
    void platform.settings.write(coachKeySettingFor(provider), key).catch(() => undefined)
    setHasKey(true)
    setKeyDraft('')
    setFailure(undefined)
  }

  const removeKey = () => {
    void platform.settings.remove(coachKeySettingFor(provider)).catch(() => undefined)
    if (provider === 'anthropic') {
      void platform.settings.remove(LEGACY_COACH_KEY_SETTING).catch(() => undefined)
    }
    setHasKey(false)
    setAnswer(undefined)
    setFailure(undefined)
  }

  const ask = () => {
    const prompt = buildCoachPrompt({ language, question, advice })
    if (prompt === undefined) return
    setBusy(true)
    setFailure(undefined)
    setAnswer(undefined)
    void platform.coach
      .ask({ provider, prompt })
      .then((reply) => setAnswer(reply))
      .catch(() => setFailure(texts.failed))
      .finally(() => setBusy(false))
  }

  return (
    <main className="app panel-screen">
      <header className="panel-head">
        <button type="button" className="quiet" onClick={onBack}>
          {dictionary.summary.back}
        </button>
        <h1>{texts.heading}</h1>
      </header>

      <section className="panel-card">
        <p className="hint">{texts.note}</p>
        {advice.length === 0 ? (
          <p>{texts.empty}</p>
        ) : (
          <ul className="coach-advice-list">
            {advice.map((entry) => (
              <li key={`${entry.id}-${entry.dimension ?? entry.moduleId ?? ''}`}>{line(entry)}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel-card">
        <h2>{texts.askHeading}</h2>
        <p className="hint">{texts.askNote}</p>
        <div className="coach-provider" role="group" aria-label={texts.providerLabel}>
          <button
            type="button"
            className={provider === 'gemini' ? 'choice selected' : 'choice'}
            onClick={() => choose('gemini')}
          >
            {texts.providers.gemini}
          </button>
          <button
            type="button"
            className={provider === 'anthropic' ? 'choice selected' : 'choice'}
            onClick={() => choose('anthropic')}
          >
            {texts.providers.anthropic}
          </button>
        </div>

        {hasKey ? (
          <div className="coach-key-state">
            <p>{texts.keyStored}</p>
            <button type="button" className="quiet" onClick={removeKey}>
              {texts.removeKey}
            </button>
          </div>
        ) : (
          <div className="coach-key-form">
            <label>
              <span>{texts.keyLabel}</span>
              <input
                type="password"
                value={keyDraft}
                onChange={(event) => setKeyDraft(event.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
            </label>
            <button type="button" className="quiet" onClick={saveKey} disabled={keyDraft.trim() === ''}>
              {texts.saveKey}
            </button>
          </div>
        )}

        <label className="coach-question">
          <span>{texts.questionLabel}</span>
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            rows={4}
            placeholder={texts.questionPlaceholder}
          />
        </label>
        <button type="button" className="start" onClick={ask} disabled={!hasKey || busy || question.trim() === ''}>
          <span className="start-label">{busy ? texts.askBusy : texts.ask}</span>
        </button>
        {failure !== undefined && <p className="hint">{failure}</p>}
        {answer !== undefined && <p className="coach-answer">{answer}</p>}
      </section>
    </main>
  )
}
