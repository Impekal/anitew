import { expect, test, type Page } from '@playwright/test'

import { answerRecall, collectItems, startButton } from './helpers.ts'

/**
 * Der Gedächtnispalast, im Browser nachgeprüft (Backlog G1, G2, G4, G6).
 *
 * Zwei Dinge werden hier geprüft, die es in keinem anderen Modul gibt:
 *
 * 1. **Die Lektion kommt zuerst.** Ohne sie stehen fünf Orte und fünf Dinge
 *    da, und niemand weiß, was er damit soll (D-013). Sie kommt genau einmal.
 * 2. **Der Abruf ist ein Abgehen** (G6): Nicht „nenne alles“, sondern Station
 *    für Station — „Flur. Was lag hier?“
 */

/** Startet neu, bis der Plan einen Gang zieht. */
async function startWalk(page: Page): Promise<boolean> {
  for (let attempt = 0; attempt < 25; attempt++) {
    await page.goto('/')
    await page.getByRole('button', { name: '60 Sekunden' }).click()
    await startButton(page).click()
    await page.locator('.settle').click()
    await expect(page.locator('.scene, .encode-word').first()).toBeVisible({ timeout: 30_000 })
    if ((await page.locator('.walk').count()) > 0) return true
    await page.evaluate(() => indexedDB.deleteDatabase('anitew'))
  }
  return false
}

test('erklärt den Palast, bevor der erste Gang kommt — und nur einmal', async ({ page }) => {
  test.setTimeout(180_000)

  /*
   * Auf einer frischen Datenbank ist das keine Frage des Zufalls: Solange die
   * Technik ungelehrt ist, stellt der Planer sie nach vorn. Deshalb reicht
   * hier ein Anlauf, wo die anderen Palasttests würfeln müssen.
   */
  await page.goto('/')
  // `exact`, weil „5 Minuten“ auch in „15 Minuten“ steckt — dieselbe Falle
  // wie bei „Beginnen“, und Playwright vergleicht Namen von Haus aus als
  // Teilzeichenkette.
  await page.getByRole('button', { name: '5 Minuten', exact: true }).click()
  await startButton(page).click()
  await page.locator('.settle').click()

  const lesson = page.locator('.lesson')
  await expect(lesson).toBeVisible({ timeout: 30_000 })
  await expect(lesson.getByText('Der Gedächtnispalast')).toBeVisible()
  // Der Satz, auf den es ankommt: Das Bild baut der Nutzer (D-017).
  await expect(lesson.getByText(/Das Bild musst du bauen, nicht lesen/)).toBeVisible()

  // Weggetippt, und der Gang steht da.
  await lesson.locator('.lesson-card').click()
  await expect(page.locator('.walk')).toBeVisible({ timeout: 30_000 })

  // Zweite Einheit: keine Lektion mehr.
  await page.goto('/')
  await page.getByRole('button', { name: '5 Minuten', exact: true }).click()
  await startButton(page).click()
  await page.locator('.settle').click()
  await expect(page.locator('.walk, .encode-word, .scene').first()).toBeVisible({ timeout: 30_000 })
  await expect(page.locator('.lesson').getByText('Der Gedächtnispalast')).toHaveCount(0)
})

test('legt fünf Dinge auf einen Weg und geht ihn danach ab', async ({ page }) => {
  test.setTimeout(180_000)

  expect(await startWalk(page), 'in fünfundzwanzig Anläufen kam kein Gang').toBe(true)

  // Der Weg steht als Ganzes da — mit seinem Palast darüber.
  const lead = ((await page.locator('.scene-person').textContent()) ?? '').trim()
  expect(lead).toMatch(/Dein Weg:/)

  const stations = await page.locator('.walk-station').allTextContents()
  const objects = await page.locator('.scene-facts dd').allTextContents()
  expect(stations).toHaveLength(5)
  expect(objects).toHaveLength(5)

  /*
   * Die Nummern sind nicht Zierde: Die feste Reihenfolge ist die halbe
   * Technik, und sie muss sichtbar sein.
   */
  expect(await page.locator('.walk-step').allTextContents()).toEqual(['1', '2', '3', '4', '5'])

  // Kein Ding liegt zweimal auf demselben Weg — sonst wäre „wo lag es?“ nicht
  // zu beantworten.
  expect(new Set(objects).size).toBe(5)

  const learned = await collectItems(page)
  expect(learned.scene?.size).toBe(5)

  /*
   * Und jetzt das Abgehen (G6). Gefragt wird nicht „nenne alles“, sondern
   * Station für Station — der Ort steht auf dem Schild, die Frage darüber ist
   * jedes Mal dieselbe.
   */
  await page.locator('.prompted').first().waitFor({ timeout: 60_000 })
  await expect(page.locator('.placemark-station')).toBeVisible()
  await expect(page.locator('.prompted .hint').first()).toContainText('Was lag hier?')
  const where = ((await page.locator('.placemark-station').textContent()) ?? '').trim()
  expect(stations).toContain(where)

  await answerRecall(page, learned, 'all')

  // Fünf Stationen, fünf richtige Antworten — und die Zusammenfassung zählt
  // ehrlich mit.
  await expect(page.locator('.summary-score').first()).toBeVisible({ timeout: 60_000 })
  await expect(page.locator('.summary-score strong').first()).toHaveText('5')
  await expect(page.locator('.summary-score span').first()).toHaveText('/ 5')

  /*
   * In der Zusammenfassung steht der **Gegenstand**, nicht seine Station:
   * „Toaster“ trägt sich selbst, und erinnert hat man sich an das Ding.
   */
  const listed = await page.locator('.summary-words').first().allTextContents()
  for (const object of objects) expect(listed.join(' ')).toContain(object)
})
