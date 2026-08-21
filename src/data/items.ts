/**
 * Der Wiederholungsplan auf dem Gerät (Backlog C1, D8).
 *
 * Bindeglied zwischen dem Scheduler im Kern — der nur rechnet und nichts
 * speichert — und der Datenbank. Eine Zeile je Information, geschlüsselt nach
 * Modul, Sprache und Wort.
 */

import {
  type DayKey,
  type DimensionCounts,
  type DimensionId,
  dimensionOf,
  DIMENSIONS,
  type DueItem,
  type Instant,
  isImmediate,
  type Memory,
  moduleForDimension,
  type ModuleId,
  newMemory,
  review,
} from '../core/index.ts'
import { type ItemStateRow, db } from './db.ts'
import { refreshSchedulerPersonalization } from './schedulerPersonalization.ts'
import { loadOptimizedSchedulerWeights } from './schedulerWeights.ts'

/** Das Modul, zu dem die Wortlisten gehören. */
export const WORD_MODULE = 'words'

/**
 * Die Kennung einer Information.
 *
 * Sprache gehört hinein, und das ist keine Formalie: „Anker“ und „anchor“
 * sind zwei Gedächtnisinhalte, nicht zwei Schreibweisen von einem. Wer beides
 * lernt, soll für beides seinen eigenen Termin bekommen.
 */
export function itemIdOf(moduleId: string, language: string, word: string): string {
  return `${moduleId}:${language}:${word}`
}

/** Das Modul aus einer Kennung lesen. */
export function moduleOf(itemId: string): string {
  return itemId.split(':')[0] ?? ''
}

/** Das Wort aus einer Kennung zurückholen. */
export function wordOf(itemId: string): string {
  return itemId.split(':').slice(2).join(':')
}

/** Alle Informationen dieser Sprache, die einen Termin haben. */
export async function loadDue(language: string): Promise<DueItem[]> {
  const rows = await db.itemStates.where('language').equals(language).toArray()
  return rows.filter(hasMemory).map((row) => ({ itemId: row.itemId, memory: toMemory(row) }))
}

/**
 * Ein Ergebnis verbuchen: für jedes Wort den nächsten Termin berechnen und
 * schreiben.
 *
 * In **einer** Transaktion. Eine halb geschriebene Runde wäre schlimmer als
 * eine gar nicht geschriebene: Dann hätte die Hälfte der Wörter einen neuen
 * Termin und die andere den alten, und niemand könnte das später auseinander-
 * halten.
 */
export async function recordOutcome(
  moduleId: string,
  language: string,
  day: DayKey,
  at: Instant,
  outcome: { recalled: readonly string[]; missed: readonly string[] },
): Promise<void> {
  const entries = [
    ...outcome.recalled.map((word) => ({ word, recalled: true })),
    ...outcome.missed.map((word) => ({ word, recalled: false })),
  ]
  if (entries.length === 0) return

  // C10: Nur bereits validierte, lokal persistierte Gewichte dürfen einen
  // Termin beeinflussen. Ein fehlender/kaputter Wert fällt in der Ladeschicht
  // auf `undefined` zurück und lässt damit exakt den bisherigen Scheduler laufen.
  const weights = await loadOptimizedSchedulerWeights()

  await db.transaction('rw', db.itemStates, async () => {
    for (const entry of entries) {
      const itemId = itemIdOf(moduleId, language, entry.word)
      const existing = await db.itemStates.get(itemId)
      const memory =
        existing !== undefined && hasMemory(existing)
          ? review(toMemory(existing), day, entry.recalled, weights)
          : newMemory(day, entry.recalled, weights)

      await db.itemStates.put({
        itemId,
        moduleId,
        language,
        createdAt: existing?.createdAt ?? at,
        lastSeenAt: at,
        reviews: memory.reviews,
        lapses: memory.lapses,
        stability: memory.stability,
        difficulty: memory.difficulty,
        fsrsState: memory.state,
        dueDay: memory.dueDay,
        ...(memory.lastDay === undefined ? {} : { lastDay: memory.lastDay }),
      })
    }
  })

  // Optimization is best-effort and cadence-gated. The answer above is always
  // scheduled first; newly learned weights can only affect later scheduling.
  void refreshSchedulerPersonalization()
}

/**
 * Was für die Wiedersehen-Rechnung gebraucht wird (K1).
 *
 * Nur die Zahl der Abfragen je Information — mehr nicht. Die Rechnung selbst
 * steht im Kern und läuft ohne Browser (D-010).
 */
export async function loadReviewed(language: string): Promise<{ reviews: number }[]> {
  const rows = await db.itemStates.where('language').equals(language).toArray()
  return rows.map((row) => ({ reviews: row.reviews }))
}

