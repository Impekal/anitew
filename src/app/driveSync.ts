/**
 * Die Verdrahtung des Drive-Abgleichs (D-033).
 *
 * Der Kern kennt den Ablauf (`syncOnce`), die Plattform kennt Google, die
 * Datenschicht kennt die Datenbank — hier werden die drei zusammengesteckt
 * und sonst nichts. Auch der stille Abgleich beim Start läuft über genau
 * diesen einen Weg: ein Ablauf, keine zwei Wahrheiten.
 */

import { type Platform, type SettingsStore, type SyncReport, syncOnce } from '../core/index.ts'
import { exportBackup, importBackup } from '../data/backup.ts'
import {
  DRIVE_CLIENT_SETTING,
  builtInClientId,
  downloadDriveBackup,
  fetchAccountEmail,
  requestDriveToken,
  uploadDriveBackup,
} from '../platform/web/drive.ts'

/** Merkt sich, dass der Abgleich gewollt ist — für den stillen Start. */
export const SYNC_ON_SETTING = 'sync.on'
/** Wann zuletzt abgeglichen wurde (nur Anzeige, nur dieses Gerät). */
export const SYNC_AT_SETTING = 'sync.lastAt'
/** Wessen Google-Konto verbunden ist (nur Anzeige, nur dieses Gerät). */
export const SYNC_ACCOUNT_SETTING = 'sync.account'

/** Die Client-Kennung: aus dem Bau — oder aus den Einstellungen (Prüfpfad). */
export async function resolveClientId(settings: SettingsStore): Promise<string | undefined> {
  const stored = await settings.read<string>(DRIVE_CLIENT_SETTING).catch(() => undefined)
  return stored !== undefined && stored !== '' ? stored : builtInClientId()
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
  const token = await requestDriveToken(clientId, silent)
  return syncWithToken(token, now)
}

/**
 * Der bewusste erste Weg (V2: das Google-Konto als Identität): hörbar
 * verbinden, dabei einmal fragen, **wessen** Konto das ist — die E-Mail
 * ist Anzeige, kein Tragwerk; fehlt sie, fehlt nur die Zeile.
 */
export async function connectDriveSync(
  clientId: string,
  now: number,
): Promise<{ report: SyncReport; account: string | undefined }> {
  const token = await requestDriveToken(clientId, false, true)
  const account = await fetchAccountEmail(token)
  const report = await syncWithToken(token, now)
  return { report, account }
}

function syncWithToken(token: string, now: number): Promise<SyncReport> {
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
 * Der unsichtbare Abgleich (V2): Wer ihn einmal gewollt hat, muss nicht
 * mehr daran denken. Nach einer Einheit oder einer Änderung am
 * Memory-Graphen wird — entprellt und still — abgeglichen. Scheitert es
 * (kein Netz, Google will neu fragen), passiert **nichts** Sichtbares:
 * Der nächste Anlass oder der nächste Start versucht es wieder, und die
 * Abgleich-Seite bleibt der hörbare Weg.
 */
let pendingSync: ReturnType<typeof setTimeout> | undefined
let syncRunning = false

export function scheduleDriveSync(platform: Platform, delayMs = 4_000): void {
  if (pendingSync !== undefined) clearTimeout(pendingSync)
  pendingSync = setTimeout(() => {
    pendingSync = undefined
    if (syncRunning) return
    void (async () => {
      const on = await platform.settings.read<boolean>(SYNC_ON_SETTING).catch(() => undefined)
      if (on !== true) return
      const clientId = await resolveClientId(platform.settings)
      if (clientId === undefined) return
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
