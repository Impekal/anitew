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

test('exportiert weder BYOK-Schlüssel noch gerätegebundenen Drive-Zustand (F-01, Runde 2)', async ({
  page,
}, testInfo) => {
  await visit(page)

  // Gesät wird direkt in die echte settings-Tabelle — derselbe Ort, aus dem
  // der Export liest. Kein Mock: Der Test beweist den realen Dateiinhalt.
  await page.evaluate(async () => {
    const open = indexedDB.open('anitew')
    const database: IDBDatabase = await new Promise((resolve, reject) => {
      open.onsuccess = () => resolve(open.result)
      open.onerror = () => reject(open.error)
    })
    const put = (row: { key: string; value: unknown }) =>
      new Promise<void>((resolve, reject) => {
        const request = database
          .transaction('settings', 'readwrite')
          .objectStore('settings')
          .put(row)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    await put({ key: 'coach.key.gemini', value: 'AIza-geheim-e2e' })
    await put({ key: 'coach.key', value: 'sk-legacy-e2e' })
    await put({ key: 'sync.on', value: true })
    await put({ key: 'sync.lastAt', value: 123456789 })
    await put({ key: 'sync.account', value: 'mensch@example.com' })
    await put({ key: 'sync.accountName', value: 'Mensch Beispiel' })
    await put({ key: 'sync.clientId', value: 'lokale-client-id' })
    await put({ key: 'coach.provider', value: 'gemini' })
    await put({ key: 'language', value: 'en' })
  })

  await openBackupPanel(page)
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Sicherung speichern' }).click(),
  ])
  const file = fixturePath(testInfo, 'sicherung-schluessel.json')
  await download.saveAs(file)

  const content = await readFile(file, 'utf8')
  expect(content).not.toContain('AIza-geheim-e2e')
  expect(content).not.toContain('sk-legacy-e2e')
  expect(content).not.toContain('mensch@example.com')
  expect(content).not.toContain('Mensch Beispiel')
  expect(content).not.toContain('lokale-client-id')
  const parsed = JSON.parse(content) as { tables: { settings: { key: string; value: unknown }[] } }
  const keys = parsed.tables.settings.map((setting) => setting.key)
  expect(keys.some((key) => key.startsWith('coach.key'))).toBe(false)
  expect(keys.some((key) => key.startsWith('sync.'))).toBe(false)
  expect(parsed.tables.settings).toContainEqual({ key: 'coach.provider', value: 'gemini' })
  expect(parsed.tables.settings).toContainEqual({ key: 'language', value: 'en' })
})

test('verwirft gerätegebundene Werte beim Import einer älteren Sicherung', async ({
  page,
}, testInfo) => {
  await visit(page)
  await openBackupPanel(page)

  // Zuerst eine garantiert gültige Sicherung erzeugen und so verändern, wie
  // ältere ANITEW-Fassungen sie früher tatsächlich erzeugen konnten.
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Sicherung speichern' }).click(),
  ])
  const source = fixturePath(testInfo, 'sicherung-alt-basis.json')
  await download.saveAs(source)
  const legacy = JSON.parse(await readFile(source, 'utf8')) as {
    tables: { settings: { key: string; value: unknown }[] }
  }
  legacy.tables.settings.push(
    { key: 'coach.key.gemini', value: 'remote-secret-darf-nicht-rein' },
    { key: 'sync.on', value: true },
    { key: 'sync.account', value: 'remote@example.com' },
    { key: 'sync.clientId', value: 'remote-client-id' },
  )
  const legacyFile = fixturePath(testInfo, 'sicherung-alt-mit-lokalen-werten.json')
  await writeFile(legacyFile, JSON.stringify(legacy), 'utf8')

  await page.locator('input[type=file]').setInputFiles(legacyFile)
  await expect(page.getByText(/Eingelesen:/)).toBeVisible({ timeout: 30_000 })

  const forbidden = await page.evaluate(async () => {
    const open = indexedDB.open('anitew')
    const database: IDBDatabase = await new Promise((resolve, reject) => {
      open.onsuccess = () => resolve(open.result)
      open.onerror = () => reject(open.error)
    })
    const get = (key: string) =>
      new Promise<unknown>((resolve, reject) => {
        const request = database.transaction('settings').objectStore('settings').get(key)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    return Promise.all([
      get('coach.key.gemini'),
      get('sync.on'),
      get('sync.account'),
      get('sync.clientId'),
    ])
  })
  expect(forbidden).toEqual([undefined, undefined, undefined, undefined])
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
