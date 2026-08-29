import { expect, test } from '@playwright/test'

/**
 * Die Farben dürfen nach dem Start nicht umspringen (Audit 29.08., B-05).
 *
 * ANITEW lädt einen Teil seiner Stilblätter absichtlich verzögert, damit der
 * Kaltstart klein bleibt. Dabei liefen zwei dunkle Paletten nebeneinander: die
 * eine in `anitew-redesign.css` beim Kaltstart, die andere in
 * `anitew-experience-refinement.css`, das `experienceRefinement.ts` rund 750 ms
 * später nachlädt. Zwölf Token wichen ab, bei zweien war der Sprung sichtbar —
 * `--ink-soft` von grüngrau nach warmgrau, `--calm` ebenso.
 *
 * Gemessen wird deshalb dasselbe zweimal: einmal so früh wie möglich, einmal
 * nachdem die nachgelagerte Startarbeit nachweislich durch ist (Marke
 * `anitew:deferred-ready`, siehe `main.tsx`).
 */
const GRUNDTOKEN = [
  '--paper',
  '--paper-glow',
  '--card',
  '--line',
  '--ink',
  '--ink-soft',
  '--ink-faint',
  '--accent',
  '--accent-soft',
  '--accent-ink',
  '--calm',
  '--bad',
]

test('die Farbpalette steht von Anfang an fest', async ({ page }) => {
  await page.goto('/')

  const lies = () =>
    page.evaluate((token) => {
      const stil = getComputedStyle(document.documentElement)
      const werte: Record<string, string> = {}
      for (const t of token) werte[t] = stil.getPropertyValue(t).trim()
      return werte
    }, GRUNDTOKEN)

  const frueh = await lies()

  await page.waitForFunction(
    () => performance.getEntriesByName('anitew:deferred-ready').length > 0,
    { timeout: 30_000 },
  )
  // Ein Bild abwarten, damit die nachgeladenen Stile auch angewandt sind.
  await page.evaluate(
    () => new Promise((fertig) => requestAnimationFrame(() => requestAnimationFrame(fertig))),
  )
  const spaet = await lies()

  const gesprungen = Object.keys(frueh)
    .filter((t) => frueh[t] !== spaet[t])
    .map((t) => `${t}: ${frueh[t]} → ${spaet[t]}`)

  expect(gesprungen, `Farbtoken springen nach dem Nachladen um: ${gesprungen.join(', ')}`).toEqual([])
})
