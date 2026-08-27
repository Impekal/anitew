import { useState } from 'react'

import type { Platform } from '../core/index.ts'
import type { Dictionary } from '../i18n/index.ts'
import { wipeEverything } from '../data/reset.ts'
import { resolveClientId } from './driveSync.ts'

/**
 * „Neu anfangen" — der Vollzug des Löschrechts aus PRIVACY §8.
 *
 * Bis Runde 4 stand dieser Weg nur unter „Sicherung". Dort ist er richtig
 * aufgehoben (wer löscht, sollte vorher sichern), aber niemand sucht ihn
 * dort: Gefragt wird danach in den **Einstellungen**. Deshalb steht er
 * jetzt an beiden Stellen — als eine Komponente, nicht als zweite
 * Umsetzung, denn zwei Löschwege wären zwei Gelegenheiten, dass einer
 * unvollständig löscht.
 *
 * Der Ablauf ist bewusst unbequem: erst die Warnung, dann das Wort ANITEW
 * eintippen. Danach verschwinden Datenbank, Browserspeicher, das
 * Push-Abonnement und die Google-Verknüpfung, und die App startet neu —
 * wie beim allerersten Öffnen. Das ist unwiderruflich, und genau so soll
 * es sich anfühlen.
 */
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

export function ResetPanel({
  platform,
  dictionary,
}: {
  platform: Platform
  dictionary: Dictionary
}) {
  const t = dictionary.backup
  const reset = resetCopy()
  const [confirmWipe, setConfirmWipe] = useState(false)
  const [wipeDrive, setWipeDrive] = useState(false)
  const [wipePhrase, setWipePhrase] = useState('')
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState<string | undefined>(undefined)

  const resetFromScratch = async () => {
    setBusy(true)
    setFailed(undefined)
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
      // Neustart auf der nackten App — wie nach der ersten Installation.
      window.location.replace('/')
    } catch {
      setFailed(wipeDrive ? reset.cloudFailed : t.failed)
      setBusy(false)
    }
  }

  return (
    <div className="wipe wipe-reset">
      <h2>{reset.heading}</h2>
      <p className="hint">{reset.scope}</p>
      {confirmWipe ? (
        <>
          <p className="hint wipe-warn" role="alert">
            {t.wipeConfirm}
          </p>
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
      {failed !== undefined && (
        <p className="coach-failure" role="alert">
          {failed}
        </p>
      )}
    </div>
  )
}
