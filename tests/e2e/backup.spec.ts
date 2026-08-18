import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import { expect, test, type Page, type TestInfo } from '@playwright/test'

import { answerRecall, collectItems, openPage, startEmergency, visit } from './helpers.ts'

/**
 * Die Sicherung, im Browser nachgeprüft (Backlog N2, N6).
 *
 * Der Anlass war kein theoretischer: Ein gelöschter Browserspeicher hat eine
 * Trainingshistorie mitgenommen. Was hier hängt, ist nicht wiederherstellbar —
 * ein verlorenes Dokument kann man neu laden, eine verlorene Vergessenskurve
 * (D-004) nicht.
 *
 * Geprüft wird der Fall, für den die Datei gebaut ist: **das zweite Gerät.**
 * Deshalb zwei getrennte Umgebungen und kein gelöschter Speicher — zwei
 * Kontexte haben zwei Datenbanken, so wie zwei Telefone. Nebenbei erspart das
 * die Frage, ob ein `deleteDatabase` bei offener Verbindung überhaupt
 * durchläuft.
 */

/**
 * Ein Ablageort für Prüfdateien — **ohne Umlaute im Pfad.**
 *
 * Das ist keine Marotte, sondern eine Falle, die eine Stunde gekostet hat:
 * `setInputFiles` läuft bei einem Pfad mit Nicht-ASCII-Zeichen anstandslos
 * durch und legt die Datei trotzdem nicht in die Seite. Kein Fehler, keine
 * Ausnahme — die Meldung bleibt einfach aus, und man sucht sie in der App.
 *
 * `testInfo.outputPath()` baut den Ordnernamen aus dem Titel des Tests, und
 * die Titel hier sind deutsch („trägt die Trainingshistorie …“). Deshalb
 * liegen die Dateien eine Ebene höher, wo der Pfad aus dem Projektnamen
 * besteht.
 */
function fixturePath(testInfo: TestInfo, name: string): string {
  return join(testInfo.project.outputDir, `${testInfo.project.name}-${name}`)
}

/** Wie viele Zeilen in den Tabellen stehen, die Historie tragen. */
async function countStored(page: Page): Promise<{ itemStates: number; events: number }> {
  return page.evaluate(async () => {
    const open = indexedDB.open('anitew')
    const database: IDBDatabase = await new Promise((resolve, reject) => {
      open.onsuccess = () => resolve(open.result)
      open.onerror = () => reject(open.error)
    })
    const count = (name: string) =>
      new Promise<number>((resolve, reject) => {
        const request = database.transaction(name).objectStore(name).count()
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    return { itemStates: await count('itemStates'), events: await count('events') }
  })
}

async function openBackupPanel(page: Page) {
  await openPage(page, 'Sicherung')
  await expect(page.locator('.backup')).toBeVisible()
}

test('trägt die Trainingshistorie auf ein zweites Gerät', async ({ browser }, testInfo) => {
  test.setTimeout(180_000)

  // ── Gerät 1: einmal trainieren, dann sichern ────────────────────────────
  const first = await browser.newContext()
  const page = await first.newPage()
  await visit(page)
  await startEmergency(page)
  const learned = await collectItems(page, 8)
  await answerRecall(page, learned, 'all')
  await expect(page.getByRole('heading', { name: 'Geblieben' })).toBeVisible({ timeout: 30_000 })
  await page.getByRole('button', { name: 'Zurück' }).click()

  const before = await countStored(page)
  expect(before.itemStates).toBeGreaterThan(0)
  expect(before.events).toBeGreaterThan(0)

  await openBackupPanel(page)
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Sicherung speichern' }).click(),
  ])

  // Der Tag steht im Namen, damit im Downloadordner nicht „anitew (3).json“
  // liegt und niemand weiß, welche die jüngere ist.
  expect(download.suggestedFilename()).toMatch(/^anitew-sicherung-\d{4}-\d{2}-\d{2}\.json$/)
  const file = fixturePath(testInfo, 'sicherung.json')
  await download.saveAs(file)
  await expect(page.getByText(/Gespeichert: \d+ Datensätze/)).toBeVisible()
  await first.close()

  // ── Gerät 2: leer, liest die Datei ein ──────────────────────────────────
  const second = await browser.newContext()
  const fresh = await second.newPage()
  // Auch das zweite Gerät sieht zuerst das Kennenlernen — und überspringt es.
  await visit(fresh)
  expect((await countStored(fresh)).itemStates).toBe(0)

  await openBackupPanel(fresh)
  await fresh.locator('input[type=file]').setInputFiles(file)
  await expect(fresh.getByText(/Eingelesen:/)).toBeVisible({ timeout: 30_000 })

  const after = await countStored(fresh)
  expect(after.itemStates).toBe(before.itemStates)
  expect(after.events).toBe(before.events)

  /*
   * Und noch einmal dieselbe Datei. Das ist der Fall, der in der Wirklichkeit
   * ständig vorkommt — man ist sich nicht sicher, ob es geklappt hat, und
   * tippt es noch einmal an. Es darf nichts doppelt entstehen.
   */
  await fresh.locator('input[type=file]').setInputFiles(file)
  await expect(fresh.getByText(/Eingelesen: 0 neu dazu/)).toBeVisible({ timeout: 30_000 })
  expect(await countStored(fresh)).toEqual(after)

  await second.close()
})

test('sagt bei einer fremden Datei, was los ist — und schimpft nicht', async ({
  page,
}, testInfo) => {
  await visit(page)
  await openBackupPanel(page)

  const foreign = fixturePath(testInfo, 'fremd.json')
  await writeFile(foreign, JSON.stringify({ hello: 'world' }), 'utf8')
  await page.locator('input[type=file]').setInputFiles(foreign)
  // G-5: Die App schimpft nicht. Sie sagt, was sie vor sich hat.
  await expect(page.getByText('Das ist keine ANITEW-Sicherung.')).toBeVisible()

  const broken = fixturePath(testInfo, 'kaputt.json')
  await writeFile(broken, 'das ist kein JSON', 'utf8')
  await page.locator('input[type=file]').setInputFiles(broken)
  await expect(page.getByText(/lässt sich nicht lesen/)).toBeVisible()
})
