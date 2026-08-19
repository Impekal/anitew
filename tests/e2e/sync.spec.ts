import { expect, test, type Page } from '@playwright/test'

import { openPage, visit } from './helpers.ts'

/**
 * Der Drive-Abgleich (N7/N8/N10 · D-033).
 *
 * Kein Test spricht mit Google: Das Identity-Skript und die Drive-Aufrufe
 * werden an der Netzkante ersetzt. Geprüft wird, was der App gehört — die
 * ehrliche Meldung ohne Einrichtung, der erste Abgleich (nichts im Drive →
 * Sicherung liegt jetzt dort), das Einmischen eines fremden Standes, und
 * dass eine unlesbare Datei **nicht** überschrieben wird.
 */

/** Googles Identity-Skript, ersetzt: Der Token kommt sofort und still. */
const GIS_STUB = `
  window.google = { accounts: { oauth2: { initTokenClient: (config) => ({
    requestAccessToken: () => config.callback({ access_token: 'test-token' }),
  }) } } };
`

/** Legt die Client-Kennung in die Einstellungen — der Prüfpfad (D-033). */
async function seedClientId(page: Page) {
  await page.evaluate(async () => {
    const open = indexedDB.open('anitew')
    const database: IDBDatabase = await new Promise((resolve, reject) => {
      open.onsuccess = () => resolve(open.result)
      open.onerror = () => reject(open.error)
    })
    await new Promise<void>((resolve, reject) => {
      const request = database
        .transaction('settings', 'readwrite')
        .objectStore('settings')
        .put({ key: 'sync.clientId', value: 'test-client' })
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  })
}

test('sagt ohne Einrichtung die Wahrheit — und nichts sieht kaputt aus', async ({ page }) => {
  await visit(page)
  await openPage(page, 'Abgleich')
  await expect(page.locator('.sync-note')).toContainText('noch nicht eingerichtet')
  await expect(page.locator('.sync-run')).toHaveCount(0)
})

test('erster Abgleich: nichts im Drive → die Sicherung liegt jetzt dort', async ({ page }) => {
  await page.route('https://accounts.google.com/gsi/client', (route) =>
    route.fulfill({ contentType: 'text/javascript', body: GIS_STUB }),
  )
  let uploaded = ''
  await page.route('https://www.googleapis.com/**', (route) => {
    const url = route.request().url()
    if (url.includes('/upload/')) {
      uploaded = route.request().postData() ?? ''
      return route.fulfill({ contentType: 'application/json', body: '{"id":"f1"}' })
    }
    // Die Suche im App-Ordner: noch keine Datei.
    return route.fulfill({ contentType: 'application/json', body: '{"files":[]}' })
  })

  await visit(page)
  await seedClientId(page)
  await openPage(page, 'Abgleich')
  await page.locator('.sync-run').click()

  await expect(page.locator('.sync-report')).toContainText('lag noch nichts')
  // Hochgeladen wurde eine echte Sicherung dieser App, keine leere Hülle.
  expect(uploaded).toContain('anitew-backup')
  // Ab jetzt gilt der Abgleich als gewollt — der stille Start-Versuch.
  await expect(page.getByRole('button', { name: 'Nicht mehr automatisch abgleichen' })).toBeVisible()
})

test('mischt einen fremden Stand ein und meldet, was neu kam', async ({ page }) => {
  const remote = {
    format: 'anitew-backup',
    version: 1,
    createdAt: 5,
    app: 'anderes-gerät',
    tables: {
      settings: [{ key: 'test.marker', value: 1 }],
      sessions: [],
      events: [],
      itemStates: [],
      benchmarks: [],
    },
  }
  await page.route('https://accounts.google.com/gsi/client', (route) =>
    route.fulfill({ contentType: 'text/javascript', body: GIS_STUB }),
  )
  await page.route('https://www.googleapis.com/**', (route) => {
    const url = route.request().url()
    if (url.includes('/upload/')) {
      return route.fulfill({ contentType: 'application/json', body: '{"id":"f1"}' })
    }
    if (url.includes('alt=media')) {
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify(remote) })
    }
    return route.fulfill({ contentType: 'application/json', body: '{"files":[{"id":"f1"}]}' })
  })

  await visit(page)
  await seedClientId(page)
  await openPage(page, 'Abgleich')
  await page.locator('.sync-run').click()

  await expect(page.locator('.sync-report')).toContainText('1 Datensätze kamen neu')
})

test('ersetzt nie eine Datei, die keine Sicherung ist', async ({ page }) => {
  let uploadTried = false
  await page.route('https://accounts.google.com/gsi/client', (route) =>
    route.fulfill({ contentType: 'text/javascript', body: GIS_STUB }),
  )
  await page.route('https://www.googleapis.com/**', (route) => {
    const url = route.request().url()
    if (url.includes('/upload/')) {
      uploadTried = true
      return route.fulfill({ contentType: 'application/json', body: '{"id":"f1"}' })
    }
    if (url.includes('alt=media')) {
      return route.fulfill({ contentType: 'application/json', body: '{"format":"fremd"}' })
    }
    return route.fulfill({ contentType: 'application/json', body: '{"files":[{"id":"f1"}]}' })
  })

  await visit(page)
  await seedClientId(page)
  await openPage(page, 'Abgleich')
  await page.locator('.sync-run').click()

  await expect(page.locator('.sync-failure')).toContainText('keine ANITEW-Sicherung')
  expect(uploadTried).toBe(false)
})
