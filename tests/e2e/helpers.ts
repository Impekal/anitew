import { expect, type Locator, type Page } from '@playwright/test'

/**
 * Gemeinsame Handgriffe für die Durchläufe im Browser.
 *
 * Der Grund, warum es diese Datei gibt, ist eine Lehre aus M4: Seit es mehr
 * als ein Modul gibt, **wechselt die Einheit von Mal zu Mal die Sorte**. Der
 * Plan zieht das Modul aus dem Seed, und der Seed enthält die Startzeit — ein
 * 60-Sekunden-Durchlauf ist mal Wörter, mal Gesichter, mal Zahlen, mal eine
 * Mission.
 *
 * Die Tests hatten das vorher fest angenommen und suchten immer das Textfeld
 * des freien Abrufs. Vier von ihnen wurden rot, sobald die Gesichter dazukamen
 * — nicht weil die App kaputt war, sondern weil der Test geraten hat. Deshalb
 * gilt hier: **Der Test liest ab, was die App zeigt, statt vorherzusagen, was
 * sie zeigen wird.**
 */

/**
 * Was in einer Einheit eingeprägt wurde.
 *
 * Zwei Formen, weil die App zwei kennt: eine Reihe einzelner Stücke (Wörter,
 * Gesichter, Zahlen) — oder **eine Szene**, in der die Stücke an Etiketten
 * hängen und die Fragen später in einer anderen Reihenfolge kommen als die
 * Anzeige (siehe `answerRecall`).
 */
export interface Learned {
  /** Die Stücke in der Reihenfolge, in der sie gezeigt wurden. */
  items: string[]
  /** Nur bei einer Mission: die Tatsachen nach ihrem Etikett. */
  scene?: Map<string, string>
}

/**
 * Farbschlüssel → deutscher Name, wie die App sie abfragt. Die Zeichnung
 * trägt den Schlüssel als `data-color`; geantwortet wird mit dem Namen.
 */
const GAZE_COLOR_NAME = new Map([
  ['red', 'Rot'],
  ['blue', 'Blau'],
  ['green', 'Grün'],
  ['yellow', 'Gelb'],
  ['purple', 'Lila'],
  ['orange', 'Orange'],
])

/** Die Frage einer Mission und das Etikett, unter dem ihre Antwort steht. */
const MISSION_LABEL_OF_QUESTION = new Map([
  ['Welche Nummer?', 'Nummer'],
  ['Welche Zimmernummer?', 'Nummer'],
  ['Was hatte sie oder er dabei?', 'Dabei'],
  ['Wo lag der Gegenstand?', 'Dabei'],
  ['Wann war es?', 'Zeit'],
  ['Wann ging es los?', 'Zeit'],
  ['Wie hieß der Ort?', 'Ort'],
  ['Wie hieß das Restaurant?', 'Ort'],
])

/**
 * Der Startknopf der Trainingseinheit.
 *
 * Absichtlich über die Klasse und nicht über den Namen: Playwright vergleicht
 * zugängliche Namen von Haus aus als Teilzeichenkette und ohne Rücksicht auf
 * Groß- und Kleinschreibung. Seit M3 steht auf dem Startbildschirm auch
 * „Messung beginnen“ — damit fand `{ name: 'Beginnen' }` zwei Knöpfe, und
 * sechs Prüfungen wurden rot, ohne dass an der App etwas kaputt war.
 *
 * Ein `exact: true` hätte hier nicht geholfen: Der Knopf trägt die Dauer mit
 * im Namen („5:00 Beginnen“). Die Klasse ist das eindeutige Merkmal.
 */
export function startButton(page: Page): Locator {
  return page.locator('button.start')
}

/**
 * Öffnet die App und überspringt das Kennenlernen (Onboarding), falls es
 * dasteht. Beim allerersten Öffnen stellt die App ihre Fragen; fast alle
 * Prüfungen wollen aber den Startbildschirm — und ein zweites Öffnen im
 * selben Durchlauf zeigt die Fragen nicht mehr, weil die Antwort (auch die
 * leere) gespeichert ist. Geprüft wird, was da ist, nicht was da sein müsste.
 *
 * Seit dem First-Run-Pass gibt es danach noch eine **einmalige Orientierung**
 * über die echte Oberfläche. Die wird in `firstRunExperience.spec.ts` selbst
 * vollständig geprüft. Alle anderen Produkttests überspringen sie hier
 * bewusst, sobald der gespeicherte Pending-Marker sagt, dass sie ansteht.
 * Sonst würde ein Onboarding-Overlay fachfremde Training-, Memory- und
 * Navigationstests blockieren und sie in lange Click-Timeouts schicken.
 */
