import { expect, test, type Page } from '@playwright/test'

import { answerRecall, collectItems, recallKind, sceneOf, startButton } from './helpers.ts'

/**
 * Eine Trainingseinheit von vorn bis hinten (Backlog B1–B3, B5, D4, D6).
 *
 * Geprüft wird der Notfallmodus (60 Sekunden, eine Runde) — lang genug, dass
 * alles vorkommt, kurz genug, dass der Test nicht fünf Minuten wartet.
 */

async function startEmergency(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: '60 Sekunden' }).click()
  await startButton(page).click()
  // Das Ankommen (D-011/G-1) lässt sich antippen — im Test warten wir nicht
  // drei Sekunden auf einen atmenden Kreis.
  await page.locator('.settle').click()
}

test('führt durch Einprägen und Abrufen und zählt ehrlich', async ({ page }) => {
  /*
   * Die Standardgrenze von dreißig Sekunden reicht seit dem Palast nicht mehr:
   * Ein Gang prägt fünf Stationen à sechs Sekunden ein und braucht damit die
   * halbe Notfall-Einheit allein fürs Einprägen (D-017). Bis dahin war das
   * längste Modul die Mission mit zwanzig Sekunden — und der Test lief
   * jahrelang knapp, ohne dass es jemandem auffiel.
   */
  test.setTimeout(120_000)
  await startEmergency(page)

  /*
   * Erst warten, dann lesen. Ohne das Warten prüft der Test den Bildschirm,
   * bevor der Block überhaupt gezeichnet ist — und hält jedes Modul für ein
   * Nicht-Szenenmodul, weil noch gar nichts dasteht.
   */
  await expect(page.locator('.encode-word, .scene').first()).toBeVisible({ timeout: 30_000 })

  /*
   * Welches Modul heute kommt, entscheidet der Plan — der Test liest ab, was
   * dasteht. Eine **Mission** zeigt statt einzelner Stücke eine ganze Szene;
   * alles andere zeigt ein Stück nach dem anderen.
   */
  const scene = await sceneOf(page)

  if (scene === undefined) {
    // Der Einprägetext gehört zum Modul: Wörter kommen einzeln, beim Gesicht
    // gehören Bild und Name zusammen, Zahlen spricht man innerlich mit.
    await expect(
      page.getByText(
        /Ein Wort nach dem anderen\.|Gesicht und Name gehören zusammen\.|Eine Zahl nach der anderen\./,
      ),
    ).toBeVisible()
  } else {
    /*
      Zwei Module bauen eine Szene, und sie sagen Verschiedenes an: Die
      Mission fragt nach der Bindung zwischen den Stücken, der Gang verlangt,
      dass man sie hinlegt. Der Test liest ab, welche dasteht — vorherzusagen
      welche, war schon zweimal der Fehler.
    */
    await expect(
      page.getByText(/Eine Szene\. Was gehört zu wem\?|Geh den Weg ab\./),
    ).toBeVisible()
  }

  /*
   * Die Punktreihe wird **während** des Einprägens gezählt, nicht danach.
   *
   * Beim ersten Anlauf stand die Zählung hinter `collectItems` — und das
   * kehrt erst zurück, wenn der Abruf beginnt. Da war die Reihe längst weg,
   * und der Test verglich sechs Stücke mit null Punkten. Punkte statt „3 / 8“
   * ist D-011/G-1; eine Szene hat keine, dort wechselt nichts.
   */
  const dots = scene === undefined ? await page.locator('.encode-dots span').count() : 0

  const learned = await collectItems(page, 8)
  const total = learned.items.length
  expect(total).toBeGreaterThanOrEqual(3)
  expect(total).toBeLessThanOrEqual(8)
  expect(new Set(learned.items).size).toBe(total)
  if (scene === undefined) expect(dots).toBe(total)

  /*
   * Ab hier trennen sich die Wege, und zwar nach dem, was die App zeigt.
   *
   * Der freie Abruf mit seinem einen Textfeld ist die eine Aufgabe, der
   * gestützte mit einer Frage nach der anderen die andere — sie lassen sich
   * nicht in eine Prüfung falten, ohne eine von beiden zu verbiegen.
   *
   * Beide Zweige prüfen dasselbe Versprechen: **Es wird gezählt, was da war,
   * und nichts dazuerfunden** (Regel R-1).
   */
  if ((await recallKind(page)) === 'free') {
    /*
     * Zwei richtig, eines absichtlich verfälscht, eines erfunden.
     *
     * Was das dritte wert ist, hängt am Gegenstand — und den liest der Test
     * ab, statt ihn zu erraten: Bei einem **Wort** ist ein vertauschter
     * Buchstabe ein Tippfehler und zählt. Bei einer **Zahl** ist eine
     * geänderte Ziffer eine andere Zahl und zählt nicht (D10). Genau diese
     * Unterscheidung ist der Sinn von `leniencyFor`, und sie wird hier bis
     * zur angezeigten Zahl durchgeprüft.
     */
    const words = learned.items
    const numeric = words.every((word) => /^\d+$/.test(word))
    const spoiled = numeric ? otherNumber(words[2]!, words) : misspell(words[2]!)
    const typed = [words[0]!, words[1]!, spoiled, 'Zahnbürstenhalter']
    await page.locator('.recall-input').fill(typed.join('\n'))
    await page.getByRole('button', { name: 'Fertig' }).click()

    await expect(page.getByRole('heading', { name: 'Geblieben' })).toBeVisible()
    await expect(page.locator('.summary-score strong')).toHaveText(numeric ? '2' : '3')
  } else {
    /*
     * Gestützt: Alles richtig beantworten, nur das Letzte auslassen — was
     * fehlt, gilt als nicht erinnert, und das ist der Normalfall, wenn die
     * Zeit ausläuft.
     *
     * Die Antworten kommen aus `helpers.ts` und richten sich nach der
     * **Frage**, nicht nach der Stelle: Bei einer Mission fragt die App in
     * einer anderen Reihenfolge, als sie gezeigt hat.
     */
    await answerRecall(page, learned, 'allButLast')

    await expect(page.getByRole('heading', { name: 'Geblieben' })).toBeVisible()
    await expect(page.locator('.summary-score strong')).toHaveText(String(total - 1))
  }

  await expect(page.locator('.summary-score span')).toHaveText(`/ ${total}`)
})

