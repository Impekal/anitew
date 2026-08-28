import type { BackupFile } from '../core/backup.ts'
import { mergeDriveSettingValue } from '../core/sync/settings.ts'
import { db } from './db.ts'

/**
 * Bereitet nur den automatischen Drive-Abgleich vor.
 *
 * `importBackup` bleibt damit eine echte Wiederherstellung: Wer absichtlich
 * eine Sicherungsdatei importiert, bekommt weiterhin deren Einstellungen.
 * Drive dagegen führt vorhandene lokale Einstellungen konfliktfest zusammen,
 * bevor derselbe bewährte Importpfad läuft.
 */
export async function prepareDriveBackupForImport(file: BackupFile): Promise<BackupFile> {
  const remoteSettings = file.tables.settings
  if (remoteSettings.length === 0) return file

  const localSettings = await db.settings.bulkGet(remoteSettings.map((setting) => setting.key))
  const settings = remoteSettings.map((remote, index) => {
    const local = localSettings[index]
    if (local === undefined) return remote
    return {
      key: remote.key,
      value: mergeDriveSettingValue(remote.key, local.value, remote.value),
    }
  })

  return {
    ...file,
    tables: {
      ...file.tables,
      settings,
    },
  }
}
