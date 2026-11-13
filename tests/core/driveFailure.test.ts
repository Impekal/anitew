import { afterEach, describe, expect, it, vi } from 'vitest'

import { DriveError, downloadDriveBackup } from '../../src/platform/web/drive.ts'

/**
 * Was der Bildschirm bei einem Drive-Fehler sagen darf (Gerätebild 01.09.).
 *
 * Auf dem Foto steht: „La connexion n’a pas abouti. Au prochain essai, Google
 * redemandera. · drive_http_403“ — also „die Anmeldung kam nicht zustande,
 * beim nächsten Versuch fragt Google erneut“.
 *
 * Beides ist falsch, und zwar nachweisbar aus der Kennung selbst: `drive_http_`
 * entsteht ausschließlich in `driveFetch`, also **nach** einem erfolgreich
 * ausgestellten Zugriffstoken. Wäre die Anmeldung gescheitert, stünde dort
 * `oauth_…`. Die Anmeldung hat funktioniert; Google Drive hat die Anfrage
 * abgelehnt. Wer daraufhin noch einmal auf „Anmelden“ tippt, stimmt erneut zu
 * und landet beim selben 403 — die App schickt den Menschen im Kreis.
 *
 * Und sie sagt nicht, woran es liegt: Google legt den Grund in den
 * Antwortkörper (`error.errors[0].reason`, `error.status`), und
 * `driveFetch` warf ihn weg. „drive_http_403“ ist für den Menschen vor dem
 * Telefon **und** für den, der es später sucht, gleich wertlos.
 */

const echtesFetch = globalThis.fetch

afterEach(() => {
  globalThis.fetch = echtesFetch
  vi.restoreAllMocks()
})

/** Eine Antwort, wie Google sie bei abgeschalteter Drive-API wirklich sendet. */
function googleFehler(status: number, reason: string, message: string): Response {
  return new Response(
    JSON.stringify({ error: { code: status, message, errors: [{ reason, message }] } }),
    { status, headers: { 'content-type': 'application/json' } },
  )
}

async function fehlerBei(antwort: () => Response): Promise<DriveError> {
  globalThis.fetch = vi.fn(async () => antwort()) as unknown as typeof fetch
  try {
    await downloadDriveBackup('token')
  } catch (error) {
    if (error instanceof DriveError) return error
    throw error
  }
  throw new Error('kein Fehler geworfen')
}

describe('Drive-Fehler benennen ihre Ursache', () => {
  it('unterscheidet eine abgelehnte Anfrage von einer gescheiterten Anmeldung', async () => {
    const fehler = await fehlerBei(() =>
      googleFehler(
        403,
        'accessNotConfigured',
        'Google Drive API has not been used in project 123 before or it is disabled.',
      ),
    )

    // Nicht `denied`: Dieser Text sagt „die Anmeldung kam nicht zustande,
    // beim nächsten Versuch fragt Google erneut“ — und schickt damit im
    // Kreis, denn die Anmeldung war erfolgreich.
    expect(fehler.reason).not.toBe('denied')
    expect(fehler.reason).toBe('blocked')
  })

  it('trägt Googles eigenen Grund weiter, statt ihn wegzuwerfen', async () => {
    const fehler = await fehlerBei(() =>
      googleFehler(403, 'accessNotConfigured', 'Google Drive API has not been used …'),
    )

    expect(fehler.detail, 'ohne Grund ist die Kennung fuer niemanden brauchbar').toContain(
      'accessNotConfigured',
    )
  })

  it('bleibt bei 401 eine Sache der Anmeldung', async () => {
    // Hier stimmt die alte Aussage: Das Token ist abgelaufen oder
    // zurückgezogen — beim nächsten Versuch fragt Google wirklich erneut.
    const fehler = await fehlerBei(() =>
      googleFehler(401, 'authError', 'Invalid Credentials'),
    )

    expect(fehler.reason).toBe('denied')
  })

  it('kommt auch ohne lesbaren Körper zurecht', async () => {
    const fehler = await fehlerBei(() => new Response('<html>nope</html>', { status: 403 }))

    expect(fehler.reason).toBe('blocked')
    expect(fehler.detail).toContain('403')
  })
})
