export const DRIVE_REDIRECT_NOTICE = 'anitew.google.oauth.notice.v1'

export type DriveRedirectNotice =
  | { kind: 'connected'; account?: string; accountName?: string }
  | { kind: 'error'; detail: string }

export function storeDriveRedirectNotice(notice: DriveRedirectNotice): void {
  try {
    window.sessionStorage.setItem(DRIVE_REDIRECT_NOTICE, JSON.stringify(notice))
  } catch {
    // Nur Rueckmeldung. Die OAuth-Sitzung selbst darf nie davon abhaengen.
  }
}

export function takeDriveRedirectNotice(): DriveRedirectNotice | undefined {
  try {
    const raw = window.sessionStorage.getItem(DRIVE_REDIRECT_NOTICE)
    if (raw === null) return undefined
    window.sessionStorage.removeItem(DRIVE_REDIRECT_NOTICE)
    const parsed = JSON.parse(raw) as Partial<DriveRedirectNotice>
    if (parsed.kind === 'connected') {
      return {
        kind: 'connected',
        account: typeof parsed.account === 'string' ? parsed.account : undefined,
        accountName: typeof parsed.accountName === 'string' ? parsed.accountName : undefined,
      }
    }
    if (parsed.kind === 'error' && typeof parsed.detail === 'string') {
      return { kind: 'error', detail: parsed.detail }
    }
  } catch {
    // Eine kaputte Statusmeldung ist kein kaputtes Google-Konto.
  }
  return undefined
}
