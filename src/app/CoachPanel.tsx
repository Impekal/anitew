import { useEffect, useState } from 'react'

import {
  type Advice,
  type CoachContext,
  type Platform,
  coachQuestion,
  coachSystem,
} from '../core/index.ts'
import {
  COACH_KEY_URLS,
  COACH_PROVIDERS,
  COACH_PROVIDER_SETTING,
  CoachError,
  type CoachFailure,
  type CoachProvider,
  DEFAULT_COACH_PROVIDER,
  LEGACY_COACH_KEY_SETTING,
  coachKeySettingFor,
} from '../platform/web/coach.ts'
import type { Dictionary } from '../i18n/index.ts'

/**
 * Die Coach-Seite (Backlog M · D-031 · D-034).
 *
 * Oben der Pflichtteil: Hinweise aus den eigenen Zahlen, ohne Netz, ohne
 * Schlüssel — jede Zeile mit Quelle (R-1). Darunter die Kür: Wer bei
 * einem der fünf Anbieter einen eigenen Schlüssel anlegt (Anleitung und
 * Direktlink stehen daneben), kann frei fragen. Der Absatz dazu sagt
 * **vor** der Eingabe, wo der Schlüssel bleibt und wohin er geht
 * (D-015/R-3) — und jeder Fehlerfall sagt, dass der obere Teil davon
 * unberührt weiterläuft.
 */
export function CoachPanel({
  advice,
  context,
  platform,
  dictionary,
}: {
  advice: readonly Advice[]
  context: CoachContext
  platform: Platform
  dictionary: Dictionary
}) {
  const texts = dictionary.coach

  const [provider, setProvider] = useState<CoachProvider>(DEFAULT_COACH_PROVIDER)
  const [keyDraft, setKeyDraft] = useState('')
  const [hasKey, setHasKey] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<string | undefined>(undefined)
  const [failure, setFailure] = useState<CoachFailure | undefined>(undefined)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    void platform.settings
      .read<CoachProvider>(COACH_PROVIDER_SETTING)
      .then((stored) => {
        if (stored !== undefined && COACH_PROVIDERS.includes(stored)) setProvider(stored)
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
    return template
      .replace('{axis}', entry.dimension === undefined ? '' : dictionary.profile.names[entry.dimension])
      .replace('{module}', entry.moduleId === undefined ? '' : dictionary.profile.modules[entry.moduleId])
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
    const asked = question.trim()
    if (asked === '' || busy) return
    setBusy(true)
    setFailure(undefined)
    setAnswer(undefined)
    void platform.coach
      .ask({ system: coachSystem(), question: coachQuestion(context, asked) })
      .then(setAnswer)
      .catch((error: unknown) => {
        setFailure(error instanceof CoachError ? error.reason : 'failed')
      })
      .finally(() => setBusy(false))
  }

  return (
    <div className="coach">
      <section aria-label={texts.adviceHeading}>
        <h3 className="coach-source">{texts.adviceHeading}</h3>
        <ul className="coach-advice">
          {advice.map((entry) => (
            <li key={entry.id}>{line(entry)}</li>
          ))}
        </ul>
      </section>

      <section aria-label={texts.askHeading}>
        <h3 className="coach-source">{texts.askHeading}</h3>
        <p className="hint">{texts.keyNote}</p>

        <label className="coach-provider">
          <span>{texts.providerLabel}</span>
          <select
            value={provider}
            onChange={(event) => choose(event.target.value as CoachProvider)}
          >
            {COACH_PROVIDERS.map((id) => (
              <option key={id} value={id}>
                {texts.providers[id]}
              </option>
            ))}
          </select>
        </label>

        {!hasKey && (
          <>
            {/*
              Die Anleitung steht **vor** dem Feld (D-015): erst wissen, wo
              der Schlüssel entsteht und was er kostet, dann eintragen. Der
              Link geht direkt auf die Schlüssel-Seite des Anbieters.
            */}
            <p className="coach-key-help">
              {texts.keySteps[provider]}{' '}
              <a href={COACH_KEY_URLS[provider]} target="_blank" rel="noreferrer">
                {texts.keyLink}
              </a>
            </p>
            <div className="coach-key">
              <input
                type="password"
                className="coach-key-input"
                placeholder={texts.keyPlaceholder}
                value={keyDraft}
                autoComplete="off"
                onChange={(event) => setKeyDraft(event.target.value)}
              />
              <button type="button" className="quiet" onClick={saveKey}>
                {texts.keySave}
              </button>
            </div>
          </>
        )}

        {hasKey && (
          <>
            <p className="coach-key-present">
              {texts.keyPresent}{' '}
              <button type="button" className="quiet coach-key-remove" onClick={removeKey}>
                {texts.keyRemove}
              </button>
            </p>
            <div className="coach-ask">
              <textarea
                className="coach-question"
                placeholder={texts.askPlaceholder}
                value={question}
                rows={3}
                onChange={(event) => setQuestion(event.target.value)}
              />
              <button type="button" className="quiet" onClick={ask} disabled={busy}>
                {busy ? texts.thinking : texts.askButton}
              </button>
            </div>
          </>
        )}

        {failure !== undefined && <p className="coach-failure">{texts.errors[failure]}</p>}
        {answer !== undefined && <p className="coach-answer">{answer}</p>}
      </section>
    </div>
  )
}
