import { describe, expect, it } from 'vitest'

import {
  BENCHMARK_ITEMS,
  benchmarkItems,
  benchmarkPool,
  poolCycles,
} from '../../src/core/benchmark/pool.ts'
import {
  AFTER_20_MIN_FROM,
  AFTER_20_MIN_UNTIL,
  type BenchmarkRun,
  isComplete,
  nextRunDue,
  nextStep,
} from '../../src/core/benchmark/plan.ts'
import { CALIBRATION_RUNS, progressOf, retentionOf, series } from '../../src/core/benchmark/progress.ts'
import { wordPool } from '../../src/core/content/words.ts'
import { namePool } from '../../src/core/content/names.ts'

describe('der Quarantäne-Vorrat (F2a)', () => {
  it('überschneidet sich mit keinem Trainingsinhalt', () => {
    /*
     * Die Eigenschaft, an der alles hängt. Zöge der Benchmark aus demselben
     * Vorrat wie das Training, misst er geübte Wörter — die Zahl stiege, und
     * sie hieße nichts. Deshalb ist das hier geprüft und nicht bloß beim
     * Schreiben beachtet.
     */
    for (const language of ['de', 'en', 'fr'] as const) {
      const quarantine = new Set(benchmarkPool(language))
      for (const word of wordPool(language)) expect(quarantine.has(word), word).toBe(false)
      for (const name of namePool(language)) expect(quarantine.has(name), name).toBe(false)
    }
  })

  it('enthält keine Wörter doppelt', () => {
    for (const language of ['de', 'en', 'fr'] as const) {
      const pool = benchmarkPool(language)
      expect(new Set(pool).size).toBe(pool.length)
    }
  })

  it('liefert jeder Messung dieselbe Anzahl', () => {
    // „Immer gleich aufgebaut“ (D-006): Eine kürzere Messung wäre ein anderer
    // Test, und zwei verschiedene Tests zu vergleichen ist kein Fortschritt.
    for (let ordinal = 1; ordinal <= 12; ordinal++) {
      expect(benchmarkItems(ordinal, 'de')).toHaveLength(BENCHMARK_ITEMS)
    }
  })

  it('hält aufeinanderfolgende Messungen überschneidungsfrei', () => {
    const first = new Set(benchmarkItems(1, 'de'))
    const second = benchmarkItems(2, 'de')
    for (const word of second) expect(first.has(word), word).toBe(false)
  })

  it('sagt, ab wann sich der Vorrat wiederholt', () => {
    /*
     * Die Grenze wird genannt und nicht bestritten: Ab dieser Messung
     * enthält der Benchmark Wörter, die schon einmal darin vorkamen, und die
     * Zahl wird dadurch etwas zu freundlich.
     */
    const cycles = poolCycles('de')
    expect(cycles).toBe(Math.floor(benchmarkPool('de').length / BENCHMARK_ITEMS) + 1)
    const before = new Set(benchmarkItems(1, 'de'))
    const after = benchmarkItems(cycles, 'de')
    expect(after.some((word) => before.has(word))).toBe(true)
  })
})

describe('der Ablauf einer Messung (F2)', () => {
  const base: BenchmarkRun = { ordinal: 1, day: '2026-08-17', total: BENCHMARK_ITEMS }
  const noon = 1_000_000_000

  it('beginnt beim Einprägen', () => {
    expect(nextStep(base, noon, '2026-08-17')).toEqual({ kind: 'encode' })
  })

  it('lässt vor dem Fenster warten', () => {
    const run = { ...base, encodedAt: noon, immediate: 14 }
    const step = nextStep(run, noon + 5 * 60_000, '2026-08-17')
    expect(step).toEqual({
      kind: 'waiting',
      phase: 'after20Minutes',
      readyAt: noon + AFTER_20_MIN_FROM,
    })
  })

  it('fragt im Fenster nach', () => {
    const run = { ...base, encodedAt: noon, immediate: 14 }
    expect(nextStep(run, noon + 20 * 60_000, '2026-08-17')).toEqual({
      kind: 'recall',
      phase: 'after20Minutes',
    })
  })

  it('erklärt das Fenster für verpasst, statt später zu messen', () => {
    /*
     * Eine Messung nach drei Stunden ist keine Messung „nach zwanzig
     * Minuten“. Sie trotzdem zu nehmen hieße, zwei verschiedene Dinge in
     * dieselbe Reihe zu schreiben.
     */
    const run = { ...base, encodedAt: noon, immediate: 14 }
    expect(nextStep(run, noon + AFTER_20_MIN_UNTIL + 1, '2026-08-17')).toEqual({
      kind: 'missed',
      phase: 'after20Minutes',
    })
  })

  it('wartet auf den Folgetag und verpasst ihn danach', () => {
    const run = { ...base, encodedAt: noon, immediate: 14, after20Minutes: 11 }
    expect(nextStep(run, noon, '2026-08-17').kind).toBe('waiting')
    expect(nextStep(run, noon, '2026-08-18')).toEqual({ kind: 'recall', phase: 'nextDay' })
    expect(nextStep(run, noon, '2026-08-19')).toEqual({ kind: 'missed', phase: 'nextDay' })
  })

  it('ist fertig, wenn alle drei Abrufe da sind', () => {
    const run = { ...base, encodedAt: noon, immediate: 14, after20Minutes: 11, nextDay: 9 }
    expect(nextStep(run, noon, '2026-08-18')).toEqual({ kind: 'done' })
    expect(isComplete(run)).toBe(true)
    expect(isComplete({ ...run, nextDay: undefined })).toBe(false)
  })

  it('setzt die nächste Messung vierzehn Tage später an', () => {
    expect(nextRunDue({ ...base, day: '2026-08-17', immediate: 14 })).toBe('2026-08-31')
    expect(nextRunDue(undefined)).toBeUndefined()
  })

  it('sperrt nichts, wenn nie eine Zahl entstanden ist', () => {
    /*
     * Abgebrochen im Einprägen: Es wurde nichts gemessen, also gibt es auch
     * nichts zu schützen. Jemanden vierzehn Tage warten zu lassen, weil das
     * Telefon geklingelt hat, wäre eine Strafe für nichts.
     */
    expect(nextRunDue({ ...base, day: '2026-08-17' })).toBe('2026-08-17')
  })

  it('hält den Abstand ein, sobald der erste Abruf dasteht', () => {
    /*
     * Der eigentliche Grund für die Unterscheidung: **Wer eine begonnene
     * Messung wiederholen kann, bis das Gefühl dabei stimmt, misst nicht mehr
     * sein Gedächtnis.** Ein abgebrochener Lauf mit Ergebnis wiegt deshalb so
     * schwer wie ein vollständiger — für den Abstand, nicht für die Reihe:
     * gezählt wird er nirgends (F1).
     */
    const aborted = { ...base, day: '2026-08-17', encodedAt: noon, immediate: 17 }
    expect(nextRunDue(aborted)).toBe('2026-08-31')
    expect(isComplete(aborted)).toBe(false)
  })
})

