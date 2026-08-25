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
import { wipeEverything } from '../data/reset.ts'
import { resolveClientId } from './driveSync.ts'

interface ResetCopy {
  heading: string
  scope: string
  cloud: string
  cloudNote: string
  keepCloud: string
  type: string
  cloudFailed: string
}

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

const RESET_DE: ResetCopy = {
  heading: 'Neu anfangen',
  scope:
    'Löscht Training, Erinnerungen, Messungen, Profil und Einstellungen auf diesem Gerät, trennt Google und startet ANITEW danach wie beim ersten Öffnen.',
  cloud: 'Auch die ANITEW-Sicherungsdatei in Google Drive löschen',
  cloudNote:
    'Der Ordner „Anitew“ bleibt bestehen; nur die von ANITEW angelegte Sicherungsdatei wird gelöscht. Andere Dateien in diesem Ordner fasst ANITEW nie an.',
  keepCloud:
    'Ohne diesen Haken bleibt die Drive-Sicherung erhalten und kann bei einer späteren Anmeldung wieder eingelesen werden.',
  type: 'Zur endgültigen Bestätigung ANITEW eingeben.',
  cloudFailed:
    'Die ANITEW-Sicherung in Google Drive konnte nicht gelöscht werden. Lokal wurde deshalb noch nichts gelöscht.',
}

const RESET_EN: ResetCopy = {
  heading: 'Start over',
  scope:
    'Deletes training, memories, measurements, profile and settings on this device, disconnects Google and then starts ANITEW like the first launch.',
  cloud: 'Also delete the ANITEW backup file in Google Drive',
  cloudNote:
    'The “Anitew” folder stays in place; only the backup file created by ANITEW is deleted. ANITEW never touches other files in that folder.',
  keepCloud:
    'Without this option, the Drive backup remains and can be imported again after a later sign-in.',
  type: 'Type ANITEW to confirm permanently.',
  cloudFailed:
    'The ANITEW backup in Google Drive could not be deleted. Nothing was deleted locally.',
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

function resetCopy(): ResetCopy {
  return document.documentElement.lang.toLowerCase().startsWith('de') ? RESET_DE : RESET_EN
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
  const reset = resetCopy()
  const support = supportCopy()
  const fileInput = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | undefined>()
  const [confirmWipe, setConfirmWipe] = useState(false)
  const [wipeDrive, setWipeDrive] = useState(false)
  const [wipePhrase, setWipePhrase] = useState('')
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

  const resetFromScratch = async () => {
    setBusy(true)
    setMessage(undefined)
    try {
      const drive = await import('../platform/web/drive.ts')
      if (wipeDrive) {
        const clientId = await resolveClientId(platform.settings)
        const token = await drive.requestDriveToken(clientId, true)
        await drive.deleteDriveBackup(token)
      }
      await drive.disconnectDriveAuthorization()
      await wipeEverything()
      try {
        window.localStorage.clear()
        window.sessionStorage.clear()
      } catch {
        // Der eigentliche Nutzerdatenspeicher ist bereits gelöscht.
      }
      window.location.replace('/')
    } catch {
      setMessage(wipeDrive ? reset.cloudFailed : t.failed)
      setBusy(false)
    }
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

      <div className="wipe wipe-reset">
        <h3>{reset.heading}</h3>
        <p className="hint">{reset.scope}</p>
        {confirmWipe ? (
          <>
            <p className="hint wipe-warn">{t.wipeConfirm}</p>
            <label className="hint">
              <input
                type="checkbox"
                checked={wipeDrive}
                onChange={(event) => setWipeDrive(event.target.checked)}
                disabled={busy}
              />{' '}
              {reset.cloud}
            </label>
            <p className="hint">{wipeDrive ? reset.cloudNote : reset.keepCloud}</p>
            <label className="hint">
              <span>{reset.type}</span>
              <input
                className="wipe-confirm-input"
                type="text"
                value={wipePhrase}
                autoComplete="off"
                spellCheck={false}
                onChange={(event) => setWipePhrase(event.target.value)}
                disabled={busy}
              />
            </label>
            <div className="backup-actions">
              <button
                type="button"
                className="quiet wipe-go"
                disabled={busy || wipePhrase.trim().toUpperCase() !== 'ANITEW'}
                onClick={() => void resetFromScratch()}
              >
                {t.wipe}
              </button>
              <button
                type="button"
                className="quiet"
                disabled={busy}
                onClick={() => {
                  setConfirmWipe(false)
                  setWipeDrive(false)
                  setWipePhrase('')
                }}
              >
                {t.wipeCancel}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="hint">{t.wipeNote}</p>
            <div className="backup-actions">
              <button type="button" className="quiet" onClick={() => setConfirmWipe(true)}>
                {t.wipe}
              </button>
            </div>
          </>
        )}
      </div>
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
