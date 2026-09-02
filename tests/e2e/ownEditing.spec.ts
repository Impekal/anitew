/**
 * Eigenes berichtigen, ohne den Wiederholungsverlauf zu verlieren
 * (Nutzerwunsch 02.09.).
 *
 *   „Man kann den Begriff löschen — aber vielleicht hat man ihn auch nur
 *    falsch geschrieben und möchte das korrigieren. Gilt auch für
 *    connections."
 *
 * Der Anspruch, um den es hier geht, ist nicht der Knopf, sondern was er
 * mitnimmt: Die Kennung einer eigenen Karte ist `frage ⟂ antwort`, die eines
 * Begriffs kommt aus seinem Namen. Jede Änderung ergibt also eine **andere**
 * Kennung — und an der alten hängen Wiederholungen, Stabilität und Termin.
 *
 * Geprüft wird deshalb in der Datenbank, nicht am Bildschirm: Steht der
 * Termin nach dem Berichtigen unter der neuen Kennung, und stehen seine
 * Zahlen unverändert darin?
 */

import { expect, test, type Page } from '@playwright/test'

import { openPage, visit } from './helpers.ts'

/** `OWN_SEPARATOR` aus `core/content/own.ts`. */
const SEP = ''

interface Termin {
  itemId: string
  reviews: number
  stability?: number
}

async function termine(page: Page): Promise<Termin[]> {
  return page.evaluate(
    () =>
      new Promise<Termin[]>((resolve, reject) => {
        const open = indexedDB.open('anitew')
        open.onerror = () => reject(open.error)
        open.onsuccess = () => {
          const tx = open.result.transaction(['itemStates'], 'readonly')
          const all = tx.objectStore('itemStates').getAll()
          all.onsuccess = () => resolve(all.result as Termin[])
          all.onerror = () => reject(all.error)
        }
      }),
  )
}

test('berichtigt ein eigenes Paar und nimmt seinen Termin mit', async ({ page }) => {
  test.setTimeout(120_000)
  await visit(page)

  // Eine Karte mit Geschichte: acht Wiederholungen, echte FSRS-Werte.
  await page.evaluate(
    ({ sep }) =>
      new Promise<void>((resolve, reject) => {
        const open = indexedDB.open('anitew')
        open.onerror = () => reject(open.error)
        open.onsuccess = () => {
          const tx = open.result.transaction(['settings', 'itemStates'], 'readwrite')
          tx.objectStore('settings').put({
            key: 'own.facts.de',
            value: [{ prompt: 'Hauptstadt von Peru', answer: 'Limaa' }],
          })
          tx.objectStore('itemStates').put({
            itemId: `facts:de:Hauptstadt von Peru${sep}Limaa`,
            moduleId: 'facts',
            language: 'de',
            createdAt: Date.now() - 30 * 86_400_000,
            reviews: 8,
            lapses: 1,
            stability: 12.5,
            difficulty: 5.5,
          })
          tx.oncomplete = () => resolve()
          tx.onerror = () => reject(tx.error)
        }
      }),
    { sep: SEP },
  )
  await page.reload()
  await openPage(page, 'Eigene Inhalte')

  /*
   * Die Karte über ihre Stelle greifen, nicht über ihren Text.
   *
   * Sobald das Formular aufgeht, steht die Frage im **Wert** eines
   * Eingabefelds und nicht mehr im Text — ein `hasText`-Filter fände die
   * Karte dann nicht mehr wieder. Es gibt hier genau eine.
   */
  const karte = page.locator('.own-card').first()
  await expect(karte).toContainText('Hauptstadt von Peru', { timeout: 30_000 })
  await karte.getByRole('button', { name: 'Ändern' }).click()

  // Nur der Tippfehler in der Antwort.
  await karte.getByLabel('Antwort').fill('Lima')
  await karte.getByRole('button', { name: 'Übernehmen' }).click()

  await expect(page.locator('.own-card').filter({ hasText: 'Lima' })).toBeVisible({
    timeout: 30_000,
  })

  await expect
    .poll(async () => (await termine(page)).map((termin) => termin.itemId).sort(), {
      timeout: 30_000,
    })
    .toEqual([`facts:de:Hauptstadt von Peru${SEP}Lima`])

  const [termin] = await termine(page)
  // Der ganze Punkt: Die Wochen dahinter sind mitgekommen.
  expect(termin?.reviews, 'die Wiederholungen sind verloren gegangen').toBe(8)
  expect(termin?.stability).toBe(12.5)
})

test('benennt einen Begriff um und laesst seine Verbindung stehen', async ({ page }) => {
  test.setTimeout(120_000)
  await visit(page)

  await page.evaluate(
    () =>
      new Promise<void>((resolve, reject) => {
        const now = Date.now()
        const open = indexedDB.open('anitew')
        open.onerror = () => reject(open.error)
        open.onsuccess = () => {
          const tx = open.result.transaction(['settings'], 'readwrite')
          tx.objectStore('settings').put({
            key: 'memory.graph',
            value: {
              nodes: [
                {
                  id: 'person:danile',
                  type: 'person',
                  label: 'Danile',
                  createdAt: now,
                  strength: 0.4,
                },
                {
                  id: 'place:madrid',
                  type: 'place',
                  label: 'Madrid',
                  createdAt: now,
                  strength: 0.5,
                },
              ],
              edges: [
                {
                  id: 'person:danile→place:madrid:association',
                  from: 'person:danile',
                  to: 'place:madrid',
                  relation: 'association',
                  createdAt: now,
                },
              ],
              removed: {},
            },
          })
          tx.oncomplete = () => resolve()
          tx.onerror = () => reject(tx.error)
        }
      }),
  )
  await page.reload()
  await openPage(page, 'Mein Gedächtnis')

  await page.locator('.constellation-memory').first().click()
  const detail = page.locator('.memory-detail')
  await expect(detail).toBeVisible({ timeout: 30_000 })

  await detail.getByRole('button', { name: 'Ändern' }).click()
  await detail.getByLabel('Name').fill('Daniel')
  await detail.getByRole('button', { name: 'Übernehmen' }).click()

  await expect(detail.getByRole('heading', { name: 'Daniel' })).toBeVisible({ timeout: 30_000 })
  // Die Verbindung zeigt weiter auf Madrid — sie ist mit umgezogen.
  await expect(detail.locator('.memory-link-name')).toHaveText('Madrid')
})

