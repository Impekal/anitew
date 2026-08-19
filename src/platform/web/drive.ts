/**
 * Google-Anmeldung und Drive-App-Ordner (Backlog N7/N8 · D-033).
 *
 * Zwei Drähte, beide so schmal wie möglich:
 *
 * - **Anmeldung** über Googles eigenes Identity-Skript (GIS). Es wird erst
 *   geladen, wenn der Mensch den Abgleich wirklich anfasst — nicht beim
 *   Start, nicht im Bündel (das Kaltstart-Budget P4 bleibt unberührt).
 *   Der Zugriff ist der engste, den Google kennt: `drive.appdata`, nur
 *   der App-Ordner dieser App, nichts sonst im Drive ist sichtbar.
 * - **Drive-REST** über rohes `fetch` (dieselbe Begründung wie beim
 *   Coach, D-031): eine Datei finden, lesen, schreiben — drei Aufrufe.
 *
 * Die Client-Kennung ist die der App (nicht des Nutzers) und kommt zur
 * Bauzeit aus `VITE_GOOGLE_CLIENT_ID`. Eine Einstellungszeile
 * (`sync.clientId`) darf sie übersteuern — das ist der Prüfpfad der
 * E2E-Tests und der Weg für Selbst-Hoster.
 */

import type { BackupFile } from '../../core/index.ts'
import { DRIVE_FILE_NAME, DRIVE_SCOPE } from '../../core/sync/drive.ts'

/** Wo die Einstellungen die Client-Kennung übersteuern dürfen. */
export const DRIVE_CLIENT_SETTING = 'sync.clientId'

/** Die zur Bauzeit hinterlegte Client-Kennung — oder nichts. */
export function builtInClientId(): string | undefined {
  const id = import.meta.env['VITE_GOOGLE_CLIENT_ID'] as string | undefined
  return id === undefined || id === '' ? undefined : id
}

export type DriveFailure = 'denied' | 'offline' | 'drive'

export class DriveError extends Error {
  constructor(readonly reason: DriveFailure) {
    super(reason)
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

/** Lädt Googles Identity-Skript einmal — erst bei Bedarf. */
async function loadGis(): Promise<GisOauth2> {
  const present = window.google?.accounts?.oauth2
  if (present !== undefined) return present
  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GIS_SRC}"]`)
    if (existing !== null) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new DriveError('offline')))
      return
    }
    const script = document.createElement('script')
    script.src = GIS_SRC
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new DriveError('offline'))
    document.head.append(script)
  })
  const loaded = window.google?.accounts?.oauth2
  if (loaded === undefined) throw new DriveError('offline')
  return loaded
}

/**
 * Holt ein Zugriffstoken. `silent` versucht es ohne Rückfrage — für den
 * stillen Abgleich beim Start; scheitert das (kein Google-Sitzung, Popup
 * unterdrückt), ist das ein leises `denied`, kein Drama.
 */
export async function requestDriveToken(clientId: string, silent: boolean): Promise<string> {
  const oauth2 = await loadGis()
  return new Promise<string>((resolve, reject) => {
    const client = oauth2.initTokenClient({
      client_id: clientId,
      scope: DRIVE_SCOPE,
      callback: (response) => {
        if (response.access_token !== undefined && response.access_token !== '') {
          resolve(response.access_token)
        } else reject(new DriveError('denied'))
      },
      error_callback: () => reject(new DriveError('denied')),
    })
    client.requestAccessToken(silent ? { prompt: 'none' } : {})
  })
}

async function driveFetch(token: string, url: string, init?: RequestInit): Promise<Response> {
  let response: Response
  try {
    response = await fetch(url, {
      ...init,
      headers: { ...init?.headers, authorization: `Bearer ${token}` },
    })
  } catch {
    throw new DriveError('offline')
  }
  if (response.status === 401 || response.status === 403) throw new DriveError('denied')
  if (!response.ok) throw new DriveError('drive')
  return response
}

const FILES = 'https://www.googleapis.com/drive/v3/files'
const UPLOAD = 'https://www.googleapis.com/upload/drive/v3/files'

async function findFileId(token: string): Promise<string | undefined> {
  const query = encodeURIComponent(`name='${DRIVE_FILE_NAME}'`)
  const response = await driveFetch(
    token,
    `${FILES}?spaces=appDataFolder&q=${query}&fields=files(id)`,
  )
  const body = (await response.json()) as { files?: { id: string }[] }
  return body.files?.[0]?.id
}

/**
 * Die Sicherung aus dem App-Ordner, JSON-geparst — oder nichts. Eine
 * Datei, die kein JSON ist, kommt als roher Text zurück: `readBackup`
 * nennt sie dann unlesbar, und der Kern rührt sie nicht an (D-033).
 */
export async function downloadDriveBackup(token: string): Promise<unknown | undefined> {
  const id = await findFileId(token)
  if (id === undefined) return undefined
  const response = await driveFetch(token, `${FILES}/${id}?alt=media`)
  const text = await response.text()
  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

/** Schreibt die Sicherung in den App-Ordner — anlegen oder ersetzen. */
export async function uploadDriveBackup(token: string, file: BackupFile): Promise<void> {
  const body = JSON.stringify(file)
  const id = await findFileId(token)
  if (id !== undefined) {
    await driveFetch(token, `${UPLOAD}/${id}?uploadType=media`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body,
    })
    return
  }
  /*
   * Anlegen braucht Metadaten (Name, App-Ordner) **und** Inhalt in einem
   * Aufruf — das ist Googles Multipart-Form, von Hand gebaut, damit kein
   * SDK einzieht.
   */
  const boundary = 'anitew-sicherung'
  const multipart = [
    `--${boundary}`,
    'Content-Type: application/json; charset=UTF-8',
    '',
    JSON.stringify({ name: DRIVE_FILE_NAME, parents: ['appDataFolder'] }),
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
