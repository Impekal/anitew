import {
  type BenchmarkRun,
  type Language,
  poolCycles,
  progressOf,
  series,
} from '../../core/index.ts'
import type { Dictionary } from '../../i18n/index.ts'

/**
 * Was die Messungen ergeben haben (Backlog F1, F2b, F3, F5 · D-006).
 *
 * Hier steht die einzige Stelle, an der ANITEW etwas über das Gedächtnis des
 * Nutzers sagt — und sie ist absichtlich die vorsichtigste der ganzen App:
 *
 * - Vor der dritten Messung steht **keine Veränderung** da, nur „Eichung“.
 * - Danach steht eine **Spanne**, kein exakter Wert.
 * - Enthält die Spanne die Null, sagt die App **„Veränderung innerhalb der
 *   Zählunsicherheit“** (F-07, Runde 2) — statt eine kleine Zahl als Erfolg
 *   zu verkaufen.
 * - Daneben stehen die **echten Zahlen** (F5): „1. Messung 8/20“. Sie
 *   überzeugen mehr als jede Prozentzahl, und sie stimmen.
 *
 * Was hier **nicht** steht: eine Aussage über den Alltag. Der Unterschied
 * zwischen „besser in dieser Messung“ und „besseres Gedächtnis“ ist der wunde
 * Punkt des ganzen Genres (F4), und er wird nicht überspielt.
 */
export function BenchmarkPanel({
  runs,
  language,
  dictionary,
}: {
  runs: readonly BenchmarkRun[]
  language: Language
  dictionary: Dictionary
}) {
  const t = dictionary.benchmark
  const done = series(runs)
  if (done.length === 0) return null

  const progress = progressOf(runs)
  const cycles = poolCycles(language)

  return (
    <section className="measure" aria-label={t.heading}>
      {progress.kind === 'calibrating' ? (
        <>
          <p className="measure-headline">{t.calibrating}</p>
          <p className="hint">{t.calibratingNote}</p>
        </>
      ) : progress.distinguishable ? (
        <>
          <p className="measure-headline">
            <strong>
              {progress.points > 0 ? '+' : ''}
              {progress.points}
            </strong>{' '}
            {progress.points > 0 ? t.changeUp : t.changeDown}
          </p>
          {/* Die Spanne steht daneben und nicht im Kleingedruckten: Sie ist
              Teil der Aussage und nicht ihre Fußnote. */}
          <p className="hint">
            {t.range}: {progress.low > 0 ? '+' : ''}
            {progress.low} … {progress.high > 0 ? '+' : ''}
            {progress.high}
          </p>
        </>
      ) : (
        <p className="hint measure-close">{t.tooClose}</p>
      )}

      {/* Die echten Zahlen (F5). */}
      <ol className="measure-series">
        {done.map((run) => (
          <li key={run.ordinal}>
            <span className="measure-ordinal">{run.ordinal}.</span>
            <span className="measure-count">
              {run.nextDay}/{run.total}
            </span>
          </li>
        ))}
      </ol>

      <details className="details">
        <summary>{t.explain}</summary>
        <p className="hint">{t.explainNote}</p>
        {/* Die Grenze des Vorrats wird genannt, sobald sie näher rückt. */}
        {done.length + 1 >= cycles && (
          <p className="hint">{t.cycles.replace('{n}', String(cycles))}</p>
        )}
      </details>
    </section>
  )
}
