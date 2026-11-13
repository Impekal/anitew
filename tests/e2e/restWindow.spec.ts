import { expect, test, type Page } from '@playwright/test'

import { visit } from './helpers.ts'

/**
 * Akku und Wärme (Gerätemeldung 31.08.: „Das macht das Handy heiß und
 * verbraucht extrem viel Akku.")
 *
 * Gemessen am gebauten Stand (Software-Rendering macht Renderarbeit als CPU
 * sichtbar): Der Welcome-Screen hielt einen ganzen Kern auf Dauerlast, und
 * **eine einzige** Endlos-Animation genügt, damit die Render-Pipeline nie
 * schläft — 134 % eines Kerns mit Deko, 6 % mit wirklich pausierter Deko.
 * Der unsichtbare Splash allein stand für 69 %: `anitew-launch-away` endet
 * auf `visibility: hidden`, aber das Element blieb samt 18 Endlos-Animationen
 * für die ganze Sitzung im Dokument.
 *
 * Deshalb prüft diese Datei **Zustände, nicht Stylesheets**: Was läuft
 * wirklich (`document.getAnimations()`), nachdem der Splash gegangen ist und
 * nachdem niemand mehr etwas tut?
 */

/** Endlos-Animationen, die gerade wirklich laufen (Übergänge sind endlich). */
async function runningForever(page: Page): Promise<number> {
  return page.evaluate(
    () =>
      document.getAnimations().filter((animation) => {
        if (animation.playState !== 'running') return false
        return animation.effect?.getTiming().iterations === Infinity
      }).length,
  )
}

test('der Splash verlässt nach dem Wegblenden das Dokument', async ({ page }) => {
  await page.goto('/')

  // Er war da — sonst prüfte der Test ein Phantom.
  await expect(page.locator('#anitew-launch')).toHaveCount(1)

  /*
   * Drei Sekunden Choreografie (automatisierte Browser zahlen die fünf
   * Erstöffnungs-Sekunden nicht), dann muss das Element **weg** sein — nicht
   * durchsichtig, nicht `visibility: hidden`: Ein verstecktes Element mit
   * Endlos-Animationen kostet jede Sekunde weiter.
   */
  await expect(page.locator('#anitew-launch')).toHaveCount(0, { timeout: 10_000 })

  /*
   * Zweites Öffnen in derselben Sitzung: Der Splash wird per `skip` gar nicht
   * erst gezeigt (`display: none`) — dann hat er im Dokument ebenso nichts
   * verloren.
   */
  await page.goto('/')
  await page.locator('.arrival, .challenge').first().waitFor()
  await expect(page.locator('#anitew-launch')).toHaveCount(0, { timeout: 5_000 })
})

test('nach kurzer Ruhe schläft die Deko — die nächste Berührung weckt sie', async ({ page }) => {
  /*
   * `restAfter` ist ausschließlich E2E-Vertrag (wie `firstLaunch`): Er kürzt
   * nur die Wartezeit, die Mechanik ist dieselbe wie im echten Fenster.
   */
  await page.goto('/?restAfter=1500')
  await page.locator('.arrival, .challenge').first().waitFor()
  if ((await page.locator('.arrival').count()) > 0) {
    await page.locator('.arrival .quiet').click()
    await page.locator('.challenge').waitFor()
  }
  const guide = page.locator('.first-run-guide-skip')
  if (await guide.isVisible({ timeout: 3_000 }).catch(() => false)) {
    await guide.click()
  }
  await page.locator('button.start').waitFor()

  // Die Welt lebt, solange bedient wird.
  expect(await runningForever(page)).toBeGreaterThan(0)

  // Niemand tut etwas: Nach dem Ruhefenster darf nichts Endloses mehr laufen.
  await expect.poll(() => runningForever(page), { timeout: 10_000 }).toBe(0)

  // Eine Bewegung — und die Welt atmet weiter.
  await page.mouse.move(180, 320)
  await expect.poll(() => runningForever(page), { timeout: 5_000 }).toBeGreaterThan(0)

  // Und sie schläft danach wieder ein, ohne dass jemand nachhilft.
  await expect.poll(() => runningForever(page), { timeout: 10_000 }).toBe(0)
})

test('ohne Sondervertrag gilt das echte Ruhefenster', async ({ page }) => {
  // Absichtlich langsam: Der Test sitzt das echte 20-Sekunden-Fenster ab.
  test.setTimeout(90_000)
  await visit(page)
  await page.locator('button.start').waitFor()

  /*
   * Das echte Fenster, echt abgesessen: kein Verkürzungs-Parameter. Der Test
   * kostet die vollen Sekunden — er ist der Beweis, dass die Voreinstellung
   * wirklich schlafen legt und nicht nur der Testmodus.
   */
  expect(await runningForever(page)).toBeGreaterThan(0)
  await expect.poll(() => runningForever(page), { timeout: 40_000 }).toBe(0)
})
