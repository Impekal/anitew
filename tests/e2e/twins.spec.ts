import { expect, test } from '@playwright/test'

import { answerRecall, collectItems, reachModuleRound, startButton, visit } from './helpers.ts'

/**
 * Die Zwillinge im Browser (C6 · D-027).
 *
 * Erkennbar ist das Modul erst beim Abruf (die Wahlknöpfe) — beim Einprägen
 * sieht es aus wie das Wortmodul, und genau so soll es sein: Der Köder
 * kommt erst mit der Frage. Der gemeinsame Starthelfer erreicht das Modul
 * über reproduzierbare Startzeitpunkte, ohne die Einheit oder ihre Timer
 * abzukürzen.
 */

test('prägt ein Wort ein, fragt mit dem Zwilling — und zählt den Köder als falsch', async ({
  page,
}) => {
  test.setTimeout(300_000)

  await visit(page)
  await expect(startButton(page)).toBeVisible()

  // Dieselbe Härtung wie bei math/people/associative: Nicht fünfzigmal auf
  // eine passende Millisekunde hoffen. Der Helfer prüft den echten Plan und
  // scheitert weiterhin, wenn Zwillinge nicht erreichbar sind.
  await reachModuleRound(page, 'twins')
  const learned = await collectItems(page, 8)
  await page.locator('.twin-choice').first().waitFor({ timeout: 30_000 })

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
