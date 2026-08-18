import { expect, test, type Page } from '@playwright/test'

import { startButton } from './helpers.ts'

/**
 * Memory Missions, im Browser nachgeprüft (Backlog H1, H2, H4).
 *
 * Eine Mission ist eine **Szene**, keine Liste: Person, Zimmer, Gegenstand,
 * Uhrzeit, Restaurant — und sie gehören zusammen. Geprüft wird genau das,
 * worauf es dabei ankommt und was in keinem anderen Modul vorkommt:
 *
 * 1. Die Szene steht **auf einmal** da, nicht Stück für Stück.
 * 2. Gefragt wird mit **Anker**: „Elena — welche Zimmernummer?“
 * 3. Gezählt wird die richtige Antwort, und die Strenge hängt an der
 *    einzelnen Tatsache: eine vertauschte Ziffer im Zimmer zählt nicht, ein
 *    Tippfehler im Gegenstand schon.
 *
 * Der Notfallmodus reicht dafür: Eine Runde ist eine Szene.
 */

/** Startet neu, bis der Plan das Missionsmodul zieht. */
async function startMission(page: Page): Promise<boolean> {
  for (let attempt = 0; attempt < 25; attempt++) {
    await page.goto('/')
    await page.getByRole('button', { name: '60 Sekunden' }).click()
    await startButton(page).click()
    await page.locator('.settle').click()
    await expect(page.locator('.scene, .encode-word').first()).toBeVisible({ timeout: 30_000 })
    // `.scene` allein reicht seit dem Palast nicht mehr: Ein Gang ist
    // ebenfalls eine Szene und benutzt dasselbe Raster (G). Gesucht ist hier
    // die Mission, also die Szene **ohne** Weg.
    if ((await page.locator('.scene:not(.walk)').count()) > 0) return true
    // Nicht getroffen: Spuren wegräumen, damit der nächste Versuch von vorn
    // beginnt und nicht auf einer halben Einheit aufsetzt.
    await page.evaluate(() => indexedDB.deleteDatabase('anitew'))
  }
  return false
}

