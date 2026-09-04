import { expect, test, type Page } from '@playwright/test'

import { startButton, visit } from './helpers.ts'

/**
 * Die Merktechnik, im Browser nachgeprüft (Backlog D5).
 *
 * D5 ist der Satz, an dem sich ANITEW von jeder Brain-Game-App unterscheidet:
 * **Merktechniken werden beigebracht, nicht nur abgefragt.** Geprüft wird
 * deshalb nicht, ob irgendwo eine Lektion auftaucht, sondern die Kette, auf
 * die es ankommt: unterrichten → bewusst weitergehen → sofort anwenden lassen
 * → beim nächsten Mal die nächste Ziffer.
 */

/** Die Ziffern, die das Major-System lehrt, in der Reihenfolge der Lektionen. */
const TEACH_ORDER = [1, 2, 3, 4, 5, 9, 7, 8, 0, 6]

async function continueLesson(page: Page) {
  const button = page.locator('.lesson-continue')
  await expect(button).toBeVisible({ timeout: 10_000 })
  await button.click()
}

async function currentBlockSeconds(page: Page): Promise<number> {
  return page.evaluate(() => {
    return new Promise<number>((resolve, reject) => {
      const open = indexedDB.open('anitew')
      open.onsuccess = () => {
        const request = open.result
          .transaction('settings')
          .objectStore('settings')
          .get('activeSession')
        request.onsuccess = () => {
          const value = request.result?.value as
            | { blockIndex?: number; plan?: { blocks?: { seconds?: number }[] } }
            | undefined
          const index = value?.blockIndex ?? 0
          const seconds = value?.plan?.blocks?.[index]?.seconds
          if (typeof seconds === 'number') resolve(seconds)
          else reject(new Error('kein laufender Block mit Sekunden'))
        }
        request.onerror = () => reject(request.error)
      }
      open.onerror = () => reject(open.error)
    })
  })
}

/**
 * Setzt den Lernstand, bevor die Einheit beginnt.
 *
 * `method` sagt, ob das **Verfahren** des Major-Systems schon erklärt ist.
 * Voreingestellt ja: Die meisten Prüfungen hier handeln von den einzelnen
 * Ziffern, und die Verfahrenslektion stünde ihnen sonst jedes Mal davor.
 */
