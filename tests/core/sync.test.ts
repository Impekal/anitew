import { describe, expect, it } from 'vitest'

import { makeBackup, type BackupFile, type BackupTables } from '../../src/core/backup.ts'
import { SyncError, syncOnce, type SyncPorts } from '../../src/core/sync/drive.ts'

/**
 * Der Drive-Abgleich (N7/N8/N10 · D-033).
 *
 * Die Regeln hinter den Fällen: Der Abgleich **ist** die Sicherung
 * (dasselbe Mischwerk, N9), er lädt immer die Vereinigung hoch — und bei
 * einer unlesbaren Fremddatei rührt er nichts an, statt sie zu ersetzen.
 */

const EMPTY: BackupTables = { settings: [], sessions: [], events: [], itemStates: [], benchmarks: [] }

function fakePorts(remote: unknown | undefined) {
  const calls: string[] = []
  const local = makeBackup(EMPTY, 1, 'test')
  const ports: SyncPorts = {
    download: async () => {
      calls.push('download')
      return remote
    },
    upload: async (file: BackupFile) => {
      calls.push(`upload:${file.app}`)
    },
    exportLocal: async () => {
      calls.push('export')
      return local
    },
    importRemote: async () => {
      calls.push('import')
      return { addedTotal: 3 }
    },
  }
  return { ports, calls }
}

describe('der Drive-Abgleich', () => {
  it('mischt erst ein, lädt dann die Vereinigung hoch', async () => {
    const { ports, calls } = fakePorts(makeBackup(EMPTY, 5, 'anderes-gerät'))
    const report = await syncOnce(ports)
    expect(calls).toEqual(['download', 'import', 'export', 'upload:test'])
    expect(report).toEqual({ pulled: 3, hadRemote: true })
  })

  it('legt beim ersten Mal einfach die Sicherung hin — nichts zu mischen', async () => {
    const { ports, calls } = fakePorts(undefined)
    const report = await syncOnce(ports)
    expect(calls).toEqual(['download', 'export', 'upload:test'])
    expect(report).toEqual({ pulled: 0, hadRemote: false })
  })

  it('ersetzt nie eine Datei, die es nicht lesen kann', async () => {
    const { ports, calls } = fakePorts({ format: 'fremdes-programm' })
    await expect(syncOnce(ports)).rejects.toThrowError(SyncError)
    // Kein Import, kein Upload: Die fremde Datei bleibt unangetastet.
    expect(calls).toEqual(['download'])
  })
})
