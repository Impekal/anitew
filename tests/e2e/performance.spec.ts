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
   * Einheit stockte. Genau das — eine **dauerhafte** Schleife — soll dieser
   * Test fangen.
   *
   * Gemessen hat er das bisher zu einem Zeitpunkt, an dem die App noch gar
   * nicht im Leerlauf war. Über vierzehn Sekunden beobachtet (ungedrosselt):
   *
   *   0,7–5,6 s   sieben bis acht lange Aufgaben, bis zu 610 ms
   *   ab 5,7 s    nichts mehr, über acht weitere Sekunden
   *
   * Das Fenster ging aber auf, sobald der Startknopf stand — also mitten in
   * der ersten Spanne. Ob es eine der Startblockaden erwischte, entschied die
   * Geschwindigkeit der Maschine. Derselbe Baum lief so am selben Tag zweimal
   * grün und einmal rot, mit „100 ms bei +65 ms" als Befund.
   *
   * Diese Startlast ist **echt** und steht als eigener Punkt auf der Liste
   * (siehe docs/AUDIT_GESAMT.md). Sie hier zufällig mitzumessen hat sie nicht
   * behoben, sondern nur das Tor unzuverlässig gemacht — und ein Tor, das
   * ohne Ursache rot wird, bringt irgendwann jemanden dazu, es zu ignorieren.
   *
   * Also: erst auf **echte** Ruhe warten, dann die Sekunde messen. Der
   * Wartepunkt ist dabei selbst die schärfere Prüfung — eine dauerhafte
   * Schleife im Hauptthread wird nie ruhig, also läuft er in die Zeitgrenze
   * und der Test wird rot. Der Schwellwert danach bleibt null.
   */
  await page.addInitScript(() => {
    const zustand = { letztesEnde: 0 }
    ;(window as unknown as { __anitewLast: { letztesEnde: number } }).__anitewLast = zustand
    try {
      const beobachter = new PerformanceObserver((liste) => {
        for (const eintrag of liste.getEntries()) {
          zustand.letztesEnde = Math.max(zustand.letztesEnde, eintrag.startTime + eintrag.duration)
        }
      })
      beobachter.observe({ entryTypes: ['longtask'] })
    } catch {
      // Ohne die API bleibt `letztesEnde` bei 0 — der Test überspringt sich unten.
    }
  })

  await visit(page)
  await expect(startButton(page)).toBeVisible()

  // Erst die nachgelagerte Startarbeit abwarten (siehe `main.tsx`) …
  await page.waitForFunction(
    () => performance.getEntriesByName('anitew:deferred-ready').length > 0,
    { timeout: 30_000 },
  )

  /*
   * … dann die Ruhe. Anderthalb Sekunden ohne lange Aufgabe: lang genug, dass
   * die Startlast (deren letzte Blockade bei 5,6 s endete) sicher vorbei ist,
   * kurz genug, dass eine echte Dauerschleife — die alle paar Dutzend
   * Millisekunden zuschlägt — diese Bedingung nie erfüllt.
   */
  await page.waitForFunction(
    () => {
      const zustand = (window as unknown as { __anitewLast?: { letztesEnde: number } }).__anitewLast
      if (zustand === undefined) return true
      return performance.now() - zustand.letztesEnde > 1500
    },
    { timeout: 25_000 },
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
