import { expect, test } from '@playwright/test'

import { pollFirstModule, startButton, visit } from './helpers.ts'

/**
 * Das Arbeitsgedächtnis im Browser (D7 · D-026).
 *
 * Welches Modul eine Einheit zieht, entscheidet der Seed — erzwingen lässt
 * es sich von außen nicht. Der Test startet deshalb Notfall-Einheiten und
 * verwirft sie, bis eine Rückwärts-Runde kommt: Bei einem von fünf
 * lernbaren Modulen sind zwanzig Anläufe praktisch sicher. Verwerfen ist
 * dafür der ehrliche Weg — es ist derselbe Knopf, den auch ein Mensch hat.
 */

test('zeigt die Ziffern kurz, sperrt das Feld und zählt die Umkehr ehrlich', async ({ page }) => {
  test.setTimeout(240_000)

  await visit(page)
  await expect(startButton(page)).toBeVisible()

  let digits = ''
  for (let attempt = 0; attempt < 50 && digits === ''; attempt++) {
    await page.getByRole('button', { name: '60 Sekunden' }).click()
    await startButton(page).click()
    await page.locator('.settle').click()

    // Welches Modul die Runde hat, sagt der persistierte Plan — kein
    // Bildschirm-Raten (dieselbe Lehre wie in `startEmergency`).
    if ((await pollFirstModule(page)) === 'reverse') {
      const reveal = page.locator('.reveal-digits')
      await reveal.waitFor({ timeout: 15_000 })
      digits = ((await reveal.textContent()) ?? '').trim()
      break
    }

    await page.locator('.session-abort').click()
    await expect(page.locator('.challenge')).toBeVisible()
  }
  expect(digits, 'in fünfzig Anläufen kam keine Rückwärts-Runde').toMatch(/^\d{5}$/)

  // Solange die Folge steht, ist das Feld gesperrt — sonst ließe sie sich
  // einfach von rechts nach links abtippen.
  const input = page.locator('.prompted-input')
  await expect(input).toBeDisabled()
  await expect(page.locator('.reveal-digits')).toBeVisible()

  // Nach dem Verdecken: Feld frei, Folge unsichtbar — aber noch im Baum
  // (visibility, nicht display: nichts springt).
  await expect(input).toBeEnabled({ timeout: 10_000 })
  await expect(page.locator('.reveal-digits')).toBeHidden()

  // Erste Frage richtig …
  await input.fill([...digits].reverse().join(''))
  await page.getByRole('button', { name: 'Fertig' }).click()

  // … die übrigen bewusst falsch: Die Zusammenfassung muss genau eine
  // richtige zählen, nicht großzügig runden.
  let total = 1
  for (; total < 12; total++) {
    const summary = page.locator('.summary-score')
    if ((await summary.count()) > 0) break
    const nextInput = page.locator('.prompted-input')
    await nextInput.waitFor({ timeout: 30_000 })
    await expect(nextInput).toBeEnabled({ timeout: 10_000 })
    await nextInput.fill('0')
    await page.getByRole('button', { name: 'Fertig' }).click()
  }

  await expect(page.locator('.summary-score strong')).toHaveText('1', { timeout: 30_000 })

  /*
   * Und die Ehrlichkeit dahinter (D-026): Die Antworten stehen als
   * Modul-Zeilen im Protokoll (daraus zählt die Sofort-Achse) — aber es
   * entsteht **kein Termin**: Umbauen ist kein Behalten, ein „Wiedersehen“
   * nach Tagen fragte das Falsche.
   */
  const stored = await page.evaluate(() => {
    return new Promise<{ answered: number; correct: number; tracked: number }>((resolve) => {
      const open = indexedDB.open('anitew')
      open.onsuccess = () => {
        const database = open.result
        const tx = database.transaction(['events', 'itemStates'])
        const events: { module?: string; kind: string; correct?: boolean }[] = []
        tx.objectStore('events').openCursor().onsuccess = (event) => {
          const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result
          if (cursor) {
            events.push(cursor.value as (typeof events)[number])
            cursor.continue()
          }
        }
        const count = tx.objectStore('itemStates').count()
        tx.oncomplete = () => {
          const answered = events.filter(
            (row) => row.kind === 'answered' && row.module === 'reverse',
          )
          resolve({
            answered: answered.length,
            correct: answered.filter((row) => row.correct === true).length,
            tracked: count.result,
          })
        }
      }
    })
  })
  expect(stored.answered).toBeGreaterThanOrEqual(2)
  expect(stored.correct).toBe(1)
  // Kein einziger Termin aus einer Rückwärts-Runde.
  expect(stored.tracked).toBe(0)
})
