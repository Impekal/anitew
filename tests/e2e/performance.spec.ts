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

test('hält den Hauptthread frei — kein Dauerlauf von JavaScript', async ({ page }) => {
  /*
   * Die Zusage, um die es geht: **Der Hintergrund bewegt sich in CSS
   * (D-011/G-8), nicht in JavaScript.** Liefe er in JavaScript, liefe eine
   * Schleife im Hauptthread — dauerhaft — und die Uhr der Einheit stockte.
   *
   * Dieser Test hat an einem Tag dreimal das Tor umgeworfen, und jedes Mal
   * habe ich die Messung nachgezogen statt zu fragen, **was** da blockiert.
   * Mit `long-animation-frame`, die das verursachende Skript nennt, sind es
   * zwei Dinge, die vorher als eines galten:
   *
   * 1. Die dekorativen CSS-Animationen. Bei vierfach gedrosselter CPU alle
   *    ~135 ms ein langer Frame, dauerhaft — aber **ohne ein einziges
   *    Skript** und mit blockierender Dauer **null**. Sie halten niemanden
   *    auf. Das ist Gestaltung, kein Fehler.
   * 2. Ein grosser React-Render rund 3,5 Sekunden nach dem Start, 55 bis
   *    305 ms, ausgelöst vom Nachladen der Daten aus IndexedDB. Einmalig,
   *    aber gross. Er steht als B-09 im Auditbericht und ist offen.
   *
   * Die Longtask-API kann beides nicht auseinanderhalten — sie meldet „lange
   * Aufgabe" und verschweigt die Herkunft. Deshalb wurde der Test zufällig
   * rot, je nachdem, wo sein Fenster hinfiel.
   *
   * **Die Prüfung ist jetzt der Wartepunkt selbst**, und sie kommt ohne eine
   * einzige erfundene Zahl aus: Es wird gewartet, bis für drei Sekunden am
   * Stück **kein** skriptverursachter langer Frame mehr auftritt. Ein
   * einmaliger Render — und sei er noch so gross — geht vorbei, und die Ruhe
   * stellt sich ein. Eine **Dauerschleife** wird nie ruhig, egal wie lange man
   * wartet; der Wartepunkt läuft dann in die Zeitgrenze, und der Test wird rot
   * und nennt die Verursacher beim Namen.
   *
   * Das ist keine weichere Schranke als vorher, sondern eine andere Frage —
   * und die richtige: nicht „war irgendetwas mal langsam", sondern „hört es
   * auf".
   */
  await page.addInitScript(() => {
    const zustand: { letztes: number; frames: { versatz: number; dauer: number; wer: string }[] } = {
      letztes: 0,
      frames: [],
    }
    ;(window as unknown as { __anitewLoaf?: typeof zustand }).__anitewLoaf = zustand
    try {
      const beobachter = new PerformanceObserver((liste) => {
        for (const eintrag of liste.getEntries()) {
          const frame = eintrag as PerformanceEntry & {
            duration: number
            scripts?: { sourceURL?: string; name?: string; sourceFunctionName?: string; invoker?: string }[]
          }
          const skripte = frame.scripts ?? []
          if (skripte.length === 0) continue
          zustand.letztes = Math.max(zustand.letztes, frame.startTime + frame.duration)
          zustand.frames.push({
            versatz: Math.round(frame.startTime),
            dauer: Math.round(frame.duration),
            wer: skripte
              .map((x) => `${(x.sourceURL ?? x.name ?? '?').split('/').pop()}·${x.sourceFunctionName || x.invoker || '?'}`)
              .join(', '),
          })
        }
      })
      beobachter.observe({ type: 'long-animation-frame' })
    } catch {
      // Kennt der Browser die API nicht, bleibt die Liste leer — siehe unten.
    }
  })

  await visit(page)
  await expect(startButton(page)).toBeVisible()

  const kenntApi = await page.evaluate(
    () => (PerformanceObserver.supportedEntryTypes ?? []).includes('long-animation-frame'),
  )
  if (!kenntApi) {
    /*
     * Ein stiller Freispruch ist die unangenehmste Sorte grün: Er sieht aus
     * wie ein Beweis und ist keiner.
     */
    test.skip(true, 'Browser kennt long-animation-frame nicht')
    return
  }

  const kamZurRuhe = await page
    .waitForFunction(
      () => {
        const z = (window as unknown as { __anitewLoaf?: { letztes: number } }).__anitewLoaf
        if (z === undefined) return true
        return performance.now() - z.letztes > 3000
      },
      { timeout: 25_000 },
    )
    .then(() => true)
    .catch(() => false)

  const frames = await page.evaluate(() => {
    const z = (window as unknown as {
      __anitewLoaf: { frames: { versatz: number; dauer: number; wer: string }[] }
    }).__anitewLoaf
    // Nur die letzten Vorkommen zeigen — bei einer Schleife sind es Hunderte.
    return z.frames.slice(-6)
  })

  const beschreibung = frames.map((f) => `${f.wer} — ${f.dauer} ms bei ${f.versatz} ms`).join('; ')
  expect(
    kamZurRuhe,
    `JavaScript kommt im Hauptthread nicht zur Ruhe. Zuletzt: ${beschreibung}`,
  ).toBe(true)
})
