/**
 * Google-Anmeldung und sichtbarer Drive-Ordner (Backlog N7/N8 · D-033).
 *
 * Zwei Drähte, beide so schmal wie möglich:
 *
 * - **Anmeldung** über Googles eigenes Identity-Skript (GIS). Es wird erst
 *   geladen, wenn der Mensch den Abgleich wirklich anfasst — nicht beim
 *   Start, nicht im Bündel (das Kaltstart-Budget P4 bleibt unberührt).
 *   Der Zugriff ist `drive.file`: ANITEW sieht und verwaltet nur Dateien und
 *   Ordner, die die App selbst erstellt oder die ausdrücklich mit ihr geöffnet
 *   wurden. Das übrige Drive ist nicht lesbar.
 * - **Drive-REST** über rohes `fetch` (dieselbe Begründung wie beim Coach,
 *   D-031): Ordner finden/anlegen, Sicherung finden, lesen, schreiben.
 *
 * Bei der ersten bewussten Verbindung entsteht in „Meine Ablage“ der sichtbare
 * Ordner „Anitew“. Ohne Verbindung bleibt alles lokal.
 *
 * Die Client-Kennung ist die der App (nicht des Nutzers) und kommt zur
 * Bauzeit aus `VITE_GOOGLE_CLIENT_ID`. Eine Einstellungszeile
 * (`sync.clientId`) darf sie übersteuern — das ist der Prüfpfad der
 * E2E-Tests und der Weg für Selbst-Hoster.
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

export type DriveFailure = 'denied' | 'offline' | 'drive'

export class DriveError extends Error {
  constructor(
    readonly reason: DriveFailure,
    readonly detail?: string,
  ) {
    super(detail ?? reason)
    this.name = 'DriveError'
  }
}

/* Das Nötigste aus Googles Identity-Skript, selbst deklariert — ein
   Typpaket für drei Felder wäre eine Abhängigkeit ohne Gegenwert. */
interface TokenResponse {
  access_token?: string
  error?: string
}
interface TokenClient {
  requestAccessToken(options?: { prompt?: string }): void
}
interface GisOauth2 {
  initTokenClient(config: {
    client_id: string
    scope: string
    callback: (response: TokenResponse) => void
    error_callback?: (error: { type?: string }) => void
  }): TokenClient
}

declare global {
  interface Window {
    google?: { accounts?: { oauth2?: GisOauth2 } }
  }
}

const GIS_SRC = 'https://accounts.google.com/gsi/client'
let gisLoading: Promise<GisOauth2> | undefined

/** Lädt Googles Identity-Skript einmal. Die Promise wird geteilt, damit
 * Onboarding und Abgleich niemals zwei Google-Skripte gleichzeitig anlegen. */
function loadGis(): Promise<GisOauth2> {
  const present = window.google?.accounts?.oauth2
  if (present !== undefined) return Promise.resolve(present)
  if (gisLoading !== undefined) return gisLoading

  gisLoading = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GIS_SRC}"]`)
    if (existing !== null) {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener(
        'error',
        () => reject(new DriveError('offline', 'gis_load_failed')),
        { once: true },
      )
      return
    }
    const script = document.createElement('script')
    script.src = GIS_SRC
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new DriveError('offline', 'gis_load_failed'))
    document.head.append(script)
  })
    .then(() => {
      const loaded = window.google?.accounts?.oauth2
      if (loaded === undefined) throw new DriveError('offline', 'gis_missing_after_load')
      return loaded
    })
    .catch((error: unknown) => {
      // Ein späterer bewusster Versuch darf nach einem Netz-/Browserfehler
      // erneut laden können.
      gisLoading = undefined
      throw error
    })

  return gisLoading
}

/**
 * Bereitet Google nur dort vor, wo der Drive-Weg bereits sichtbar ist. Das
 * hält den normalen Start lokal und sorgt zugleich dafür, dass ein späterer
 * Klick das OAuth-Popup noch innerhalb der echten Benutzer-Geste öffnen kann.
 */
export async function preloadDriveAuth(): Promise<void> {
  await loadGis()
}

/* Name und E-Mail dienen nur dazu, eindeutig zu zeigen, welches eigene
   Google-Konto der Mensch verbunden hat. Der Drive-Zugriff selbst bleibt
   weiterhin auf `drive.file` beschränkt. */
const IDENTITY_SCOPE = 'openid email profile'

function requestTokenWith(
  oauth2: GisOauth2,
  clientId: string,
  silent: boolean,
  withIdentity: boolean,
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const client = oauth2.initTokenClient({
      client_id: clientId,
      scope: withIdentity ? `${DRIVE_SCOPE} ${IDENTITY_SCOPE}` : DRIVE_SCOPE,
      callback: (response) => {
        if (response.access_token !== undefined && response.access_token !== '') {
          resolve(response.access_token)
        } else reject(new DriveError('denied', response.error ?? 'no_access_token'))
      },
      error_callback: (error) =>
        reject(new DriveError('denied', error.type ?? 'oauth_popup_error')),
    })
    try {
      client.requestAccessToken(silent ? { prompt: 'none' } : {})
    } catch (error) {
      reject(
        new DriveError(
          'denied',
          error instanceof Error && error.message !== '' ? error.message : 'oauth_request_failed',
        ),
      )
    }
  })
}

/**
 * Holt ein Zugriffstoken. `silent` versucht es ohne Rückfrage — für den
 * stillen Abgleich beim Start; scheitert das (keine Google-Sitzung, Popup
 * unterdrückt), ist das ein leises `denied`, kein Drama. `withIdentity`
 * bittet zusätzlich um die Konto-Auskunft — nur im hörbaren Weg.
 *
 * Wichtig auf iOS: Ist GIS bereits vorgewärmt, wird `requestAccessToken`
 * synchron in diesem Aufruf ausgeführt. Dadurch bleibt die Benutzer-Geste
 * des Button-Klicks erhalten und der Browser darf das Google-Popup öffnen.
 */
export function requestDriveToken(
  clientId: string,
  silent: boolean,
  withIdentity = false,
): Promise<string> {
  const ready = window.google?.accounts?.oauth2
  if (ready !== undefined) return requestTokenWith(ready, clientId, silent, withIdentity)
  return loadGis().then((oauth2) => requestTokenWith(oauth2, clientId, silent, withIdentity))
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
  if (response.status === 401 || response.status === 403) {
    throw new DriveError('denied', `drive_http_${response.status}`)
  }
  if (!response.ok) throw new DriveError('drive', `drive_http_${response.status}`)
  return response
}

export interface DriveAccountProfile {
  email?: string
  name?: string
}

/**
 * Zeigt nach der bewussten Verbindung eindeutig, welches Google-Konto aktiv
 * ist. Schmuck, kein Tragwerk: Scheitert die Auskunft, scheitert **nicht** der
 * eigentliche Drive-Abgleich.
 */
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

/** Rückwärtskompatibler schmaler Helfer für Aufrufer, die nur die E-Mail brauchen. */
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

/**
 * Die Sicherung aus dem sichtbaren Anitew-Ordner, JSON-geparst — oder nichts.
 * Existiert der Ordner noch nicht, wird beim Lesen **nichts** angelegt; die
 * erste erfolgreiche Upload-Hälfte des Syncs erzeugt ihn.
 */
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
