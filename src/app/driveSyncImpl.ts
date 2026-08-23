import { type SyncReport, syncOnce } from '../core/index.ts'
import { exportBackup, importBackup } from '../data/backup.ts'

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

export async function finishDriveAuthorizationImpl(
  clientId: string,
  now: number,
): Promise<{
  report: SyncReport
  account: string | undefined
  accountName: string | undefined
}> {
  return connectedResult(clientId, now)
}
