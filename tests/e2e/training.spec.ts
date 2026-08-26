import { expect, test, type Page } from '@playwright/test'

import { answerRecall, collectItems, startButton, startEmergency, visit } from './helpers.ts'

/**
 * Trainingssprache getrennt von Oberflächensprache (Backlog L5, L7).
 *
 * Der Backlog nennt das ein Alleinstellungsmerkmal, und es steht und fällt
 * mit einer Eigenschaft, die seit M1 im Datenmodell steckt: **Die Sprache
 * hängt am Gegenstand, nicht an der Oberfläche.** `words:de:Anker` und
 * `words:en:anchor` sind zwei Einträge mit zwei Terminen — ein Wechsel
 * verliert deshalb nichts.
 */

async function trainOnce(page: Page) {
  // Über den Helfer, nicht roh: Er garantiert eine Runde, die Termine
  // hinterlässt — eine Rückwärts-Runde (D7) täte das absichtlich nicht,
  // und dieser Test zählt genau die Termine.
  await startEmergency(page)
  const learned = await collectItems(page, 8)
  await answerRecall(page, learned, 'all')
  await expect(page.getByRole('heading', { name: 'Geblieben' })).toBeVisible({ timeout: 60_000 })
  await page.getByRole('button', { name: 'Zurück' }).click()
  return learned
}

/** Die Sprachen, in denen Einträge liegen. */
async function itemLanguages(page: Page): Promise<string[]> {
  return page.evaluate(async () => {
    const open = indexedDB.open('anitew')
    const database: IDBDatabase = await new Promise((resolve, reject) => {
      open.onsuccess = () => resolve(open.result)
      open.onerror = () => reject(open.error)
    })
    const rows: { language: string }[] = await new Promise((resolve, reject) => {
      const request = database.transaction('itemStates').objectStore('itemStates').getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    return [...new Set(rows.map((row) => row.language))].sort()
  })
}

test('lässt die Oberfläche deutsch und den Inhalt englisch werden', async ({ page }) => {
  test.setTimeout(180_000)

  await visit(page)
  await expect(startButton(page)).toBeVisible()

  // Die Oberfläche bleibt, wie sie ist — nur der Inhalt wechselt.
  await page.locator('.language-training select').selectOption('en')
  await expect(startButton(page).locator('.start-label')).toHaveText('Beginnen')

  await trainOnce(page)
  expect(await itemLanguages(page)).toEqual(['en'])
})

test('trainiert Italienisch als eigene Reihe statt als englischen Rückfall', async ({ page }) => {
  test.setTimeout(180_000)

  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await page.locator('.language-training select').selectOption('it')
  await expect(page.locator('.language-training select')).toHaveValue('it')

  await trainOnce(page)
  expect(await itemLanguages(page)).toEqual(['it'])
})

test('trainiert Portugiesisch als eigene Reihe statt als englischen Rückfall', async ({ page }) => {
  test.setTimeout(180_000)

  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await page.locator('.language-training select').selectOption('pt')
  await expect(page.locator('.language-training select')).toHaveValue('pt')

  await trainOnce(page)
  expect(await itemLanguages(page)).toEqual(['pt'])
})

test('legt für jede Trainingssprache eine eigene Reihe an (L5)', async ({ page }) => {
  test.setTimeout(240_000)

  /*
   * Der Satz, den die App verspricht: **Ein Wechsel verliert nichts.** Nach
   * einer Einheit auf Deutsch und einer auf Englisch stehen zwei Reihen
   * nebeneinander, jede mit eigenen Terminen.
   */
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await trainOnce(page)
  expect(await itemLanguages(page)).toEqual(['de'])

  await page.locator('.language-training select').selectOption('en')
  await trainOnce(page)
  expect(await itemLanguages(page)).toEqual(['de', 'en'])
})

test('sagt, warum nur vollständig trainierbare Sprachen zur Auswahl stehen', async ({ page }) => {
  await visit(page)
  await expect(startButton(page)).toBeVisible()

  // Angeboten wird nur, wofür es eigenen Inhalt gibt — und die App sagt das,
  // statt eine Sprache zu versprechen, in der sie englische Wörter zeigt.
  const options = await page.locator('.language-training select').locator('option').allTextContents()
  expect(options).toEqual(['Deutsch', 'English', 'Français', 'Español', 'Italiano', 'Português'])
  await expect(page.getByText(/Eine Sprache anzubieten und dann englische Wörter/)).toBeVisible()

  /*
   * Über die Klasse und nicht über die Beschriftung — fünfte Begegnung mit
   * derselben Falle, diesmal mit einer Feinheit: „Sprache“ steckt in
   * „Trainingssprache“, und `exact` half **nicht**, weil das `<label>` das
   * `<select>` umschließt. Sein Text enthält damit auch alle Optionen, und
   * ein genauer Vergleich findet gar nichts mehr.
   */
  /*
    Die Oberfläche bietet nur an, was wirklich übersetzt ist
    (TRANSLATION_WORKFLOW §6). Neun Einträge, die still auf Englisch
    zurückfielen — Arabisch sogar als RTL-Dokument mit englischem Text —,
    wären ein Versprechen ohne Deckung. Eine per Systemsprache aufgelöste,
    noch unübersetzte Sprache bleibt mit ehrlicher Fußnote nutzbar.
  */
  const ui = await page.locator('.language:not(.language-training) select').locator('option').allTextContents()
  expect(ui).toEqual(['Deutsch', 'English'])
})
