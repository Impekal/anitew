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

import { openPage, visit, warteAufBandform } from './helpers.ts'

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
    const gruppe = punkt?.closest('.constellation-memory')
    if (punkt === null || gruppe === null || gruppe === undefined) return -1
    /*
     * Die Bahn hängt seit dem Befund vom 07.09. an der **Gruppe**, nicht am
     * Kreis, und seit dem 08.09. an der **Ebene** darüber (sechs Ebenen
     * statt einer Bahn je Punkt — das hält die Hitze konstant). Gesucht wird
     * sie deshalb von unten nach oben: Zugesagt ist, dass der Punkt sich
     * sichtbar bewegt, nicht, an welchem Element das notiert steht. Gemessen wird in jedem Fall der Kreis; das
     * ist der Punkt, um den es in der Meldung vom 02.09. ging.
     */
    const bahnVon = (el: Element | null): Animation | undefined => {
      for (let k: Element | null = el; k !== null; k = k.parentElement) {
        const lauf = k.getAnimations()[0]
        if (lauf !== undefined) return lauf
      }
      return undefined
    }
    const lauf = bahnVon(punkt)
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

/*
 * ── Der Befund vom 07.09., mit Bild ──────────────────────────────────────
 *
 * Wörtlich: „Man sieht nicht alles. Und insgesamt ist es zu alligniert. Die
 * Wörter/Begriffe sollten gemischt werden (Verbindungen werden natürlich
 * behalten werden) und sich konstant bewegen wie in einem Billard oder bei
 * den Galaxys oder so…"
 *
 * Drei Beobachtungen, drei getrennte Messungen. Die beiden Zusagen von oben
 * — nichts überschreibt sich, nichts ragt aus dem Bild — gelten unverändert
 * weiter; sie stehen dort und werden hier nicht wiederholt.
 */

test('streut die Namen über die Fläche statt in drei Zeilen', async ({ page }) => {
  test.setTimeout(120_000)
  await visit(page)
  await saeeUnverbundenes(page)
  await expect(page.locator('.constellation-label').first()).toBeVisible({ timeout: 30_000 })

  /*
   * „Zu alligniert" ist keine Geschmacksfrage, sondern nachzählbar: Die
   * Anordnung setzte jeden Punkt reihum auf eine von **drei** Zeilen
   * (`(index % 3) - 1`). Genau diese sieben Namen lagen gemessen auf
   * y = 300 / 347 / 395 Pixeln und belegten 95 von 288 Pixeln Bandhöhe —
   * zwei Drittel der Fläche standen leer, während die Namen sich gegenseitig
   * auf drei Linien drängten. Danach: sieben verschiedene Höhen, 162 von
   * 288 Pixeln.
   *
   * Geprüft wird beides: **wie viele verschiedene Höhen** es gibt (das ist
   * das Raster) und **wie viel von der Fläche** benutzt wird (das ist das
   * „man sieht nicht alles"). Ein Wächter nur auf die Zeilenzahl wäre zu
   * schwach: Drei Zeilen mit je zwei Pixeln Versatz wären formal sieben
   * Höhen und sähen genauso gerastert aus.
   *
   * Die Schwelle für die Fläche liegt bei 45 %, mitten zwischen den beiden
   * gemessenen Werten (33 % und 56 %). Sie dicht an das Ergebnis zu legen
   * hieße, den nächsten Lauf auf einem anderen Schirm zu würfeln; sie dicht
   * an den alten Stand zu legen hieße, den Rückfall durchzuwinken.
   */
  const befund = await page.evaluate(() => {
    const kasten = document.querySelector('.constellation')?.getBoundingClientRect()
    if (kasten === undefined) return { hoehen: [] as number[], anteil: 0 }
    const mitten = [...document.querySelectorAll('.constellation .constellation-label')].map((n) => {
      const r = n.getBoundingClientRect()
      return r.y + r.height / 2
    })
    // Ein Pixel Auflösung: Zwei Namen auf derselben Zeile fallen zusammen.
    const hoehen = [...new Set(mitten.map((y) => Math.round(y)))].sort((a, b) => a - b)
    const spanne = mitten.length === 0 ? 0 : Math.max(...mitten) - Math.min(...mitten)
    return { hoehen, anteil: kasten.height === 0 ? 0 : spanne / kasten.height }
  })

  expect(
    befund.hoehen.length,
    `sieben Namen stehen auf ${befund.hoehen.length} Höhen (${befund.hoehen.join(', ')}) — das ist ein Raster`,
  ).toBeGreaterThanOrEqual(6)

  expect(
    befund.anteil,
    `die Namen benutzen nur ${(befund.anteil * 100).toFixed(0)} % der Bandhöhe`,
  ).toBeGreaterThan(0.45)
})

