import { useEffect, useState } from 'react'

import {
  type Advice,
  type CoachContext,
  type Platform,
  coachQuestion,
  coachSystem,
} from '../core/index.ts'
import { COACH_KEY_SETTING, CoachError, type CoachFailure } from '../platform/web/coach.ts'
import type { Dictionary } from '../i18n/index.ts'

/**
 * Die Coach-Seite (Backlog M · D-031).
 *
 * Oben der Pflichtteil: Hinweise aus den eigenen Zahlen, ohne Netz, ohne
 * Schlüssel — jede Zeile mit Quelle (R-1). Darunter die Kür: Wer seinen
 * eigenen Anthropic-Schlüssel hinterlegt, kann frei fragen. Der Absatz
 * dazu sagt **vor** der Eingabe, wo der Schlüssel liegt und wohin er
 * geht (D-015/R-3) — und jeder Fehlerfall sagt, dass der obere Teil
 * davon unberührt weiterläuft.
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

  const [keyDraft, setKeyDraft] = useState('')
  const [hasKey, setHasKey] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<string | undefined>(undefined)
  const [failure, setFailure] = useState<CoachFailure | undefined>(undefined)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    void platform.settings
      .read<string>(COACH_KEY_SETTING)
      .then((stored) => setHasKey(stored !== undefined && stored.trim() !== ''))
      .catch(() => undefined)
  }, [platform])

  const line = (entry: Advice): string => {
    const template = texts.advice[entry.id]
    return template
      .replace('{axis}', entry.dimension === undefined ? '' : dictionary.profile.names[entry.dimension])
      .replace('{module}', entry.moduleId === undefined ? '' : dictionary.profile.modules[entry.moduleId])
  }

  const saveKey = () => {
    const key = keyDraft.trim()
    if (key === '') return
    void platform.settings.write(COACH_KEY_SETTING, key).catch(() => undefined)
    setHasKey(true)
    setKeyDraft('')
    setFailure(undefined)
  }

  const removeKey = () => {
    void platform.settings.remove(COACH_KEY_SETTING).catch(() => undefined)
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

        {!hasKey && (
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
