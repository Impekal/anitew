import { expect, test, type Page } from '@playwright/test'

import { answerRecall, collectItems, openPage, pollFirstModule, startButton, visit } from './helpers.ts'

/**
 * Der Gedächtnispalast, im Browser nachgeprüft (Backlog G1, G2, G4, G6).
 *
 * Zwei Dinge werden hier geprüft, die es in keinem anderen Modul gibt:
 *
 * 1. **Die Lektion kommt zuerst.** Ohne sie stehen fünf Orte und fünf Dinge
 *    da, und niemand weiß, was er damit soll (D-013). Sie kommt genau einmal.
 * 2. **Der Abruf ist ein Abgehen** (G6): Nicht „nenne alles“, sondern Station
 *    für Station — „Flur. Was lag hier?“
 */

/**
 * Startet neu, bis der Plan einen Gang zieht.
 *
 * **Drei Minuten, nicht sechzig Sekunden.** Ein Gang wird in der kürzesten
 * Einheit gar nicht mehr angeboten (`MIN_SECONDS_FOR_PALACE`): Nach dem
 * Wiedersehensanteil blieben für fünf Fragen zehn Sekunden, und zwei Sekunden
 * je Station sind keine Frage, sondern eine Formalie.
 *
 * Auf einer frischen Datenbank steht davor die Lektion — die wird über ihren
 * expliziten Weiter-Knopf verlassen; die Leserate bleibt damit Teil des
 * echten Produktpfads statt von einem alten Klick auf die Karte abzukürzen.
 */
async function startWalk(page: Page): Promise<boolean> {
  for (let attempt = 0; attempt < 60; attempt++) {
    await visit(page)
    await page.getByRole('button', { name: '3 Minuten' }).click()
    await startButton(page).click()
    await page.locator('.settle').click()
    // Welches Modul die Runde hat, sagt der persistierte Plan — kein
    // Bildschirm-Raten (dieselbe Lehre wie in `startEmergency`).
    if ((await pollFirstModule(page)) === 'palace') {
      const lesson = page.locator('.lesson')
      if ((await lesson.count()) > 0) await lesson.getByRole('button', { name: 'Weiter ins Training' }).click()
      await page.locator('.walk').waitFor({ timeout: 30_000 })
      return true
    }
    await page.evaluate(() => indexedDB.deleteDatabase('anitew'))
  }
  return false
}

test('erklärt den Palast, bevor der erste Gang kommt — und nur einmal', async ({ page }) => {
  test.setTimeout(360_000)

  /*
   * Auf einer frischen Datenbank ist das keine Frage des Zufalls: Solange die
   * Technik ungelehrt ist, stellt der Planer sie nach vorn. Deshalb reicht
   * hier ein Anlauf, wo die anderen Palasttests würfeln müssen.
   */
  await visit(page)
  // `exact`, weil „5 Minuten“ auch in „15 Minuten“ steckt — dieselbe Falle
  // wie bei „Beginnen“, und Playwright vergleicht Namen von Haus aus als
  // Teilzeichenkette.
  await page.getByRole('button', { name: '5 Minuten', exact: true }).click()
  await startButton(page).click()
  await page.locator('.settle').click()

  const lesson = page.locator('.lesson')
  await expect(lesson).toBeVisible({ timeout: 30_000 })
  await expect(lesson.getByText('Der Gedächtnispalast')).toBeVisible()
  // Der Satz, auf den es ankommt: Das Bild baut der Nutzer (D-017).
  await expect(lesson.getByText(/Das Bild musst du bauen, nicht lesen/)).toBeVisible()

  // Bewusst weiter, und der Gang steht da.
  await lesson.getByRole('button', { name: 'Weiter ins Training' }).click()
  await expect(page.locator('.walk')).toBeVisible({ timeout: 30_000 })

  // Die erste Einheit sauber verwerfen, bevor die zweite beginnt. Ein Reload
  // mitten in derselben Einheit muss den aktiven Block absichtlich wieder
  // aufnehmen (B5) und wäre deshalb kein Test für „einmal erklärt“.
  await page.getByRole('button', { name: 'Abbrechen' }).click()
  await expect(startButton(page)).toBeVisible()

  // Zweite echte Einheit: keine Palastlektion mehr. Welches Trainingsmodul
  // danach zuerst kommt, entscheidet der Planer und ist kein Vertrag dieses
  // Tests; die Session selbst muss nur angelaufen sein.
  await visit(page)
  await page.getByRole('button', { name: '5 Minuten', exact: true }).click()
  await startButton(page).click()
  await page.locator('.settle').click()
  await expect(page.locator('.session-phase')).toBeVisible({ timeout: 30_000 })
  await expect(page.locator('.lesson').getByText('Der Gedächtnispalast')).toHaveCount(0)
})

