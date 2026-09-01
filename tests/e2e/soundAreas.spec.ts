import { expect, test } from '@playwright/test'

import { startButton, visit } from './helpers.ts'

/**
 * Töne nach Bereichen (Gerätewunsch 31.08.: „Töne/Songs nach individuellen
 * Bereichen aktivierbar/deaktivierbar oder alle auf einmal") und der Klang
 * während der Einheit.
 *
 * **Was dieser Test prüfen kann und was nicht.** Playwright hört nichts. Er
 * prüft deshalb die Verkabelung: ob der Dauerklang zu den richtigen Momenten
 * **läuft** — die App sagt das über ein Datenattribut, das der Ton-Port
 * setzt — und ob die Schalter wirken. Ob es angenehm klingt, entscheidet ein
 * Mensch mit Kopfhörern (`docs/DEVICES.md`), nicht diese Datei.
 */

const ambient = 'html[data-anitew-ambient="focus"]'

test('der Klang läuft in der Einheit und hört danach auf', async ({ page }) => {
  test.setTimeout(180_000)
  await visit(page)
  await expect(startButton(page)).toBeVisible()

  // Vorher ist es still: Der Startbildschirm ist kein Trainingsraum.
  await expect(page.locator(ambient)).toHaveCount(0)

  await page.getByRole('button', { name: '60 Sekunden' }).click()
  await startButton(page).click()
  await page.locator('.settle').click()

  // In der Einheit klingt es.
  await expect(page.locator(ambient)).toHaveCount(1, { timeout: 20_000 })

  // Und nach dem Abbrechen ist wieder Ruhe — kein Klang, der die Einheit
  // überlebt (das wäre die Dauerlast, die P9 abgestellt hat).
  await page.locator('.session-abort').click()
  await expect(page.locator('.challenge')).toBeVisible()
  await expect(page.locator(ambient)).toHaveCount(0)
})

test('jeder Ton-Bereich lässt sich einzeln abschalten', async ({ page }) => {
  test.setTimeout(180_000)
  await visit(page)
  // Sprache und Ton stehen am Fuss des Startbildschirms — dieselbe
  // Komponente wie auf der Core-Seite, nur ohne Umweg.
  await expect(startButton(page)).toBeVisible()

  const focusSwitch = page.locator('.sound-area-focus')
  await expect(focusSwitch).toBeVisible()
  await expect(focusSwitch).toHaveAttribute('aria-pressed', 'true')

  // Die drei Bereiche sind da — und die ehrliche Zeile dazu.
  await expect(page.locator('.sound-area')).toHaveCount(3)
  await expect(page.getByText(/Gemessen haben wir das nicht/)).toBeVisible()

  // „Klang während der Einheit" aus …
  await focusSwitch.click()
  await expect(focusSwitch).toHaveAttribute('aria-pressed', 'false')

  // … und die Wahl überlebt das Neuladen.
  await page.reload()
  await expect(startButton(page)).toBeVisible()
  await expect(page.locator('.sound-area-focus')).toHaveAttribute('aria-pressed', 'false')
  await expect(page.locator('.sound-area-feedback')).toHaveAttribute('aria-pressed', 'true')
})

test('abgeschaltet bleibt der Klang auch in der Einheit still', async ({ page }) => {
  test.setTimeout(180_000)
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await page.locator('.sound-area-focus').click()
  await expect(page.locator('.sound-area-focus')).toHaveAttribute('aria-pressed', 'false')

  await page.getByRole('button', { name: '60 Sekunden' }).click()
  await startButton(page).click()
  await page.locator('.settle').click()
  await page.locator('.session-clock').waitFor({ timeout: 20_000 })

  // Der Schalter wirkt: Trotz laufender Einheit bleibt es still.
  await expect(page.locator(ambient)).toHaveCount(0)
})

/**
 * Wartet, bis die Überblendungen fertig sind.
 *
 * `.quiet` blendet den Hintergrund weich ein. Wer sofort nach dem Tippen
 * misst, liest einen Zwischenwert — beim Schreiben dieser Prüfung kamen so
 * drei verschiedene Deckkräfte für dieselbe Fläche heraus. Gewartet wird auf
 * die Übergänge (`CSSTransition`), nicht auf alle Animationen: Die
 * Dauerbewegungen der Oberfläche werden nie fertig.
 */
