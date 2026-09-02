/**
 * Die Konstellation soll leben und die Wahrheit sagen (Gerätebefund 02.09.).
 *
 * Wörtlich gemeldet, mit Bild:
 *
 *   „Nicht besonders elegant oder? Keine Verbindungslinien, neuronal oder so
 *    + die Punkte bewegen sich nicht mehr."
 *
 * Drei getrennte Ursachen, alle gemessen:
 *
 * 1. **Die Bewegung lief, war aber unsichtbar.** `node-drift` lenkte um 0,5
 *    Zeicheneinheiten aus; das Band ist 100 Einheiten breit und wird am
 *    Telefon 388 Pixel breit gezeichnet — 1,9 Pixel. Vorher wirkte es größer,
 *    weil ohne `transform-box` um den Ursprung der *Zeichenfläche* skaliert
 *    wurde und jeder Punkt weit geschoben wurde. Der Fehler war behoben, die
 *    sichtbare Bewegung damit mit.
 *
 * 2. **Die Namen überschrieben einander.** Ohne eine einzige Verbindung ist
 *    jede Erinnerung ihr eigener Cluster, jede damit Anker, jede trägt ihren
 *    Namen — und der Cluster-Kranz drängt sie in die Mitte.
 *
 * 3. **Es gab null Linien, weil es null Verbindungen gab.** Kanten entstanden
 *    bisher nur beim Merken eines ganzen Satzes. Wer einzelne Begriffe merkt,
 *    hatte keinen Weg, sie zu verbinden.
 *
 * Geprüft wird deshalb, was auf dem Glas ankommt: gemessene Pixel, gemessene
 * Rechtecke, eine gezeichnete Linie.
 */

import { expect, test, type Page } from '@playwright/test'

import { openPage, visit } from './helpers.ts'

const NAMEN = [
  'Eva',
  'Lücke',
  'Lois',
  'Daniel Morrat',
  'Alassane anrufen',
  'Fils Le grand Senegal',
  'Ticket Bayreuth',
] as const

/** Sieben Erinnerungen, keine einzige Verbindung — der gemeldete Stand. */
async function saeeUnverbundenes(page: Page): Promise<void> {
  await page.evaluate(
    ({ namen }) =>
      new Promise<void>((resolve, reject) => {
        const now = Date.now()
        const open = indexedDB.open('anitew')
        open.onerror = () => reject(open.error)
        open.onsuccess = () => {
          const tx = open.result.transaction(['settings'], 'readwrite')
          tx.objectStore('settings').put({
            key: 'memory.graph',
            value: {
              nodes: namen.map((label, i) => ({
                id: `fact:${label.toLocaleLowerCase().replace(/\s+/gu, '-')}`,
                type: 'fact',
                label,
                createdAt: now - i * 3_600_000,
                strength: 0.2 + i * 0.08,
              })),
              edges: [],
              removed: {},
            },
          })
          tx.objectStore('settings').put({ key: 'memory.visited', value: true })
          tx.oncomplete = () => resolve()
          tx.onerror = () => reject(tx.error)
        }
      }),
    { namen: [...NAMEN] },
  )
  await page.reload()
}

test('bewegt die Punkte sichtbar, nicht nur messbar', async ({ page }) => {
  test.setTimeout(120_000)
  await visit(page)
  await saeeUnverbundenes(page)
  await expect(page.locator('.constellation-label').first()).toBeVisible({ timeout: 30_000 })

  /*
   * Gemessen wird die **Mitte** des Punktes zu zwei bekannten Zeitpunkten
   * seiner eigenen Animation. Über die Web-Animations-Schnittstelle ist das
   * exakt statt abgewartet — und die Mitte verschiebt sich nur durch das
   * Verschieben, nicht durch das Skalieren.
   */
  const weg = await page.evaluate(() => {
    const punkt = document.querySelector('.constellation .constellation-node')
    if (punkt === null) return -1
    const lauf = punkt.getAnimations()[0]
    if (lauf === undefined) return -2
    const dauer = Number((lauf.effect as KeyframeEffect).getTiming().duration ?? 0)
    if (dauer === 0) return -3
    lauf.pause()
    const mitte = () => {
      const r = punkt.getBoundingClientRect()
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
    }
    lauf.currentTime = 0
    const a = mitte()
    lauf.currentTime = dauer * 0.3
    const b = mitte()
    return Math.hypot(b.x - a.x, b.y - a.y)
  })

  expect(
    weg,
    `der Punkt bewegt sich um ${weg.toFixed(2)} Pixel — unter der Wahrnehmungsschwelle`,
  ).toBeGreaterThan(4)
})

