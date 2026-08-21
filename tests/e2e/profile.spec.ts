import { expect, test, type Page } from '@playwright/test'

import { leavePage, openPage, startButton, visit } from './helpers.ts'

/**
 * Das Gedächtnisprofil im Browser (Backlog E3, E4, E7 · D-021).
 *
 * Die gefährlichste Anzeige der App: Sie sieht aus wie ein Befund über einen
 * Menschen. Geprüft wird deshalb überwiegend, was **nicht** dasteht.
 */

/** Legt Termine mit Abfragen und Rückfällen je Modul in die Datenbank. */
async function seed(page: Page, rows: readonly { module: string; reviews: number; lapses: number }[]) {
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await page.evaluate(async (list) => {
    const open = indexedDB.open('anitew')
    const database: IDBDatabase = await new Promise((resolve, reject) => {
      open.onsuccess = () => resolve(open.result)
      open.onerror = () => reject(open.error)
    })
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction('itemStates', 'readwrite')
      const store = transaction.objectStore('itemStates')
      list.forEach((row, index) => {
        store.put({
          itemId: `${row.module}:de:stueck${index}`,
          moduleId: row.module,
          language: 'de',
          createdAt: 1,
          lastSeenAt: 1,
          reviews: row.reviews,
          lapses: row.lapses,
          stability: 3,
          difficulty: 5,
          fsrsState: 2,
          dueDay: '2099-01-01',
        })
      })
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
  }, rows as { module: string; reviews: number; lapses: number }[])
  await page.reload()
  await expect(startButton(page)).toBeVisible()
  await openPage(page, 'Memory DNA')
}

test('zeigt vor der ersten Aussage einen Satz statt neun leerer Achsen', async ({ page }) => {
  /*
   * Neun Achsen ohne Zahl sähen aus wie neun Defizite. Und der Satz sagt
   * zugleich, woher das Profil kommt: aus dem Training, nicht aus einem Test
   * am Anfang (D-021).
   */
  await seed(page, [])
  await expect(page.getByText(/Das Profil entsteht aus dem Training/)).toBeVisible()
  await expect(page.locator('.axis')).toHaveCount(9)
  await expect(page.locator('.axis-source')).toHaveCount(9)
})

test('sagt bei dünner Datenlage „zu wenig“ und nicht „null“ (E7)', async ({ page }) => {
  // Fünf Gelegenheiten, alle verloren. Eine Null stünde da wie ein Ergebnis —
  // es ist aber gar keins.
  await seed(page, [
    { module: 'words', reviews: 6, lapses: 5 },
    { module: 'faces', reviews: 21, lapses: 2 },
  ])

  const words = page.locator('.axis', { hasText: 'Wörter' })
  await expect(words).toContainText('Noch zu wenige Gelegenheiten')
  await expect(words).toContainText('bisher 5 von 15')
  await expect(words).not.toContainText('%')
})

test('zeigt Gemessenes mit seiner Spanne', async ({ page }) => {
  await seed(page, [{ module: 'faces', reviews: 21, lapses: 4 }])

  const faces = page.locator('.axis', { hasText: 'Namen & Gesichter' })
  await expect(faces).toContainText('16 von 20 behalten')
  await expect(faces).toContainText('Spanne')
})

test('sagt nirgends mehr „misst diese App nicht“ — jede Achse hat eine Quelle', async ({
  page,
}) => {
  await seed(page, [{ module: 'words', reviews: 21, lapses: 3 }])

  // Seit dem Bild-Modul (Visuell), den Zwillingen (Auseinanderhalten,
  // D-027) und dem Rückwärts-Modul (Arbeitsgedächtnis, D-026) misst jede
  // der neun Achsen — ohne Daten sagen sie „zu wenig“, nie „nichts“.
  await expect(page.getByText('Misst diese App nicht.')).toHaveCount(0)
  for (const name of ['Visuell', 'Ähnliches auseinanderhalten', 'Arbeitsgedächtnis']) {
    await expect(page.locator('.axis', { hasText: name })).toContainText(
      'Noch zu wenige Gelegenheiten',
    )
  }
  // Und den langfristigen Abruf überlässt sie der Messung (F1).
  await expect(page.locator('.axis', { hasText: 'Langfristiger Abruf' })).toContainText(
    'Quelle: wissenschaftliche Messung',
  )
})

test('nennt keine Schwachstelle, wo der Unterschied Zufall sein kann (R-1)', async ({ page }) => {
  await seed(page, [
    { module: 'words', reviews: 21, lapses: 5 },
    { module: 'numbers', reviews: 21, lapses: 6 },
  ])
  await expect(page.getByText(/Kein Unterschied zwischen den Achsen/)).toBeVisible()
})

