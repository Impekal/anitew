import { expect, test } from '@playwright/test'

/**
 * Release-Hardening: Ein bestehender Nutzer ist wichtiger als ein frischer
 * Install. Dieser Test baut deshalb die **echte alte Version 1** der lokalen
 * IndexedDB mit repräsentativen Daten nach, bevor irgendein ANITEW-Code die
 * Datenbank öffnen kann. Erst danach wird die aktuelle App geladen.
 *
 * Geprüft wird nicht Dexies interne/native Versionsnummer (die ist ein
 * Implementierungsdetail), sondern das Produktversprechen: Die App startet,
 * alle alten Rohdaten sind noch da, und V2 erfindet für alte Items keine
 * FSRS-Werte, die damals nie gemessen wurden.
 */
test('öffnet einen echten V1-Nutzerbestand als V2 ohne Datenverlust oder erfundene FSRS-Werte', async ({ page }) => {
  test.setTimeout(90_000)

  // Gleiche Origin wie die App, aber eine statische Seite, die weder Dexie
  // noch den App-Bootstrap lädt. So können wir zuerst exakt das alte Schema
  // anlegen.
  await page.goto('/datenschutz.html')

  await page.evaluate(async () => {
    await new Promise<void>((resolve, reject) => {
      const remove = indexedDB.deleteDatabase('anitew')
      remove.onsuccess = () => resolve()
      remove.onerror = () => reject(remove.error)
      remove.onblocked = () => reject(new Error('alte Testdatenbank ist blockiert'))
    })

    await new Promise<void>((resolve, reject) => {
      const open = indexedDB.open('anitew', 10)
      open.onupgradeneeded = () => {
        const database = open.result

        const settings = database.createObjectStore('settings', { keyPath: 'key' })

        const sessions = database.createObjectStore('sessions', { keyPath: 'id' })
        sessions.createIndex('day', 'day')
        sessions.createIndex('startedAt', 'startedAt')
        sessions.createIndex('completed', 'completed')

        const events = database.createObjectStore('events', {
          keyPath: 'id',
          autoIncrement: true,
        })
        events.createIndex('sessionId', 'sessionId')
        events.createIndex('at', 'at')
        events.createIndex('itemId', 'itemId')
        events.createIndex('moduleId', 'moduleId')

        const itemStates = database.createObjectStore('itemStates', { keyPath: 'itemId' })
        itemStates.createIndex('moduleId', 'moduleId')
        itemStates.createIndex('language', 'language')
        itemStates.createIndex('dueDay', 'dueDay')

        const benchmarks = database.createObjectStore('benchmarks', { keyPath: 'id' })
        benchmarks.createIndex('day', 'day')
        benchmarks.createIndex('ordinal', 'ordinal')
        benchmarks.createIndex('completed', 'completed')

        settings.put({ key: 'language', value: 'de' })
        sessions.put({
          id: 'legacy-session',
          day: '2026-08-18',
          mode: 'daily',
          startedAt: 1_776_500_000_000,
          endedAt: 1_776_500_300_000,
          completed: true,
        })
        events.put({
          sessionId: 'legacy-session',
          at: 1_776_500_200_000,
          moduleId: 'recall',
          itemId: 'words:de:Anker',
          kind: 'answered',
          correct: true,
          latencyMs: 1432,
        })
        itemStates.put({
          itemId: 'words:de:Anker',
          moduleId: 'words',
          language: 'de',
          createdAt: 1_776_500_000_000,
          lastSeenAt: 1_776_500_200_000,
          dueDay: '2026-08-23',
          reviews: 2,
          lapses: 1,
          // Absichtlich KEIN stability/difficulty/fsrsState/lastDay: Genau
          // diese Felder kamen mit V2 dazu und dürfen nicht rückwirkend
          // erfunden werden.
        })
        benchmarks.put({
          id: 'legacy-benchmark',
          day: '2026-08-18',
          startedAt: 1_776_400_000_000,
          ordinal: 1,
          total: 20,
          items: ['Anker', 'Berg'],
          immediate: 14,
          completed: true,
        })
      }
      open.onsuccess = () => {
        open.result.close()
        resolve()
      }
      open.onerror = () => reject(open.error)
      open.onblocked = () => reject(new Error('V1-Testdatenbank ist blockiert'))
    })
  })

  // Jetzt erst startet die aktuelle App. Ihr Dexie-Schema öffnet denselben
  // Bestand als V2.
  await page.goto('/')
  await page.locator('.arrival, .challenge').first().waitFor({ timeout: 30_000 })

  const snapshot = await page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('anitew')
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })

    const read = <T>(storeName: string, key: IDBValidKey) =>
      new Promise<T | undefined>((resolve, reject) => {
        const request = database.transaction(storeName).objectStore(storeName).get(key)
        request.onsuccess = () => resolve(request.result as T | undefined)
        request.onerror = () => reject(request.error)
      })

    const firstEvent = await new Promise<Record<string, unknown> | undefined>((resolve, reject) => {
      const request = database.transaction('events').objectStore('events').openCursor()
      request.onsuccess = () => resolve(request.result?.value as Record<string, unknown> | undefined)
      request.onerror = () => reject(request.error)
    })

    const result = {
      stores: [...database.objectStoreNames],
      setting: await read<Record<string, unknown>>('settings', 'language'),
      session: await read<Record<string, unknown>>('sessions', 'legacy-session'),
      event: firstEvent,
      item: await read<Record<string, unknown>>('itemStates', 'words:de:Anker'),
      benchmark: await read<Record<string, unknown>>('benchmarks', 'legacy-benchmark'),
    }
    database.close()
    return result
  })

  expect(snapshot.stores.sort()).toEqual(
    ['benchmarks', 'events', 'itemStates', 'sessions', 'settings'].sort(),
  )
  expect(snapshot.setting).toEqual({ key: 'language', value: 'de' })
  expect(snapshot.session).toMatchObject({
    id: 'legacy-session',
    day: '2026-08-18',
    mode: 'daily',
    completed: true,
  })
  expect(snapshot.event).toMatchObject({
    sessionId: 'legacy-session',
    moduleId: 'recall',
    itemId: 'words:de:Anker',
    kind: 'answered',
    correct: true,
    latencyMs: 1432,
  })
  expect(snapshot.benchmark).toMatchObject({
    id: 'legacy-benchmark',
    day: '2026-08-18',
    ordinal: 1,
    total: 20,
    immediate: 14,
    completed: true,
  })

  expect(snapshot.item).toMatchObject({
    itemId: 'words:de:Anker',
    moduleId: 'words',
    language: 'de',
    dueDay: '2026-08-23',
    reviews: 2,
    lapses: 1,
  })
  expect(snapshot.item).not.toHaveProperty('stability')
  expect(snapshot.item).not.toHaveProperty('difficulty')
  expect(snapshot.item).not.toHaveProperty('fsrsState')
  expect(snapshot.item).not.toHaveProperty('lastDay')
})