test('bewegt die Namen mit, nicht nur die Punkte', async ({ page }) => {
  test.setTimeout(120_000)
  await visit(page)
  await saeeUnverbundenes(page)
  await expect(page.locator('.constellation-label').first()).toBeVisible({ timeout: 30_000 })

  /*
   * „Sollten sich konstant bewegen wie in einem Billard oder bei den
   * Galaxys." Bewegt hat sich vorher der **Kreis**, und zwar allein: Die
   * Animation saß an `.constellation-node`, der Name daneben stand still.
   * Gemessen legten alle sieben Namen über eine volle Bahn 0,0 Pixel zurück
   * — die Gruppe trug gar keine Animation. Auf
   * dem Glas sah das aus, als zucke ein Punkt, während die Konstellation
   * steht — und genau so wurde es gemeldet.
   *
   * Gemessen wird über die Web-Animations-Schnittstelle: die Bahn anhalten,
   * sie Schritt für Schritt abfahren, an jeder Stelle die Mitte des
   * **Namens** ablesen. Das ist exakt statt abgewartet — und es misst, was
   * das Auge sieht, nicht was in der Stilvorlage steht.
   */
  const wege = await page.evaluate(() => {
    const gruppen = [...document.querySelectorAll('.constellation .constellation-memory')]
    return gruppen.map((gruppe) => {
      const name = gruppe.querySelector('.constellation-label')
      let lauf: Animation | undefined
      for (let k: Element | null = gruppe; k !== null; k = k.parentElement) {
        lauf = k.getAnimations()[0]
        if (lauf !== undefined) break
      }
      /*
       * Statt Kennzahlen wie „-2" ein Satz: Der Gegenprobe-Lauf ohne die
       * Behebung meldet damit „trägt keine Bahn" statt „-2,00 px", und wer
       * in einem halben Jahr auf die Fehlermeldung schaut, muss sie nicht
       * erst im Testquelltext nachschlagen.
       */
      if (name === null) return { text: '(ohne Namen)', weg: 0, grund: 'ohne Namen', dauer: 0 }
      const text = name.textContent ?? ''
      if (lauf === undefined) return { text, weg: 0, grund: 'trägt keine Bahn', dauer: 0 }
      const dauer = Number((lauf.effect as KeyframeEffect).getTiming().duration ?? 0)
      if (dauer === 0) return { text, weg: 0, grund: 'Bahn ohne Dauer', dauer: 0 }
      lauf.pause()
      const mitte = (): { x: number; y: number } => {
        const r = name.getBoundingClientRect()
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
      }
      /*
       * **Der Vorlauf muss herausgerechnet werden.** Jeder Punkt startet mit
       * einem negativen `animation-delay`, damit die zwölf nicht im
       * Gleichschritt laufen. `currentTime` zählt aber auf der Zeitleiste,
       * nicht in der Bahn: `currentTime = 0` steht deshalb je nach Punkt
       * mitten in der Bewegung, nicht an ihrem Anfang. Mit dem Vorlauf davor
       * trifft `anteil = 0` wirklich den Anfang — und `0` gegen das Maximum
       * gemessen ist genau die Auslenkung, die das Auge sieht.
       */
      const vorlauf = Number((lauf.effect as KeyframeEffect).getTiming().delay ?? 0)
      lauf.currentTime = vorlauf
      const anfang = mitte()
      let weg = 0
      for (let anteil = 0.05; anteil < 1; anteil += 0.05) {
        lauf.currentTime = vorlauf + dauer * anteil
        const jetzt = mitte()
        weg = Math.max(weg, Math.hypot(jetzt.x - anfang.x, jetzt.y - anfang.y))
      }
      lauf.play()
      return { text, weg, grund: `${weg.toFixed(2)} px`, dauer }
    })
  })

  const stumm = wege.filter(({ weg }) => weg <= 2)
  expect(
    stumm.map(({ text, grund }) => `${text}: ${grund}`),
    'diese Namen stehen still',
  ).toEqual([])

  /*
   * Und jeder auf seiner eigenen Bahn. Punkte mit derselben Dauer und
   * demselben Vorlauf atmen im Gleichtakt — das liest sich als ein einziges
   * Bild, das sich hebt und senkt, nicht als „Billard". Vorher war es eine
   * einzige Dauer für alle (9,6 s), jetzt zieht jede Ebene ihre Zahl aus
   * ihrem Index — sechs verschiedene Bahnen, auf die sich die Punkte
   * verteilen.
   */
  const dauern = new Set(wege.map(({ dauer }) => Math.round(dauer)))
  expect(
    dauern.size,
    `alle Punkte laufen auf ${dauern.size} verschiedenen Dauern (${[...dauern].join(', ')} ms) — das ist ein Gleichtakt`,
  ).toBeGreaterThanOrEqual(5)
})

