import { useCallback, useEffect, useRef, useState } from 'react'

import { SyncError, type Platform, type SyncReport } from '../core/index.ts'
import { type DriveFailure } from '../platform/web/drive.ts'
import { disconnectGoogleAuthorization } from '../platform/web/oauthLogout.ts'
import type { Dictionary } from '../i18n/index.ts'

import {
  SYNC_ACCOUNT_NAME_SETTING,
  SYNC_ACCOUNT_SETTING,
  SYNC_AT_SETTING,
  SYNC_ON_SETTING,
  connectDriveSync,
  resolveClientId,
} from './driveSync.ts'
import { takeDriveRedirectNotice } from './driveRedirectNotice.ts'

type SyncFailureText = DriveFailure | 'remote-invalid' | 'storage'

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
  storage: string
  identity: string
  connected: string
}

const DRIVE_DE: VisibleDriveCopy = {
  intro:
    'Deine Daten bleiben unter deiner Kontrolle. Standardmäßig speichert ANITEW lokal auf diesem Gerät. Für mehrere Geräte kannst du dich mit Google anmelden und deine ANITEW-Daten in deinem eigenen Google Drive speichern; ANITEW legt dort den sichtbaren Ordner „Anitew“ an — ohne zusätzliche ANITEW-Cloudkopie.',
  how:
    'Beim Abgleich führt ANITEW deinen lokalen und deinen Drive-Stand sicher zusammen und schreibt das Ergebnis zurück in deinen eigenen Ordner.',
  start: 'Anmelden / Daten im Google Drive speichern',
  again: 'Jetzt mit Google Drive abgleichen',
  autoNote:
    'Automatischer Abgleich ist aktiv. ANITEW synchronisiert beim Öffnen und nach Änderungen still über dein eigenes Google Drive.',
  localNote:
    'Lokaler Modus: Training, Erinnerungen und Verlauf bleiben ausschließlich auf diesem Gerät.',
  stop: 'Google-Konto trennen · lokal weiter',
  firstTime: 'Dein Ordner „Anitew“ wurde in Google Drive angelegt und der aktuelle Stand dort gespeichert.',
  remoteInvalid:
    'Im Ordner „Anitew“ liegt eine Datei, die keine gültige ANITEW-Sicherung ist. Sie wurde nicht verändert.',
  storage:
    'Der Abgleich selbst war erreichbar, aber ANITEW konnte den Verbindungszustand auf diesem Gerät nicht dauerhaft speichern. Die Anzeige wurde deshalb nicht umgeschaltet. Bitte versuche es noch einmal.',
  identity: 'Angemeldetes Google-Konto',
  connected: 'Google-Anmeldung abgeschlossen. Dein Konto ist jetzt verbunden.',
}

const DRIVE_EN: VisibleDriveCopy = {
  intro:
    'Your data stays under your control. ANITEW stores locally on this device by default. For multiple devices, sign in with Google and save your ANITEW data in your own Google Drive; ANITEW creates a visible “Anitew” folder there — without an additional ANITEW cloud copy.',
  how:
    'Sync safely merges your local state with your Drive state and writes the result back into your own folder.',
  start: 'Sign in / save data in Google Drive',
  again: 'Sync with Google Drive now',
  autoNote:
    'Automatic sync is active. ANITEW quietly syncs on open and after changes through your own Google Drive.',
  localNote:
    'Local mode: training, memories and history stay exclusively on this device.',
  stop: 'Sign out from Google · stay local',
  firstTime: 'Your “Anitew” folder was created in Google Drive and the current state was stored there.',
  remoteInvalid:
    'The “Anitew” folder contains a file that is not a valid ANITEW backup. It was left untouched.',
  storage:
    'Sync was reachable, but ANITEW could not save the connection state permanently on this device. The display was therefore not switched. Please try again.',
  identity: 'Signed-in Google account',
  connected: 'Google sign-in completed. Your account is now connected.',
}

