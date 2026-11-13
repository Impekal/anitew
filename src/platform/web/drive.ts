/**
 * Google-Anmeldung und sichtbarer Drive-Ordner (Backlog N7/N8 · D-033).
 *
 * iOS/ITP schließt Googles Token-Popup nach der Anmeldung, bevor der
 * JavaScript-Callback zuverlässig zurückkommt. ANITEW nutzt deshalb für die
 * bewusste Anmeldung den robusteren Redirect-Code-Flow. Der kleine
 * Cloudflare-Worker tauscht ausschließlich den OAuth-Code gegen Tokens; er
 * hat keine Nutzerdatenbank und sieht keine Trainings-/Erinnerungsdaten.
 * Drive-Dateien laufen weiterhin direkt zwischen Browser und Google Drive.
 */

import type { BackupFile } from '../../core/index.ts'
import { DRIVE_FILE_NAME, DRIVE_FOLDER_NAME, DRIVE_SCOPE } from '../../core/sync/drive.ts'

/** Wo die Einstellungen die Client-Kennung übersteuern dürfen. */
export const DRIVE_CLIENT_SETTING = 'sync.clientId'

/** Die zur Bauzeit hinterlegte Client-Kennung — oder nichts. */
export function builtInClientId(): string | undefined {
  const id = import.meta.env['VITE_GOOGLE_CLIENT_ID'] as string | undefined
  return id === undefined || id === '' ? undefined : id
}

/**
 * `denied` heisst: Die **Anmeldung** traegt nicht mehr (401) — beim naechsten
 * Versuch fragt Google erneut. `blocked` heisst: Die Anmeldung traegt, aber
 * Google Drive lehnt die Anfrage ab (403). Das ist nicht dasselbe, und die
 * Verwechslung war auf dem Geraet zu sehen: Der Bildschirm sagte „die
 * Anmeldung kam nicht zustande", obwohl sie gerade funktioniert hatte — wer
 * daraufhin noch einmal zustimmt, landet beim selben 403.
 */
export type DriveFailure = 'denied' | 'offline' | 'drive' | 'blocked'

export class DriveError extends Error {
  constructor(
    readonly reason: DriveFailure,
    readonly detail?: string,
  ) {
    super(detail ?? reason)
    this.name = 'DriveError'
  }
}

const IDENTITY_SCOPE = 'openid email profile'
const GOOGLE_AUTH = 'https://accounts.google.com/o/oauth2/v2/auth'
const OAUTH_CALLBACK_PATH = '/oauth/google/callback'
const OAUTH_STATE_COOKIE = 'anitew_google_oauth_state'

function randomState(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24))
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/u, '')
}

/**
 * Startet den Google-Code-Flow als echte Seitennavigation. Es gibt bewusst
 * keinen Popup-Callback mehr: Safari und Firefox auf iOS behandeln den
 * Redirect stabil, während GIS Token-Popups dort nach erfolgreicher Anmeldung
 * als `popup_closed` zurückkommen können.
 */
