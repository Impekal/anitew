import { expect, test } from '@playwright/test'

import { reachModuleRound, startButton, visit } from './helpers.ts'

/**
 * Persönlichkeiten am Bildschirm — zum ersten Mal.
 *
 * Das Modul kam am 02.09. dazu, vollständig gebaut und mit Kerntests. Nur
 * hat es bis zum 06.09. **kein Mensch je gesehen**: Die Liste, aus der die
 * App ihre Einheiten zusammenstellt, kannte es nicht (siehe
 * `memory/dailyMission.ts`). Vier Tage lang war es ausgeliefert und tot.
 *
 * Deshalb steht hier, was ohne einen Blick auf den echten Bildschirm nicht
 * auffallen konnte:
 *
 * **Der Ziffernblock.** Gefragt ist ein Jahrgang. Bis heute schaltete die
 * Oberfläche auf die Buchstabentastatur, weil sie für dieses Modul keine
 * Regel hatte — dieselbe Sorte Fehler wie beim Zahlen-Abruf (Gerätebefund
 * 31.08.), nur hat sie hier niemand gemeldet, weil niemand tippen konnte.
 *
 * **Alle drei Angaben beim Einprägen, nur eine beim Abruf.** Fach und
 * Herkunft sind der Haken, an dem der Jahrgang hängt; beim Abruf dürfen sie
 * nicht mehr dastehen, sonst wäre die Frage schon halb beantwortet.
 */

test('ein Mensch, den viele kennen — Jahrgang gefragt, Ziffernblock da', async ({ page }) => {
  test.setTimeout(300_000)
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await reachModuleRound(page, 'people')

  // Einprägen: der Name klein darüber, die drei Angaben groß.
  await expect(page.locator('.fact-prompt')).toHaveText(/\S/u)
  const karte = (await page.locator('.fact-answer').textContent()) ?? ''
  expect(karte, `„${karte}“ ist keine Karte aus Jahr, Fach und Herkunft`).toMatch(
    /^\d{3,4} · .+ · .+$/u,
  )
  const jahrgang = karte.split(' · ')[0] as string

  // Abruf: der Name steht da, die Karte nicht.
  const field = page.locator('.prompted-input')
  await field.waitFor({ timeout: 90_000 })
  await expect(field).toHaveAttribute('inputmode', 'numeric')
  await expect(page.locator('.fact-answer')).toHaveCount(0)

  /*
   * Und der Jahrgang zählt wirklich. Geprüft wird die Wirkung: Der Test
   * tippt, was beim Einprägen dastand, und die Zusammenfassung muss ihn
   * zählen. Eine Frage, die die richtige Antwort nicht annimmt, wäre
   * schlimmer als gar keine.
   */
  await field.fill(jahrgang)
  await page.getByRole('button', { name: 'Fertig' }).click()
  await expect(page.locator('.summary-score strong, .prompted-input').first()).toBeVisible()
})
