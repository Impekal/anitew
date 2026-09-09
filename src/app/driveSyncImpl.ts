import { type SyncReport, syncOnce } from '../core/index.ts'
import { exportBackup, importBackup } from '../data/backup.ts'
import { prepareDriveBackupForImport } from '../data/driveSyncSettings.ts'

/**
 * Das leer gebliebene Drive-Kästchen — einmal erklären, dann hinführen.
 *
 * Nach so einer Anmeldung liegt eine **gültige** Google-Sitzung im Browser,
 * 180 Tage lang. Sie kann alles außer Drive. Der Knopf lief gegen sie, bekam
 * vom Worker wieder `drive_granted: false` und warf — ohne je zu Google
 * zurückzuführen. Gemessen am 09.09., den Gerätebildschirm nachgebaut:
 *
 *   Weiterleitungen zu accounts.google.com   0
 *   Meldung danach   „Anmeldung nicht abgeschlossen … · drive_scope_missing"
 *
 * Beides falsch: Die Anmeldung *war* abgeschlossen, und Googles Kürzel stand
 * wieder da, wo seit dem 01.09. ein Satz stehen soll. Der eigene Hinweistext
 * `boxMissing` verlangt „Melde dich noch einmal an und setze dort den
 * Haken" — und der einzige Knopf, den er anbietet, konnte das nicht. Auf dem
 * Erstbildschirm gibt es nicht einmal einen Trennen-Knopf, mit dem man
 * herauskäme.
 *
 * Warum nicht einfach immer sofort zurück zu Google? Weil dann niemand mehr
 * erführe, **welches** Kästchen leer blieb — genau die Auskunft, die am
 * 02.09. vom Gerät verlangt wurde, und ein Wächter hält sie fest. Wer
 * wortlos zur selben Seite zurückgeschickt wird, übersieht dasselbe Kästchen
 * ein zweites Mal.
 *
 * Also: **beim ersten Mal erklären, beim nächsten Tipp hinführen.** Der
 * zweite Tipp ist die Antwort des Menschen auf den Hinweis; er hat ihn
 * gelesen und will los. Ein Neuladen setzt das zurück — dann erklärt die App
 * eben noch einmal, statt stumm wegzuspringen. Eine Sackgasse ist es nie
 * mehr.
 */
let zustimmungFaellig = false

/** Ist das genau der Fehler „Drive-Kästchen blieb leer"? */
function istKaestchenLeer(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false
  const reason = 'reason' in error ? (error as { reason?: unknown }).reason : undefined
  const detail = 'detail' in error ? (error as { detail?: unknown }).detail : undefined
  return reason === 'blocked' && detail === 'drive_scope_missing'
}

function needsInteractiveAuthorization(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false
  const reason = 'reason' in error ? (error as { reason?: unknown }).reason : undefined
  const detail = 'detail' in error ? (error as { detail?: unknown }).detail : undefined
  if (istKaestchenLeer(error)) {
    if (zustimmungFaellig) return true
    // Erst der Satz, den der Bildschirm daraus macht. Der nächste Tipp führt.
    zustimmungFaellig = true
    return false
  }
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

async function syncWithToken(token: string, now: number): Promise<SyncReport> {
  const { downloadDriveBackup, uploadDriveBackup } = await import('../platform/web/drive.ts')
  return syncOnce({
    download: () => downloadDriveBackup(token),
    upload: (file) => uploadDriveBackup(token, file),
    exportLocal: () => exportBackup(now, __ANITEW_BUILD__.commit),
    importRemote: async (file) => {
      const prepared = await prepareDriveBackupForImport(file)
      const report = await importBackup(prepared)
      const added = Object.values(report.added).reduce((sum, count) => sum + count, 0)
      return { addedTotal: added + report.replaced }
    },
  })
}

export async function runDriveSyncImpl(
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

export async function connectDriveSyncImpl(
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
    return await new Promise<never>(() => undefined)
  }
}

/**
 * Nach Googles Redirect: ohne weiteren Redirect den ersten Sync abschließen.
 *
 * Hier wird nie weitergeleitet — sonst spränge die App beim Zurückkommen
 * sofort wieder los, ohne dass jemand etwas läse. Bleibt das Drive-Kästchen
 * leer, gilt der Satz, den `driveRedirectFeedback` daraus macht, als die
 * eine Erklärung: Der nächste Tipp auf den Knopf führt dann zu Google, statt
 * ein zweites Mal gegen dieselbe taube Sitzung zu laufen.
 */
export async function finishDriveAuthorizationImpl(
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
    if (istKaestchenLeer(error)) zustimmungFaellig = true
    throw error
  }
}
