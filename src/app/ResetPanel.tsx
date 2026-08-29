import { useEffect, useRef, useState } from 'react'

import type { Platform } from '../core/index.ts'
import type { Dictionary } from '../i18n/index.ts'
import { wipeEverything } from '../data/reset.ts'
import { disconnectGoogleAuthorization } from '../platform/web/oauthLogout.ts'
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
  const phraseField = useRef<HTMLInputElement>(null)
  const goButton = useRef<HTMLButtonElement>(null)

  /*
   * Den Bestätigungsschritt ins Bild holen.
   *
   * Auf einem iPhone stand „Alles löschen" ganz unten am Rand — gemessen bei
   * 820 Pixeln in einem 852 Pixel hohen Fenster. Nach dem Antippen erschien
   * die Warnung gerade noch sichtbar, das Eingabefeld für das Wort aber bei
   * 936 und der eigentliche Löschknopf bei 967: **beide außerhalb des
   * Bildschirms**, und die Seite scrollte nicht mit. Am unteren Rand tauschte
   * sich nur eine Zeile aus. Es sah aus, als täte der Knopf nichts — so wurde
   * es auch gemeldet.
   *
   * Die beiden E2E-Tests dazu waren grün, weil Playwright vor jedem Klick von
   * sich aus scrollt. Sie sind den Weg also nie so gegangen wie ein Mensch mit
   * einem Telefon in der Hand.
   *
   * Der Schritt bleibt unbequem — das ist bei einer unwiderruflichen Löschung
   * Absicht (PRIVACY §8). Unbequem heißt aber „man muss etwas Bewusstes tun",
   * nicht „man muss erraten, dass es weiter unten weitergeht".
   *
   * Der Fokus liegt danach im Feld, damit ohne Suchen klar ist, was jetzt
   * dran ist.
   */
  useEffect(() => {
    if (!confirmWipe) return
    const field = phraseField.current
    if (field === null) return
    field.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'center',
    })
    field.focus({ preventScroll: true })
  }, [confirmWipe])

  const phraseComplete = wipePhrase.trim().toUpperCase() === 'ANITEW'

  /*
   * Und derselbe Griff noch einmal für den letzten Schritt.
   *
   * Sobald das Wort steht, ist der Löschknopf das Einzige, was noch fehlt —
   * er steht aber unmittelbar unter dem Eingabefeld, und auf einem Telefon
   * liegt dort die eingeblendete Tastatur. Eine Zusage, die man nur einlösen
   * kann, indem man die Tastatur erst wegwischt, ist dieselbe Sackgasse wie
   * vorher, nur eine Stufe später.
   *
   * `block: 'end'` holt ihn an die Unterkante des sichtbaren Bereichs — das
   * ist die Stelle, die über der Tastatur am ehesten frei bleibt.
   */
  useEffect(() => {
    if (!confirmWipe || !phraseComplete) return
    goButton.current?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'end',
    })
  }, [confirmWipe, phraseComplete])

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
      await wipeEverything()
      try {
        window.localStorage.clear()
        window.sessionStorage.clear()
      } catch {
        // Der eigentliche Nutzerdatenspeicher ist bereits gelöscht.
      }
      /*
       * Erst NACH `localStorage.clear()`: Bei einem Offline-Reset kann der
       * HttpOnly-OAuth-Cookie nicht sofort vom Worker gelöscht werden. Die
       * Logout-Schicht legt dann eine einzige technische Retry-Marke neu an,
       * die den Reset überlebt und beim nächsten Online-Start abgearbeitet
       * wird. Der Drive-Abgleich selbst ist durch die geleerte DB schon aus.
       */
      await disconnectGoogleAuthorization()
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
              ref={phraseField}
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
              ref={goButton}
              type="button"
              className="quiet wipe-go"
              disabled={busy || !phraseComplete}
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
