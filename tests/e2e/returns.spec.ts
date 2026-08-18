import { expect, test, type Page } from '@playwright/test'

import { startButton } from './helpers.ts'

/**
 * Die Wiedersehen auf dem Startbildschirm (Backlog K1, K5, K7 · D-019).
 *
 * An dieser Stelle stünde in einer anderen App eine XP-Zahl. Geprüft wird
 * deshalb vor allem das, was sie **nicht** tut: nicht auftauchen, solange
 * nichts da ist, und nicht ohne die Auskunft dastehen, woher sie kommt.
 */

/** Legt Termine mit einer bestimmten Zahl von Abfragen in die Datenbank. */
async function seedReviews(page: Page, counts: readonly number[]) {
  await page.goto('/')
  await expect(startButton(page)).toBeVisible()
  await page.evaluate(async (list) => {
    const open = indexedDB.open('anitew')
    const database: IDBDatabase = await new Promise((resolve, reject) => {
      open.onsuccess = () => resolve(open.result)
      open.onerror = () => reject(open.error)
    })
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction('itemStates', 'readwrite')
      const store = transaction.objectStore('itemStates')
      list.forEach((reviews, index) => {
        store.put({
          itemId: `words:de:wort${index}`,
          moduleId: 'words',
          language: 'de',
          createdAt: 1,
          lastSeenAt: 1,
          reviews,
          lapses: 0,
          stability: 3,
          difficulty: 5,
          fsrsState: 2,
          dueDay: '2099-01-01',
        })
      })
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
  }, counts as number[])
  await page.reload()
  await expect(startButton(page)).toBeVisible()
}

test('sagt nichts, solange nichts zurückgekommen ist (K7)', async ({ page }) => {
  /*
   * Dieselbe Regel wie bei der Serie: keine Aufforderung, wo noch nichts ist.
   * Ein „0 Wiedersehen“ wäre ein leeres Feld, das nach Verpflichtung aussieht,
   * bevor überhaupt etwas passiert ist.
   */
  await seedReviews(page, [1, 1, 1])
  await expect(page.locator('.returns')).toHaveCount(0)
})

test('zählt jede spätere Abfrage und sagt, woher die Zahl kommt', async ({ page }) => {
  // Dreimal, viermal, einmal abgefragt: 2 + 3 + 0 Wiedersehen bei 3 Einträgen.
  await seedReviews(page, [3, 4, 1])

  const line = page.locator('.returns-line')
  await expect(line.locator('strong')).toHaveText('5')
  await expect(line).toContainText('Wiedersehen')
  await expect(line).toContainText('3 in Pflege')

  /*
   * Der Satz, auf den es ankommt. Eine große Zahl ohne Herkunft ist dasselbe
   * wie eine erfundene (R-1) — und „vergeben“ ist genau das, was XP tut.
   */
  await expect(page.getByText('Gezählt, nicht vergeben.')).toBeVisible()
})

test('nennt den längsten Fall, sobald er etwas sagt (K5)', async ({ page }) => {
  await seedReviews(page, [1, 9])
  await expect(page.getByText('Am häufigsten zurückgeholt: 8 mal')).toBeVisible()
})

test('lässt den Rekord weg, solange er dasselbe sagt wie die Summe (G-2)', async ({ page }) => {
  await seedReviews(page, [2])
  await expect(page.locator('.returns-line strong')).toHaveText('1')
  await expect(page.getByText(/Am häufigsten zurückgeholt/)).toHaveCount(0)
})

test('stellt keinen Balken zum nächsten Rang auf (D-019)', async ({ page }) => {
  /*
   * Ein Fortschrittsbalken bräuchte eine Marke, und jede Marke wäre
   * ausgedacht. Die Gegenprobe gehört dazu: Ohne sie könnte später jemand
   * einen einbauen, ohne dass es auffällt.
   */
  await seedReviews(page, [4, 7])
  await expect(page.locator('.returns progress, .returns .bar, .returns [role="progressbar"]'))
    .toHaveCount(0)
})
