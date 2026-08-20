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
async function noHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const root = document.documentElement
    return root.scrollWidth - root.clientWidth
  })
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

  // Die Schublade selbst zuerst.
  await page.locator('button.hamburger').click()
  await expect(page.locator('.drawer')).toBeVisible()
  await noHorizontalOverflow(page)

  // Dann jede Seite: Dort steckt der meiste Text, und ein zu breites Wort in
  // einer Sprache oder eine lange Quelle sprengt zuerst hier. Die Liste wird
  // abgelesen, nicht behauptet — was im Menü steht, wird geprüft.
  const labels = await page.locator('.drawer-item > span').allTextContents()
  await page.keyboard.press('Escape')
  expect(labels.length).toBeGreaterThan(0)
  for (const label of labels) {
    await page.locator('button.hamburger').click()
    await page.locator('.drawer-item', { hasText: label }).click()
    await page.locator('.page').waitFor()
    await noHorizontalOverflow(page)
    await page.locator('.page-back').click()
    await page.locator('.challenge').waitFor()
  }
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

  const shown = page.locator('.encode-word, .scene, .lesson, .reveal-digits').first()
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
