import { useMemo } from 'react'

import { type BenchmarkRun, type DayKey, type DimensionCounts, type DimensionId, type DimensionResult, type ProfileSnapshot, hasProfile, isImmediate, profileOf, progressOf, trainingFootprint, weakest } from '../core/index.ts'
import type { Dictionary } from '../i18n/index.ts'
import { createWebPlatform } from '../platform/web/index.ts'
import { useProfileHistory } from './useProfileHistory.ts'

/**
 * Das Gedächtnisprofil (Backlog E3, E4, E7, O15 · D-021).
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

      <ProfileNetwork results={results} names={names} />

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

/**
 * O15: Die gemessenen Achsen bekommen eine kleine Netzansicht, ohne eine neue
 * Kennzahl zu erfinden. Jeder Knoten benutzt ausschließlich den bereits
 * angezeigten beobachteten Anteil. Achsen mit zu wenig Daten fehlen aus dem
 * Netz vollständig — sie werden also nicht versehentlich als „0“ gezeichnet.
 *
 * Die ausführliche Liste darunter bleibt die semantische Quelle für Spannen,
 * Herkunft und dünne Daten. Das SVG ist deshalb bewusst aria-hidden: Es ist
 * eine visuelle Verdichtung derselben Messung, kein zweiter Befund.
 */
function ProfileNetwork({
  results,
  names,
}: {
  results: readonly DimensionResult[]
  names: Readonly<Record<string, string>>
}) {
  const measured = results.filter(
    (result): result is Extract<DimensionResult, { kind: 'measured' }> => result.kind === 'measured',
  )
  if (measured.length < 3) return null

  const center = 140
  const innerRadius = 28
  const outerRadius = 92
  const labelRadius = 118
  const angleOf = (index: number) => -Math.PI / 2 + (index / measured.length) * Math.PI * 2
  const pointAt = (radius: number, index: number) => {
    const angle = angleOf(index)
    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
    }
  }
  const points = measured.map((result, index) => {
    const radius = innerRadius + (result.rate / 100) * (outerRadius - innerRadius)
    return { ...pointAt(radius, index), result }
  })
  const polygon = points.map(({ x, y }) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')

  return (
    <svg
      className="profile-network"
      viewBox="0 0 280 280"
      aria-hidden="true"
      style={{ display: 'block', width: '100%', maxWidth: '21rem', margin: '0.75rem auto 1.25rem' }}
    >
      {[0.25, 0.5, 0.75, 1].map((fraction) => {
        const radius = innerRadius + fraction * (outerRadius - innerRadius)
        const ring = measured
          .map((_, index) => {
            const point = pointAt(radius, index)
            return `${point.x.toFixed(1)},${point.y.toFixed(1)}`
          })
          .join(' ')
        return <polygon key={fraction} points={ring} fill="none" stroke="var(--line)" strokeWidth="1" />
      })}

      {measured.map((_, index) => {
        const outer = pointAt(outerRadius, index)
        return (
          <line
            key={index}
            x1={center}
            y1={center}
            x2={outer.x}
            y2={outer.y}
            stroke="var(--line)"
            strokeWidth="1"
          />
        )
      })}

      <polygon
        points={polygon}
        fill="var(--accent-soft)"
        fillOpacity="0.5"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {points.map(({ x, y, result }) => (
        <circle
          key={result.id}
          className="profile-network-node"
          data-dimension={result.id}
          data-rate={result.rate}
          cx={x}
          cy={y}
          r="4"
          fill="var(--accent)"
        />
      ))}

      {measured.map((result, index) => {
        const point = pointAt(labelRadius, index)
        const cosine = Math.cos(angleOf(index))
        const textAnchor = cosine > 0.25 ? 'start' : cosine < -0.25 ? 'end' : 'middle'
        return (
          <text
            key={result.id}
            x={point.x}
            y={point.y}
            textAnchor={textAnchor}
            dominantBaseline="middle"
            fill="var(--ink-soft)"
            fontSize="9"
            fontFamily="var(--sans)"
          >
            {names[result.id]}
          </text>
        )
      })}
    </svg>
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
