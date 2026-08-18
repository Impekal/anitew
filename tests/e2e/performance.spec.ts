import { expect, test } from '@playwright/test'

import { startButton } from './helpers.ts'

/**
 * Kaltstart und ruckelfreie Timer (Backlog P4).
 *
 * Zwei Vorbehalte vorweg, damit die Zahlen nicht mehr behaupten, als sie
 * können: Der Buildrechner ist schneller als jedes Telefon, und die Zeit im
 * Test schwankt. Deshalb sind die Schranken hier **großzügig** — sie fangen
 * nicht die letzten Millisekunden, sondern den Tag, an dem der Kaltstart durch
 * eine achtlose Abhängigkeit von einer halben auf drei Sekunden springt. Die
 * eigentliche Größenwacht steht daneben in `scripts/size-budget.mjs`.
 */

test('ist schnell benutzbar — Startknopf steht früh', async ({ page }) => {
  const start = Date.now()
  await page.goto('/', { waitUntil: 'commit' })
  await expect(startButton(page)).toBeVisible()
  const untilInteractive = Date.now() - start

  // Zwei Sekunden ist das Versprechen aus P4 — hier mit reichlich Luft, weil
  // der Test langsamer ist als ein Nutzer es je erlebte.
  expect(untilInteractive, `Startknopf erst nach ${untilInteractive} ms`).toBeLessThan(4000)
})

test('lädt beim zweiten Mal aus dem Cache und bleibt bedienbar (offline)', async ({ page }) => {
  /*
   * Der eigentliche Alltag: Beim zweiten Öffnen kommt alles aus dem Service
   * Worker, ohne Netz. Genau das prüft dieser Fall — erst warmlaufen lassen,
   * dann das Netz kappen und neu laden.
   */
  await page.goto('/')
  await expect(startButton(page)).toBeVisible()
  // Dem Service Worker einen Moment geben, die Kontrolle zu übernehmen.
  await page.waitForFunction(() => navigator.serviceWorker?.controller != null, { timeout: 30_000 })

  await page.context().setOffline(true)
  try {
    await page.reload()
    await expect(startButton(page)).toBeVisible({ timeout: 30_000 })
  } finally {
    await page.context().setOffline(false)
  }
})

test('hält den Hauptthread frei — keine lange Aufgabe im Leerlauf', async ({ page }) => {
  /*
   * Der Hintergrund bewegt sich in CSS (D-011/G-8), nicht in JavaScript. Wäre
   * das falsch, liefe im Leerlauf eine Schleife im Hauptthread und die Uhr der
   * Einheit stockte. Geprüft wird deshalb, dass in einer Sekunde Ruhe **keine**
   * lange Aufgabe (über 50 ms am Stück) anfällt.
   */
  await page.goto('/')
  await expect(startButton(page)).toBeVisible()

  const longTasks = await page.evaluate(async () => {
    return await new Promise<number>((resolve) => {
      let count = 0
      let observer: PerformanceObserver | undefined
      try {
        observer = new PerformanceObserver((list) => {
          count += list.getEntries().length
        })
        observer.observe({ entryTypes: ['longtask'] })
      } catch {
        // Kennt der Browser keine Longtask-API, gilt der Test als bestanden —
        // er kann dann schlicht nichts behaupten.
        resolve(0)
        return
      }
      setTimeout(() => {
        observer?.disconnect()
        resolve(count)
      }, 1000)
    })
  })

  expect(longTasks, 'lange Aufgaben im Leerlauf').toBe(0)
})
