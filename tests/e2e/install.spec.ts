import { devices, expect, test } from '@playwright/test'

import { openPage, startButton, visit } from './helpers.ts'

/**
 * Der bisherige iOS-Speicherhinweis bleibt als Auskunft im installierten bzw.
 * bewusst im Browser fortgesetzten Produkt erhalten. Normale E2E-Aufrufe
 * überspringen das neue Install-Gate über `navigator.webdriver`, damit nicht
 * hunderte fachfremde Tests einen Browser-Einstieg wegklicken müssen.
 */
test('sagt auf dem iPhone, warum der Startbildschirm zählt', async ({ browser }) => {
  const context = await browser.newContext({ ...devices['iPhone 13'] })
  const page = await context.newPage()

  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await openPage(page, 'Auf den Startbildschirm')

  await expect(page.getByText(/sieben Tage lang nicht benutzt wurde/)).toBeVisible()
  await expect(page.getByText(/Zum Home-Bildschirm/)).toBeVisible()
  await expect(page.getByText(/regelmäßig eine Sicherung speichern/)).toBeVisible()

  await context.close()
})

test('schweigt im normalen automatisierten Android- und Desktop-Pfad', async ({ page }) => {
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await page.locator('button.hamburger').click()
  await expect(page.locator('.drawer')).toBeVisible()
  await expect(page.getByText('Auf den Startbildschirm', { exact: true })).toHaveCount(0)
})

test('hält den ersten Bildschirm auch auf dem iPhone frei (D-011/G-2)', async ({ browser }) => {
  const context = await browser.newContext({ ...devices['iPhone 13'] })
  const page = await context.newPage()

  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await expect(page.getByText(/sieben Tage lang nicht benutzt wurde/)).toBeHidden()

  await context.close()
})

test('blockiert den Browser bis zur bewussten Installationsentscheidung', async ({ page }) => {
  await page.goto('/?installGate=1')

  await expect(page.getByRole('heading', { name: 'ANITEW als App installieren' })).toBeVisible()
  await expect(page.getByText('Meist weniger als eine Minute.')).toBeVisible()
  await expect(page.getByLabel('Dein Gerät')).toBeVisible()
  await expect(page.getByRole('button', { name: 'App installieren' })).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Nicht installieren, im Browser fortfahren' }),
  ).toBeVisible()

  await expect(page.getByRole('link', { name: 'Impressum' })).toHaveAttribute(
    'href',
    '/impressum.html',
  )
  await expect(page.getByRole('link', { name: 'Datenschutz' })).toHaveAttribute(
    'href',
    '/datenschutz.html',
  )
  await expect(page.locator('.onboarding, .challenge')).toHaveCount(0)

  await page.getByRole('button', { name: 'Nicht installieren, im Browser fortfahren' }).click()
  await expect(page.getByRole('heading', { name: 'ANITEW als App installieren' })).toHaveCount(0)
  await expect(page.locator('.onboarding, .challenge').first()).toBeVisible()
})

test('zeigt auf dem iPhone die echte Home-Screen-Anleitung', async ({ browser }) => {
  const context = await browser.newContext({ ...devices['iPhone 13'] })
  const page = await context.newPage()

  await page.goto('/?installGate=1')
  await expect(page.getByLabel('Dein Gerät')).toHaveValue('iphone')
  await page.getByRole('button', { name: 'App installieren' }).click()

  await expect(page.getByRole('heading', { name: 'Installation auf iPhone / iPad' })).toBeVisible()
  await expect(page.getByText(/Öffne ANITEW in Safari/)).toBeVisible()
  await expect(page.getByText(/Zum Home-Bildschirm/)).toBeVisible()
  await expect(page.getByText(/Bestätige mit „Hinzufügen“/)).toBeVisible()

  await context.close()
})
