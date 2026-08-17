import { useEffect, useRef, useState } from 'react'

import { type Platform, splitEntries } from '../../core/index.ts'
import type { RoundResult, SessionProgress } from '../../data/sessions.ts'
import type { Dictionary } from '../../i18n/index.ts'
import { useCountUp } from '../useCountUp.ts'

import { useSessionRunner } from './useSessionRunner.ts'

/** So lange dauert das Ankommen, bevor die Uhr läuft (D-011/G-1). */
const SETTLE_MS = 3000

export function SessionScreen(props: {
  platform: Platform
  dictionary: Dictionary
  progress: SessionProgress
  onLeave: () => void
}) {
  const [settled, setSettled] = useState(false)

  if (!settled) {
    return <Settle dictionary={props.dictionary} onDone={() => setSettled(true)} />
  }
  return <RunningSession {...props} />
}

/**
 * Drei Sekunden zwischen Alltag und Training.
 *
 * Kein Countdown — der drängt. Ein Kreis, der atmet. Wer ihn antippt,
 * überspringt ihn: Ruhe darf niemandem aufgezwungen werden.
 *
 * Die Uhr der Einheit läuft erst danach. Das Zeitbudget bleibt Trainingszeit
 * und wird nicht heimlich mit Ankommen gefüllt (B2).
 */
function Settle({ dictionary, onDone }: { dictionary: Dictionary; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, SETTLE_MS)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <main className="app session">
      <button type="button" className="settle" onClick={onDone}>
        <span className="settle-breath" aria-hidden="true" />
        <p className="settle-word">{dictionary.session.settle}</p>
        <p className="hint">{dictionary.session.settleHint}</p>
      </button>
    </main>
  )
}

function RunningSession({
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

  /*
   * Während des Trainings tritt das Netz im Hintergrund fast vollständig
   * zurück (D-011/G-2).
   *
   * Auf dem Startbildschirm darf es da sein — dort ist Platz und es soll
   * wirken. Beim Einprägen steht ein einziges Wort im Mittelpunkt, und ein
   * Gewebe aus fünfzig Knoten dahinter ist dann kein Hintergrund mehr,
   * sondern ein Mitbewerber. Die Aufmerksamkeit verengt sich, also verengt
   * sich auch das Bild.
   *
   * Der Hook steht vor dem vorzeitigen `return` — sonst hinge die Reihenfolge
   * der Hooks davon ab, ob die Einheit schon fertig ist.
   */
  useEffect(() => {
    const root = document.documentElement
    if (state.finished) {
      delete root.dataset.focus
      return
    }
    root.dataset.focus = 'on'
    return () => {
      delete root.dataset.focus
    }
  }, [state.finished])

  /*
   * Jedes gelandete Wort klingt (D-011/G-9) — kurz, hoch, fast ein Tropfen.
   * Gezählt wird die Zahl der Marken, nicht jeder Tastendruck: Sonst klapperte
   * es beim Tippen wie eine Schreibmaschine.
   */
  const chipCount = splitEntries(state.entries).length
  const chipsRef = useRef(0)
  useEffect(() => {
    if (chipCount > chipsRef.current) platform.sound.play('type', chipCount)
    chipsRef.current = chipCount
  }, [chipCount, platform])

  if (state.finished) {
    return <Summary dictionary={dictionary} results={state.results} onLeave={leave} />
  }

  const block = state.block
  if (block === undefined) return null

  const rounds = new Set(state.plan.blocks.map((b) => b.round)).size
  const done = 1 - state.remaining / block.seconds

  return (
    <main className="app session">
      <header className="session-head">
        <span>
          {t.round} {block.round}/{rounds}
        </span>
        <span className="session-clock">{formatSeconds(state.remaining)}</span>
      </header>

      <div
        className="session-bar"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={block.seconds}
        aria-valuenow={block.seconds - state.remaining}
      >
        <span style={{ width: `${Math.min(100, done * 100)}%` }} />
      </div>

      {block.kind === 'encode' ? (
        <section className="encode">
          <p className="hint">{t.encodeHint}</p>
          {/*
            Der Schlüssel wechselt mit dem Wort, damit React das Element neu
            einsetzt und die Bewegung erneut läuft — sonst tauschte nur der
            Text, und das wäre der harte Schnitt aus G-3.
          */}
          <p className="encode-word" key={block.id + state.itemIndex} aria-live="polite">
            {state.currentItem}
          </p>
          <div
            className="encode-dots"
            role="img"
            aria-label={`${state.itemIndex + 1} / ${block.items.length}`}
          >
            {block.items.map((item, index) => (
              <span
                key={item}
                className={
                  index === state.itemIndex ? 'dot-now' : index < state.itemIndex ? 'dot-done' : ''
                }
              />
            ))}
          </div>
        </section>
      ) : (
        <section className="recall">
          <p className="hint">{t.recallHint}</p>
          <textarea
            className="recall-input"
            value={state.entries}
            onChange={(event) => setEntries(event.target.value)}
            placeholder={t.recallPlaceholder}
            rows={4}
            autoFocus
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label={t.recallHint}
          />
          {/*
            Das Getippte kommt als Marke zurück — sichtbar, greifbar, ohne
            jede Bewertung. Ein „richtig“ oder „falsch“ an dieser Stelle wäre
            ein Hinweis und würde den freien Abruf zerstören (C5).
          */}
          <div className="chips" aria-hidden="true">
            {splitEntries(state.entries).map((entry, index) => (
              <span className="chip" key={`${entry}-${index}`}>
                {entry}
              </span>
            ))}
          </div>
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
  results: RoundResult[]
  onLeave: () => void
}) {
  const t = dictionary.summary
  const correct = results.flatMap((round) => round.correct)
  const missed = results.flatMap((round) => round.missed)
  const total = correct.length + missed.length
  const shown = useCountUp(correct.length)

  return (
    <main className="app summary-screen">
      <section className="challenge">
        <h2>{t.heading}</h2>
        {/*
          Eine einzige, echte Zahl. Kein Prozentwert, keine „Memory Strength“ —
          die käme aus dem Benchmark, und den gibt es noch nicht
          (D-006, Regel R-1 und D-011/G-6).
        */}
        <p className="summary-score">
          <strong>{shown}</strong>
          <span> / {total}</span>
        </p>
        <div className="summary-words">
          {correct.map((word, index) => (
            <span className="chip" key={word} style={{ '--i': index } as React.CSSProperties}>
              {word}
            </span>
          ))}
        </div>
      </section>

      {missed.length > 0 && (
        <section className="challenge">
          {/* G-5: Was nicht kam, ist kein Versagen — es steht nur daneben,
              in gedeckter Farbe, ohne Kommentar. */}
          <h2>{t.missed}</h2>
          <div className="summary-words">
            {missed.map((word, index) => (
              <span
                className="chip chip-muted"
                key={word}
                style={{ '--i': index } as React.CSSProperties}
              >
                {word}
              </span>
            ))}
          </div>
        </section>
      )}

      <p className="hint">{t.note}</p>

      <button type="button" className="quiet summary-back" onClick={onLeave}>
        {t.back}
      </button>
    </main>
  )
}

function formatSeconds(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')}`
}
