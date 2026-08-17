/**
 * Sicherung schreiben und einlesen (Backlog N2, N6).
 *
 * Hier steht nur, was ein Gerät anfasst: aus der Datenbank lesen, in die
 * Datenbank schreiben. **Was** eine gültige Datei ist und **welche** von zwei
 * Fassungen einer Information gewinnt, entscheidet `core/backup.ts` — ohne
 * Browser und dort geprüft.
 */

import {
  type BackupCounts,
  type BackupFile,
  type BackupReading,
  type BackupTables,
  eventKey,
  keepItemState,
  keepSession,
  makeBackup,
  readBackup,
} from '../core/index.ts'

import { db } from './db.ts'

/** Liest die ganze Datenbank in eine Datei ein. */
export async function exportBackup(now: number, app: string): Promise<BackupFile> {
  const [settings, sessions, events, itemStates, benchmarks] = await Promise.all([
    db.settings.toArray(),
    db.sessions.toArray(),
    db.events.toArray(),
    db.itemStates.toArray(),
    db.benchmarks.toArray(),
  ])

  /*
   * Die laufende Nummer der Ereignisse fällt weg.
   *
   * Sie gilt nur in *dieser* Datenbank. Sie mitzunehmen hieße, sie auf dem
   * Zielgerät entweder zu erzwingen — und dort fremde Ereignisse zu
   * überschreiben — oder sie zu ignorieren und trotzdem mitzuschleppen.
   */
  const tables: BackupTables = {
    settings,
    sessions,
    events: events.map(({ id: _id, ...rest }) => rest),
    itemStates,
    benchmarks,
  }

  return makeBackup(tables, now, app)
}

/** Was beim Einlesen tatsächlich passiert ist. */
export interface ImportReport {
  added: BackupCounts
  /** Datensätze, die schon da waren und deren Fassung gewonnen hat. */
  kept: number
  /** Vorhandene Datensätze, die durch die reichere Fassung ersetzt wurden. */
  replaced: number
}

/**
 * Führt eine Sicherung mit dem zusammen, was schon auf dem Gerät liegt.
 *
 * Nie löschen, nie überschreiben ohne Grund (N9): Zwei Geräte, die eine Woche
 * getrennt liefen, haben beide recht. Alles läuft in **einer** Transaktion —
 * eine halb eingelesene Sicherung wäre schlimmer als gar keine.
 */
export async function importBackup(file: BackupFile): Promise<ImportReport> {
  const added: Record<string, number> = {
    settings: 0,
    sessions: 0,
    events: 0,
    itemStates: 0,
    benchmarks: 0,
  }
  let kept = 0
  let replaced = 0

  await db.transaction(
    'rw',
    [db.settings, db.sessions, db.events, db.itemStates, db.benchmarks],
    async () => {
      /*
       * Einstellungen sind Vorlieben, keine Geschichte: Was in der Sicherung
       * steht, ist das, was zuletzt gewählt wurde, und das gewinnt.
       *
       * Gezählt wird trotzdem genau. Vorher galt jede Einstellung als „neu
       * dazu“, weil sie ohnehin geschrieben wurde — und dieselbe Datei zweimal
       * einzulesen meldete dann zwei neue Datensätze, obwohl sich nichts
       * geändert hatte. Ein Bericht, der zu viel behauptet, ist bei einer
       * Sicherung besonders schlecht: Er ist das Einzige, woran man erkennt,
       * ob etwas angekommen ist.
       */
      for (const setting of file.tables.settings) {
        const mine = await db.settings.get(setting.key)
        if (mine === undefined) {
          await db.settings.put(setting)
          added['settings'] = (added['settings'] as number) + 1
        } else if (JSON.stringify(mine.value) !== JSON.stringify(setting.value)) {
          // Einstellungen sind kleine Werte — Sprache, Ton. Ein Vergleich über
          // die Textform reicht und spart eine Tiefenvergleichsfunktion, die
          // niemand sonst braucht.
          await db.settings.put(setting)
          replaced++
        } else kept++
      }

      for (const session of file.tables.sessions) {
        const mine = await db.sessions.get(session.id)
        if (mine === undefined) {
          await db.sessions.put(session)
          added['sessions'] = (added['sessions'] as number) + 1
          continue
        }
        const winner = keepSession(mine, session)
        if (winner === session) {
          await db.sessions.put(session)
          replaced++
        } else kept++
      }

      /*
       * Doppelte Ereignisse erkennt der Fingerabdruck, nicht die Nummer.
       * Einmal alle vorhandenen einsammeln ist billiger als eine Abfrage je
       * Ereignis — und es können viele sein.
       */
      const known = new Set((await db.events.toArray()).map(eventKey))
      for (const event of file.tables.events) {
        const key = eventKey(event)
        if (known.has(key)) {
          kept++
          continue
        }
        known.add(key)
        await db.events.add(event)
        added['events'] = (added['events'] as number) + 1
      }

      for (const state of file.tables.itemStates) {
        const mine = await db.itemStates.get(state.itemId)
        if (mine === undefined) {
          await db.itemStates.put(state)
          added['itemStates'] = (added['itemStates'] as number) + 1
          continue
        }
        const winner = keepItemState(mine, state)
        if (winner === state) {
          await db.itemStates.put(state)
          replaced++
        } else kept++
      }

      for (const benchmark of file.tables.benchmarks) {
        const mine = await db.benchmarks.get(benchmark.id)
        if (mine === undefined) {
          await db.benchmarks.put(benchmark)
          added['benchmarks'] = (added['benchmarks'] as number) + 1
        } else kept++
      }
    },
  )

  return { added: added as unknown as BackupCounts, kept, replaced }
}

/** Liest eine ausgewählte Datei und prüft sie. */
export async function readBackupFile(file: File): Promise<BackupReading> {
  let parsed: unknown
  try {
    parsed = JSON.parse(await file.text())
  } catch {
    return { ok: false, problem: 'unreadable' }
  }
  return readBackup(parsed)
}
