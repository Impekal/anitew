/**
 * Sicherung und Wiederherstellung als Datei (Backlog N2, N6).
 *
 * Ohne Server ist die Datei der **einzige** Weg, Fortschritt nicht zu
 * verlieren — und der Anlass war kein theoretischer: Ein gelöschter
 * Browserspeicher hat die Trainingshistorie mitgenommen. Was hier hängt, ist
 * nicht wiederherstellbar. Ein verlorenes Dokument kann man neu laden, eine
 * verlorene Vergessenskurve (D-004) nicht — sie ist das Ergebnis von Wochen.
 *
 * ── Warum das Dateiformat **nicht** das Datenbankschema ist ────────────────
 *
 * Die Zeilenformen hier sehen denen in `data/db.ts` heute zum Verwechseln
 * ähnlich, und sie stehen trotzdem doppelt da. Das ist Absicht: Die Datei hat
 * eine eigene Fassungsnummer (`BACKUP_VERSION`), die Datenbank hat ihre
 * (`db.version(n)`), und sie dürfen sich unabhängig bewegen. Würde das Format
 * einfach die Tabellen spiegeln, änderte eine Schemamigration stillschweigend
 * das Format — und eine Datei von gestern wäre morgen unlesbar, ohne dass
 * jemand eine Entscheidung getroffen hätte.
 *
 * Der Preis ist eine Abbildung in `data/backup.ts`, heute noch eine
 * Eins-zu-eins-Zuordnung. Der Gegenwert ist, dass jede Änderung am Format
 * bewusst passieren muss.
 *
 * ── Zusammenführen statt Überschreiben ────────────────────────────────────
 *
 * Eine Sicherung einzulesen darf vorhandene Historie nie löschen (N9).
 * Trainingsgeschichte ist additiv: Zwei Geräte, die eine Woche getrennt
 * liefen, haben beide recht. Die Regeln dafür stehen unten und sind alle in
 * Node prüfbar (D-010) — hier entscheidet sich, ob jemand seine Wochen
 * behält, das gehört nicht in eine Schaltfläche.
 */

export const BACKUP_FORMAT = 'anitew-backup'

/**
 * Fassung des Dateiformats.
 *
 * Eine **neuere** Datei wird abgelehnt statt halb gelesen: Wer die App auf
 * einem Gerät aktualisiert hat und auf einem zweiten noch die alte benutzt,
 * soll dort eine klare Ansage bekommen und nicht eine Sicherung, aus der die
 * Hälfte fehlt.
 */
export const BACKUP_VERSION = 1

export const BACKUP_TABLES = ['settings', 'sessions', 'events', 'itemStates', 'benchmarks'] as const
export type BackupTableName = (typeof BACKUP_TABLES)[number]

export interface BackupSetting {
  key: string
  value: unknown
}

export interface BackupSession {
  id: string
  day: string
  mode: string
  startedAt: number
  endedAt?: number
  completed: boolean
}

/**
 * Was einem Gegenstand widerfahren ist.
 *
 * Die Liste ist Teil des **Dateiformats** und nicht bloß eine Bequemlichkeit:
 * Ein Wert, den diese Fassung nicht kennt, darf nicht in die Datenbank — dort
 * stünde er dann für immer, und jede spätere Auswertung müsste raten, was er
 * bedeutet.
 */
export const BACKUP_EVENT_KINDS = ['shown', 'answered', 'skipped', 'timeout'] as const
export type BackupEventKind = (typeof BACKUP_EVENT_KINDS)[number]

export function isBackupEventKind(kind: unknown): kind is BackupEventKind {
  return typeof kind === 'string' && (BACKUP_EVENT_KINDS as readonly string[]).includes(kind)
}

export interface BackupEvent {
  sessionId: string
  at: number
  moduleId: string
  itemId?: string
  kind: BackupEventKind
  correct?: boolean
  latencyMs?: number
}

export interface BackupItemState {
  itemId: string
  moduleId: string
  language: string
  createdAt: number
  lastSeenAt?: number
  dueDay?: string
  reviews: number
  lapses: number
  stability?: number
  difficulty?: number
  fsrsState?: number
  lastDay?: string
}

export interface BackupBenchmark {
  id: string
  day: string
  startedAt: number
  ordinal: number
  /*
   * Diese drei kamen mit M3 dazu, und die Fassung des Formats bleibt
   * trotzdem bei 1.
   *
   * Erlaubt ist das, weil sie **optional** sind und weil es keine Datei
   * geben kann, die sie bräuchte: Vor M3 gab es keinen Benchmark, also auch
   * keine Zeile in dieser Tabelle. Eine ältere Datei bringt hier nichts mit,
   * und eine neuere liest die alte App weiterhin — sie kennt die Felder nur
   * nicht. Eine Fassungsnummer heraufzusetzen, ohne dass jemandem etwas
   * fehlt, machte alte Dateien grundlos unlesbar.
   */
  total?: number
  items?: string[]
  encodedAt?: number
  immediate?: number
  after20Minutes?: number
  nextDay?: number
  completed: boolean
  abandoned?: boolean
}

