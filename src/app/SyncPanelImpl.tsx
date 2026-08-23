import { useEffect, useState } from 'react'

import { SyncError, type Platform, type SyncReport } from '../core/index.ts'
import type { DriveFailure } from '../platform/web/drive.ts'
import type { Dictionary } from '../i18n/index.ts'

import {
  SYNC_ACCOUNT_SETTING,
  SYNC_AT_SETTING,
  SYNC_ON_SETTING,
  connectDriveSync,
  resolveClientId,
} from './driveSync.ts'

type SyncFailureText = DriveFailure | 'remote-invalid'

interface VisibleDriveCopy {
  intro: string
  how: string
  start: string
  again: string
  autoNote: string
  localNote: string
  stop: string
  firstTime: string
  remoteInvalid: string
}

const DRIVE_DE: VisibleDriveCopy = {
  intro:
    'Empfohlen für mehrere Geräte: Verbinde dein Google Drive. ANITEW legt in „Meine Ablage“ den sichtbaren Ordner „Anitew“ an und speichert dort dieselbe Sicherungsdatei wie beim manuellen Backup. ANITEW hat keinen eigenen Datenserver.',
  how:
    'Beim Abgleich wird zuerst geholt und sicher zusammengeführt, was im Ordner „Anitew“ liegt; nichts wird einfach gelöscht. Danach wird der vereinigte Stand wieder dorthin geschrieben.',
  start: 'Google Drive verbinden — empfohlen',
  again: 'Jetzt mit Google Drive abgleichen',
  autoNote:
    'Automatischer Abgleich ist aktiv. ANITEW versucht beim Öffnen und nach Änderungen still zu synchronisieren. Wenn Google eine neue Freigabe braucht, wartet die App bis zu deinem nächsten Tipp.',
  localNote:
    'Aktuell lokal: Ohne Google-Drive-Verbindung bleiben Training, Erinnerungen und Verlauf ausschließlich auf diesem Gerät.',
  stop: 'Google Drive trennen · lokal weiter',
  firstTime: 'Der Ordner „Anitew“ wurde in deinem Drive angelegt und der aktuelle Stand dort gespeichert.',
  remoteInvalid:
    'Im Ordner „Anitew“ liegt eine Datei, die keine gültige ANITEW-Sicherung ist. Sie wurde nicht verändert.',
}

const DRIVE_EN: VisibleDriveCopy = {
  intro:
    'Recommended across devices: connect Google Drive. ANITEW creates a visible “Anitew” folder in My Drive and stores the same backup file used by manual backup. ANITEW has no data server of its own.',
  how:
    'Sync first downloads and safely merges what is in the “Anitew” folder; nothing is simply deleted. The merged state is then written back there.',
  start: 'Connect Google Drive — recommended',
  again: 'Sync with Google Drive now',
  autoNote:
    'Automatic sync is active. ANITEW quietly tries to sync when opening and after changes. If Google needs permission again, the app waits for your next tap.',
  localNote:
    'Currently local: without Google Drive, training, memories and history remain only on this device.',
  stop: 'Disconnect Google Drive · stay local',
  firstTime: 'The “Anitew” folder was created in your Drive and the current state was stored there.',
  remoteInvalid:
    'The “Anitew” folder contains a file that is not a valid ANITEW backup. It was left untouched.',
}

function visibleCopy(): VisibleDriveCopy {
  return document.documentElement.lang.toLowerCase().startsWith('de') ? DRIVE_DE : DRIVE_EN
}

function driveFailure(error: unknown): DriveFailure | undefined {
  if (typeof error !== 'object' || error === null || !('reason' in error)) return undefined
  const reason = (error as { reason?: unknown }).reason
  return reason === 'denied' || reason === 'offline' || reason === 'drive' ? reason : undefined
}

/**
 * Der Abgleich (N7/N8/N10 · D-033).
 *
 * Die Seite erklärt vor dem ersten Fingertipp, wohin die Daten gehen: eigener
 * sichtbarer Drive-Ordner, kein ANITEW-Server. Ohne Verbindung ist „lokal“
 * ein vollständiger Betriebsmodus und kein Fehlerzustand.
 */
