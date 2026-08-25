import { expect, test, type Page } from '@playwright/test'

import { pollFirstModule, startButton, visit } from './helpers.ts'

/**
 * Memory Missions, im Browser nachgeprüft (Backlog H1, H2, H4).
 *
 * Eine Mission ist eine **Szene**, keine Liste: Person, Nummer, Gegenstand mit
 * Lage, Uhrzeit, Ort — und sie gehören zusammen. Geprüft wird genau
 * das, worauf es dabei ankommt und was in keinem anderen Modul vorkommt:
 *
 * 1. Die Szene steht **auf einmal** da, nicht Stück für Stück.
 * 2. Gefragt wird mit **Anker**.
 * 3. Gegenstand und Lage werden zusammen eingeprägt, aber getrennt abgefragt.
 * 4. Gezählt wird die richtige Antwort, und die Strenge hängt an der
 *    einzelnen Tatsache.
 *
 * H4 erweitert den historischen Hotel-Kontext um Konferenz und Coworking.
 * Die stabilen Fact-Kinds bleiben absichtlich gleich; die sichtbare UI darf
 * daraus aber keine Hotelbedeutung ableiten. Deshalb heißen die gemeinsamen
 * Felder weltneutral Nummer, Zeit und Ort.
 *
 * Der Notfallmodus reicht dafür: Eine Runde ist eine Szene.
 */

/** Startet neu, bis der Plan das Missionsmodul zieht. */
async function startMission(page: Page): Promise<boolean> {
  for (let attempt = 0; attempt < 60; attempt++) {
    await visit(page)
    await page.getByRole('button', { name: '60 Sekunden' }).click()
    await startButton(page).click()
    await page.locator('.settle').click()
    if ((await pollFirstModule(page)) === 'missions') {
      await page.locator('.scene').first().waitFor({ timeout: 30_000 })
      return true
    }
    await page.evaluate(() => indexedDB.deleteDatabase('anitew'))
  }
  return false
}

test('zeigt die Szene als Ganzes und fragt sie mit weltneutraler Semantik ab', async ({ page }) => {
  test.setTimeout(360_000)

  expect(await startMission(page), 'in sechzig Anläufen kam keine Mission').toBe(true)

  const person = ((await page.locator('.scene-person').textContent()) ?? '').trim()
  expect(person.length).toBeGreaterThan(1)
  const labels = await page.locator('.scene-facts dt').allTextContents()
  const values = await page.locator('.scene-facts dd').allTextContents()
  expect(values).toHaveLength(4)

  const scene = new Map(
    labels.map((label, index) => [label.trim(), (values[index] ?? '').trim()]),
  )
  const number = scene.get('Nummer') as string
  const time = scene.get('Zeit') as string
  const combinedObject = scene.get('Dabei') as string
  const place = scene.get('Ort') as string
  const [object = '', location = ''] = combinedObject.split(' · ')

  // Hotel bleibt im Kern separat dreistellig regressionsgeprüft; zusätzliche
  // H4-Welten verwenden positive Nummern, die ein- bis dreistellig sein dürfen.
  expect(number).toMatch(/^[1-9][0-9]{0,2}$/)
  expect(time).toMatch(/^(0[6-9]|1[0-9]|2[0-3]):[0-5][05]$/)
  expect(object.split(' ')).toHaveLength(2)
  expect(location.length).toBeGreaterThan(5)
  expect(combinedObject).toBe(`${object} · ${location}`)
  expect(place.length).toBeGreaterThan(2)

  await expect(page.locator('.scene .face')).toBeVisible()

  await page.locator('.prompted-input').waitFor({ timeout: 40_000 })

  await expect(page.locator('.prompted-anchor')).toHaveText(person)
  await expect(page.getByText('Welche Nummer?')).toBeVisible()
  await expect(page.locator('.prompted .hint').last()).toHaveText('1 / 5')

  /*
   * Fünf Antworten. Die Nummer ist absichtlich falsch, der Gegenstand trägt
   * nur einen Tippfehler und muss deshalb zählen. Lage, Uhrzeit und Ort sind
   * richtig. Erwartet werden also vier von fünf.
   */
  const answerTo = new Map([
    ['Welche Nummer?', swapDigits(number)],
    ['Was hatte sie oder er dabei?', typo(object)],
    ['Wo lag der Gegenstand?', location],
    ['Wann war es?', time],
    ['Wie hieß der Ort?', place],
  ])

  for (let step = 0; step < 5; step++) {
    const input = page.locator('.prompted-input')
    await input.waitFor({ timeout: 30_000 })
    const question = ((await page.locator('.prompted .hint').first().textContent()) ?? '').trim()
    const answer = answerTo.get(question)
    expect(answer, `unbekannte Frage: „${question}“`).toBeDefined()
    await input.fill(answer as string)
    await page.getByRole('button', { name: 'Fertig' }).click()
  }

  await expect(page.getByRole('heading', { name: 'Geblieben' })).toBeVisible({ timeout: 30_000 })
  await expect(page.locator('.summary-score strong')).toHaveText('4')
  await expect(page.locator('.summary-score span')).toHaveText('/ 5')

  const chips = await page.locator('.summary-words .chip').allTextContents()
  expect(chips.join(' ')).not.toContain('#')
  expect(chips.some((chip) => chip.includes(person))).toBe(true)
})

/** Verändert die letzte Ziffer sicher — dieselbe Form, andere Nummer. */
function swapDigits(value: string): string {
  const last = value.slice(-1)
  return value.slice(0, -1) + String((Number(last) + 1) % 10)
}

/** Die letzten beiden Buchstaben vertauscht — ein Tippfehler, kein anderes Wort. */
function typo(value: string): string {
  const [a, b] = [value.slice(-2, -1), value.slice(-1)]
  return value.slice(0, -2) + b + a
}
