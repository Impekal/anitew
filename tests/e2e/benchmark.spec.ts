import { expect, test, type Page } from '@playwright/test'

import { openPage, startButton, visit } from './helpers.ts'

/**
 * Die Messung, im Browser nachgeprüft (Backlog F1, F2, F2a, F2b, F3, F5).
 *
 * M3 ist die **Release-Sperre**: Ohne diesen Mechanismus darf ANITEW keine
 * einzige Aussage über das Gedächtnis eines Nutzers machen. Geprüft wird
 * deshalb nicht nur, dass gemessen wird — sondern vor allem, **was die App
 * nicht sagt**:
 *
 * - keine Veränderung vor der dritten Messung (Eichung, F2b),
 * - kein Erfolg, wo die Spanne die Null enthält (F3),
 * - keine Zahl aus einer unvollständigen Messung (F1),
 * - kein Wiederholungstermin für Messwörter (F2a).
 */

/** Der Tagesschlüssel, wie ihn die App bildet — Ortszeit, Grenze um 4 Uhr. */
function dayKey(offsetDays: number): string {
  const at = new Date(Date.now() + offsetDays * 86_400_000 - 4 * 3_600_000)
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${at.getFullYear()}-${pad(at.getMonth() + 1)}-${pad(at.getDate())}`
}

interface SeedRun {
  ordinal: number
  day: string
  nextDay?: number
  complete: boolean
}

/**
 * Legt Messungen in die Datenbank.
 *
 * Drei vollständige Messungen dauern in Wirklichkeit vier Wochen. Die Aussage
 * daraus wird aber aus den gespeicherten Zahlen gerechnet — deshalb lässt sie
 * sich so prüfen, und deshalb ist die Rechnung dort auch die ehrlichere
 * Lösung.
 */
async function seedRuns(page: Page, runs: readonly SeedRun[]) {
  await page.evaluate(async (list) => {
    const open = indexedDB.open('anitew')
    const database: IDBDatabase = await new Promise((resolve, reject) => {
      open.onsuccess = () => resolve(open.result)
      open.onerror = () => reject(open.error)
    })
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction('benchmarks', 'readwrite')
      const store = transaction.objectStore('benchmarks')
      for (const entry of list) {
        store.put({
          id: `seed-${entry.ordinal}`,
          day: entry.day,
          startedAt: 1,
          ordinal: entry.ordinal,
          total: 20,
          items: [],
          encodedAt: 1,
          immediate: entry.complete ? 18 : undefined,
          after20Minutes: entry.complete ? 14 : undefined,
          nextDay: entry.complete ? entry.nextDay : undefined,
          completed: entry.complete,
          abandoned: !entry.complete,
        })
      }
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
  }, runs as SeedRun[])
  await page.reload()
}

test('lädt zur ersten Messung ein und sagt, warum sie zählt', async ({ page }) => {
  await visit(page)
  await expect(startButton(page)).toBeVisible()

  // Die allererste Messung ist sofort fällig: Ohne Tag 0 gäbe es später
  // nichts, wogegen sich vergleichen ließe.
  await expect(page.getByText('Zeit für eine Messung')).toBeVisible()
  await expect(page.getByText(/die im Training nie vorkommen/)).toBeVisible()
})

test('misst mit Wörtern, die es im Training nicht gibt (F2a)', async ({ page }) => {
  test.setTimeout(180_000)

  await visit(page)
  await page.getByRole('button', { name: 'Messung beginnen' }).click()

  // Zwanzig Punkte, einer je Wort — der Aufbau ist immer derselbe (D-006).
  await expect(page.locator('.encode-word')).toBeVisible({ timeout: 30_000 })
  expect(await page.locator('.encode-dots span').count()).toBe(20)

  const shown: string[] = []
  while (shown.length < 3) {
    const word = (await page.locator('.encode-word').textContent())?.trim() ?? ''
    if (word !== '' && word !== shown[shown.length - 1]) shown.push(word)
    await page.waitForTimeout(200)
  }

  /*
   * Die Probe aufs Exempel: Kein Messwort steht im Trainingsvorrat. Beides
   * aus derselben Liste zu ziehen wäre der Fehler, an dem das ganze Genre
   * hängt — die Zahl stiege, und sie hieße nichts.
   */
  const training = await page.evaluate(() => {
    const store = (window as unknown as { __anitew?: { words?: string[] } }).__anitew
    return store?.words ?? null
  })
  expect(training, 'Der Vorrat wird nicht ins Fenster gelegt — geprüft wird im Kern').toBeNull()
  expect(shown.length).toBe(3)
})

test('sagt vor der dritten Messung keine Veränderung (F2b)', async ({ page }) => {
  await visit(page)
  await expect(startButton(page)).toBeVisible()

  await seedRuns(page, [
    { ordinal: 1, day: dayKey(-28), nextDay: 8, complete: true },
    { ordinal: 2, day: dayKey(-14), nextDay: 9, complete: true },
  ])

  await expect(page.locator('.measure-headline')).toContainText('Eichung')
  await expect(page.getByText(/Gewöhnung an ihren Ablauf/)).toBeVisible()
  // Die echten Zahlen stehen trotzdem da (F5) — sie sind gezählt.
  await expect(page.locator('.measure-series li')).toHaveCount(2)
  await expect(page.locator('.measure-count').first()).toHaveText('8/20')
})

test('verkauft ein Wort mehr nicht als Fortschritt (F3, R-1)', async ({ page }) => {
  await visit(page)
  await expect(startButton(page)).toBeVisible()

  /*
   * Der Prüfstein der ganzen Milestone. Zehn, zehn, elf von zwanzig: Das ist
   * ein Wort mehr, also fünf Prozentpunkte — bei dieser Stichprobe reines
   * Rauschen. Eine App, die daraus „+5 %“ macht, verkauft Zufall als Erfolg.
   */
  await seedRuns(page, [
    { ordinal: 1, day: dayKey(-42), nextDay: 10, complete: true },
    { ordinal: 2, day: dayKey(-28), nextDay: 10, complete: true },
    { ordinal: 3, day: dayKey(-14), nextDay: 11, complete: true },
  ])

  // F-07 (Runde 2): Der Satz behauptet Zählunsicherheit, keine Signifikanz.
  await expect(
    page.getByText(/Der Unterschied liegt innerhalb der groben Zählunsicherheit/),
  ).toBeVisible()
  await expect(page.locator('.measure-headline')).toBeHidden()
})

test('nennt einen deutlichen Unterschied mit seiner Spanne (F3)', async ({ page }) => {
  await visit(page)
  await expect(startButton(page)).toBeVisible()

  await seedRuns(page, [
    { ordinal: 1, day: dayKey(-42), nextDay: 4, complete: true },
    { ordinal: 2, day: dayKey(-28), nextDay: 4, complete: true },
    { ordinal: 3, day: dayKey(-14), nextDay: 18, complete: true },
  ])

  await expect(page.locator('.measure-headline strong')).toContainText('+')
  // Eine Spanne, kein exakter Wert: Zwanzig Wörter sind eine kleine Stichprobe.
  await expect(page.getByText(/Spanne: \+\d+ … \+\d+/)).toBeVisible()
  await expect(page.locator('.measure-series li')).toHaveCount(3)
})

test('lässt eine unvollständige Messung draußen (F1)', async ({ page }) => {
  await visit(page)
  await expect(startButton(page)).toBeVisible()

  /*
   * Zwei gültige Messungen und eine, deren Fenster verpasst wurde. Die
   * abgebrochene fehlt in der Reihe und in der Rechnung — einen fehlenden
   * Abruf zu schätzen wäre eine erfundene Zahl.
   */
  await seedRuns(page, [
    { ordinal: 1, day: dayKey(-42), nextDay: 8, complete: true },
    { ordinal: 2, day: dayKey(-28), nextDay: 9, complete: true },
    { ordinal: 3, day: dayKey(-14), complete: false },
  ])

  await expect(page.locator('.measure-series li')).toHaveCount(2)
  await expect(page.locator('.measure-headline')).toContainText('Eichung')
})

test('erklärt auf Nachfrage, was gemessen wurde (F3, F4)', async ({ page }) => {
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await seedRuns(page, [{ ordinal: 1, day: dayKey(-14), nextDay: 8, complete: true }])

  await page.getByText('Was hier gemessen wurde').click()
  await expect(page.getByText(/nie in den Wiederholungsplan wandern/)).toBeVisible()
  // F4: kein behaupteter Alltagstransfer.
  await expect(page.getByText(/Über dein Gedächtnis im Alltag sagt es nichts/)).toBeVisible()
})

test('lässt sich abbrechen und sagt, was das kostet (D-015)', async ({ page }) => {
  /*
   * Eine Messung, aus der man nicht herauskommt, wäre genau das Muster, das
   * D-015 ausschließt. Geprüft wird deshalb beides: **dass** es geht — und
   * dass die App danach sagt, was passiert ist, statt es zu verschlucken.
   */
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await page.getByRole('button', { name: 'Messung beginnen' }).click()

  // Mitten im Einprägen: Der Ausgang steht da, ohne dass man ihn suchen muss.
  await expect(page.locator('.encode-word')).toBeVisible({ timeout: 30_000 })
  await page.getByRole('button', { name: 'Messung abbrechen' }).click()

  await expect(page.getByText('Abgebrochen')).toBeVisible()
  await expect(page.getByText(/Diese Messung zählt nicht mit/)).toBeVisible()

  /*
   * Und weil noch keine Zahl entstanden ist: sofort wieder möglich. Das ist
   * die Hälfte der Regel, die es überhaupt zu prüfen gibt — die andere
   * (vierzehn Tage, sobald der erste Abruf dasteht) hängt an einer Uhr und
   * steht deshalb im Kerntest.
   */
  await expect(page.getByText(/sofort neu anfangen/)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Messung beginnen' })).toBeVisible()
})

test('nimmt nach einem Abbruch andere Wörter', async ({ page }) => {
  // Die verbrauchten Wörter kommen nicht wieder: Sie wurden gesehen, und ein
  // zweites Mal gemessen wären sie keine Messung mehr.
  await visit(page)
  await page.getByRole('button', { name: 'Messung beginnen' }).click()
  await expect(page.locator('.encode-word')).toBeVisible({ timeout: 30_000 })
  const first = ((await page.locator('.encode-word').textContent()) ?? '').trim()
  await page.getByRole('button', { name: 'Messung abbrechen' }).click()

  await page.getByRole('button', { name: 'Messung beginnen' }).click()
  await expect(page.locator('.encode-word')).toBeVisible({ timeout: 30_000 })
  const second = ((await page.locator('.encode-word').textContent()) ?? '').trim()
  expect(second).not.toBe(first)
})

test('hat eine eigene Core-Seite: Einladung wenn fällig, Reihe und Termin danach (Runde 2)', async ({
  page,
}) => {
  await visit(page)

  // Frische Datenbank: Die allererste Messung ist fällig — die Core-Seite
  // zeigt dieselbe Einladung samt Startknopf wie der Startbildschirm.
  await openPage(page, 'Messung')
  await expect(page.locator('.page-title')).toHaveText('Messung')
  await expect(
    page.locator('.benchmark-page').getByRole('button', { name: 'Messung beginnen' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Zurück' }).click()

  // Mit abgeschlossenen Messungen: kein Startknopf (nicht fällig), dafür die
  // echte Reihe und der nächste Termin — auffindbar ohne Scrollen im Fuß.
  await seedRuns(page, [
    { ordinal: 1, day: dayKey(-10), nextDay: 9, complete: true },
    { ordinal: 2, day: dayKey(-3), nextDay: 10, complete: true },
  ])
  await openPage(page, 'Messung')
  await expect(page.locator('.benchmark-page .measure-series li')).toHaveCount(2)
  await expect(
    page.locator('.benchmark-page').getByRole('button', { name: 'Messung beginnen' }),
  ).toBeHidden()
  await expect(page.getByText(/Die nächste Messung ist ab dem/)).toBeVisible()
})

test('ein Doppeltipp auf „Messung beginnen" erzeugt nie zwei Messungen (R3-04)', async ({
  page,
}) => {
  await visit(page)
  await expect(startButton(page)).toBeVisible()

  /*
   * Der echte Nebenläufigkeitsfall: zwei Klicks, so schnell wie der Browser
   * sie absetzt. Vorher lasen beide Aufrufe dieselbe höchste Ordnungszahl
   * und schrieben beide — es entstanden zwei offene Messungen. Jetzt liegt
   * die Regel in einer Transaktion unter der Oberfläche, und der Knopf ist
   * schon beim ersten Tipp gesperrt.
   */
  // Zwei Klicks im selben Ausführungsschritt — härter als jeder menschliche
  // Doppeltipp, weil React dazwischen nicht neu zeichnen kann.
  await page.evaluate(() => {
    const start = [...document.querySelectorAll('button')].find((button) =>
      button.textContent?.includes('Messung beginnen'),
    )
    start?.click()
    start?.click()
  })

  await expect(page.locator('.encode-word')).toBeVisible({ timeout: 30_000 })

  const open = await page.evaluate(async () => {
    const request = indexedDB.open('anitew')
    const database: IDBDatabase = await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    const rows: { completed: boolean; abandoned?: boolean; ordinal: number }[] = await new Promise(
      (resolve, reject) => {
        const query = database.transaction('benchmarks').objectStore('benchmarks').getAll()
        query.onsuccess = () => resolve(query.result as never)
        query.onerror = () => reject(query.error)
      },
    )
    return {
      total: rows.length,
      offen: rows.filter((row) => !row.completed && row.abandoned !== true).length,
      ordinals: rows.map((row) => row.ordinal),
    }
  })

  expect(open.offen, 'höchstens eine offene Messung').toBe(1)
  expect(open.total, 'kein zweiter Lauf angelegt').toBe(1)
  expect(open.ordinals).toEqual([1])
})
