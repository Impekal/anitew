import { expect, test, type Page, type Route } from '@playwright/test'

import { leavePage, openPage, visit } from './helpers.ts'

/**
 * Der Drive-Abgleich (N7/N8/N10 · D-033).
 *
 * Kein Test spricht mit Google: Der sichere OAuth-Worker und Drive-REST werden
 * an der Netzkante ersetzt. Bewusste Anmeldung bleibt trotzdem ein echter
 * Full-page-Code-Flow; ein eigener Regressionstest unten stellt sicher, dass
 * nie wieder ein GIS-Popup in den Produktpfad rutscht.
 */

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
  name?: string
  uploads?: string[]
  folderCreates?: string[]
  /** Hat Google die Drive-Freigabe mitgegeben? Fehlt der Wert, wie bei einer
   *  Anmeldung von vor dieser Auskunft, sagt der Worker nichts dazu. */
  driveGranted?: boolean
}

async function installGoogleStub(page: Page, options: DriveStubOptions = {}) {
  let folderExists = options.folderExists ?? false
  let fileExists = options.fileExists ?? false

  // Der Browser bekommt sein kurzlebiges Token aus der sicheren Worker-Session.
  await page.route('**/oauth/google/access-token', (route) =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        access_token: 'test-token',
        ...(options.driveGranted === undefined ? {} : { drive_granted: options.driveGranted }),
      }),
    }),
  )
  await page.route('**/oauth/google/logout', (route) => route.fulfill({ status: 204, body: '' }))

  const handle = (route: Route) => {
    const request = route.request()
    const url = request.url()
    const decoded = decodeURIComponent(url)

    if (url.includes('userinfo')) {
      return route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          email: options.email ?? 'mensch@example.com',
          name: options.name ?? 'Mensch Beispiel',
        }),
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

test('stellt Google Drive im normalen ANITEW-Build bereit und bleibt bis zur Anmeldung lokal', async ({ page }) => {
  await visit(page)
  await openPage(page, 'Synchronisieren / Abmelden')
  await expect(page.locator('.sync-run')).toBeVisible()
  await expect(page.locator('.sync-run')).toContainText('Anmelden / Daten im Google Drive speichern')
  await expect(page.locator('.sync-note').filter({ hasText: 'noch nicht eingerichtet' })).toHaveCount(0)
  await expect(page.getByText(/Lokaler Modus/)).toBeVisible()
  await expect(page.getByText(/Deine Daten bleiben unter deiner Kontrolle/)).toBeVisible()
})

test('fehlende sichere Session startet Full-page OAuth statt GIS-Popup', async ({ page, context }) => {
  await visit(page)
  await seedClientId(page)
  await page.route('**/oauth/google/access-token', (route) =>
    route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'oauth_session_missing' }),
    }),
  )
  await page.route('https://accounts.google.com/o/oauth2/v2/auth**', (route) =>
    route.fulfill({ contentType: 'text/html', body: '<title>Google OAuth test</title>' }),
  )

  await openPage(page, 'Synchronisieren / Abmelden')
  const requestPromise = page.waitForRequest((request) =>
    request.url().startsWith('https://accounts.google.com/o/oauth2/v2/auth'),
  )
  await page.locator('.sync-run').click()
  const request = await requestPromise
  const target = new URL(request.url())

  expect(context.pages()).toHaveLength(1)
  expect(target.searchParams.get('response_type')).toBe('code')
  expect(target.searchParams.get('redirect_uri')).toContain('/oauth/google/callback')
  expect(target.searchParams.get('scope')).toContain('drive.file')
  expect(target.searchParams.get('scope')).toContain('openid')
  expect(target.searchParams.get('state')).toBeTruthy()
})

test('bestehende sichere Session legt den sichtbaren Ordner Anitew an und speichert darin', async ({ page }) => {
  const uploads: string[] = []
  const folderCreates: string[] = []
  await installGoogleStub(page, { uploads, folderCreates })

  await visit(page)
  await seedClientId(page)
  await openPage(page, 'Synchronisieren / Abmelden')
  await page.locator('.sync-run').click()

  await expect(page.locator('.sync-report')).toContainText('Ordner „Anitew“')
  expect(folderCreates).toHaveLength(1)
  expect(folderCreates[0]).toContain('"name":"Anitew"')
  expect(folderCreates[0]).toContain('application/vnd.google-apps.folder')
  expect(uploads.some((body) => body.includes('anitew-backup'))).toBe(true)
  expect(uploads.some((body) => body.includes(FOLDER_ID))).toBe(true)
  await expect(page.getByRole('button', { name: /Google-Konto trennen/ })).toBeVisible()
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
  await openPage(page, 'Synchronisieren / Abmelden')
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
  await openPage(page, 'Synchronisieren / Abmelden')
  await page.locator('.sync-run').click()

  await expect(page.locator('.sync-failure')).toContainText('keine gültige ANITEW-Sicherung')
  expect(uploads).toHaveLength(0)
})

