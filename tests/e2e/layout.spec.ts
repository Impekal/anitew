import { expect, test, type Locator, type Page } from '@playwright/test'

import { startButton, visit } from './helpers.ts'

/**
 * Auf jedem Gerät fehlerfrei (Backlog P6).
 *
 * Dieser Test läuft über die **ganze Gerätematrix** aus `playwright.config.ts`
 * — kleines und randloses iPhone, iPad hoch und quer, Android-Tablet,
 * Schreibtisch schmal und breit — und prüft überall dieselben wenigen
 * Wahrheiten, auf die es beim Layout wirklich ankommt.
 *
 * Was er **nicht** prüft: die Safari-Engine. Alle Profile laufen hier auf
 * Chromium (mehr ist nicht installiert). Größe, Ausrichtung und sichere
 * Ränder fängt das; ob ein `input[type=time]` auf einem echten iPhone genauso
 * aussieht, fängt nur ein echtes iPhone (`docs/DEVICES.md`).
 *
 * Absichtlich **ohne Wartezeiten**: keine 60-Sekunden-Einheit, kein Abruf über
 * echte Sekunden. Der Test soll über sieben Geräte schnell durchlaufen, sonst
 * läuft er nie.
 */

/**
 * Der klassische Layoutfehler: Etwas ragt seitlich hinaus, und die ganze
 * Seite lässt sich hin- und herschieben. Ein Pixel Toleranz gegen Rundung.
 */
async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(() => {
    const root = document.documentElement
    return root.scrollWidth - root.clientWidth
  })
}

async function noHorizontalOverflow(page: Page) {
  const overflow = await horizontalOverflow(page)
  expect(overflow, 'die Seite lässt sich seitlich schieben').toBeLessThanOrEqual(1)
}

/** Sitzt das Element ganz im sichtbaren Bereich — nicht halb abgeschnitten? */
async function withinViewport(page: Page, locator: Locator, name: string) {
  const box = await locator.boundingBox()
  const size = page.viewportSize()
  expect(box, `${name} ist nicht da`).not.toBeNull()
  if (box === null || size === null) return
  expect(box.x, `${name} ragt links hinaus`).toBeGreaterThanOrEqual(-1)
  expect(box.x + box.width, `${name} ragt rechts hinaus`).toBeLessThanOrEqual(size.width + 1)
  expect(box.width, `${name} hat keine Breite`).toBeGreaterThan(0)
}

test('der Startbildschirm passt, ohne seitlich zu schieben', async ({ page }) => {
  await visit(page)
  await expect(startButton(page)).toBeVisible()

  await noHorizontalOverflow(page)
  await withinViewport(page, startButton(page), 'der Startknopf')

  // Die vier Zeitknöpfe stehen alle da und keiner ragt hinaus. Der Kommentar
  // in de.ts warnt genau davor: „15 Minuten“ bricht auf einem schmalen Telefon
  // um, und vier umbrechende Knöpfe sind vier Unruheherde.
  const modes = page.locator('.mode')
  await expect(modes).toHaveCount(4)
  for (let index = 0; index < 4; index++) {
    await withinViewport(page, modes.nth(index), `Zeitknopf ${index + 1}`)
  }
})

