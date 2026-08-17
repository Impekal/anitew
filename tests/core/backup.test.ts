import { describe, expect, it } from 'vitest'

import {
  BACKUP_FORMAT,
  BACKUP_VERSION,
  type BackupItemState,
  type BackupSession,
  type BackupTables,
  backupFileName,
  countRecords,
  eventKey,
  keepItemState,
  keepSession,
  makeBackup,
  readBackup,
  totalRecords,
} from '../../src/core/backup.ts'

const empty: BackupTables = {
  settings: [],
  sessions: [],
  events: [],
  itemStates: [],
  benchmarks: [],
}

const state = (over: Partial<BackupItemState> = {}): BackupItemState => ({
  itemId: 'words:de:Anker',
  moduleId: 'words',
  language: 'de',
  createdAt: 1,
  reviews: 0,
  lapses: 0,
  ...over,
})

const session = (over: Partial<BackupSession> = {}): BackupSession => ({
  id: 's-1',
  day: '2026-08-17',
  mode: 'daily',
  startedAt: 1,
  completed: false,
  ...over,
})

describe('die Sicherungsdatei (N2)', () => {
  it('liest, was sie selbst geschrieben hat', () => {
    const file = makeBackup({ ...empty, itemStates: [state()] }, 1000, 'abc123')
    const reading = readBackup(JSON.parse(JSON.stringify(file)))
    expect(reading.ok).toBe(true)
    if (!reading.ok) return
    expect(reading.file.tables.itemStates).toHaveLength(1)
    expect(reading.counts.itemStates).toBe(1)
    expect(reading.file.app).toBe('abc123')
  })

  it('erkennt eine fremde Datei, statt sie halb zu lesen', () => {
    expect(readBackup({ hello: 'world' })).toEqual({ ok: false, problem: 'foreign' })
    expect(readBackup('nur Text')).toEqual({ ok: false, problem: 'unreadable' })
    expect(readBackup(null)).toEqual({ ok: false, problem: 'unreadable' })
    // Eine Liste ist kein Objekt — und wäre sonst als leere Sicherung
    // durchgegangen, also als „nichts drin“ statt „falsche Datei“.
    expect(readBackup([])).toEqual({ ok: false, problem: 'unreadable' })
  })

  it('lehnt eine Datei aus einer neueren Fassung ab', () => {
    /*
     * Wer die App auf einem Gerät aktualisiert hat und auf einem zweiten noch
     * die alte benutzt, soll dort eine klare Ansage bekommen — und nicht eine
     * Sicherung, aus der stillschweigend die Hälfte fehlt.
     */
    const reading = readBackup({ format: BACKUP_FORMAT, version: BACKUP_VERSION + 1, tables: {} })
    expect(reading).toEqual({ ok: false, problem: 'newer', version: BACKUP_VERSION + 1 })
  })

  it('nimmt fehlende Tabellen hin', () => {
    // Eine Sicherung ohne Benchmarks ist eine Sicherung ohne Benchmarks und
    // kein Fehler. Streng gegenüber Falschem, großzügig gegenüber Fehlendem.
    const reading = readBackup({ format: BACKUP_FORMAT, version: 1 })
    expect(reading.ok).toBe(true)
    if (!reading.ok) return
    expect(totalRecords(reading.counts)).toBe(0)
  })

  it('lässt Ereignisse mit unbekannter Art draußen und sagt wie viele', () => {
    /*
     * Die Ereignistabelle ist die Rohdatenbasis für alles, was ANITEW später
     * über jemanden behauptet. Ein Wert, den keine Auswertung deuten kann,
     * stünde dort für immer.
     */
    const reading = readBackup({
      format: BACKUP_FORMAT,
      version: 1,
      tables: {
        events: [
          { sessionId: 's', at: 1, moduleId: 'words', kind: 'answered' },
          { sessionId: 's', at: 2, moduleId: 'words', kind: 'geträumt' },
        ],
      },
    })
    expect(reading.ok).toBe(true)
    if (!reading.ok) return
    expect(reading.counts.events).toBe(1)
    expect(reading.dropped).toBe(1)
  })

  it('zählt richtig', () => {
    const tables = { ...empty, itemStates: [state(), state({ itemId: 'b' })] }
    expect(countRecords(tables).itemStates).toBe(2)
    expect(totalRecords(countRecords(tables))).toBe(2)
  })

  it('nennt den Tag im Dateinamen', () => {
    // Sonst liegt im Downloadordner „anitew (3).json“ und niemand weiß, welche
    // davon die jüngere ist.
    expect(backupFileName('2026-08-17')).toBe('anitew-sicherung-2026-08-17.json')
  })
})

describe('doppelte Ereignisse (N9)', () => {
  it('erkennt dasselbe Ereignis wieder, ohne die laufende Nummer', () => {
    /*
     * Die Nummer ist auf jedem Gerät eine andere und taugt zum Erkennen von
     * Doppelten gerade nicht. Zweimal dieselbe Sicherung einzulesen muss
     * folgenlos bleiben.
     */
    const one = { sessionId: 's-1', at: 5, moduleId: 'words', itemId: 'x', kind: 'answered' } as const
    const same = { ...one, correct: true }
    expect(eventKey(one)).toBe(eventKey(same))
  })

  it('unterscheidet zwei Antworten auf dasselbe Wort zu verschiedenen Zeiten', () => {
    const first = { sessionId: 's-1', at: 5, moduleId: 'words', itemId: 'x', kind: 'answered' } as const
    const later = { ...first, at: 6 }
    expect(eventKey(first)).not.toBe(eventKey(later))
  })
})

describe('zusammenführen statt überschreiben (N9)', () => {
  it('behält die längere Geschichte', () => {
    const mine = state({ reviews: 9, lastSeenAt: 100 })
    const theirs = state({ reviews: 2, lastSeenAt: 9_000 })
    // Nicht das jüngere Gerät gewinnt, sondern das mit den mehr Abfragen:
    // Die Zahl wächst nur, wenn wirklich geübt wurde.
    expect(keepItemState(mine, theirs)).toBe(mine)
  })

  it('entscheidet bei Gleichstand nach der jüngeren Begegnung', () => {
    const mine = state({ reviews: 4, lastSeenAt: 100 })
    const theirs = state({ reviews: 4, lastSeenAt: 200 })
    expect(keepItemState(mine, theirs)).toBe(theirs)
  })

  it('lässt sich vom Termin nicht täuschen', () => {
    /*
     * Ein Gerät, das lange nicht lief, hat lauter überfällige Termine. Die
     * sähen „dringender“ aus — und würden die frischere Historie verdrängen,
     * wenn danach entschieden würde.
     */
    const alt = state({ reviews: 1, dueDay: '2000-01-01', lastSeenAt: 1 })
    const frisch = state({ reviews: 7, dueDay: '2030-01-01', lastSeenAt: 5000 })
    expect(keepItemState(frisch, alt)).toBe(frisch)
  })

  it('lässt eine abgeschlossene Einheit die abgebrochene schlagen', () => {
    // Dieselbe Einheit kann auf einem Gerät unterbrochen und auf einem
    // anderen zu Ende geführt worden sein.
    const abgebrochen = session({ completed: false })
    const fertig = session({ completed: true, endedAt: 500 })
    expect(keepSession(abgebrochen, fertig)).toBe(fertig)
    expect(keepSession(fertig, abgebrochen)).toBe(fertig)
  })

  it('ist in sich stimmig: zweimal dasselbe ändert nichts', () => {
    const one = state({ reviews: 3, lastSeenAt: 10 })
    expect(keepItemState(one, { ...one })).toEqual(one)
  })
})
