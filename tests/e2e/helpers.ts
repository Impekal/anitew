import { expect, type Page } from '@playwright/test'

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

/** Startet den Notfallmodus und überspringt das Ankommen. */
export async function startEmergency(page: Page) {
  await page.getByRole('button', { name: '60 Sekunden' }).click()
  await page.getByRole('button', { name: 'Beginnen' }).click()
  // Das Ankommen (D-011/G-1) lässt sich antippen — im Test warten wir nicht
  // drei Sekunden auf einen atmenden Kreis.
  await page.locator('.settle').click()
}

/** Liest die Szene einer Mission, wenn gerade eine dasteht. */
export async function sceneOf(page: Page): Promise<Map<string, string> | undefined> {
  if ((await page.locator('.scene').count()) === 0) return undefined
  const labels = await page.locator('.scene-facts dt').allTextContents()
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
  while (seen.length < limit) {
    if ((await page.locator('.recall-input').count()) > 0) break
    const text = (await word.textContent().catch(() => null))?.trim()
    if (text !== undefined && text !== '' && text !== seen[seen.length - 1]) seen.push(text)
    await page.waitForTimeout(150)
  }
  return { items: seen }
}

/** Welche Sorte Abruf steht gerade an? */
export async function recallKind(page: Page): Promise<'prompted' | 'free'> {
  await page.locator('.recall-input').first().waitFor({ timeout: 60_000 })
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
    await input.waitFor({ timeout: 30_000 })
    const skip = give === 'none' || (give === 'allButLast' && index === total - 1)
    if (!skip) await input.fill(await answerAt(page, learned, index))
    await page.getByRole('button', { name: 'Fertig' }).click()
  }
}

/** Die Antwort für die Stelle, an der der Abruf gerade steht. */
async function answerAt(page: Page, learned: Learned, index: number): Promise<string> {
  if (learned.scene === undefined) return learned.items[index] ?? ''
  const question = ((await page.locator('.prompted .hint').first().textContent()) ?? '').trim()
  // Im Wiedersehensblock steht ein Vorspann davor („Und von früher: …“) —
  // gesucht ist die Frage selbst.
  const asked = question.replace(/^.*?von früher:\s*/i, '')
  const label = MISSION_LABEL_OF_QUESTION.get(asked)
  expect(label, `unbekannte Frage: „${question}“`).toBeDefined()
  return learned.scene.get(label as string) ?? ''
}
