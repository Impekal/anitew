import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import { expect, test, type Page, type TestInfo } from '@playwright/test'

import { answerRecall, collectItems, openPage, startEmergency, visit } from './helpers.ts'

function fixturePath(testInfo: TestInfo, name: string): string {
  return join(testInfo.project.outputDir, `${testInfo.project.name}-${name}`)
}

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

  expect(download.suggestedFilename()).toMatch(/^anitew-sicherung-\d{4}-\d{2}-\d{2}\.json$/)
  const file = fixturePath(testInfo, 'sicherung.json')
  await download.saveAs(file)
  await expect(page.getByText(/Gespeichert: \d+ Datensätze/)).toBeVisible()
  await first.close()

  const second = await browser.newContext()
  const fresh = await second.newPage()
  await visit(fresh)
  expect((await countStored(fresh)).itemStates).toBe(0)

  await openBackupPanel(fresh)
  await fresh.locator('input[type=file]').setInputFiles(file)
  await expect(fresh.getByText(/Eingelesen:/)).toBeVisible({ timeout: 30_000 })

  const after = await countStored(fresh)
  expect(after.itemStates).toBe(before.itemStates)
  expect(after.events).toBe(before.events)

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
  await expect(page.getByText('Das ist keine ANITEW-Sicherung.')).toBeVisible()

  const broken = fixturePath(testInfo, 'kaputt.json')
  await writeFile(broken, 'das ist kein JSON', 'utf8')
  await page.locator('input[type=file]').setInputFiles(broken)
  await expect(page.getByText(/lässt sich nicht lesen/)).toBeVisible()
})

test('exportiert Support- und Beta-Berichte nur auf ausdrücklichen Fingertipp', async ({
  page,
}, testInfo) => {
  await visit(page)
  await openBackupPanel(page)

  await expect(page.getByRole('heading', { name: 'Support & Beta' })).toBeVisible()
  await expect(page.getByText(/Installierte Fassung:/)).toBeVisible()
  await expect(page.getByText(/ANITEW sendet sie nicht automatisch/)).toBeVisible()

  const [diagnosticDownload] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Diagnosebericht speichern' }).click(),
  ])
  expect(diagnosticDownload.suggestedFilename()).toMatch(/^anitew-diagnose-\d+\.json$/)
  const diagnosticFile = fixturePath(testInfo, 'diagnose.json')
  await diagnosticDownload.saveAs(diagnosticFile)
  const diagnostic = JSON.parse(await readFile(diagnosticFile, 'utf8')) as {
    privacy: Record<string, boolean>
    recentTechnicalErrors: unknown[]
  }
  expect(diagnostic.privacy).toMatchObject({
    includesMemoryContent: false,
    includesAnswers: false,
    includesPhotos: false,
    includesApiKeys: false,
    includesOauthTokens: false,
    includesRawUrls: false,
  })
  expect(Array.isArray(diagnostic.recentTechnicalErrors)).toBe(true)

  const [betaDownload] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Beta-Bericht speichern' }).click(),
  ])
  expect(betaDownload.suggestedFilename()).toMatch(/^anitew-beta-\d+\.json$/)
  const betaFile = fixturePath(testInfo, 'beta.json')
  await betaDownload.saveAs(betaFile)
  const beta = JSON.parse(await readFile(betaFile, 'utf8')) as {
    metrics: Record<string, unknown>
    privacy: Record<string, boolean>
  }
  expect(beta.privacy).toEqual({
    includesMemoryContent: false,
    includesAnswerContent: false,
    uploadedAutomatically: false,
  })
  expect(beta.metrics).toHaveProperty('completedSessions')
  expect(beta.metrics).toHaveProperty('trainingDays')
})
