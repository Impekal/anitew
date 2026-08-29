import { expect, test } from '@playwright/test'

import { visit } from './helpers.ts'

/**
 * Der Core beim **zweiten** Besuch — der Zustand, in dem der Fehler steckte.
 *
 * Gemeldet vom Gerät (29.08.): Browserdaten löschen, Seite laden, Core
 * antippen → richtig. Danach neu laden oder irgendetwas tun, Core antippen →
 * halb angezeigt, seitlich abgeschnitten, **nicht** scrollbar.
 *
 * Zwei Behebungsversuche (PR #93, #95) sind an einer Vermutung gescheitert.
 * Die Messung ergab dann etwas, das keine Engine-Eigenheit ist, sondern eine
 * Ladefolge: `anitew-first-run.css` wird nur beim allerersten Besuch geladen
 * (`firstRunExperience.ts` hängt an `.arrival-begin` / `.onboarding`). Genau
 * dieses Blatt hat den Schließknopf zentriert. Ohne es blieben zwei Regeln
 * unwidersprochen stehen — `align-self: flex-end` aus `styles.css` und
 * `left: 50%` aus `anitew-living.css` — und schoben ihn nach rechts aus der
 * Schublade heraus. Der Überstand machte die Schublade zum Scrollbehälter,
 * der Versatz blieb hängen, `overflow-x: hidden` verhinderte das Zurück.
 *
 * Deshalb prüft dieser Test ausdrücklich **nach einem Neuladen**. Und er
 * prüft zuerst, dass er wirklich im zweiten Besuch steht: Wäre das Erstbesuch-
 * Blatt doch geladen, würde er den falschen Zustand messen und wäre still
 * wertlos.
 */
test('der Core steht nach einem Neuladen an derselben Stelle wie beim ersten Mal', async ({ page }) => {
  await visit(page)
  await page.reload()
  await page.locator('.challenge').waitFor()

  // Erst wenn die nachgelagerten Blätter durch sind, steht die Kaskade fest.
  await page.waitForFunction(
    () => performance.getEntriesByName('anitew:deferred-ready').length > 0,
    undefined,
    { timeout: 20_000 },
  )

  await page.locator('button.hamburger').click()
  await expect(page.locator('.drawer')).toBeVisible()
  // Der Core lädt beim Öffnen noch eigene Blätter nach (coreRitual). Vor der
  // Messung muss auch die letzte davon angewandt sein.
  await expect(page.locator('.drawer-close')).toBeVisible()
  await page.waitForFunction(
    () => document.querySelector('.drawer-close')?.clientWidth === 72,
    undefined,
    { timeout: 10_000 },
  )

  const mass = await page.evaluate(() => {
    const schublade = document.querySelector('nav.drawer') as HTMLElement
    const knopf = document.querySelector('.drawer-close') as HTMLElement
    const s = getComputedStyle(schublade)
    const links = parseFloat(s.paddingLeft)
    const rechts = parseFloat(s.paddingRight)
    const sr = schublade.getBoundingClientRect()
    const kr = knopf.getBoundingClientRect()
    return {
      // Steht ein Erstbesuch-Blatt im Dokument, misst dieser Test den
      // falschen Zustand. Dann ist der Test kaputt, nicht die App.
      erstbesuchBlattGeladen: Array.from(document.styleSheets).some((b) =>
        (b.href ?? '').includes('firstRunExperience'),
      ),
      sichtbareBreite: schublade.clientWidth,
      inhaltsBreite: Math.round(schublade.scrollWidth),
      scrollLinks: Math.round(schublade.scrollLeft),
      // Abstand der Knopfmitte von der Mitte des Inhaltsbereichs.
      ausDerMitte: Math.round(
        kr.left + kr.width / 2 - (sr.left + links + (sr.width - links - rechts) / 2),
      ),
    }
  })

  expect(mass.erstbesuchBlattGeladen, 'Testvoraussetzung: zweiter Besuch').toBe(false)
  expect(mass.inhaltsBreite, 'die Schublade steht nicht seitlich über').toBeLessThanOrEqual(
    mass.sichtbareBreite + 1,
  )
  expect(mass.scrollLinks, 'die Schublade ist nicht seitlich verschoben').toBe(0)
  expect(Math.abs(mass.ausDerMitte), 'der Schließknopf steht mittig').toBeLessThanOrEqual(2)
})