export function beginDriveAuthorization(clientId: string): void {
  const state = randomState()
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${OAUTH_STATE_COOKIE}=${state}; Path=/; Max-Age=600; SameSite=Lax${secure}`

  const target = new URL(GOOGLE_AUTH)
  target.searchParams.set('client_id', clientId)
  target.searchParams.set('redirect_uri', `${window.location.origin}${OAUTH_CALLBACK_PATH}`)
  target.searchParams.set('response_type', 'code')
  target.searchParams.set('scope', `${DRIVE_SCOPE} ${IDENTITY_SCOPE}`)
  target.searchParams.set('access_type', 'offline')
  target.searchParams.set('include_granted_scopes', 'true')
  target.searchParams.set('prompt', 'consent')
  target.searchParams.set('state', state)
  window.location.assign(target.toString())
}

/**
 * Zugriffstoken aus der verschlüsselten, HttpOnly Browser-Sitzung holen. Der
 * Worker speichert nichts in einer Datenbank; bei Bedarf erneuert er das
 * kurzlebige Access-Token mit dem ebenfalls verschlüsselt im Browser liegenden
 * Refresh-Token.
 */
export async function requestDriveToken(
  _clientId: string,
  _silent: boolean,
  _withIdentity = false,
): Promise<string> {
  let response: Response
  try {
    response = await fetch('/oauth/google/access-token', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'x-anitew-request': '1' },
    })
  } catch {
    throw new DriveError('offline', 'oauth_worker_unreachable')
  }

  if (response.status === 401) {
    const body = (await response.json().catch(() => ({}))) as { error?: unknown }
    throw new DriveError(
      'denied',
      typeof body.error === 'string' ? body.error : 'oauth_session_missing',
    )
  }
  if (!response.ok) throw new DriveError('drive', `oauth_worker_http_${response.status}`)

  const body = (await response.json().catch(() => ({}))) as {
    access_token?: unknown
    drive_granted?: unknown
  }
  if (typeof body.access_token !== 'string' || body.access_token === '') {
    throw new DriveError('drive', 'oauth_access_token_missing')
  }
  /*
   * Das leere Kästchen, vor dem ersten Schreibversuch (Gerätebild 02.09.).
   *
   * Googles Zustimmungsbildschirm führt `drive.file` als eigenes, anfangs
   * leeres Kästchen. Bleibt es leer, ist die Anmeldung gültig — nur ohne
   * Drive. Vorher fiel das erst beim ersten Zugriff auf, als
   * `drive_403_insufficientPermissions`: Googles Kürzel auf einem
   * Bildschirm, der von Anmeldung sprach.
   *
   * `blocked`, nicht `denied`: `denied` heißt in `driveSyncImpl` „Sitzung
   * weg" und schickt sofort und wortlos zu Google zurück. Die Sitzung ist
   * hier aber gültig. Zurück muss man trotzdem — aber wissend, was fehlt.
   *
   * Nur ein ausdrückliches `false` hält an. Sitzungen aus der Zeit vor
   * dieser Auskunft tragen das Feld nicht; ihnen die Freigabe abzusprechen
   * wäre eine erfundene Auskunft.
   */
  if (body.drive_granted === false) throw new DriveError('blocked', 'drive_scope_missing')
  return body.access_token
}

/** Entfernt die Browser-OAuth-Sitzung und widerruft sie bei Google best effort. */
export async function disconnectDriveAuthorization(): Promise<void> {
  await fetch('/oauth/google/logout', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'x-anitew-request': '1' },
  }).catch(() => undefined)
}

async function driveFetch(token: string, url: string, init?: RequestInit): Promise<Response> {
  let response: Response
  try {
    response = await fetch(url, {
      ...init,
      headers: { ...init?.headers, authorization: `Bearer ${token}` },
    })
  } catch {
    throw new DriveError('offline', 'drive_fetch_failed')
  }
  if (response.status === 401) throw new DriveError('denied', 'drive_http_401')
  if (response.status === 403) {
    throw new DriveError('blocked', `drive_403_${await googleReason(response)}`)
  }
  if (!response.ok) throw new DriveError('drive', `drive_http_${response.status}`)
  return response
}

/**
 * Googles eigener Grund, statt einer nackten Zahl.
 *
 * Google legt ihn in den Antwortkoerper (`error.errors[0].reason`, sonst
 * `error.status`): `accessNotConfigured`, wenn die Drive-API fuer das Projekt
 * nicht freigeschaltet ist; `insufficientPermissions`, wenn die erteilte
 * Freigabe nicht reicht; `storageQuotaExceeded`, wenn das Drive voll ist;
 * `rateLimitExceeded` bei zu vielen Anfragen. Das sind vier voellig
 * verschiedene Lagen mit vier verschiedenen Auswegen — und `drive_http_403`
 * unterschied sie nicht.
 *
 * Kein Wort aus dem Koerper wird uebersetzt oder ausgeschmueckt: Was hier
 * steht, ist Googles Kennung, damit sie sich nachschlagen laesst.
 */
async function googleReason(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as {
      error?: { errors?: { reason?: unknown }[]; status?: unknown }
    }
    const reason = body.error?.errors?.[0]?.reason
    if (typeof reason === 'string' && reason !== '') return reason
    const status = body.error?.status
    if (typeof status === 'string' && status !== '') return status
  } catch {
    // Kein lesbarer Koerper — dann bleibt die Zahl, und das ist ehrlicher
    // als ein erfundener Grund.
  }
  return 'ohne_grund'
}

export interface DriveAccountProfile {
  email?: string
  name?: string
}

/** Name/E-Mail dienen nur zur Anzeige des angemeldeten Google-Kontos. */
export async function fetchAccountProfile(token: string): Promise<DriveAccountProfile | undefined> {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { authorization: `Bearer ${token}` },
    })
    if (!response.ok) return undefined
    const body = (await response.json()) as { email?: unknown; name?: unknown }
    const profile: DriveAccountProfile = {}
    if (typeof body.email === 'string' && body.email !== '') profile.email = body.email
    if (typeof body.name === 'string' && body.name.trim() !== '') profile.name = body.name.trim()
    return profile.email === undefined && profile.name === undefined ? undefined : profile
  } catch {
    return undefined
  }
}

/** Rückwärtskompatibler Helfer für Aufrufer, die nur die E-Mail brauchen. */
export async function fetchAccountEmail(token: string): Promise<string | undefined> {
  return (await fetchAccountProfile(token))?.email
}

const FILES = 'https://www.googleapis.com/drive/v3/files'
const UPLOAD = 'https://www.googleapis.com/upload/drive/v3/files'
const FOLDER_MIME = 'application/vnd.google-apps.folder'

function quoteDriveQuery(value: string): string {
  return value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")
}

async function findFolderId(token: string): Promise<string | undefined> {
  const name = quoteDriveQuery(DRIVE_FOLDER_NAME)
  const query = encodeURIComponent(`name='${name}' and mimeType='${FOLDER_MIME}' and trashed=false`)
  const response = await driveFetch(
    token,
    `${FILES}?spaces=drive&q=${query}&fields=files(id)&pageSize=10`,
  )
  const body = (await response.json()) as { files?: { id: string }[] }
  return body.files?.[0]?.id
}

async function ensureFolderId(token: string): Promise<string> {
  const present = await findFolderId(token)
  if (present !== undefined) return present

  const response = await driveFetch(token, `${FILES}?fields=id`, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({ name: DRIVE_FOLDER_NAME, mimeType: FOLDER_MIME }),
  })
  const body = (await response.json()) as { id?: unknown }
  if (typeof body.id !== 'string' || body.id === '') throw new DriveError('drive', 'folder_id_missing')
  return body.id
}

async function findFileId(token: string, folderId: string): Promise<string | undefined> {
  const name = quoteDriveQuery(DRIVE_FILE_NAME)
  const parent = quoteDriveQuery(folderId)
  const query = encodeURIComponent(`name='${name}' and '${parent}' in parents and trashed=false`)
  const response = await driveFetch(
    token,
    `${FILES}?spaces=drive&q=${query}&fields=files(id)&pageSize=10`,
  )
  const body = (await response.json()) as { files?: { id: string }[] }
  return body.files?.[0]?.id
}

/** Liest die Sicherung aus dem sichtbaren Anitew-Ordner. */
export async function downloadDriveBackup(token: string): Promise<unknown | undefined> {
  const folderId = await findFolderId(token)
  if (folderId === undefined) return undefined
  const id = await findFileId(token, folderId)
  if (id === undefined) return undefined
  const response = await driveFetch(token, `${FILES}/${id}?alt=media`)
  const text = await response.text()
  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

/**
 * Löscht ausschließlich ANITEWs eigene Sicherungsdatei. Der sichtbare Ordner
 * bleibt absichtlich bestehen: Darin könnten Nutzer selbst weitere Dateien
 * abgelegt haben, die ANITEW niemals ungefragt löschen darf.
 */
export async function deleteDriveBackup(token: string): Promise<boolean> {
  const folderId = await findFolderId(token)
  if (folderId === undefined) return false
  const id = await findFileId(token, folderId)
  if (id === undefined) return false
  await driveFetch(token, `${FILES}/${id}`, { method: 'DELETE' })
  return true
}

/** Schreibt die Sicherung in `Anitew/` — Ordner/Datei anlegen oder ersetzen. */
export async function uploadDriveBackup(token: string, file: BackupFile): Promise<void> {
  const body = JSON.stringify(file)
  const folderId = await ensureFolderId(token)
  const id = await findFileId(token, folderId)
  if (id !== undefined) {
    await driveFetch(token, `${UPLOAD}/${id}?uploadType=media`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body,
    })
    return
  }

  const boundary = 'anitew-sicherung'
  const multipart = [
    `--${boundary}`,
    'Content-Type: application/json; charset=UTF-8',
    '',
    JSON.stringify({ name: DRIVE_FILE_NAME, parents: [folderId] }),
    `--${boundary}`,
    'Content-Type: application/json',
    '',
    body,
    `--${boundary}--`,
  ].join('\r\n')
  await driveFetch(token, `${UPLOAD}?uploadType=multipart`, {
    method: 'POST',
    headers: { 'content-type': `multipart/related; boundary=${boundary}` },
    body: multipart,
  })
}
