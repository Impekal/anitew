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

function resetCopy(): ResetCopy {
  return document.documentElement.lang.toLowerCase().startsWith('de') ? RESET_DE : RESET_EN
}

/**
 * Sicherung speichern und einlesen (Backlog N2).
 *
 * Der Anlass war kein theoretischer: Ein gelöschter Browserspeicher hat eine
 * Trainingshistorie mitgenommen. Deshalb steht der Hinweis hier auch **vor**
 * den Knöpfen und nicht als Kleingedrucktes darunter — wer nicht weiß, dass
 * alles nur auf diesem Gerät liegt, kommt nicht auf die Idee zu sichern.
 *
 * Bewusst zwei einfache Knöpfe und kein Assistent: Sichern ist etwas, das man
 * im Vorbeigehen tut, oder man tut es nie.
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
  const fileInput = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | undefined>()
  // N4: Die einzige Rückfrage der App — weil das Löschen unwiderruflich ist.
  const [confirmWipe, setConfirmWipe] = useState(false)
  const [wipeDrive, setWipeDrive] = useState(false)
  const [wipePhrase, setWipePhrase] = useState('')
  /*
   * Wie viel Platz belegt ist (N5). Gemessen über navigator.storage, nicht
   * geschätzt — und „etwa“, weil der Browser den Wert bewusst grob hält.
   * Nach dem Löschen oder Einlesen neu, deshalb hängt es an `message`.
   */
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

      /*
       * Der Umweg über eine Objekt-URL ist der einzige Weg, der überall
       * funktioniert — auch in einer installierten PWA auf dem Telefon, wo es
       * keinen „Speichern unter“-Dialog gibt, sondern das Teilen-Blatt des
       * Systems. Die URL wird sofort wieder freigegeben; sonst hält der
       * Browser die ganze Datei im Speicher, bis der Reiter zugeht.
       */
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
      // Zurücksetzen, sonst löst dieselbe Datei beim zweiten Mal kein
      // `change` aus — und es sieht aus, als sei der Knopf kaputt.
      if (fileInput.current !== null) fileInput.current.value = ''
    }
  }

  const resetFromScratch = async () => {
    setBusy(true)
    setMessage(undefined)
    try {
      // Drive ist kein Kaltstartpfad. Der schwere Google-Code wird erst hier
      // geladen, wenn jemand den seltenen, bewussten Reset wirklich bestätigt.
      const drive = await import('../platform/web/drive.ts')
      if (wipeDrive) {
        const clientId = await resolveClientId(platform.settings)
        const token = await drive.requestDriveToken(clientId, true)
        await drive.deleteDriveBackup(token)
      }

      // Erst Cloud/Session trennen, dann lokal leeren. So kann kein noch
      // laufender stiller Sync die gerade gelöschten Daten wieder einlesen.
      await drive.disconnectDriveAuthorization()
      await wipeEverything()

      // Theme-Erststart, First-run-Hilfen und einmalige UI-Zustände liegen
      // bewusst außerhalb von Dexie. Für „von vorn“ müssen auch sie weg.
      try {
        window.localStorage.clear()
        window.sessionStorage.clear()
      } catch {
        // Der eigentliche Nutzerdatenspeicher ist bereits gelöscht. Geblockter
        // Komfortspeicher darf den Reset nicht rückgängig machen.
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
      {/* Das Dateifeld selbst bleibt verborgen: Es sieht auf jedem System
          anders aus und lässt sich nicht gestalten (D-011/G-4). */}
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

      <div className="wipe">
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

/**
 * Was passiert ist, in einem Satz.
 *
 * Drei Zahlen und keine Erfolgsmeldung: „Import erfolgreich“ sagt nichts
 * darüber, ob überhaupt etwas ankam. Wer zweimal dieselbe Datei einliest,
 * soll sehen, dass beim zweiten Mal nichts dazukam — und daran erkennen, dass
 * die App nichts doppelt zählt.
 */
function describe(report: ImportReport, dropped: number, t: Dictionary['backup']): string {
  const parts = [`${totalRecords(report.added)} ${t.added}`, `${report.kept} ${t.kept}`]
  if (report.replaced > 0) parts.push(`${report.replaced} ${t.replaced}`)
  if (dropped > 0) parts.push(`${dropped} ${t.dropped}`)
  return `${t.imported} ${parts.join(' · ')}`
}

/** Bytes als kurze, lesbare Größe — KB oder MB, eine Nachkommastelle. */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(0)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}