export function SyncPanelImpl({ platform, dictionary }: { platform: Platform; dictionary: Dictionary }) {
  const texts = dictionary.sync
  const drive = visibleCopy()

  const [clientId, setClientId] = useState<string | undefined>(undefined)
  const [checked, setChecked] = useState(false)
  const [auto, setAuto] = useState(false)
  const [lastAt, setLastAt] = useState<number | undefined>(undefined)
  const [busy, setBusy] = useState(false)
  const [report, setReport] = useState<SyncReport | undefined>(undefined)
  const [failure, setFailure] = useState<SyncFailureText | undefined>(undefined)
  const [account, setAccount] = useState<string | undefined>(undefined)

  useEffect(() => {
    void resolveClientId(platform.settings).then((id) => {
      setClientId(id)
      setChecked(true)
    })
    void platform.settings
      .read<boolean>(SYNC_ON_SETTING)
      .then((on) => setAuto(on === true))
      .catch(() => undefined)
    void platform.settings
      .read<number>(SYNC_AT_SETTING)
      .then(setLastAt)
      .catch(() => undefined)
    void platform.settings
      .read<string>(SYNC_ACCOUNT_SETTING)
      .then(setAccount)
      .catch(() => undefined)
  }, [platform])

  const sync = () => {
    if (clientId === undefined || busy) return
    setBusy(true)
    setFailure(undefined)
    setReport(undefined)
    const now = platform.clock.now()
    void connectDriveSync(clientId, now)
      .then((result) => {
        setReport(result.report)
        setAuto(true)
        setLastAt(now)
        void platform.settings.write(SYNC_ON_SETTING, true).catch(() => undefined)
        void platform.settings.write(SYNC_AT_SETTING, now).catch(() => undefined)
        if (result.account !== undefined) {
          setAccount(result.account)
          void platform.settings.write(SYNC_ACCOUNT_SETTING, result.account).catch(() => undefined)
        }
      })
      .catch((error: unknown) => {
        if (error instanceof SyncError) setFailure(error.reason)
        else setFailure(driveFailure(error) ?? 'drive')
      })
      .finally(() => setBusy(false))
  }

  const stop = () => {
    setAuto(false)
    setAccount(undefined)
    setReport(undefined)
    void platform.settings.write(SYNC_ON_SETTING, false).catch(() => undefined)
    void platform.settings.remove(SYNC_ACCOUNT_SETTING).catch(() => undefined)
  }

  if (!checked) return null

  if (clientId === undefined) {
    return (
      <div className="sync">
        <p className="hint">{drive.intro}</p>
        <p className="sync-note">{texts.notConfigured}</p>
        <p className="sync-note">{drive.localNote}</p>
      </div>
    )
  }

  return (
    <div className="sync">
      <p className="hint">{drive.intro}</p>
      <p className="hint">{drive.how}</p>

      <button type="button" className="quiet sync-run" onClick={sync} disabled={busy}>
        {busy ? texts.running : auto ? drive.again : drive.start}
      </button>

      {report !== undefined && (
        <p className="sync-report">
          {!report.hadRemote
            ? drive.firstTime
            : report.pulled > 0
              ? texts.pulledSome.replace('{n}', String(report.pulled))
              : texts.pulledNone}
        </p>
      )}
      {failure !== undefined && (
        <p className="sync-failure">
          {failure === 'remote-invalid' ? drive.remoteInvalid : texts.errors[failure]}
        </p>
      )}

      {account !== undefined && (
        <p className="sync-note sync-account">{texts.account.replace('{account}', account)}</p>
      )}
      {lastAt !== undefined && (
        <p className="sync-note">
          {texts.lastAt} {new Date(lastAt).toLocaleString()}
        </p>
      )}
      {auto ? (
        <>
          <p className="sync-note">{drive.autoNote}</p>
          <button type="button" className="quiet sync-stop" onClick={stop}>
            {drive.stop}
          </button>
        </>
      ) : (
        <p className="sync-note">{drive.localNote}</p>
      )}
    </div>
  )
}
