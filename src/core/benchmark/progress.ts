/**
 * Aus Messungen wird eine Aussage (Backlog F2b, F3, F5 · D-006).
 *
 * Hier steht die Stelle, an der fast das ganze Genre unehrlich wird: Aus zwei
 * Zahlen eine dritte machen und sie „Memory Strength +18 %“ nennen. Was diese
 * Datei anders macht, sind drei Dinge:
 *
 * **Verglichen wird nur Vollständiges.** Eine Messung, bei der ein Abruf
 * ausgefallen ist, geht nicht ein. Sie zu ergänzen — hochzurechnen, zu
 * schätzen, den fehlenden Wert durch den Durchschnitt zu ersetzen — wäre eine
 * erfundene Zahl, und die ist nach R-1 schlimmer als gar keine.
 *
 * **Die ersten beiden Messungen sind Eichung.** Auch ein Benchmark wird durch
 * Gewöhnung an das Format ein wenig besser; wer die erste Messung als Tag 0
 * nimmt und am Tag 14 feiert, feiert zum guten Teil die Gewöhnung. Deshalb
 * bilden Messung 1 und 2 gemeinsam die Grundlinie, und vor der dritten steht
 * überhaupt keine Veränderung da.
 *
 * **Es steht eine Spanne da, kein Punkt.** Zwanzig Wörter sind eine kleine
 * Stichprobe: Zwei Wörter mehr oder weniger sind zehn Prozentpunkte. Wer
 * daraus einen exakten Wert macht, behauptet eine Genauigkeit, die die
 * Messung nicht hat. Und wenn die Spanne die Null enthält, sagt die App genau
 * das — **Veränderung innerhalb der Zählunsicherheit** — statt eine kleine
 * Zahl als Erfolg zu verkaufen.
 *
 * ── Was die Spanne ist und was sie nicht ist (F-07, Runde 2) ─────────────
 *
 * Sie kommt aus der Streuung, die eine Zählung von zwanzig Dingen von sich
 * aus hat (Binomial-Standardfehler, zwei Fehler breit). Das ist eine **grobe
 * Zählunsicherheit und kein Signifikanztest**: Die Wortblöcke sind nicht
 * nach Schwierigkeit geeicht, und die Tag-zu-Tag-Schwankung derselben Person
 * steckt nicht in der Rechnung. Deshalb sprechen alle Oberflächentexte von
 * „Zählunsicherheit“ und nicht mehr von „vom Zufall trennen“ — eine
 * Zufalls-/Signifikanzaussage gäbe die Methode nicht her. `distinguishable`
 * heißt nur: Die Spanne schließt die Null aus, mehr nicht.
 */

import { type BenchmarkRun, isComplete } from './plan.ts'

/** Wie viele Messungen als Eichung gelten (F2b). */
export const CALIBRATION_RUNS = 2

/**
 * Breite der Spanne in Standardfehlern.
 *
 * Zwei — die übliche Faustregel für „ziemlich sicher“. Enger anzusetzen wäre
 * hier die falsche Richtung: Die Spanne soll nicht schmeicheln.
 */
const SPREAD = 2

/** Der Anteil behaltener Wörter am Folgetag — das ist die gemessene Größe. */
export function retentionOf(run: BenchmarkRun): number {
  return run.total === 0 ? 0 : (run.nextDay ?? 0) / run.total
}

export type BenchmarkProgress =
  /** Noch nicht genug Messungen für eine Aussage. */
  | { kind: 'calibrating'; complete: number; needed: number }
  /**
   * Gemessen — in **Prozentpunkten** und nicht in Prozent: Von 40 % auf 55 %
   * sind fünfzehn Punkte, aber achtunddreißig Prozent mehr. Die zweite Zahl
   * klingt besser und sagt weniger.
   */
  | {
      kind: 'measured'
      /** Der Mittelwert der Eichmessungen, als Anteil. */
      baseline: number
      /** Die jüngste vollständige Messung, als Anteil. */
      latest: number
      /** Punktschätzung der Veränderung in Prozentpunkten. */
      points: number
      low: number
      high: number
      /** Schließt die Spanne die Null aus? Nur dann ist es ein Unterschied. */
      distinguishable: boolean
    }

/** Der Standardfehler eines Anteils bei `n` Beobachtungen. */
function standardError(share: number, n: number): number {
  return n === 0 ? 0 : Math.sqrt((share * (1 - share)) / n)
}

export function progressOf(runs: readonly BenchmarkRun[]): BenchmarkProgress {
  const complete = runs.filter(isComplete).sort((a, b) => a.ordinal - b.ordinal)
  if (complete.length <= CALIBRATION_RUNS) {
    return { kind: 'calibrating', complete: complete.length, needed: CALIBRATION_RUNS + 1 }
  }

  const calibration = complete.slice(0, CALIBRATION_RUNS)
  const latestRun = complete[complete.length - 1] as BenchmarkRun

  const baseHits = calibration.reduce((sum, run) => sum + (run.nextDay ?? 0), 0)
  const baseTotal = calibration.reduce((sum, run) => sum + run.total, 0)
  const baseline = baseTotal === 0 ? 0 : baseHits / baseTotal
  const latest = retentionOf(latestRun)

  const spread =
    SPREAD *
    Math.sqrt(
      standardError(baseline, baseTotal) ** 2 + standardError(latest, latestRun.total) ** 2,
    )

  const points = (latest - baseline) * 100
  const half = spread * 100

  return {
    kind: 'measured',
    baseline,
    latest,
    points: Math.round(points),
    low: Math.round(points - half),
    high: Math.round(points + half),
    // Ohne Rundung geprüft: Sonst hinge die Aussage daran, wie eine Zahl auf
    // dem Bildschirm aussieht, und nicht daran, was gemessen wurde.
    distinguishable: points - half > 0 || points + half < 0,
  }
}

/**
 * Die Reihe der echten Zahlen (F5).
 *
 * „Tag 1: 8/20 · Tag 15: 15/20“ — überzeugender als jede Prozentzahl, und es
 * stimmt. Unvollständige Messungen bleiben draußen; sie hätten am Folgetag
 * keine Zahl, und eine Lücke als Null zu zeichnen wäre eine Behauptung.
 */
export function series(runs: readonly BenchmarkRun[]): readonly BenchmarkRun[] {
  return runs.filter(isComplete).sort((a, b) => a.ordinal - b.ordinal)
}
