import { expect, test } from '@playwright/test'

import { leavePage, openPage, visit } from './helpers.ts'

/**
 * Eigene Inhalte (Backlog I · D-032).
 *
 * Geprüft wird der Weg des Stoffes: einfügen → Vorschau (samt sichtbar
 * Abgelehntem) → übernehmen → Liste — und dass eine entfernte Karte
 * wirklich verschwindet. Alles lokal (I6); die Einheit selbst prüfen die
 * Kerntests des Planers.
 */

test('macht aus eingefügtem Text Karten — und zeigt, was keine wurde', async ({ page }) => {
  await visit(page)
  await openPage(page, 'Eigene Inhalte')

  await page
    .locator('.own-input')
    .fill('Hauptstadt von Portugal – Lissabon\nNotruf: 112\nnur ein Wort')

  // Die Vorschau: zwei Karten, eine sichtbar abgelehnte Zeile.
  await expect(page.locator('.own-preview li')).toHaveCount(2)
  await expect(page.locator('.own-rejected li')).toHaveText(['nur ein Wort'])

  await page.getByRole('button', { name: 'Karten übernehmen' }).click()
  await expect(page.locator('.own-list li')).toHaveCount(2)
  // Neue Karten sind noch nicht terminiert — sie kommen in die nächste Einheit.
  await expect(page.locator('.own-card-state').first()).toHaveText('kommt in die nächste Einheit')

  // Die Karten überleben das Neuladen (Einstellungen, nicht Arbeitsspeicher).
  await page.reload()
  await openPage(page, 'Eigene Inhalte')
  await expect(page.locator('.own-list li')).toHaveCount(2)

  // Entfernen wirkt: eine weg, eine bleibt.
  await page.locator('.own-card', { hasText: 'Notruf' }).getByRole('button').click()
  await expect(page.locator('.own-list li')).toHaveCount(1)
  await expect(page.locator('.own-list')).toContainText('Lissabon')

  await leavePage(page)
})

test('Foto bleibt eine lokale Vorlage und wird nicht als Inhalt gespeichert', async ({ page }) => {
  await visit(page)
  await openPage(page, 'Eigene Inhalte')

  const onePixelPng = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9ZQmcAAAAASUVORK5CYII=',
    'base64',
  )

  await page.locator('.own-photo-input').setInputFiles({
    name: 'notizen.png',
    mimeType: 'image/png',
    buffer: onePixelPng,
  })

  const photo = page.locator('.own-photo-preview img')
  await expect(photo).toBeVisible()
  await expect(photo).toHaveAttribute('src', /^blob:/)
  await expect(page.locator('.own-photo-note')).toContainText('speichert, synchronisiert oder sendet es nicht')
  await expect(page.locator('.own-list li')).toHaveCount(0)

  // Das Foto ist nur Vorlage. Erst der ausdrücklich bestätigte Text wird Karte.
  await page.locator('.own-input').fill('Notruf: 112')
  await page.getByRole('button', { name: 'Karten übernehmen' }).click()
  await expect(page.locator('.own-list li')).toHaveCount(1)

  // Nach einem Reload ist das Bild weg, die bestätigte Karte bleibt.
  await page.reload()
  await openPage(page, 'Eigene Inhalte')
  await expect(page.locator('.own-photo-preview')).toHaveCount(0)
  await expect(page.locator('.own-list li')).toHaveCount(1)
  await expect(page.locator('.own-list')).toContainText('112')
})

test('Diktat fügt nur nach bestätigter lokaler Erkennung Text zum Entwurf hinzu', async ({ page }) => {
  await page.addInitScript(() => {
    class Recognition {
      static async available(options: unknown) {
        ;(window as any).__dictationAvailableOptions = options
        return 'available' as const
      }

      lang = ''
      continuous = false
      interimResults = false
      processLocally = false
      onresult: ((event: any) => void) | null = null
      onerror: (() => void) | null = null
      onend: (() => void) | null = null

      start() {
        ;(window as any).__dictationStartedLocally = this.processLocally
        queueMicrotask(() => {
          this.onresult?.({
            results: {
              0: { 0: { transcript: 'Notruf: 112' }, length: 1, isFinal: true },
              length: 1,
            },
          })
        })
      }
    }

    ;(window as any).SpeechRecognition = Recognition
  })

  await visit(page)
  await openPage(page, 'Eigene Inhalte')
  await page.locator('.own-input').fill('Hauptstadt von Portugal – Lissabon')

  await page.locator('.own-dictate').click()

  await expect(page.locator('.own-input')).toHaveValue(
    'Hauptstadt von Portugal – Lissabon\nNotruf: 112',
  )
  await expect(page.locator('.own-preview li')).toHaveCount(2)
  await expect
    .poll(() => page.evaluate(() => (window as any).__dictationStartedLocally))
    .toBe(true)
  await expect
    .poll(() => page.evaluate(() => (window as any).__dictationAvailableOptions))
    .toEqual({ langs: ['de'], processLocally: true })
})

test('Diktat lässt den Entwurf unangetastet, wenn lokales Erkennen nicht verfügbar ist', async ({
  page,
}) => {
  await page.addInitScript(() => {
    class Recognition {
      static async available() {
        return 'downloadable' as const
      }

      lang = ''
      continuous = false
      interimResults = false
      processLocally = false
      onresult = null
      onerror = null
      onend = null

      start() {
        throw new Error('darf ohne lokale Verfügbarkeit nicht starten')
      }
    }

    ;(window as any).SpeechRecognition = Recognition
  })

  await visit(page)
  await openPage(page, 'Eigene Inhalte')
  await page.locator('.own-input').fill('Hauptstadt von Portugal – Lissabon')

  await page.locator('.own-dictate').click()

  await expect(page.locator('.own-input')).toHaveValue('Hauptstadt von Portugal – Lissabon')
  await expect(page.locator('.own-dictation-status')).toContainText('nicht verfügbar')
})
