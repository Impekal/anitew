import { useMemo, useState } from 'react'

import { MODES, SUPPORTED_LANGUAGES, type Language, type TrainingMode } from '../core/index.ts'
import { createWebPlatform } from '../platform/web/index.ts'

import { FoundationPanel } from './FoundationPanel.tsx'
import { useLanguage } from './useLanguage.ts'

const MODE_ORDER: readonly TrainingMode[] = ['emergency', 'short', 'daily', 'extended']

export function App() {
  const platform = useMemo(() => createWebPlatform(), [])
  const { language, dictionary, translated, ready, choose } = useLanguage(platform)
  const [mode, setMode] = useState<TrainingMode>('daily')
  const [showNotYet, setShowNotYet] = useState(false)

  // Bis die gespeicherte Sprache da ist, wird nichts gezeigt — siehe
  // useLanguage(). Das dauert einen Wimpernschlag und verhindert das
  // Umspringen der Texte.
  if (!ready) return null

  const seconds = MODES[mode].seconds
  const label = `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`

  return (
    <main className="app">
      <header className="brand">
        <h1>{dictionary.app.name}</h1>
        <p className="tagline">{dictionary.app.tagline}</p>
      </header>

      <section className="challenge" aria-labelledby="challenge-heading">
        <h2 id="challenge-heading">{dictionary.start.heading}</h2>
        <button type="button" className="start" onClick={() => setShowNotYet(true)}>
          <span className="start-time">{label}</span>
          <span className="start-label">{dictionary.start.start}</span>
        </button>

        <div className="modes" role="group" aria-label={dictionary.start.heading}>
          {MODE_ORDER.map((id) => (
            <button
              key={id}
              type="button"
              className={id === mode ? 'mode mode-active' : 'mode'}
              aria-pressed={id === mode}
              onClick={() => setMode(id)}
            >
              {dictionary.start.modes[id]}
            </button>
          ))}
        </div>
      </section>

      {showNotYet && (
        <section className="note" role="status">
          <h3>{dictionary.notYet.heading}</h3>
          <p>{dictionary.notYet.body}</p>
          <button type="button" className="quiet" onClick={() => setShowNotYet(false)}>
            {dictionary.notYet.close}
          </button>
        </section>
      )}

      <FoundationPanel platform={platform} dictionary={dictionary} />

      <footer className="footer">
        <label className="language">
          <span>{dictionary.language.label}</span>
          <select
            value={language}
            onChange={(event) => choose(event.target.value as Language)}
          >
            {SUPPORTED_LANGUAGES.map((tag) => (
              <option key={tag} value={tag}>
                {dictionary.language.names[tag]}
              </option>
            ))}
          </select>
        </label>
        {!translated && <p className="hint">{dictionary.language.incomplete}</p>}
      </footer>
    </main>
  )
}
