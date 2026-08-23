import { useEffect, useState } from 'react'

import { SyncError, type Platform, type SyncReport } from '../core/index.ts'
import type { DriveFailure } from '../platform/web/drive.ts'
import type { Dictionary } from '../i18n/index.ts'

import {
  SYNC_ACCOUNT_NAME_SETTING,
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
  identity: string
}

const DRIVE_DE: VisibleDriveCopy = {
  intro:
    'Deine Daten bleiben unter deiner Kontrolle. Standardmäßig speichert ANITEW lokal auf diesem Gerät. Für mehrere Geräte kannst du optional dein eigenes Google Drive verbinden; ANITEW legt dort den sichtbaren Ordner „Anitew“ an — ohne zusätzliche ANITEW-Cloudkopie.',
  how:
    'Beim Abgleich führt ANITEW deinen lokalen und deinen Drive-Stand sicher zusammen und schreibt das Ergebnis zurück in deinen eigenen Ordner.',
  start: 'Google Drive verbinden — empfohlen',
  again: 'Jetzt mit Google Drive abgleichen',
  autoNote:
    'Automatischer Abgleich ist aktiv. ANITEW synchronisiert beim Öffnen und nach Änderungen still über dein eigenes Google Drive.',
  localNote:
    'Lokaler Modus: Training, Erinnerungen und Verlauf bleiben ausschließlich auf diesem Gerät.',
  stop: 'Google Drive trennen · lokal weiter',
  firstTime: 'Dein Ordner „Anitew“ wurde in Google Drive angelegt und der aktuelle Stand dort gespeichert.',
  remoteInvalid:
    'Im Ordner „Anitew“ liegt eine Datei, die keine gültige ANITEW-Sicherung ist. Sie wurde nicht verändert.',
  identity: 'Verbundenes Google-Konto',
}

const DRIVE_EN: VisibleDriveCopy = {
  intro:
    'Your data stays under your control. ANITEW stores locally on this device by default. For multiple devices, you can optionally connect your own Google Drive; ANITEW creates a visible “Anitew” folder there — without an additional ANITEW cloud copy.',
  how:
    'Sync safely merges your local state with your Drive state and writes the result back into your own folder.',
  start: 'Connect Google Drive — recommended',
  again: 'Sync with Google Drive now',
  autoNote:
    'Automatic sync is active. ANITEW quietly syncs on open and after changes through your own Google Drive.',
  localNote:
    'Local mode: training, memories and history stay exclusively on this device.',
  stop: 'Disconnect Google Drive · stay local',
  firstTime: 'Your “Anitew” folder was created in Google Drive and the current state was stored there.',
  remoteInvalid:
    'The “Anitew” folder contains a file that is not a valid ANITEW backup. It was left untouched.',
  identity: 'Connected Google account',
}

function visibleCopy(): VisibleDriveCopy {
  return document.documentElement.lang.toLowerCase().startsWith('de') ? DRIVE_DE : DRIVE_EN
}

function driveFailure(error: unknown): DriveFailure | undefined {
  if (typeof error !== 'object' || error === null || !('reason' in error)) return undefined
  const reason = (error as { reason?: unknown }).reason
  return reason === 'denied' || reason === 'offline' || reason === 'drive' ? reason : undefined
}

function initials(name: string | undefined, email: string | undefined): string {
  if (name !== undefined) {
    const parts = name.trim().split(/\s+/u).filter(Boolean)
    const value = `${parts[0]?.[0] ?? ''}${parts.length > 1 ? parts.at(-1)?.[0] ?? '' : ''}`
    if (value !== '') return value.toUpperCase()
  }
  return (email?.[0] ?? 'G').toUpperCase()
}

/**
 * Der Abgleich (N7/N8/N10 · D-033).
 *
 * Datenschutz wird hier nicht als fehlende Infrastruktur verkauft, sondern
 * als Architekturentscheidung: lokal zuerst, optional der eigene Drive,
 * keine zusätzliche ANITEW-Cloudkopie.
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
  const [accountName, setAccountName] = useState<string | undefined>(undefined)

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
    void platform.settings
      .read<string>(SYNC_ACCOUNT_NAME_SETTING)
      .then(setAccountName)
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
        setAccount(result.account)
        setAccountName(result.accountName)
        void platform.settings.write(SYNC_ON_SETTING, true).catch(() => undefined)
        void platform.settings.write(SYNC_AT_SETTING, now).catch(() => undefined)
        if (result.account !== undefined) {
          void platform.settings.write(SYNC_ACCOUNT_SETTING, result.account).catch(() => undefined)
        }
        if (result.accountName !== undefined) {
          void platform.settings
            .write(SYNC_ACCOUNT_NAME_SETTING, result.accountName)
            .catch(() => undefined)
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
    setAccountName(undefined)
    setReport(undefined)
    void platform.settings.write(SYNC_ON_SETTING, false).catch(() => undefined)
    void platform.settings.remove(SYNC_ACCOUNT_SETTING).catch(() => undefined)
    void platform.settings.remove(SYNC_ACCOUNT_NAME_SETTING).catch(() => undefined)
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
      <p className="hint sync-privacy-lead">{drive.intro}</p>
      <p className="hint">{drive.how}</p>

      {(account !== undefined || accountName !== undefined) && (
        <section className="sync-identity" aria-label={drive.identity}>
          <span className="sync-identity-avatar" aria-hidden="true">
            {initials(accountName, account)}
          </span>
          <span className="sync-identity-copy">
            <small>{drive.identity}</small>
            <strong>{accountName ?? 'Google Drive'}</strong>
            {account !== undefined && <span className="sync-account">{account}</span>}
          </span>
        </section>
      )}

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
