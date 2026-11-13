import { expect, test } from '@playwright/test'

import { visit } from './helpers.ts'

/**
 * Derselbe Nachweis wie in `drawerZweiterBesuch.spec.ts` — nur unter echtem
 * WebKit, der Engine, auf der das Gerät den Fehler gemeldet hat.
 *
 * Warum es diese Datei überhaupt gibt: Alle Geräteprofile dieses Projekts
 * laufen auf Chromium, auch die, die „iphone" heißen. Zwei Behebungsversuche
 * (PR #93 und #95) sind gescheitert, weil sie auf Vermutungen beruhten statt
 * auf einer Messung unter der richtigen Engine. Diese Datei hat die Messung
 * geliefert: Schublade 393 px sichtbar, 532 px Inhalt, `scrollLeft` 139, der
 * Schließknopf bei 450 statt 161.
 *
 * Die Ursache war dann keine WebKit-Eigenheit, sondern eine Ladefolge (siehe
 * die Begründung in `anitew-living.css`), und sie ist unter Chromium genauso
 * reproduzierbar. Der eigentliche Torwächter ist deshalb der Chromium-Test,
 * der in jedem CI-Lauf mitläuft. Diese Sonde bleibt als Bestätigung unter
 * WebKit — sie läuft nur mit `ANITEW_WEBKIT=1`, weil WebKit hier nicht in
 * jedem Lauf zur Verfügung steht.
 *
 * Sie misst weiterhin laut mit: Wird sie je wieder rot, sollen die Zahlen im
 * Protokoll stehen und nicht erst nachträglich beschafft werden müssen.
 */
test('WebKit: der Core steht nach einem Neuladen an derselben Stelle wie beim ersten Mal', async ({ page }) => {
  await visit(page)
  await page.reload()
  await page.locator('.challenge').waitFor()

  await page.waitForFunction(
    () => performance.getEntriesByName('anitew:deferred-ready').length > 0,
    undefined,
    { timeout: 20_000 },
  )

  await page.locator('button.hamburger').click()
  await expect(page.locator('.drawer')).toBeVisible()
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
      erstbesuchBlattGeladen: Array.from(document.styleSheets).some((b) =>
        (b.href ?? '').includes('firstRunExperience'),
      ),
      fenster: window.innerWidth,
      dokumentBreite: Math.round(document.documentElement.scrollWidth),
      sichtbareBreite: schublade.clientWidth,
      inhaltsBreite: Math.round(schublade.scrollWidth),
      scrollLinks: Math.round(schublade.scrollLeft),
      overflowX: s.overflowX,
      knopfLinks: Math.round(kr.left),
      ausDerMitte: Math.round(
        kr.left + kr.width / 2 - (sr.left + links + (sr.width - links - rechts) / 2),
      ),
    }
  })
  console.log('WEBKIT-SCHUBLADE ' + JSON.stringify(mass))

  expect(mass.erstbesuchBlattGeladen, 'Testvoraussetzung: zweiter Besuch').toBe(false)
  expect(mass.inhaltsBreite, 'die Schublade steht nicht seitlich über').toBeLessThanOrEqual(
    mass.sichtbareBreite + 1,
  )
  expect(mass.scrollLinks, 'die Schublade ist nicht seitlich verschoben').toBe(0)
  expect(Math.abs(mass.ausDerMitte), 'der Schließknopf steht mittig').toBeLessThanOrEqual(2)
  expect(mass.dokumentBreite, 'die Seite steht nicht seitlich über').toBeLessThanOrEqual(
    mass.fenster + 1,
  )
})
