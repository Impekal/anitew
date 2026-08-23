import { expect, test } from '@playwright/test'

import { startButton, visit } from './helpers.ts'

test('der erste Eindruck erklärt ANITEW ausführlich und trägt die Marke fünf Sekunden', async ({
  page,
}) => {
  test.setTimeout(30_000)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/?firstLaunch=1')

  const launch = page.locator('#anitew-launch')
  await expect(launch).toHaveCount(1)
  await expect(page.getByText('ERINNERN · VERKNÜPFEN · ABRUFEN · FESTIGEN')).toBeVisible()
  await expect(page.getByText('Powered by Impekal')).toBeVisible()

  // Das allererste Geräte-Ritual dauert wirklich fünf Sekunden, nicht nur
  // „ungefähr länger als vorher“.
  await page.waitForTimeout(4_100)
  await expect(launch).toBeVisible()
  await expect(launch).toBeHidden({ timeout: 2_000 })

  await expect(page.locator('.arrival')).toBeVisible()
  await expect(page.getByText('Hol zurück, was bleiben soll.')).toBeVisible({ timeout: 8_000 })
  await expect(page.getByText('Gedächtnis ist Technik, kein Talent.')).toBeVisible()
  await expect(
    page.getByText('ANITEW passt das Training an dein tatsächliches Erinnerungsverhalten an – nicht an erfundene Scores.'),
  ).toBeVisible()

  await expect(page.getByText('Warum ANITEW anders ist')).toBeVisible()
  await expect(page.getByText('Es lernt dein Erinnerungsmuster.')).toBeVisible()
  await expect(page.getByText('Es lehrt Techniken.')).toBeVisible()
  await expect(page.getByText('Es trainiert dein echtes Leben.')).toBeVisible()
  await expect(page.getByText('Es misst getrennt vom Training.')).toBeVisible()
  await expect(page.getByText('Der Coach übersetzt deinen Verlauf.')).toBeVisible()
  await expect(page.getByText('Deine Daten können dir folgen.')).toBeVisible()
  await expect(page.getByText('LOCAL FIRST · OFFLINE · GOOGLE DRIVE OPTIONAL')).toBeVisible()

  await expect(page.getByText('Google Drive verbinden', { exact: true })).toBeVisible()
  await expect(page.getByText(/sichtbaren Ordner „Anitew“/)).toBeVisible()
  await expect(page.getByText(/Ohne Verbindung bleibt alles ausschließlich lokal/)).toBeVisible()

  const explanation = page.locator('.first-run-questions')
  await expect(explanation).toContainText('zwei kurze, freiwillige Fragen')
  await expect(explanation).toContainText('was du wirklich behalten willst')
  await expect(explanation).toContainText('wie viel Zeit du normalerweise hast')

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

test('der Schließen-Core bleibt sichtbar, vollständig im iPhone und eindeutig benannt', async ({
  page,
}) => {
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

  await close.click()
  await expect(page.locator('.drawer')).toBeHidden()
})