async function beruhigt(page: import('@playwright/test').Page): Promise<void> {
  await page.evaluate(async () => {
    await Promise.all(
      document
        .getAnimations()
        .filter((animation) => animation.constructor.name === 'CSSTransition')
        .map((animation) => animation.finished.catch(() => undefined)),
    )
  })
}

/**
 * „Das ist entweder oder. Man kann nicht mehrere aktivieren."
 * (Gerätemeldung 01.09., mit zwei Bildern.)
 *
 * Die Prüfung darüber zeigt: Es **ist** kein Entweder-oder. Die drei Bereiche
 * schalten unabhängig, und die Wahl überlebt das Neuladen. Falsch war, was
 * der Bildschirm sagt.
 *
 * `.quiet:hover` füllt die Zeile mit der Akzentfarbe. Auf einem Telefon
 * bleibt `:hover` an dem Element kleben, das man zuletzt berührt hat — also
 * sieht immer die zuletzt angetippte Zeile „ausgewählt" aus, egal ob sie an
 * oder aus ist. Der wirkliche Zustand hing dagegen an einem ♪ gegen einen
 * Punkt und an einer etwas weicheren Schrift. Das Auge glaubt der Fläche,
 * nicht dem Zeichen.
 */
test('der zuletzt angetippte Bereich sieht nicht aus wie der eingeschaltete', async ({ page }) => {
  test.setTimeout(120_000)
  await visit(page)
  await expect(startButton(page)).toBeVisible()

  const aus = page.locator('.sound-area-feedback')
  const an = page.locator('.sound-area-arrival')

  // „Rückmeldung" abschalten — und danach bleibt der Finger auf dieser Zeile.
  await aus.click()
  await expect(aus).toHaveAttribute('aria-pressed', 'false')
  await expect(an).toHaveAttribute('aria-pressed', 'true')

  /*
   * Gemessen wird die Farbe selbst, nicht eine daraus gerechnete Zahl.
   *
   * Der erste Anlauf las die Deckkraft mit einem Zahlenmuster aus dem
   * Farbwert — und lag falsch, sobald der Browser `oklab(…)` zurückgibt:
   * Aus „oklab(0.86 -0.09 0.006 / 0.62)" wurde eine Deckkraft von 1. Die
   * Aussage braucht die Zahl gar nicht: Abgeschaltet heißt **keine** Fläche.
   */
  const durchsichtig = (farbe: string): boolean =>
    farbe === 'transparent' || farbe === 'rgba(0, 0, 0, 0)' || /\/\s*0\s*\)/u.test(farbe)

  await beruhigt(page)
  const abgeschaltet = await aus.evaluate((element) => getComputedStyle(element).backgroundColor)

  expect(durchsichtig(abgeschaltet), `abgeschaltet, aber gefüllt: ${abgeschaltet}`).toBe(true)
})

test('mehrere Bereiche sind gleichzeitig an — und sehen auch so aus', async ({ page }) => {
  test.setTimeout(120_000)
  await visit(page)
  await expect(startButton(page)).toBeVisible()

  const flaechen = ['feedback', 'arrival', 'focus'].map((name) => page.locator(`.sound-area-${name}`))

  // Alle drei aus …
  for (const flaeche of flaechen) {
    await flaeche.click()
    await expect(flaeche).toHaveAttribute('aria-pressed', 'false')
  }
  // … und alle drei wieder an. Wäre es ein Entweder-oder, ginge das nicht.
  for (const flaeche of flaechen) {
    await flaeche.click()
    await expect(flaeche).toHaveAttribute('aria-pressed', 'true')
  }

  // Und alle drei tragen dieselbe eingeschaltete Fläche — auch die, die
  // gerade nicht berührt wurde. Sonst entschiede wieder der letzte Finger
  // darüber, was „ausgewählt" aussieht.
  await beruhigt(page)
  const farben: string[] = []
  for (const flaeche of flaechen) {
    farben.push(await flaeche.evaluate((element) => getComputedStyle(element).backgroundColor))
  }

  expect(new Set(farben).size, `drei Flächen: ${farben.join(' | ')}`).toBe(1)
  expect(
    farben[0] === 'transparent' || farben[0] === 'rgba(0, 0, 0, 0)',
    `eingeschaltet trägt keine Fläche: ${farben[0]}`,
  ).toBe(false)
})
