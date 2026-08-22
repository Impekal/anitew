import { expect, test } from '@playwright/test'

import { startButton, visit } from './helpers.ts'

test('der erste Eindruck erklärt ANITEW, die freiwilligen Fragen und den Unterschied', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  // Der Launch-Moment liegt direkt im HTML und muss die App vor dem ersten
  // React-Bild einmal als ANITEW markieren. Er verschwindet von selbst.
  const launch = page.locator('#anitew-launch')
  await expect(launch).toHaveCount(1)
  await expect(launch).toBeHidden({ timeout: 4_000 })

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
  await expect(page.getByText('LOCAL FIRST · OFFLINE · OHNE PFLICHTKONTO')).toBeVisible()

  const explanation = page.locator('.first-run-questions')
  await expect(explanation).toContainText('zwei kurze, freiwillige Fragen')
  await expect(explanation).toContainText('was du wirklich behalten willst')
  await expect(explanation).toContainText('wie viel Zeit du normalerweise hast')
  await expect(explanation).toContainText('Alles bleibt auf diesem Gerät')

  await expect(page.getByText('Los geht’s', { exact: true })).toBeVisible()
  await expect(page.getByText('Direkt starten', { exact: true })).toBeVisible()
})

test('die Orientierung erscheint einmal, erklärt die echte Oberfläche und bleibt danach weg', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(page.locator('#anitew-launch')).toBeHidden({ timeout: 4_000 })
  await expect(page.locator('.first-run-questions')).toBeVisible({ timeout: 8_000 })

  // Direkt starten überspringt nur die optionalen Fragen — nicht die kurze
  // Orientierung durch die neue Oberfläche.
  await page.locator('.arrival .quiet').click()
  await expect(startButton(page)).toBeVisible({ timeout: 15_000 })
  const guide = page.locator('.first-run-guide')
  await expect(guide).toBeVisible({ timeout: 8_000 })
  await expect(page.getByText('Der ANITEW Core', { exact: true })).toBeVisible()

  const expected = [
    'Deine Memory World',
    'Memory Pulse',
    'Dein Trainingsportal',
    'Training ist nicht Messung',
  ]
  for (const title of expected) {
    await page.locator('.first-run-guide-next').click()
    await expect(page.getByText(title, { exact: true })).toBeVisible()
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

test('der Schließen-Core bleibt auf einem iPhone vollständig in der sichtbaren Fläche', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await visit(page)

  // Eine eventuell noch offene Einführung ist ein Angebot. Der echte Core-
  // Tipp beendet sie und öffnet gleichzeitig den Atlas.
  await page.locator('.hamburger').click()
  const close = page.locator('.drawer-close')
  await expect(close).toBeVisible({ timeout: 8_000 })
  const box = await close.boundingBox()
  expect(box).not.toBeNull()
  expect(box?.x ?? -1).toBeGreaterThanOrEqual(0)
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(390)
  expect(box?.y ?? -1).toBeGreaterThanOrEqual(0)
  expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(844)

  await close.click()
  await expect(page.locator('.drawer')).toBeHidden()
})