async function seedTaught(page: Page, digits: readonly number[], method = true) {
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await page.evaluate(async ({ value, method }) => {
    const open = indexedDB.open('anitew')
    const database: IDBDatabase = await new Promise((resolve, reject) => {
      open.onsuccess = () => resolve(open.result)
      open.onerror = () => reject(open.error)
    })
    await new Promise<void>((resolve, reject) => {
      const store = database.transaction('settings', 'readwrite').objectStore('settings')
      store.put({ key: 'technique.major.taught', value })
      /* Der Palast gilt als erklärt: Diese Prüfungen handeln vom Major-System. */
      store.put({ key: 'technique.palace.taught', value: true })
      /* Geschichte und Verknüpfung ebenso; ihre Semantik hat eigene Prüfungen. */
      store.put({ key: 'technique.story.taught', value: true })
      store.put({ key: 'technique.link.taught', value: true })
      const request = store.put({ key: 'technique.major.method.taught', value: method })
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }, { value: digits, method })
  await page.reload()
}

async function startShort(page: Page) {
  await page.getByRole('button', { name: '3 Minuten' }).click()
  await startButton(page).click()
  await page.locator('.settle').click()
}

test('der Gedächtnispalast bleibt stehen, bis der Mensch bewusst weitergeht', async ({ page }) => {
  test.setTimeout(120_000)

  // Frischer Lernstand: Der Palast ist die erste Techniklektion.
  await visit(page)
  await startShort(page)
  await expect(page.getByText('Der Gedächtnispalast')).toBeVisible({ timeout: 30_000 })
  await expect(page.locator('.lesson-continue')).toBeVisible({ timeout: 10_000 })

  const seconds = await currentBlockSeconds(page)
  await page.waitForTimeout((seconds + 1) * 1000)

  // Früher wäre der Runner jetzt automatisch weitergesprungen. Lesen besitzt
  // jetzt die Zeit: kein Countdown und kein Fortschritt ohne bewussten Tipp.
  await expect(page.getByText('Der Gedächtnispalast')).toBeVisible()
  await expect(page.locator('.lesson-continue')).toBeVisible()
  const pointerEvents = await page
    .locator('.lesson-card')
    .evaluate((element) => getComputedStyle(element).pointerEvents)
  expect(pointerEvents).toBe('none')

  await continueLesson(page)
  await expect(page.getByText('Der Gedächtnispalast')).toBeHidden()
})

test('unterrichtet die Geschichten-Methode vor der ersten Ziffer (D5)', async ({ page }) => {
  test.setTimeout(120_000)

  // Nur der Palast gilt als erklärt — Geschichte und Verknüpfung nicht:
  // Genau dann gehört die erste Lektion der Geschichte, nicht der Eins.
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await page.evaluate(async () => {
    const open = indexedDB.open('anitew')
    const database: IDBDatabase = await new Promise((resolve, reject) => {
      open.onsuccess = () => resolve(open.result)
      open.onerror = () => reject(open.error)
    })
    await new Promise<void>((resolve, reject) => {
      const request = database
        .transaction('settings', 'readwrite')
        .objectStore('settings')
        .put({ key: 'technique.palace.taught', value: true })
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  })
  await page.reload()
  await expect(startButton(page)).toBeVisible()
  await startShort(page)

  await expect(page.locator('.lesson')).toBeVisible({ timeout: 30_000 })
  await expect(page.getByText('Die Geschichten-Methode')).toBeVisible()
  await expect(page.getByText(/je absurder, desto fester/)).toBeVisible()

  await continueLesson(page)
  await expect(page.locator('.encode-word')).toBeVisible({ timeout: 30_000 })
  const hint = ((await page.locator('.encode .hint').first().textContent()) ?? '').trim()
  expect(hint).toContain('Ein Wort nach dem anderen')
})

test('unterrichtet die Technik und lässt sie sofort anwenden', async ({ page }) => {
  test.setTimeout(120_000)

  await seedTaught(page, [])
  await startShort(page)

  await expect(page.locator('.lesson')).toBeVisible({ timeout: 30_000 })
  await expect(page.getByText('Ziffern sind schwer zu behalten')).toBeVisible()
  await expect(page.locator('.lesson-digit')).toHaveText('1')
  await expect(page.locator('.lesson-letters')).toHaveText('t · d')
  await expect(page.getByText('Das kleine t hat einen Abstrich')).toBeVisible()

  await continueLesson(page)

  await expect(page.locator('.encode-word')).toBeVisible({ timeout: 30_000 })
  const shown = (await page.locator('.encode-word').textContent())?.trim() ?? ''
  // Zahlen dürfen als merkbare Gruppen erscheinen (z. B. „37 299“); die
  // Aussage dieses Tests ist, dass nach der Lektion sofort echtes
  // Zahlenmaterial kommt — keine Buchstaben oder Platzhalter.
  expect(shown).toMatch(/^\d+(?:\s+\d+)*$/)
})

test('verlangt nach der ersten Lektion keine sechsstellige Zahl', async ({ page }) => {
  test.setTimeout(120_000)

  /*
   * Nutzerbefund 04.09., wörtlich: „Ich lerne (erstmal nur) t und d für 1 und
   * … soll gleich mehrere 6-stellige Ziffern anmerken können. Wie soll das
   * gehen, wenn ich noch nicht viele Wörter im Katalog für 1 habe?"
   *
   * Der Befund stimmte. Gemessen vor dem Eingriff: 24 Zahlen in einer
   * Fünf-Minuten-Einheit, sieben davon sechsstellig — bei einer gelehrten
   * Ziffer genau so viele wie bei allen zehn.
   *
   * Warum das nicht bloß unangenehm war: Das Major-System fasst zwei Ziffern
   * zu einem Wort. Mit einer gelernten Ziffer ist ein zufälliges Paar in
   * einem von hundert Fällen brauchbar; vier Sekunden für sechs Ziffern sind
   * dann kein Anwenden der Technik.
   *
   * Geprüft wird **jede** Zahl, die der Einprägen-Block zeigt, nicht die
   * erste: Der Befund lautete „mehrere".
   */
  await seedTaught(page, [1])
  await startShort(page)

  await expect(page.locator('.lesson')).toBeVisible({ timeout: 30_000 })
  await continueLesson(page)
  await expect(page.locator('.encode-word')).toBeVisible({ timeout: 30_000 })

  const gesehen = new Set<string>()
  while ((await page.locator('.recall-input').count()) === 0) {
    const roh = (await page.locator('.encode-word').textContent())?.trim() ?? ''
    const nochmal = (await page.locator('.encode-word').textContent())?.trim() ?? ''
    // Zweimal lesen und nur nehmen, was stehen geblieben ist: Der Block
    // schaltet weiter, und ein Wechsel mitten im Lesen ergäbe ein Bruchstück.
    if (roh !== '' && roh === nochmal) gesehen.add(roh)
    await page.waitForTimeout(150)
  }

  expect(gesehen.size, 'die Runde zeigte gar keine Zahl').toBeGreaterThan(0)
  for (const zahl of gesehen) {
    // Ohne die Gruppierungs-Zwischenräume, die `displayNumber` ab fünf
    // Ziffern setzt — gezählt werden Ziffern, nicht Zeichen.
    const ziffern = zahl.replace(/\s/gu, '')
    expect(ziffern, `„${zahl}" ist keine Ziffernfolge`).toMatch(/^\d+$/u)
    expect(ziffern.length, `„${zahl}" hat ${ziffern.length} Ziffern`).toBeLessThanOrEqual(3)
  }
})

test('schreibt den Konsonanten unter seine Ziffer — auch den frisch gelernten', async ({
  page,
}) => {
  test.setTimeout(180_000)

  const fresh = String(TEACH_ORDER[TEACH_ORDER.length - 1])

  for (let attempt = 0; attempt < 3; attempt++) {
    await seedTaught(page, TEACH_ORDER.slice(0, -1))
    await startShort(page)
    await expect(page.locator('.lesson-digit')).toHaveText(fresh, { timeout: 30_000 })
    await continueLesson(page)
    await expect(page.locator('.encode-word')).toBeVisible({ timeout: 30_000 })

    const seen = new Set<string>()
    let used = false
    while (!used && (await page.locator('.recall-input').count()) === 0) {
      const shown = (await page.locator('.encode-word').textContent())?.trim() ?? ''
      const letters = await page.locator('.major-letters span').allTextContents()
      const still = (await page.locator('.encode-word').textContent())?.trim() ?? ''

      if (shown !== '' && shown === still && !seen.has(shown)) {
        seen.add(shown)
        expect(letters, shown).toHaveLength(shown.length)
        for (const [index, digit] of [...shown].entries()) {
          expect(letters[index], `unter der Ziffer ${digit} von ${shown}`).not.toBe('·')
        }
        used = shown.includes(fresh)
      }
      await page.waitForTimeout(200)
    }

    if (used) {
      await expect(page.getByText('Mach ein Wort daraus')).toBeVisible()
      return
    }
    await page.getByRole('button', { name: 'Abbrechen' }).click()
    await expect(startButton(page)).toBeVisible()
  }

  throw new Error(`In drei Einheiten kam keine Zahl mit der Ziffer ${fresh} vor`)
})

test('zeigt nichts an, solange nichts gelehrt ist', async ({ page }) => {
  test.setTimeout(120_000)

  await visit(page)
  await page.getByRole('button', { name: '60 Sekunden' }).click()
  await startButton(page).click()
  await page.locator('.settle').click()

  // Die Aussage des Tests ist, dass keine Techniklektion eingeblendet wird.
  // Welches reguläre Trainingsmodul der adaptive Planer zuerst wählt, ist
  // absichtlich variabel; `.session-phase` ist der stabile Nachweis, dass der
  // erste echte Block läuft, ohne den Test an dessen heutige DOM-Form zu binden.
  await expect(page.locator('.session-phase')).toBeVisible({ timeout: 30_000 })
  await expect(page.locator('.lesson')).toBeHidden()
  await expect(page.locator('.major-letters')).toBeHidden()
})

test('hält beim nächsten Mal die nächste Lektion', async ({ page }) => {
  test.setTimeout(120_000)

  await seedTaught(page, [])
  await startShort(page)
  await expect(page.locator('.lesson-digit')).toHaveText('1', { timeout: 30_000 })
  await continueLesson(page)

  await page.getByRole('button', { name: 'Abbrechen' }).click()
  await expect(startButton(page)).toBeVisible()

  await startShort(page)

  await expect(page.locator('.lesson-digit')).toHaveText('2', { timeout: 30_000 })
  /*
   * Hier stand bis zur Gerätemeldung vom 01.09. das Gegenteil: Ab der
   * zweiten Ziffer sollte der Zweck **verschwinden** (G-2, kein Möbel). Der
   * Melder hat gezeigt, was das in der Hand bedeutet — „die kleine 2 hat
   * 2 Striche wie n“ ohne ein Wort dazu, worum es überhaupt geht. Der
   * Anspruch ist deshalb umgedreht, nicht gelockert: Der Satz muss stehen.
   */
  await expect(page.getByText('Ziffern sind schwer zu behalten')).toBeVisible()
})

test('erklärt erst das Verfahren, dann die erste Ziffer (D5)', async ({ page }) => {
  test.setTimeout(120_000)

  // Nichts gelernt, Verfahren nie erklärt — der Zustand jedes neuen Menschen
  // und, bis heute, auch der jedes bestehenden.
  await seedTaught(page, [], false)
  await startShort(page)

  await expect(page.locator('.lesson')).toBeVisible({ timeout: 30_000 })
  /*
   * Der Name steht in seiner eigenen Zeile, nicht irgendwo auf dem Bildschirm.
   *
   * Vorher suchte der Test den Text frei; seit die Lektion auch erklärt, WAS
   * das Major-System ist, kommt der Name zweimal vor — als Überschrift und im
   * Erklärsatz. Frei gesucht ist das mehrdeutig. Gemeint war immer die
   * Überschrift.
   */
  await expect(page.locator('.lesson .lesson-intro')).toHaveText('Das Major-System')
  // Und die Erklärung selbst: was es ist, wozu es hilft — vor den Schritten.
  await expect(page.locator('.lesson .lesson-what')).toHaveCount(2)
  /*
   * Das Beispiel muss in **beide Richtungen** dastehen: Wer nur 4–7 → „Rakete“
   * liest, weiß immer noch nicht, wie er aus dem Bild die Ziffern zurückholt.
   *
   * Geprüft wird die Sache, nicht der Satz. Vorher standen hier zwei feste
   * Wortlaute (`Aus 4–7 wird r–k`, `Rakete → r–k → 4–7`), und der Test wurde
   * rot, als die Lektion auf Nutzerwunsch in einfachere Sprache umgeschrieben
   * wurde — obwohl beide Richtungen weiterhin dastanden. Ein Test, der am
   * Wortlaut hängt, verbietet das Umschreiben, statt den Anspruch zu sichern.
   *
   * Jetzt zählt die **Reihenfolge** innerhalb eines Schrittes: einmal Ziffern
   * vor dem Wort, einmal das Wort vor den Ziffern. Wer eine der beiden
   * Richtungen streicht, bekommt weiterhin Rot.
   */
  const schritte = await page.locator('.lesson-steps li').allTextContents()
  const hinweg = schritte.some((schritt) => /4[\s\S]*7[\s\S]*Rakete/u.test(schritt))
  const rueckweg = schritte.some((schritt) => /Rakete[\s\S]*4[\s\S]*7/u.test(schritt))
  expect(hinweg, `keine Richtung Ziffern → Wort in:\n${schritte.join('\n')}`).toBe(true)
  expect(rueckweg, `keine Richtung Wort → Ziffern in:\n${schritte.join('\n')}`).toBe(true)
  // Und die Laute dazwischen — ohne sie ist „4–7 wird Rakete“ reine Behauptung.
  expect(schritte.join(' ')).toMatch(/\br\b[\s\S]*\bk\b/u)
  // Und keine Ziffernkarte: Das Verfahren ist ein eigener Schritt.
  await expect(page.locator('.lesson-digit')).toHaveCount(0)

  await continueLesson(page)

  // Unmittelbar danach, in derselben Einheit, die erste Ziffer.
  await expect(page.locator('.lesson-digit')).toHaveText('1', { timeout: 30_000 })
  await expect(page.locator('.lesson-letters')).toHaveText('t · d')

  await continueLesson(page)
  await expect(page.locator('.encode-word')).toBeVisible({ timeout: 30_000 })
})
