import { expect, test } from '@playwright/test'

import { openPage, visit } from './helpers.ts'

test('aktualisiert eine offene iPhone-PWA nach erfolgreicher Google-Rückkehr sofort', async ({ page }) => {
  await visit(page)
  await openPage(page, 'Synchronisieren / Abmelden')
  await expect(page.locator('.sync-run')).toContainText('Anmelden / Daten im Google Drive speichern')

  // Reproduziert den iOS-Fall: Google beendet OAuth in einem anderen
  // Web-Kontext, während die installierte PWA mit altem React-Zustand im
  // Hintergrund liegt. Der Callback hat die gemeinsamen Einstellungen schon
  // geschrieben; erst danach wird die alte PWA wieder fokussiert.
  await page.evaluate(async () => {
    const open = indexedDB.open('anitew')
    const database: IDBDatabase = await new Promise((resolve, reject) => {
      open.onsuccess = () => resolve(open.result)
      open.onerror = () => reject(open.error)
    })
    const rows = [
      { key: 'sync.on', value: true },
      { key: 'sync.lastAt', value: Date.now() },
      { key: 'sync.account', value: 'mensch@example.com' },
      { key: 'sync.accountName', value: 'Mensch Beispiel' },
    ]
    await new Promise<void>((resolve, reject) => {
      const tx = database.transaction('settings', 'readwrite')
      const store = tx.objectStore('settings')
      for (const row of rows) store.put(row)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
    window.dispatchEvent(new Event('focus'))
  })

  await expect(page.locator('.sync-identity')).toContainText('Mensch Beispiel')
  await expect(page.locator('.sync-account')).toContainText('mensch@example.com')
  await expect(page.locator('.sync-run')).toContainText('Jetzt mit Google Drive abgleichen')
  await expect(page.locator('.sync-report')).toContainText('Google-Anmeldung abgeschlossen')
})
