import { expect, test } from '@playwright/test'

import { answerRecall, collectItems, startButton, visit } from './helpers.ts'

/**
 * Die Zwillinge im Browser (C6 · D-027).
 *
 * Erkennbar ist das Modul erst beim Abruf (die Wahlknöpfe) — beim Einprägen
 * sieht es aus wie das Wortmodul, und genau so soll es sein: Der Köder
 * kommt erst mit der Frage. Der Test startet deshalb Einheiten und bricht
 * alles ab, was sich als etwas anderes herausstellt.
 */

test('prägt ein Wort ein, fragt mit dem Zwilling — und zählt den Köder als falsch', async ({
  page,
}) => {
  test.setTimeout(300_000)

  await visit(page)
  await expect(startButton(page)).toBeVisible()

  let found = false
  let learned = { items: [] as string[] }
  for (let attempt = 0; attempt < 25 && !found; attempt++) {
    await page.getByRole('button', { name: '60 Sekunden' }).click()
    await startButton(page).click()
    await page.locator('.settle').click()

    const first = page.locator('.reveal-digits, .scene, .encode-word')
    await expect(first.first()).toBeVisible({ timeout: 15_000 })

    // Rückwärts und Szenen sind sicher nicht die Zwillinge — sofort neu.
    if (
      (await page.locator('.reveal-digits').count()) > 0 ||
      (await page.locator('.scene').count()) > 0
    ) {
      await page.locator('.session-abort').click()
      await expect(startButton(page)).toBeVisible()
      continue
    }

    // Ein Wortmodul — welches, zeigt erst der Abruf.
    learned = await collectItems(page, 8)
    await page.locator('.recall-input, .twin-choice').first().waitFor({ timeout: 30_000 })
    if ((await page.locator('.twin-choice').count()) === 0) {
      await page.locator('.session-abort').click()
      await expect(startButton(page)).toBeVisible()
      continue
    }
    found = true
  }
  expect(found, 'in fünfundzwanzig Anläufen kam keine Zwillingsrunde').toBe(true)

  // Beide Knöpfe tragen echte Wörter, und eines davon stand beim Einprägen da.
  const words = (await page.locator('.twin-choice').allTextContents()).map((word) => word.trim())
  expect(words).toHaveLength(2)
  expect(words.some((word) => learned.items.includes(word))).toBe(true)
  expect(words[0]).not.toBe(words[1])

  // Alle Fragen bis auf die letzte richtig — die letzte bekommt den Köder.
  await answerRecall(page, learned, 'allButLast')

  await expect(page.locator('.summary-score strong')).toHaveText(
    String(learned.items.length - 1),
    { timeout: 30_000 },
  )
  await expect(page.locator('.summary-score span')).toHaveText(`/ ${learned.items.length}`)

  // Und die Unterscheidungen bekommen Termine — sie kommen nach Tagen wieder.
  const tracked = await page.evaluate(() => {
    return new Promise<number>((resolve) => {
      const open = indexedDB.open('anitew')
      open.onsuccess = () => {
        const store = open.result.transaction('itemStates').objectStore('itemStates')
        const rows: { moduleId: string }[] = []
        store.openCursor().onsuccess = (event) => {
          const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result
          if (cursor) {
            rows.push(cursor.value as { moduleId: string })
            cursor.continue()
          } else {
            resolve(rows.filter((row) => row.moduleId === 'twins').length)
          }
        }
      }
    })
  })
  expect(tracked).toBe(learned.items.length)
})
