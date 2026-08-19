import { expect, test } from '@playwright/test'

import { leavePage, openPage, pollFirstModule, startButton, visit } from './helpers.ts'

/**
 * Der vertikale Durchstich (D-036), wie im Auftrag verlangt:
 *
 *   „Remember something“ → echte Information → Vorschläge → Bestätigen →
 *   Graph gespeichert → Constellation zeigt sie → die Mission nimmt die
 *   Erinnerung ins Training → Abruf wird gewertet → das Ergebnis fließt
 *   in den bestehenden FSRS-Mechanismus (Termine in itemStates).
 */

const DANIEL = 'Daniel arbeitet im Museum, kommt aus Madrid und spielt Gitarre.'

test('merkt echte Information: Vorschläge, Bestätigung, Constellation, Neuladen', async ({
  page,
}) => {
  await visit(page)
  await openPage(page, 'Mein Gedächtnis')
  await expect(page.locator('.memory-empty')).toBeVisible()

  await page.locator('.remember-input').fill(DANIEL)
  await page.getByRole('button', { name: 'Vorschläge ansehen' }).click()

  // Vier Knoten, drei Verbindungen — und nichts ist schon gespeichert.
  await expect(page.locator('.remember-node')).toHaveCount(4)
  await expect(page.locator('.remember-node').first()).toContainText('Daniel')
  await expect(page.locator('.remember-edges li')).toHaveCount(3)
  await expect(page.locator('.remember-edges li').first()).toContainText('Daniel → Museum')

  // Ein Vorschlag lässt sich abwählen — und seine Verbindung geht still mit.
  await page.locator('.remember-node', { hasText: 'Museum' }).click()
  await expect(page.locator('.remember-edges li')).toHaveCount(2)
  await page.locator('.remember-node', { hasText: 'Museum' }).click()
  await expect(page.locator('.remember-edges li')).toHaveCount(3)

  await page.getByRole('button', { name: 'Bestätigen und merken' }).click()

  // Die Constellation zeigt die echten Daten: 4 Punkte, 3 Linien, der Anker
  // trägt seinen Namen.
  await expect(page.locator('.memory-counts')).toHaveText('4 Erinnerungen · 3 Verbindungen')
  await expect(page.locator('.constellation circle')).toHaveCount(4)
  await expect(page.locator('.constellation line')).toHaveCount(3)
  await expect(page.locator('.constellation-label')).toHaveText('Daniel')

  // Neuladen darf den Graphen nicht verlieren.
  await page.reload()
  await openPage(page, 'Mein Gedächtnis')
  await expect(page.locator('.memory-counts')).toHaveText('4 Erinnerungen · 3 Verbindungen')
  await leavePage(page)

  // Und der Startbildschirm weiß es: Der Blick auf heute nennt den
  // schwächsten Anker — Daniel, denn er ist der einzige.
  await expect(page.locator('.today-memory')).toContainText('Daniel')
})