test('zeigt Google-Name und E-Mail — und Abmelden kehrt sichtbar zu lokal zurück', async ({ page }) => {
  await installGoogleStub(page, { email: 'mensch@example.com', name: 'Mensch Beispiel' })

  await visit(page)
  await seedClientId(page)
  await openPage(page, 'Synchronisieren / Abmelden')
  await page.locator('.sync-run').click()
  await expect(page.locator('.sync-identity')).toContainText('Mensch Beispiel')
  await expect(page.locator('.sync-account')).toContainText('mensch@example.com')

  await page.reload()
  await openPage(page, 'Synchronisieren / Abmelden')
  await expect(page.locator('.sync-identity')).toContainText('Mensch Beispiel')
  await expect(page.locator('.sync-account')).toContainText('mensch@example.com')

  await page.getByRole('button', { name: /Google-Konto trennen/ }).click()
  await expect(page.locator('.sync-identity')).toHaveCount(0)
  await expect(page.getByText(/Lokaler Modus/)).toBeVisible()
})

test('gleicht unsichtbar ab: nach dem Merken wandert der Graph still in Anitew', async ({ page }) => {
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

/**
 * Die Anmeldung, die gelingt und trotzdem nicht reicht (Gerätebild 02.09.).
 *
 * Googles Zustimmungsbildschirm führt die Drive-Freigabe als **eigenes,
 * nicht vorausgewähltes Kästchen**. Bleibt es leer, ist die Anmeldung gültig
 * — nur ohne Drive. Vorher merkte das niemand: Die App schrieb „angemeldet"
 * und der erste Schreibversuch endete in Googles Kürzel
 * `drive_403_insufficientPermissions`, unter einem Satz, der von Anmeldung
 * sprach. Damit hat der Mensch ein Wort in der Hand, das ihm nicht sagt,
 * dass ein Kästchen leer geblieben ist.
 */
test('sagt bei fehlender Drive-Freigabe, welches Kästchen leer blieb', async ({ page }) => {
  await installGoogleStub(page, { driveGranted: false })
  await visit(page)
  await seedClientId(page)
  await openPage(page, 'Synchronisieren / Abmelden')
  await page.locator('.sync-run').click()

  const meldung = page.locator('.sync-failure')
  await expect(meldung).toBeVisible()
  await expect(meldung).toContainText('Freigabe für Google Drive')
  await expect(meldung).toContainText('Kästchen')
  /*
   * Und **nicht** „die Anmeldung kam nicht zustande": Sie kam zustande. Wer
   * das liest, tippt noch einmal auf Anmelden, hakt wieder nichts an und
   * landet beim selben Ergebnis — die App schickte im Kreis.
   */
  await expect(meldung).not.toContainText('kam nicht zustande')
  // Googles Kürzel steht nicht mehr allein da, wo ein Satz hingehört.
  await expect(meldung).not.toContainText('drive_scope_missing')
})

/**
 * Der abgelehnte Zugriff bekommt seinen eigenen Satz — er stand schon im
 * Wörterbuch, kam aber nie an.
 *
 * `sync.errors.blocked` wurde am 01.09. eingeführt, damit ein 403 nicht mehr
 * der Anmeldung angelastet wird. Der Bildschirm filterte `blocked` jedoch
 * heraus (`driveFailure` kannte nur `denied | offline | drive`) und zeigte
 * weiter den allgemeinen Drive-Satz. Der Text war da und unerreichbar.
 */
test('lastet einen abgelehnten Drive-Zugriff nicht der Anmeldung an', async ({ page }) => {
  await installGoogleStub(page)
  await page.route('https://www.googleapis.com/drive/v3/files**', (route) =>
    route.fulfill({
      status: 403,
      contentType: 'application/json',
      body: JSON.stringify({
        error: {
          code: 403,
          message: 'Insufficient Permission',
          errors: [{ reason: 'insufficientPermissions', message: 'Insufficient Permission' }],
        },
      }),
    }),
  )

  await visit(page)
  await seedClientId(page)
  await openPage(page, 'Synchronisieren / Abmelden')
  await page.locator('.sync-run').click()

  const meldung = page.locator('.sync-failure')
  await expect(meldung).toBeVisible()
  await expect(meldung).toContainText('Die Anmeldung selbst hat geklappt')
  await expect(meldung).toContainText('insufficientPermissions')
})