export async function visit(page: Page) {
  await page.goto('/')
  await page.locator('.arrival, .challenge').first().waitFor()
  if ((await page.locator('.arrival').count()) > 0) {
    // „Direkt starten“ ist der stille Weg am Willkommensschritt — über die
    // Klasse gefunden, nicht über den Namen (die alte Teilzeichenketten-Falle).
    await page.locator('.arrival .quiet').click()
    await page.locator('.challenge').waitFor()
  }

  const guideExpected = await page.evaluate(() => {
    try {
      return (
        window.localStorage.getItem('anitew.first-run-guide.pending.v2') === '1' &&
        window.localStorage.getItem('anitew.first-run-guide.v2') !== '1'
      )
    } catch {
      return false
    }
  })

  if (guideExpected) {
    const guide = page.locator('.first-run-guide')
    await guide.waitFor({ state: 'visible', timeout: 8_000 })
    await page.locator('.first-run-guide-skip').click()
    await expect(guide).toBeHidden()
  }
}

/**
 * Öffnet eine Core-Seite. Nach der neuen Hierarchie kann der Core bereits
 * offen sein, etwa direkt nach „Zurück“ aus einer Unterseite. In diesem Fall
 * darf der Helfer nicht noch einmal auf den hinter dem Overlay liegenden
 * Core-Knopf klicken. Ist der vorige Core gerade erst am Schließen, warten wir
 * außerdem auf das Ende des Veil-Übergangs, bevor der nächste Klick kommt.
 */
export async function openPage(page: Page, label: string) {
  const drawer = page.locator('.drawer')
  const veil = page.locator('.drawer-veil')
  if (!(await drawer.isVisible())) {
    if (await veil.isVisible().catch(() => false)) {
      await expect(veil).toBeHidden({ timeout: 5_000 })
    }
    await page.locator('button.hamburger').click()
    await expect(drawer).toBeVisible()
  }
  await page.locator('.drawer-item', { hasText: label }).click()
  await page.locator('.page').waitFor()
}

/**
 * Verlässt eine Core-Unterseite bewusst bis zum Startbildschirm.
 * Produktregel bleibt: der erste Zurück-Schritt führt in den Core. Tests, die
 * danach wieder mit Trainingsknöpfen arbeiten wollen, schließen den Core hier
 * ausdrücklich als zweiten Schritt. Der Core öffnet nach `popstate` über zwei
 * Animation-Frames; deshalb warten wir auf ihn, statt seinen Zustand zu früh
 * mit `isVisible()` abzufragen.
 */
export async function leavePage(page: Page) {
  await page.locator('.page-back').click()
  await page.locator('.page').waitFor({ state: 'hidden' })

  const drawer = page.locator('.drawer')
  const veil = page.locator('.drawer-veil')
  await expect(drawer).toBeVisible({ timeout: 5_000 })
  await page.keyboard.press('Escape')
  await expect(drawer).toBeHidden()
  if ((await veil.count()) > 0) await expect(veil).toBeHidden({ timeout: 5_000 })
  await page.locator('.challenge').waitFor()
}

/**
 * Startet den Notfallmodus und überspringt das Ankommen.
 *
 * Rückwärts und D12-Spatial haben eigene Antwortformen. Die vielen älteren
 * E2E-Helfer, die anschließend `collectItems`/`answerRecall` verwenden,
 * lesen dagegen bewusst nur Wort-/Prompt-/Szenenrunden. Deshalb werden diese
 * beiden spezialisierten Module hier neu gezogen; ihre Semantik wird in ihren
 * eigenen E2E- und Kerntests geprüft. So rät der gemeinsame Helfer nicht über
 * eine Antwortform, die er gar nicht lesen kann.
 */
