import { expect, test } from '@playwright/test'

import { openPage, visit } from './helpers.ts'

/**
 * Tap-Ziele halten 44 Pixel (Audit 29.08., B-03).
 *
 * Apples Richtwert ist 44 × 44. WCAG 2.2 AA verlangt nur 24 × 24 — das war
 * hier immer erfüllt und ist trotzdem nicht die Latte, an der sich ein Daumen
 * misst. Gemessen wurden vor der Behebung siebzehn Elemente darunter, unter
 * anderem der Ton-Schalter (63 × 30), „Schlüssel-Seite öffnen" (163 × 34), die
 * beiden Sprachauswahlen (102 × 34, 115 × 34) und sechs Palast-Eingabefelder
 * (341 × 39).
 *
 * Gemessen wird die **Trefferfläche**, nicht das Aussehen: Wo ein `::after`
 * mit negativen Rändern über das Element hinausragt, zählt diese größere
 * Fläche. So darf ein Ton-Schalter klein aussehen, ohne klein zu sein.
 */
const SEITEN = ['Coach', 'Einstellungen', 'Der Gedächtnispalast', 'Über dich'] as const

test.use({ viewport: { width: 393, height: 852 } })

async function zuKlein(page: import('@playwright/test').Page) {
  return await page.evaluate(() => {
    const sichtbar = (e: Element) => {
      const s = getComputedStyle(e)
      const r = e.getBoundingClientRect()
      return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0 && r.height > 0
    }
    return Array.from(document.querySelectorAll('button, a[href], select, input, textarea, [role=button]'))
      .filter(sichtbar)
      .map((e) => {
        const r = e.getBoundingClientRect()
        let breite = r.width
        let hoehe = r.height
        // Eine ausgelagerte Trefferfläche zählt mit — aber nur, wenn sie
        // hinausragt. Dekorative `::after` innerhalb des Elements dürfen die
        // Fläche nicht kleinrechnen.
        const nach = getComputedStyle(e, '::after')
        if (nach.content !== 'none' && nach.position === 'absolute') {
          const zahl = (w: string) => (Number.isFinite(parseFloat(w)) ? parseFloat(w) : 0)
          const oben = Math.min(0, zahl(nach.top))
          const unten = Math.min(0, zahl(nach.bottom))
          const links = Math.min(0, zahl(nach.left))
          const rechts = Math.min(0, zahl(nach.right))
          hoehe = r.height - oben - unten
          breite = r.width - links - rechts
        }
        return {
          was: (e.textContent ?? '').trim().slice(0, 30) || e.className.toString().slice(0, 30) || e.tagName,
          breite: Math.round(breite),
          hoehe: Math.round(hoehe),
        }
      })
      .filter((x) => x.breite < 44 || x.hoehe < 44)
  })
}

test('Bedienelemente sind mindestens 44 Pixel zu treffen', async ({ page }) => {
  await visit(page)

  const klein = await zuKlein(page)
  expect(
    klein,
    `auf dem Startbildschirm zu klein: ${klein.map((x) => `${x.was} (${x.breite}×${x.hoehe})`).join(', ')}`,
  ).toEqual([])

  for (const seite of SEITEN) {
    await openPage(page, seite)
    await page.locator('.page').waitFor()
    /*
     * Die Seiten öffnen animiert; erst messen, wenn sie steht. Gewartet wird
     * nur auf **endliche** Animationen — auf eine endlose (der Hintergrund
     * atmet, G-8) wird `finished` nie erfüllt, und der Test hinge ewig.
     */
    await page.locator('.page').evaluate(async (el) => {
      const endlich = el.getAnimations().filter((a) => {
        const t = a.effect?.getComputedTiming()
        return t !== undefined && t.iterations !== Infinity
      })
      await Promise.all(endlich.map((a) => a.finished.catch(() => undefined)))
    })

    const zuKleinHier = await zuKlein(page)
    expect(
      zuKleinHier,
      `auf „${seite}" zu klein: ${zuKleinHier.map((x) => `${x.was} (${x.breite}×${x.hoehe})`).join(', ')}`,
    ).toEqual([])

    /*
     * Zurück führt in den Core, und die Schublade öffnet animiert. Wer hier
     * nur auf „Seite weg" wartet und dann den Hamburger antippt, greift in
     * genau dieses Fenster: Der Schleier liegt schon darüber, der Knopf ist
     * nie „stabil", und der Klick läuft in die Zeitgrenze. Gewartet wird
     * deshalb auf den Zustand, der nach dem Zurück gilt — die offene
     * Schublade.
     */
    await page.locator('.page-back').click()
    await page.locator('.page').waitFor({ state: 'hidden' })
    await page.locator('.drawer').waitFor({ state: 'visible' })
  }
})