test('haelt die Namen auf jedem Punkt ihrer Bahn auseinander', async ({ page }) => {
  test.setTimeout(120_000)
  await visit(page)
  await saeeUnverbundenes(page)
  await expect(page.locator('.constellation-label').first()).toBeVisible({ timeout: 30_000 })

  /*
   * Der Preis der Bewegung, und der Grund, warum dieser Test eigenständig
   * dasteht: Solange nur der Kreis trieb, war die Anordnung der Namen ein
   * Standbild — einmal ohne Überlappung, immer ohne Überlappung. Jetzt
   * wandern die Namen, und damit ist „keine Überlappung" eine Zusage über
   * **jeden Zeitpunkt**, nicht über den zufälligen Moment der Messung.
   *
   * Die Prüfungen weiter oben lesen einen einzigen Augenblick. Wäre die
   * Drift größer als die Luft, die die Anordnung freihält, gingen sie
   * meistens durch und irgendwann ohne erkennbaren Grund nicht — das
   * klassische Flackern mit echter Ursache. Deshalb werden hier alle Bahnen
   * gemeinsam durchgefahren und an jeder Stelle nachgemessen.
   */
  const schlimmstes = await page.evaluate(() => {
    const feld = document.querySelector('.constellation')?.getBoundingClientRect()
    if (feld === undefined) {
      return { ueber: ['keine Konstellation gefunden'], draussen: [] as string[], bahnen: 0 }
    }
    const gruppen = [...document.querySelectorAll('.constellation .constellation-memory')]
      .map((g) => {
        let lauf: Animation | undefined
        for (let k: Element | null = g; k !== null; k = k.parentElement) {
          lauf = k.getAnimations()[0]
          if (lauf !== undefined) break
        }
        return { lauf, name: g.querySelector('.constellation-label') }
      })
      .filter((g): g is { lauf: Animation; name: Element } => g.lauf !== undefined && g.name !== null)
    for (const { lauf } of gruppen) lauf.pause()

    const ueber = new Set<string>()
    const draussen = new Set<string>()
    /*
     * Die vier Stützstellen der Bewegung — dort stehen die Extreme — und
     * dazu ein grobes Raster für alles dazwischen. Beides zusammen, weil
     * keines allein reicht: Nur die Stützstellen übersähen einen Fehler in
     * der Interpolation, nur das Raster überspränge die Extreme.
     *
     * Der Vorlauf jedes Punktes wird dabei herausgerechnet (Begründung im
     * Test darüber). Ohne das läge `anteil = 0.27` je nach Punkt irgendwo,
     * nur nicht auf der Stützstelle — und die Extreme, um die es hier geht,
     * wären genau die Stellen, die niemand geprüft hat.
     */
    const stellen = [0, 0.15, 0.27, 0.4, 0.53, 0.65, 0.74, 0.82, 0.89, 0.95, 1]
    for (const anteil of stellen) {
      for (const { lauf } of gruppen) {
        const takt = (lauf.effect as KeyframeEffect).getTiming()
        const dauer = Number(takt.duration ?? 0)
        lauf.currentTime = Number(takt.delay ?? 0) + dauer * anteil
      }
      const kaesten = gruppen.map(({ name }) => ({
        text: name.textContent ?? '',
        r: name.getBoundingClientRect(),
      }))
      for (let i = 0; i < kaesten.length; i += 1) {
        const a = kaesten[i]
        if (a === undefined) continue
        if (a.r.left < feld.left + 2 || a.r.right > feld.right - 2) draussen.add(a.text)
        for (let j = i + 1; j < kaesten.length; j += 1) {
          const b = kaesten[j]
          if (b === undefined) continue
          if (
            a.r.right - 1 > b.r.left &&
            b.r.right - 1 > a.r.left &&
            a.r.bottom - 1 > b.r.top &&
            b.r.bottom - 1 > a.r.top
          ) {
            ueber.add(`${a.text} × ${b.text}`)
          }
        }
      }
    }
    for (const { lauf } of gruppen) lauf.play()
    return { ueber: [...ueber], draussen: [...draussen], bahnen: gruppen.length }
  })

  /*
   * Zuerst: Es gab überhaupt etwas zu messen. Ohne diese Zeile wäre der Test
   * genau dann grün, wenn keine einzige Bahn läuft — also im schlimmsten
   * Fall, den es zu verhindern gilt. Solche Wächter gehen nie rot und sind
   * deshalb keine.
   */
  expect(
    schlimmstes.bahnen,
    `nur ${schlimmstes.bahnen} von sieben Namen laufen auf einer Bahn`,
  ).toBe(NAMEN.length)

  expect(
    schlimmstes.ueber,
    `Namen laufen im Lauf ihrer Bahn ineinander: ${schlimmstes.ueber.join(', ')}`,
  ).toEqual([])
  expect(
    schlimmstes.draussen,
    `Namen laufen im Lauf ihrer Bahn aus dem Bild: ${schlimmstes.draussen.join(', ')}`,
  ).toEqual([])
})

