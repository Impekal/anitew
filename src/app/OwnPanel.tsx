import { useCallback, useEffect, useState } from 'react'

import { type OwnFact, factPrompt, parseOwnText } from '../core/index.ts'
import { addOwnFacts, loadOwnFacts, loadOwnPool, removeOwnFact } from '../data/own.ts'
import type { Dictionary } from '../i18n/index.ts'

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

  const [draft, setDraft] = useState('')
  const [stored, setStored] = useState<readonly OwnFact[]>([])
  const [fresh, setFresh] = useState<ReadonlySet<string>>(new Set())

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

  return (
    <div className="own">
      <p className="hint">{texts.intro}</p>

      <textarea
        className="own-input"
        rows={5}
        placeholder={texts.placeholder}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
      />

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
