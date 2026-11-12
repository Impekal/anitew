import { expect, test } from '@playwright/test'

import { startButton, startEmergency, visit } from './helpers.ts'

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
   */
  await visit(page)
  await expect(startButton(page)).toBeVisible()

  const longTasks = await page.evaluate(async () => {
    return await new Promise<Array<{duration:number;startTime:number;name:string}>>((resolve) => {
      const tasks:Array<{duration:number;startTime:number;name:string}>=[]
      let observer: PerformanceObserver | undefined
      try {
        observer = new PerformanceObserver((list) => {
          tasks.push(...list.getEntries().map(({duration,startTime,name})=>({duration,startTime,name})))
        })
        observer.observe({ entryTypes: ['longtask'] })
      } catch {
        // Kennt der Browser keine Longtask-API, gilt der Test als bestanden —
        // er kann dann schlicht nichts behaupten.
        resolve([])
        return
      }
      setTimeout(() => {
        observer?.disconnect()
        resolve(tasks)
      }, 1000)
    })
  })

  expect(longTasks, `lange Aufgaben im Leerlauf: ${JSON.stringify(longTasks)}`).toHaveLength(0)
})

/**
 * Keine Dauerbewegung sitzt auf einer weichgezeichneten Fläche.
 *
 * Gemeldet am 13.09. vom Gerät: „Die App macht das Handy sehr heiß." Am
 * 14.11. auf diesem Zweig nachgemessen, Telefonformat 412 × 915, CPU
 * sechsfach gedrosselt:
 *
 *   unverändert                       11,2 fps
 *   ohne background-position          12,0   (+0,8 — im Rauschen)
 *   ohne stroke-dashoffset            11,0   (keine Wirkung)
 *   ohne box-shadow                   11,5   (+0,5)
 *   ohne Verlaufs-Weichzeichner       16,9   (+5,4)  ← der große Posten
 *   ohne backdrop-filter              18,4   (+1,5)
 *
 * Die als teuer geltenden Neuzeichen-Eigenschaften kosten hier nichts
 * Messbares; der Weichzeichner auf den **bewegten** Verlaufsflächen kostet
 * die Hälfte des Budgets. Grund: Solange so eine Fläche sich bewegt, muss
 * sie in jedem Bild neu gerastert werden. Steht sie still, wird sie einmal
 * gerastert und danach nur noch überblendet — dann ist sie gratis.
 *
 * ── Warum eine frühere Fassung dieser Prüfung blind war ──────────────────
 *
 * Sie fragte `getComputedStyle(node)` **ohne** das Pseudo-Element. Bei
 * `body::after` ist `effect.target` schlicht `body`, und `body` hat keinen
 * Filter — der liegt auf dem Pseudo. Die teuerste Fläche der App galt damit
 * als sauber. Hier wird deshalb zuerst das Pseudo-Element selbst befragt und
 * erst danach die Vorfahren.
 *
 * Der Weichzeichner darf weg, ohne dass jemand es sieht: Ein Verlauf ist
 * schon weich. Gemessen (gleicher Bildausschnitt, Animationen angehalten)
 * ändert er im Mittel 0,068 und höchstens 4 von 255 Helligkeitsstufen.
 * Bewegung bleibt davon unberührt — sie kostet ohne Filter nichts.
 */
const KEINE_BEWEGUNG_AUF_WEICHZEICHNER = async (page: import('@playwright/test').Page) =>
  page.evaluate(() => {
    const treffer: string[] = []
    /*
     * Ein Pseudo-Element hat keinen eigenen Kasten in der DOM-Abfrage. Seine
     * Fläche steht aber in seinem Stil: `inset: -18vmax` macht `body::after`
     * größer als den Schirm. Deshalb wird sie aus den Kanten gerechnet,
     * sonst meldete die Prüfung die Fläche von `body` statt die der Ebene.
     */
    const größteFläche = (el: Element, pseudo: string | null): number => {
      const kasten = el.getBoundingClientRect()
      if (pseudo === null) return kasten.width * kasten.height
      const stil = getComputedStyle(el, pseudo)
      const zahl = (wert: string) => (wert.endsWith('px') ? Number.parseFloat(wert) : 0)
      const breite = kasten.width - zahl(stil.left) - zahl(stil.right)
      const höhe = kasten.height - zahl(stil.top) - zahl(stil.bottom)
      return Math.max(kasten.width * kasten.height, breite * höhe)
    }
    const prüfe = (stil: CSSStyleDeclaration): string => {
      if (stil.backdropFilter !== 'none' && stil.backdropFilter !== '') {
        return `backdrop-filter: ${stil.backdropFilter}`
      }
      if (
        stil.filter !== 'none' &&
        stil.filter !== '' &&
        (stil.filter.includes('blur') || stil.filter.includes('drop-shadow'))
      ) {
        return `filter: ${stil.filter}`
      }
      return ''
    }

    for (const animation of document.getAnimations()) {
      const wirkung = animation.effect as KeyframeEffect | null
      if (wirkung === null) continue
      if (wirkung.getComputedTiming().iterations !== Infinity) continue
      const ziel = wirkung.target
      if (ziel === null) continue
      const pseudo =
        (wirkung as unknown as { pseudoElement?: string | null }).pseudoElement ?? null

      // Erst die bewegte Fläche selbst — Pseudo-Element eingeschlossen.
      let weich = prüfe(getComputedStyle(ziel, pseudo))
      // Dann jede Weichzeichner-Fläche darüber: Ein Filter am Container
      // zwingt den ganzen Teilbaum in eine eigene Ebene, und die wird neu
      // gerechnet, sobald sich darin etwas rührt.
      for (let knoten: Element | null = ziel; knoten !== null && weich === ''; knoten = knoten.parentElement) {
        weich = prüfe(getComputedStyle(knoten))
      }
      if (weich === '') continue

      /*
       * Nur **große** Flächen zählen. Teuer ist das Neurastern einer großen
       * Ebene, nicht ein Leuchten von zwei Pixeln an einem Punkt. Gemessen
       * am 14.11.: Die beiden Schuldigen waren 1 026 125 px² (`body::after`)
       * und 376 980 px² (`.neural`) und kosteten zusammen 17 von 28 Bildern;
       * die fünfzig Knotenleuchten sind 16 bis 42 px² groß und brachten
       * angehalten **null**. Die Schranke liegt dazwischen, bei einem Achtel
       * Telefonschirm — sie fängt die Ebenen und lässt die Zierde in Ruhe.
       */
      const fläche = größteFläche(ziel, pseudo)
      if (fläche < 50_000) continue

      const name = `${ziel.getAttribute('class') ?? ziel.tagName}${pseudo ?? ''}`
      treffer.push(`${name.slice(0, 48)} · ${weich} · ${Math.round(fläche)} px²`)
    }
    return [...new Set(treffer)]
  })

test('keine Dauerbewegung sitzt auf einer Weichzeichner-Fläche', async ({ page }) => {
  test.setTimeout(180_000)

  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await page.waitForTimeout(1200)
  const aufDemStart = await KEINE_BEWEGUNG_AUF_WEICHZEICHNER(page)
  expect(
    aufDemStart.slice(0, 8).join(' | '),
    'bewegte Weichzeichner auf dem Startbildschirm',
  ).toBe('')

  await startEmergency(page)
  await page.waitForTimeout(1200)
  const inDerEinheit = await KEINE_BEWEGUNG_AUF_WEICHZEICHNER(page)
  expect(
    inDerEinheit.slice(0, 8).join(' | '),
    'bewegte Weichzeichner in der Einheit',
  ).toBe('')
})