test('hält die Breite auf jeder Menüseite — und in der Schublade', async ({ page }) => {
  await visit(page)
  await expect(startButton(page)).toBeVisible()

  const hamburger = page.locator('button.hamburger')
  const drawer = page.locator('.drawer')

  // Die Schublade selbst zuerst.
  await hamburger.click()
  await expect(drawer).toBeVisible()
  await noHorizontalOverflow(page)

  // Nur die sichtbare Beschriftung jedes Knotens lesen. MenuIcon bringt ein
  // eigenes direktes <span> mit; der frühere Selektor sammelte deshalb auch
  // leere Icon-Spans und `hasText: ''` traf anschließend jeden Menüknopf.
  const labels = (await page.locator('.drawer-item > span:last-child').allTextContents())
    .map((label) => label.trim())
    .filter((label) => label !== '')
  expect(labels.length).toBeGreaterThan(0)

  /*
   * Hier wird Geometrie geprüft, nicht die Zurück-Navigation — deren Browser-
   * und Seitenknopf-Verhalten hat `coreNavigation.spec.ts` als eigenen Gate.
   *
   * Der Drawer darf beim Öffnen/Zurückkehren animieren. Auf sehr breiten CI-
   * Viewports kann Playwright einen normalen `.click()` deshalb minutenlang
   * auf „stable“ warten, obwohl die Seite bereits korrekt im Viewport liegt.
   * Für diesen Layout-Test löst `force` denselben echten Click-Handler aus,
   * ohne die Animationsstabilität zu einer zweiten, fachfremden Assertion zu
   * machen. Falls Core nach einer Unterseite bereits geschlossen ist, öffnen
   * wir es für die nächste Breitenmessung ausdrücklich wieder.
   */
  for (const label of labels) {
    if (!(await drawer.isVisible())) {
      await hamburger.click({ force: true })
      await expect(drawer).toBeVisible()
      await noHorizontalOverflow(page)
    }

    const item = page.getByRole('button', { name: label, exact: true })
    await expect(item).toBeVisible()
    await item.click({ force: true })
    await page.locator('.page').waitFor()
    await noHorizontalOverflow(page)

    await page.locator('.page-back').click({ force: true })
    await expect(page.locator('.page')).toBeHidden()

    if (!(await drawer.isVisible())) {
      await hamburger.click({ force: true })
    }
    await expect(drawer).toBeVisible()
    await noHorizontalOverflow(page)
  }

  // Dieser Gate endet bewusst im offenen Drawer: Schließen per Escape ist
  // Interaktionsverhalten und wird separat geprüft. Hier zählt nur, dass auch
  // der letzte gemessene Drawer-Zustand ohne horizontalen Overflow bleibt.
  await expect(drawer).toBeVisible()
  await noHorizontalOverflow(page)
})

test('das Kennenlernen passt auf jedes Gerät', async ({ page }) => {
  // Absichtlich ohne `visit`: Hier soll genau der allererste Bildschirm
  // stehen, den `visit` sonst übergeht.
  await page.goto('/')
  await expect(page.locator('.arrival')).toBeVisible()
  await noHorizontalOverflow(page)
  await withinViewport(page, startButton(page), 'der Los-geht’s-Knopf')

  // Und die erste echte Erinnerung ragt ebenfalls nirgends hinaus.
  await startButton(page).click()
  await expect(page.locator('.arrival-memory')).toBeVisible()
  await withinViewport(page, page.locator('.remember-input'), 'erste Erinnerung')
  await noHorizontalOverflow(page)
})

test('bleibt beim Einprägen im Rahmen', async ({ page }) => {
  await visit(page)
  await expect(startButton(page)).toBeVisible()

  // Kürzester Weg zu einem Einprägeblock, ohne echte Sekunden abzuwarten.
  await page.getByRole('button', { name: '60 Sekunden' }).click()
  await startButton(page).click()
  await page.locator('.settle').click()

  // Alle Einprägeformen haben entweder den gemeinsamen .encode-Wurzelknoten,
  // eine Szene, eine Lektion oder die spezielle Ziffernanzeige. Nicht auf
  // einzelne heutige Unterelemente wie .encode-word festlegen.
  const shown = page.locator('.encode, .scene, .lesson, .reveal-digits').first()
  await expect(shown).toBeVisible({ timeout: 30_000 })
  await noHorizontalOverflow(page)
  await withinViewport(page, shown, 'der Einprägeteil')

  // Der Abbruchknopf muss erreichbar bleiben — sonst säße man auf dem Telefon
  // in einer Einheit fest.
  await withinViewport(page, page.locator('.session-abort'), 'der Abbruch')
})

