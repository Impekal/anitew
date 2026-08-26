/**
 * Messungen auf dem Gerät (Backlog F1, F2).
 *
 * Eigene Tabelle, eigener Weg: Trainingsscore und gemessene
 * Gedächtnisleistung laufen nirgends zusammen — auch nicht hier. Was in
 * dieser Datei geschrieben wird, geht **nie** durch `recordOutcome`, und die
 * Wörter einer Messung bekommen deshalb auch keinen Wiederholungstermin
 * (F2a). Genau das ist der Unterschied zwischen einer Messung und einer
 * Übung, die sich selbst misst.
 */

import {
  type BenchmarkPhase,
  type BenchmarkRun,
  type BenchmarkStartRefusal,
  BENCHMARK_ITEMS,
  benchmarkItems,
  benchmarkStartRefusal,
  type DayKey,
  type Instant,
  type Language,
} from '../core/index.ts'

import { db } from './db.ts'

/** Alle Messungen, älteste zuerst. */
export async function loadRuns(): Promise<BenchmarkRun[]> {
  const rows = await db.benchmarks.toArray().catch(() => [])
  return rows
    .sort((a, b) => a.ordinal - b.ordinal)
    .map((row) => ({
      ordinal: row.ordinal,
      day: row.day,
      encodedAt: row.encodedAt,
      immediate: row.immediate,
      after20Minutes: row.after20Minutes,
      nextDay: row.nextDay,
      total: row.total ?? BENCHMARK_ITEMS,
    }))
}

/** Die Wörter der laufenden Messung — sie müssen den Folgetag überleben. */
export async function loadOpenRun(): Promise<
  { run: BenchmarkRun; items: readonly string[]; id: string } | undefined
> {
  const rows = await db.benchmarks.toArray().catch(() => [])
  const open = rows
    .filter((row) => !row.completed && row.abandoned !== true)
    .sort((a, b) => b.ordinal - a.ordinal)[0]
  if (open === undefined) return undefined
  return {
    id: open.id,
    items: open.items ?? [],
    run: {
      ordinal: open.ordinal,
      day: open.day,
      encodedAt: open.encodedAt,
      immediate: open.immediate,
      after20Minutes: open.after20Minutes,
      nextDay: open.nextDay,
      total: open.total ?? BENCHMARK_ITEMS,
    },
  }
}

export type BeginRunResult =
  | { ok: true; id: string; ordinal: number; items: readonly string[] }
  | { ok: false; reason: BenchmarkStartRefusal }

/**
 * Legt eine Messung an — oder lehnt begründet ab (R3-04, Runde 3).
 *
 * Lesen und Schreiben liegen in **einer** Transaktion, und die Startregel
 * wird darin geprüft. Vorher genügte ein schneller Doppeltipp: Beide Aufrufe
 * lasen dieselbe höchste Nummer, beide schrieben — es entstanden zwei offene
 * Messungen mit derselben Ordnungszahl. Und der feste Abstand von vierzehn
 * Tagen hing allein daran, ob die Oberfläche einen Knopf zeigte.
 */
export async function beginRun(
  day: DayKey,
  at: Instant,
  language: Language,
): Promise<BeginRunResult> {
  return db.transaction('rw', db.benchmarks, async () => {
    const rows = await db.benchmarks.toArray()
    const refusal = benchmarkStartRefusal(
      rows.map((row) => ({
        ordinal: row.ordinal,
        day: row.day,
        completed: row.completed,
        abandoned: row.abandoned,
        immediate: row.immediate,
      })),
      day,
    )
    if (refusal !== undefined) return { ok: false, reason: refusal } as const

    const ordinal = rows.reduce((highest, row) => Math.max(highest, row.ordinal), 0) + 1
    const items = [...benchmarkItems(ordinal, language)]
    const id = `b-${ordinal}-${at.toString(36)}`
    await db.benchmarks.put({
      id,
      day,
      startedAt: at,
      ordinal,
      total: items.length,
      items,
      completed: false,
    })
    return { ok: true, id, ordinal, items } as const
  })
}

/**
 * Schreibt das Ergebnis eines Abrufs.
 *
 * `completed` wird erst mit dem letzten der drei gesetzt. Eine Messung, bei
 * der ein Abruf ausgefallen ist, bleibt für immer unvollständig — und geht
 * damit in keinen Vergleich ein (F1). Nachtragen wäre eine erfundene Zahl.
 */
export async function recordPhase(
  id: string,
  phase: BenchmarkPhase,
  correct: number,
  at: Instant,
): Promise<void> {
  const row = await db.benchmarks.get(id)
  if (row === undefined) return
  const next = { ...row, [phase]: correct }
  if (phase === 'immediate') next.encodedAt = at
  next.completed =
    next.immediate !== undefined &&
    next.after20Minutes !== undefined &&
    next.nextDay !== undefined
  await db.benchmarks.put(next)
}

/**
 * Beendet eine Messung, deren Fenster verpasst wurde.
 *
 * `completed` bleibt **falsch** — die Messung ist beendet, aber nicht gültig,
 * und sie geht in keinen Vergleich ein. Die Zeile bleibt trotzdem stehen:
 * Sie ist der Beleg dafür, dass an diesem Tag gemessen werden sollte und
 * warum daraus nichts wurde.
 */
export async function abandonRun(id: string): Promise<void> {
  const row = await db.benchmarks.get(id)
  if (row === undefined) return
  await db.benchmarks.put({ ...row, abandoned: true, items: [] })
}