/*
 * ── Der Befund vom 08.09.: „Nicht ganz" ──────────────────────────────────
 *
 * Mit Bild, drei Punkte grün eingekringelt. Der ursprüngliche Satz vom 07.09.
 * lautete „Man sieht nicht alles", und nach dem Umbau der Anordnung war das
 * immer noch wahr — nur aus einem anderen Grund als vermutet.
 *
 * Gemessen am Telefon (412 × 915), zwanzig Erinnerungen: **zehn Punkte
 * trugen einen Namen, zehn keinen.** Die Anordnung versteckte jeden zweiten,
 * sobald es eng wurde, und sagte niemandem warum. Die Schwelle lag bei
 * sechzehn Erinnerungen.
 *
 * Der Grund war die Bandhöhe. Nachgemessen, wie viele Zeichen bei welcher
 * Höhe überlappungsfrei unterzubringen sind:
 *
 *          H=44        H=56        H=68
 *   n=12   8 Zeichen   12          12
 *   n=16   passt nicht  8           8
 *   n=20   passt nicht  4           8
 *
 * Bei 44 Einheiten passt ab sechzehn Erinnerungen keine einzige Namenslänge
 * — auch keine dreistellige. Das Verstecken war die einzige Möglichkeit bei
 * dieser Höhe.
 */

/** So viele Erinnerungen, alle unverbunden, mit Namen von echter Länge. */
async function saeeViele(page: Page, anzahl: number): Promise<void> {
  const vorrat = [
    'Ecobank Konto', 'Darbo', 'Research', 'Vic', 'Fahrschule', 'Moise',
    'Darbo Termin', 'Lois Macdonald', 'Prüfen', 'Barmer', 'Alassane anrufen',
    'Ticket Bayreuth', 'Zahnarzt', 'Kita Anmeldung', 'Steuer', 'Miete',
    'Oma Geburtstag', 'Impftermin', 'Passwort Bank', 'Autoschlüssel',
  ]
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
                id: `fact:${i}`,
                type: 'fact',
                label,
                createdAt: now - i * 3_600_000,
                strength: 0.2 + i * 0.03,
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
    { namen: vorrat.slice(0, anzahl) },
  )
  await page.reload()
}

/*
 * ── Der Ausschnitt ist rund, die Zeichnung war ein Streifen (08.09.) ──────
 *
 * Am Telefon liegt auf dem Band eine Kreismaske (`anitew-living.css`, erst
 * **nachgeladen**):
 *
 *     border-radius: 50%;
 *     mask-image: radial-gradient(circle, black 0 64%, transparent 92%);
 *
 * Gezeichnet wurde ein flacher Streifen bei 16:7. Gemessen, zwanzig
 * Erinnerungen: **sieben von siebzehn Namen überhaupt sichtbar, vier standen
 * frei** — der Rest lag bei 100 bis 133 Prozent des Radius, also dort, wo die
 * Maske nichts mehr durchlässt. Der Zähler „17 / 20" lag bei 133 Prozent: Er
 * war ausgeliefert und unsichtbar.
 *
 * Drei Anläufe sind daran vorbeigegangen, weil sie **vor** der nachgeladenen
 * Stilvorlage gemessen haben. Deshalb wartet jeder Wächter hier zuerst auf
 * sie (`warteAufBandform`) — und rechnet dann so, wie die Maske rechnet:
 * kreisförmig, bis zur entferntesten Ecke.
 */

