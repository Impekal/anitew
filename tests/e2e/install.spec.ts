import { devices, expect, test } from '@playwright/test'

import { startButton } from './helpers.ts'

/**
 * Der Weg auf den Startbildschirm (Backlog Q5).
 *
 * Geprüft wird das Verhalten, das den Unterschied macht: Der Hinweis steht
 * **nur auf iOS im Browser** — dort ist er eine Auskunft über eine Gefahr,
 * anderswo wäre er eine Aufforderung ohne Anlass (K7).
 */

test('sagt auf dem iPhone, warum der Startbildschirm zählt', async ({ browser }) => {
  const context = await browser.newContext({ ...devices['iPhone 13'] })
  const page = await context.newPage()

  await page.goto('/')
  await expect(startButton(page)).toBeVisible()
  await page.getByText('Auf den Startbildschirm', { exact: true }).click()

  // Der Grund zuerst — er ist eine Tatsache über iOS und keine Werbung.
  await expect(page.getByText(/sieben Tage lang nicht benutzt wurde/)).toBeVisible()
  await expect(page.getByText(/Zum Home-Bildschirm/)).toBeVisible()
  // Und der zweite Weg für alle, die das nicht wollen.
  await expect(page.getByText(/regelmäßig eine Sicherung speichern/)).toBeVisible()

  await context.close()
})

test('schweigt auf Android und am Schreibtisch', async ({ page }) => {
  /*
   * Dort bleibt der Speicher auch im Tab. Ein Hinweis wäre eine Aufforderung
   * ohne Anlass — und der Browser lädt ohnehin selbst zur Installation ein.
   */
  await page.goto('/')
  await expect(startButton(page)).toBeVisible()
  await expect(page.getByText('Auf den Startbildschirm', { exact: true })).toHaveCount(0)
})

test('hält den ersten Bildschirm auch auf dem iPhone frei (D-011/G-2)', async ({ browser }) => {
  const context = await browser.newContext({ ...devices['iPhone 13'] })
  const page = await context.newPage()

  await page.goto('/')
  await expect(startButton(page)).toBeVisible()
  // Zugeklappt: erreichbar, aber nichts, was den Start bedrängt.
  await expect(page.getByText(/sieben Tage lang nicht benutzt wurde/)).toBeHidden()

  await context.close()
})