function visibleCopy(): VisibleDriveCopy {
  return document.documentElement.lang.toLowerCase().startsWith('de') ? DRIVE_DE : DRIVE_EN
}

function driveFailure(error: unknown): DriveFailure | undefined {
  if (typeof error !== 'object' || error === null || !('reason' in error)) return undefined
  const reason = (error as { reason?: unknown }).reason
  return reason === 'denied' || reason === 'offline' || reason === 'drive' ? reason : undefined
}

function driveFailureDetail(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null || !('detail' in error)) return undefined
  const detail = (error as { detail?: unknown }).detail
  return typeof detail === 'string' && detail !== '' ? detail : undefined
}

class SyncStorageError extends Error {
  constructor() {
    super('sync-storage')
    this.name = 'SyncStorageError'
  }
}

function initials(name: string | undefined, email: string | undefined): string {
  if (name !== undefined) {
    const parts = name.trim().split(/\s+/u).filter(Boolean)
    const value = `${parts[0]?.[0] ?? ''}${parts.length > 1 ? parts.at(-1)?.[0] ?? '' : ''}`
    if (value !== '') return value.toUpperCase()
  }
  return (email?.[0] ?? 'G').toUpperCase()
}

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
  const [failureDetail, setFailureDetail] = useState<string | undefined>(undefined)
  const [account, setAccount] = useState<string | undefined>(undefined)
  const [accountName, setAccountName] = useState<string | undefined>(undefined)
  const [connectionNotice, setConnectionNotice] = useState(false)
  const connectedRef = useRef(false)
  const initializedRef = useRef(false)

  const refreshConnectionState = useCallback(
    async (announceResume: boolean) => {
      const [id, on, at, storedAccount, storedAccountName] = await Promise.all([
        resolveClientId(platform.settings),
        platform.settings.read<boolean>(SYNC_ON_SETTING).catch(() => undefined),
        platform.settings.read<number>(SYNC_AT_SETTING).catch(() => undefined),
        platform.settings.read<string>(SYNC_ACCOUNT_SETTING).catch(() => undefined),
        platform.settings.read<string>(SYNC_ACCOUNT_NAME_SETTING).catch(() => undefined),
      ])

      const connected = on === true
      setClientId(id)
      setChecked(true)
      setAuto(connected)
      setLastAt(connected ? at : undefined)
      setAccount(connected ? storedAccount : undefined)
      setAccountName(connected ? storedAccountName : undefined)

      if (announceResume && initializedRef.current && connected && !connectedRef.current) {
        setConnectionNotice(true)
        setFailure(undefined)
        setFailureDetail(undefined)
      }
      connectedRef.current = connected
      initializedRef.current = true
    },
    [platform],
  )

  useEffect(() => {
    const applyRedirectNotice = () => {
      const notice = takeDriveRedirectNotice()
      if (notice?.kind === 'connected') {
        setConnectionNotice(true)
        setFailure(undefined)
        setFailureDetail(undefined)
        return
      }
      if (notice?.kind === 'error') {
        setConnectionNotice(false)
        setFailure('drive')
        setFailureDetail(notice.detail)
      }
    }

    const refresh = (announceResume: boolean) => {
      void refreshConnectionState(announceResume)
        .then(applyRedirectNotice)
        .catch(() => setChecked(true))
    }

    refresh(false)

    const onResume = () => refresh(true)
    const onVisibility = () => {
      if (document.visibilityState === 'visible') onResume()
    }
    window.addEventListener('pageshow', onResume)
    window.addEventListener('focus', onResume)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('pageshow', onResume)
      window.removeEventListener('focus', onResume)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [refreshConnectionState])

  const sync = () => {
    if (clientId === undefined || busy) return
    setBusy(true)
    setFailure(undefined)
    setFailureDetail(undefined)
    setConnectionNotice(false)
    setReport(undefined)
    const now = platform.clock.now()
    void connectDriveSync(clientId, now)
      .then(async (result) => {
        /*
         * Die UI darf „verbunden“ erst behaupten, wenn dieser Zustand auch
         * einen Reload überlebt. `sync.on` wird zuletzt geschrieben und ist
         * damit der Commit-Marker für die übrigen lokalen Metadaten.
         */
        try {
          await platform.settings.write(SYNC_AT_SETTING, now)
          if (result.account !== undefined) {
            await platform.settings.write(SYNC_ACCOUNT_SETTING, result.account)
          } else await platform.settings.remove(SYNC_ACCOUNT_SETTING)
          if (result.accountName !== undefined) {
            await platform.settings.write(SYNC_ACCOUNT_NAME_SETTING, result.accountName)
          } else await platform.settings.remove(SYNC_ACCOUNT_NAME_SETTING)
          await platform.settings.write(SYNC_ON_SETTING, true)
        } catch {
          // Ohne dauerhaften Commit bleibt ANITEW lokal. Die OAuth-Sitzung
          // wird wieder geschlossen, damit kein versteckter „halb verbundener“
          // Zustand übrig bleibt. Die Logout-Schicht hat eine harte 5-s-Grenze;
          // offline merkt sie den Versuch für später vor.
          await disconnectGoogleAuthorization()
          throw new SyncStorageError()
        }

        setReport(result.report)
        setAuto(true)
        setLastAt(now)
        setAccount(result.account)
        setAccountName(result.accountName)
        connectedRef.current = true
      })
      .catch((error: unknown) => {
        setFailureDetail(driveFailureDetail(error))
        if (error instanceof SyncStorageError) setFailure('storage')
        else if (error instanceof SyncError) setFailure(error.reason)
        else setFailure(driveFailure(error) ?? 'drive')
      })
      .finally(() => setBusy(false))
  }

  const stop = () => {
    if (busy) return
    setBusy(true)
    setReport(undefined)
    setFailure(undefined)
    setFailureDetail(undefined)
    setConnectionNotice(false)

    void platform.settings
      .write(SYNC_ON_SETTING, false)
      .then(async () => {
        // `sync.on=false` ist die Commit-Grenze: Ab hier kann auch nach einem
        // Reload kein stiller Drive-Abgleich mehr starten. Deshalb folgt die
        // Oberfläche genau diesem dauerhaften Zustand sofort. Das Entfernen
        // der reinen Anzeige-Metadaten ist danach nur noch Aufräumarbeit und
        // darf ein erfolgreiches Trennen nicht wieder als Fehler darstellen.
        setAuto(false)
        setAccount(undefined)
        setAccountName(undefined)
        connectedRef.current = false
        setLastAt(undefined)
        // Der Worker löscht den HttpOnly-Cookie. Bis die Antwort da ist (oder
        // die bounded 5-s-Grenze greift), bleibt das Panel beschäftigt; so kann
        // kein neuer Login von einer verspäteten Logout-Antwort wieder gelöscht
        // werden. Offline bleibt nur die Retry-Marke, Sync selbst ist schon aus.
        await disconnectGoogleAuthorization()
        await Promise.allSettled([
          platform.settings.remove(SYNC_ACCOUNT_SETTING),
          platform.settings.remove(SYNC_ACCOUNT_NAME_SETTING),
          platform.settings.remove(SYNC_AT_SETTING),
        ])
      })
      .catch(() => setFailure('storage'))
      .finally(() => setBusy(false))
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

      {connectionNotice && (
        <p className="sync-report" role="status">
          {drive.connected}
        </p>
      )}
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
          {failure === 'remote-invalid'
            ? drive.remoteInvalid
            : failure === 'storage'
              ? drive.storage
              : texts.errors[failure]}
          {failureDetail === undefined ? '' : ` · ${failureDetail}`}
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
          <button type="button" className="quiet sync-stop" onClick={stop} disabled={busy}>
            {drive.stop}
          </button>
        </>
      ) : (
        <p className="sync-note">{drive.localNote}</p>
      )}
    </div>
  )
}
