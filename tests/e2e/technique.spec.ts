import { expect, test, type Page } from '@playwright/test'

/**
 * Die Merktechnik, im Browser nachgeprüft (Backlog D5).
 *
 * D5 ist der Satz, an dem sich ANITEW von jeder Brain-Game-App unterscheidet:
 * **Merktechniken werden beigebracht, nicht nur abgefragt.** Geprüft wird
 * deshalb nicht, ob irgendwo eine Lektion auftaucht, sondern die Kette, auf
 * die es ankommt: unterrichten → sofort anwenden lassen → beim nächsten Mal
 * die nächste Ziffer.
 *
 * Der Drei-Minuten-Modus statt der fünf: Er ist der kürzeste, in dem
 * überhaupt gelehrt wird, und spart dem Lauf zwei Minuten. Abgewartet wird
 * die Einheit nie — nach dem, was geprüft ist, geht der Test hinaus.
 */

/** Die Ziffern, die das Major-System lehrt, in der Reihenfolge der Lektionen. */
const TEACH_ORDER = [1, 2, 3, 4, 5, 9, 7, 8, 0, 6]

/**
 * Setzt den Lernstand, bevor die Einheit beginnt.
 *
 * Der Grund ist eine Lehre aus dem ersten Anlauf dieses Tests: Er prüfte die
 * Konsonantenzeile nur, **wenn zufällig eine Eins in der Zahl vorkam** — und
 * lief deshalb einmal grün, während der Fehler noch drin war. Ein Test, der
 * sich seine Gelegenheit vom Zufall geben lässt, ist keiner.
 *
 * Sind neun der zehn Ziffern schon gelehrt, lehrt die Lektion die zehnte, und
 * danach muss unter **jeder** Ziffer jeder Zahl ein Konsonant stehen. Damit
 * ist die Prüfung vollständig, egal welche Zahl gezogen wird.
 */