test('trainiert die Erinnerung in der Einheit — und FSRS bekommt die Termine', async ({
  page,
}) => {
  test.setTimeout(300_000)

  await visit(page)
  await openPage(page, 'Mein Gedächtnis')
  await page.locator('.remember-input').fill(DANIEL)
  await page.getByRole('button', { name: 'Vorschläge ansehen' }).click()
  await page.getByRole('button', { name: 'Bestätigen und merken' }).click()
  await expect(page.locator('.memory-counts')).toBeVisible()
  await leavePage(page)

  // Die Mission kommt über die normale Rotation — gesucht wird die Runde,
  // deren Modul laut persistiertem Plan „memory“ ist (keine Bildschirm-Wette).
  let found = false
  for (let attempt = 0; attempt < 60 && !found; attempt++) {
    await page.getByRole('button', { name: '60 Sekunden' }).click()
    await startButton(page).click()
    await page.locator('.settle').click()
    if ((await pollFirstModule(page)) !== 'memory') {
      await page.locator('.session-abort').click()
      await expect(page.locator('.challenge')).toBeVisible()
      continue
    }
    found = true
  }
  expect(found, 'in sechzig Anläufen kam keine Memory-Runde').toBe(true)

  // ENCODE: die Szene als Ganzes — Anker und seine drei Dinge.
  await expect(page.locator('.memory-anchor')).toHaveText('Daniel')
  await expect(page.locator('.memory-scene li')).toHaveCount(3)

  // RECALL: „Daniel — was gehört dazu?“ — Antworten in beliebiger
  // Reihenfolge, denn die Reihenfolge ist keine Gedächtnisleistung.
  await page.locator('.prompted-input').waitFor({ timeout: 40_000 })
  for (const answer of ['Gitarre', 'Museum', 'Madrid']) {
    await expect(page.locator('.prompted-question')).toHaveText('Daniel')
    await page.locator('.prompted-input').fill(answer)
    await page.locator('.prompted-form button[type=submit], .prompted-form .start').first().click()
  }

  // Alle drei zählen — die Zusammenfassung sagt es ehrlich.
  await expect(page.locator('.summary-score strong')).toHaveText('3', { timeout: 60_000 })
  await expect(page.locator('.summary-score span')).toHaveText('/ 3')

  // Und das Ergebnis liegt im bestehenden Lernmechanismus: drei
  // FSRS-Termine des Moduls „memory“ in itemStates.
  const tracked = await page.evaluate(() => {
    return new Promise<number>((resolve) => {
      const open = indexedDB.open('anitew')
      open.onsuccess = () => {
        const request = open.result.transaction('itemStates').objectStore('itemStates').getAll()
        request.onsuccess = () =>
          resolve(
            (request.result as { moduleId?: string }[]).filter(
              (row) => row.moduleId === 'memory',
            ).length,
          )
        request.onerror = () => resolve(-1)
      }
      open.onerror = () => resolve(-1)
    })
  })
  expect(tracked).toBe(3)
})

test('schlägt mit KI vor — nur mit Schlüssel, Anbieter gestubbt, bestätigt wird von Hand', async ({
  page,
}) => {
  // Kein Test ruft wirklich hinaus: Gemini antwortet aus der Route (D-037).
  await page.route('https://generativelanguage.googleapis.com/**', (route) =>
    route.fulfill({
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
                      { type: 'concept', label: 'Cello' },
                    ],
                    edges: [{ from: 'Mira', to: 'Cello' }],
                  }),
                },
              ],
            },
          },
        ],
      }),
    }),
  )

  await visit(page)

  // Ohne Schlüssel gibt es den KI-Knopf nicht — kein Pflichtpfad (M2).
  await openPage(page, 'Mein Gedächtnis')
  await expect(page.locator('.remember-suggest')).toBeVisible()
  await expect(page.locator('.remember-ai')).toHaveCount(0)
  await leavePage(page)

  // Der Schlüssel kommt dort hin, wo er hingehört: zum Coach.
  await openPage(page, 'Coach')
  await page.locator('.coach-key-input').fill('AIza-test-nicht-echt')
  await page.getByRole('button', { name: 'Schlüssel speichern' }).click()
  await leavePage(page)

  // Jetzt steht der KI-Weg offen — und sagt vorher, wohin der Text geht.
  await openPage(page, 'Mein Gedächtnis')
  await expect(page.locator('.remember-ainote')).toContainText('Google Gemini')
  await page.locator('.remember-input').fill('Mira spielt Cello.')
  await page.getByRole('button', { name: 'Mit KI vorschlagen' }).click()

  // Die Vorschläge tragen ihre Herkunft — und dieselbe Bestätigungstür.
  await expect(page.locator('.remember-aisource')).toBeVisible()
  await expect(page.locator('.remember-node')).toHaveCount(2)
  await expect(page.locator('.remember-edges li')).toHaveText(['Mira → Cello'])
  await page.getByRole('button', { name: 'Bestätigen und merken' }).click()
  await expect(page.locator('.memory-counts')).toContainText('2 Erinnerungen')

  // Fällt das Netz, sagt die Stelle es mit den Coach-Worten — nichts hängt.
  await page.unroute('https://generativelanguage.googleapis.com/**')
  await page.route('https://generativelanguage.googleapis.com/**', (route) => route.abort())
  await page.locator('.remember-input').fill('Noch ein Satz für später.')
  await page.getByRole('button', { name: 'Mit KI vorschlagen' }).click()
  await expect(page.locator('.remember-failure')).toContainText('Keine Verbindung')
  await leavePage(page)
})
