import { expect, test, type Page } from '@playwright/test'

import { pollFirstModule, startButton, visit } from './helpers.ts'

/**
 * Lange Ziffernfolgen (Nutzerwunsch 04.09.).
 *
 * Wörtlich: „Das kann ruhig bis zu dreißig, 60 Zeichen gehen je nachdem. Aber
 * das muss halt stufenweise sein und wenn ich weiterkomme, darf das mehr."
 *
 * Der Kerntest prüft die Leiter, den Vorrat und die Uhr einzeln. Hier steht
 * das, was nur die ganze Kette zeigt: dass ein **Beleg in den Rohdaten** —
 * eine einzige richtig abgerufene sechsstellige Folge — am Bildschirm
 * ankommt. Zwischen dem Ereignis und der gezeigten Zahl liegen vier Stellen:
 * `loadLongestRecalled`, `numberLengthFor`, `numberPool` und der Planer. Geht
 * eine davon verloren, bleibt die App bei sechs Ziffern stehen, und niemand
 * merkt es — genau das war der Zustand bis heute.
 */

/** Alle zehn Ziffern gelehrt, alle Techniken erklärt, ein Beleg über sechs. */
async function seedProof(page: Page, digits: string) {
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await page.evaluate(async (itemId) => {
    const open = indexedDB.open('anitew')
    const database: IDBDatabase = await new Promise((resolve, reject) => {
      open.onsuccess = () => resolve(open.result)
      open.onerror = () => reject(open.error)
    })
    await new Promise<void>((resolve, reject) => {
      const store = database.transaction('settings', 'readwrite').objectStore('settings')
      store.put({ key: 'technique.major.taught', value: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] })
      store.put({ key: 'technique.palace.taught', value: true })
      store.put({ key: 'technique.story.taught', value: true })
      store.put({ key: 'technique.link.taught', value: true })
      const request = store.put({ key: 'technique.major.method.taught', value: true })
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
    await new Promise<void>((resolve, reject) => {
      const request = database
        .transaction('events', 'readwrite')
        .objectStore('events')
        .put({
          sessionId: 'beleg',
          at: Date.now() - 86_400_000,
          moduleId: 'recall',
          module: 'numbers',
          itemId,
          kind: 'answered',
          correct: true,
        })
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }, digits)
  await page.reload()
  await expect(startButton(page)).toBeVisible()
}

/** Sammelt alles, was der Einprägeblock an Zahlen zeigt. */
async function collectNumbers(page: Page): Promise<string[]> {
  const gesehen = new Set<string>()
  const frist = Date.now() + 90_000
  while ((await page.locator('.recall-input').count()) === 0 && Date.now() < frist) {
    const lies = async () =>
      (
        (await page
          .locator('.encode-word')
          .textContent({ timeout: 500 })
          .catch(() => '')) ?? ''
      ).trim()
    const einmal = await lies()
    const nochmal = await lies()
    if (einmal !== '' && einmal === nochmal) gesehen.add(einmal)
    await page.waitForTimeout(150)
  }
  return [...gesehen]
}

/**
 * Startzeiten, die im belegten Stand eine **Zahlenrunde** ziehen.
 *
 * Vorher stand hier ein Würfel: vierzig Anläufe, und wenn keiner davon
 * `numbers` zog, ein „in vierzig Anläufen kam keine Zahlenrunde". Genau so
 * ist dieser Test am 07.09. in CI gefallen — nicht, weil an der App etwas
 * falsch war, sondern weil die Würfel schlecht fielen.
 *
 * Gemessen, vierzig aufeinanderfolgende Startsekunden in genau dem Stand,
 * den `seedProof` herstellt:
 *
 *   numbers      3, 29
 *   associative  0, 1, 5, 22, 35        spatial   6, 15, 21, 27
 *   twins        2, 10                  missions  7, 17, 23, 26, 38
 *   people       4, 13, 25              palace    8, 9, 24, 34
 *   words        11, 14, 16, 18, 32     gaze      12, 20, 31, 39
 *   reverse      19, 30                 math      28, 33, 36
 *   faces        37
 *
 * Zwei von vierzig — **fünf Prozent je Anlauf**. Vierzig blinde Anläufe
 * verfehlen die Runde damit in 0,95^40 ≈ **13 %** der Läufe, und CI fährt
 * jeden Push zweimal. Das ist kein seltenes Flackern, das ist ein Viertel
 * aller Pushes. Die Anlaufzahl zu erhöhen wäre die falsche Antwort: Der
 * Würfel bliebe, er würde nur seltener sichtbar.
 *
 * Deshalb dieselbe Lösung wie in `reverse.spec.ts`: die Uhr anhalten und die
 * gemessene Sekunde anspringen. `setFixedTime` hält nur `Date.now()` an;
 * Zeitgeber und `performance.now()` laufen weiter, die Einheit misst ihre
 * Sekunden also unverändert.
 *
 * Ändert der Planer sein Verhalten, wird dieser Test nicht launisch, sondern
 * eindeutig — und die Meldung unten sagt, was zu tun ist.
 */
const ZAHLEN_ZEITEN = [
  Date.UTC(2026, 0, 15, 9, 0, 3),
  Date.UTC(2026, 0, 15, 9, 0, 29),
]

test('ein Beleg über sechs Ziffern kommt am Bildschirm an', async ({ page }) => {
  test.setTimeout(300_000)
  /*
   * Die Uhr **vor** dem Belegen anhalten: `seedProof` schreibt das Ereignis
   * auf `Date.now() - 86_400_000`. Erst danach anzuhalten legte den Beleg in
   * die Zukunft der App-Uhr — und ein Beleg von morgen ist keiner.
   */
  await page.clock.setFixedTime(new Date(ZAHLEN_ZEITEN[0] as number))
  await seedProof(page, '482913')

  const gezogen: string[] = []
  for (const zeit of ZAHLEN_ZEITEN) {
    await page.clock.setFixedTime(new Date(zeit))
    await page.reload()
    await expect(startButton(page)).toBeVisible()
    await page.getByRole('button', { name: '3 Minuten' }).click()
    await startButton(page).click()
    await page.locator('.settle').click()

    const modul = await pollFirstModule(page)
    gezogen.push(modul)
    if (modul !== 'numbers') {
      await page.locator('.session-abort').click()
      await expect(page.locator('.challenge')).toBeVisible()
      continue
    }

    await expect(page.locator('.encode-word')).toBeVisible({ timeout: 30_000 })
    const gezeigt = await collectNumbers(page)
    expect(gezeigt.length, 'die Runde zeigte gar keine Zahl').toBeGreaterThan(0)

    for (const zahl of gezeigt) {
      const ziffern = zahl.replace(/\s/gu, '')
      expect(ziffern, `„${zahl}" ist keine Ziffernfolge`).toMatch(/^\d+$/u)
      /*
       * Der Kern: **keine drei-, vier- oder fünfstellige Folge mehr.** Wer
       * sechs belegt hat, übt sechs und acht — nicht wieder von vorn. Vor
       * diesem Eingriff streute der Vorrat von drei bis zur Decke, und die
       * Decke war sechs.
       */
      expect([6, 8], `„${zahl}" hat ${ziffern.length} Ziffern`).toContain(ziffern.length)

      // Und die achtstellige steht in Zweiergruppen da — zwei Ziffern sind
      // ein Wort im Major-System, Dreiergruppen liefen quer dazu.
      if (ziffern.length === 8) expect(zahl).toMatch(/^\d{2} \d{2} \d{2} \d{2}$/u)
    }
    return
  }
  throw new Error(
    `keine der gemessenen Startsekunden zog eine Zahlenrunde, gezogen wurde ${gezogen.join(', ')} — ` +
      'der Planer hat seine Zuordnung geändert. Sekunden neu durchzählen und ' +
      'ZAHLEN_ZEITEN oben ersetzen (die Tabelle im Kommentar mit).',
  )
})
