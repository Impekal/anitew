import { useCallback, useEffect, useState } from 'react'

import { type OwnFact, factPrompt, parseOwnText } from '../core/index.ts'
import { addOwnFacts, loadOwnFacts, loadOwnPool, removeOwnFact } from '../data/own.ts'
import type { Dictionary } from '../i18n/index.ts'
import { dictateLocally } from '../platform/web/localDictation.ts'
import { localDictationCopyForCurrentUi } from './localDictationCopy.ts'

/**
 * Eigene Inhalte (Backlog I · D-032).
 *
 * Einfügen, ansehen, übernehmen: Die Vorschau zeigt live, welche Zeilen
 * Karten würden — und welche nicht, sichtbar statt verschluckt. Übernommen
 * wird erst auf Fingertipp (I4), gespeichert nur auf diesem Gerät (I6).
 * Jede Karte sagt dazu, wo sie steht: schon im Wiederholungsplan oder noch
 * auf dem Weg in die nächste Einheit.
 */
export function OwnPanel({ language, dictionary }: { language: string; dictionary: Dictionary }) {
  const texts = dictionary.own
  const dictationTexts = localDictationCopyForCurrentUi()

  const [draft, setDraft] = useState('')
  const [stored, setStored] = useState<readonly OwnFact[]>([])
  const [fresh, setFresh] = useState<ReadonlySet<string>>(new Set())
  const [dictationState, setDictationState] = useState<
    'idle' | 'listening' | 'unavailable' | 'failed'
  >('idle')

  const reload = useCallback(() => {
    void loadOwnFacts(language)
      .then(setStored)
      .catch(() => undefined)
    void loadOwnPool(language)
      .then((pool) => setFresh(new Set(pool.map(factPrompt))))
      .catch(() => undefined)
  }, [language])

  useEffect(() => {
    reload()
  }, [reload])

  const parsed = parseOwnText(draft)

  const save = () => {
    if (parsed.facts.length === 0) return
    void addOwnFacts(language, parsed.facts)
      .then(() => {
        setDraft('')
        reload()
      })
      .catch(() => undefined)
  }

  const remove = (prompt: string) => {
    void removeOwnFact(language, prompt)
      .then(reload)
      .catch(() => undefined)
  }

  const dictate = () => {
    if (dictationState === 'listening') return
    setDictationState('listening')
    void dictateLocally(language)
      .then((result) => {
        if (result.status === 'ok') {
          setDraft((current) => {
            const separator = current.trim() === '' ? '' : current.endsWith('\n') ? '' : '\n'
            return `${current}${separator}${result.text}`
          })
          setDictationState('idle')
          return
        }
        setDictationState(result.status)
      })
      .catch(() => setDictationState('failed'))
  }

  const dictationStatus =
    dictationState === 'listening'
      ? dictationTexts.listening
      : dictationState === 'unavailable'
        ? dictationTexts.unavailable
        : dictationState === 'failed'
          ? dictationTexts.failed
          : undefined

  return (
    <div className="own">
      <p className="hint">{texts.intro}</p>

      <textarea
        className="own-input"
        rows={5}
        placeholder={texts.placeholder}
        value={draft}
        onChange={(event) => {
          setDraft(event.target.value)
          if (dictationState !== 'listening') setDictationState('idle')
        }}
      />

      <button
        type="button"
        className="quiet own-dictate"
        onClick={dictate}
        disabled={dictationState === 'listening'}
      >
        {dictationState === 'listening' ? dictationTexts.listening : dictationTexts.start}
      </button>
      {dictationStatus !== undefined && dictationState !== 'listening' && (
        <p className="hint own-dictation-status" role="status" aria-live="polite">
          {dictationStatus}
        </p>
      )}

      {parsed.facts.length > 0 && (
        <section aria-label={texts.preview}>
          <h3 className="coach-source">{texts.preview}</h3>
          <ul className="own-preview">
            {parsed.facts.map((fact) => (
              <li key={fact.prompt}>
                {fact.prompt} · {fact.answer}
              </li>
            ))}
          </ul>
          <button type="button" className="quiet own-save" onClick={save}>
            {texts.save}
          </button>
        </section>
      )}

      {parsed.rejected.length > 0 && (
        <section aria-label={texts.rejected}>
          <h3 className="coach-source">{texts.rejected}</h3>
          <ul className="own-rejected">
            {parsed.rejected.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      )}

      <section aria-label={texts.listHeading}>
        <h3 className="coach-source">{texts.listHeading}</h3>
        {stored.length === 0 && <p className="hint">{texts.empty}</p>}
        {stored.length > 0 && (
          <ul className="own-list">
            {stored.map((fact) => (
              <li key={fact.prompt} className="own-card">
                <span className="own-card-text">
                  {fact.prompt} · {fact.answer}
                  <span className="own-card-state">
                    {fresh.has(fact.prompt) ? texts.fresh : texts.scheduled}
                  </span>
                </span>
                <button type="button" className="quiet" onClick={() => remove(fact.prompt)}>
                  {texts.remove}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
