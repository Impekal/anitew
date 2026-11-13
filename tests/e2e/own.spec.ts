import { expect, test } from '@playwright/test'

import { leavePage, openPage, visit } from './helpers.ts'

/**
 * Eigene Inhalte (Backlog I · D-032 / I2 / I3).
 *
 * Geprüft wird der Weg des Stoffes: einfügen → Vorschau (samt sichtbar
 * Abgelehntem) → übernehmen → Liste — und dass eine entfernte Karte
 * wirklich verschwindet. Alles lokal (I6); die Einheit selbst prüfen die
 * Kerntests des Planers.
 *
 * Fotoanalyse bleibt eine explizite BYOK-Abzweigung: Die Auswahl selbst darf
 * kein Netz berühren. Erst „Foto auswerten“ sendet die verkleinerte Kopie,
 * und auch deren Antwort muss durch dieselbe Memory-Bestätigungstür.
 */

test('macht aus eingefügtem Text Karten — und zeigt, was keine wurde', async ({ page }) => {
  await visit(page)
  await openPage(page, 'Eigene Inhalte')

  await page
    .locator('.own-input')
    .fill('Hauptstadt von Portugal – Lissabon\nNotruf: 112\nnur ein Wort')

  await expect(page.locator('.own-preview li')).toHaveCount(2)
  await expect(page.locator('.own-rejected li')).toHaveText(['nur ein Wort'])

  await page.getByRole('button', { name: 'Karten übernehmen' }).click()
  await expect(page.locator('.own-list li')).toHaveCount(2)
  await expect(page.locator('.own-card-state').first()).toHaveText('kommt in die nächste Einheit')

  await page.reload()
  await openPage(page, 'Eigene Inhalte')
  await expect(page.locator('.own-list li')).toHaveCount(2)

  // Seit dem Berichtigen trägt jede Karte zwei Knöpfe — der Name sagt, welcher.
  await page
    .locator('.own-card', { hasText: 'Notruf' })
    .getByRole('button', { name: 'Entfernen' })
    .click()
  await expect(page.locator('.own-list li')).toHaveCount(1)
  await expect(page.locator('.own-list')).toContainText('Lissabon')

  await leavePage(page)
})

test('Foto bleibt ohne Auswertungs-Tap eine lokale Vorlage und wird nicht gespeichert', async ({ page }) => {
  let imageRequests = 0
  await page.route('https://generativelanguage.googleapis.com/**', async (route) => {
    imageRequests += 1
    await route.abort()
  })

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
  await expect(page.locator('.own-photo-note')).toContainText('speichert oder synchronisiert es nicht')
  await expect(page.locator('.own-photo-analysis-note')).toContainText('Nur wenn du')
  expect(imageRequests).toBe(0)
  await expect(page.locator('.own-list li')).toHaveCount(0)

  await page.locator('.own-input').fill('Notruf: 112')
  await page.getByRole('button', { name: 'Karten übernehmen' }).click()
  await expect(page.locator('.own-list li')).toHaveCount(1)
  expect(imageRequests).toBe(0)

  await page.reload()
  await openPage(page, 'Eigene Inhalte')
  await expect(page.locator('.own-photo-preview')).toHaveCount(0)
  await expect(page.locator('.own-list li')).toHaveCount(1)
  await expect(page.locator('.own-list')).toContainText('112')
})

