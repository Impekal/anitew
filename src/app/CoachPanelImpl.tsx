import './coach.css'
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
  COACH_PROVIDER_NAMES,
  COACH_PROVIDERS,
  CoachError,
  type CoachFailure,
  type CoachProvider,
  DEFAULT_COACH_PROVIDER,
} from '../platform/web/coach.ts'
import { loadCoachKeys, saveCoachKeys, MAX_COACH_KEYS, type CoachKey } from '../platform/web/coachKeys.ts'
import type { Dictionary } from '../i18n/index.ts'

export function CoachPanelImpl({
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
  const [keys, setKeys] = useState<CoachKey[]>([])
  const [label, setLabel] = useState('')
  const [saving, setSaving] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [attempt, setAttempt] = useState('')
  const hasKey = keys.length > 0
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<string | undefined>(undefined)
  const [failure, setFailure] = useState<CoachFailure | undefined>(undefined)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let active = true
    void loadCoachKeys(platform.settings).then(saved => {
      if (active) { setKeys(saved); setLoaded(true) }
    }).catch(() => { if (active) setFailure('failed') })
    return () => { active = false }
  }, [platform])

  const choose = (next: CoachProvider) => {
    setProvider(next)
    setKeyDraft('')
  }

  const persist = async (next: CoachKey[]) => {
    setSaving(true)
    setFailure(undefined)
    try {
      await saveCoachKeys(platform.settings, next)
      setKeys(next)
      setAttempt('')
      return true
    } catch { setFailure('failed'); return false }
    finally { setSaving(false) }
  }

  const move = (index: number, delta: number) => {
    const next = [...keys]
    const target = index + delta
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target]!, next[index]!]
    void persist(next)
  }

  const line = (entry: Advice): string => {
    const template = texts.advice[entry.id]
    const moduleLabel =
      entry.moduleId === undefined
        ? ''
        : entry.moduleId === 'spatial'
          ? dictionary.profile.names.spatial
          : entry.moduleId === 'associative'
            ? dictionary.profile.names.binding
            : dictionary.profile.modules[entry.moduleId]
    return template
      .replace('{axis}', entry.dimension === undefined ? '' : dictionary.profile.names[entry.dimension])
      .replace('{module}', moduleLabel)
  }

  const saveKey = async () => {
    const key = keyDraft.trim()
    if (!loaded || saving || busy || !key || keys.length >= MAX_COACH_KEYS) return
    if (keys.some(entry => entry.provider === provider && entry.key === key)) {
      setFailure('failed')
      return
    }
    if (await persist([...keys, { id: crypto.randomUUID(), provider, key, label: label.trim() }])) {
      setKeyDraft('')
      setLabel('')
    }
  }

  const ask = () => {
    const asked = question.trim()
    if (asked === '' || busy || saving) return
    setBusy(true)
    setFailure(undefined)
    setAnswer(undefined)
    setAttempt('')
    void platform.coach
      .ask({ system: coachSystem(), question: coachQuestion(context, asked),
        onAttempt: entry => setAttempt(texts.activeKey.replace('{name}',
          `${entry.position}. ${entry.label || COACH_PROVIDER_NAMES[entry.provider as CoachProvider]}`)),
      })
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

        <ol className="coach-keys" aria-label={texts.keyOrder}>
          {keys.map((entry, index) => (
            <li key={entry.id}>
              <strong>{entry.label || COACH_PROVIDER_NAMES[entry.provider]}</strong>
              <span>{COACH_PROVIDER_NAMES[entry.provider]} · {index === 0 ? texts.preferred : texts.reserve}</span>
              <div className="coach-key-actions">
                <button type="button" className="quiet" disabled={busy || saving || index === 0}
                  aria-label={`${texts.moveUp} ${index + 1}`} onClick={() => move(index, -1)}>↑</button>
                <button type="button" className="quiet" disabled={busy || saving || index === keys.length - 1}
                  aria-label={`${texts.moveDown} ${index + 1}`} onClick={() => move(index, 1)}>↓</button>
                <button type="button" className="quiet coach-key-remove" disabled={busy || saving}
                  onClick={() => { void persist(keys.filter(saved => saved.id !== entry.id)) }}>{texts.keyRemove}</button>
              </div>
            </li>
          ))}
        </ol>
        <p className="hint">{texts.keyOrder}</p>
        <label className="coach-provider">
          <span>{texts.providerLabel}</span>
          <select value={provider} onChange={(event) => choose(event.target.value as CoachProvider)}>
            {COACH_PROVIDERS.map((id) => (
              <option key={id} value={id}>
                {id === 'openai' ? 'OpenAI' : texts.providers[id]}
              </option>
            ))}
          </select>
        </label>

        {keys.length < MAX_COACH_KEYS && (
          <>
            <p className="coach-key-help">
              {provider === 'openai' ? 'OpenAI Platform · API keys' : texts.keySteps[provider]}{' '}
              <a
                href={
                  provider === 'openai'
                    ? 'https://platform.openai.com/api-keys'
                    : COACH_KEY_URLS[provider]
                }
                target="_blank"
                rel="noreferrer"
              >
                {texts.keyLink}
              </a>
            </p>
            <label className="coach-key-label">
              {texts.keyLabel}
              <input value={label} maxLength={60} onChange={event => setLabel(event.target.value)} />
            </label>
            <div className="coach-key">
              <input
                type="password"
                className="coach-key-input"
                placeholder={texts.keyPlaceholder}
                aria-label={texts.keyPlaceholder}
                value={keyDraft}
                autoComplete="off"
                onChange={(event) => setKeyDraft(event.target.value)}
              />
              <button type="button" className="quiet" onClick={() => { void saveKey() }} disabled={!loaded || saving || busy || !keyDraft.trim()}>
                {texts.keySave}
              </button>
            </div>
          </>
        )}

        {hasKey && (
          <>
            <div className="coach-ask">
              <textarea
                className="coach-question"
                placeholder={texts.askPlaceholder}
                value={question}
                rows={3}
                onChange={(event) => setQuestion(event.target.value)}
              />
              <button type="button" className="quiet" onClick={ask} disabled={busy || saving}>
                {busy ? texts.thinking : texts.askButton}
              </button>
            </div>
          </>
        )}

        {attempt && <p className="coach-attempt" role="status">{attempt}</p>}
        {failure !== undefined && <p className="coach-failure">{texts.errors[failure]}</p>}
        {answer !== undefined && <p className="coach-answer">{answer}</p>}
      </section>
    </div>
  )
}