test('zentriert den Inhalt auf breiten Schirmen, statt ihn zu strecken', async ({ page }) => {
  await visit(page)
  await expect(startButton(page)).toBeVisible()

  const size = page.viewportSize()
  test.skip(size === null || size.width < 1200, 'nur auf dem Schreibtisch')

  /*
   * Auf 1920 px darf die Spalte nicht über die ganze Breite laufen — Text,
   * der quer über einen 27-Zoll-Schirm läuft, liest niemand. Die App hat
   * `max-width: 34rem` und `margin: auto`; hier wird geprüft, dass das auch
   * ankommt.
   */
  const app = page.locator('.app')
  const box = await app.boundingBox()
  expect(box).not.toBeNull()
  if (box === null || size === null) return
  expect(box.width, 'die Spalte läuft zu breit').toBeLessThan(720)
  // Und sie steht mittig: links und rechts etwa gleich viel Luft.
  const rightGap = size.width - (box.x + box.width)
  expect(Math.abs(box.x - rightGap), 'die Spalte steht nicht mittig').toBeLessThan(4)
})

test('Fließtext bekommt echte Zeilenbreite — kein senkrechtes Wort-für-Wort', async ({ page }) => {
  /*
   * Der Memory Pulse lief auf einem echten iPhone senkrecht: ein Wort je
   * Zeile in einer 40 px schmalen Spalte. Ursache war ein zweispaltiges
   * Raster aus einem Stylesheet, dessen Marke ein späteres Stylesheet
   * absolut positionierte — der Text rutschte in die leere erste Spalte.
   *
   * Kein Test hat das gesehen: Schmaler Text erzeugt keinen horizontalen
   * Überlauf, und Sichtbarkeit war gegeben. Diese Prüfung schließt die
   * Lücke — und zwar allgemein: **Jeder** Fließtextblock muss den Platz
   * bekommen, den sein Kasten hergibt.
   */
  await visit(page)
  await expect(startButton(page)).toBeVisible()

  const squeezed = await page.evaluate(() => {
    const problems: string[] = []
    const blocks = document.querySelectorAll<HTMLElement>(
      '.memory-pulse-line, .today-line, .greeting, .focus, .note p',
    )
    for (const block of blocks) {
      const box = block.getBoundingClientRect()
      if (box.width === 0 || box.height === 0) continue
      const text = (block.textContent ?? '').trim()
      // Erst ab einem echten Satz ist die Frage sinnvoll.
      if (text.length < 25) continue
      /*
       * Die Signatur des Fehlers, gerätunabhängig: Ein Satz steht in einer
       * Spalte, die **schmaler als jede lesbare Zeile** ist, und läuft
       * deshalb nach unten statt nach rechts. Der Memory Pulse maß
       * 40 × 252 px — Wort für Wort untereinander.
       *
       * Der erste Anlauf verglich zusätzlich mit der Elternbreite („nutzt
       * mindestens 60 %"). Das war zu grob und meldete auf breiten Schirmen
       * gesunde Zeilen: Eine Tageszeile, die ihre Inhaltsbreite nimmt, ist
       * 299 von 544 px breit und völlig in Ordnung. Ein Fehlalarm, der zum
       * Ignorieren erzieht, ist schlimmer als kein Test — deshalb prüft die
       * Regel jetzt genau das, was den Fehler ausmacht, und nichts sonst.
       */
      if (box.width < 160 && box.height > box.width) {
        problems.push(`${block.className}: ${Math.round(box.width)}×${Math.round(box.height)} px (senkrecht)`)
      }
    }
    return problems
  })

  expect(squeezed, 'eingeklemmter Fließtext').toEqual([])
})

