import { expect, test } from '@playwright/test'

import { openPage, visit } from './helpers.ts'

/**
 * Der Coach (Backlog M · D-031).
 *
 * Geprüft wird die Haltung: Der Pflichtteil spricht **ohne** Schlüssel und
 * ohne Netz (frische Datenbank → der ehrliche Anfang), die Kür verlangt den
 * eigenen Schlüssel — und wenn das Netz fehlt, sagt die Seite das, statt zu
 * schweigen. Echte Anfragen an api.anthropic.com stellt kein Test.
 */

test('spricht ohne Schlüssel — aus den Zahlen, und ehrlich über deren Leere', async ({
  page,
}) => {
  await visit(page)
  await openPage(page, 'Coach')

  // Frische Datenbank: kein Schwerpunkt, keine Verschiebung — aber die
  // allererste Messung ist sofort fällig (F), und genau das steht da.
  // Der „ehrliche Anfang“ ohne jeden Befund ist Sache der Kerntests.
  await expect(page.locator('.coach-advice li')).toHaveCount(1)
  await expect(page.locator('.coach-advice')).toContainText('Messung')

  // Die Kür wartet auf den Schlüssel; gefragt werden kann noch nichts.
  await expect(page.locator('.coach-key-input')).toBeVisible()
  await expect(page.locator('.coach-question')).toHaveCount(0)
})

test('nimmt den Schlüssel, sagt bei fehlendem Netz die Wahrheit — und lässt ihn wieder gehen', async ({
  page,
}) => {
  // Kein Test ruft wirklich hinaus: Alles Richtung API wird gekappt und
  // muss als „keine Verbindung“ auf der Seite ankommen.
  await page.route('https://api.anthropic.com/**', (route) => route.abort())

  await visit(page)
  await openPage(page, 'Coach')

  await page.locator('.coach-key-input').fill('sk-ant-test-nicht-echt')
  await page.getByRole('button', { name: 'Schlüssel speichern' }).click()
  await expect(page.locator('.coach-question')).toBeVisible()

  await page.locator('.coach-question').fill('Wie halte ich Namen besser?')
  await page.getByRole('button', { name: 'Fragen' }).click()
  await expect(page.locator('.coach-failure')).toContainText('Keine Verbindung')

  // Entfernen wirkt sofort: Das Eingabefeld ist zurück, die Frage weg.
  await page.getByRole('button', { name: 'Schlüssel entfernen' }).click()
  await expect(page.locator('.coach-key-input')).toBeVisible()
  await expect(page.locator('.coach-question')).toHaveCount(0)
})