test('nimmt eine einzelne Verbindung weg, ohne den Begriff zu opfern', async ({ page }) => {
  test.setTimeout(120_000)
  await visit(page)

  await page.evaluate(
    () =>
      new Promise<void>((resolve, reject) => {
        const now = Date.now()
        const open = indexedDB.open('anitew')
        open.onerror = () => reject(open.error)
        open.onsuccess = () => {
          const tx = open.result.transaction(['settings'], 'readwrite')
          tx.objectStore('settings').put({
            key: 'memory.graph',
            value: {
              nodes: [
                {
                  id: 'person:daniel',
                  type: 'person',
                  label: 'Daniel',
                  createdAt: now,
                  strength: 0.4,
                },
                {
                  id: 'place:madrid',
                  type: 'place',
                  label: 'Madrid',
                  createdAt: now,
                  strength: 0.5,
                },
              ],
              edges: [
                {
                  id: 'person:daniel→place:madrid:association',
                  from: 'person:daniel',
                  to: 'place:madrid',
                  relation: 'association',
                  createdAt: now,
                },
              ],
              removed: {},
            },
          })
          tx.oncomplete = () => resolve()
          tx.onerror = () => reject(tx.error)
        }
      }),
  )
  await page.reload()
  await openPage(page, 'Mein Gedächtnis')

  await page.locator('.constellation-memory').first().click()
  const detail = page.locator('.memory-detail')
  await expect(detail.locator('.memory-links li')).toHaveCount(1, { timeout: 30_000 })

  await detail.getByRole('button', { name: /Verbindung entfernen/ }).click()

  await expect(detail.locator('.memory-links li')).toHaveCount(0)
  // Beide Begriffe stehen noch — nur die Linie ist weg.
  await expect(page.locator('.memory-list li')).not.toHaveCount(0)
})

/**
 * Eine berichtigte Frage darf nicht in einen alten Grabstein laufen.
 *
 * Wer eine Frage wegwirft, hinterlässt einen Grabstein — sonst brächte sie
 * das zweite Gerät beim nächsten Abgleich zurück. `addOwnFacts` löst ihn
 * wieder auf, wenn jemand dieselbe Frage erneut einträgt: „Wer eine
 * weggeworfene Frage erneut einträgt, will sie wiederhaben."
 *
 * Genau dasselbe gilt fürs Berichtigen — und stand beim ersten Anlauf nicht
 * da. Die Karte wäre nach dem Übernehmen still verschwunden: gespeichert,
 * aber vom Merkzettel sofort wieder weggefiltert. Der schlimmste Ausgang von
 * allen, denn er sieht aus wie ein Datenverlust.
 */
test('berichtigt auf eine frueher weggeworfene Frage, ohne die Karte zu verlieren', async ({
  page,
}) => {
  test.setTimeout(120_000)
  await visit(page)

  await page.evaluate(
    () =>
      new Promise<void>((resolve, reject) => {
        const open = indexedDB.open('anitew')
        open.onerror = () => reject(open.error)
        open.onsuccess = () => {
          const tx = open.result.transaction(['settings'], 'readwrite')
          tx.objectStore('settings').put({
            key: 'own.facts.de',
            value: [{ prompt: 'Hauptstadt Peru', answer: 'Lima' }],
          })
          // „Hauptstadt von Peru" wurde vor einer Woche weggeworfen.
          tx.objectStore('settings').put({
            key: 'own.facts.removed.de',
            value: { 'Hauptstadt von Peru': Date.now() - 7 * 86_400_000 },
          })
          tx.oncomplete = () => resolve()
          tx.onerror = () => reject(tx.error)
        }
      }),
  )
  await page.reload()
  await openPage(page, 'Eigene Inhalte')

  const karte = page.locator('.own-card').first()
  await expect(karte).toContainText('Hauptstadt Peru', { timeout: 30_000 })
  await karte.getByRole('button', { name: 'Ändern' }).click()
  await karte.getByLabel('Frage').fill('Hauptstadt von Peru')
  await karte.getByRole('button', { name: 'Übernehmen' }).click()

  await expect(
    page.locator('.own-card').filter({ hasText: 'Hauptstadt von Peru' }),
    'die berichtigte Karte ist in einem alten Grabstein verschwunden',
  ).toBeVisible({ timeout: 30_000 })

  // Und sie überlebt das Neuladen — der Merkzettel greift beim Laden.
  await page.reload()
  await openPage(page, 'Eigene Inhalte')
  await expect(page.locator('.own-card').filter({ hasText: 'Hauptstadt von Peru' })).toBeVisible({
    timeout: 30_000,
  })
})
