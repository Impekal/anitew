type RequestDriveToken = (
  clientId: string,
  silent: boolean,
  withIdentity?: boolean,
) => Promise<string>

let preparedRequest: RequestDriveToken | undefined
let preparing: Promise<void> | undefined

/**
 * Lädt GIS nur dann, wenn ein Google-Weg wirklich sichtbar ist, und merkt sich
 * anschließend den synchron aufrufbaren Token-Starter. Der Starter selbst
 * wird später direkt im Button-Klick ausgeführt — ohne `await` oder dynamischen
 * Import davor. Genau diese Reihenfolge brauchen strenge iOS-Browser für
 * OAuth-Popups.
 */
export function prepareDriveAuth(): Promise<void> {
  if (preparedRequest !== undefined) return Promise.resolve()
  if (preparing !== undefined) return preparing

  preparing = import('../platform/web/drive.ts')
    .then(async (drive) => {
      await drive.preloadDriveAuth()
      preparedRequest = drive.requestDriveToken
    })
    .finally(() => {
      preparing = undefined
    })

  return preparing
}

/**
 * Muss aus dem echten Benutzerereignis heraus aufgerufen werden. Wenn Google
 * vorbereitet ist, wird `requestAccessToken()` dadurch noch in demselben
 * JavaScript-Stack angestoßen.
 */
export function requestPreparedDriveToken(
  clientId: string,
  silent: boolean,
  withIdentity = false,
): Promise<string> | undefined {
  return preparedRequest?.(clientId, silent, withIdentity)
}

export function driveAuthIsPrepared(): boolean {
  return preparedRequest !== undefined
}