test('nennt sie, wenn der Unterschied deutlich ist', async ({ page }) => {
  await seed(page, [
    { module: 'words', reviews: 61, lapses: 3 },
    { module: 'numbers', reviews: 61, lapses: 40 },
  ])
  await expect(page.getByText('Am wenigsten bleibt hier hängen: Zahlen')).toBeVisible()
})

test('hält den Trainingsscore heraus (F1)', async ({ page }) => {
  /*
   * Der Satz, auf den es ankommt: Was am Lerntag passiert, ist Übung. Es hier
   * mitzuzählen wäre genau die Vermischung, gegen die die ganze Trennung
   * gebaut ist.
   */
  await seed(page, [{ module: 'words', reviews: 21, lapses: 3 }])
  await expect(page.getByText(/das ist Übung, nicht Gedächtnis/)).toBeVisible()
})

test('zeigt die Sofort-Achse als das, was sie ist (D7, D-026)', async ({ page }) => {
  /*
   * Das Arbeitsgedächtnis zählt sofortige Antworten, kein Wiedersehen — die
   * Zeile muss das sagen, sonst stünde eine andere Zahl im selben Gewand
   * (R-1). Gezählt wird aus dem Ereignisprotokoll; hier werden zwanzig
   * Antworten hineingelegt, fünf davon daneben.
   */
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await page.evaluate(async () => {
    const open = indexedDB.open('anitew')
    const database: IDBDatabase = await new Promise((resolve, reject) => {
      open.onsuccess = () => resolve(open.result)
      open.onerror = () => reject(open.error)
    })
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction('events', 'readwrite')
      const store = transaction.objectStore('events')
      for (let index = 0; index < 20; index++) {
        store.put({
          sessionId: 's-seed',
          at: 1000 + index,
          moduleId: 'recall',
          module: 'reverse',
          itemId: `9137${index}`,
          kind: 'answered',
          correct: index >= 5,
          latencyMs: 900,
        })
      }
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
  })
  await page.reload()
  await expect(startButton(page)).toBeVisible()
  await openPage(page, 'Memory DNA')

  const working = page.locator('.axis', { hasText: 'Arbeitsgedächtnis' })
  await expect(working).toContainText('sofort, nicht nach Tagen')
  // 15 von 20 gehalten — mit Spanne, wie jede Achse.
  await expect(working).toContainText('15')
  await expect(working).toContainText('20')

  // Und als schwächste wird sie nie genannt — zwei Währungen (D-026):
  // Der Startbildschirm kündigt keinen Schwerpunkt aus ihr an.
  await leavePage(page)
  await expect(page.locator('.focus')).toHaveCount(0)
})

test('kündigt einen Schwerpunkt an und sagt, warum (E5, E6)', async ({ page }) => {
  /*
   * Personalisierung, die man sieht, statt einer, die behauptet wird. Und der
   * zweite Satz gehört dazu: Ein Schwerpunkt, der wie ein Urteil über einen
   * Menschen klingt, wäre die Diagnose, die D-021 ausschließt.
   */
  await seed(page, [
    { module: 'words', reviews: 61, lapses: 3 },
    { module: 'numbers', reviews: 61, lapses: 40 },
  ])
  // Der Schwerpunkt steht auf dem Startbildschirm, nicht auf der Profilseite.
  await leavePage(page)

  await expect(page.locator('.focus')).toContainText('Heute mit Schwerpunkt: Zahlen')
  await expect(page.locator('.focus-why')).toBeVisible()
  await expect(page.locator('.focus-why')).not.toHaveText('')
})

test('kündigt keinen an, wo der Unterschied Zufall sein kann', async ({ page }) => {
  await seed(page, [
    { module: 'words', reviews: 21, lapses: 5 },
    { module: 'numbers', reviews: 21, lapses: 6 },
  ])
  // Der Schwerpunkt steht auf dem Startbildschirm, nicht auf der Profilseite.
  await leavePage(page)
  await expect(page.locator('.focus')).toHaveCount(0)
})

test('behält einen räumlichen Schwerpunkt auch im Notfallmodus, weil D12 dort trainierbar ist', async ({ page }) => {
  /*
   * Seit D12 misst die räumliche Achse eine eigene 3×3-Positionsaufgabe.
   * Anders als der Gedächtnispalast ist dieses Modul auch in 60 Sekunden
   * sinnvoll trainierbar. Der Startbildschirm darf den gemessenen Schwerpunkt
   * deshalb im Notfallmodus nicht mehr künstlich ausblenden.
   */
  await seed(page, [
    { module: 'words', reviews: 61, lapses: 3 },
    { module: 'spatial', reviews: 61, lapses: 40 },
  ])
  await leavePage(page)

  await expect(page.locator('.focus')).toContainText('Räumlich')
  await page.getByRole('button', { name: '60 Sekunden' }).click()
  await expect(page.locator('.focus')).toContainText('Räumlich')
})
