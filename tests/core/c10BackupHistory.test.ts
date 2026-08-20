import { describe, expect, it } from 'vitest'

import { BACKUP_FORMAT, readBackup } from '../../src/core/index.ts'

describe('C10 — Review-Historie in Sicherungen', () => {
  it('behält optionale Scheduler-Metadaten einer Ereigniszeile unverändert', () => {
    const reading = readBackup({
      format: BACKUP_FORMAT,
      version: 1,
      createdAt: 1,
      app: 'test',
      tables: {
        settings: [],
        sessions: [],
        events: [
          {
            sessionId: 's1',
            at: 123,
            moduleId: 'review',
            module: 'words',
            itemId: 'Anker',
            kind: 'answered',
            correct: true,
            schedulerItemId: 'words:de:Anker',
            schedulerDay: '2026-08-21',
          },
        ],
        itemStates: [],
        benchmarks: [],
      },
    })

    expect(reading.ok).toBe(true)
    if (!reading.ok) return

    const event = reading.file.tables.events[0] as unknown as Record<string, unknown>
    expect(event['schedulerItemId']).toBe('words:de:Anker')
    expect(event['schedulerDay']).toBe('2026-08-21')
  })
})