export async function startEmergency(page: Page) {
  for (let attempt = 0; attempt < 25; attempt++) {
    await page.getByRole('button', { name: '60 Sekunden' }).click()
    await startButton(page).click()
    // Das Ankommen (D-011/G-1) lässt sich antippen — im Test warten wir
    // nicht drei Sekunden auf einen atmenden Kreis.
    await page.locator('.settle').click()

    const moduleId = await pollFirstModule(page)
    if (moduleId !== 'reverse' && moduleId !== 'spatial') {
      await expect(page.locator('.encode-word, .scene').first()).toBeVisible({
        timeout: 15_000,
      })
      return
    }

    await page.locator('.session-abort').click()
    await expect(page.locator('.challenge')).toBeVisible()
  }
  throw new Error('in 25 Anläufen kam keine kompatible Runde mit Terminen')
}

/** Das Modul des ersten Blocks, aus dem persistierten Plan gelesen. */
export async function pollFirstModule(page: Page): Promise<string> {
  const deadline = Date.now() + 15_000
  for (;;) {
    const moduleId = await page.evaluate(() => {
      return new Promise<string | undefined>((resolve) => {
        const open = indexedDB.open('anitew')
        open.onsuccess = () => {
          const request = open.result
            .transaction('settings')
            .objectStore('settings')
            .get('activeSession')
          request.onsuccess = () => {
            const value = request.result?.value as
              | { plan?: { blocks?: { moduleId?: string }[] } }
              | undefined
            resolve(value?.plan?.blocks?.[0]?.moduleId)
          }
          request.onerror = () => resolve(undefined)
        }
        open.onerror = () => resolve(undefined)
      })
    })
    if (moduleId !== undefined) return moduleId
    expect(Date.now(), 'kein Plan im Speicher erschienen').toBeLessThan(deadline)
    await page.waitForTimeout(100)
  }
}

/**
 * Liest die Szene, wenn gerade eine dasteht.
 *
 * Zwei Module bauen eine: die **Mission** (vier sichtbare Zeilen, fünf
 * Tatsachen an einer Person) und der **Palast** (fünf Dinge an fünf Orten).
 * Sie sehen im Aufbau gleich aus, und deshalb liest der Test sie auch gleich
 * — mit einem Unterschied: Beim Gang steht vor jeder Station ihre Nummer.
 * Die gehört zur Anzeige und nicht zum Etikett, also wird die Beschriftung
 * dort aus ihrem eigenen Element gelesen statt aus dem ganzen `dt`.
 */
export async function sceneOf(page: Page): Promise<Map<string, string> | undefined> {
  if ((await page.locator('.scene').count()) === 0) return undefined
  /*
   * Ein Bild (Achse „Visuell“) hat keine Etiketten — es hat Zeichnungen.
   * Gelesen wird über die Datenattribute: Ding-Schlüssel → Farbname.
   */
  const glyphs = page.locator('.gaze-scene .gaze-glyph')
  if ((await glyphs.count()) > 0) {
    const pairs = new Map<string, string>()
    for (const glyph of await glyphs.all()) {
      const object = (await glyph.getAttribute('data-object')) ?? ''
      const color = (await glyph.getAttribute('data-color')) ?? ''
      const name = GAZE_COLOR_NAME.get(color)
      expect(name, `unbekannte Farbe: „${color}“`).toBeDefined()
      pairs.set(object, name as string)
    }
    return pairs
  }
  const stations = await page.locator('.walk-station').allTextContents()
  const labels =
    stations.length > 0 ? stations : await page.locator('.scene-facts dt').allTextContents()
  const values = await page.locator('.scene-facts dd').allTextContents()
  return new Map(labels.map((label, index) => [label.trim(), (values[index] ?? '').trim()]))
}

/**
 * Liest mit, was eingeprägt wird.
 *
 * Für alle Module: Beim Wortmodul steht in `.encode-word` das Wort, beim
 * Gesichtsmodul der Name unter dem Bild, beim Zahlenmodul die Zahl. Eine
 * **Mission** hat kein `.encode-word` — dort steht die ganze Szene auf einmal,
 * und gelesen wird sie über ihre Etiketten.
 *
 * Endet, sobald der Abruf beginnt; wie viele Stücke gezeigt werden, bestimmt
 * der Plan und nicht der Test.
 */
