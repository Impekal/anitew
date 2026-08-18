import { useCallback, useEffect, useRef, useState } from 'react'

import {
  BENCHMARK_REMINDER_ID,
  BENCHMARK_SECONDS_PER_ITEM,
  benchmarkReminderAt,
  type BenchmarkPhase,
  type BenchmarkRun,
  type Platform,
  RECALL_SECONDS,
  dayKeyOf,
  gradeRecall,
  nextStep,
  splitEntries,
} from '../../core/index.ts'
import { recordPhase } from '../../data/benchmark.ts'
import type { Dictionary } from '../../i18n/index.ts'

/**
 * Die Messung (Backlog F2 · D-006).
 *
 * Sie sieht dem Training absichtlich ähnlich und ist etwas anderes: Was hier
 * gezählt wird, geht in **keinen** Trainingsscore ein, und die Wörter
 * bekommen **keinen** Wiederholungstermin (F1, F2a). Die Ähnlichkeit ist
 * gewollt — ein fremd aussehender Test misst zum Teil die Fremdheit.
 *
 * Drei Abrufe: sofort, nach zwanzig Minuten, am Folgetag. Dieser Bildschirm
 * führt immer nur den einen aus, der gerade dran ist; die Wartezeit dazwischen
 * gehört zur Messung und nicht in eine Schleife.
 */
export function BenchmarkScreen({
  platform,
  dictionary,
  run,
  runId,
  items,
  onDone,
  onAbort,
}: {
  platform: Platform
  dictionary: Dictionary
  run: BenchmarkRun
  runId: string
  items: readonly string[]
  onDone: () => void
  /** Raus, mitten in der Messung. Was das kostet, entscheidet `nextRunDue`. */
  onAbort: () => void
}) {
  const now = platform.clock.now()
  const today = dayKeyOf(now, { offsetMinutes: platform.clock.offsetMinutes(now) })
  const step = nextStep(run, now, today)

  if (step.kind === 'encode') {
    return (
      <Encode
        dictionary={dictionary}
        platform={platform}
        items={items}
        runId={runId}
        onDone={onDone}
        onAbort={onAbort}
      />
    )
  }
  if (step.kind === 'recall') {
    return (
      <Recall
        dictionary={dictionary}
        platform={platform}
        items={items}
        phase={step.phase}
        runId={runId}
        onDone={onDone}
        onAbort={onAbort}
      />
    )
  }
  return null
}

/**
 * Einprägen — zwanzig Wörter, fünf Sekunden je Wort.
 *
 * Die Zeiten stehen fest und hängen an **keinem** Trainingswert: „Immer
 * gleich aufgebaut“ (D-006) heißt, dass eine spätere Änderung an der
 * Trainingsschwierigkeit die Messreihe nicht verbiegt.
 */
function Encode({
  dictionary,
  platform,
  items,
  runId,
  onDone,
  onAbort,
}: {
  dictionary: Dictionary
  platform: Platform
  items: readonly string[]
  runId: string
  onDone: () => void
  onAbort: () => void
}) {
  const [index, setIndex] = useState(0)
  const startedRef = useRef(platform.clock.elapsed())

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = (platform.clock.elapsed() - startedRef.current) / 1000
      const at = Math.floor(elapsed / BENCHMARK_SECONDS_PER_ITEM)
      setIndex(Math.min(at, items.length))
    }, 200)
    return () => clearInterval(timer)
  }, [items.length, platform])

  if (index >= items.length) {
    return (
      <Recall
        dictionary={dictionary}
        platform={platform}
        items={items}
        phase="immediate"
        runId={runId}
        onDone={onDone}
        onAbort={onAbort}
      />
    )
  }

  return (
    <main className="app session">
      <p className="hint">{dictionary.benchmark.encodeHint}</p>
      <section className="encode">
        <p className="encode-word" key={index} aria-live="polite">
          {items[index]}
        </p>
        <div className="encode-dots" role="img" aria-label={`${index + 1} / ${items.length}`}>
          {items.map((item, position) => (
            <span
              key={item}
              className={position === index ? 'dot-now' : position < index ? 'dot-done' : ''}
            />
          ))}
        </div>
      </section>

      {/*
        Derselbe leise Knopf wie im Training — kein „bist du sicher?“.
        Eine Rückfrage, die zum Weitermachen drängt, wäre genau das Muster,
        das D-015 ausschließt. Was der Abbruch bedeutet, steht danach auf dem
        Startbildschirm; dort liest es sich, statt im Weg zu stehen.
      */}
      <button type="button" className="quiet session-abort" onClick={onAbort}>
        {dictionary.benchmark.abort}
      </button>
    </main>
  )
}

