import { expect, test, type Page, type Route } from '@playwright/test'

import { openPage, visit } from './helpers.ts'

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
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  })
}

test('ein neuer Google-Login wird erst nach Abschluss des alten Logout wieder freigegeben', async ({ page }) => {
  let releaseLogout: (() => void) | undefined
  let logoutStarted = false

  await page.route('**/oauth/google/logout', async (route: Route) => {
    logoutStarted = true
    await new Promise<void>((resolve) => {
      releaseLogout = resolve
    })
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })
  })

  await visit(page)
  await seedConnectedDrive(page)
  await openPage(page, 'Synchronisieren / Abmelden')

  await page.getByRole('button', { name: /Google-Konto trennen/ }).click()
  await expect.poll(() => logoutStarted).toBe(true)

  // Die Kontodarstellung verschwindet sofort, weil sync.on bereits dauerhaft
  // false ist. Der neue Login-Button bleibt aber gesperrt, solange die alte
  // Cookie-Löschung noch unterwegs ist — sonst könnte ihre verspätete Antwort
  // eine eben neu aufgebaute Sitzung wieder löschen.
  await expect(page.locator('.sync-identity')).toHaveCount(0)
  await expect(page.locator('.sync-run')).toBeDisabled()

  releaseLogout?.()
  await expect(page.locator('.sync-run')).toBeEnabled({ timeout: 5_000 })
  await expect(page.locator('.sync-run')).toContainText('Anmelden / Daten im Google Drive speichern')
})
