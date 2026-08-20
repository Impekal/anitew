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

  // Die Entdeckungszeile: Solange nichts gemerkt und die Seite nie offen
  // war, sagt der Startbildschirm einmal, dass es sie gibt — und ihre Tür
  // führt hinein.
  await expect(page.locator('.today-invite')).toBeVisible()
  await page.locator('.today-invite-open').click()
  await expect(page.locator('.memory-empty')).toBeVisible()
  await leavePage(page)
  // Gesehen heißt gesehen: Die Zeile kommt nicht wieder.
  await expect(page.locator('.today-invite')).toHaveCount(0)

  await openPage(page, 'Mein Gedächtnis')
  await expect(page.locator('.memory-empty')).toBeVisible()

  await page.locator('.remember-input').fill(DANIEL)
  await page.getByRole('button', { name: 'Vorschläge ansehen' }).click()

  // Vier Knoten, drei Verbindungen — und nichts ist schon gespeichert.
  // Die Beschriftungen sind seit Phase 1 editierbare Eingabefelder; deshalb
  // prüfen wir ihren Wert statt den innerText des umgebenden Knotens.
  await expect(page.locator('.remember-node')).toHaveCount(4)
  await expect(page.locator('.remember-node input').first()).toHaveValue('Daniel')
  await expect(page.locator('.remember-edges li')).toHaveCount(3)
  await expect(page.locator('.remember-edges li').first()).toContainText('Daniel → Museum')

  // Ein Vorschlag lässt sich abwählen — und seine Verbindung geht still mit.
  await page.getByRole('button', { name: 'Museum nicht übernehmen' }).click()
  await expect(page.locator('.remember-edges li')).toHaveCount(2)
  await page.getByRole('button', { name: 'Museum wieder übernehmen' }).click()
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
      continue
    }
    found = true
  }
  expect(found).toBe(true)

  // Den Memory-Block wirklich bis zum Abruf spielen. Der Runner schreibt das
  // Ergebnis über denselben `recordOutcome`-Pfad wie jedes andere Modul.
  while ((await page.locator('.session-module').getAttribute('data-module')) === 'memory') {
    const entries = page.locator('.recall-entry')
    if ((await entries.count()) > 0) {
      for (let index = 0; index < (await entries.count()); index++) {
        await entries.nth(index).fill(index === 0 ? 'Museum' : index === 1 ? 'Madrid' : 'Gitarre')
      }
      await page.locator('.recall-submit').click()
    } else {
      await page.locator('.session-next').click()
    }
  }

  await expect
    .poll(async () =>
      page.evaluate(async () => {
        const request = indexedDB.open('anitew')
        const db = await new Promise<IDBDatabase>((resolve, reject) => {
          request.onsuccess = () => resolve(request.result)
          request.onerror = () => reject(request.error)
        })
        const transaction = db.transaction('itemStates', 'readonly')
        const all = transaction.objectStore('itemStates').getAll()
        const rows = await new Promise<Array<{ itemId: string }>>((resolve, reject) => {
          all.onsuccess = () => resolve(all.result as Array<{ itemId: string }>)
          all.onerror = () => reject(all.error)
        })
        db.close()
        return rows.some((row) => row.itemId.startsWith('memory:'))
      }),
    )
    .toBe(true)
})