export interface BackupTables {
  settings: readonly BackupSetting[]
  sessions: readonly BackupSession[]
  events: readonly BackupEvent[]
  itemStates: readonly BackupItemState[]
  benchmarks: readonly BackupBenchmark[]
}

export interface BackupFile {
  format: typeof BACKUP_FORMAT
  version: number
  /** Wann die Sicherung geschrieben wurde. */
  createdAt: number
  /** Welche Fassung der App sie geschrieben hat — für die Fehlersuche. */
  app: string
  tables: BackupTables
}

export type BackupCounts = Readonly<Record<BackupTableName, number>>

/**
 * Warum eine Datei nicht gelesen werden konnte.
 *
 * Bewusst wenige, klar unterscheidbare Gründe: Jeder von ihnen verlangt vom
 * Nutzer etwas anderes, und „Import fehlgeschlagen“ verlangt gar nichts.
 */
export type BackupProblem =
  /** Kein JSON, oder kein Objekt. Vermutlich die falsche Datei. */
  | 'unreadable'
  /** JSON, aber keine ANITEW-Sicherung. */
  | 'foreign'
  /** Von einer neueren Fassung der App geschrieben. */
  | 'newer'

export type BackupReading =
  | {
      ok: true
      file: BackupFile
      counts: BackupCounts
      /**
       * Ereignisse, die ausgelassen wurden, weil ihre Art unbekannt ist.
       * Wird gezählt und nicht verschwiegen: Stilles Wegwerfen ist genau das,
       * wogegen diese ganze Datei gebaut ist.
       */
      dropped: number
    }
  | { ok: false; problem: BackupProblem; version?: number }

/*
 * ── Was eine Sicherung NIE enthalten darf (F-01, Runde 2) ─────────────────
 *
 * Die Sicherung ist zum Weitergeben gebaut: Sie liegt als Datei im
 * Downloadordner und — beim Drive-Abgleich — im Google Drive. BYOK-Schlüssel
 * und die Google-Identität dieses Geräts gehören dort nicht hinein; PRIVACY
 * §10 verspricht wörtlich, dass der API-Schlüssel auf dem Gerät bleibt.
 * Gerätezustand des Syncs (an/aus, Zeitstempel, Client-Kennung) ist keine
 * Vorliebe, sondern Zustand **dieses** Geräts — auf einem zweiten Gerät wäre
 * er schlicht falsch.
 *
 * Gefiltert wird an beiden Kanten: beim Schreiben (`makeBackup`) und beim
 * Lesen (`readBackup`) — Letzteres, damit ältere Dateien, die diese Werte
 * noch enthalten, sie nicht wieder einschleppen.
 */
const DEVICE_ONLY_SETTINGS = new Set([
  'coach.key', // der alte Anthropic-Schlüssel ohne Anbieter (D-031)
  'sync.account',
  'sync.accountName',
  'sync.on',
  'sync.lastAt',
  'sync.clientId',
])
const DEVICE_ONLY_PREFIXES = ['coach.key.'] as const

/** Darf diese Einstellung das Gerät in einer Sicherung verlassen? */
export function portableSetting(key: string): boolean {
  if (DEVICE_ONLY_SETTINGS.has(key)) return false
  return !DEVICE_ONLY_PREFIXES.some((prefix) => key.startsWith(prefix))
}

function portableSettings(settings: readonly BackupSetting[]): readonly BackupSetting[] {
  return settings.filter((setting) => portableSetting(setting.key))
}

/** Baut die Datei aus den Tabellen. */
export function makeBackup(tables: BackupTables, now: number, app: string): BackupFile {
  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    createdAt: now,
    app,
    tables: { ...tables, settings: portableSettings(tables.settings) },
  }
}

/**
 * Liest und prüft, was in einer Datei steht.
 *
 * Großzügig gegenüber Fehlendem, streng gegenüber Falschem: Eine Sicherung
 * ohne Benchmarks ist eine Sicherung ohne Benchmarks und kein Fehler — eine
 * Datei aus einem anderen Programm ist einer. Unbekannte Felder bleiben
 * unangetastet stehen; eine ältere App soll eine neuere Datei nicht dadurch
 * beschädigen, dass sie beim Zurückschreiben wegfallen (deshalb `newer`).
 */