describe('aus Messungen wird eine Aussage (F2b, F3)', () => {
  const run = (ordinal: number, nextDay: number): BenchmarkRun => ({
    ordinal,
    day: `2026-08-${String(ordinal).padStart(2, '0')}`,
    encodedAt: 1,
    immediate: 18,
    after20Minutes: 14,
    nextDay,
    total: 20,
  })

  it('sagt vor der dritten Messung gar nichts', () => {
    /*
     * Die ersten beiden sind Eichung. Wer die erste als Tag 0 nimmt und am
     * Tag 14 feiert, feiert zum guten Teil die Gewöhnung ans Format.
     */
    expect(progressOf([]).kind).toBe('calibrating')
    expect(progressOf([run(1, 8)]).kind).toBe('calibrating')
    const two = progressOf([run(1, 8), run(2, 9)])
    expect(two).toEqual({ kind: 'calibrating', complete: 2, needed: CALIBRATION_RUNS + 1 })
  })

  it('lässt unvollständige Messungen draußen', () => {
    // Einen fehlenden Abruf zu schätzen wäre eine erfundene Zahl — und die
    // ist schlimmer als gar keine (R-1).
    const broken = { ...run(3, 0), nextDay: undefined }
    expect(progressOf([run(1, 8), run(2, 9), broken]).kind).toBe('calibrating')
    expect(series([run(1, 8), broken])).toHaveLength(1)
  })

  it('vergleicht gegen die Eichung, nicht gegen die letzte Messung', () => {
    const progress = progressOf([run(1, 8), run(2, 8), run(3, 16)])
    expect(progress.kind).toBe('measured')
    if (progress.kind !== 'measured') return
    expect(progress.baseline).toBeCloseTo(0.4, 5)
    expect(progress.latest).toBeCloseTo(0.8, 5)
    expect(progress.points).toBe(40)
  })

  it('nennt eine Spanne und keinen exakten Wert', () => {
    const progress = progressOf([run(1, 8), run(2, 8), run(3, 16)])
    if (progress.kind !== 'measured') throw new Error('erwartet: gemessen')
    expect(progress.low).toBeLessThan(progress.points)
    expect(progress.high).toBeGreaterThan(progress.points)
  })

  it('sagt „kein Unterschied“, wenn die Spanne die Null enthält', () => {
    /*
     * Der eigentliche Prüfstein. Ein Wort mehr von zwanzig sind fünf
     * Prozentpunkte — bei dieser Stichprobe reines Rauschen. Wer daraus
     * „+5 %“ macht, verkauft Zufall als Erfolg.
     */
    const progress = progressOf([run(1, 10), run(2, 10), run(3, 11)])
    if (progress.kind !== 'measured') throw new Error('erwartet: gemessen')
    expect(progress.points).toBe(5)
    expect(progress.distinguishable).toBe(false)
    expect(progress.low).toBeLessThan(0)
  })

  it('erkennt einen deutlichen Unterschied als solchen', () => {
    const progress = progressOf([run(1, 4), run(2, 4), run(3, 18)])
    if (progress.kind !== 'measured') throw new Error('erwartet: gemessen')
    expect(progress.distinguishable).toBe(true)
    expect(progress.low).toBeGreaterThan(0)
  })

  it('nennt auch eine Verschlechterung beim Namen', () => {
    // Eine App, die nur nach oben misst, misst nicht.
    const progress = progressOf([run(1, 18), run(2, 18), run(3, 4)])
    if (progress.kind !== 'measured') throw new Error('erwartet: gemessen')
    expect(progress.points).toBeLessThan(0)
    expect(progress.distinguishable).toBe(true)
  })

  it('misst das Behalten am Folgetag, nicht den Sofortabruf', () => {
    // Wer zwanzig Wörter unmittelbar nachsprechen kann, hat sie noch im
    // Arbeitsgedächtnis und nicht unbedingt behalten.
    expect(retentionOf(run(1, 10))).toBeCloseTo(0.5, 5)
  })

  it('gibt die Reihe der echten Zahlen zurück (F5)', () => {
    const list = series([run(3, 15), run(1, 8), run(2, 9)])
    expect(list.map((entry) => entry.ordinal)).toEqual([1, 2, 3])
    expect(list.map((entry) => entry.nextDay)).toEqual([8, 9, 15])
  })
})
