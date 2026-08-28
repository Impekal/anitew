import { expect, test, type Page } from '@playwright/test'

import { visit } from './helpers.ts'

async function seedConnectedAccount(page: Page): Promise<void> {
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

test('kehrt per Seitenknopf und Browser-Zurück von einer Core-Seite in den Core zurück', async ({ page }) => {
  await visit(page)

  await page.locator('button.hamburger').click()
  await expect(page.locator('.drawer')).toBeVisible()
  await page.locator('.drawer-item', { hasText: 'Sicherung' }).click()
  await expect(page.locator('.app.page')).toBeVisible()

  await page.locator('.page-back').click()
  await expect(page.locator('.app.page')).toHaveCount(0)
  await expect(page.locator('.drawer')).toBeVisible()

  await page.locator('.drawer-item', { hasText: 'Erinnerung' }).click()
  await expect(page.locator('.app.page')).toBeVisible()
  await page.goBack()
  await expect(page.locator('.app.page')).toHaveCount(0)
  await expect(page.locator('.drawer')).toBeVisible()
})

test('Browser-Vorwärts stellt genau die zuvor geöffnete Core-Seite wieder her', async ({ page }) => {
  await visit(page)

  await page.locator('button.hamburger').click()
  await page.locator('.drawer-item', { hasText: 'Sicherung' }).click()
  await expect(page.getByRole('heading', { name: 'Sicherung' })).toBeVisible()

  // Native Browser-Geste: zurück zum Core, dann wieder vorwärts auf denselben
  // History-Eintrag. Forward darf nicht auf der Startseite landen und auch
  // keinen zweiten Eintrag erzeugen.
  await page.goBack()
  await expect(page.locator('.drawer')).toBeVisible()
  await expect(page.locator('.app.page')).toHaveCount(0)

  const lengthBeforeForward = await page.evaluate(() => window.history.length)
  await page.goForward()
  await expect(page.getByRole('heading', { name: 'Sicherung' })).toBeVisible()
  await expect(page.locator('.drawer')).toBeHidden()
  await expect.poll(() => page.evaluate(() => window.history.length)).toBe(lengthBeforeForward)

  // Und Back funktioniert danach weiterhin genau einmal zurück zum Core.
  await page.goBack()
  await expect(page.locator('.app.page')).toHaveCount(0)
  await expect(page.locator('.drawer')).toBeVisible()
})

test.describe('verbundenes Konto im mobilen Core', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('hält Menü schließen und Name/E-Mail als getrennte Zeilen', async ({ page }) => {
    await visit(page)
    await seedConnectedAccount(page)

    // The identity/label refinement is deliberately lazy and should also be
    // correct when Core is first opened after it has loaded.
    await page.waitForTimeout(900)
    await page.locator('button.hamburger').click()

    const closeLabel = page.locator('.drawer-close-label')
    const account = page.locator('.drawer-google-account')
    await expect(closeLabel).toBeVisible({ timeout: 8_000 })
    await expect(account).toContainText('Mensch Beispiel')
    await expect(account).toContainText('mensch@example.com')

    const closeBox = await closeLabel.boundingBox()
    const accountBox = await account.boundingBox()
    expect(closeBox).not.toBeNull()
    expect(accountBox).not.toBeNull()
    expect(accountBox!.y - (closeBox!.y + closeBox!.height)).toBeGreaterThanOrEqual(12)
  })
})
