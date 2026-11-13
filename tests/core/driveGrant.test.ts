import { afterEach, describe, expect, it, vi } from 'vitest'

import { DriveError, requestDriveToken } from '../../src/platform/web/drive.ts'

/**
 * Die Anmeldung, die gelingt und trotzdem nicht reicht (Gerätebild 02.09.).
 *
 * Googles Zustimmungsbildschirm zeigt `drive.file` als **eigenes, anfangs
 * leeres Kästchen**. Wer es übersieht — und nach einer Datenlöschung sieht
 * man den Bildschirm zum zweiten Mal, da klickt man schneller — meldet sich
 * vollständig gültig an, nur ohne Drive.
 *
 * Bis hierher merkte das niemand. Die App bekam ein Token, schrieb
 * „angemeldet", und der erste Schreibversuch endete in
 * `drive_403_insufficientPermissions`: Googles Kürzel, auf einem Bildschirm,
 * der von Anmeldung sprach. Der Mensch hat dann ein Wort in der Hand, das
 * ihm nicht sagt, dass ein Kästchen leer geblieben ist.
 *
 * Geprüft wird deshalb an der Stelle, an der die Auskunft ankommt: Sagt der
 * Worker „keine Drive-Freigabe", darf die App **kein Token weiterreichen**,
 * sondern muss es benennen — vor dem ersten Drive-Zugriff, nicht danach.
 */

const echtesFetch = globalThis.fetch

afterEach(() => {
  globalThis.fetch = echtesFetch
  vi.restoreAllMocks()
})

function workerAntwortet(body: unknown): void {
  globalThis.fetch = vi.fn(async () => Response.json(body)) as unknown as typeof fetch
}

async function fehlerBeimHolen(): Promise<DriveError> {
  try {
    await requestDriveToken('client-id', true)
  } catch (error) {
    if (error instanceof DriveError) return error
    throw error
  }
  throw new Error('kein Fehler geworfen')
}

describe('die fehlende Drive-Freigabe', () => {
  it('wird beim Holen des Tokens benannt, nicht erst beim 403', async () => {
    workerAntwortet({ access_token: 'gueltig', drive_granted: false })
    const fehler = await fehlerBeimHolen()

    /*
     * Eigene Kennung, nicht `denied`: `denied` bedeutet in `driveSyncImpl`
     * „Sitzung weg, bitte neu anmelden" und schickt sofort zu Google zurück.
     * Hier ist die Sitzung gültig — zurück muss man trotzdem, aber mit dem
     * Wissen, welches Kästchen fehlt. Das ist eine andere Auskunft.
     */
    expect(fehler.detail).toBe('drive_scope_missing')
    expect(fehler.reason).toBe('blocked')
  })

  it('gibt das Token weiter, wenn die Freigabe da ist', async () => {
    workerAntwortet({ access_token: 'gueltig', drive_granted: true })
    await expect(requestDriveToken('client-id', true)).resolves.toBe('gueltig')
  })

  it('hält bestehende Anmeldungen am Leben, die das Feld noch nicht kennen', async () => {
    /*
     * Sitzungen von vor dieser Prüfung tragen kein `drive_granted`. Sie
     * gleichen seit Wochen erfolgreich ab; ihnen jetzt die Freigabe
     * abzusprechen wäre eine erfundene Auskunft und nähme funktionierenden
     * Geräten grundlos den Abgleich.
     */
    workerAntwortet({ access_token: 'gueltig' })
    await expect(requestDriveToken('client-id', true)).resolves.toBe('gueltig')
  })
})
