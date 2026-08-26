import { expect, test } from '@playwright/test'

import { openPage, visit } from './helpers.ts'

test('Neu anfangen löscht lokal vollständig, trennt Google, Push und optional Drive', async ({ page }) => {
  let deletedRemote = 0
  let loggedOut = 0
  let pushUnregistered = 0

  await page.addInitScript(() => {
    const subscription = {
      endpoint: 'https://push.example.invalid/reset-device',
      unsubscribe: async () => true,
    }
    const registration = {
      pushManager: {
        getSubscription: async () => subscription,
      },
      update: async () => undefined,
    }
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: {
        controller: null,
        ready: Promise.resolve(registration),
        getRegistration: async () => registration,
        register: async () => registration,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
      },
    })
  })

  await page.route('**/push/unsubscribe', async (route) => {
    pushUnregistered++
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })
  })
  await page.route('**/oauth/google/access-token', (route) =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ access_token: 'test-token' }),
    }),
  )
  await page.route('**/oauth/google/logout', (route) => {
    loggedOut++
    return route.fulfill({ status: 204, body: '' })
  })
  await page.route('https://www.googleapis.com/drive/v3/files**', (route) => {
    const request = route.request()
    const url = request.url()
    const decoded = decodeURIComponent(url)
    if (request.method() === 'DELETE' && url.endsWith('/file-anitew')) {
      deletedRemote++
      return route.fulfill({ status: 204, body: '' })
    }
    if (decoded.includes("mimeType='application/vnd.google-apps.folder'")) {
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ files: [{ id: 'folder-anitew' }] }) })
    }
    if (decoded.includes('in parents')) {
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ files: [{ id: 'file-anitew' }] }) })
    }
    return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ files: [] }) })
  })

  await visit(page)
  await page.evaluate(async () => {
    window.localStorage.setItem('anitew.test.reset', 'present')
    window.sessionStorage.setItem('anitew.test.session', 'present')
    const open = indexedDB.open('anitew')
    const database: IDBDatabase = await new Promise((resolve, reject) => {
      open.onsuccess = () => resolve(open.result)
      open.onerror = () => reject(open.error)
    })
    await new Promise<void>((resolve, reject) => {
      const tx = database.transaction('settings', 'readwrite')
      const store = tx.objectStore('settings')
      store.put({ key: 'test.reset.marker', value: 'present' })
      store.put({ key: 'sync.on', value: true })
      store.put({ key: 'sync.account', value: 'mensch@example.com' })
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  })

  await openPage(page, 'Sicherung')
  const reset = page.locator('.wipe-reset')
  await reset.getByRole('button').first().click()
  await reset.locator('input[type=checkbox]').check()
  await reset.locator('.wipe-confirm-input').fill('ANITEW')

  await reset.locator('.wipe-go').click()
  await expect.poll(() => deletedRemote).toBe(1)
  await expect.poll(() => loggedOut).toBe(1)
  await expect.poll(() => pushUnregistered).toBe(1)

  // Der Reset lädt dieselbe URL (`/`) neu. Auf `waitForURL('/')` zu warten
  // beweist deshalb keine Navigation: die Bedingung war schon vor dem Klick
  // erfüllt und konnte mitten im Reload in die IndexedDB-Prüfung laufen.
  // Der frische Ankommens-Bildschirm existiert dagegen erst, wenn der Reset,
  // der Reload und das erneute App-Mount wirklich abgeschlossen sind.
  await expect(page.locator('.arrival')).toBeVisible({ timeout: 10_000 })

  const state = await page.evaluate(async () => {
    const open = indexedDB.open('anitew')
    const database: IDBDatabase = await new Promise((resolve, reject) => {
      open.onsuccess = () => resolve(open.result)
      open.onerror = () => reject(open.error)
    })
    const read = (key: string) =>
      new Promise<unknown>((resolve, reject) => {
        const request = database.transaction('settings').objectStore('settings').get(key)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    return {
      marker: await read('test.reset.marker'),
      sync: await read('sync.account'),
      localMarker: window.localStorage.getItem('anitew.test.reset'),
      sessionMarker: window.sessionStorage.getItem('anitew.test.session'),
    }
  })

  expect(state.marker).toBeUndefined()
  expect(state.sync).toBeUndefined()
  expect(state.localMarker).toBeNull()
  expect(state.sessionMarker).toBeNull()
})

test('„Neu anfangen" steht auch in den Einstellungen — und startet die App wie beim ersten Mal', async ({
  page,
}) => {
  /*
   * Runde 4, Nutzerwunsch: Der Weg zurück auf null lag nur unter
   * „Sicherung". Dort ist er sachlich richtig aufgehoben, aber niemand
   * sucht ihn dort — gefragt wird danach in den Einstellungen. Beide Seiten
   * zeigen dieselbe Komponente; hier wird der Weg von den Einstellungen aus
   * einmal komplett gegangen.
   */
  await visit(page)

  // Etwas Echtes hinterlegen, damit „gelöscht" auch etwas heißt.
  await page.evaluate(async () => {
    const open = indexedDB.open('anitew')
    const database: IDBDatabase = await new Promise((resolve, reject) => {
      open.onsuccess = () => resolve(open.result)
      open.onerror = () => reject(open.error)
    })
    await new Promise<void>((resolve, reject) => {
      const tx = database.transaction('settings', 'readwrite')
      tx.objectStore('settings').put({ key: 'sound', value: false })
      tx.objectStore('settings').put({ key: 'profile.onboarding', value: { name: 'Testfall' } })
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  })
  await openPage(page, 'Einstellungen')
  const reset = page.locator('.wipe-reset')
  await expect(reset).toBeVisible()

  // Ohne Bestätigung passiert nichts: Erst die Warnung, dann das Wort.
  await reset.getByRole('button').first().click()
  await expect(reset.locator('.wipe-warn')).toBeVisible()
  await expect(reset.locator('.wipe-go')).toBeDisabled()

  await reset.locator('.wipe-confirm-input').fill('ANITEW')
  await expect(reset.locator('.wipe-go')).toBeEnabled()
  await reset.locator('.wipe-go').click()

  // Die App startet neu und steht wieder am Anfang — wie frisch installiert.
  await expect(page.locator('.arrival')).toBeVisible({ timeout: 15_000 })

  const leftovers = await page.evaluate(async () => {
    const open = indexedDB.open('anitew')
    const database: IDBDatabase = await new Promise((resolve, reject) => {
      open.onsuccess = () => resolve(open.result)
      open.onerror = () => reject(open.error)
    })
    const count = (name: string) =>
      new Promise<number>((resolve, reject) => {
        const request = database.transaction(name).objectStore(name).count()
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    return {
      settings: await count('settings'),
      sessions: await count('sessions'),
      events: await count('events'),
      itemStates: await count('itemStates'),
      benchmarks: await count('benchmarks'),
      lokal: window.localStorage.length,
    }
  })

  expect(leftovers.sessions).toBe(0)
  expect(leftovers.events).toBe(0)
  expect(leftovers.itemStates).toBe(0)
  expect(leftovers.benchmarks).toBe(0)
  // Die App darf sich beim Neustart wieder Vorlieben anlegen — aber nichts
  // von vorher: Der Testfall-Name aus dem Profil ist weg.
  const profile = await page.evaluate(async () => {
    const open = indexedDB.open('anitew')
    const database: IDBDatabase = await new Promise((resolve) => {
      open.onsuccess = () => resolve(open.result)
    })
    return new Promise<unknown>((resolve) => {
      const request = database.transaction('settings').objectStore('settings').get('profile.onboarding')
      request.onsuccess = () => resolve(request.result)
    })
  })
  expect(profile).toBeUndefined()
})
