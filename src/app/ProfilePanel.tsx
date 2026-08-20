import { useMemo } from 'react'

import { type BenchmarkRun, type DayKey, type DimensionCounts, type DimensionId, type DimensionResult, type ProfileSnapshot, hasProfile, isImmediate, profileOf, progressOf, trainingFootprint, weakest } from '../core/index.ts'
import type { Dictionary } from '../i18n/index.ts'
import { createWebPlatform } from '../platform/web/index.ts'
import { useProfileHistory } from './useProfileHistory.ts'

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
   * E4: Der Verlauf benutzt denselben Web-Port wie die übrige App und legt
   * tägliche Rohzählungen in den Einstellungen ab. Einstellungen gehören zur
   * Sicherung und zum Drive-Abgleich; damit entsteht kein zweiter Datenweg.
   * Die Trainingssprache löst der Haken aus derselben gespeicherten Wahl wie
   * die App selbst auf, damit ein Sprachwechsel keine falsche Kurve erzeugt.
   */
  const historyPlatform = useMemo(() => createWebPlatform(), [])
  const { history } = useProfileHistory(historyPlatform, today, counts)
  const trajectories = trajectoryOf(results, history)

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
        E4 zeigt absichtlich **keinen Pfeil nach oben/unten** und kein Urteil
        „verbessert“. Zwei gezählte Stände stehen nebeneinander, jeweils mit
        ihrer Spanne. Ob daraus eine Entwicklung folgt, darf die kleine
        Stichprobe nicht stärker behaupten als die Daten selbst.
      */}
      {trajectories.length > 0 && (
        <div className="profile-history">
          <h3 className="coach-source">{dictionary.benchmark.series}</h3>
          <ul className="axes profile-history-axes">
            {trajectories.map(({ id, first, last }) => (
              <li key={id} className="axis axis-measured">
                <span className="axis-name">{names[id]}</span>
                <span className="axis-value">
                  <span>{historyValue(first, t)}</span>
                  <span aria-hidden="true"> → </span>
                  <span>{historyValue(last, t)}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

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

interface HistoryPoint {
  day: DayKey
  result: Extract<DimensionResult, { kind: 'measured' }>
}

function trajectoryOf(
  current: readonly DimensionResult[],
  history: readonly ProfileSnapshot[],
): readonly { id: DimensionId; first: HistoryPoint; last: HistoryPoint }[] {
  const rows: { id: DimensionId; first: HistoryPoint; last: HistoryPoint }[] = []
  for (const result of current) {
    if (result.kind !== 'measured') continue
    const points = history.flatMap((snapshot) => {
      const atDay = profileOf(snapshot.counts).find((entry) => entry.id === result.id)
      return atDay?.kind === 'measured' ? [{ day: snapshot.day, result: atDay }] : []
    })
    const first = points[0]
    const last = points.at(-1)
    if (first === undefined || last === undefined || first.day === last.day) continue
    rows.push({ id: result.id, first, last })
  }
  return rows
}

function historyValue(point: HistoryPoint, t: Dictionary['profile']): string {
  const result = point.result
  return `${point.day}: ${result.rate} % · ${t.range} ${result.low}–${result.high} %`
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
