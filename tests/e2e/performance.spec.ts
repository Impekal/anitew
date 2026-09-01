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

/**
 * Das Farbbudget (Gerätemeldung 01.09.: „Le téléphone chauffe toujours").
 *
 * #101 hat das Ruhefenster gebracht: Nach zwanzig Sekunden ohne Berührung
 * steht die Bewegung still. Das half — aber es half genau dann, wenn niemand
 * da ist. Wer eine Einheit macht, tippt; das Ruhefenster armiert nie, und das
 * Telefon wurde weiter heiß. Der Fehler lag nicht am Ruhefenster, sondern an
 * dem, was währenddessen läuft.
 *
 * Gemessen wurde (Pixel-7-Profil, gebaute App):
 *
 * - In der Einheit liefen **84 Animationen gleichzeitig**. Rund dreißig
 *   bewegten `stroke-dashoffset`; das ganze Netz lag in zwei `drop-shadow`,
 *   also wurde sein **kompletter** Teilbaum je Bild neu gezeichnet.
 * - Die Punktscheibe hinter dem Inhalt (`.app::before`, 420 × 420 px) bewegte
 *   `background-position` — auf **jedem** Bildschirm, dauerhaft.
 * - Der Startknopf trug `backdrop-filter: blur(18px)` über 270 × 270 px, und
 *   die Punktscheibe bewegte sich genau dahinter.
 *
 * Nach der Behebung: **14** laufende Animationen in der Einheit, keine davon
 * auf oder in einer Weichzeichner-Fläche, keine auf einer Zeichen-Eigenschaft.
 *
 * Alle drei zwingen den Browser, pro Bild **neu zu zeichnen**. Genau das
 * kostet Strom und Wärme; `transform` und `opacity` tun es nicht, die schiebt
 * die Grafikkarte. Der Kommentar in `NeuralField.tsx` behauptete bis hierher,
 * die Bewegung laufe „auf der Grafikkarte“ — die Messung sagt etwas anderes.
 *
 * Deshalb steht hier ein Budget, wie es das für den Kaltstart längst gibt.
 */

/*
 * Gezaehlt wird, was **endlos** laeuft (CI-Fund 01.09.).
 *
 * Der erste Wurf mass alles, was im Moment der Probe lief — und wurde damit
 * unzuverlaessig: Mal war eine einmalige Einblendung noch unterwegs, mal
 * nicht. Die CI hat das als „flaky" gemeldet, und das war kein Zufallsrauschen,
 * sondern ein zu grob gefasster Anspruch.
 *
 * Die Aussage, um die es geht, ist enger: Ein kurzes Aufblenden beim Eintritt
 * kostet einmal ein paar Bilder. Warm wird das Telefon von dem, was **nicht
 * aufhoert** — und genau das war der Befund: Das Netz, die Punktscheibe und
 * die Signale liefen `infinite`.
 */

/** Eigenschaften, deren Bewegung den Browser zum Neuzeichnen zwingt. */
const REPAINTS = [
  'strokeDashoffset',
  'strokeDasharray',
  'backgroundPosition',
  'backgroundPositionX',
  'backgroundPositionY',
  'backgroundSize',
  'boxShadow',
  'filter',
  'backdropFilter',
  'width',
  'height',
  'top',
  'left',
]

interface RunningAnimation {
  where: string
  props: string[]
  blur: string
  /** Läuft sie endlos? Nur die ist Dauerlast. */
  dauerhaft: boolean
}

/**
 * Wartet, bis die Oberfläche steht.
 *
 * Mehrere Stylesheets laden verzögert — auf dem Startbildschirm waren es
 * zwei, in der Einheit elf. Wer davor misst, misst einen Zwischenzustand und
 * bekommt mal dieses, mal jenes Ergebnis; die CI hat genau das als „flaky“
 * gemeldet. Gewartet wird, bis keine Stylesheets mehr dazukommen.
 */
async function steht(page: import('@playwright/test').Page): Promise<void> {
  let vorher = -1
  for (let versuch = 0; versuch < 40; versuch++) {
    const jetzt = await page.evaluate(() => document.styleSheets.length)
    if (jetzt === vorher) return
    vorher = jetzt
    await page.waitForTimeout(250)
  }
}

