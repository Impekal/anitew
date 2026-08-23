/**
 * Die Verdrahtung des Drive-Abgleichs (D-033).
 *
 * Der Start braucht nur die Einstellungsnamen und den kleinen Scheduler.
 * Token, Backup-Merge und Google-Drive-Transfer werden erst geladen, wenn
 * Abgleich wirklich aktiv ist oder der Mensch die Sync-Seite benutzt.
 */

import type { Platform, SettingsStore, SyncReport } from '../core/index.ts'

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

/** Stiller Abgleich benutzt eine bereits bestehende OAuth-Browser-Sitzung. */
export async function runDriveSync(
  clientId: string,
  silent: boolean,
  now: number,
): Promise<SyncReport> {
  const sync = await import('./driveSyncImpl.ts')
  return sync.runDriveSyncImpl(clientId, silent, now)
}

/**
 * Bewusste Anmeldung/Abgleich. Fehlt die sichere Browser-Sitzung, beginnt der
 * Lazy-Teil den Google-Code-Flow als komplette Seitennavigation.
 */
export async function connectDriveSync(
  clientId: string,
  now: number,
): Promise<{
  report: SyncReport
  account: string | undefined
  accountName: string | undefined
}> {
  const sync = await import('./driveSyncImpl.ts')
  return sync.connectDriveSyncImpl(clientId, now)
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
  const sync = await import('./driveSyncImpl.ts')
  return sync.finishDriveAuthorizationImpl(clientId, now)
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
