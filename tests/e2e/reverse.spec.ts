import { expect, test } from '@playwright/test'

import { pollFirstModule, startButton, visit } from './helpers.ts'

/**
 * Das Arbeitsgedächtnis im Browser (D7 · D-026).
 *
 * ── Warum hier eine feste Uhrzeit steht ───────────────────────────────────
 *
 * Welches Modul eine Einheit zieht, entscheidet der Seed, und der ist
 * `${tag}:${modus}:${startzeit}` (`App.tsx`) — also allein die Uhr. Bis zum
 * 02.09. startete dieser Test deshalb bis zu **fünfzig** Notfall-Einheiten
 * und verwarf sie, bis zufällig eine Rückwärts-Runde kam.
 *
 * Ein Test, der würfelt, ist ein Test, der irgendwann lügt: Seine Dauer ist
 * Glückssache — gemessen am 02.09. zwischen 42 Sekunden und einer knappen
 * Minute für dieselbe Prüfung —, und wenn er einmal rot ist, weiß niemand,
 * ob die App oder das Los schuld war.
 *
 * Der Seed lässt sich von außen festlegen — es braucht nur die richtige
 * Stelle: `page.clock.setFixedTime()` hält `Date.now()` an, **ohne** die
 * Zeitgeber anzuhalten. Und die Dauer einer Einheit hängt gar nicht an der
 * Wanduhr: `platform/web/clock.ts` misst sie mit `performance.now()`, genau
 * damit ein Sprung der Wanduhr einer laufenden Einheit nichts anhaben kann.
 * Beides zusammen macht das Modul planbar, ohne dass die App etwas davon
 * mitbekommt oder eine Testklappe bekäme.
 *
 * Gemessen am 02.09. auf einem frischen Stand, drei Läufe über Schreibtisch
 * und Telefon, jedes Mal gleich: Sekunde 17 und 21 ziehen `reverse`,
 * Sekunde 24 `spatial`, Sekunde 30 `missions`.
 *
 * Ändert der Planer sein Verhalten, fällt das hier auf — und die Meldung
 * unten sagt, was zu tun ist. Das ist der Unterschied zu einem Würfel:
 * Dieser Test wird nicht launisch, er wird eindeutig.
 */

/** Startzeiten, die auf einem frischen Stand eine Rückwärts-Runde ziehen. */
const RUECKWAERTS_ZEITEN = [
  Date.UTC(2026, 0, 15, 9, 0, 17),
  Date.UTC(2026, 0, 15, 9, 0, 21),
]

test('zeigt die Ziffern kurz, sperrt das Feld und zählt die Umkehr ehrlich', async ({ page }) => {
  test.setTimeout(240_000)

  await visit(page)
  await expect(startButton(page)).toBeVisible()

  let digits = ''
  const gezogen: string[] = []
  for (const zeit of RUECKWAERTS_ZEITEN) {
    // `setFixedTime` hält nur `Date.now()` an; Zeitgeber und `performance.now()`
    // laufen weiter, die Einheit misst ihre Sekunden also unverändert.
    await page.clock.setFixedTime(new Date(zeit))
    await page.reload()
    await page.getByRole('button', { name: '60 Sekunden' }).click()
    await startButton(page).click()
    await page.locator('.settle').click()

    // Welches Modul die Runde hat, sagt der persistierte Plan — kein
    // Bildschirm-Raten (dieselbe Lehre wie in `startEmergency`).
    const modul = await pollFirstModule(page)
    gezogen.push(modul)
    if (modul === 'reverse') {
      const reveal = page.locator('.reveal-digits')
      await reveal.waitFor({ timeout: 15_000 })
      digits = ((await reveal.textContent()) ?? '').trim()
      break
    }

    await page.locator('.session-abort').click()
    await expect(page.locator('.challenge')).toBeVisible()
  }
  expect(
    digits,
    `keine der hinterlegten Startzeiten zog eine Rückwärts-Runde (gezogen: ${gezogen.join(', ')}). ` +
      'Der Planer hat sein Verhalten geändert — neue Zeiten ermitteln, statt die Anläufe zu erhöhen.',
  ).toMatch(/^\d{5}$/)

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
