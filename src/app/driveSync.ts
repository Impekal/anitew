/**
 * Die Verdrahtung des Drive-Abgleichs (D-033).
 *
 * Der Kern kennt den Ablauf (`syncOnce`), die Plattform kennt Google, die
 * Datenschicht kennt die Datenbank — hier werden die drei zusammengesteckt.
 * Die bewusste Google-Anmeldung läuft als Redirect; danach liefert der
 * stateless Worker ein kurzlebiges Access-Token aus der verschlüsselten
 * Browser-Sitzung. Drive-Inhalte selbst bleiben Browser ↔ Google.
 */

import { type Platform, type SettingsStore, type SyncReport, syncOnce } from '../core/index.ts'
import { exportBackup, importBackup } from '../data/backup.ts'

/** Merkt sich, dass der Abgleich gewollt ist — für den stillen Start. */
export const SYNC_ON_SETTING = 'sync.on'
/** Wann zuletzt abgeglichen wurde (nur Anzeige, nur dieses Gerät). */
export const SYNC_AT_SETTING = 'sync.lastAt'
/** E-Mail des verbundenen Google-Kontos (nur Anzeige, nur dieses Gerät). */
export const SYNC_ACCOUNT_SETTING = 'sync.account'
/** Anzeigename des verbundenen Google-Kontos (nur Anzeige, nur dieses Gerät). */
export const SYNC_ACCOUNT_NAME_SETTING = 'sync.accountName'

const ANITEW_GOOGLE_CLIENT_ID =
  '360791045103-jvbjtv7mdatp4f5svtcfj7uabjm7jdok.apps.googleusercontent.com'

/** Client-Kennung: lokale Prüf-Einstellung → Buildwert → ANITEW-Standard. */
export async function resolveClientId(settings: SettingsStore): Promise<string> {
  const { DRIVE_CLIENT_SETTING, builtInClientId } = await import('../platform/web/drive.ts')
  const stored = await settings.read<string>(DRIVE_CLIENT_SETTING).catch(() => undefined)
  if (stored !== undefined && stored !== '') return stored
  return builtInClientId() ?? ANITEW_GOOGLE_CLIENT_ID
}

function needsInteractiveAuthorization(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false
  const reason = 'reason' in error ? (error as { reason?: unknown }).reason : undefined
  const detail = 'detail' in error ? (error as { detail?: unknown }).detail : undefined
  return (
    reason === 'denied' &&
    (detail === 'not_signed_in' ||
      detail === 'invalid_session' ||
      detail === 'session_expired' ||
      detail === 'refresh_failed' ||
      detail === 'oauth_session_missing')
  )
}

async function tokenFor(clientId: string, silent: boolean): Promise<string> {
  const { requestDriveToken } = await import('../platform/web/drive.ts')
  return requestDriveToken(clientId, silent)
}

/** Stiller Abgleich benutzt eine bereits bestehende OAuth-Browser-Sitzung. */
export async function runDriveSync(
  clientId: string,
  silent: boolean,
  now: number,
): Promise<SyncReport> {
  const token = await tokenFor(clientId, silent)
  return syncWithToken(token, now)
}

async function connectedResult(clientId: string, now: number): Promise<{
  report: SyncReport
  account: string | undefined
  accountName: string | undefined
}> {
  const token = await tokenFor(clientId, false)
  const { fetchAccountProfile } = await import('../platform/web/drive.ts')
  const identity = await fetchAccountProfile(token)
  const report = await syncWithToken(token, now)
  return {
    report,
    account: identity?.email,
    accountName: identity?.name,
  }
}

/**
 * Bewusste Anmeldung/Abgleich. Fehlt die sichere Browser-Sitzung, beginnt
 * ANITEW den Google-Code-Flow als komplette Seitennavigation. Anders als ein
 * Popup funktioniert dieser Weg auch mit iOS/ITP zuverlässig.
 */
export async function connectDriveSync(
  clientId: string,
  now: number,
): Promise<{
  report: SyncReport
  account: string | undefined
  accountName: string | undefined
}> {
  try {
    return await connectedResult(clientId, now)
  } catch (error) {
    if (!needsInteractiveAuthorization(error)) throw error
    const { beginDriveAuthorization } = await import('../platform/web/drive.ts')
    beginDriveAuthorization(clientId)
    // Die Seite navigiert jetzt zu Google. Diese Promise soll keinen lokalen
    // Fehlerzustand mehr auslösen, solange der Browser die Seite verlässt.
    return await new Promise<never>(() => undefined)
  }
}

/** Nach Googles Redirect: ohne weiteren Redirect den ersten Sync abschließen. */
export async function finishDriveAuthorization(
  clientId: string,
  now: number,
): Promise<{
  report: SyncReport
  account: string | undefined
  accountName: string | undefined
}> {
  return connectedResult(clientId, now)
}

async function syncWithToken(token: string, now: number): Promise<SyncReport> {
  const { downloadDriveBackup, uploadDriveBackup } = await import('../platform/web/drive.ts')
  return syncOnce({
    download: () => downloadDriveBackup(token),
    upload: (file) => uploadDriveBackup(token, file),
    exportLocal: () => exportBackup(now, __ANITEW_BUILD__.commit),
    importRemote: async (file) => {
      const report = await importBackup(file)
      const added = Object.values(report.added).reduce((sum, count) => sum + count, 0)
      return { addedTotal: added + report.replaced }
    },
  })
}

let pendingSync: ReturnType<typeof setTimeout> | undefined
let syncRunning = false

export function scheduleDriveSync(platform: Platform, delayMs = 4_000): void {
  if (pendingSync !== undefined) clearTimeout(pendingSync)
  pendingSync = setTimeout(() => {
    pendingSync = undefined
    if (syncRunning) {
      scheduleDriveSync(platform, 1_000)
      return
    }
    void (async () => {
      const on = await platform.settings.read<boolean>(SYNC_ON_SETTING).catch(() => undefined)
      if (on !== true) return
      const clientId = await resolveClientId(platform.settings)
      syncRunning = true
      try {
        const now = platform.clock.now()
        await runDriveSync(clientId, true, now)
        await platform.settings.write(SYNC_AT_SETTING, now)
      } finally {
        syncRunning = false
      }
    })().catch(() => undefined)
  }, delayMs)
}
