import { expect, test, type Page } from '@playwright/test'

import { answerRecall, recallKind } from './helpers.ts'

/**
 * Eine Trainingseinheit von vorn bis hinten (Backlog B1–B3, B5, D4, D6).
 *
 * Geprüft wird der Notfallmodus (60 Sekunden, eine Runde) — lang genug, dass
 * alles vorkommt, kurz genug, dass der Test nicht fünf Minuten wartet.
 */

async function startEmergency(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: '60 Sekunden' }).click()
  await page.getByRole('button', { name: 'Beginnen' }).click()
  // Das Ankommen (D-011/G-1) lässt sich antippen — im Test warten wir nicht
  // drei Sekunden auf einen atmenden Kreis.
  await page.locator('.settle').click()
}

/** Liest die Wörter mit, während sie eingeprägt werden. */
async function collectWords(page: Page, expected: number): Promise<string[]> {
  const word = page.locator('.encode-word')
  const seen: string[] = []
  while (seen.length < expected) {
    await expect(word).toBeVisible({ timeout: 15_000 })
    const text = (await word.textContent())?.trim() ?? ''
    if (text !== '' && text !== seen[seen.length - 1]) seen.push(text)
    await page.waitForTimeout(250)
  }
  return seen
}

test('führt durch Einprägen und Abrufen und zählt ehrlich', async ({ page }) => {
  await startEmergency(page)

  // Der Einprägetext gehört zum Modul: Wörter kommen einzeln, beim Gesicht
  // gehören Bild und Name zusammen, Zahlen spricht man innerlich mit. Einer
  // von den dreien muss dastehen — welcher, entscheidet der Plan.
  await expect(
    page.getByText(
      /Ein Wort nach dem anderen\.|Gesicht und Name gehören zusammen\.|Eine Zahl nach der anderen\./,
    ),
  ).toBeVisible()

  // Punkte statt „3 / 8“ — einer je Stück (D-011/G-1).
  const total = await page.locator('.encode-dots span').count()
  expect(total).toBeGreaterThanOrEqual(3)
  expect(total).toBeLessThanOrEqual(8)

  const words = await collectWords(page, total)
  expect(new Set(words).size).toBe(total)

  /*
   * Ab hier trennen sich die Wege, und zwar nach dem, was die App zeigt.
   *
   * Seit M4 zieht der Plan das Modul aus dem Seed: Ein 60-Sekunden-Durchlauf
   * bringt mal Wörter, mal Gesichter. Der freie Abruf mit seinem einen
   * Textfeld ist die eine Aufgabe, der gestützte mit einem Gesicht nach dem
   * anderen die andere — sie lassen sich nicht in eine Prüfung falten, ohne
   * eine von beiden zu verbiegen.
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
    const numeric = words.every((word) => /^\d+$/.test(word))
    const spoiled = numeric ? otherNumber(words[2]!, words) : misspell(words[2]!)
    const typed = [words[0]!, words[1]!, spoiled, 'Zahnbürstenhalter']
    await page.locator('.recall-input').fill(typed.join('\n'))
    await page.getByRole('button', { name: 'Fertig' }).click()

    await expect(page.getByRole('heading', { name: 'Geblieben' })).toBeVisible()
    await expect(page.locator('.summary-score strong')).toHaveText(numeric ? '2' : '3')
  } else {
    /*
     * Beim Gesichtsmodul steht die Reihenfolge fest: Was eingeprägt wurde,
     * wird in derselben Folge abgefragt. Deshalb darf der Test hier antworten
     * — anders als beim Wiedersehen in `spaced.spec.ts`, wo der Scheduler die
     * Reihenfolge bestimmt und der Test sie nicht kennen darf.
     *
     * Der vorletzte Name bekommt einen Tippfehler und zählt trotzdem, der
     * letzte bleibt leer und zählt nicht. Gemessen wird das Gedächtnis, nicht
     * die Rechtschreibung.
     */
    const typed = [...words]
    typed[total - 2] = misspell(words[total - 2]!)
    typed[total - 1] = ''
    await answerRecall(page, typed, 'all')

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
  await expect(page.locator('.encode-word')).toBeVisible({ timeout: 15_000 })
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
  await expect(page.locator('.encode-word')).toBeVisible()
  await page.waitForTimeout(1500)

  // Der harte Fall: Die Seite wird weggerissen, nicht sauber verlassen.
  await page.reload()

  await expect(page.getByRole('heading', { name: 'Eine Einheit läuft noch' })).toBeVisible()
  await page.getByRole('button', { name: 'Fortsetzen' }).click()
  await expect(page.locator('.encode-word, .recall-input').first()).toBeVisible()
})

test('lässt sich verwerfen und beginnt dann neu', async ({ page }) => {
  await startEmergency(page)
  await expect(page.locator('.encode-word')).toBeVisible()
  await page.reload()

  await page.getByRole('button', { name: 'Verwerfen und neu beginnen' }).click()
  await expect(page.getByRole('heading', { name: 'Eine Einheit läuft noch' })).toBeHidden()
  await expect(page.getByRole('button', { name: 'Beginnen' })).toBeVisible()

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
