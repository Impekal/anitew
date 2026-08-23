/**
 * Die Verdrahtung des Drive-Abgleichs (D-033).
 *
 * Der Kern kennt den Ablauf (`syncOnce`), die Plattform kennt Google, die
 * Datenschicht kennt die Datenbank — hier werden die drei zusammengesteckt
 * und sonst nichts. Auch der stille Abgleich beim Start läuft über genau
 * diesen einen Weg: ein Ablauf, keine zwei Wahrheiten.
 *
 * Wichtig für P4: Die konkrete Google-Drive-Implementierung wird erst geladen,
 * wenn Sync wirklich gebraucht wird. Ein neuer Nutzer ohne Drive-Verbindung
 * bezahlt dafür also keine Kaltstart-Bytes.
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

/* OAuth-Client-IDs sind öffentliche App-Kennungen, keine Secrets. ANITEW hat
 * genau eine eigene Web-App-Kennung; sie bleibt deshalb als sichere
 * Produkt-Voreinstellung verfügbar, damit ein normaler Build nicht aus
 * Versehen den sichtbaren Drive-Weg abschaltet. VITE_GOOGLE_CLIENT_ID und der
 * lokale Settings-Prüfpfad dürfen sie weiterhin übersteuern. */
const ANITEW_GOOGLE_CLIENT_ID =
  '360791045103-jvbjtv7mdatp4f5svtcfj7uabjm7jdok.apps.googleusercontent.com'

/** Client-Kennung: lokale Prüf-Einstellung → Buildwert → ANITEW-Standard. */
export async function resolveClientId(settings: SettingsStore): Promise<string> {
  const { DRIVE_CLIENT_SETTING, builtInClientId } = await import('../platform/web/drive.ts')
  const stored = await settings.read<string>(DRIVE_CLIENT_SETTING).catch(() => undefined)
  if (stored !== undefined && stored !== '') return stored
  return builtInClientId() ?? ANITEW_GOOGLE_CLIENT_ID
}

/**
 * Ein voller Abgleich: Token holen, herunterladen, einmischen, Vereinigung
 * hochladen. `silent` fragt nicht nach — scheitert es, wirft es leise
 * `denied`, und der Aufrufer entscheidet, ob das eine Meldung wert ist.
 */
export async function runDriveSync(
  clientId: string,
  silent: boolean,
  now: number,
): Promise<SyncReport> {
  const { requestDriveToken } = await import('../platform/web/drive.ts')
  const token = await requestDriveToken(clientId, silent)
  return syncWithToken(token, now)
}

/**
 * Der bewusste erste Weg: hörbar verbinden, dabei einmal fragen, wessen
 * Konto das ist. Name und E-Mail sind reine Anzeige; fehlen sie, funktioniert
 * der Abgleich trotzdem vollständig.
 */
export async function connectDriveSync(
  clientId: string,
  now: number,
): Promise<{
  report: SyncReport
  account: string | undefined
  accountName: string | undefined
}> {
  const { requestDriveToken, fetchAccountProfile } = await import('../platform/web/drive.ts')
  const token = await requestDriveToken(clientId, false, true)
  const identity = await fetchAccountProfile(token)
  const report = await syncWithToken(token, now)
  return {
    report,
    account: identity?.email,
    accountName: identity?.name,
  }
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
      // „Neu hierher“ heißt beides: ganz neue Datensätze und reichere
      // Fassungen, die die hiesigen ersetzt haben.
      return { addedTotal: added + report.replaced }
    },
  })
}

/*
 * Der unsichtbare Abgleich: Wer ihn einmal gewollt hat, muss nicht mehr daran
 * denken. Nach einer Einheit oder einer Änderung am Memory-Graphen wird —
 * entprellt und still — abgeglichen. Scheitert es, bleibt die App lokal
 * vollständig nutzbar und der nächste Anlass versucht es wieder.
 */
let pendingSync: ReturnType<typeof setTimeout> | undefined
let syncRunning = false

export function scheduleDriveSync(platform: Platform, delayMs = 4_000): void {
  if (pendingSync !== undefined) clearTimeout(pendingSync)
  pendingSync = setTimeout(() => {
    pendingSync = undefined
    // Eine Änderung darf nicht verloren gehen, nur weil der stille Start-
    // Abgleich noch läuft. In dem Fall versuchen wir kurz danach erneut.
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
