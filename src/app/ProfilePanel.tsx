import { type BenchmarkRun, type DayKey, type DimensionCounts, type DimensionId, type DimensionResult, hasProfile, isImmediate, profileOf, progressOf, trainingFootprint, weakest } from '../core/index.ts'
import type { Dictionary } from '../i18n/index.ts'

/**
 * Das Gedächtnisprofil (Backlog E3, E4, E7 · D-021).
 *
 * Die gefährlichste Anzeige der ganzen App: Sie sieht aus wie ein Befund über
 * einen Menschen. Drei Dinge halten sie ehrlich:
 *
 * 1. **Nur verzögerter Abruf.** Was am Lerntag passiert, ist Übung; es steht
 *    hier nicht (F1).
 * 2. **Eine Spanne, kein Punkt.** Aus zwanzig Gelegenheiten folgt kein exakter
 *    Wert, und die Breite steht daneben statt im Kleingedruckten.
 * 3. **„Nicht gemessen“ sieht nicht aus wie „schlecht“.** Drei der neun Achsen
 *    haben in dieser App keine Quelle — dort steht das, und kein leerer Balken
 *    mit Hoffnung darauf.
 */
export function ProfilePanel({
  counts,
  trained,
  today,
  dictionary,
  runs,
}: {
  counts: Partial<Record<DimensionId, DimensionCounts>>
  trained: readonly DayKey[]
  today: DayKey
  dictionary: Dictionary
  runs: readonly BenchmarkRun[]
}) {
  const t = dictionary.profile
  const results = profileOf(counts)
  const names: Record<string, string> = t.names

  /*
    Die Trainingsbilanz (V2): acht Sieben-Tage-Fenster, ganz rechts die
    laufenden Tage. Übungsstand, keine Gedächtnisaussage (R-1) — und ohne
    Soll-Linie: Balken sagen, was war, nicht, was hätte sein sollen (K7).
    Sie steht auch vor dem ersten Achsen-Befund: Trainiert wurde ja schon.
  */
  const bars = trainingFootprint(trained, today, 8)
  const footprint = bars.some((week) => week.daysTrained > 0) && (
    <div className="footprint">
      <h3 className="coach-source">{t.footprintHeading}</h3>
      <div className="footprint-bars" aria-hidden="true">
        {bars.map((week, index) => (
          <span
            key={index}
            className="footprint-bar"
            style={{ height: `${6 + (week.daysTrained / 7) * 94}%` }}
          />
        ))}
      </div>
      <p className="hint">
        {t.footprintNote.replace(
          '{days}',
          String(bars.reduce((sum, week) => sum + week.daysTrained, 0)),
        )}
      </p>
    </div>
  )

  const ready = hasProfile(results) || progressOf(runs).kind === 'measured'
  const weak = weakest(results)

  return (
    <div className="profile">
      {footprint}
      <p className="hint">{ready ? t.note : t.empty}</p>

      <ul className="axes">
        {results.map((result) => (
          <li key={result.id} className={`axis axis-${result.kind}`}>
            <span className="axis-name">
              {names[result.id]}
              {/*
                Sofort-Achsen (D-026) sagen dazu, was sie zählen: Antworten
                im Moment, kein Wiedersehen nach Tagen. Ohne den Zusatz läse
                sich die Zeile wie alle anderen — und wäre eine andere Zahl
                im selben Gewand (R-1).
              */}
              {isImmediate(result.id) && <span className="axis-note"> · {t.immediate}</span>}
              <span className="axis-source">{result.kind === 'elsewhere' ? t.sourceBenchmark : result.kind === 'notMeasured' ? t.sourceNone : isImmediate(result.id) ? t.sourceImmediate : t.sourceTraining}</span>
            </span>
            <span className="axis-value">{valueOf(result, dictionary, runs)}</span>
          </li>
        ))}
      </ul>

      {/*
        Die schwächste Achse wird nur genannt, wenn sich zwei wirklich
        unterscheiden — sonst hieße „Zahlen sind deine Schwachstelle“ nur,
        dass der Zufall an diesem Tag so lag (E5, R-1).
      */}
      {ready && (
        <p className="hint">
          {weak === undefined ? t.noWeakest : `${t.weakest} ${names[weak]}`}
        </p>
      )}
    </div>
  )
}

function valueOf(result: DimensionResult, dictionary: Dictionary, runs: readonly BenchmarkRun[]): string {
  const t = dictionary.profile
  switch (result.kind) {
    case 'measured':
      return `${result.held} ${t.of} ${result.chances} ${t.kept} · ${t.range} ${result.low}–${result.high} %`
    case 'tooFew':
      return `${t.tooFew} (${t.chancesSoFar} ${result.chances} ${t.of15})`
    case 'elsewhere': {
      const benchmark = progressOf(runs)
      return benchmark.kind === 'calibrating'
        ? `${t.tooFew} (${benchmark.complete}/${benchmark.needed})`
        : benchmark.distinguishable
          ? t.benchmarkChange.replace('{low}', String(benchmark.low)).replace('{high}', String(benchmark.high))
          : t.benchmarkNoChange.replace('{low}', String(benchmark.low)).replace('{high}', String(benchmark.high))
    }
    case 'notMeasured':
      return t.notMeasured
  }
}
