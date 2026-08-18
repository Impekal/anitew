import { expect, test, type Page } from '@playwright/test'

import { startButton, visit } from './helpers.ts'

/**
 * Erinnerungen im Browser (Backlog B8 · D-022).
 *
 * Der Punkt dieser Prüfung ist nicht, dass eine Benachrichtigung ankommt —
 * das kann das Web nicht zusagen. Der Punkt ist, dass die App **sagt**, was
 * sie kann, bevor jemand etwas einstellt. Eine App, die eine Erinnerung
 * ankündigt und keine schickt, hat schlimmer gelogen, als wenn sie gar keine
 * angeboten hätte (R-2).
 */

async function openReminders(page: Page) {
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await page.getByText('Erinnerung', { exact: true }).click()
}

test('sagt zuerst, was dieses Gerät kann — und dann erst die Einstellung', async ({ page }) => {
  await openReminders(page)

  /*
   * Ohne erteiltes Recht steht die Frage danach da und **keine** Uhrzeit.
   * Umgekehrt hätte jemand eine Zeit gewählt und läse hinterher, dass sie
   * nicht gilt.
   */
  await expect(page.getByRole('button', { name: 'Benachrichtigungen erlauben' })).toBeVisible()
  await expect(page.locator('.reminder input[type="time"]')).toHaveCount(0)
})

test('verschweigt die Einschränkung des Browsers nicht', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Rechte lassen sich nur in Chromium vorab erteilen')

  await page.context().grantPermissions(['notifications'])
  await openReminders(page)

  // Der Satz, auf den es ankommt: nur solange die App offen ist. Und er steht
  // ohne Sternchen da — die Hervorhebung wird gesetzt, nicht getippt.
  await expect(page.locator('.reminder strong')).toHaveText('solange es offen ist')
  await expect(page.getByText('**')).toHaveCount(0)
  await expect(page.getByText(/lässt sich im Browser nicht zusagen/)).toBeVisible()
  // Und dass die Einstellung trotzdem etwas wert ist.
  await expect(page.getByText(/als App aus dem Store läuft/)).toBeVisible()
})

test('merkt sich die Uhrzeit und lässt sie wieder abstellen', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Rechte lassen sich nur in Chromium vorab erteilen')

  await page.context().grantPermissions(['notifications'])
  await openReminders(page)

  const time = page.locator('.reminder input[type="time"]')
  await time.fill('07:15')
  await page.getByRole('button', { name: 'Erinnerung merken' }).click()
  /*
   * Eingegrenzt und exakt — zum dritten Mal in diesem Projekt dieselbe Falle:
   * Playwright vergleicht Text von Haus aus als **Teilzeichenkette**, und
   * „Aus.“ steckt in mehr, als man denkt. Der Panel ist ohnehin der richtige
   * Ort für die Frage.
   */
  const panel = page.locator('.reminder')
  await expect(panel.getByText('Gemerkt.', { exact: true })).toBeVisible()

  // Sie überlebt einen Neustart — sie liegt in denselben Einstellungen wie
  // alles andere und wandert damit in die Sicherung (N2).
  await page.reload()
  await page.getByText('Erinnerung', { exact: true }).click()
  await expect(page.locator('.reminder input[type="time"]')).toHaveValue('07:15')

  await page.getByRole('button', { name: 'Keine Erinnerung' }).click()
  await expect(panel.getByText('Aus.', { exact: true })).toBeVisible()
})

test('fragt nicht beim ersten Start nach Benachrichtigungen', async ({ page }) => {
  /*
   * Wer eine App öffnet und sofort gefragt wird, lehnt ab — und eine
   * Ablehnung lässt sich von der App aus nie wieder zurücknehmen. Gefragt
   * wird erst dort, wo jemand eine Erinnerung wirklich will.
   */
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Benachrichtigungen erlauben' })).toBeHidden()
})