/** Der Anteil des Maskenradius, bis zu dem alles voll sichtbar bleibt. */
const MASKE_FREI = 0.64

test('haelt jeden Namen im sichtbaren Ausschnitt — auch unterwegs', async ({ page }) => {
  test.setTimeout(120_000)
  await page.setViewportSize({ width: 412, height: 915 })
  await visit(page)
  await saeeViele(page, 20)
  await expect(page.locator('.constellation-label').first()).toBeVisible({ timeout: 30_000 })
  await warteAufBandform(page)

  const befund = await page.evaluate((frei) => {
    const div = document.querySelector('.constellation') as HTMLElement
    const r = div.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    /*
     * `radial-gradient(circle, …)` misst kreisförmig und ohne weitere Angabe
     * bis zur **entferntesten Ecke**. Getrennt nach Breite und Höhe zu
     * normieren ergäbe eine Ellipse und damit falsche Zahlen — dieser Fehler
     * ist mir beim Messen selbst unterlaufen.
     */
    const maskenRadius = Math.hypot(r.width / 2, r.height / 2)
    const anteil = (el: Element): number => {
      const b = el.getBoundingClientRect()
      const ecken: [number, number][] = [
        [b.left, b.top], [b.right, b.top], [b.left, b.bottom], [b.right, b.bottom],
      ]
      return Math.max(...ecken.map(([x, y]) => Math.hypot(x - cx, y - cy))) / maskenRadius
    }

    const ebenen = [...document.querySelectorAll('.constellation .constellation-layer')] as SVGGElement[]
    const namen = [...document.querySelectorAll('.constellation .constellation-label')]
    const schlimmst = namen.map(() => 0)
    const ueber = new Set<string>()
    // Acht Auslenkungen der Ebenen — der schlimmste Fall, nicht der Moment.
    for (let k = 0; k < 8; k++) {
      const w = (k / 8) * 2 * Math.PI
      for (const e of ebenen) {
        e.style.setProperty('transform', `translate(${2.6 * Math.cos(w)}px, ${2.6 * Math.sin(w)}px)`, 'important')
      }
      const kaesten = namen.map((n) => ({ t: n.textContent ?? '', r: n.getBoundingClientRect() }))
      namen.forEach((n, i) => { schlimmst[i] = Math.max(schlimmst[i] as number, anteil(n)) })
      for (let i = 0; i < kaesten.length; i += 1) {
        for (let j = i + 1; j < kaesten.length; j += 1) {
          const a = kaesten[i]!.r
          const b = kaesten[j]!.r
          if (a.right - 1 > b.left && b.right - 1 > a.left && a.bottom - 1 > b.top && b.bottom - 1 > a.top) {
            ueber.add(`${kaesten[i]!.t} × ${kaesten[j]!.t}`)
          }
        }
      }
    }
    for (const e of ebenen) e.style.removeProperty('transform')

    const zaehler = document.querySelector('.constellation-window')
    return {
      namen: namen.length,
      verblasst: namen
        .map((n, i) => ({ t: n.textContent ?? '', a: Math.round(100 * (schlimmst[i] as number)) }))
        .filter(({ a }) => a > frei * 100)
        .map(({ t, a }) => `${t} bei ${a} %`),
      ueber: [...ueber],
      zaehler: zaehler === null ? -1 : Math.round(100 * anteil(zaehler)),
      zaehlerText: (zaehler?.textContent ?? '').trim(),
    }
  }, MASKE_FREI)

  expect(befund.namen, 'es standen keine Namen zum Prüfen da').toBeGreaterThanOrEqual(6)
  expect(
    befund.verblasst,
    `diese Namen geraten unter die Maske (frei ist bis ${MASKE_FREI * 100} % des Radius): ${befund.verblasst.join('; ')}`,
  ).toEqual([])
  expect(befund.ueber, `Namen liegen übereinander: ${befund.ueber.join(', ')}`).toEqual([])

  /*
   * Und der Zähler muss dort stehen, wo man ihn sieht. Er sagt „so viele von
   * so vielen" — eine Angabe, die unter der Maske liegt, ist keine Angabe.
   */
  expect(befund.zaehler, `der Zähler „${befund.zaehlerText}" fehlt ganz`).toBeGreaterThan(-1)
  expect(
    befund.zaehler,
    `der Zähler „${befund.zaehlerText}" steht bei ${befund.zaehler} % des Radius und ist damit weggeblendet`,
  ).toBeLessThanOrEqual(MASKE_FREI * 100)
})
