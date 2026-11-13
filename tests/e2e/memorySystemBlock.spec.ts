/**
 * „Dein Gedächtnissystem" auf der Startseite (Gerätebefund 02.09.).
 *
 * Gemeldet wurde:
 *
 *   „Ton système de mémoire (mit den Begriffen) ist da ziemlich klein, kaum
 *    leserlich. Geht es größer? + das sollte am besten anklickbar sein, dann
 *    landet man in ‚Ma mémoire‘ wie auch über Core."
 *
 * Gemessen auf einem Telefon (404 × 177 Pixel Karte), bevor etwas geändert
 * wurde: Die Beschriftungen wurden mit **3,88 Pixeln** gezeichnet, und der
 * Block war kein Knopf.
 *
 * Die Ursache war die Geometrie, nicht die Schrift: Die Zeichenfläche trug
 * 100 × 100 Koordinaten in einer Karte im Verhältnis 16:7. Ein SVG passt
 * seinen Inhalt vollständig ein, hier also auf die Höhe — Maßstab 1,765, und
 * über die halbe Breite blieb leer.
 *
 * ── Warum hier Pixel stehen und keine CSS-Regel ───────────────────────────
 *
 * Weil der Mensch Pixel sieht. Eine Prüfung auf `font-size: 3.2px` wäre
 * grün, während die Schrift durch den Maßstab wieder auf vier Pixel
 * schrumpft — genau das war der Fehler. Gemessen wird deshalb, was auf dem
 * Glas ankommt: Schriftgröße mal Maßstab der Zeichenfläche.
 */

import { expect, test, type Page } from '@playwright/test'

import { visit } from './helpers.ts'

/** Die kleinste Größe, die auf einem Telefon noch als Wort lesbar ist. */
const LESBAR_AB = 10

async function seedSystem(page: Page) {
  await page.evaluate(
    () =>
      new Promise<void>((resolve, reject) => {
        const now = Date.now()
        const open = indexedDB.open('anitew')
        open.onerror = () => reject(open.error)
        open.onsuccess = () => {
          const db = open.result
          const tx = db.transaction(['settings'], 'readwrite')
          const nodes = ['Daniel', 'Madrid', 'Schlüssel', 'Anna'].map((label, index) => ({
            id: `thing:${label.toLocaleLowerCase()}`,
            type: 'thing',
            label,
            createdAt: now - index * 1000,
            strength: 0.2 + index * 0.15,
          }))
          tx.objectStore('settings').put({
            key: 'memory.graph',
            value: {
              nodes,
              edges: nodes.slice(1).map((node) => ({
                id: `${nodes[0]?.id}→${node.id}:association`,
                from: nodes[0]?.id,
                to: node.id,
                relation: 'association',
                createdAt: now,
              })),
              removed: {},
            },
          })
          tx.oncomplete = () => resolve()
          tx.onerror = () => reject(tx.error)
        }
      }),
  )
  await page.reload()
  /*
   * Auf die Beschriftung warten, nicht auf die Überschrift.
   *
   * Der erste Anlauf wartete auf `.today-system` und maß dann sofort — die
   * Konstellation stand da aber noch nicht immer, und `getScreenCTM()` gab
   * je nach Anlauf etwas anderes zurück. Ein Test, der misst, bevor das
   * Gemessene existiert, würfelt; genau das ist er hier einmal geworden.
   */
  await page.locator('.today-system').waitFor({ timeout: 30_000 })
  await page.locator('.constellation-label').first().waitFor({ timeout: 30_000 })
}

test('zeichnet die Begriffe gross genug, um sie zu lesen', async ({ page }) => {
  test.setTimeout(120_000)
  await visit(page)
  await seedSystem(page)

  const gemessen = await page.evaluate(() => {
    const svg = document.querySelector('.today .constellation svg') as SVGSVGElement | null
    const label = document.querySelector('.constellation-label') as SVGTextElement | null
    if (svg === null || label === null) return undefined
    const skala = svg.getScreenCTM()?.a
    const box = svg.getBoundingClientRect()
    return {
      pixel: skala === undefined ? undefined : Number.parseFloat(getComputedStyle(label).fontSize) * skala,
      breite: box.width,
      /* Wie viel der Karte die Zeichnung wirklich benutzt. Bleibt links und
         rechts Platz, ist der Inhalt auf die Höhe eingepasst — und damit
         kleiner, als er sein müsste. */
      genutzt: skala === undefined ? undefined : (100 * skala) / box.width,
    }
  })

  expect(gemessen, 'keine Konstellation gefunden').toBeDefined()
  expect(gemessen?.pixel ?? 0, 'die Begriffe sind zu klein zum Lesen').toBeGreaterThanOrEqual(
    LESBAR_AB,
  )
  expect(gemessen?.genutzt ?? 0, 'die Zeichnung nutzt die Breite nicht').toBeGreaterThan(0.9)
})

test('fuehrt vom System auf der Startseite nach „Mein Gedaechtnis“', async ({ page }) => {
  test.setTimeout(120_000)
  await visit(page)
  await seedSystem(page)

  // Ein Knopf, kein Absatz — und er sagt, wohin er führt.
  const block = page.locator('button.today-system-open')
  await expect(block).toBeVisible()
  await block.click()

  // Dieselbe Seite, die auch das Menü öffnet.
  await expect(page.locator(String.raw`.page .memoryzone`)).toBeVisible({ timeout: 30_000 })
})
