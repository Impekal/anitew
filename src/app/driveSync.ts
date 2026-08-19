/**
 * Die Verdrahtung des Drive-Abgleichs (D-033).
 *
 * Der Kern kennt den Ablauf (`syncOnce`), die Plattform kennt Google, die
 * Datenschicht kennt die Datenbank — hier werden die drei zusammengesteckt
 * und sonst nichts. Auch der stille Abgleich beim Start läuft über genau
 * diesen einen Weg: ein Ablauf, keine zwei Wahrheiten.
 */

import { type SettingsStore, type SyncReport, syncOnce } from '../core/index.ts'
import { exportBackup, importBackup } from '../data/backup.ts'
import {
  DRIVE_CLIENT_SETTING,
  builtInClientId,
  downloadDriveBackup,
  requestDriveToken,
  uploadDriveBackup,
} from '../platform/web/drive.ts'

/** Merkt sich, dass der Abgleich gewollt ist — für den stillen Start. */
export const SYNC_ON_SETTING = 'sync.on'
/** Wann zuletzt abgeglichen wurde (nur Anzeige, nur dieses Gerät). */
export const SYNC_AT_SETTING = 'sync.lastAt'

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
