import { expect, test } from '@playwright/test'

import { openPage, startButton } from './helpers.ts'

/**
 * Das Kennenlernen (Onboarding).
 *
 * Hier wird absichtlich **nicht** `visit` benutzt: Diese Prüfungen wollen
 * genau den allerersten Start sehen, den alle anderen überspringen.
 *
 * Die Regel hinter allen Fällen: Was jemand über sich sagt, wird Vorschlag
 * und Anrede — nie eine Aussage über sein Gedächtnis (R-1). Und einmal
 * beantwortet (auch mit „nichts“) kommt keine Frage wieder (D-015).
 */

test('fragt beim ersten Öffnen — und macht aus den Antworten Vorschläge, keine Urteile', async ({
  page,
}) => {
  await page.goto('/')

  // Der erste Bildschirm ist die Begrüßung, nicht ein Formular.
  await expect(page.locator('.arrival')).toBeVisible()
  await expect(page.getByText('Schön, dass du da bist.')).toBeVisible()

  await startButton(page).click()

  // Name — wird zur Anrede, zu nichts sonst.
  await page.locator('.arrival-name').fill('Anna')
  await page.locator('.arrival-next').click()

  // Ziel: Zahlen. Wird ein Schwerpunkt-Vorschlag.
  await page.locator('.choice', { hasText: 'Zahlen & PINs' }).click()

  // Zeitbudget: 3 Minuten. Wird die Voreinstellung des Startbildschirms.
  await page.locator('.choice', { hasText: '3 Minuten' }).click()

  // Tageszeit und Altersband.
  await page.locator('.choice', { hasText: 'Abends' }).click()
  await page.locator('.choice', { hasText: '30 bis 49' }).click()

  // Danach steht der Startbildschirm — mit Anrede …
  await expect(page.locator('.challenge')).toBeVisible()
  await expect(page.locator('.greeting')).toContainText('Hallo Anna.')

  // … mit dem gewählten Zeitbudget als Voreinstellung …
  await expect(page.locator('.mode-active')).toHaveText('3 Minuten')

  // … und mit dem Ziel als Schwerpunkt. Entscheidend ist die Begründung:
  // Sie nennt das Vorhaben, nicht eine Messung, die es nie gab (R-1).
  await expect(page.locator('.focus')).toContainText('Zahlen')
  await expect(page.locator('.focus-why')).toContainText('vorgenommen')
  await expect(page.locator('.focus-why')).not.toContainText('zurückkam')
})

test('lässt alles überspringen — und fragt danach nie wieder', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.arrival')).toBeVisible()

  // Der Ausgang ist ein echter Knopf auf dem ersten Schritt (D-015).
  // Der Startbildschirm baut sich nach dem Klick asynchron auf — unter
  // Suite-Volllast hat das die 5-Sekunden-Standardfrist einmal gerissen
  // (dieselbe Familie wie der Neulade-Fall unten bei „Über dich“).
  await page.locator('.arrival .quiet').click()
  await expect(page.locator('.challenge')).toBeVisible({ timeout: 15_000 })

  // Auch ein leeres Profil ist eine Antwort: Beim nächsten Öffnen steht
  // sofort der Startbildschirm.
  await page.reload()
  await expect(page.locator('.challenge')).toBeVisible({ timeout: 15_000 })
  await expect(page.locator('.arrival')).toHaveCount(0)
})

test('macht die Antworten unter „Über dich“ änderbar — und die Änderung wirkt', async ({
  page,
}) => {
  await page.goto('/')
  await page.locator('.arrival .quiet').click()
  await expect(page.locator('.challenge')).toBeVisible()

  // Ohne Antworten: kein Schwerpunkt aus dem Nichts (K7).
  await expect(page.locator('.focus')).toHaveCount(0)

  // Nachträglich ein Ziel setzen.
  await openPage(page, 'Über dich')
  await page.locator('.about-field select').first().selectOption('names')

  // Die Änderung überlebt das Neuladen und wird zum Vorschlag. Nach dem
  // Neuladen liest die App Profil und Zählungen erst asynchron — unter
  // Suite-Volllast hat das die 5-Sekunden-Standardfrist einmal gerissen.
  await page.reload()
  await expect(page.locator('.focus')).toContainText('Gesichter', { timeout: 15_000 })
  await expect(page.locator('.focus-why')).toContainText('vorgenommen')
})
