import { useEffect, useRef, useState } from 'react'

import {
  type Platform,
  backupFileName,
  countRecords,
  dayKeyOf,
  totalRecords,
} from '../core/index.ts'
import type { Dictionary } from '../i18n/index.ts'
import { type ImportReport, exportBackup, importBackup, readBackupFile } from '../data/backup.ts'
import { ResetPanel } from './ResetPanel.tsx'

interface SupportCopy {
  heading: string
  note: string
  build: string
  diagnostics: string
  metrics: string
  clear: string
  saved: string
  cleared: string
}

const SUPPORT_DE: SupportCopy = {
  heading: 'Support & Beta',
  note:
    'Berichte werden nur auf diesem Gerät erzeugt und als Datei gespeichert. ANITEW sendet sie nicht automatisch. Diagnoseberichte enthalten keine Erinnerungstexte, Antworten, Fotos, API-Schlüssel oder OAuth-Tokens; der Beta-Bericht enthält nur aggregierte Zählwerte.',
  build: 'Installierte Fassung',
  diagnostics: 'Diagnosebericht speichern',
  metrics: 'Beta-Bericht speichern',
  clear: 'Lokales Fehlerprotokoll löschen',
  saved: 'Bericht gespeichert.',
  cleared: 'Lokales Fehlerprotokoll gelöscht.',
}

const SUPPORT_EN: SupportCopy = {
  heading: 'Support & beta',
  note:
    'Reports are created only on this device and saved as files. ANITEW never sends them automatically. Diagnostic reports contain no memory text, answers, photos, API keys or OAuth tokens; the beta report contains aggregated counts only.',
  build: 'Installed build',
  diagnostics: 'Save diagnostic report',
  metrics: 'Save beta report',
  clear: 'Clear local error log',
  saved: 'Report saved.',
  cleared: 'Local error log cleared.',
}

function supportCopy(): SupportCopy {
  return document.documentElement.lang.toLowerCase().startsWith('de') ? SUPPORT_DE : SUPPORT_EN
}

function downloadJson(name: string, value: unknown): void {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = name
  link.click()
  URL.revokeObjectURL(url)
}

/**
 * Sicherung, Recovery und freiwillige Support-Berichte.
 *
 * Support-/Beta-Berichte bleiben genau wie die Sicherung unter Kontrolle des
 * Menschen: ein Fingertipp erzeugt eine Datei, es gibt keinen Upload-Endpunkt.
 */