export function readBackup(raw: unknown): BackupReading {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return { ok: false, problem: 'unreadable' }
  }
  const candidate = raw as Record<string, unknown>
  if (candidate['format'] !== BACKUP_FORMAT) return { ok: false, problem: 'foreign' }

  const version = typeof candidate['version'] === 'number' ? candidate['version'] : 0
  if (version > BACKUP_VERSION) return { ok: false, problem: 'newer', version }

  const source =
    typeof candidate['tables'] === 'object' && candidate['tables'] !== null
      ? (candidate['tables'] as Record<string, unknown>)
      : {}

  const rows = Object.fromEntries(
    BACKUP_TABLES.map((name) => [name, Array.isArray(source[name]) ? source[name] : []]),
  ) as unknown as BackupTables

  /*
   * Ereignisse mit unbekannter Art bleiben draußen. Sie in die Datenbank zu
   * schreiben hieße, dort einen Wert abzulegen, den keine Auswertung deuten
   * kann — und die Ereignistabelle ist die Rohdatenbasis für alles, was
   * ANITEW später über jemanden behauptet. Wie viele es waren, steht im
   * Bericht.
   */
  const events = rows.events.filter((event) => isBackupEventKind(event.kind))
  /*
   * Geräte-gebundene Einstellungen aus älteren Dateien bleiben draußen —
   * ein Schlüssel, der einmal fälschlich exportiert wurde, wandert sonst
   * beim Import auf jedes weitere Gerät (F-01, Runde 2).
   */
  const tables: BackupTables = { ...rows, events, settings: portableSettings(rows.settings) }

  return {
    ok: true,
    counts: countRecords(tables),
    dropped: rows.events.length - events.length,
    file: {
      format: BACKUP_FORMAT,
      version,
      createdAt: typeof candidate['createdAt'] === 'number' ? candidate['createdAt'] : 0,
      app: typeof candidate['app'] === 'string' ? candidate['app'] : 'unbekannt',
      tables,
    },
  }
}

/**
 * Der Fingerabdruck eines Ereignisses.
 *
 * Ereignisse haben in der Datenbank eine laufende Nummer, und die ist auf
 * jedem Gerät eine andere — sie taugt zum Erkennen von Doppelten also gerade
 * nicht. Was ein Ereignis eindeutig macht, ist, **wann** in **welcher
 * Einheit** an **welchem Gegenstand** was passiert ist. Zweimal dieselbe
 * Sicherung einzulesen muss folgenlos bleiben.
 */
export function eventKey(event: BackupEvent): string {
  return [event.sessionId, event.at, event.moduleId, event.itemId ?? '', event.kind].join(' ')
}

/**
 * Welcher der beiden Zustände einer Information bleibt?
 *
 * **Der mit der längeren Geschichte.** Die Zahl der Abfragen ist das ehrlichste
 * Maß dafür: Sie wächst nur, wenn wirklich geübt wurde. Bei Gleichstand
 * entscheidet die jüngere Begegnung.
 *
 * Ausdrücklich **nicht** entschieden wird nach dem Termin: Ein Gerät, das
 * lange nicht lief, hat lauter überfällige Termine — die sähen „dringender“
 * aus und würden die frischere Historie verdrängen.
 */
export function keepItemState(mine: BackupItemState, theirs: BackupItemState): BackupItemState {
  if (theirs.reviews !== mine.reviews) return theirs.reviews > mine.reviews ? theirs : mine
  return (theirs.lastSeenAt ?? 0) > (mine.lastSeenAt ?? 0) ? theirs : mine
}

/**
 * Welche Fassung einer Einheit bleibt?
 *
 * Eine abgeschlossene schlägt eine abgebrochene: Dieselbe Einheit kann auf
 * einem Gerät unterbrochen und auf einem anderen zu Ende geführt worden sein.
 */
export function keepSession(mine: BackupSession, theirs: BackupSession): BackupSession {
  if (mine.completed !== theirs.completed) return theirs.completed ? theirs : mine
  return (theirs.endedAt ?? 0) > (mine.endedAt ?? 0) ? theirs : mine
}

/** Wie viele Datensätze je Tabelle. */
export function countRecords(tables: BackupTables): BackupCounts {
  return Object.fromEntries(
    BACKUP_TABLES.map((name) => [name, tables[name].length]),
  ) as BackupCounts
}

/** Wie viele Datensätze eine Sicherung insgesamt enthält. */
export function totalRecords(counts: BackupCounts): number {
  return BACKUP_TABLES.reduce((sum, name) => sum + counts[name], 0)
}

/**
 * Der Dateiname einer Sicherung.
 *
 * Der Tag steht darin, weil im Downloadordner sonst „anitew (3).json“ liegt
 * und niemand weiß, welche davon die jüngere ist.
 */
export function backupFileName(day: string): string {
  return `anitew-sicherung-${day}.json`
}
