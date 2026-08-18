/**
 * Eine Trainingseinheit auf dem Gerät festhalten (Backlog B5/B9).
 *
 * Zwei getrennte Dinge werden hier geschrieben:
 *
 * **Das Ereignisprotokoll** (`events`) ist die Wahrheit. Nur anhängen, nie
 * ändern. Daraus lässt sich später jede Auswertung neu berechnen — die
 * Vergessenskurve (D-004), das Profil, der Benchmark (D-006). Aus einer
 * Zusammenfassung ließen sich die Rohdaten nie zurückgewinnen.
 *
 * **Der Fortschritt** (`activeSession` in den Einstellungen) ist Arbeitsstand
 * und wird überschrieben. Er existiert nur, damit ein Anruf, ein App-Wechsel
 * oder ein Absturz die Einheit nicht vernichtet. Geschrieben wird nach **jedem
 * Wort**, nicht am Ende des Blocks: Ein verlorener Block wäre bei einer
 * Fünf-Minuten-Einheit ein Drittel.
 */

import type { DayKey, Instant, RecallResult, SessionPlan } from '../core/index.ts'
import { type EventRow, db } from './db.ts'

const ACTIVE_KEY = 'activeSession'

export interface RoundResult {
  round: number
  /** `recall` = heute Gelerntes, `review` = Wiedersehen mit früheren Tagen. */
  kind: 'recall' | 'review'
  /**
   * Aus welchem Modul die Gegenstände stammen.
   *
   * Nötig geworden mit den Missionen: In der Zusammenfassung steht sonst
   * `Elena#room` statt „Elena · 314“ — eine Kennung ist kein Satz. Ältere
   * gespeicherte Einheiten haben das Feld nicht; dort bleibt es `undefined`
   * und die Anzeige nimmt den Gegenstand, wie er ist.
   */
  moduleId?: string
  correct: string[]
  missed: string[]
  extra: string[]
}

export interface SessionProgress {
  sessionId: string
  plan: SessionPlan
  /** Der Block, der gerade läuft. Gleich `plan.blocks.length`, wenn fertig. */
  blockIndex: number
  results: RoundResult[]
  startedAt: Instant
}

export async function beginSession(
  progress: SessionProgress,
  day: string,
  startedAt: Instant,
): Promise<void> {
  await db.sessions.put({
    id: progress.sessionId,
    day,
    mode: progress.plan.mode,
    startedAt,
    completed: false,
  })
  await saveProgress(progress)
}

export async function saveProgress(progress: SessionProgress): Promise<void> {
  await db.settings.put({ key: ACTIVE_KEY, value: progress })
}

export async function loadProgress(): Promise<SessionProgress | undefined> {
  const row = await db.settings.get(ACTIVE_KEY)
  return row?.value as SessionProgress | undefined
}

export async function clearProgress(): Promise<void> {
  await db.settings.delete(ACTIVE_KEY)
}

/** Ein Wort wurde gezeigt. */
export async function logShown(
  sessionId: string,
  at: Instant,
  itemId: string,
): Promise<void> {
  await append({ sessionId, at, moduleId: 'encode', itemId, kind: 'shown' })
}

/**
 * Das Ergebnis eines Abrufblocks — ein Ereignis je gesuchtem Wort.
 *
 * Absichtlich je Wort und nicht „6 von 8“: Später soll die Engine wissen, ob
 * *dieses* Wort saß, nicht nur wie viele. Ohne diese Auflösung gäbe es keine
 * Vergessenskurve pro Information.
 */
export async function logRecall(
  sessionId: string,
  at: Instant,
  result: RecallResult,
  blockDurationMs: number,
  moduleId = 'recall',
  module?: string,
): Promise<void> {
  const rows: EventRow[] = [
    ...result.correct.map((item) => ({
      sessionId,
      at,
      moduleId,
      ...(module === undefined ? {} : { module }),
      itemId: item,
      kind: 'answered' as const,
      correct: true,
      latencyMs: blockDurationMs,
    })),
    ...result.missed.map((item) => ({
      sessionId,
      at,
      moduleId,
      ...(module === undefined ? {} : { module }),
      itemId: item,
      kind: 'answered' as const,
      correct: false,
      latencyMs: blockDurationMs,
    })),
  ]
  await db.events.bulkAdd(rows)
}

export async function completeSession(sessionId: string, endedAt: Instant): Promise<void> {
  await db.sessions.update(sessionId, { endedAt, completed: true })
  await clearProgress()
}

/** Abgebrochen: Die Einheit bleibt als unvollständig stehen, statt zu verschwinden. */
export async function abandonSession(sessionId: string, endedAt: Instant): Promise<void> {
  await db.sessions.update(sessionId, { endedAt, completed: false })
  await clearProgress()
}

async function append(row: EventRow): Promise<void> {
  await db.events.add(row)
}

/**
 * Die Tage, an denen eine Einheit **zu Ende gelaufen** ist (Backlog K2).
 *
 * Abgebrochene Einheiten zählen nicht, und das ist keine Strenge, sondern
 * Ehrlichkeit: Ob jemand trainiert hat oder das Telefon in der Tasche lag,
 * kann die App nicht unterscheiden. Die kürzeste Einheit dauert 60 Sekunden —
 * genau das meint D-008 mit „ein Tag zählt ab 60 Sekunden“.
 */
export async function loadTrainingDays(): Promise<DayKey[]> {
  /*
   * Alle laden und hier filtern, nicht über den Index.
   *
   * `completed` ist ein Wahrheitswert, und Wahrheitswerte sind in IndexedDB
   * keine gültigen Schlüssel — eine Abfrage darüber fände nichts, und zwar
   * stillschweigend. Die Tabelle hat eine Zeile je Einheit; das sind nach
   * einem Jahr täglichen Trainings ein paar hundert.
   */
  const rows = await db.sessions.toArray().catch(() => [])
  return rows.filter((row) => row.completed).map((row) => row.day)
}
