import { expect, test, type Page } from '@playwright/test'

import { answerRecall, collectItems, startButton, startEmergency } from './helpers.ts'

/**
 * Die Serie, im Browser nachgeprüft (Backlog K2, K5, K7 · D-008).
 *
 * Eine Serie soll **das Zurückkommen belohnen, nicht das Wegbleiben
 * bestrafen.** Geprüft wird deshalb nicht nur, dass sie zählt, sondern auch,
 * was sie **nicht** tut: kein Ansporn, wo noch nichts ist, und kein
 * verlorener Fortschritt nach einem verpassten Tag.
 */

/** Der Tagesschlüssel, wie ihn die App bildet — Ortszeit, Grenze um 4 Uhr. */
function dayKey(offsetDays: number): string {
  const at = new Date(Date.now() + offsetDays * 86_400_000 - 4 * 3_600_000)
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${at.getFullYear()}-${pad(at.getMonth() + 1)}-${pad(at.getDate())}`
}

/**
 * Legt abgeschlossene Einheiten in die Datenbank.
 *
 * Zehn Tage zu trainieren dauert zehn Tage; die Serie wird aber aus den
 * Trainingstagen gerechnet und nicht fortgeschrieben (siehe
 * `core/progress/streak.ts`). Genau deshalb lässt sie sich so prüfen — und
 * genau deshalb ist die Rechnung dort auch die ehrlichere Lösung.
 */
async function seedDays(page: Page, days: readonly string[]) {
  await page.evaluate(async (list) => {
    const open = indexedDB.open('anitew')
    const database: IDBDatabase = await new Promise((resolve, reject) => {
      open.onsuccess = () => resolve(open.result)
      open.onerror = () => reject(open.error)
    })
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction('sessions', 'readwrite')
      const store = transaction.objectStore('sessions')
      list.forEach((day, index) => {
        store.put({
          id: `seed-${index}`,
          day,
          mode: 'daily',
          startedAt: 1,
          endedAt: 2,
          completed: true,
        })
      })
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
  }, days)
  await page.reload()
}

test('sagt nichts, solange nichts trainiert wurde (K7)', async ({ page }) => {
  /*
   * Kein „Starte deine Serie!“. Das wäre die Aufforderung, die K7
   * ausschließt — und ein leeres Feld, das nach Verpflichtung aussieht,
   * bevor überhaupt etwas passiert ist.
   */
  await page.goto('/')
  await expect(startButton(page)).toBeVisible()
  await expect(page.locator('.streak')).toBeHidden()
})

test('zählt einen Tag, sobald eine Einheit zu Ende gelaufen ist', async ({ page }) => {
  test.setTimeout(120_000)

  await page.goto('/')
  await startEmergency(page)
  const learned = await collectItems(page, 8)
  await answerRecall(page, learned, 'all')
  await expect(page.getByRole('heading', { name: 'Geblieben' })).toBeVisible({ timeout: 30_000 })
  await page.getByRole('button', { name: 'Zurück' }).click()

  // Die kürzeste Einheit reicht — D-008: „ein Tag zählt ab 60 Sekunden“.
  await expect(page.locator('.streak-line')).toContainText('1')
  await expect(page.locator('.streak-line')).toContainText('Tag in Folge')
  await expect(page.locator('.streak-today')).toContainText('heute erledigt')
})

test('hält die Serie über einen verpassten Tag hinweg (D-008)', async ({ page }) => {
  await page.goto('/')
  await expect(startButton(page)).toBeVisible()

  /*
   * Neun Tage bis vorgestern, gestern nichts, heute wieder. Nach sieben Tagen
   * ist ein Schutztag verdient; er springt für gestern ein.
   *
   * Das ist der Fall, um den es D-008 geht: Apps, die eine lange Serie an
   * einem Grippetag vernichten, verlieren den Nutzer nicht an dem Tag,
   * sondern am Tag danach.
   */
  const days = [...Array.from({ length: 9 }, (_, index) => dayKey(-10 + index)), dayKey(0)]
  await seedDays(page, days)

  await expect(page.locator('.streak-line')).toContainText('10')
  await expect(page.locator('.streak-line')).toContainText('Tage in Folge')
  await expect(page.getByText('Ein Schutztag hat die Serie gehalten')).toBeVisible()
})

test('zeigt die Schutztage, die auf Vorrat sind', async ({ page }) => {
  await page.goto('/')
  await expect(startButton(page)).toBeVisible()

  // Vierzehn Tage am Stück: zwei Schutztage, und mehr lassen sich nicht
  // ansparen — sonst wäre die Serie irgendwann nicht mehr zu verlieren und
  // sagte gar nichts mehr.
  await seedDays(
    page,
    Array.from({ length: 21 }, (_, index) => dayKey(-20 + index)),
  )

  await expect(page.locator('.streak-line')).toContainText('21')
  await expect(page.locator('.streak-shields')).toContainText('2 Schutztage')
  await expect(page.locator('.shield')).toHaveCount(2)
})

test('nennt die Bestmarke erst, wenn sie etwas anderes sagt (K5, G-2)', async ({ page }) => {
  await page.goto('/')
  await expect(startButton(page)).toBeVisible()

  // Eine laufende Serie ohne Bruch: Bestmarke und laufende Serie wären
  // dieselbe Zahl, und zweimal dieselbe Zahl ist ein Möbel.
  await seedDays(
    page,
    Array.from({ length: 4 }, (_, index) => dayKey(-3 + index)),
  )
  await expect(page.locator('.streak-line')).toContainText('4')
  await expect(page.getByText('Bestmarke')).toBeHidden()

  // Nach einem Bruch steht sie da — der persönliche Rekord bleibt.
  await seedDays(page, [
    ...Array.from({ length: 6 }, (_, index) => dayKey(-30 + index)),
    dayKey(0),
  ])
  await expect(page.getByText('Bestmarke: 6')).toBeVisible()
})
