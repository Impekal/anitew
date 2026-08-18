import { expect, test } from '@playwright/test'

import { answerRecall, collectItems, startButton } from './helpers.ts'

/**
 * Fehlertoleranz (Backlog P7).
 *
 * Auf einem echten Gerät trifft ANITEW auf Dinge, die der Buildrechner nie
 * sieht: einen privaten Safari-Modus ohne Datenbank, einen vollen Speicher,
 * abgelehnte Benachrichtigungsrechte. Der schlimmste Ausgang ist ein weißer
 * Bildschirm — geprüft wird deshalb zuerst, dass die App **überhaupt läuft**,
 * wenn nichts gespeichert werden kann.
 */

test('läuft ohne jede Datenbank weiter (privater Modus)', async ({ page }) => {
  /*
   * IndexedDB komplett wegnehmen, bevor die App lädt — genau das tut Safari
   * im privaten Modus (historisch) und „alle Cookies blockieren“ heute noch.
   */
  await page.addInitScript(() => {
    Object.defineProperty(window, 'indexedDB', { get: () => undefined })
  })

  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(String(error)))

  await page.goto('/')

  // Kein weißer Bildschirm: Der Startknopf ist da.
  await expect(startButton(page)).toBeVisible({ timeout: 30_000 })

  // Und eine Einheit lässt sich trotzdem starten.
  await page.getByRole('button', { name: '60 Sekunden' }).click()
  await startButton(page).click()
  await page.locator('.settle').click()
  await expect(page.locator('.encode-word, .scene, .lesson').first()).toBeVisible({ timeout: 30_000 })

  expect(errors, `ungefangene Fehler: ${errors.join(' | ')}`).toEqual([])
})

test('sagt im privaten Modus, dass nichts gespeichert wird (P7, N2)', async ({ page }) => {
  /*
   * Der Unterschied zwischen einer App, die still Daten verliert, und einer,
   * die es sagt. Der Satz steht ganz oben und nicht im zugeklappten
   * Fundament-Fach — dort läse ihn niemand, bevor es zu spät ist.
   */
  await page.addInitScript(() => {
    Object.defineProperty(window, 'indexedDB', { get: () => undefined })
  })

  await page.goto('/')
  await expect(startButton(page)).toBeVisible({ timeout: 30_000 })
  await expect(page.getByText(/Dieses Gerät speichert gerade nichts/)).toBeVisible()
  // Mit Ausweg, nicht nur Diagnose.
  await expect(page.getByText(/ein normales Fenster benutzen/)).toBeVisible()
})

test('schweigt, wo gespeichert wird', async ({ page }) => {
  // Die Gegenprobe: Auf einem gewöhnlichen Gerät darf die Warnung nie
  // erscheinen — sonst wäre sie ein Fehlalarm, und Fehlalarme lehrt man sich
  // zu übersehen.
  await page.goto('/')
  await expect(startButton(page)).toBeVisible()
  await expect(page.getByText(/Dieses Gerät speichert gerade nichts/)).toHaveCount(0)
})

test('führt eine ganze Einheit ohne Datenbank zu Ende (voller Speicher)', async ({ page }) => {
  /*
   * Derselbe Fehlerfall wie ein voller Speicher: Jeder Schreibversuch wirft.
   * Bewiesen wird, dass die Einheit trotzdem bis zur Zusammenfassung läuft —
   * die Zahl dort kommt aus dem, was im Kopf steht, nicht aus der Datenbank.
   * Nur der Fortschritt danach ist weg, und genau das sagt die Zeile oben.
   */
  test.setTimeout(120_000)

  await page.addInitScript(() => {
    Object.defineProperty(window, 'indexedDB', { get: () => undefined })
  })
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(String(error)))

  await page.goto('/')
  await page.getByRole('button', { name: '60 Sekunden' }).click()
  await startButton(page).click()
  await page.locator('.settle').click()

  const learned = await collectItems(page, 8)
  await answerRecall(page, learned, 'all')

  await expect(page.getByRole('heading', { name: 'Geblieben' })).toBeVisible({ timeout: 60_000 })
  expect(errors, `ungefangene Fehler: ${errors.join(' | ')}`).toEqual([])
})

test('bleibt heil, wenn Benachrichtigungen abgelehnt sind (P7)', async ({ page }) => {
  /*
   * Abgelehnte Rechte lassen sich von der App aus nie zurücknehmen — die
   * Erinnerungsseite muss das sagen und darf nicht daran zerbrechen.
   */
  await page.addInitScript(() => {
    // Ein Browser, der Benachrichtigungen kennt, aber verweigert.
    Object.defineProperty(Notification, 'permission', { get: () => 'denied' })
  })

  await page.goto('/')
  await expect(startButton(page)).toBeVisible()
  await page.getByText('Erinnerung', { exact: true }).click()

  await expect(page.getByText(/abgelehnt/)).toBeVisible()
  // Kein Knopf, der ein Recht erbittet, das der Browser schon verweigert hat.
  await expect(page.getByRole('button', { name: 'Benachrichtigungen erlauben' })).toHaveCount(0)
  // Und keine Uhrzeit-Einstellung, die ohnehin nicht griffe.
  await expect(page.locator('.reminder input[type="time"]')).toHaveCount(0)
})