test('hält das Zeitbudget ein, auch wenn niemand etwas tut', async ({ page }) => {
  // Der Notfallmodus dauert 60 Sekunden — der Test muss ihn abwarten dürfen.
  test.setTimeout(150_000)

  await startEmergency(page)
  // Ab dem ersten Wort laeuft die Uhr der Einheit — das Ankommen davor ist
  // ausdruecklich keine Trainingszeit (D-011/G-1).
  // Eine Mission zeigt statt einzelner Stücke ihre Szene — beides ist der
  // Anfang der Trainingszeit.
  await expect(page.locator('.encode-word, .scene').first()).toBeVisible({ timeout: 15_000 })
  const started = Date.now()
  await expect(page.getByRole('textbox')).toBeVisible({ timeout: 60_000 })

  // Nichts eintippen, nichts drücken — die Einheit muss trotzdem enden.
  await expect(page.getByRole('heading', { name: 'Geblieben' })).toBeVisible({ timeout: 90_000 })
  await expect(page.locator('.summary-score strong')).toHaveText('0')

  // Die Zusage aus B2: 60 Sekunden sind 60 Sekunden. Der Spielraum nach oben
  // deckt Anlauf und Testmaschine ab, nach unten wäre jede Abkürzung ein
  // Fehler — dann hätte ein Block seine Zeit nicht bekommen.
  const seconds = (Date.now() - started) / 1000
  expect(seconds).toBeGreaterThan(57)
  expect(seconds).toBeLessThan(72)
})

test('überlebt eine Unterbrechung mitten in der Einheit (B5)', async ({ page }) => {
  await startEmergency(page)
  await expect(page.locator('.encode-word, .scene').first()).toBeVisible()
  await page.waitForTimeout(1500)

  // Der harte Fall: Die Seite wird weggerissen, nicht sauber verlassen.
  await page.reload()

  await expect(page.getByRole('heading', { name: 'Eine Einheit läuft noch' })).toBeVisible()
  await page.getByRole('button', { name: 'Fortsetzen' }).click()
  await expect(page.locator('.encode-word, .scene, .recall-input').first()).toBeVisible()
})

test('lässt sich verwerfen und beginnt dann neu', async ({ page }) => {
  await startEmergency(page)
  await expect(page.locator('.encode-word, .scene').first()).toBeVisible()
  await page.reload()

  await page.getByRole('button', { name: 'Verwerfen und neu beginnen' }).click()
  await expect(page.getByRole('heading', { name: 'Eine Einheit läuft noch' })).toBeHidden()
  await expect(startButton(page)).toBeVisible()

  await page.reload()
  await expect(page.getByRole('heading', { name: 'Eine Einheit läuft noch' })).toBeHidden()
})

/** Vertauscht zwei Nachbarn — der häufigste Tippfehler überhaupt. */
function misspell(word: string): string {
  if (word.length < 5) return word
  return word.slice(0, 2) + word[3] + word[2] + word.slice(4)
}

/**
 * Eine Zahl um eine Ziffer daneben — und garantiert keine der gesuchten.
 *
 * Die letzte Bedingung ist nicht Pedanterie: Läge die verfälschte Zahl
 * zufällig auch im Vorrat der Runde, träfe sie dort und der Test zählte einen
 * Treffer, den er gerade ausschließen wollte. Er wäre dann selten und
 * unerklärlich rot — die schlimmste Sorte Test.
 */
function otherNumber(value: string, avoid: readonly string[]): string {
  for (let step = 1; step < 10; step++) {
    const candidate = value.slice(0, -1) + String((Number(value.slice(-1)) + step) % 10)
    if (!avoid.includes(candidate)) return candidate
  }
  throw new Error(`keine abweichende Zahl zu ${value} gefunden`)
}