export async function collectItems(page: Page, limit = 12): Promise<Learned> {
  const scene = await sceneOf(page)
  if (scene !== undefined) return { items: [...scene.values()], scene }

  const word = page.locator('.encode-word')
  const seen: string[] = []
  const deadline = Date.now() + 90_000
  while (seen.length < limit) {
    if ((await page.locator('.recall-input, .twin-choice').count()) > 0) break
    expect(Date.now(), 'der Abruf hat nicht begonnen').toBeLessThan(deadline)
    const text = (await word.textContent({ timeout: 1000 }).catch(() => null))?.trim()
    if (text !== undefined && text !== '' && text !== seen[seen.length - 1]) seen.push(text)
    await page.waitForTimeout(150)
  }
  return { items: seen }
}

/** Welche Sorte Abruf steht gerade an? */
export async function recallKind(page: Page): Promise<'prompted' | 'free'> {
  await page.locator('.recall-input, .twin-choice').first().waitFor({ timeout: 60_000 })
  return (await page.locator('.prompted').count()) > 0 ? 'prompted' : 'free'
}

/** Wie viel geantwortet wird. */
export type Give = 'all' | 'none' | 'allButLast'

/** Beantwortet den offenen Abrufblock und lässt ihn hinter sich. */
export async function answerRecall(page: Page, learned: Learned, give: Give) {
  if ((await recallKind(page)) === 'free') {
    const wanted =
      give === 'allButLast' ? learned.items.slice(0, -1) : give === 'all' ? learned.items : []
    if (wanted.length > 0) await page.locator('.recall-input').fill(wanted.join('\n'))
    await page.getByRole('button', { name: 'Fertig' }).click()
    return
  }

  const label = (await page.locator('.prompted .hint').last().textContent()) ?? ''
  const total = Number(label.split('/')[1]?.trim())
  expect(total, `„${label}“ nennt keine Anzahl`).toBeGreaterThan(0)

  for (let index = 0; index < total; index++) {
    const input = page.locator('.prompted-input')
    const choice = page.locator('.twin-choice')
    await input.or(choice).first().waitFor({ timeout: 30_000 })
    const skip = give === 'none' || (give === 'allButLast' && index === total - 1)

    if ((await choice.count()) > 0) {
      const words = (await choice.allTextContents()).map((word) => word.trim())
      const right = words.find((word) => learned.items.includes(word)) ?? words[0] ?? ''
      const wrong = words.find((word) => word !== right) ?? right
      await page
        .locator('.twin-choices')
        .getByRole('button', { name: skip ? wrong : right, exact: true })
        .click()
      continue
    }

    if (!skip) await input.fill(await answerAt(page, learned, index))
    await page.getByRole('button', { name: 'Fertig' }).click()
  }
}

/** Die Antwort für die Stelle, an der der Abruf gerade steht. */
async function answerAt(page: Page, learned: Learned, index: number): Promise<string> {
  const reveal = page.locator('.reveal-digits')
  if ((await reveal.count()) > 0) {
    const digits = ((await reveal.textContent()) ?? '').trim()
    return [...digits].reverse().join('')
  }

  if (learned.scene === undefined) return learned.items[index] ?? ''

  const askedGlyph = page.locator('.gaze-asked .gaze-glyph')
  if ((await askedGlyph.count()) > 0) {
    const object = (await askedGlyph.getAttribute('data-object')) ?? ''
    const color = learned.scene.get(object)
    expect(color, `unbekanntes Ding: „${object}“`).toBeDefined()
    return color as string
  }

  const station = page.locator('.placemark-station')
  if ((await station.count()) > 0) {
    const where = ((await station.textContent()) ?? '').trim()
    const object = learned.scene.get(where)
    expect(object, `unbekannte Station: „${where}“`).toBeDefined()
    return object as string
  }

  const question = ((await page.locator('.prompted .hint').first().textContent()) ?? '').trim()
  const asked = question.replace(/^.*?von früher:\s*/i, '')
  const label = MISSION_LABEL_OF_QUESTION.get(asked)
  expect(label, `unbekannte Frage: „${question}“`).toBeDefined()
  const value = learned.scene.get(label as string) ?? ''
  if (label === 'Dabei') {
    const [object = '', location = ''] = value.split(' · ')
    return asked === 'Wo lag der Gegenstand?' ? location : object
  }
  return value
}