async function running(page: import('@playwright/test').Page): Promise<RunningAnimation[]> {
  await steht(page)
  return page.evaluate(() => {
    const skip = ['offset', 'computedOffset', 'easing', 'composite']
    return document
      .getAnimations()
      .filter((animation) => animation.playState === 'running')
      .map((animation) => {
        const effect = animation.effect as KeyframeEffect | null
        const target = effect?.target ?? undefined
        const props = new Set<string>()
        for (const frame of effect?.getKeyframes() ?? []) {
          for (const key of Object.keys(frame)) if (!skip.includes(key)) props.add(key)
        }
        /*
          Nicht nur das bewegte Element selbst zaehlt, sondern auch jede
          Weichzeichner-Flaeche darueber: Ein Filter auf dem Container zwingt
          den ganzen Teilbaum in eine eigene Ebene, und die wird neu
          gerechnet, sobald sich darin etwas ruehrt. Genau so war das Netz
          gebaut — ein `drop-shadow` ueber achtzig bewegten Elementen.
        */
        let blur = ''
        for (
          let node: Element | null | undefined = target;
          node !== null && node !== undefined && blur === '';
          node = node.parentElement
        ) {
          const near = getComputedStyle(node)
          const backdrop = near.backdropFilter
          const filter = near.filter
          if (backdrop !== 'none' && backdrop !== '') blur = `backdrop-filter: ${backdrop}`
          else if (filter !== 'none' && (filter.includes('blur') || filter.includes('drop-shadow'))) {
            blur = `filter: ${filter}`
          }
        }
        const name = target === undefined ? '?' : (target.getAttribute('class') ?? target.tagName)
        const timing = effect?.getComputedTiming()
        return {
          where: `${name}`.slice(0, 60),
          props: [...props],
          blur,
          dauerhaft: timing?.iterations === Infinity,
        }
      })
  })
}

async function intoSession(page: import('@playwright/test').Page): Promise<void> {
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await page.getByRole('button', { name: '60 Sekunden' }).click()
  await startButton(page).click()
  await page.locator('.settle').click()
  await expect(page.locator('.session-clock')).toBeVisible({ timeout: 30_000 })
}

test('keine dauerhafte Bewegung zeichnet pro Bild neu', async ({ page }) => {
  test.setTimeout(120_000)
  await intoSession(page)
  await page.waitForTimeout(1500)

  const schuldige = (await running(page)).filter(
    (animation) =>
      animation.dauerhaft && animation.props.some((property) => REPAINTS.includes(property)),
  )

  expect(
    schuldige.map((a) => `${a.where}: ${a.props.join('+')}`).slice(0, 8).join(' | '),
    'diese Bewegungen zwingen zum Neuzeichnen',
  ).toBe('')
})

test('keine Bewegung sitzt auf einer Weichzeichner-Fläche', async ({ page }) => {
  test.setTimeout(120_000)

  // Erst der Startbildschirm — dort steht der Knopf mit dem Weichzeichner.
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await page.waitForTimeout(1200)
  const aufDemStart = (await running(page)).filter(
    (animation) => animation.dauerhaft && animation.blur !== '',
  )
  expect(
    aufDemStart.map((a) => `${a.where} · ${a.blur}`).slice(0, 6).join(' | '),
    'bewegte Weichzeichner auf dem Startbildschirm',
  ).toBe('')

  await intoSession(page)
  await page.waitForTimeout(1500)
  const inDerEinheit = (await running(page)).filter(
    (animation) => animation.dauerhaft && animation.blur !== '',
  )
  expect(
    inDerEinheit.map((a) => `${a.where} · ${a.blur}`).slice(0, 6).join(' | '),
    'bewegte Weichzeichner in der Einheit',
  ).toBe('')
})

/**
 * Und eine Obergrenze für die schiere Menge: Auch billige Bewegungen sind
 * nicht umsonst, wenn achtzig davon gleichzeitig laufen. Gemessen waren es
 * 81; die Schranke lässt reichlich Luft und fängt trotzdem den Tag, an dem
 * wieder ein Feld mit fünfzig Einzelanimationen dazukommt.
 */
test('höchstens 24 Bewegungen laufen gleichzeitig', async ({ page }) => {
  test.setTimeout(120_000)
  await intoSession(page)
  await page.waitForTimeout(1500)

  const laufend = await running(page)
  expect(laufend.length, laufend.map((a) => a.where).slice(0, 10).join(' | ')).toBeLessThanOrEqual(24)
})
