import { expect, test, type Page } from '@playwright/test'

import { openPage, visit } from './helpers.ts'

const PENDING_KEY = 'anitew.google-oauth.logout-pending.v1'

async function seedConnectedDrive(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const request = indexedDB.open('anitew')
    const database: IDBDatabase = await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    await new Promise<void>((resolve, reject) => {
      const tx = database.transaction('settings', 'readwrite')
      const store = tx.objectStore('settings')
      store.put({ key: 'sync.on', value: true })
      store.put({ key: 'sync.account', value: 'mensch@example.com' })
      store.put({ key: 'sync.accountName', value: 'Mensch Beispiel' })
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  })
}

test('räumt einen vorgemerkten Google-Logout beim nächsten Start nach', async ({ page }) => {
  let calls = 0
  await page.addInitScript((key) => window.localStorage.setItem(key, '1'), PENDING_KEY)
  await page.route('**/oauth/google/logout', (route) => {
    calls++
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })
  })

  await visit(page)

  await expect.poll(() => calls).toBe(1)
  await expect
    .poll(() => page.evaluate((key) => window.localStorage.getItem(key), PENDING_KEY))
    .toBeNull()
})

test('offline trennen schaltet Sync sofort aus und löscht die Browser-Sitzung später', async ({ page }) => {
  await page.route('**/oauth/google/logout', (route) => route.abort('internetdisconnected'))

  await visit(page)
  await seedConnectedDrive(page)
  await openPage(page, 'Synchronisieren / Abmelden')

  await expect(page.locator('.sync-identity')).toContainText('Mensch Beispiel')
  await page.getByRole('button', { name: /Google-Konto trennen/ }).click()

  // Der lokale Commit ist die Sicherheitsgrenze: selbst ohne Netz ist Sync
  // sofort aus und die Kontodaten verschwinden aus der Oberfläche.
  await expect(page.locator('.sync-identity')).toHaveCount(0)
  await expect(page.getByText(/Lokaler Modus/)).toBeVisible()
  await expect
    .poll(() => page.evaluate((key) => window.localStorage.getItem(key), PENDING_KEY))
    .toBe('1')

  // Netz ist wieder da. Beim nächsten Start wird ausschließlich der
  // liegengebliebene HttpOnly-Logout nachgeholt; der Sync bleibt lokal aus.
  await page.unroute('**/oauth/google/logout')
  let retryCalls = 0
  await page.route('**/oauth/google/logout', (route) => {
    retryCalls++
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })
  })

  await page.reload()
  await expect.poll(() => retryCalls).toBe(1)
  await expect
    .poll(() => page.evaluate((key) => window.localStorage.getItem(key), PENDING_KEY))
    .toBeNull()

  await openPage(page, 'Synchronisieren / Abmelden')
  await expect(page.locator('.sync-identity')).toHaveCount(0)
  await expect(page.getByText(/Lokaler Modus/)).toBeVisible()
})
