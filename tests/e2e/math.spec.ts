import { expect, test } from '@playwright/test'

import { reachModuleRound, startButton, visit } from './helpers.ts'

/**
 * Kopfrechnen am Bildschirm (Nutzerwunsch 05.09.: „ich habe etwa auch an
 * Rechnen Übungen gedacht").
 *
 * Zwei Dinge lassen sich nur hier prüfen, weil sie erst im Zusammenspiel
 * entstehen:
 *
 * **Die Tastatur.** Die Antwort ist immer eine Zahl, also muss der
 * Ziffernblock kommen. Der Kerntest hält fest, dass jede Antwort im Vorrat
 * eine Zahl ist; ob die Oberfläche daraus auch die richtige Tastatur macht,
 * weiß er nicht. Der Gerätebefund vom 31.08. zu den Ziffern zeigt, was das
 * am Telefon kostet: Wer „56“ auf der Buchstabentastatur sucht, verliert
 * Sekunden an etwas, das mit Gedächtnis nichts zu tun hat.
 *
 * **Die Aufgabe steht wirklich da.** Beim Einprägen oben klein die Frage,
 * groß die Antwort — und beim Abruf die Frage allein. Stünde beim Abruf die
 * Antwort noch daneben, wäre die Runde eine Abschreibübung.
 *
 * Welches Modul eine Einheit zieht, entscheidet der Seed (siehe
 * `reverse.spec.ts` und `numberRecall.spec.ts`): Der Test startet
 * Notfall-Einheiten und verwirft sie, bis eine Rechenrunde kommt.
 */

test('eine Rechenaufgabe kommt mit ihrem Ergebnis — und der Abruf mit dem Ziffernblock', async ({
  page,
}) => {
  test.setTimeout(300_000)
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await reachModuleRound(page, 'math')
  await expect(page.locator('.fact-pair')).toBeVisible({ timeout: 15_000 })

  /*
   * Beim Einprägen: die Aufgabe klein, das Ergebnis groß. Geprüft wird die
   * Form der Sache, nicht ihr Wortlaut — welche Aufgabe gezogen wurde, ist
   * gewürfelt, dass es eine Aufgabe mit Zahl als Ergebnis ist, nicht.
   */
  await expect(page.locator('.fact-prompt')).toHaveText(/\d/u)
  await expect(page.locator('.fact-answer')).toHaveText(/^\d+$/u)

  // Und dann der Abruf.
  const field = page.locator('.prompted-input')
  await field.waitFor({ timeout: 90_000 })
  await expect(field).toHaveAttribute('inputmode', 'numeric')

  /*
   * Die Frage steht da, die Antwort nicht. `.fact-answer` gehört zum
   * Einprägen; wäre sie hier noch sichtbar, könnte man ablesen.
   */
  await expect(page.locator('.prompted-question')).toHaveText(/\d/u)
  await expect(page.locator('.fact-answer')).toHaveCount(0)
})
