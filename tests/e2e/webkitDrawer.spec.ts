import { test } from '@playwright/test'

import { visit } from './helpers.ts'

/**
 * WebKit-Sonde: Warum steht der Core auf dem iPhone seitlich verschoben?
 *
 * Gemeldet vom Gerät (29.08.): Beim Antippen von Core ist die Schublade
 * seitlich verschoben — linke Spalte abgeschnitten, „Menü schließen" halb aus
 * dem Bild nach rechts. Aus dem Bildschirmfoto ausgemessen: Das Raster steht
 * rund 146 Pixel zu weit **links**, der Schließ-Knopf rund 150 Pixel zu weit
 * **rechts**. Sie bewegen sich also in **entgegengesetzte** Richtungen — das
 * kann keine bloße Breitenangabe erklären, da ist zusätzlich etwas gescrollt.
 *
 * Zwei Behebungsversuche sind gescheitert (PR #93 und #95), beide auf einer
 * Vermutung gebaut. Der Grund für das Raten: **Es wurde nie unter WebKit
 * gemessen.** Alle Geräteprofile dieses Projekts laufen auf Chromium, auch
 * die, die „iphone" heißen.
 *
 * Diese Datei prüft deshalb nichts — sie schreibt auf, was sie sieht. Erst
 * wenn die Zahlen da sind, gibt es etwas zu beheben. Sie läuft nur mit
 * `ANITEW_WEBKIT=1` und nur im Projekt `webkit-iphone`.
 */
test('sonde: Maße der Schublade unter WebKit', async ({ page }) => {
  await visit(page)

  const vorherOeffnen = await page.evaluate(() => ({
    fenster: window.innerWidth,
    dokBreite: Math.round(document.documentElement.scrollWidth),
    dokSichtbar: document.documentElement.clientWidth,
    scrollX: Math.round(window.scrollX),
    visualBreite: Math.round(window.visualViewport?.width ?? -1),
    visualOffsetLeft: Math.round(window.visualViewport?.offsetLeft ?? -1),
    visualScale: window.visualViewport?.scale ?? -1,
  }))
  console.log('WK-VOR ' + JSON.stringify(vorherOeffnen))

  await page.locator('button.hamburger').click()
  await page.locator('.drawer').waitFor({ state: 'visible' })
  await page.waitForTimeout(1200)

  const nach = await page.evaluate(() => {
    const kasten = (auswahl: string) => {
      const el = document.querySelector(auswahl) as HTMLElement | null
      if (el === null) return null
      const r = el.getBoundingClientRect()
      const s = getComputedStyle(el)
      return {
        x: Math.round(r.x),
        breite: Math.round(r.width),
        scrollLinks: Math.round(el.scrollLeft),
        scrollBreite: Math.round(el.scrollWidth),
        sichtbareBreite: Math.round(el.clientWidth),
        position: s.position,
        overflowX: s.overflowX,
        cssBreite: s.width,
        cssMaxBreite: s.maxWidth,
        transform: s.transform === 'none' ? 'none' : 'gesetzt',
      }
    }
    const eintraege = Array.from(document.querySelectorAll('.drawer-item')).slice(0, 4).map((e) => {
      const r = e.getBoundingClientRect()
      return { text: (e.textContent ?? '').trim().slice(0, 16), x: Math.round(r.x), breite: Math.round(r.width) }
    })
    /* Welcher Vorfahre ist breiter als das Fenster? Das ist die eigentliche Frage. */
    const zuBreit: string[] = []
    for (const el of Array.from(document.querySelectorAll('body *')) as HTMLElement[]) {
      const r = el.getBoundingClientRect()
      if (r.width > window.innerWidth + 1 || r.right > window.innerWidth + 1 || r.left < -1) {
        const name = el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : '')
        zuBreit.push(`${name} x=${Math.round(r.x)} b=${Math.round(r.width)}`)
      }
    }
    return {
      fenster: window.innerWidth,
      dokBreite: Math.round(document.documentElement.scrollWidth),
      dokSichtbar: document.documentElement.clientWidth,
      scrollX: Math.round(window.scrollX),
      scrollLinksDok: Math.round(document.scrollingElement?.scrollLeft ?? -1),
      visualBreite: Math.round(window.visualViewport?.width ?? -1),
      visualOffsetLeft: Math.round(window.visualViewport?.offsetLeft ?? -1),
      veil: kasten('.drawer-veil'),
      drawer: kasten('nav.drawer'),
      scrollKasten: kasten('.drawer-scroll'),
      close: kasten('.drawer-close'),
      label: kasten('.drawer-close-label'),
      gruppe: kasten('.menu-group'),
      eintraege,
      zuBreit: zuBreit.slice(0, 12),
      anzahlZuBreit: zuBreit.length,
    }
  })
  console.log('WK-NACH ' + JSON.stringify(nach))
})
