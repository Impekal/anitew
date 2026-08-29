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
/*
 * Die Wiederholung, die das Gerät liefert (Rückmeldung 29.08. nachts):
 *
 *   Browserdaten gelöscht -> Seite laden -> Core antippen  => korrekt
 *   danach neu laden ODER irgendeine Aktivität (Messung, Training)
 *   -> Core antippen                                        => halb, seitlich
 *                                                              abgeschnitten,
 *                                                              NICHT scrollbar
 *
 * Der erste Sondenlauf hat deshalb nichts gefunden: Er lud **einmal** und
 * öffnete den Core. Der zweite Besuch fehlte — und genau der ist der Fall.
 *
 * „Nicht scrollbar" ist dabei der zweite Hinweis. Es passt zu der Theorie aus
 * PR #93: ein kurzzeitig zu breites Layout, dessen Scrollversatz WebKit sich
 * merkt, während `overflow-x: hidden` das Zurückscrollen danach verhindert.
 */
test('sonde: Maße der Schublade unter WebKit — erster Besuch', async ({ page }) => {
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
  console.log('WK1-VOR ' + JSON.stringify(vorherOeffnen))

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
  console.log('WK1-NACH ' + JSON.stringify(nach))
})

test('sonde: Maße der Schublade unter WebKit — nach dem Neuladen', async ({ page }) => {
  await visit(page)

  // Einmal den Core öffnen und wieder schließen, wie ein Mensch es täte.
  await page.locator('button.hamburger').click()
  await page.locator('.drawer').waitFor({ state: 'visible' })
  await page.waitForTimeout(600)
  await page.locator('.drawer-close').click()
  await page.waitForTimeout(400)

  // Und jetzt der Fall, den das Gerät meldet: neu laden.
  await page.reload()
  await page.locator('.challenge, .arrival').first().waitFor({ timeout: 30_000 })
  await page.waitForTimeout(2500)

  const vorher = await page.evaluate(() => ({
    fenster: window.innerWidth,
    dokBreite: Math.round(document.documentElement.scrollWidth),
    dokSichtbar: document.documentElement.clientWidth,
    scrollX: Math.round(window.scrollX),
    scrollLinksDok: Math.round(document.scrollingElement?.scrollLeft ?? -1),
    visualBreite: Math.round(window.visualViewport?.width ?? -1),
    visualOffsetLeft: Math.round(window.visualViewport?.offsetLeft ?? -1),
  }))
  console.log('WK2-VOR ' + JSON.stringify(vorher))

  await page.locator('button.hamburger').click()
  await page.locator('.drawer').waitFor({ state: 'visible' })
  await page.waitForTimeout(1500)

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
      }
    }
    const eintraege = Array.from(document.querySelectorAll('.drawer-item')).slice(0, 4).map((e) => {
      const r = e.getBoundingClientRect()
      return { text: (e.textContent ?? '').trim().slice(0, 16), x: Math.round(r.x), breite: Math.round(r.width) }
    })
    const zuBreit: string[] = []
    for (const el of Array.from(document.querySelectorAll('body *')) as HTMLElement[]) {
      const r = el.getBoundingClientRect()
      if (r.width > window.innerWidth + 1 || r.right > window.innerWidth + 1 || r.left < -1) {
        const name = el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : '')
        zuBreit.push(`${name} x=${Math.round(r.x)} b=${Math.round(r.width)}`)
      }
    }
    /*
     * Der eigentliche Fund: `nav.drawer` hat scrollWidth 532 bei 393 sichtbar
     * und steht auf scrollLeft 139. Wer macht die 139 Pixel Ueberbreite?
     * Gemessen wird im **Inhaltskasten der Schublade**, nicht im Fenster —
     * sonst misst man nur die Folgen des Scrollens.
     */
    const schublade = document.querySelector('nav.drawer') as HTMLElement | null
    const taeter: string[] = []
    if (schublade !== null) {
      const dr = schublade.getBoundingClientRect()
      const versatz = schublade.scrollLeft - dr.left
      for (const el of Array.from(schublade.querySelectorAll('*')) as HTMLElement[]) {
        const r = el.getBoundingClientRect()
        const rechts = Math.round(r.right + versatz)
        const links = Math.round(r.left + versatz)
        if (rechts > schublade.clientWidth + 1) {
          const st = getComputedStyle(el)
          const name =
            el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : '')
          taeter.push(
            `${name} links=${links} rechts=${rechts} b=${Math.round(r.width)} pos=${st.position} w=${st.width} minw=${st.minWidth} ws=${st.whiteSpace}`,
          )
        }
      }
    }

    return {
      fenster: window.innerWidth,
      dokBreite: Math.round(document.documentElement.scrollWidth),
      scrollX: Math.round(window.scrollX),
      scrollLinksDok: Math.round(document.scrollingElement?.scrollLeft ?? -1),
      taeter: taeter.slice(0, 14),
      anzahlTaeter: taeter.length,
      veil: kasten('.drawer-veil'),
      drawer: kasten('nav.drawer'),
      scrollKasten: kasten('.drawer-scroll'),
      close: kasten('.drawer-close'),
      gruppe: kasten('.menu-group'),
      eintraege,
      zuBreit: zuBreit.slice(0, 12),
      anzahlZuBreit: zuBreit.length,
    }
  })
  console.log('WK2-NACH ' + JSON.stringify(nach))
})