test('Foto-Auswertung sendet erst auf Tap und speichert erst nach Memory-Bestätigung', async ({ page }) => {
  let requestSeen = false
  await page.route('https://generativelanguage.googleapis.com/**', async (route) => {
    requestSeen = true
    const request = route.request()
    expect(request.headers()['x-goog-api-key']).toBe('AIza-foto-test')
    const body = request.postDataJSON() as any
    expect(body.system_instruction.parts[0].text).toContain('aus einem Bild')
    expect(body.contents[0].parts[0].inlineData.mimeType).toBe('image/jpeg')
    expect(body.contents[0].parts[0].inlineData.data.length).toBeGreaterThan(10)
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    nodes: [
                      { type: 'person', label: 'Mira' },
                      { type: 'fact', label: 'Cello' },
                    ],
                    edges: [{ from: 'Mira', to: 'Cello' }],
                  }),
                },
              ],
            },
          },
        ],
      }),
    })
  })

  // Der normale BYOK-Weg legt den Schlüssel ab; der Foto-Pfad erfindet keinen
  // zweiten geheimen Speicher und wechselt den Anbieter nicht still.
  await visit(page)
  await openPage(page, 'Coach')
  await page.locator('.coach-key-input').fill('AIza-foto-test')
  await page.getByRole('button', { name: 'Schlüssel speichern' }).click()
  await leavePage(page)
  await openPage(page, 'Eigene Inhalte')

  const onePixelPng = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9ZQmcAAAAASUVORK5CYII=',
    'base64',
  )
  await page.locator('.own-photo-input').setInputFiles({
    name: 'mira.png',
    mimeType: 'image/png',
    buffer: onePixelPng,
  })

  expect(requestSeen).toBe(false)
  await page.getByRole('button', { name: 'Foto auswerten' }).click()

  await expect(page.locator('.own-photo-analysis-status')).toContainText('Vorschläge aus dem Foto')
  await expect(page.locator('.own-memory-mode .remember-node')).toHaveCount(2)
  await expect(page.locator('.own-memory-mode .remember-edges li')).toHaveCount(1)
  expect(requestSeen).toBe(true)

  // Die KI-Antwort ist noch nicht gespeichert. Erst dieselbe Bestätigung wie
  // bei Text-Memory schreibt in den Graphen.
  await page.getByRole('button', { name: 'Bestätigen und merken' }).click()
  await expect(page.locator('.own-memory-mode .remember-saved')).toBeVisible()
  await expect(page.locator('.own-photo-preview')).toHaveCount(0)

  await leavePage(page)
  await openPage(page, 'Mein Gedächtnis')
  await expect(page.locator('.memory-counts')).toHaveText('2 Erinnerungen · 1 Verbindung')
})

test('MEMORY MODE übernimmt den Entwurf über dieselbe Bestätigungstür in den Graphen', async ({
  page,
}) => {
  await visit(page)
  await openPage(page, 'Eigene Inhalte')

  const material = 'Daniel arbeitet im Museum, kommt aus Madrid und spielt Gitarre.'
  await page.locator('.own-input').fill(material)

  await page.locator('.own-memory-mode-open').click()
  await expect(page.locator('.own-memory-mode .remember-input')).toHaveValue(material)

  await page.getByRole('button', { name: 'Vorschläge ansehen' }).click()
  await expect(page.locator('.own-memory-mode .remember-node')).toHaveCount(4)
  await expect(page.locator('.own-memory-mode .remember-edges li')).toHaveCount(3)

  await page.getByRole('button', { name: 'Bestätigen und merken' }).click()
  await expect(page.locator('.own-memory-mode .remember-saved')).toBeVisible()
  await expect(page.locator('.own-input')).toHaveValue('')

  await leavePage(page)
  await openPage(page, 'Mein Gedächtnis')
  await expect(page.locator('.memory-counts')).toHaveText('4 Erinnerungen · 3 Verbindungen')
})

test('Neue Menschen bleiben getrennte persönliche Abrufanker und werden erst nach Bestätigung gemerkt', async ({
  page,
}) => {
  await visit(page)
  await openPage(page, 'Eigene Inhalte')

  await page.getByRole('button', { name: 'Neue Menschen merken' }).click()
  await page.getByRole('textbox', { name: 'Name 1' }).fill('Mira')
  await page.getByRole('textbox', { name: /Merkmale.*1/ }).fill('Cello, Madrid')
  await page.getByRole('textbox', { name: 'Name 2' }).fill('Daniel')
  await page.getByRole('textbox', { name: /Merkmale.*2/ }).fill('Gitarre, Berlin')

  await page.getByRole('button', { name: 'Training vorbereiten' }).click()
  await expect(page.locator('.people-preview li')).toHaveCount(2)
  await expect(page.locator('.people-preview li').nth(0)).toContainText('Mira')
  await expect(page.locator('.people-preview li').nth(0)).toContainText('Cello · Madrid')
  await expect(page.locator('.people-preview li').nth(1)).toContainText('Daniel')
  await expect(page.locator('.people-preview li').nth(1)).toContainText('Gitarre · Berlin')

  await page.locator('.people-confirm').click()
  await expect(page.locator('.people-saved')).toBeVisible()

  await leavePage(page)
  await openPage(page, 'Mein Gedächtnis')
  await expect(page.locator('.memory-counts')).toHaveText('6 Erinnerungen · 4 Verbindungen')
  await expect(page.locator('.memoryzone')).toContainText('Mira')
  await expect(page.locator('.memoryzone')).toContainText('Daniel')
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