test('kein Seitwärts-Schieben, wenn man sich Zeit lässt', async ({ page }) => {
  /*
   * Diese Lücke war der Grund für den Fund im Gesamt-Audit.
   *
   * `visit()` ist auf Tempo gebaut: Es klickt den Ankunftsbildschirm weg,
   * sobald er da ist, und überspringt die Einführung. Genau dieser Weg ist
   * der einzige, auf dem die Seite **nicht** seitlich schiebt. Gemessen auf
   * einem iPhone 14 Pro, jeweils nach demselben Startbildschirm:
   *
   * - sofort weiterklicken (der bisherige Gate-Weg): 2 px
   * - vier Sekunden auf dem Ankunftsbildschirm bleiben: **30 px**
   * - die Einführung durchklicken statt überspringen: **25 px**
   *
   * Der Grund ist keine Animation, sondern der Aufbau: Die lebende Schicht
   * setzt ihre Zierverläufe erst, wenn der Startbildschirm fertig steht
   * (`.today::before`, `.challenge::before` mit `inset: 8% -10% 24%`). Die
   * treten absichtlich über ihre Box hinaus — nur darf daraus keine
   * schiebbare Seite werden.
   *
   * Der Test nimmt sich deshalb bewusst die Zeit, die ein Mensch sich nimmt.
   */
  await page.goto('/')
  await page.locator('.arrival, .challenge').first().waitFor()

  if ((await page.locator('.arrival').count()) > 0) {
    // So lange, wie jemand braucht, um den Ankunftsbildschirm zu lesen.
    await page.waitForTimeout(3_000)
    await page.locator('.arrival .quiet').click()
    await page.locator('.challenge').waitFor()
  }

  const skip = page.locator('.first-run-guide-skip')
  if ((await skip.count()) > 0) {
    await skip.click()
    await expect(page.locator('.first-run-guide')).toBeHidden()
  }

  /*
   * Nicht einmal messen, sondern über das Ankommen hinweg — und den
   * schlimmsten Moment nehmen. Die lebende Schicht setzt ihre Verläufe in
   * Stufen; ein einzelner Blick trifft leicht die Lücke dazwischen und meldet
   * grün, während die Seite eine halbe Sekunde später schiebt.
   */
  let worst = 0
  for (let step = 0; step < 8; step++) {
    await page.waitForTimeout(500)
    worst = Math.max(worst, await horizontalOverflow(page))
    // Ganz nach unten: Die Zierverläufe von `.today` und `.challenge` liegen
    // im unteren Teil des Startbildschirms.
    await page.mouse.wheel(0, 600)
  }

  expect(worst, 'die Seite lässt sich seitlich schieben').toBeLessThanOrEqual(1)
})

test('der Schließen-Knopf lässt beim Scrollen nichts durch sich hindurchlaufen', async ({
  page,
}) => {
  /*
   * Gemeldet vom Gerät: „«Dein Stand» bleibt genau auf «Menü schließen»."
   *
   * Der Knopf klebt oben (`position: sticky`), sein Grund war aber praktisch
   * durchsichtig — ein Radialverlauf plus `rgb(140 207 192 / 3%)`. Alles, was
   * daran vorbeiscrollte, lief **durch** das ✕. Nachgemessen auf einem
   * iPhone 14 Pro: bei Scrollstand 120 px stand „Dein Stand" mitten im Knopf.
   *
   * Geprüft wird der deckende Streifen dahinter, und zwar über seine Farbe.
   * Das ist kein Umweg, sondern genau die Stelle, an der die erste Korrektur
   * scheiterte: `background: <farbe>, <farbe>` ist ungültige Schichtsyntax,
   * der Browser verwirft die ganze Deklaration still, und übrig bleibt
   * `rgba(0, 0, 0, 0)` — ein Streifen, der nichts deckt und den man auf einem
   * Screenshot leicht übersieht.
   */
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await page.locator('button.hamburger').click()
  await expect(page.locator('.drawer')).toBeVisible()

  const backdrop = await page.locator('.drawer-close').evaluate((element) => {
    const style = getComputedStyle(element, '::after')
    return { color: style.backgroundColor, width: style.width, content: style.content }
  })

  expect(backdrop.content, 'der Streifen hinter dem Knopf fehlt ganz').not.toBe('none')

  const opaque = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(backdrop.color)
  expect(opaque, `der Streifen deckt nicht: ${backdrop.color}`).toBe(true)

  // Über die volle Breite, nicht nur über den Knopf: Sonst verschwände der
  // Text zwar hinter der Scheibe, liefe aber links und rechts daran vorbei.
  const drawerWidth = await page.locator('.drawer').evaluate((element) => element.clientWidth)
  expect(Number.parseFloat(backdrop.width)).toBeGreaterThanOrEqual(drawerWidth)
})
