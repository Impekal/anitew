import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  MODES,
  SUPPORTED_LANGUAGES,
  type Language,
  type TrainingMode,
  createRng,
  dayKeyOf,
  hasWordPool,
  planSession,
  wordPool,
} from '../core/index.ts'
import { createWebPlatform } from '../platform/web/index.ts'
import { type SessionProgress, beginSession, clearProgress, loadProgress } from '../data/sessions.ts'

import { FoundationPanel } from './FoundationPanel.tsx'
import { SessionScreen } from './session/SessionScreen.tsx'
import { useLanguage } from './useLanguage.ts'

const MODE_ORDER: readonly TrainingMode[] = ['emergency', 'short', 'daily', 'extended']

export function App() {
  const platform = useMemo(() => createWebPlatform(), [])
  const { language, dictionary, translated, ready, choose } = useLanguage(platform)
  const [mode, setMode] = useState<TrainingMode>('daily')
  const [running, setRunning] = useState<SessionProgress | undefined>()
  const [resumable, setResumable] = useState<SessionProgress | undefined>()

  // Eine unterbrochene Einheit steht beim nächsten Start wieder da (B5).
  useEffect(() => {
    void loadProgress()
      .then((progress) => {
        if (progress !== undefined && progress.blockIndex < progress.plan.blocks.length) {
          setResumable(progress)
        }
      })
      .catch(() => undefined)
  }, [])

  const start = useCallback(() => {
    const now = platform.clock.now()
    const day = dayKeyOf(now, { offsetMinutes: platform.clock.offsetMinutes(now) })
    // Der Seed macht die Einheit reproduzierbar (A11): Aus Tag, Modus und
    // Startzeit folgen genau diese Wörter in genau dieser Reihenfolge.
    const seed = `${day}:${mode}:${now}`
    const sessionId = `s-${now.toString(36)}-${createRng(seed).int(1_000_000).toString(36)}`
    const plan = planSession({ mode, day, seed, pool: wordPool(language) })
    const progress: SessionProgress = { sessionId, plan, blockIndex: 0, results: [], startedAt: now }

    setResumable(undefined)
    setRunning(progress)
    void beginSession(progress, day, now).catch(() => undefined)
  }, [language, mode, platform])

  const leave = useCallback(() => setRunning(undefined), [])

  if (!ready) return null

  if (running !== undefined) {
    return (
      <SessionScreen
        platform={platform}
        dictionary={dictionary}
        progress={running}
        onLeave={leave}
      />
    )
  }

  const seconds = MODES[mode].seconds
  const label = `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`

  return (
    <main className="app">
      <header className="brand">
        <h1>{dictionary.app.name}</h1>
        <p className="tagline">{dictionary.app.tagline}</p>
      </header>

      {resumable !== undefined && (
        <section className="note" role="status">
          <h3>{dictionary.resume.heading}</h3>
          <p>{dictionary.resume.body}</p>
          <div className="note-actions">
            <button
              type="button"
              className="quiet"
              onClick={() => {
                setRunning(resumable)
                setResumable(undefined)
              }}
            >
              {dictionary.resume.continue}
            </button>
            <button
              type="button"
              className="quiet"
              onClick={() => {
                setResumable(undefined)
                void clearProgress().catch(() => undefined)
              }}
            >
              {dictionary.resume.discard}
            </button>
          </div>
        </section>
      )}

      <section className="challenge" aria-labelledby="challenge-heading">
        <h2 id="challenge-heading">{dictionary.start.heading}</h2>
        <button type="button" className="start" onClick={start}>
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

      <FoundationPanel platform={platform} dictionary={dictionary} />

      <footer className="footer">
        <label className="language">
          <span>{dictionary.language.label}</span>
          <select value={language} onChange={(event) => choose(event.target.value as Language)}>
            {SUPPORTED_LANGUAGES.map((tag) => (
              <option key={tag} value={tag}>
                {dictionary.language.names[tag]}
              </option>
            ))}
          </select>
        </label>
        {/*
          Fehlen Texte oder die eigene Wortliste (Backlog L6), wird auf der
          Rückfallsprache trainiert. Das ist eine Einschränkung und wird als
          solche gesagt, statt sie zu verstecken.
        */}
        {(!translated || !hasWordPool(language)) && (
          <p className="hint">{dictionary.language.incomplete}</p>
        )}
      </footer>
    </main>
  )
}
