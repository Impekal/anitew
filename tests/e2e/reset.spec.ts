import { expect, test } from '@playwright/test'

import { openPage, visit } from './helpers.ts'

test('Neu anfangen löscht lokal vollständig, trennt Google und kann die Drive-Sicherung entfernen', async ({ page }) => {
  let deletedRemote = 0
  let loggedOut = 0

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
  await page.locator('.wipe').getByRole('button').first().click()
  await page.locator('.wipe input[type=checkbox]').check()
  await page.locator('.wipe-confirm-input').fill('ANITEW')

  await Promise.all([
    page.waitForURL((url) => url.pathname === '/'),
    page.locator('.wipe-go').click(),
  ])

  expect(deletedRemote).toBe(1)
  expect(loggedOut).toBe(1)

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