/**
 * Die Zahlen des Gedächtnisprofils, je Achse (Backlog E3).
 *
 * Beides kommt exakt aus den Terminen: `reviews - 1` ist, wie oft eine
 * Information **nach ihrem ersten Tag** zurückkam, `lapses` ist, wie oft sie
 * dabei weg war. Ein Fehlschlag am Lerntag zählt bei keinem von beiden mit —
 * FSRS führt einen Rückfall erst, wenn eine Information den Lernzustand
 * verlassen hat. Damit ist `lapses` nie größer als die Gelegenheiten, und
 * der Anteil bleibt eine echte Quote.
 */
export async function loadDimensionCounts(
  language: string,
): Promise<Partial<Record<DimensionId, DimensionCounts>>> {
  const rows = await db.itemStates.where('language').equals(language).toArray()
  const counts: Partial<Record<DimensionId, DimensionCounts>> = {}

  for (const row of rows) {
    // Persönliche Memory-Kanten und prozedurale Missionen üben beide
    // Bindungen. Die Profilachse vereint ihre echten Wiedersehen, ohne die
    // Scheduler- oder Modulidentität zu vermischen.
    const dimension = row.moduleId === 'memory' ? 'binding' : dimensionOf(row.moduleId as ModuleId)
    if (dimension === undefined || isImmediate(dimension)) continue
    const entry = (counts[dimension] ??= { chances: 0, lost: 0 })
    entry.chances += Math.max(0, row.reviews - 1)
    entry.lost += row.lapses
  }

  /*
   * Die Sofort-Achsen (D-026) zählen aus dem Ereignisprotokoll: eine
   * Gelegenheit je Antwort, verloren je falscher. Absichtlich **ohne**
   * Sprachfilter — Ziffern sind in jeder Trainingssprache dieselbe Übung,
   * und das Protokoll kennt ohnehin keine Sprache. Alte Zeilen ohne
   * `module`-Feld fallen heraus; sie stammen aus einer Zeit, in der es
   * diese Module nicht gab.
   */
  for (const dimension of DIMENSIONS) {
    if (!isImmediate(dimension)) continue
    const moduleId = moduleForDimension(dimension)
    const answered = await db.events
      .filter((event) => event.kind === 'answered' && event.module === moduleId)
      .toArray()
    if (answered.length === 0) continue
    counts[dimension] = {
      chances: answered.length,
      lost: answered.filter((event) => event.correct === false).length,
    }
  }

  return counts
}

/**
 * Alle schon terminierten Kennungen eines Moduls (D-027).
 *
 * Gebraucht von den Zwillingen: Deren Vorrat ist endlich, und ein Paar,
 * das schon einen Termin hat, darf nie wieder als „neu“ kommen — sonst
 * hätte dieselbe Unterscheidung zwei Termine mit womöglich gegensätzlichen
 * Antworten.
 */
export async function loadTrackedWords(moduleId: string, language: string): Promise<string[]> {
  const rows = await db.itemStates.where('language').equals(language).toArray()
  return rows.filter((row) => row.moduleId === moduleId).map((row) => wordOf(row.itemId))
}

/**
 * Die letzten Antworten eines Moduls, älteste zuerst — nur richtig/falsch.
 *
 * Futter für die adaptive Schwierigkeit (D2): gerechnet, nie gespeichert.
 * Nur Zeilen mit `module`-Feld zählen (das gibt es seit D-026); ältere
 * kennen ihr Modul nicht und fallen ehrlich heraus.
 */
export async function loadRecentOutcomes(moduleId: string, limit: number): Promise<boolean[]> {
  const rows = await db.events
    .filter((event) => event.kind === 'answered' && event.module === moduleId)
    .toArray()
  return rows
    .sort((a, b) => a.at - b.at)
    .slice(-limit)
    .map((row) => row.correct === true)
}

/** Wie viele Informationen warten insgesamt auf ihren nächsten Termin? */
export async function countTracked(language: string): Promise<number> {
  return db.itemStates.where('language').equals(language).count()
}

function hasMemory(
  row: ItemStateRow,
): row is ItemStateRow & { stability: number; difficulty: number; dueDay: DayKey } {
  return row.stability !== undefined && row.difficulty !== undefined && row.dueDay !== undefined
}

function toMemory(row: ItemStateRow & { stability: number; difficulty: number }): Memory {
  return {
    stability: row.stability,
    difficulty: row.difficulty,
    reviews: row.reviews,
    lapses: row.lapses,
    state: row.fsrsState ?? 0,
    ...(row.lastDay === undefined ? {} : { lastDay: row.lastDay }),
    dueDay: row.dueDay ?? '1970-01-01',
  }
}
