/**
 * Die Datenbank auf dem Gerät.
 *
 * ══════════════════════════════════════════════════════════════════════════
 *  REGEL — Version 1 wird nie mehr angefasst.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Ein Schema wächst nur nach vorn: `db.version(2).stores({...}).upgrade(...)`.
 * Wer stattdessen Version 1 bearbeitet, bricht die Datenbank auf jedem Gerät,
 * das die alte Fassung schon angelegt hat — und zwar stumm, erst beim nächsten
 * Start des Nutzers.
 *
 * Das wiegt hier schwerer als in den meisten Apps: Trainingshistorie ist nicht
 * wiederherstellbar. Ein verlorenes Dokument kann man neu importieren, eine
 * verlorene Vergessenskurve (D-004) nicht — sie ist das Ergebnis von Wochen.
 *
 * Beispiel für später:
 *
 *     db.version(2)
 *       .stores({ items: 'id, kind, language, dueAt' })   // dueAt neu
 *       .upgrade(async (tx) => {
 *         await tx.table('items').toCollection().modify((item) => {
 *           item.dueAt ??= item.createdAt
 *         })
 *       })
 *
 * Zu den Tabellen: Der Zeichenkettenausdruck nennt nur den Primärschlüssel und
 * die Indizes, nicht alle Felder. Die Form der Datensätze steht in den Typen
 * unten.
 */

import Dexie, { type EntityTable } from 'dexie'

import type { DayKey, Instant } from '../core/index.ts'

/** Einstellungen, Schlüssel-Wert. Klein, selten, ohne eigenes Schema. */
export interface SettingRow {
  key: string
  value: unknown
}

/**
 * Eine Trainingseinheit. Wird beim Start angelegt und danach fortgeschrieben —
 * nicht erst am Ende gespeichert (Backlog B5: die Session muss einen Anruf,
 * einen App-Wechsel und einen Absturz überleben).
 */
export interface SessionRow {
  id: string
  /** Der Trainingstag, dem sie zugerechnet wird — Tagesgrenze 4 Uhr, D-008. */
  day: DayKey
  mode: string
  startedAt: Instant
  endedAt?: Instant
  /** Erst gesetzt, wenn die Einheit wirklich zu Ende gelaufen ist. */
  completed: boolean
}

/**
 * Jede einzelne Antwort. Nur anhängen, nie ändern.
 *
 * Das ist die Rohdatenbasis für alles, was ANITEW später über den Nutzer
 * behauptet: Vergessenskurve (D-004), Gedächtnisprofil, Benchmark (D-006).
 * Aggregierte Werte lassen sich daraus jederzeit neu berechnen; aus
 * aggregierten Werten lassen sich die Rohdaten nie zurückgewinnen. Deshalb
 * liegt hier das Ausführliche und anderswo das Abgeleitete.
 */
export interface EventRow {
  id?: number
  sessionId: string
  at: Instant
  /** Woran gearbeitet wurde — Modul und Item. */
  moduleId: string
  itemId?: string
  kind: 'shown' | 'answered' | 'skipped' | 'timeout'
  correct?: boolean
  /** Antwortzeit in Millisekunden, gemessen mit der monotonen Uhr. */
  latencyMs?: number
}

/**
 * Der Zustand einer einzelnen Information im Wiederholungsplan.
 * Die Felder für FSRS (D-004) kommen mit Meilenstein M2 und einer Migration
 * dazu — hier steht bewusst nur, was M1 wirklich braucht.
 */
export interface ItemStateRow {
  itemId: string
  moduleId: string
  language: string
  createdAt: Instant
  lastSeenAt?: Instant
  dueDay?: DayKey
  reviews: number
  lapses: number
}

/**
 * Ein Benchmark-Durchgang (D-006).
 *
 * Absichtlich eine eigene Tabelle und nicht ein Sonderfall von `sessions`:
 * Trainingsscore und gemessene Gedächtnisleistung dürfen nirgends zusammen-
 * laufen — auch nicht in der Datenbank, wo eine spätere Auswertung sie aus
 * Versehen vermischen könnte. Das ist Regel R-1, bis in das Schema gezogen.
 */
export interface BenchmarkRow {
  id: string
  day: DayKey
  startedAt: Instant
  /** Fortlaufende Nummer. Die ersten beiden gelten als Eichung (D-006). */
  ordinal: number
  /** Anteil richtig erinnerter Items, je Abstand. Leer, solange offen. */
  immediate?: number
  after20Minutes?: number
  nextDay?: number
  completed: boolean
}

export class AnitewDatabase extends Dexie {
  settings!: EntityTable<SettingRow, 'key'>
  sessions!: EntityTable<SessionRow, 'id'>
  events!: EntityTable<EventRow, 'id'>
  itemStates!: EntityTable<ItemStateRow, 'itemId'>
  benchmarks!: EntityTable<BenchmarkRow, 'id'>

  constructor(name = 'anitew') {
    super(name)

    // ─── Version 1 · 2026-08-17 · M0 ───────────────────────────────────────
    // NICHT BEARBEITEN. Änderungen kommen als version(2) darüber.
    this.version(1).stores({
      settings: 'key',
      sessions: 'id, day, startedAt, completed',
      events: '++id, sessionId, at, itemId, moduleId',
      itemStates: 'itemId, moduleId, language, dueDay',
      benchmarks: 'id, day, ordinal, completed',
    })
  }
}

export const db = new AnitewDatabase()