test('laesst die Namen im Band einander nicht ueberschreiben', async ({ page }) => {
  test.setTimeout(120_000)
  await visit(page)
  await saeeUnverbundenes(page)
  await expect(page.locator('.constellation-label').first()).toBeVisible({ timeout: 30_000 })

  const ueberlappungen = await page.evaluate(() => {
    const kaesten = [...document.querySelectorAll('.constellation .constellation-label')].map((n) =>
      n.getBoundingClientRect(),
    )
    const treffer: string[] = []
    for (let i = 0; i < kaesten.length; i += 1) {
      for (let j = i + 1; j < kaesten.length; j += 1) {
        const a = kaesten[i]
        const b = kaesten[j]
        if (a === undefined || b === undefined) continue
        // Ein Pixel Luft: Berührung ist keine Überschreibung.
        if (a.right - 1 > b.left && b.right - 1 > a.left && a.bottom - 1 > b.top && b.bottom - 1 > a.top) {
          treffer.push(`${i}×${j}`)
        }
      }
    }
    return treffer
  })

  expect(
    ueberlappungen,
    `Namen liegen übereinander: ${ueberlappungen.join(', ')}`,
  ).toEqual([])
})

test('schneidet keinen Namen am Rand ab', async ({ page }) => {
  test.setTimeout(120_000)
  await visit(page)
  await saeeUnverbundenes(page)
  await expect(page.locator('.constellation-label').first()).toBeVisible({ timeout: 30_000 })

  /*
   * Der zweite Fehler derselben Rechnung, und er sah schlimmer aus als das
   * Überschreiben: Der äußerste Name lag gemessen bei x = 8 Pixeln, während
   * der Kasten bei 12 beginnt. `overflow: hidden` nahm den Rest — auf dem
   * Bild stand „…yreuth" statt „Ticket Bayreuth".
   *
   * Die Überlappungsprüfung darüber fand das **nicht**: Zwei Namen, von denen
   * einer halb weggeschnitten ist, überschreiben einander ja gerade nicht.
   * Deshalb steht diese Messung eigenständig da.
   *
   * Verlangt werden **zwei Pixel Luft**, nicht nur „gerade eben drin". Das ist
   * der eigentliche Befund: Die Rechnung ging auf den Millimeter auf — der
   * äußerste Name endete genau auf der Kante —, und je nach Lauf lag er
   * einmal einen Pixel innerhalb und einmal vier Pixel außerhalb. Ein Wächter,
   * der nur „innerhalb" verlangt, hätte diesen Zustand durchgewinkt und wäre
   * eines Tages ohne erkennbaren Grund rot geworden.
   */
  const LUFT = 2
  const draussen = await page.evaluate((luft) => {
    const kasten = document.querySelector('.constellation')?.getBoundingClientRect()
    if (kasten === undefined) return ['keine Konstellation gefunden']
    return [...document.querySelectorAll('.constellation .constellation-label')]
      .map((n) => ({ text: n.textContent ?? '', r: n.getBoundingClientRect() }))
      .filter(({ r }) => r.left < kasten.left + luft || r.right > kasten.right - luft)
      .map(({ text, r }) => `${text} x[${r.left.toFixed(0)}..${r.right.toFixed(0)}] gegen [${kasten.left.toFixed(0)}..${kasten.right.toFixed(0)}]`)
  }, LUFT)

  expect(draussen, `Namen stehen ohne Luft am Rand: ${draussen.join('; ')}`).toEqual([])
})

