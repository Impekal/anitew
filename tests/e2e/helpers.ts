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

/** Die Frage einer Mission und das Etikett, unter dem ihre Antwort steht. */
const MISSION_LABEL_OF_QUESTION = new Map([
  ['Welche Zimmernummer?', 'Zimmer'],
  ['Was hatte sie oder er dabei?', 'Dabei'],
  ['Wann ging es los?', 'Abfahrt'],
  ['Wie hieß das Restaurant?', 'Restaurant'],
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
 */
export async function visit(page: Page) {
  await page.goto('/')
  await page.locator('.arrival, .challenge').first().waitFor()
  if ((await page.locator('.arrival').count()) > 0) {
    // Der „Ohne Fragen anfangen“-Knopf ist der einzige stille auf dem
    // Willkommensschritt — über die Klasse gefunden, nicht über den Namen
    // (die alte Teilzeichenketten-Falle).
    await page.locator('.arrival .quiet').click()
    await page.locator('.challenge').waitFor()
  }
}

/**
 * Öffnet eine Menüseite: Menüknopf, dann der Eintrag mit dieser
 * Beschriftung. Seit dem Menü-Umbau ist jeder Punkt eine eigene Seite —
 * die Prüfungen gehen denselben Weg wie der Finger.
 */
export async function openPage(page: Page, label: string) {
  await page.locator('button.hamburger').click()
  await page.locator('.drawer-item', { hasText: label }).click()
  await page.locator('.page').waitFor()
}

/** Von einer Menüseite zurück auf den Startbildschirm. */
export async function leavePage(page: Page) {
  await page.locator('.page-back').click()
  await page.locator('.challenge').waitFor()
}

/**
 * Startet den Notfallmodus und überspringt das Ankommen.
 *
 * Und noch eines, seit es das Rückwärts-Modul gibt (D7): Fast alle
 * Prüfungen, die hiermit starten, setzen voraus, dass die Einheit
 * **Termine hinterlässt** — eine Rückwärts-Runde tut das absichtlich nicht
 * (D-026) und würde sie zufällig rot machen, je nachdem, was der Seed
 * zieht. Deshalb wird eine Rückwärts-Runde abgebrochen und neu gezogen;
 * das Modul selbst hat seine eigene Prüfung (`reverse.spec.ts`).
 */
export async function startEmergency(page: Page) {
  for (let attempt = 0; attempt < 25; attempt++) {
    await page.getByRole('button', { name: '60 Sekunden' }).click()
    await startButton(page).click()
    // Das Ankommen (D-011/G-1) lässt sich antippen — im Test warten wir
    // nicht drei Sekunden auf einen atmenden Kreis.
    await page.locator('.settle').click()

    /*
     * Entschieden wird am **positiven** Zeichen: Zurückgekehrt wird erst,
     * wenn ein Einprägeblock wirklich sichtbar ist — genau das, worauf
     * jeder Aufrufer als Nächstes wartet. Der erste Anlauf entschied an der
     * Abwesenheit der Ziffernanzeige und hatte damit ein Schlupfloch: Ein
     * einziger unglücklicher Lesezeitpunkt, und eine Rückwärts-Runde ging
     * als Einprägerunde durch — ein voller Lauf hat genau einmal genau das
     * getroffen. Die Ziffernanzeige wird über ihre **Anwesenheit** erkannt
     * (`count`), nicht über Sichtbarkeit: Nach drei Sekunden ist sie
     * verdeckt, aber noch da.
     */
    const learnable = page.locator('.encode-word, .scene')
    const reveal = page.locator('.reveal-digits')
    const deadline = Date.now() + 20_000
    let backwards = false
    for (;;) {
      // Anwesenheit zuerst: Die Ziffernanzeige zählt auch verdeckt.
      if ((await reveal.count()) > 0) {
        backwards = true
        break
      }
      if (await learnable.first().isVisible().catch(() => false)) {
        /*
         * Und noch einmal, einen Wimpernschlag später: Zwei volle Läufe
         * haben je genau einen Fall getroffen, in dem hier trotz einer
         * Rückwärts-Runde ein Treffer gemeldet wurde — ein Flackern beim
         * Blockaufbau, das eine Momentaufnahme für bare Münze nahm. Erst
         * wenn der Einprägeblock **stehen bleibt** und keine Ziffernanzeige
         * dazukommt, gilt er.
         */
        await page.waitForTimeout(250)
        if (
          (await reveal.count()) === 0 &&
          (await learnable.first().isVisible().catch(() => false))
        ) {
          break
        }
        continue
      }
      expect(Date.now(), 'kein erster Block erschienen').toBeLessThan(deadline)
      await page.waitForTimeout(100)
    }
    if (!backwards) return

    await page.locator('.session-abort').click()
    await expect(startButton(page)).toBeVisible()
  }
  throw new Error('in 25 Anläufen kam keine Runde mit Terminen')
}

/**
 * Liest die Szene, wenn gerade eine dasteht.
 *
 * Zwei Module bauen eine: die **Mission** (vier Tatsachen an einer Person)
 * und der **Palast** (fünf Dinge an fünf Orten). Sie sehen im Aufbau gleich
 * aus, und deshalb liest der Test sie auch gleich — mit einem Unterschied:
 * Beim Gang steht vor jeder Station ihre Nummer. Die gehört zur Anzeige und
 * nicht zum Etikett, also wird die Beschriftung dort aus ihrem eigenen
 * Element gelesen statt aus dem ganzen `dt`.
 */
export async function sceneOf(page: Page): Promise<Map<string, string> | undefined> {
  if ((await page.locator('.scene').count()) === 0) return undefined
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
  /*
   * Mit Frist, und das ist eine Lehre aus einem einzigen Fehlschlag in einem
   * vollen Lauf: Die Schleife hatte keinen Ausgang außer dem Beginn des
   * Abrufs. Als der einmal ausblieb, drehte sie drei Minuten lang, bis die
   * Prüfung an ihrer eigenen Zeitgrenze starb — mit einer Fehlermeldung, die
   * auf `waitForTimeout` zeigte und damit auf gar nichts.
   *
   * Neunzig Sekunden sind großzügig: Der längste Einprägeblock (ein Gang,
   * fünf Stationen à sechs Sekunden) dauert dreißig. Wer hier anschlägt, hat
   * kein Zeitproblem, sondern ein anderes — und liest das jetzt auch.
   */
  const deadline = Date.now() + 90_000
  while (seen.length < limit) {
    // Der Abruf beginnt mit einem Feld — oder, bei den Zwillingen (D-027),
    // mit zwei Knöpfen. Wer nur auf das Feld wartet, sitzt dort die ganze
    // Runde ab, bis die Einheit über ihn hinweg zu Ende geht.
    if ((await page.locator('.recall-input, .twin-choice').count()) > 0) break
    expect(Date.now(), 'der Abruf hat nicht begonnen').toBeLessThan(deadline)
    /*
     * Mit **kurzer** Frist, und das ist der eigentliche Fehler, den zwei
     * hängende Prüfungen gekostet haben: `textContent()` wartet von Haus aus
     * dreißig Sekunden darauf, dass es das Element gibt. Sobald der Abruf
     * beginnt, verschwindet `.encode-word` — die Schleife hing dann eine halbe
     * Minute in dieser einen Zeile, während der Abrufblock ablief und die
     * Einheit weiterlief. Wenn sie wieder aufwachte, war die Einheit vorbei
     * und `.recall-input` nie wieder da.
     *
     * **Ein Warten ohne Frist in einer Schleife, die pollen soll, schaltet
     * das Pollen ab.**
     */
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

/**
 * Wie viel geantwortet wird.
 *
 * `allButLast` lässt die letzte Antwort offen — was fehlt, gilt als nicht
 * erinnert, und das ist der Normalfall, wenn die Zeit ausläuft. Es steht als
 * Angabe am Aufruf und nicht als gekürzte Antwortliste: Bei einer Mission
 * kommen die Antworten aus der Szene und nicht aus der Liste, eine gekürzte
 * Liste bliebe dort wirkungslos. Genau das ist mir beim ersten Anlauf
 * passiert — der Test kürzte etwas, das gar nicht gelesen wurde, und erwartete
 * dann eine fehlende Antwort, die es nie gab.
 */
export type Give = 'all' | 'none' | 'allButLast'

/**
 * Beantwortet den offenen Abrufblock und lässt ihn hinter sich.
 *
 * Beim freien Abruf steht alles in einem Feld, beim gestützten kommt ein
 * Gesicht nach dem anderen. Wie viele es sind, steht in der App selbst
 * („3 / 5“) — der Test zählt nicht mit, sondern liest nach. Sonst liefe er
 * bei einer Abweichung entweder in einen Block hinein, der ihm nicht gehört,
 * oder gar nicht mehr heraus.
 *
 * Bei einer **Mission** wird nach der Frage geantwortet und nicht nach der
 * Stelle. Der Grund ist eine Lehre aus dem ersten Anlauf: Die Szene zeigt
 * Zimmer · Abfahrt · Dabei · Restaurant, gefragt wird Zimmer · Dabei ·
 * Abfahrt · Restaurant. Dass die beiden Reihenfolgen auseinanderfallen, ist
 * kein Fehler, sondern gut so — wer die Reihenfolge mitlernen kann, lernt die
 * Reihenfolge statt die Szene. Nur darf der Test sie eben nicht raten.
 */
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

    /*
     * Zwillinge (D-027) antworten per Knopf, nicht per Feld. „Nicht
     * antworten“ gibt es dort als Geste nicht — wer nichts weiß, rät. Der
     * Test bildet das ab: `skip` drückt den **falschen** Knopf. Exakter
     * Name, nicht Teilzeichenkette — die beiden Wörter sind einander zum
     * Verwechseln ähnlich, das ist ihr Beruf.
     */
    if ((await choice.count()) > 0) {
      const right = await answerAt(page, learned, index)
      const words = (await choice.allTextContents()).map((word) => word.trim())
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
  /*
   * Rückwärts (D7): Die Folge steht kurz da und wird dann nur unsichtbar,
   * nicht entfernt — der Test liest sie ab (auch verdeckt liefert
   * `textContent` den Text) und dreht sie um. Das Eintippen wartet von
   * selbst, bis das Feld freigegeben ist: `fill` tippt nie in ein
   * gesperrtes Feld.
   */
  const reveal = page.locator('.reveal-digits')
  if ((await reveal.count()) > 0) {
    const digits = ((await reveal.textContent()) ?? '').trim()
    return [...digits].reverse().join('')
  }

  if (learned.scene === undefined) return learned.items[index] ?? ''

  /*
   * Beim Palast steht die Frage nicht im Text, sondern auf dem Schild: „Was
   * lag hier?“ ist bei allen fünf Stationen dieselbe Frage — welche gemeint
   * ist, sagt der Ort darüber. Der Test liest ihn ab, statt die Reihenfolge
   * des Weges vorherzusagen; dass sie hier tatsächlich stimmt, ist eine
   * Eigenschaft der Technik und keine, auf die er sich stützen sollte.
   */
  const station = page.locator('.placemark-station')
  if ((await station.count()) > 0) {
    const where = ((await station.textContent()) ?? '').trim()
    const object = learned.scene.get(where)
    expect(object, `unbekannte Station: „${where}“`).toBeDefined()
    return object as string
  }

  const question = ((await page.locator('.prompted .hint').first().textContent()) ?? '').trim()
  // Im Wiedersehensblock steht ein Vorspann davor („Und von früher: …“) —
  // gesucht ist die Frage selbst.
  const asked = question.replace(/^.*?von früher:\s*/i, '')
  const label = MISSION_LABEL_OF_QUESTION.get(asked)
  expect(label, `unbekannte Frage: „${question}“`).toBeDefined()
  return learned.scene.get(label as string) ?? ''
}