test('zeigt die Szene als Ganzes und fragt sie mit Anker ab', async ({ page }) => {
  test.setTimeout(180_000)

  expect(await startMission(page), 'in fünfundzwanzig Anläufen kam keine Mission').toBe(true)

  /*
   * Alles auf einmal. Das ist der Unterschied zu jedem anderen Modul: Geübt
   * wird nicht, vier Tatsachen zu behalten, sondern dass sie zusammengehören.
   * Nacheinander gezeigt wäre es dieselbe Übung wie bei den Wörtern.
   */
  const person = ((await page.locator('.scene-person').textContent()) ?? '').trim()
  expect(person.length).toBeGreaterThan(1)
  const labels = await page.locator('.scene-facts dt').allTextContents()
  const values = await page.locator('.scene-facts dd').allTextContents()
  expect(values).toHaveLength(4)

  /*
   * Die Szene wird über ihre **Etiketten** gelesen, nicht über die Position.
   *
   * Der erste Anlauf nahm die Reihenfolge der Anzeige für die Reihenfolge der
   * Fragen — und die ist eine andere: gezeigt wird Zimmer · Abfahrt · Dabei ·
   * Restaurant, gefragt wird Zimmer · Dabei · Abfahrt · Restaurant. Das ist
   * kein Fehler, sondern gut so: Wer die Reihenfolge mitlernen kann, lernt
   * die Reihenfolge statt die Szene. Nur darf der Test sie eben nicht raten.
   */
  const scene = new Map(
    labels.map((label, index) => [label.trim(), (values[index] ?? '').trim()]),
  )
  const room = scene.get('Zimmer') as string
  const time = scene.get('Abfahrt') as string
  const object = scene.get('Dabei') as string
  const place = scene.get('Restaurant') as string

  expect(room).toMatch(/^[1-9][0-9]{2}$/)
  expect(time).toMatch(/^(0[6-9]|1[0-9]|2[0-3]):[0-5][05]$/)
  expect(object.split(' ')).toHaveLength(2)
  expect(place.length).toBeGreaterThan(2)

  // Ein Gesicht gehört dazu: Nach drei Tagen lautet die Frage „Elena —
  // welches Zimmer?“, und dann muss Elena ein Gesicht haben.
  await expect(page.locator('.scene .face')).toBeVisible()

  // ── Der Abruf ───────────────────────────────────────────────────────────
  await page.locator('.prompted-input').waitFor({ timeout: 40_000 })

  // Der Anker steht dabei, die Person ist nicht die Frage.
  await expect(page.locator('.prompted-anchor')).toHaveText(person)
  await expect(page.getByText('Welche Zimmernummer?')).toBeVisible()
  await expect(page.locator('.prompted .hint').last()).toHaveText('1 / 4')

  /*
   * Vier Antworten in der Reihenfolge der Szene. Zwei davon absichtlich
   * daneben, und zwar so, dass sich die Strenge je Tatsache zeigt:
   *
   * - Beim **Zimmer** werden zwei Ziffern vertauscht. 314 und 341 sind nicht
   *   dasselbe Zimmer — das darf nicht zählen.
   * - Beim **Gegenstand** ein Tippfehler. Das ist ein Tippfehler und kein
   *   vergessener Gegenstand — das muss zählen.
   *
   * Erwartet werden also drei von vier.
   */
  const answerTo = new Map([
    ['Welche Zimmernummer?', swapDigits(room)],
    ['Was hatte sie oder er dabei?', typo(object)],
    ['Wann ging es los?', time],
    ['Wie hieß das Restaurant?', place],
  ])

  // Beantwortet wird, was gefragt ist — so wie ein Mensch es täte. Damit
  // hängt der Test an keiner der beiden Reihenfolgen.
  for (let step = 0; step < 4; step++) {
    const input = page.locator('.prompted-input')
    await input.waitFor({ timeout: 30_000 })
    const question = ((await page.locator('.prompted .hint').first().textContent()) ?? '').trim()
    const answer = answerTo.get(question)
    expect(answer, `unbekannte Frage: „${question}“`).toBeDefined()
    await input.fill(answer as string)
    await page.getByRole('button', { name: 'Fertig' }).click()
  }

  await expect(page.getByRole('heading', { name: 'Geblieben' })).toBeVisible({ timeout: 30_000 })
  await expect(page.locator('.summary-score strong')).toHaveText('3')
  await expect(page.locator('.summary-score span')).toHaveText('/ 4')

  /*
   * Und in der Zusammenfassung steht kein Datenbankname.
   *
   * `Elena#room` ist eine Kennung und kein Satz — dort soll stehen, woran man
   * sich erinnert hat.
   */
  const chips = await page.locator('.summary-words .chip').allTextContents()
  expect(chips.join(' ')).not.toContain('#')
  expect(chips.some((chip) => chip.includes(person))).toBe(true)
})

/** Vertauscht die letzten beiden Ziffern — dieselbe Ziffern, anderes Zimmer. */
function swapDigits(value: string): string {
  const [a, b] = [value.slice(-2, -1), value.slice(-1)]
  if (a === b) {
    // Gleiche Nachbarn ergäben dieselbe Zahl; dann eine Ziffer weiterdrehen.
    return value.slice(0, -1) + String((Number(b) + 1) % 10)
  }
  return value.slice(0, -2) + b + a
}

/**
 * Die letzten beiden Buchstaben vertauscht — ein Tippfehler, kein anderes Wort.
 *
 * Warum am **Ende** und nicht mittendrin: Der erste Anlauf vertauschte im
 * ersten Wort und traf damit „weißer“ → „weßier“. Vor dem Vergleich wird ß zu
 * ss aufgelöst, und aus der Vertauschung zweier Nachbarn wurden dadurch zwei
 * Fehler an auseinanderliegenden Stellen — die Bewertung zählte den Treffer
 * zu Recht nicht. Die App hatte recht, der Test hatte unrecht.
 */
function typo(value: string): string {
  const [a, b] = [value.slice(-2, -1), value.slice(-1)]
  return value.slice(0, -2) + b + a
}