test('haelt Namen auch dann sauber, wenn Erinnerungen verbunden sind', async ({ page }) => {
  test.setTimeout(120_000)
  await visit(page)
  await saeeUnverbundenes(page)

  /*
   * Der Rückfall, der beim ersten Anlauf durchrutschte: Die Zeilen galten nur
   * für den **unverbundenen** Stand. Kaum stand eine Verbindung, kam der alte
   * Cluster-Kranz zurück — mit Überlappung und abgeschnittenen Namen. Und
   * Verbindungen entstehen jetzt laufend, seit man sie von Hand knüpfen kann.
   */
  await page.evaluate(
    () =>
      new Promise<void>((resolve, reject) => {
        const open = indexedDB.open('anitew')
        open.onerror = () => reject(open.error)
        open.onsuccess = () => {
          const tx = open.result.transaction(['settings'], 'readwrite')
          const laden = tx.objectStore('settings').get('memory.graph')
          laden.onsuccess = () => {
            const graph = laden.result.value as {
              nodes: { id: string }[]
              edges: unknown[]
            }
            const [eins, zwei] = graph.nodes
            if (eins === undefined || zwei === undefined) return
            graph.edges = [
              {
                id: `${eins.id}→${zwei.id}:association`,
                from: eins.id,
                to: zwei.id,
                relation: 'association',
                createdAt: Date.now(),
              },
            ]
            tx.objectStore('settings').put({ key: 'memory.graph', value: graph })
          }
          tx.oncomplete = () => resolve()
          tx.onerror = () => reject(tx.error)
        }
      }),
  )
  await page.reload()
  await expect(page.locator('.constellation-label').first()).toBeVisible({ timeout: 30_000 })

  const befund = await page.evaluate(() => {
    const kasten = document.querySelector('.constellation')?.getBoundingClientRect()
    if (kasten === undefined) return { linien: 0, draussen: ['keine Konstellation'], ueber: [] as string[] }
    const kaesten = [...document.querySelectorAll('.constellation .constellation-label')].map((n) => ({
      text: n.textContent ?? '',
      r: n.getBoundingClientRect(),
    }))
    const ueber: string[] = []
    for (let i = 0; i < kaesten.length; i += 1) {
      for (let j = i + 1; j < kaesten.length; j += 1) {
        const a = kaesten[i]!.r
        const b = kaesten[j]!.r
        if (a.right - 1 > b.left && b.right - 1 > a.left && a.bottom - 1 > b.top && b.bottom - 1 > a.top) {
          ueber.push(`${kaesten[i]!.text} × ${kaesten[j]!.text}`)
        }
      }
    }
    return {
      linien: document.querySelectorAll('.constellation .constellation-edge').length,
      draussen: kaesten
        .filter(({ r }) => r.left < kasten.left + 2 || r.right > kasten.right - 2)
        .map(({ text }) => text),
      ueber,
    }
  })

  expect(befund.linien, 'die echte Verbindung wird nicht gezeichnet').toBe(1)
  expect(befund.ueber, `Namen liegen übereinander: ${befund.ueber.join(', ')}`).toEqual([])
  expect(befund.draussen, `Namen ohne Luft am Rand: ${befund.draussen.join(', ')}`).toEqual([])
})

test('verbindet zwei Erinnerungen von Hand — und zieht die Linie', async ({ page }) => {
  test.setTimeout(120_000)
  await visit(page)
  await saeeUnverbundenes(page)
  await openPage(page, 'Mein Gedächtnis')

  // Vorher: kein einziger Strich, weil es keine einzige Verbindung gibt.
  await expect(page.locator('.memoryzone .constellation-edge')).toHaveCount(0, { timeout: 30_000 })

  await page.locator('.constellation-memory').first().click()
  const detail = page.locator('.memory-detail')
  await expect(detail).toBeVisible({ timeout: 30_000 })

  await detail.getByLabel('Womit?').selectOption({ label: 'Lois' })
  await detail.getByRole('button', { name: 'Verbinden' }).click()

  // Die Verbindung steht in der Liste …
  await expect(detail.locator('.memory-link-name')).toHaveText(['Lois'], { timeout: 30_000 })
  // … und als gezeichnete Linie im Himmel.
  await expect(page.locator('.memoryzone .constellation-edge')).toHaveCount(1)

  // Und sie überlebt das Neuladen — sie steht in der Datenbank, nicht im Bild.
  await page.reload()
  await openPage(page, 'Mein Gedächtnis')
  await expect(page.locator('.memoryzone .constellation-edge')).toHaveCount(1, { timeout: 30_000 })
})
