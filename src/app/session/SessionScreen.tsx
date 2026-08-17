import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react'

import {
  type MajorPart,
  type Platform,
  helpsWith,
  isPrompted,
  lettersFor,
  majorParts,
  splitEntries,
} from '../../core/index.ts'
import type { RoundResult, SessionProgress } from '../../data/sessions.ts'
import type { Dictionary } from '../../i18n/index.ts'
import { Face } from '../Face.tsx'
import { useCountUp } from '../useCountUp.ts'

import { useSessionRunner } from './useSessionRunner.ts'

/** So lange dauert das Ankommen, bevor die Uhr läuft (D-011/G-1). */
const SETTLE_MS = 3000

export function SessionScreen(props: {
  platform: Platform
  dictionary: Dictionary
  progress: SessionProgress
  /** Die schon gelehrten Ziffern des Major-Systems (D5). */
  taught: readonly number[]
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
  taught,
  onLeave,
}: {
  platform: Platform
  dictionary: Dictionary
  progress: SessionProgress
  taught: readonly number[]
  onLeave: () => void
}) {
  const { state, setEntries, submitPrompt, advance, leave } = useSessionRunner(
    platform,
    progress,
    onLeave,
  )
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

  /*
   * Dieser Hook stand zuerst **unter** dem Return für die Zusammenfassung —
   * und wurde damit nur gerufen, solange die Einheit lief. React zählt Hooks
   * je Durchlauf; sobald die letzte Antwort da war, fehlte einer, die
   * Komponente brach ab und die Zusammenfassung erschien nie. Zehn E2E-Läufe
   * wurden rot, und alle zehn liefen bis zum Ende einer Einheit — die
   * kürzeren nicht. Hooks stehen vor jedem Return, ausnahmslos.
   */
  /*
   * Die Ziffer aus der Lektion **dieser** Einheit zählt sofort mit.
   *
   * Sie steht nach der Lektion in den Einstellungen, aber der Startbildschirm
   * liest sie erst wieder, wenn die Einheit vorbei ist — der Konsonant
   * erschiene also erstmals beim *nächsten* Training. Das ist genau der
   * falsche Moment: Wer eben gelernt hat, dass die Eins ein t ist, soll das
   * an der nächsten Zahl sehen und nicht morgen. Ein E2E-Test hat es
   * gefunden.
   *
   * Abgeleitet aus Plan und Blockzähler statt aus einem zweiten Zustand: Ein
   * vorbeigezogener Lehrblock **ist** die Auskunft, dass seine Ziffer gehalten
   * wurde — und kann mit der Datenbank nicht aus dem Tritt geraten.
   */
  const taughtNow = useMemo(() => {
    const fresh = state.plan.blocks
      .filter((candidate, index) => candidate.kind === 'teach' && index < state.blockIndex)
      .map((candidate) => Number(candidate.items[0]))
      .filter((digit) => Number.isInteger(digit))
    return fresh.length === 0 ? taught : [...taught, ...fresh]
  }, [state.plan, state.blockIndex, taught])

  if (state.finished) {
    return <Summary dictionary={dictionary} results={state.results} onLeave={leave} />
  }

  const block = state.block
  if (block === undefined) return null

  const rounds = new Set(state.plan.blocks.map((b) => b.round)).size
  const done = 1 - state.remaining / block.seconds

  /*
   * Die Konsonantenzeile erscheint erst, wenn sie etwas beiträgt (D5).
   * Solange keine einzige Ziffer gelehrt ist, stünde dort eine Reihe Punkte —
   * das wäre ein Versprechen auf etwas, das noch nicht da ist, und nach G-2
   * schlicht Möbel.
   */
  const parts: readonly MajorPart[] | undefined =
    block.kind === 'encode' &&
    block.moduleId === 'numbers' &&
    state.currentItem !== undefined &&
    helpsWith(state.currentItem, taughtNow)
      ? majorParts(state.currentItem, taughtNow)
      : undefined

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

      {block.kind === 'teach' ? (
        <Lesson
          dictionary={dictionary}
          digit={Number(block.items[0])}
          first={taught.length === 0}
          onDone={() => advance()}
        />
      ) : block.kind === 'encode' ? (
        <section className="encode">
          <p className="hint">
            {t.encodeHints[block.moduleId]}
          </p>
          {/*
            Der Schlüssel wechselt mit dem Wort, damit React das Element neu
            einsetzt und die Bewegung erneut läuft — sonst tauschte nur der
            Text, und das wäre der harte Schnitt aus G-3.
          */}
          {/*
            Beim Gesichtsmodul steht das Bild über dem Namen — und beides
            zusammen ist die Information, die eingeprägt wird. Der Name allein
            wäre ein Wort, das Bild allein nichts.
          */}
          {block.moduleId === 'faces' && state.currentItem !== undefined && (
            <Face key={`face-${state.currentItem}`} name={state.currentItem} />
          )}
          {/*
            Beim Zahlenmodul steht unter jeder Ziffer ihr Konsonant — sobald
            sie gelehrt wurde (D5). Zwei Raster übereinander mit derselben
            Spaltenzahl: Nur so steht der Buchstabe wirklich unter *seiner*
            Ziffer, und genau darum geht es beim Lernen der Zuordnung.

            Die Ziffern bleiben dabei allein in `.encode-word` — die
            Buchstaben stehen daneben und nicht darin, sonst läse jeder, der
            das Element ausliest, „4r7k“ statt „47“.
          */}
          {parts !== undefined ? (
            <div className="major" style={{ '--cells': parts.length } as CSSProperties}>
              <p className="encode-word major-row" key={block.id + state.itemIndex} aria-live="polite">
                {parts.map((part, index) => (
                  <span key={index}>{part.digit}</span>
                ))}
              </p>
              <p className="major-row major-letters" aria-hidden="true">
                {parts.map((part, index) => (
                  <span key={index}>{part.letters ?? '·'}</span>
                ))}
              </p>
            </div>
          ) : (
            <p className="encode-word" key={block.id + state.itemIndex} aria-live="polite">
              {state.currentItem}
            </p>
          )}
          {parts !== undefined && <p className="hint">{dictionary.technique.hint}</p>}

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
      ) : isPrompted(block.moduleId) ? (
        <PromptedRecall
          key={`${block.id}-${state.promptIndex}`}
          face={block.items[state.promptIndex] ?? ''}
          position={state.promptIndex + 1}
          total={block.items.length}
          hint={block.kind === 'review' ? t.reviewPromptHint : t.promptHint}
          placeholder={t.promptPlaceholder}
          action={t.doneWithBlock}
          onSubmit={submitPrompt}
        />
      ) : (
        <section className="recall">
          {/* Der Wiedersehensblock sieht aus wie der Abruf und ist doch etwas
              anderes: Hier wurde nichts gezeigt. Der Text sagt das, sonst
              sucht man den Einprägeteil, den es nie gab. */}
          <p className="hint">{block.kind === 'review' ? t.reviewHint : t.recallHint}</p>
          <textarea
            className="recall-input"
            value={state.entries}
            onChange={(event) => setEntries(event.target.value)}
            placeholder={
              block.moduleId === 'numbers' ? t.recallNumbersPlaceholder : t.recallPlaceholder
            }
            /* Auf dem Telefon die Zifferntastatur. Wer eine sechsstellige Zahl
               auf der Buchstabentastatur sucht, verliert Sekunden an etwas,
               das mit Gedächtnis nichts zu tun hat. `numeric` und nicht `tel`:
               `tel` bringt Stern und Raute mit, die hier nichts sollen. */
            inputMode={block.moduleId === 'numbers' ? 'numeric' : 'text'}
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
          <button type="button" className="start" onClick={() => advance()}>
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

/**
 * Gestützter Abruf: ein Gesicht, ein Feld, ein Name (Backlog D9).
 *
 * Der Schlüssel am Aufrufort wechselt mit dem Eintrag — dadurch setzt React
 * das Feld neu ein, es ist leer, und die Bewegung läuft erneut. Ohne das
 * stünde die vorige Antwort noch da, und der Nutzer müsste sie löschen, bevor
 * er die nächste tippen kann.
 */
function PromptedRecall({
  face,
  position,
  total,
  hint,
  placeholder,
  action,
  onSubmit,
}: {
  face: string
  position: number
  total: number
  hint: string
  placeholder: string
  action: string
  onSubmit: (answer: string) => void
}) {
  const [answer, setAnswer] = useState('')

  return (
    <section className="prompted">
      <p className="hint">{hint}</p>
      <Face name={face} size={168} />
      <form
        className="prompted-form"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit(answer)
        }}
      >
        <input
          className="recall-input prompted-input"
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder={placeholder}
          autoFocus
          autoCapitalize="words"
          autoCorrect="off"
          spellCheck={false}
          aria-label={hint}
        />
        <button type="submit" className="start">
          <span className="start-label">{action}</span>
        </button>
      </form>
      <p className="hint">
        {position} / {total}
      </p>
    </section>
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
  const learned = results.filter((round) => round.kind === 'recall')
  const revisited = results.filter((round) => round.kind === 'review')

  const correct = learned.flatMap((round) => round.correct)
  const missed = learned.flatMap((round) => round.missed)
  const total = correct.length + missed.length
  const shown = useCountUp(correct.length)

  const reviewCorrect = revisited.flatMap((round) => round.correct)
  const reviewTotal = reviewCorrect.length + revisited.flatMap((round) => round.missed).length

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

      {/*
        Das Wiedersehen bekommt eine eigene Zahl (D8).
        Sie mit dem heute Gelernten zu verrechnen wäre bequem und falsch:
        Etwas nach drei Tagen zu erinnern ist eine andere Leistung, als es
        zwei Minuten nach dem Einprägen abzurufen. Zwei Leistungen, zwei
        Zahlen — dieselbe Trennung wie zwischen Trainingsscore und Benchmark.
      */}
      {reviewTotal > 0 && (
        <section className="challenge">
          <h2>{t.fromBefore}</h2>
          <p className="summary-score summary-score-small">
            <strong>{reviewCorrect.length}</strong>
            <span> / {reviewTotal}</span>
          </p>
        </section>
      )}

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

/**
 * Eine Lektion (Backlog D5).
 *
 * Der Bildschirm, auf dem ANITEW etwas **beibringt** statt abzufragen — und
 * er ist bewusst der ruhigste der ganzen App: eine Ziffer, ihr Laut, ein Satz
 * dazu. Ein Bild pro Bildschirm (G-2), kein Fortschrittsbalken, keine
 * Belohnung, kein „Verstanden?“-Knopf, der eine Prüfung andeutet.
 *
 * Die Brücke ist der eigentliche Inhalt: Ohne sie ist die Zuordnung Willkür,
 * und Willkür merkt sich niemand. „Das kleine n hat zwei Abstriche“ ist der
 * Grund, warum die Zwei hängen bleibt.
 *
 * Antippen geht weiter; wer nichts tut, wird nach vierzehn Sekunden von
 * selbst weitergetragen. Beides gilt als gehalten — die Lektion ist kein
 * Hindernis, das man nehmen muss.
 */
function Lesson({
  dictionary,
  digit,
  first,
  onDone,
}: {
  dictionary: Dictionary
  digit: number
  /** Beim allerersten Mal steht der Zweck darüber, danach nicht mehr (G-2). */
  first: boolean
  onDone: () => void
}) {
  const t = dictionary.technique
  // Die Schlüssel in `de.ts` sind Zahlen, keine Zeichenketten — ein Blick
  // durch `Record<number, string>` erspart die Wandlung und die Behauptung,
  // der Wert sei sicher da.
  const hooks: Record<number, string> = t.hooks
  const hook = hooks[digit] ?? ''

  return (
    <section className="lesson">
      <p className="hint">{first ? t.intro : t.majorName}</p>
      <button type="button" className="lesson-card" onClick={onDone}>
        <span className="lesson-digit">{digit}</span>
        <span className="lesson-letters">{lettersFor(digit)}</span>
      </button>
      <p className="lesson-hook">{hook}</p>
      <p className="hint">{t.ready}</p>
    </section>
  )
}
