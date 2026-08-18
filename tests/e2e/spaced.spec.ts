import { expect, test, type Page } from '@playwright/test'

import { answerRecall, collectItems, recallKind, startEmergency } from './helpers.ts'

/**
 * Das Versprechen aus D-004, im Browser nachgeprüft: **Was du heute lernst,
 * kommt an einem späteren Tag von selbst zurück.**
 *
 * Der Trick des Tests ist, dass er nicht wartet, sondern die Datenbank
 * vordatiert: Die Termine der gestern gelernten Stücke werden auf heute
 * gezogen. Das prüft genau die Kette, auf die es ankommt — Termin lesen,
 * auswählen, in den Plan legen, abfragen —, ohne dass jemand drei Tage
 * danebensitzt.
 *
 * Seit M4 gilt das für **jedes** Modul: Ob die Einheit Wörter, Gesichter,
 * Zahlen oder eine Mission bringt, entscheidet der Plan. Der Test folgt ihm,
 * statt es zu raten (siehe `helpers.ts`) — und prüft damit die Wiedervorlage
 * für das, was gerade dran war.
 */

async function runEmergencySession(page: Page, answer: 'all' | 'none') {
  await startEmergency(page)
  const learned = await collectItems(page, 8)
  await answerRecall(page, learned, answer)
  await expect(page.getByRole('heading', { name: 'Geblieben' })).toBeVisible({ timeout: 30_000 })
  await page.getByRole('button', { name: 'Zurück' }).click()
  return learned
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
  expect(learned.items.length).toBeGreaterThanOrEqual(3)

  // Der Sprung in die Zukunft.
  await makeEverythingDueToday(page)
  await page.reload()

  await startEmergency(page)

  /*
   * Jetzt muss der Wiedersehensblock kommen — mit dem von vorhin, ohne dass
   * es noch einmal gezeigt wurde.
   *
   * Er kommt zuletzt, hinter der Lernrunde: Im Notfallmodus sind das rund
   * vierzig Sekunden Vorlauf, die hier schlicht abgewartet werden. Welches
   * Modul die Lernrunde bringt, ist dabei gleichgültig — der Wiedersehensblock
   * gehört dem Modul, in dem etwas fällig ist, und nicht dem, das gerade
   * gelernt wird.
   *
   * Beide Anreden gelten: „Und jetzt von früher: Woran erinnerst du dich
   * noch?“ beim freien Abruf, „Und von früher: Wer ist das?“ beim gestützten.
   * Nur den einen Satz zu suchen hieße wieder, das Modul vorherzusagen.
   */
  await expect(page.getByText(/Und (jetzt )?von früher/)).toBeVisible({ timeout: 100_000 })

  const kind = await recallKind(page)

  /*
   * Alles Gelernte eintippen, nicht eine Auswahl davon.
   *
   * Der erste Anlauf tippte die ersten zwei ein und erwartete zwei Treffer —
   * und bekam null. Der Grund liegt in `due.ts` und ist kein Fehler: Die
   * Auswahl ist gedeckelt und bei gleichem Rückstand alphabetisch geordnet,
   * die beiden Wörter waren schlicht nicht dabei. Der Test darf die Auswahl
   * des Schedulers nicht erraten wollen.
   */
  await answerRecall(page, learned, 'all')

  await expect(page.getByRole('heading', { name: 'Von früher' })).toBeVisible({ timeout: 30_000 })
  const score = page.locator('.summary-score-small')
  const text = (await score.textContent()) ?? ''
  const [correct, total] = text.split('/').map((part) => Number(part.replace(/\D/g, '')))

  // Das Entscheidende, und es gilt für beide Module: Was gestern gelernt
  // wurde, ist heute von selbst zurückgekommen und wird getrennt vom heute
  // Gelernten gezählt.
  expect(total).toBeGreaterThan(0)
  expect(correct).toBeLessThanOrEqual(total as number)

  if (kind === 'free') {
    // Wer alles weiß, hat alles richtig.
    expect(correct).toBe(total)
  }
  /*
   * Beim gestützten Abruf steht diese Zusage hier bewusst **nicht**.
   *
   * Dort gehört zu jeder Stelle ein bestimmtes Gesicht, und welches, ist dem
   * Test nicht zu entnehmen — der Name steht ja gerade nicht auf dem
   * Bildschirm, das ist die Aufgabe. Um richtig zu antworten, müsste er die
   * Reihenfolge des Schedulers nachbauen; genau davor warnt der Absatz
   * darüber, und eine zweite Kopie derselben Logik im Test wäre keine
   * Prüfung, sondern eine Verdopplung.
   *
   * Dass die Zuordnung Stelle für Stelle stimmt, prüft `gradePrompted` in den
   * Kerntests — dort ohne Browser und ohne Raten.
   */
})

test('zeigt kein Wiedersehen, wenn nichts fällig ist', async ({ page }) => {
  test.setTimeout(120_000)
  await page.goto('/')
  await runEmergencySession(page, 'all')

  // Nichts vordatiert: Das frisch Gelernte ist erst in Tagen dran.
  await startEmergency(page)
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
  // Wörter, Gesichter und Zahlen stehen in `.encode-word`, eine Mission
  // zeigt stattdessen ihre Szene. Eins von beidem muss kommen.
  await expect(page.locator('.encode-word, .scene').first()).toBeVisible({ timeout: 60_000 })
  await expect(page.getByText(/Und (jetzt )?von früher/)).toBeHidden()
})
