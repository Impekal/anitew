type RequestDriveToken = (
  clientId: string,
  silent: boolean,
  withIdentity?: boolean,
) => Promise<string>

let preparedRequest: RequestDriveToken | undefined
let preparing: Promise<void> | undefined

/**
 * Die alte Popup-Vorwärmung ist nicht mehr nötig. Wir laden den schmalen
 * Drive-Adapter weiterhin erst, wenn der Google-Weg sichtbar wird; die
 * eigentliche bewusste Anmeldung wechselt bei fehlender OAuth-Sitzung auf
 * eine vollständige Google-Weiterleitung.
 */
export function prepareDriveAuth(): Promise<void> {
  if (preparedRequest !== undefined) return Promise.resolve()
  if (preparing !== undefined) return preparing

  preparing = import('../platform/web/drive.ts')
    .then((drive) => {
      preparedRequest = drive.requestDriveToken
    })
    .finally(() => {
      preparing = undefined
    })

  return preparing
}

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
