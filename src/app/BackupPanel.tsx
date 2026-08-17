import { useRef, useState } from 'react'

import {
  type Platform,
  backupFileName,
  countRecords,
  dayKeyOf,
  totalRecords,
} from '../core/index.ts'
import type { Dictionary } from '../i18n/index.ts'
import { type ImportReport, exportBackup, importBackup, readBackupFile } from '../data/backup.ts'

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
  const fileInput = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | undefined>()

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
      {message !== undefined && (
        <p className="hint" role="status">
          {message}
        </p>
      )}
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