async function seedTaught(page: Page, digits: readonly number[]) {
  await page.goto('/')
  // Erst nach dem ersten Laden gibt es das Schema, in das geschrieben wird.
  await expect(page.getByRole('button', { name: 'Beginnen' })).toBeVisible()
  await page.evaluate(async (value) => {
    const open = indexedDB.open('anitew')
    const database: IDBDatabase = await new Promise((resolve, reject) => {
      open.onsuccess = () => resolve(open.result)
      open.onerror = () => reject(open.error)
    })
    await new Promise<void>((resolve, reject) => {
      const request = database
        .transaction('settings', 'readwrite')
        .objectStore('settings')
        .put({ key: 'technique.major.taught', value })
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }, digits)
  await page.reload()
}

async function startShort(page: Page) {
  await page.getByRole('button', { name: '3 Minuten' }).click()
  await page.getByRole('button', { name: 'Beginnen' }).click()
  await page.locator('.settle').click()
}

test('unterrichtet die Technik und lässt sie sofort anwenden', async ({ page }) => {
  test.setTimeout(120_000)

  await page.goto('/')
  await startShort(page)

  // Die erste Lektion nennt den Zweck, danach nicht mehr (G-2).
  await expect(page.locator('.lesson')).toBeVisible({ timeout: 30_000 })
  await expect(page.getByText('Ziffern sind schwer zu behalten')).toBeVisible()

  // Die Eins zuerst: Ihre Brücke ist die sichtbarste. Wer mit der Null oder
  // der Sechs anfängt, hält die Technik für willkürlich.
  await expect(page.locator('.lesson-digit')).toHaveText('1')
  await expect(page.locator('.lesson-letters')).toHaveText('t · d')
  await expect(page.getByText('Das kleine t hat einen Abstrich')).toBeVisible()

  // Antippen geht weiter — die Lektion ist kein Hindernis, das man nehmen muss.
  await page.locator('.lesson-card').click()

  /*
   * Und jetzt das Entscheidende: **Zahlen kommen direkt danach.** Erst die
   * Technik erklären und sie dann drei Runden lang nicht benutzen dürfen wäre
   * Unterricht ohne Anwendung — und am nächsten Tag wieder weg.
   */
  await expect(page.locator('.encode-word')).toBeVisible({ timeout: 30_000 })
  const shown = (await page.locator('.encode-word').textContent())?.trim() ?? ''
  expect(shown).toMatch(/^\d+$/)
})

test('schreibt den Konsonanten unter seine Ziffer — auch den frisch gelernten', async ({
  page,
}) => {
  test.setTimeout(180_000)

  /*
   * Neun Ziffern sitzen, die zehnte kommt gleich als Lektion. Danach muss
   * unter **jeder** Ziffer jeder Zahl ein Konsonant stehen — fehlte der
   * frisch gelernten ihrer, während alle anderen ihren haben, fällt genau
   * das hier auf.
   *
   * Und deshalb wird der **ganze Block** beobachtet und nicht die erste Zahl.
   * Der erste Anlauf prüfte nur, was zufällig gerade dastand: Er lief zweimal
   * grün, während der Fehler noch drin war, weil die gezogene Zahl die
   * fragliche Ziffer nicht enthielt. Ein Test, der sich seine Gelegenheit vom
   * Zufall geben lässt, ist keiner — er muss auf sie warten.
   */
  const fresh = String(TEACH_ORDER[TEACH_ORDER.length - 1])

  for (let attempt = 0; attempt < 3; attempt++) {
    await seedTaught(page, TEACH_ORDER.slice(0, -1))
    await startShort(page)
    await expect(page.locator('.lesson-digit')).toHaveText(fresh, { timeout: 30_000 })
    await page.locator('.lesson-card').click()
    await expect(page.locator('.encode-word')).toBeVisible({ timeout: 30_000 })

    const seen = new Set<string>()
    let used = false
    while (!used && (await page.locator('.recall-input').count()) === 0) {
      const shown = (await page.locator('.encode-word').textContent())?.trim() ?? ''
      const letters = await page.locator('.major-letters span').allTextContents()
      // Zwischen den beiden Abfragen kann die Zahl gewechselt haben; dann
      // gehören Ziffern und Buchstaben nicht zusammen und die Probe fällt aus.
      const still = (await page.locator('.encode-word').textContent())?.trim() ?? ''

      if (shown !== '' && shown === still && !seen.has(shown)) {
        seen.add(shown)
        expect(letters, shown).toHaveLength(shown.length)
        for (const [index, digit] of [...shown].entries()) {
          expect(letters[index], `unter der Ziffer ${digit} von ${shown}`).not.toBe('·')
        }
        used = shown.includes(fresh)
      }
      await page.waitForTimeout(200)
    }

    if (used) {
      await expect(page.getByText('Mach ein Wort daraus')).toBeVisible()
      return
    }
    await page.getByRole('button', { name: 'Abbrechen' }).click()
    await expect(page.getByRole('button', { name: 'Beginnen' })).toBeVisible()
  }

  throw new Error(`In drei Einheiten kam keine Zahl mit der Ziffer ${fresh} vor`)
})

test('zeigt nichts an, solange nichts gelehrt ist', async ({ page }) => {
  test.setTimeout(120_000)

  /*
   * Die Gegenprobe. Ohne sie könnte die Zeile immer erscheinen, mit Punkten
   * gefüllt — ein Versprechen auf etwas, das noch nicht da ist, und nach G-2
   * schlicht Möbel.
   *
   * Im Notfallmodus wird nicht unterrichtet, es bleibt also alles ungelehrt.
   */
  await page.goto('/')
  await page.getByRole('button', { name: '60 Sekunden' }).click()
  await page.getByRole('button', { name: 'Beginnen' }).click()
  await page.locator('.settle').click()

  // Eine Mission zeigt statt einzelner Stücke ihre Szene — beides zählt als
  // „das Einprägen läuft“.
  await expect(page.locator('.encode-word, .scene').first()).toBeVisible({ timeout: 30_000 })
  await expect(page.locator('.lesson')).toBeHidden()
  await expect(page.locator('.major-letters')).toBeHidden()
})

test('hält beim nächsten Mal die nächste Lektion', async ({ page }) => {
  test.setTimeout(120_000)

  await page.goto('/')
  await startShort(page)
  await expect(page.locator('.lesson-digit')).toHaveText('1', { timeout: 30_000 })
  await page.locator('.lesson-card').click()

  // Abbrechen statt abwarten: Gelehrt ist gelehrt, sobald die Lektion vorbei
  // ist — davon hängt nicht ab, ob die Einheit zu Ende läuft.
  await page.getByRole('button', { name: 'Abbrechen' }).click()
  await expect(page.getByRole('button', { name: 'Beginnen' })).toBeVisible()

  await startShort(page)

  // Die Zwei, nicht noch einmal die Eins.
  await expect(page.locator('.lesson-digit')).toHaveText('2', { timeout: 30_000 })
  // Der Zweck steht nur beim allerersten Mal da.
  await expect(page.getByText('Ziffern sind schwer zu behalten')).toBeHidden()
})
