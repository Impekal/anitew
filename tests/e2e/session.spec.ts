import { expect, test, type Page } from '@playwright/test'

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

  await expect(page.getByText('Sieh hin. Ein Wort nach dem anderen.')).toBeVisible()
  // Punkte statt „3 / 8“ — einer je Wort (D-011/G-1).
  const total = await page.locator('.encode-dots span').count()
  expect(total).toBeGreaterThanOrEqual(3)
  expect(total).toBeLessThanOrEqual(8)

  const words = await collectWords(page, total)
  expect(new Set(words).size).toBe(total)

  const input = page.getByRole('textbox')
  await expect(input).toBeVisible({ timeout: 15_000 })

  // Zwei richtig, eines absichtlich mit Tippfehler, eines erfunden.
  const typed = [words[0]!, words[1]!, misspell(words[2]!), 'Zahnbürstenhalter']
  await input.fill(typed.join('\n'))
  await page.getByRole('button', { name: 'Fertig' }).click()

  await expect(page.getByRole('heading', { name: 'Geblieben' })).toBeVisible()
  // Drei Treffer: der Tippfehler zählt, das erfundene Wort nicht.
  await expect(page.locator('.summary-score strong')).toHaveText('3')
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