/** Ein Abruf — frei, ohne Hinweise, in derselben Form wie im Training. */
function Recall({
  dictionary,
  platform,
  items,
  phase,
  runId,
  onDone,
  onAbort,
}: {
  dictionary: Dictionary
  platform: Platform
  items: readonly string[]
  phase: BenchmarkPhase
  runId: string
  onDone: () => void
  onAbort: () => void
}) {
  const t = dictionary.benchmark
  const [entries, setEntries] = useState('')
  const [remaining, setRemaining] = useState(RECALL_SECONDS)
  const startedRef = useRef(platform.clock.elapsed())
  const doneRef = useRef(false)

  const finish = useCallback(
    (text: string) => {
      if (doneRef.current) return
      doneRef.current = true
      /*
       * Bewertet wird nachsichtig wie im Training — gemessen werden soll das
       * Gedächtnis und nicht die Rechtschreibung. Streng zu sein machte die
       * Zahl kleiner, aber nicht richtiger.
       */
      const graded = gradeRecall(splitEntries(text), items)
      const at = platform.clock.now()

      /*
       * Nach dem ersten Abruf beginnt das Zwanzig-Minuten-Fenster — und damit
       * die einzige Stelle der App, an der eine Erinnerung wirklich etwas
       * rettet (B8, D-022): Wer sie verpasst, hat eine Messung umsonst
       * gemacht, denn eine unvollständige zählt nicht (F1).
       *
       * Ob sie ankommt, entscheidet die Plattform. Hier wird nichts
       * versprochen, was `Reminders` nicht halten kann — im Browser hält der
       * Wecker nur, solange ANITEW offen ist, und der Panel sagt das auch.
       */
      if (phase === 'immediate') {
        void platform.reminders
          .schedule({
            id: BENCHMARK_REMINDER_ID,
            at: benchmarkReminderAt(at),
            title: dictionary.reminder.benchmarkTitle,
            body: dictionary.reminder.benchmarkBody,
          })
          .catch(() => undefined)
      }

      void recordPhase(runId, phase, graded.correct.length, at)
        .catch(() => undefined)
        .finally(onDone)
    },
    [dictionary, items, onDone, phase, platform, runId],
  )

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = (platform.clock.elapsed() - startedRef.current) / 1000
      const left = Math.max(0, RECALL_SECONDS - elapsed)
      setRemaining(Math.ceil(left))
      if (left <= 0) finish(entries)
    }, 200)
    return () => clearInterval(timer)
  }, [entries, finish, platform])

  const hint =
    phase === 'immediate'
      ? t.recallNow
      : phase === 'after20Minutes'
        ? t.recallAfter
        : t.recallNextDay

  return (
    <main className="app session">
      <header className="session-head">
        <span>{t.heading}</span>
        <span className="session-clock">
          {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}
        </span>
      </header>

      <section className="recall">
        <p className="hint">{hint}</p>
        <textarea
          className="recall-input"
          value={entries}
          onChange={(event) => setEntries(event.target.value)}
          placeholder={dictionary.session.recallPlaceholder}
          rows={6}
          autoFocus
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          aria-label={hint}
        />
        <button type="button" className="start" onClick={() => finish(entries)}>
          <span className="start-label">{dictionary.session.doneWithBlock}</span>
        </button>
      </section>

      <button type="button" className="quiet session-abort" onClick={onAbort}>
        {dictionary.benchmark.abort}
      </button>
    </main>
  )
}
