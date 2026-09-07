import { expect, test, type Locator } from '@playwright/test'

import { openPage, startButton, visit } from './helpers.ts'

/**
 * Zeit zum Einprägen (Nutzerbefund 05.09.).
 *
 * Wörtlich: „Man hat kaum Zeit, sich was auszudenken."
 *
 * Gemessen waren es vier Sekunden je Stück, in jedem Modus dieselben. Hier
 * wird geprüft, was davon am Gerät ankommt: dass die Wahl da ist, dass sie
 * wirkt und dass sie bleibt.
 */

/*
 * Denselben echten Click-Handler auslösen, ohne auf die Rückkehr-Animation zu
 * warten: Der Startknopf ist sichtbar und bedienbar, gilt Playwright wegen der
 * laufenden Animation aber minutenlang als „nicht stabil". Dieselbe Hilfe
 * benutzt `layout.spec.ts` aus demselben Grund.
 */
async function clickDirect(target: Locator): Promise<void> {
  await target.evaluate((el) => (el as HTMLElement).click())
}

test('lässt die Zeit zum Einprägen wählen — und behält die Wahl', async ({ page }) => {
  await visit(page)
  await openPage(page, 'Einstellungen')

  const feld = page.locator('.language', { hasText: 'Zeit zum Einprägen' }).locator('select')
  await expect(feld).toBeVisible()
  await expect(feld.locator('option')).toHaveCount(3)

  // Voreingestellt ist „normal" — niemand soll erst etwas einstellen müssen,
  // um eine brauchbare Einheit zu bekommen.
  await expect(feld).toHaveValue('normal')

  await feld.selectOption('much')
  await expect(feld).toHaveValue('much')

  /*
   * Der eigentliche Beweis, dass die Wahl gespeichert wird und nicht nur im
   * Bildschirm steht: einmal neu laden.
   */
  await page.reload()
  await openPage(page, 'Einstellungen')
  await expect(
    page.locator('.language', { hasText: 'Zeit zum Einprägen' }).locator('select'),
    'die Wahl hat das Neuladen nicht überlebt',
  ).toHaveValue('much')
})

test('gibt bei mehr Zeit jedem Stück mehr Sekunden — bei gleich langer Einheit', async ({
  page,
}) => {
  /*
   * Die Zusage hinter dem Regler: Die Einheit bleibt gleich lang. Mehr Zeit je
   * Stück heißt deshalb weniger Stücke, nicht eine längere Einheit — sonst
   * wäre die Wahl nur ein anderes Wort für „länger üben".
   *
   * Geprüft werden die **Sekunden je Stück** und nicht die Stückzahl. Der
   * erste Anlauf tat das und war rot mit „viel: 5 Stück, wenig: 5 Stück": Es
   * war zufällig eine Szene gezogen worden, und eine Mission hat immer genau
   * fünf Tatsachen — Person, Zimmer, Gegenstand, Uhrzeit, Ort. Die Stückzahl
   * ist dort keine Frage der Zeit, die Zeit je Tatsache schon.
   *
   * Gelesen wird im Plan, den die App gerade abarbeitet: Auf dem Bildschirm
   * steht immer nur ein Stück, und der Block verrät seine Länge sonst nirgends.
   */
  const takt = async (): Promise<number> =>
    page.evaluate(
      () =>
        new Promise<number>((resolve, reject) => {
          const open = indexedDB.open('anitew')
          open.onsuccess = () => {
            const request = open.result
              .transaction('settings')
              .objectStore('settings')
              .get('activeSession')
            request.onsuccess = () => {
              const value = request.result?.value as
                | { plan?: { blocks?: { kind?: string; seconds?: number; items?: string[] }[] } }
                | undefined
              const block = value?.plan?.blocks?.find((entry) => entry.kind === 'encode')
              const sekunden = block?.seconds
              const stuecke = block?.items?.length
              if (sekunden === undefined || stuecke === undefined || stuecke === 0) {
                reject(new Error('kein Einprägeblock'))
              } else {
                resolve(sekunden / stuecke)
              }
            }
            request.onerror = () => reject(request.error)
          }
          open.onerror = () => reject(open.error)
        }),
    )

  const laufen = async (wahl: string): Promise<number> => {
    await visit(page)
    await openPage(page, 'Einstellungen')
    const feld = page.locator('.language', { hasText: 'Zeit zum Einprägen' }).locator('select')
    await feld.selectOption(wahl)
    await expect(feld).toHaveValue(wahl)
    await page.locator('.page-back').click()
    await expect(startButton(page)).toBeVisible()
    await clickDirect(startButton(page))
    /*
     * Gewartet wird auf den **Plan**, nicht auf den Bildschirm: Auf einem
     * frischen Gerät steht am Anfang eine Lektion, und `.encode-word` käme
     * erst danach. `expect.poll`, weil das Schreiben einen Augenblick nach dem
     * Tipp geschieht — ein blankes Lesen träfe den Zustand davor.
     */
    await expect.poll(async () => takt().catch(() => 0), { timeout: 20_000 }).toBeGreaterThan(0)
    const gemessen = await takt()
    /*
     * Die Einheit muss weg, ehe die nächste gemessen wird. Ohne das war der
     * Test rot mit „viel: 13s, wenig: 13s": Beim zweiten Durchgang setzte die
     * App die **erste** Einheit fort — eine unterbrochene Einheit bleibt
     * stehen, das ist eine Zusage der App (B5) —, und gelesen wurde deshalb
     * zweimal derselbe Plan.
     */
    await page.getByRole('button', { name: 'Abbrechen' }).first().click()
    await expect(startButton(page)).toBeVisible({ timeout: 15_000 })
    return gemessen
  }

  const ruhig = await laufen('much')
  const hastig = await laufen('little')
  expect(ruhig, `viel: ${ruhig}s je Stück, wenig: ${hastig}s`).toBeGreaterThan(hastig)
})
