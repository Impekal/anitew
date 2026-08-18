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
  /**
   * Das Trainingsmodul der Antwort (z. B. `reverse`).
   *
   * Nachträglich dazugekommen (D-026): `moduleId` trägt bei Antworten
   * historisch die Blockart (`recall`/`review`), nicht das Modul — das zu
   * ändern hieße, alte Zeilen umzudeuten. Ein neues Feld statt einer neuen
   * Bedeutung; alte Zeilen haben es nicht und fallen bei modulbezogenen
   * Zählungen ehrlich heraus. Kein Index nötig, also keine neue
   * Schemaversion.
   */
  module?: string
  correct?: boolean
  /** Antwortzeit in Millisekunden, gemessen mit der monotonen Uhr. */
  latencyMs?: number
}

/**
 * Der Zustand einer einzelnen Information im Wiederholungsplan.
 *
 * Seit Version 2 stehen hier die FSRS-Werte (D-004): **Stabilität** (wie fest
 * die Information sitzt) und **Schwierigkeit** (wie schwer sie diesem Nutzer
 * fällt). Aus beiden folgt `dueDay` — der Tag, an dem die
 * Erinnerungswahrscheinlichkeit auf die Zielmarke fällt.
 *
 * Der Primärschlüssel ist `itemId` und der ist das Wort selbst, ergänzt um
 * Modul und Sprache (`recall:de:Anker`). Damit ist dieselbe Information in
 * zwei Sprachen zweimal vorhanden — und das ist richtig so: „Anker“ und
 * „anchor“ sind zwei Gedächtnisinhalte, nicht einer.
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
  /** Ab Version 2. Wie fest die Information sitzt, in Tagen. */
  stability?: number
  /** Ab Version 2. Wie schwer sie fällt, 1 bis 10. */
  difficulty?: number
  /** Ab Version 2. FSRS-eigener Zustand, damit exakt weitergerechnet wird. */
  fsrsState?: number
  /** Ab Version 2. Der Tag der letzten Abfrage. */
  lastDay?: DayKey
}

/**
 * Ein Benchmark-Durchgang (D-006).
 *
 * Absichtlich eine eigene Tabelle und nicht ein Sonderfall von `sessions`:
 * Trainingsscore und gemessene Gedächtnisleistung dürfen nirgends zusammen-
 * laufen — auch nicht in der Datenbank, wo eine spätere Auswertung sie aus
 * Versehen vermischen könnte. Das ist Regel R-1, bis in das Schema gezogen.
 */
/*
 * Nachtrag 2026-08-17 (M3): Die Felder haben sich geändert — aus Anteilen
 * wurden Anzahlen, dazu kamen `total`, `items` und `encodedAt`.
 *
 * Das verstößt **nicht** gegen die Regel oben: Geändert hat sich die Form der
 * Datensätze, nicht das Schema. Der Zeichenkettenausdruck in `version(1)` und
 * `version(2)` nennt nur Primärschlüssel und Indizes, und keiner davon ist
 * betroffen. Und diese Tabelle hat bis heute keine einzige Zeile gesehen —
 * es gab noch keinen Benchmark, der hätte schreiben können.
 */
export interface BenchmarkRow {
  id: string
  day: DayKey
  startedAt: Instant
  /** Fortlaufende Nummer. Die ersten beiden gelten als Eichung (D-006). */
  ordinal: number
  /** Wie viele Wörter gefragt waren. Immer gleich — aber mitgeschrieben. */
  total: number
  /** Die Wörter dieser Messung, damit der Abruf sie nach Tagen noch kennt. */
  items: string[]
  /** Wann das Einprägen endete — daran hängen die beiden Zeitfenster. */
  encodedAt?: Instant
  /**
   * **Anzahl** richtig erinnerter Wörter je Abstand, nicht ihr Anteil. Leer,
   * solange der Abruf noch aussteht.
   *
   * Die Anzahl und nicht der Anteil, weil F5 genau das zeigen soll — „Tag 1:
   * 8/20“ — und weil sich aus der Anzahl der Anteil ergibt, aus dem Anteil
   * die Anzahl aber nur mit Rundungsfehlern.
   */
  immediate?: number
  after20Minutes?: number
  nextDay?: number
  completed: boolean
  /**
   * Abgebrochen, weil ein Zeitfenster verpasst wurde.
   *
   * Ein eigenes Feld und nicht `completed: true`: Die Messung ist **beendet**,
   * aber sie ist nicht **gültig**. Beides in einen Wahrheitswert zu falten
   * hieße, eine unvollständige Messung als vollständig zu führen — genau die
   * Verwechslung, die F1 ausschließt.
   */
  abandoned?: boolean
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

    // ─── Version 2 · 2026-08-17 · M2 ───────────────────────────────────────
    // Die FSRS-Werte kommen dazu (D-004). Der Schemastring bleibt gleich: Die
    // neuen Felder werden nicht indiziert, weil nie nach ihnen gesucht wird —
    // gesucht wird nach `dueDay`, und der steht schon in Version 1.
    //
    // Kein `upgrade`-Block. Die neuen Felder sind optional, und ein fehlender
    // Wert bedeutet genau das Richtige: „diese Information hat noch keine
    // Historie“. Sie erhält beim nächsten Kontakt ihren ersten Termin, so wie
    // jede neue auch. Alte Zeilen mit Nullen zu füllen wäre schlimmer —
    // Stabilität 0 ist eine Behauptung, `undefined` ist die Wahrheit.
    this.version(2).stores({
      settings: 'key',
      sessions: 'id, day, startedAt, completed',
      events: '++id, sessionId, at, itemId, moduleId',
      itemStates: 'itemId, moduleId, language, dueDay',
      benchmarks: 'id, day, ordinal, completed',
    })
  }
}

export const db = new AnitewDatabase()
