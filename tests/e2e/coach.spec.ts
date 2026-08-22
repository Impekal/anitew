import { expect, test } from '@playwright/test'

import { openPage, visit } from './helpers.ts'

/**
 * Der Coach (Backlog M · D-031 · D-034).
 *
 * Geprüft wird die Haltung: Der Pflichtteil spricht **ohne** Schlüssel und
 * ohne Netz (frische Datenbank → die fällige Messung), die Kür verlangt den
 * eigenen Schlüssel bei einem wählbaren Anbieter — mit Anleitung und
 * Direktlink davor —, und wenn das Netz fehlt, sagt die Seite das, statt zu
 * schweigen. Kein Test ruft wirklich hinaus.
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

  // Gemini ist die Voreinstellung (D-034), und vor dem Feld stehen
  // Anleitung und Direktlink auf die Schlüssel-Seite des Anbieters.
  await expect(page.locator('.coach-provider select')).toHaveValue('gemini')
  await expect(page.locator('.coach-key-help a')).toHaveAttribute(
    'href',
    'https://aistudio.google.com/apikey',
  )

  // Die Kür wartet auf den Schlüssel; gefragt werden kann noch nichts.
  await expect(page.locator('.coach-key-input')).toBeVisible()
  await expect(page.locator('.coach-question')).toHaveCount(0)
})

test('nimmt den Schlüssel, sagt bei fehlendem Netz die Wahrheit — und lässt ihn wieder gehen', async ({
  page,
}) => {
  // Kein Test ruft wirklich hinaus: Alles Richtung Gemini wird gekappt und
  // muss als „keine Verbindung“ auf der Seite ankommen.
  await page.route('https://generativelanguage.googleapis.com/**', (route) => route.abort())

  await visit(page)
  await openPage(page, 'Coach')

  await page.locator('.coach-key-input').fill('AIza-test-nicht-echt')
  await page.getByRole('button', { name: 'Schlüssel speichern' }).click()
  await expect(page.locator('.coach-question')).toBeVisible()

  await page.locator('.coach-question').fill('Wie halte ich Namen besser?')
  await page.getByRole('button', { name: 'Fragen' }).click()
  await expect(page.locator('.coach-failure')).toContainText('Keine Verbindung')

  // Der Schlüssel gehört zum Anbieter: Wer zu Anthropic wechselt, sieht
  // dort das leere Feld samt eigener Anleitung — und zurück bei Gemini
  // ist der gespeicherte Schlüssel noch da.
  await page.locator('.coach-provider select').selectOption('anthropic')
  await expect(page.locator('.coach-key-input')).toBeVisible()
  await expect(page.locator('.coach-key-help a')).toHaveAttribute(
    'href',
    'https://console.anthropic.com/settings/keys',
  )
  await page.locator('.coach-provider select').selectOption('gemini')
  await expect(page.locator('.coach-question')).toBeVisible()

  // Entfernen wirkt sofort: Das Eingabefeld ist zurück, die Frage weg.
  await page.getByRole('button', { name: 'Schlüssel entfernen' }).click()
  await expect(page.locator('.coach-key-input')).toBeVisible()
  await expect(page.locator('.coach-question')).toHaveCount(0)
})

test('OpenAI bleibt BYOK und spricht direkt über die Responses API', async ({ page }) => {
  let requestSeen = false
  await page.route('https://api.openai.com/v1/responses', async (route) => {
    requestSeen = true
    const request = route.request()
    expect(request.headers().authorization).toBe('Bearer sk-test-nicht-echt')
    expect(request.postDataJSON()).toMatchObject({
      model: 'gpt-5.6-luna',
      input: expect.stringContaining('Namen'),
      instructions: expect.any(String),
    })
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        output: [
          {
            type: 'message',
            content: [{ type: 'output_text', text: 'Baue beim Namen sofort eine Verbindung.' }],
          },
        ],
      }),
    })
  })

  await visit(page)
  await openPage(page, 'Coach')
  await page.locator('.coach-provider select').selectOption('openai')
  await expect(page.locator('.coach-key-help a')).toHaveAttribute(
    'href',
    'https://platform.openai.com/api-keys',
  )

  await page.locator('.coach-key-input').fill('sk-test-nicht-echt')
  await page.getByRole('button', { name: 'Schlüssel speichern' }).click()
  await page.locator('.coach-question').fill('Wie halte ich Namen besser?')
  await page.getByRole('button', { name: 'Fragen' }).click()

  await expect(page.locator('.coach-answer')).toContainText('sofort eine Verbindung')
  expect(requestSeen).toBe(true)
})