export function BackupPanel({
  platform,
  dictionary,
}: {
  platform: Platform
  dictionary: Dictionary
}) {
  const t = dictionary.backup
  const support = supportCopy()
  const fileInput = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | undefined>()
  const [usage, setUsage] = useState<string | undefined>()

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const estimate = navigator.storage?.estimate
      if (typeof estimate !== 'function') return
      try {
        const { usage: bytes } = await navigator.storage.estimate()
        if (!cancelled && typeof bytes === 'number') setUsage(formatBytes(bytes))
      } catch {
        // Kann der Browser es nicht sagen, sagt die App auch nichts.
      }
    })()
    return () => {
      cancelled = true
    }
  }, [message])

  const save = async () => {
    setBusy(true)
    setMessage(undefined)
    try {
      const now = platform.clock.now()
      const day = dayKeyOf(now, { offsetMinutes: platform.clock.offsetMinutes(now) })
      const file = await exportBackup(now, __ANITEW_BUILD__.commit)
      const blob = new Blob([JSON.stringify(file)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = backupFileName(day)
      link.click()
      URL.revokeObjectURL(url)
      setMessage(`${t.saved} ${totalRecords(countRecords(file.tables))} ${t.records}`)
    } catch {
      setMessage(t.failed)
    } finally {
      setBusy(false)
    }
  }

  const load = async (chosen: File) => {
    setBusy(true)
    setMessage(undefined)
    try {
      const reading = await readBackupFile(chosen)
      if (!reading.ok) {
        setMessage(t[reading.problem])
        return
      }
      const report = await importBackup(reading.file)
      setMessage(describe(report, reading.dropped, t))
    } catch {
      setMessage(t.failed)
    } finally {
      setBusy(false)
      if (fileInput.current !== null) fileInput.current.value = ''
    }
  }

  const saveDiagnostics = () => {
    setBusy(true)
    setMessage(undefined)
    void import('../platform/web/diagnostics.ts')
      .then(async ({ createDiagnosticReport }) => {
        const report = await createDiagnosticReport()
        downloadJson(`anitew-diagnose-${Date.now()}.json`, report)
        setMessage(support.saved)
      })
      .catch(() => setMessage(t.failed))
      .finally(() => setBusy(false))
  }

  const saveMetrics = () => {
    setBusy(true)
    setMessage(undefined)
    void import('../data/productMetrics.ts')
      .then(async ({ loadProductMetrics }) => {
        const metrics = await loadProductMetrics()
        downloadJson(`anitew-beta-${Date.now()}.json`, {
          build: { ...__ANITEW_BUILD__ },
          createdAt: new Date().toISOString(),
          metrics,
          privacy: {
            includesMemoryContent: false,
            includesAnswerContent: false,
            uploadedAutomatically: false,
          },
        })
        setMessage(support.saved)
      })
      .catch(() => setMessage(t.failed))
      .finally(() => setBusy(false))
  }

  const clearDiagnostics = () => {
    void import('../platform/web/diagnostics.ts')
      .then(({ clearLocalDiagnosticEvents }) => {
        clearLocalDiagnosticEvents()
        setMessage(support.cleared)
      })
      .catch(() => setMessage(t.failed))
  }


  return (
    <section className="backup" aria-label={t.heading}>
      <p className="hint">{t.note}</p>
      <div className="backup-actions">
        <button type="button" className="quiet" onClick={() => void save()} disabled={busy}>
          {t.save}
        </button>
        <button
          type="button"
          className="quiet"
          onClick={() => fileInput.current?.click()}
          disabled={busy}
        >
          {t.load}
        </button>
      </div>
      <input
        ref={fileInput}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(event) => {
          const chosen = event.target.files?.[0]
          if (chosen !== undefined) void load(chosen)
        }}
      />
      <p className="hint">{t.merges}</p>
      {usage !== undefined && (
        <p className="hint">
          {t.usage} {usage}
        </p>
      )}
      {message !== undefined && (
        <p className="hint" role="status">
          {message}
        </p>
      )}

      <div className="wipe support-reports">
        <h3>{support.heading}</h3>
        <p className="hint">{support.note}</p>
        <p className="hint">
          {support.build}: {__ANITEW_BUILD__.version} · {__ANITEW_BUILD__.commit}
        </p>
        <div className="backup-actions">
          <button type="button" className="quiet" disabled={busy} onClick={saveDiagnostics}>
            {support.diagnostics}
          </button>
          <button type="button" className="quiet" disabled={busy} onClick={saveMetrics}>
            {support.metrics}
          </button>
          <button type="button" className="quiet" disabled={busy} onClick={clearDiagnostics}>
            {support.clear}
          </button>
        </div>
      </div>

      {/* Einmal umgesetzt, an zwei Stellen sichtbar (Einstellungen und hier). */}
      <ResetPanel platform={platform} dictionary={dictionary} />
    </section>
  )
}

function describe(report: ImportReport, dropped: number, t: Dictionary['backup']): string {
  const parts = [`${totalRecords(report.added)} ${t.added}`, `${report.kept} ${t.kept}`]
  if (report.replaced > 0) parts.push(`${report.replaced} ${t.replaced}`)
  if (dropped > 0) parts.push(`${dropped} ${t.dropped}`)
  return `${t.imported} ${parts.join(' · ')}`
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(0)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}
