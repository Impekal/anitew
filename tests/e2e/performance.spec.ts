import { expect, test } from '@playwright/test'

import { startButton, visit } from './helpers.ts'

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
  await visit(page)
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
   *
   * Der Schwellwert ist null und bleibt null. Was hier hinzukommt, ist der
   * **Anfang** des Messfensters.
   *
   * Vorher begann die Messung, sobald der Startknopf stand — und wo dieser
   * Moment liegt, entscheidet allein die Maschine: Der Splash läuft nach der
   * Uhr, die neun nachgeladenen Stücke laufen nach Gerät und Netz. Auf einem
   * schnellen Rechner war die Startarbeit längst vorbei, auf einem langsamen
   * ragte sie ins Fenster. Derselbe Baum lief so am selben Tag zweimal grün
   * und einmal rot (Läufe 1391/1392 gegen 1393), ohne dass sich an der App
   * etwas geändert hätte.
   *
   * Ein Test, der eine **Dauereigenschaft** behauptet, darf seinen Messpunkt
   * nicht dem Zufall überlassen. Er wartet jetzt auf die Marke, die das Ende
   * der nachgelagerten Startarbeit anzeigt (siehe `main.tsx`), und misst
   * danach. Das ist kein weicherer Test — es ist derselbe Test an einer
   * definierten Stelle.
   *
   * Und wenn er doch rot wird, soll er etwas sagen: Er meldet jede lange
   * Aufgabe mit Versatz im Fenster und Dauer, nicht bloß eine Anzahl. „1"
   * war beim letzten Mal nicht diagnostizierbar.
   */
  await visit(page)
  await expect(startButton(page)).toBeVisible()

  await page.waitForFunction(
    () => performance.getEntriesByName('anitew:deferred-ready').length > 0,
    { timeout: 30_000 },
  )

  const longTasks = await page.evaluate(async () => {
    return await new Promise<{ versatz: number; dauer: number }[] | null>((resolve) => {
      const found: { versatz: number; dauer: number }[] = []
      let observer: PerformanceObserver | undefined
      const begonnen = performance.now()
      try {
        observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            found.push({
              versatz: Math.round(entry.startTime - begonnen),
              dauer: Math.round(entry.duration),
            })
          }
        })
        observer.observe({ entryTypes: ['longtask'] })
      } catch {
        // Kennt der Browser keine Longtask-API, gilt der Test als bestanden —
        // er kann dann schlicht nichts behaupten.
        resolve(null)
        return
      }
      setTimeout(() => {
        observer?.disconnect()
        resolve(found)
      }, 1000)
    })
  })

  /*
   * Kennt der Browser die Longtask-API nicht, behauptet dieser Test nichts —
   * dann soll er aber auch nicht als „bestanden" im Protokoll stehen. Ein
   * stiller Freispruch ist die unangenehmste Sorte grün: Er sieht aus wie ein
   * Beweis und ist keiner.
   */
  if (longTasks === null) {
    test.skip(true, 'Browser kennt die Longtask-API nicht')
    return
  }

  const beschreibung = longTasks.map((t) => `${t.dauer} ms bei +${t.versatz} ms`).join(', ')
  expect(longTasks, `lange Aufgaben im Leerlauf: ${beschreibung}`).toEqual([])
})
