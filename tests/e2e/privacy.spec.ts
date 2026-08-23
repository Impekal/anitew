import { expect, test } from '@playwright/test'

import { openPage, startButton, visit } from './helpers.ts'

test('sagt knapp, was lokal bleibt und was Push technisch braucht', async ({ page }) => {
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await openPage(page, 'Datenschutz')

  await expect(page.locator('.privacy-lead')).toHaveText('ANITEW bleibt local-first.')
  await expect(page.locator('.privacy-points li')).toHaveCount(5)
  await expect(page.getByText(/Training, Erinnerungen, Messungen und Profil bleiben auf diesem Gerät/)).toBeVisible()
  await expect(page.getByText(/technische Push-Adresse dieses Geräts/)).toBeVisible()
  await expect(page.getByText(/Keine Trainings- oder Gedächtnisinhalte/)).toBeVisible()
})

test('nennt auch Hosting und den optionalen Push-Netzweg', async ({ page }) => {
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await openPage(page, 'Datenschutz')

  await expect(page.getByText(/Hoster die üblichen Webserverdaten/)).toBeVisible()
  await expect(page.getByText(/Systembenachrichtigungen aktivierst/)).toBeVisible()
  await expect(page.getByText(/Training selbst bleibt offlinefähig/)).toBeVisible()
})

test('hält den ersten Bildschirm davon frei (D-011/G-2)', async ({ page }) => {
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await expect(page.locator('.privacy-lead')).toBeHidden()
})