test('legt fünf Dinge auf einen Weg und geht ihn danach ab', async ({ page }) => {
  test.setTimeout(360_000)

  expect(await startWalk(page), 'in sechzig Anläufen kam kein Gang').toBe(true)

  // Der Weg steht als Ganzes da — mit seinem Palast darüber.
  const lead = ((await page.locator('.scene-person').textContent()) ?? '').trim()
  expect(lead).toMatch(/Dein Weg:/)

  const stations = await page.locator('.walk-station').allTextContents()
  const objects = await page.locator('.scene-facts dd').allTextContents()
  expect(stations).toHaveLength(5)
  expect(objects).toHaveLength(5)

  /*
   * Die Nummern sind nicht Zierde: Die feste Reihenfolge ist die halbe
   * Technik, und sie muss sichtbar sein.
   */
  expect(await page.locator('.walk-step').allTextContents()).toEqual(['1', '2', '3', '4', '5'])

  // Kein Ding liegt zweimal auf demselben Weg — sonst wäre „wo lag es?“ nicht
  // zu beantworten.
  expect(new Set(objects).size).toBe(5)

  const learned = await collectItems(page)
  expect(learned.scene?.size).toBe(5)

  /*
   * Und jetzt das Abgehen (G6). Gefragt wird nicht „nenne alles“, sondern
   * Station für Station — der Ort steht auf dem Schild, die Frage darüber ist
   * jedes Mal dieselbe.
   */
  await page.locator('.prompted').first().waitFor({ timeout: 60_000 })
  await expect(page.locator('.placemark-station')).toBeVisible()
  await expect(page.locator('.prompted .hint').first()).toContainText('Was lag hier?')
  const where = ((await page.locator('.placemark-station').textContent()) ?? '').trim()
  expect(stations).toContain(where)

  await answerRecall(page, learned, 'all')

  /*
   * Hier endet die Prüfung, und zwar bewusst vor der Zusammenfassung: In der
   * Drei-Minuten-Einheit folgt noch eine zweite Runde, deren Modul der Plan
   * bestimmt. Die Zusammenfassung zählte dann Stücke aus beiden Runden — eine
   * feste Zahl zu erwarten hieße wieder, das nächste Modul vorherzusagen.
   * **Dass ehrlich gezählt wird, steht in `session.spec.ts`**; hier geht es um
   * den Weg und sein Abgehen.
   */
  await expect(page.locator('.placemark-station')).toHaveCount(0)
  await page.getByRole('button', { name: 'Abbrechen' }).click()
  await expect(startButton(page)).toBeVisible()
})

