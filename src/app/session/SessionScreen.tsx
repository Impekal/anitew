import type { Platform } from '../../core/index.ts'
import type { SessionProgress } from '../../data/sessions.ts'
import type { Dictionary } from '../../i18n/index.ts'

import { useSessionRunner } from './useSessionRunner.ts'

export function SessionScreen({
  platform,
  dictionary,
  progress,
  onLeave,
}: {
  platform: Platform
  dictionary: Dictionary
  progress: SessionProgress
  onLeave: () => void
}) {
  const { state, setEntries, advance, leave } = useSessionRunner(platform, progress, onLeave)
  const t = dictionary.session

  if (state.finished) {
    return <Summary dictionary={dictionary} results={state.results} onLeave={leave} />
  }

  const block = state.block
  if (block === undefined) return null

  const rounds = new Set(state.plan.blocks.map((b) => b.round)).size
  const elapsedShare = 1 - state.remaining / block.seconds

  return (
    <main className="app session">
      <header className="session-head">
        <span className="session-round">
          {t.round} {block.round}/{rounds}
        </span>
        <span className="session-clock" aria-live="off">
          {formatSeconds(state.remaining)}
        </span>
      </header>

      <div
        className="session-bar"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={block.seconds}
        aria-valuenow={block.seconds - state.remaining}
      >
        <span style={{ width: `${Math.min(100, elapsedShare * 100)}%` }} />
      </div>

      {block.kind === 'encode' ? (
        <section className="encode">
          <p className="session-hint">{t.encodeHint}</p>
          {/* Das Wort wechselt von selbst; aria-live spricht es für den
              Screenreader mit, sonst bliebe der Block dort still. */}
          <p className="encode-word" aria-live="polite">
            {state.currentItem}
          </p>
          <p className="session-hint">
            {state.itemIndex + 1} / {block.items.length}
          </p>
        </section>
      ) : (
        <section className="recall">
          <p className="session-hint">{t.recallHint}</p>
          <textarea
            className="recall-input"
            value={state.entries}
            onChange={(event) => setEntries(event.target.value)}
            placeholder={t.recallPlaceholder}
            rows={5}
            autoFocus
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label={t.recallHint}
          />
          <p className="session-hint">
            {countEntries(state.entries)} / {block.items.length}
          </p>
          <button type="button" className="start" onClick={advance}>
            <span className="start-label">{t.doneWithBlock}</span>
          </button>
        </section>
      )}

      <button type="button" className="quiet session-abort" onClick={leave}>
        {t.abort}
      </button>
    </main>
  )
}

function Summary({
  dictionary,
  results,
  onLeave,
}: {
  dictionary: Dictionary
  results: { round: number; correct: string[]; missed: string[] }[]
  onLeave: () => void
}) {
  const t = dictionary.summary
  const correct = results.reduce((sum, round) => sum + round.correct.length, 0)
  const total = results.reduce((sum, round) => sum + round.correct.length + round.missed.length, 0)

  return (
    <main className="app">
      <section className="challenge">
        <h2>{t.heading}</h2>
        {/*
          Eine einzige, echte Zahl: wie viele Wörter von wie vielen. Kein
          Prozentwert, keine „Memory Strength“ — die käme aus dem Benchmark
          und den gibt es noch nicht (D-006, Regel R-1).
        */}
        <p className="summary-score">
          <strong>{correct}</strong>
          <span> / {total}</span>
        </p>
        <p className="session-hint">{t.note}</p>
      </section>

      <section className="foundation">
        <h3>{t.perRound}</h3>
        <dl>
          {results.map((round) => (
            <div className="row" key={round.round}>
              <dt>
                {dictionary.session.round} {round.round}
                {round.missed.length > 0 && (
                  <span className="row-hint">
                    {t.missed}: {round.missed.join(', ')}
                  </span>
                )}
              </dt>
              <dd>
                {round.correct.length} / {round.correct.length + round.missed.length}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <button type="button" className="quiet" onClick={onLeave}>
        {t.back}
      </button>
    </main>
  )
}

function countEntries(text: string): number {
  return text.split(/[\s,;]+/).filter((entry) => entry.trim().length > 0).length
}

function formatSeconds(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')}`
}
