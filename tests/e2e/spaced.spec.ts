import { expect, test, type Page } from '@playwright/test'

/**
 * Das Versprechen aus D-004, im Browser nachgeprüft: **Was du heute lernst,
 * kommt an einem späteren Tag von selbst zurück.**
 *
 * Der Trick des Tests ist, dass er nicht wartet, sondern die Datenbank
 * vordatiert: Die Termine der gestern gelernten Wörter werden auf heute
 * gezogen. Das prüft genau die Kette, auf die es ankommt — Termin lesen,
 * auswählen, in den Plan legen, abfragen —, ohne dass jemand drei Tage
 * danebensitzt.
 */

async function runEmergencySession(page: Page, answer: 'all' | 'none') {
  await page.getByRole('button', { name: '60 Sekunden' }).click()
  await page.getByRole('button', { name: 'Beginnen' }).click()
  await page.locator('.settle').click()

  const words: string[] = []
  const word = page.locator('.encode-word')
  while (words.length < 8) {
    if (await page.locator('.recall-input').count()) break
    const text = (await word.textContent().catch(() => null))?.trim()
    if (text !== undefined && text !== '' && text !== words[words.length - 1]) words.push(text)
    await page.waitForTimeout(150)
  }

  await page.locator('.recall-input').waitFor({ timeout: 30_000 })
  if (answer === 'all') await page.locator('.recall-input').fill(words.join('\n'))
  await page.getByRole('button', { name: 'Fertig' }).click()
  await expect(page.getByRole('heading', { name: 'Geblieben' })).toBeVisible({ timeout: 30_000 })
  await page.getByRole('button', { name: 'Zurück' }).click()
  return words
}

/** Zieht alle Termine so weit vor, dass sie heute fällig sind. */
async function makeEverythingDueToday(page: Page) {
  const count = await page.evaluate(async () => {
    const open = indexedDB.open('anitew')
    const database: IDBDatabase = await new Promise((resolve, reject) => {
      open.onsuccess = () => resolve(open.result)
      open.onerror = () => reject(open.error)
    })
    const store = database.transaction('itemStates', 'readwrite').objectStore('itemStates')
    const rows: { dueDay?: string }[] = await new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    for (const row of rows) {
      row.dueDay = '2000-01-01'
      store.put(row)
    }
    return rows.length
  })
  expect(count).toBeGreaterThan(0)
  return count
}

test('holt gelernte Wörter an einem späteren Tag zurück (D8)', async ({ page }) => {
  test.setTimeout(180_000)

  await page.goto('/')
  const learned = await runEmergencySession(page, 'all')
  expect(learned.length).toBeGreaterThanOrEqual(3)

  // Der Sprung in die Zukunft.
  await makeEverythingDueToday(page)
  await page.reload()

  await page.getByRole('button', { name: '60 Sekunden' }).click()
  await page.getByRole('button', { name: 'Beginnen' }).click()
  await page.locator('.settle').click()

  // Jetzt muss der Wiedersehensblock kommen — und zwar mit den Wörtern von
  // vorhin, ohne dass sie noch einmal gezeigt wurden.
  await expect(page.getByText('Und jetzt von früher')).toBeVisible({ timeout: 60_000 })

  /*
   * Alle gelernten Wörter eintippen, nicht eine Auswahl davon.
   *
   * Der erste Anlauf tippte die ersten zwei ein und erwartete zwei Treffer —
   * und bekam null. Der Grund liegt in `due.ts` und ist kein Fehler: Die
   * Auswahl ist gedeckelt und bei gleichem Rückstand alphabetisch geordnet,
   * die beiden Wörter waren schlicht nicht dabei. Der Test darf die Auswahl
   * des Schedulers nicht erraten wollen.
   */
  await page.locator('.recall-input').fill(learned.join('\n'))
  await page.getByRole('button', { name: 'Fertig' }).click()

  await expect(page.getByRole('heading', { name: 'Von früher' })).toBeVisible({ timeout: 30_000 })
  const score = page.locator('.summary-score-small')
  const text = (await score.textContent()) ?? ''
  const [correct, total] = text.split('/').map((part) => Number(part.replace(/\D/g, '')))

  expect(total).toBeGreaterThan(0)
  // Wer alles weiß, hat alles richtig — und das Wiedersehen zählt getrennt
  // vom heute Gelernten.
  expect(correct).toBe(total)
})

test('zeigt kein Wiedersehen, wenn nichts fällig ist', async ({ page }) => {
  test.setTimeout(120_000)
  await page.goto('/')
  await runEmergencySession(page, 'all')

  // Nichts vordatiert: Die frisch gelernten Wörter sind erst in Tagen dran.
  await page.getByRole('button', { name: '60 Sekunden' }).click()
  await page.getByRole('button', { name: 'Beginnen' }).click()
  await page.locator('.settle').click()
  /*
   * Großzügige Frist, und das ist kein Zugeständnis an Flackern.
   *
   * Seit M2 tut die App vor dem ersten Wort mehr: Sie liest die fälligen
   * Termine aus der Datenbank, plant, legt die Einheit an — und davor liegen
   * drei Sekunden Ankommen. Unter Last (mehrere Testläufe gleichzeitig,
   * daneben eine Einheit, die 60 Sekunden echte Zeit abwartet) reichten 30
   * Sekunden einmal nicht. Geprüft wird hier, *dass* kein Wiedersehen kommt,
   * nicht wie schnell das erste Wort erscheint.
   */
  await expect(page.locator('.encode-word')).toBeVisible({ timeout: 60_000 })
  await expect(page.getByText('Und jetzt von früher')).toBeHidden()
})
