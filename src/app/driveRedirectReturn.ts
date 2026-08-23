import { createWebPlatform } from '../platform/web/index.ts'
import {
  SYNC_ACCOUNT_NAME_SETTING,
  SYNC_ACCOUNT_SETTING,
  SYNC_AT_SETTING,
  SYNC_ON_SETTING,
  finishDriveAuthorization,
  resolveClientId,
} from './driveSync.ts'

export const DRIVE_REDIRECT_NOTICE = 'anitew.google.oauth.notice.v1'

export type DriveRedirectNotice =
  | { kind: 'connected'; account?: string; accountName?: string }
  | { kind: 'error'; detail: string }

function detailOf(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'detail' in error) {
    const detail = (error as { detail?: unknown }).detail
    if (typeof detail === 'string' && detail !== '') return detail
  }
  return error instanceof Error && error.message !== '' ? error.message : 'oauth_return_failed'
}

function storeNotice(notice: DriveRedirectNotice): void {
  try {
    window.sessionStorage.setItem(DRIVE_REDIRECT_NOTICE, JSON.stringify(notice))
  } catch {
    // Die Anmeldung selbst darf nicht davon abhängen, ob sessionStorage geht.
  }
}

function cleanOAuthQuery(): void {
  const url = new URL(window.location.href)
  url.searchParams.delete('googleOAuth')
  url.searchParams.delete('detail')
  window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`)
}

/**
 * Wird nur bei der Rückkehr von /oauth/google/callback aufgerufen und läuft
 * vor dem React-Render. Dadurch liest die App direkt den bereits vereinigten
 * lokalen/Drive-Stand und zeigt kein veraltetes Zwischenbild.
 */
export async function finishGoogleDriveRedirect(): Promise<void> {
  const url = new URL(window.location.href)
  const status = url.searchParams.get('googleOAuth')
  if (status === null) return

  if (status !== 'complete') {
    storeNotice({ kind: 'error', detail: url.searchParams.get('detail') ?? status })
    cleanOAuthQuery()
    return
  }

  const platform = createWebPlatform()
  try {
    const clientId = await resolveClientId(platform.settings)
    const now = platform.clock.now()
    const result = await finishDriveAuthorization(clientId, now)
    await platform.settings.write(SYNC_ON_SETTING, true)
    await platform.settings.write(SYNC_AT_SETTING, now)
    if (result.account !== undefined) {
      await platform.settings.write(SYNC_ACCOUNT_SETTING, result.account)
    }
    if (result.accountName !== undefined) {
      await platform.settings.write(SYNC_ACCOUNT_NAME_SETTING, result.accountName)
    }
    storeNotice({
      kind: 'connected',
      account: result.account,
      accountName: result.accountName,
    })
  } catch (error) {
    storeNotice({ kind: 'error', detail: detailOf(error) })
  } finally {
    cleanOAuthQuery()
  }
}
