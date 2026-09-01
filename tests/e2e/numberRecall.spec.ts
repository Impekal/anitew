import { expect, test, type Page } from '@playwright/test'

import { pollFirstModule, startButton, visit } from './helpers.ts'

/**
 * Zahlen abrufen — mit der Tastatur, die das Telefon wirklich zeigt.
 *
 * Gerätemeldung 31.08.: „Es heißt eine Zahl pro Zeile, aber auf der Tastatur
 * wird keine Möglichkeit gegeben, auf die nächste Zeile zu gehen. So bleibt
 * es bei einer Zahl, obwohl man mehrere eingeben muss."
 *
 * Der Befund stimmt und die Ursache steht im Code: Der freie Zahlabruf setzt
 * `inputMode="numeric"` — mit gutem Grund (wer eine sechsstellige Zahl auf
 * der Buchstabentastatur sucht, verliert Sekunden an etwas, das mit
 * Gedächtnis nichts zu tun hat). Nur hat der Ziffernblock auf iOS **keine
 * Return-Taste**. Die Anweisung „eine Zahl pro Zeile" verlangt damit etwas,
 * das das Gerät nicht hergibt.
 *
 * Welches Modul eine Einheit zieht, entscheidet der Seed (siehe
 * `reverse.spec.ts`): Der Test startet Notfall-Einheiten und verwirft sie,
 * bis eine Zahlenrunde kommt — derselbe Knopf, den auch ein Mensch hat.
 */

/** Startet Notfall-Einheiten, bis eine Zahlenrunde bis zum freien Abruf steht. */
async function reachNumberRecall(page: Page): Promise<void> {
  for (let attempt = 0; attempt < 40; attempt++) {
    await page.getByRole('button', { name: '60 Sekunden' }).click()
    await startButton(page).click()
    await page.locator('.settle').click()

    if ((await pollFirstModule(page)) === 'numbers') {
      // Das Einprägen läuft über echte Sekunden; der freie Abruf kommt danach.
      await page.locator('.recall-input').waitFor({ timeout: 90_000 })
      return
    }

    await page.locator('.session-abort').click()
    await expect(page.locator('.challenge')).toBeVisible()
  }
  throw new Error('in vierzig Anläufen kam keine Zahlenrunde')
}

test('mehrere Zahlen gehen auch mit dem Ziffernblock — die App gibt den Umbruch', async ({
  page,
}) => {
  test.setTimeout(300_000)
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await reachNumberRecall(page)

  const field = page.locator('.recall-input')
  // Der Ziffernblock ist gewollt — und genau er hat keine Return-Taste.
  await expect(field).toHaveAttribute('inputmode', 'numeric')

  /*
   * Also muss die App den Zeilenwechsel anbieten. Geprüft wird die Wirkung,
   * nicht die Beschriftung: Nach „123", Umbruch, „456" müssen **zwei**
   * Einträge dastehen — nicht die zusammengelaufene Zahl 123456.
   */
  await field.fill('123')
  const next = page.locator('.recall-next')
  await expect(next).toBeVisible()
  await next.click()
  await field.pressSequentially('456')

  await expect(page.locator('.chip')).toHaveText(['123', '456'])

  // Und das Feld bleibt bedienbar: Der Umbruch soll weiterschreiben lassen,
  // nicht den Fokus verlieren (sonst schließt sich am Telefon die Tastatur).
  await expect(field).toBeFocused()
})

test('die Marken zerlegen Zahlen genau so, wie die Einheit sie zählt', async ({ page }) => {
  test.setTimeout(300_000)
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await reachNumberRecall(page)

  /*
   * Die App zeigt lange Folgen gruppiert („12 345"), damit man sie lesen
   * kann. Wer genau das abtippt, meint **eine** Zahl — und die Bewertung
   * liest es auch so (`splitNumberEntries`: Leerzeichen ist Gruppierung,
   * kein Trenner). Die Marken unter dem Feld zerlegten dieselbe Eingabe
   * bisher mit der Wort-Regel und zeigten zwei Stücke: eine sichtbare
   * Rückmeldung, die der Zählung widerspricht. Angezeigt wird jetzt, was
   * gezählt wird.
   */
  const field = page.locator('.recall-input')
  await field.fill('12 345')
  await expect(page.locator('.chip')).toHaveText(['12345'])

  // Komma und Semikolon trennen weiterhin — das kann eine Tastatur, die sie hat.
  await field.fill('12 345, 678')
  await expect(page.locator('.chip')).toHaveText(['12345', '678'])
})
