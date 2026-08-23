import { expect, test } from '@playwright/test'

import { startButton, visit } from './helpers.ts'

test('der erste Eindruck trägt die englische Marke fünf Sekunden und erklärt ANITEW visuell', async ({
  page,
}) => {
  test.setTimeout(30_000)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/?firstLaunch=1')

  const launch = page.locator('#anitew-launch')
  await expect(launch).toHaveCount(1)
  // Splash-Copy ist Marken-Copy: immer Englisch, auch wenn die App Deutsch spricht.
  await expect(page.getByText('MEMORIZE · RECALL · RETAIN · MASTER')).toBeVisible()
  await expect(page.getByText('Powered by Impekal')).toBeVisible()
  await expect(page.locator('.anitew-mark-path')).toHaveCount(1)
  await expect(page.locator('.anitew-mark-node')).toHaveCount(6)

  // Das allererste Geräte-Ritual dauert wirklich fünf Sekunden, nicht nur
  // „ungefähr länger als vorher“.
  await page.waitForTimeout(4_100)
  await expect(launch).toBeVisible()
  await expect(launch).toBeHidden({ timeout: 2_000 })

  await expect(page.locator('.arrival')).toBeVisible()
  await expect(page.getByText('Willkommen in deinem Gedächtnissystem.')).toBeVisible({ timeout: 8_000 })
  await expect(page.getByText('Erinnern. Verknüpfen. Behalten.')).toBeVisible()
  await expect(
    page.getByText('ANITEW trainiert Namen, Zahlen, Lernstoff und Erinnerungen aus deinem echten Leben.'),
  ).toBeVisible()

  await expect(page.getByText('Das macht ANITEW')).toBeVisible()
  await expect(page.getByText('Adaptives Training', { exact: true })).toBeVisible()
  await expect(page.getByText('Gedächtnistechniken', { exact: true })).toBeVisible()
  await expect(page.getByText('Memory World', { exact: true })).toBeVisible()
  await expect(page.getByText('Ehrliche Messung', { exact: true })).toBeVisible()
  await expect(page.getByText('Coach', { exact: true })).toBeVisible()
  await expect(page.getByText('Deine Daten. Deine Kontrolle.', { exact: true }).first()).toBeVisible()
  await expect(page.locator('.first-run-highlight-icon')).toHaveCount(7)
  await expect(page.getByText('PRIVAT · LOKAL ZUERST · DEINE DATEN, DEINE KONTROLLE')).toBeVisible()

  await expect(page.getByText('Google Drive verbinden', { exact: true })).toBeVisible()
  await expect(page.getByText(/sichtbaren Ordner „Anitew“/)).toBeVisible()
  await expect(page.getByText(/ohne zusätzliche ANITEW-Cloudkopie/)).toBeVisible()

  const explanation = page.locator('.first-run-questions')
  await expect(explanation).toContainText('Zwei kurze, freiwillige Fragen')
  await expect(explanation).toContainText('was du behalten willst')
  await expect(page.locator('.first-run-scroll-cue')).toBeVisible()

  await expect(page.getByText('Los geht’s', { exact: true })).toBeVisible()
  await expect(page.getByText('Direkt starten', { exact: true })).toBeVisible()
})

test('die Orientierung erklärt Core, Coach, Techniken, Memory World, Sync und Messung', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(page.locator('#anitew-launch')).toBeHidden({ timeout: 4_000 })
  await expect(page.locator('.first-run-questions')).toBeVisible({ timeout: 8_000 })

  await page.locator('.arrival .quiet').click()
  await expect(startButton(page)).toBeVisible({ timeout: 15_000 })
  const guide = page.locator('.first-run-guide')
  await expect(guide).toBeVisible({ timeout: 8_000 })
  await expect(page.getByText('Der ANITEW Core', { exact: true })).toBeVisible()
  await expect(page.locator('.first-run-guide-context')).toContainText('Coach')
  await expect(page.locator('.first-run-guide-context')).toContainText('Google Drive')

  const expected = [
    ['Deine Memory World', 'Eigene Fakten'],
    ['Memory Pulse', 'Coach'],
    ['Dein Trainingsportal', 'Gedächtnispalast'],
    ['Training ist nicht Messung', 'Google Drive'],
  ] as const
  for (const [title, context] of expected) {
    await page.locator('.first-run-guide-next').click()
    await expect(page.getByText(title, { exact: true })).toBeVisible()
    await expect(page.locator('.first-run-guide-context')).toContainText(context)
  }
  await expect(page.locator('.first-run-guide-next')).toHaveText('ANITEW öffnen')
  await page.locator('.first-run-guide-next').click()
  await expect(guide).toBeHidden()

  await page.reload()
  await expect(page.locator('#anitew-launch')).toBeHidden({ timeout: 4_000 })
  await expect(startButton(page)).toBeVisible({ timeout: 15_000 })
  await page.waitForTimeout(1_500)
  await expect(page.locator('.first-run-guide')).toHaveCount(0)
})

test('der Core schließt eindeutig und bietet System, Hell und Dunkel', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await visit(page)

  await page.locator('.hamburger').click()
  const close = page.locator('.drawer-close')
  await expect(close).toBeVisible({ timeout: 8_000 })
  await expect(close.locator('.drawer-close-label')).toHaveText('Menü schließen')
  const box = await close.boundingBox()
  expect(box).not.toBeNull()
  expect(box?.x ?? -1).toBeGreaterThanOrEqual(0)
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(390)
  expect(box?.y ?? -1).toBeGreaterThanOrEqual(0)
  expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(844)

  const theme = page.locator('.theme-control')
  await expect(theme).toBeVisible()
  await expect(theme.getByRole('button', { name: 'System' })).toHaveAttribute('aria-pressed', 'true')
  await theme.getByRole('button', { name: 'Dunkel' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-anitew-theme', 'dark')
  await expect(theme.getByRole('button', { name: 'Dunkel' })).toHaveAttribute('aria-pressed', 'true')
  await theme.getByRole('button', { name: 'Hell' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-anitew-theme', 'light')

  await close.click()
  await expect(page.locator('.drawer')).toBeHidden()
})
