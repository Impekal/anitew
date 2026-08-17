import { expect, type Page } from '@playwright/test'

/**
 * Gemeinsame Handgriffe für die Durchläufe im Browser.
 *
 * Der Grund, warum es diese Datei gibt, ist eine Lehre aus M4: Seit es mehr
 * als ein Modul gibt, **wechselt die Einheit von Mal zu Mal die Sorte**. Der
 * Plan zieht das Modul aus dem Seed, und der Seed enthält die Startzeit — ein
 * 60-Sekunden-Durchlauf ist mal Wörter, mal Gesichter.
 *
 * Die Tests hatten das vorher fest angenommen und suchten immer das
 * Textfeld des freien Abrufs. Vier von ihnen wurden rot, sobald die Gesichter
 * dazukamen — nicht weil die App kaputt war, sondern weil der Test geraten
 * hat. Deshalb gilt hier: **Der Test liest ab, was die App zeigt, statt
 * vorherzusagen, was sie zeigen wird.**
 */

/** Startet den Notfallmodus und überspringt das Ankommen. */
export async function startEmergency(page: Page) {
  await page.getByRole('button', { name: '60 Sekunden' }).click()
  await page.getByRole('button', { name: 'Beginnen' }).click()
  // Das Ankommen (D-011/G-1) lässt sich antippen — im Test warten wir nicht
  // drei Sekunden auf einen atmenden Kreis.
  await page.locator('.settle').click()
}

/**
 * Liest mit, was eingeprägt wird.
 *
 * Funktioniert für beide Module: Beim Wortmodul steht in `.encode-word` das
 * Wort, beim Gesichtsmodul der Name unter dem Bild — und der Name ist genau
 * das, wonach später gefragt wird.
 *
 * Endet, sobald der Abruf beginnt; wie viele Stücke gezeigt werden, bestimmt
 * der Plan und nicht der Test.
 */
export async function collectItems(page: Page, limit = 12): Promise<string[]> {
  const word = page.locator('.encode-word')
  const seen: string[] = []
  while (seen.length < limit) {
    if ((await page.locator('.recall-input').count()) > 0) break
    const text = (await word.textContent().catch(() => null))?.trim()
    if (text !== undefined && text !== '' && text !== seen[seen.length - 1]) seen.push(text)
    await page.waitForTimeout(150)
  }
  return seen
}

/** Welche Sorte Abruf steht gerade an? */
export async function recallKind(page: Page): Promise<'prompted' | 'free'> {
  await page.locator('.recall-input').first().waitFor({ timeout: 60_000 })
  return (await page.locator('.prompted').count()) > 0 ? 'prompted' : 'free'
}

/**
 * Beantwortet den offenen Abrufblock und lässt ihn hinter sich.
 *
 * Beim freien Abruf steht alles in einem Feld, beim gestützten kommt ein
 * Gesicht nach dem anderen. Wie viele es sind, steht in der App selbst
 * („3 / 5“) — der Test zählt nicht mit, sondern liest nach. Sonst liefe er
 * bei einer Abweichung entweder in einen Block hinein, der ihm nicht gehört,
 * oder gar nicht mehr heraus.
 */
export async function answerRecall(page: Page, answers: readonly string[], give: 'all' | 'none') {
  if ((await recallKind(page)) === 'free') {
    if (give === 'all') await page.locator('.recall-input').fill(answers.join('\n'))
    await page.getByRole('button', { name: 'Fertig' }).click()
    return
  }

  const label = (await page.locator('.prompted .hint').last().textContent()) ?? ''
  const total = Number(label.split('/')[1]?.trim())
  expect(total, `„${label}“ nennt keine Anzahl`).toBeGreaterThan(0)

  for (let index = 0; index < total; index++) {
    const input = page.locator('.prompted-input')
    await input.waitFor({ timeout: 30_000 })
    if (give === 'all') await input.fill(answers[index] ?? '')
    await page.getByRole('button', { name: 'Fertig' }).click()
  }
}
