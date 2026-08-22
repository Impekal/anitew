import { expect, test, type Page, type Route } from '@playwright/test'

import { leavePage, openPage, visit } from './helpers.ts'

/**
 * Der Drive-Abgleich (N7/N8/N10 · D-033).
 *
 * Kein Test spricht mit Google: Identity und Drive-REST werden an der
 * Netzkante ersetzt. Geprüft wird jetzt ausdrücklich der sichtbare Ordner
 * `Anitew`, die Sicherungsdatei darin, das sichere Einmischen und der lokale
 * Modus nach dem Trennen.
 */

const GIS_STUB = `
  window.google = { accounts: { oauth2: { initTokenClient: (config) => ({
    requestAccessToken: () => config.callback({ access_token: 'test-token' }),
  }) } } };
`

const FOLDER_ID = 'folder-anitew'
const FILE_ID = 'file-anitew'

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

interface DriveStubOptions {
  folderExists?: boolean
  fileExists?: boolean
  remote?: unknown
  email?: string
  uploads?: string[]
  folderCreates?: string[]
}

async function installGoogleStub(page: Page, options: DriveStubOptions = {}) {
  let folderExists = options.folderExists ?? false
  let fileExists = options.fileExists ?? false

  await page.route('https://accounts.google.com/gsi/client', (route) =>
    route.fulfill({ contentType: 'text/javascript', body: GIS_STUB }),
  )

  const handle = (route: Route) => {
    const request = route.request()
    const url = request.url()
    const decoded = decodeURIComponent(url)

    if (url.includes('userinfo')) {
      return route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ email: options.email ?? 'mensch@example.com' }),
      })
    }

    if (url.includes('/upload/')) {
      const body = request.postData() ?? ''
      options.uploads?.push(body)
      fileExists = true
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ id: FILE_ID }) })
    }

    if (request.method() === 'POST' && url.includes('/drive/v3/files?fields=id')) {
      const body = request.postData() ?? ''
      options.folderCreates?.push(body)
      folderExists = true
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ id: FOLDER_ID }) })
    }

    if (url.includes('alt=media')) {
      return route.fulfill({
        contentType: 'application/json',
        body: typeof options.remote === 'string' ? options.remote : JSON.stringify(options.remote),
      })
    }

    if (decoded.includes("mimeType='application/vnd.google-apps.folder'")) {
      return route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ files: folderExists ? [{ id: FOLDER_ID }] : [] }),
      })
    }

    if (decoded.includes('in parents')) {
      return route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ files: fileExists ? [{ id: FILE_ID }] : [] }),
      })
    }

    return route.fulfill({ contentType: 'application/json', body: '{"files":[]}' })
  }

  await page.route('https://www.googleapis.com/**', handle)
}

test('sagt ohne Einrichtung die Wahrheit — und nichts sieht kaputt aus', async ({ page }) => {
  await visit(page)
  await openPage(page, 'Abgleich')
  await expect(page.locator('.sync-note').filter({ hasText: 'noch nicht eingerichtet' })).toBeVisible()
  await expect(page.locator('.sync-run')).toHaveCount(0)
  await expect(page.getByText(/Aktuell lokal/)).toBeVisible()
})

test('erster Abgleich legt den sichtbaren Ordner Anitew an und speichert darin', async ({ page }) => {
  const uploads: string[] = []
  const folderCreates: string[] = []
  await installGoogleStub(page, { uploads, folderCreates })

  await visit(page)
  await seedClientId(page)
  await openPage(page, 'Abgleich')
  await page.locator('.sync-run').click()

  await expect(page.locator('.sync-report')).toContainText('Ordner „Anitew“')
  expect(folderCreates).toHaveLength(1)
  expect(folderCreates[0]).toContain('"name":"Anitew"')
  expect(folderCreates[0]).toContain('application/vnd.google-apps.folder')
  expect(uploads.some((body) => body.includes('anitew-backup'))).toBe(true)
  expect(uploads.some((body) => body.includes(FOLDER_ID))).toBe(true)
  await expect(page.getByRole('button', { name: /Google Drive trennen/ })).toBeVisible()
})

test('mischt einen fremden Stand aus Anitew ein und meldet, was neu kam', async ({ page }) => {
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
  await installGoogleStub(page, { folderExists: true, fileExists: true, remote })

  await visit(page)
  await seedClientId(page)
  await openPage(page, 'Abgleich')
  await page.locator('.sync-run').click()

  await expect(page.locator('.sync-report')).toContainText('1 Datensätze kamen neu')
})

test('ersetzt nie eine Datei im Anitew-Ordner, die keine Sicherung ist', async ({ page }) => {
  const uploads: string[] = []
  await installGoogleStub(page, {
    folderExists: true,
    fileExists: true,
    remote: { format: 'fremd' },
    uploads,
  })

  await visit(page)
  await seedClientId(page)
  await openPage(page, 'Abgleich')
  await page.locator('.sync-run').click()

  await expect(page.locator('.sync-failure')).toContainText('keine gültige ANITEW-Sicherung')
  expect(uploads).toHaveLength(0)
})

test('nennt beim Verbinden das Konto — und Trennen kehrt sichtbar zu lokal zurück', async ({
  page,
}) => {
  await installGoogleStub(page, { email: 'mensch@example.com' })

  await visit(page)
  await seedClientId(page)
  await openPage(page, 'Abgleich')
  await page.locator('.sync-run').click()
  await expect(page.locator('.sync-account')).toContainText('mensch@example.com')

  await page.reload()
  await openPage(page, 'Abgleich')
  await expect(page.locator('.sync-account')).toContainText('mensch@example.com')

  await page.getByRole('button', { name: /Google Drive trennen/ }).click()
  await expect(page.locator('.sync-account')).toHaveCount(0)
  await expect(page.getByText(/Aktuell lokal/)).toBeVisible()
})

test('gleicht unsichtbar ab: nach dem Merken wandert der Graph still in Anitew', async ({
  page,
}) => {
  const uploads: string[] = []
  await installGoogleStub(page, { uploads })

  await visit(page)
  await seedClientId(page)
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
        .put({ key: 'sync.on', value: true })
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  })

  // scheduleDriveSync liest die Einstellung selbst. Kein Reload nötig: So
  // prüft dieser Vertrag genau den stillen Abgleich nach einer Änderung und
  // vermischt ihn nicht mit dem separaten Start-Abgleich.
  await openPage(page, 'Mein Gedächtnis')
  await page
    .locator('.remember-input')
    .fill('Daniel arbeitet im Museum, kommt aus Madrid und spielt Gitarre.')
  await page.getByRole('button', { name: 'Vorschläge ansehen' }).click()
  await page.getByRole('button', { name: 'Bestätigen und merken' }).click()
  await expect(page.locator('.memory-counts')).toBeVisible()
  await leavePage(page)

  await expect
    .poll(() => uploads.some((body) => body.includes('memory.graph') && body.includes('Daniel')), {
      timeout: 20_000,
    })
    .toBe(true)
})