test('lässt einen eigenen Weg anlegen und benutzt ihn (G3)', async ({ page }) => {
  test.setTimeout(360_000)

  /*
   * Der Punkt der ganzen Technik: Ein Palast, den man selbst kennt, trägt
   * deutlich besser als ein geratener. Bis hierher waren die drei
   * mitgelieferten Wege eine Krücke — und die App hat sie auch so genannt.
   */
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await openPage(page, 'Der Gedächtnispalast')

  const own = ['Wohnungstür', 'Bad', 'Balkon', 'Bücherregal', 'Nachttisch']
  await page.getByLabel('Wie heißt der Weg?').fill('Meine Bude')
  for (const [index, label] of own.entries()) {
    await page.getByLabel(`Station ${index + 1}`).fill(label)
  }

  const save = page.getByRole('button', { name: 'Weg merken' })
  await expect(save).toBeEnabled()
  await save.click()
  await expect(page.getByText(/Er kommt ab jetzt im Training vor/)).toBeVisible()

  // Er bleibt liegen — er steht in denselben Einstellungen wie der Lernstand
  // und wandert damit auch in die Sicherung (N2).
  await page.reload()
  await openPage(page, 'Der Gedächtnispalast')
  await expect(page.getByLabel('Station 3')).toHaveValue('Balkon')

  /*
   * Und jetzt das Entscheidende: **das eigene Schild beim Abgehen.**
   *
   * Statt zu würfeln, bis der Plan einen eigenen Gang zieht, wird einer
   * fällig gemacht. Ein Wiedersehensblock entsteht für jedes Modul, für das
   * etwas ansteht — der Weg dorthin ist damit derselbe wie im echten Betrieb,
   * nur ohne die zwei Wochen Wartezeit.
   */
  await page.evaluate(async () => {
    const open = indexedDB.open('anitew')
    const database: IDBDatabase = await new Promise((resolve, reject) => {
      open.onsuccess = () => resolve(open.result)
      open.onerror = () => reject(open.error)
    })
    await new Promise<void>((resolve, reject) => {
      const request = database
        .transaction('itemStates', 'readwrite')
        .objectStore('itemStates')
        .put({
          itemId: 'palace:de:own~5#own3',
          moduleId: 'palace',
          language: 'de',
          createdAt: 1,
          lastSeenAt: 1,
          reviews: 1,
          lapses: 0,
          stability: 1,
          difficulty: 5,
          fsrsState: 2,
          dueDay: '2000-01-01',
        })
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  })

  await visit(page)
  await page.getByRole('button', { name: '60 Sekunden' }).click()
  await startButton(page).click()
  await page.locator('.settle').click()

  /*
   * Vor dem Wiedersehen steht noch die Lernrunde — welches Modul, entscheidet
   * der Plan. Der Test geht deshalb durch, bis der Vorspann „Und von früher“
   * dasteht: Das ist die einzige Stelle, an der sich ein Wiedersehen sicher
   * erkennen lässt. Ein früherer Anlauf nahm das erste Schild für das
   * gesuchte und traf „Wohnungstür“ statt „Balkon“ — ein *neuer* Gang durch
   * denselben eigenen Palast.
   */
  const lead = page.getByText(/Und von früher/)
  for (let step = 0; step < 24; step++) {
    if ((await lead.count()) > 0) break
    const prompted = page.locator('.prompted-input')
    const free = page.locator('.recall-input')
    if ((await prompted.count()) > 0 || (await free.count()) > 0) {
      await page.getByRole('button', { name: 'Fertig' }).first().click()
    } else {
      await page.waitForTimeout(400)
    }
  }
  await expect(lead).toBeVisible({ timeout: 60_000 })

  // Das dritte Schild trägt, was der Nutzer geschrieben hat — nicht „Küche“.
  await expect(page.locator('.placemark-station')).toHaveText('Balkon')
  await expect(page.locator('.placemark-palace')).toHaveText('Meine Bude')
  await expect(page.locator('.prompted .hint').first()).toContainText('Was lag hier?')
})

test('nimmt keinen halben Weg an', async ({ page }) => {
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await openPage(page, 'Der Gedächtnispalast')

  await page.getByLabel('Wie heißt der Weg?').fill('Halb')
  await page.getByLabel('Station 1').fill('Bad')
  // Zweimal derselbe Ort: „Was lag hier?“ hätte zwei Antworten.
  await page.getByLabel('Station 2').fill('Bad')

  await expect(page.getByRole('button', { name: 'Weg merken' })).toBeDisabled()
  await expect(page.getByText(/Fünf Orte, alle verschieden, keiner leer/)).toBeVisible()
})
