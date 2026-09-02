import { expect, test, type Page } from '@playwright/test'

import { openPage, startButton, visit } from './helpers.ts'

/**
 * Fehlertoleranz (Backlog P7).
 *
 * Auf einem echten Gerät trifft ANITEW auf Dinge, die der Buildrechner nie
 * sieht: einen privaten Safari-Modus ohne Datenbank, einen vollen Speicher,
 * abgelehnte Benachrichtigungsrechte. Der schlimmste Ausgang ist ein weißer
 * Bildschirm — geprüft wird deshalb zuerst, dass die App **überhaupt läuft**,
 * wenn nichts gespeichert werden kann.
 */

test('läuft ohne jede Datenbank weiter (privater Modus)', async ({ page }) => {
  /*
   * IndexedDB komplett wegnehmen, bevor die App lädt — genau das tut Safari
   * im privaten Modus (historisch) und „alle Cookies blockieren“ heute noch.
   */
  await page.addInitScript(() => {
    Object.defineProperty(window, 'indexedDB', { get: () => undefined })
  })

  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(String(error)))

  await visit(page)

  // Kein weißer Bildschirm: Der Startknopf ist da.
  await expect(startButton(page)).toBeVisible({ timeout: 30_000 })

  // Und eine Einheit lässt sich trotzdem starten. Alle realen Modul-Anfänge
  // zählen: Spatial hat bewusst kein `.encode-word` und darf deshalb nicht
  // zufällig wie ein kaputter Start aussehen.
  await page.getByRole('button', { name: '60 Sekunden' }).click()
  await startButton(page).click()
  await page.locator('.settle').click()
  await expect(
    page.locator('.encode-word, .scene, .lesson, .reveal-digits, .spatial-encode').first(),
  ).toBeVisible({ timeout: 30_000 })

  expect(errors, `ungefangene Fehler: ${errors.join(' | ')}`).toEqual([])
})

test('sagt im privaten Modus, dass nichts gespeichert wird (P7, N2)', async ({ page }) => {
  /*
   * Der Unterschied zwischen einer App, die still Daten verliert, und einer,
   * die es sagt. Der Satz steht ganz oben und nicht im zugeklappten
   * Fundament-Fach — dort läse ihn niemand, bevor es zu spät ist.
   */
  await page.addInitScript(() => {
    Object.defineProperty(window, 'indexedDB', { get: () => undefined })
  })

  await visit(page)
  await expect(startButton(page)).toBeVisible({ timeout: 30_000 })
  await expect(page.getByText(/Dieses Gerät speichert gerade nichts/)).toBeVisible()
  // Mit Ausweg, nicht nur Diagnose.
  await expect(page.getByText(/ein normales Fenster benutzen/)).toBeVisible()
})

test('schweigt, wo gespeichert wird', async ({ page }) => {
  // Die Gegenprobe: Auf einem gewöhnlichen Gerät darf die Warnung nie
  // erscheinen — sonst wäre sie ein Fehlalarm, und Fehlalarme lehrt man sich
  // zu übersehen.
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await expect(page.getByText(/Dieses Gerät speichert gerade nichts/)).toHaveCount(0)
})

/**
 * Bringt eine beliebige 60-Sekunden-Einheit bis zum Abschluss, ohne etwas
 * über das zufällig gewählte Modul vorauszusetzen. Für diesen Resilience-Test
 * ist die Trefferzahl ausdrücklich egal — bewiesen wird, dass fehlender
 * Speicher den Ablauf nicht zerstört.
 */
async function finishAnySession(page: Page): Promise<void> {
  const summary = page.getByRole('heading', { name: 'Geblieben' })
  const deadline = Date.now() + 105_000

  while ((await summary.count()) === 0) {
    expect(Date.now(), 'die Einheit kam ohne Datenbank nicht zum Abschluss').toBeLessThan(deadline)

    const spatial = page.locator('.spatial-recall .spatial-cell').first()
    if (await spatial.isVisible().catch(() => false)) {
      await spatial.click()
      continue
    }

    const twin = page.locator('.twin-choice').first()
    if (await twin.isVisible().catch(() => false)) {
      await twin.click()
      continue
    }

    const prompted = page.locator('.prompted-input').first()
    if (await prompted.isVisible().catch(() => false)) {
      // Rückwärts-Ziffern sperren das Feld während der kurzen Anzeige. Erst
      // danach absenden; leere Antwort ist hier absichtlich erlaubt.
      if (await prompted.isDisabled()) {
        await expect(prompted).toBeEnabled({ timeout: 10_000 })
      }
      await page.locator('.prompted-form').getByRole('button', { name: 'Fertig' }).click()
      continue
    }

    const freeRecall = page.locator('.recall > .recall-input').first()
    if (await freeRecall.isVisible().catch(() => false)) {
      await page.locator('.recall').getByRole('button', { name: 'Fertig' }).click()
      continue
    }

    // Encode-/Lehrphasen laufen selbst weiter. Kurzes Polling hält den Test
    // schnell, ohne die Produktzeiten zu manipulieren.
    await page.waitForTimeout(150)
  }
}

test('führt eine ganze Einheit ohne Datenbank zu Ende (voller Speicher)', async ({ page }) => {
  /*
   * Derselbe Fehlerfall wie ein voller Speicher: Jeder Schreibversuch wirft.
   * Bewiesen wird, dass die Einheit trotzdem bis zur Zusammenfassung läuft —
   * die Zahl dort kommt aus dem, was im Kopf steht, nicht aus der Datenbank.
   * Nur der Fortschritt danach ist weg, und genau das sagt die Zeile oben.
   */
  test.setTimeout(120_000)

  await page.addInitScript(() => {
    Object.defineProperty(window, 'indexedDB', { get: () => undefined })
  })
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(String(error)))

  await visit(page)
  await page.getByRole('button', { name: '60 Sekunden' }).click()
  await startButton(page).click()
  await page.locator('.settle').click()

  await finishAnySession(page)

  await expect(page.getByRole('heading', { name: 'Geblieben' })).toBeVisible({ timeout: 5_000 })
  expect(errors, `ungefangene Fehler: ${errors.join(' | ')}`).toEqual([])
})

test('bleibt heil, wenn Benachrichtigungen abgelehnt sind (P7)', async ({ page }) => {
  /*
   * Abgelehnte Rechte lassen sich von der App aus nie zurücknehmen — die
   * Erinnerungsseite muss das sagen und darf nicht daran zerbrechen.
   */
  await page.addInitScript(() => {
    // Ein Browser, der Benachrichtigungen kennt, aber verweigert.
    Object.defineProperty(Notification, 'permission', { get: () => 'denied' })
  })

  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await openPage(page, 'Erinnerung')

  await expect(page.getByText(/abgelehnt/)).toBeVisible()
  // Kein Knopf, der ein Recht erbittet, das der Browser schon verweigert hat.
  await expect(page.getByRole('button', { name: 'Benachrichtigungen erlauben' })).toHaveCount(0)
  // Und keine Uhrzeit-Einstellung, die ohnehin nicht griffe.
  await expect(page.locator('.reminder input[type="time"]')).toHaveCount(0)
})

test('löscht auf Wunsch alles — aber erst nach einer echten Rückfrage (N4)', async ({ page }) => {
  /*
   * Das Löschen ist der einzige Ort, an dem die App warnt statt beruhigt.
   * Geprüft wird beides: dass ein einzelner Fehlgriff nichts anrichtet (die
   * Rückfrage), und dass ein bewusster Griff wirklich alles nimmt.
   */
  await visit(page)
  await expect(startButton(page)).toBeVisible()

  // Erst etwas anlegen, das gelöscht werden kann.
  await page.evaluate(async () => {
    const open = indexedDB.open('anitew')
    const database: IDBDatabase = await new Promise((resolve, reject) => {
      open.onsuccess = () => resolve(open.result)
      open.onerror = () => reject(open.error)
    })
    await new Promise<void>((resolve, reject) => {
      const request = database
        .transaction('itemStates', 'readwrite')
        .objectStore('itemStates')
        .put({ itemId: 'words:de:Anker', moduleId: 'words', language: 'de', createdAt: 1, reviews: 3, lapses: 0, dueDay: '2099-01-01' })
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  })

  await openPage(page, 'Sicherung')

  // Ein Klick auf „Alles löschen“ löscht noch nichts — er fragt.
  await page.locator('.wipe').getByRole('button', { name: 'Alles löschen' }).click()
  await expect(page.getByText(/Wirklich alles löschen/)).toBeVisible()

  // Abbrechen lässt alles stehen.
  await page.getByRole('button', { name: 'Abbrechen' }).click()
  const beforeCancel = await page.evaluate(() => {
    return new Promise<number>((resolve) => {
      const open = indexedDB.open('anitew')
      open.onsuccess = () => {
        const req = open.result.transaction('itemStates').objectStore('itemStates').count()
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => resolve(-1)
      }
    })
  })
  expect(beforeCancel).toBe(1)

  // Bewusst bestätigt: zweite Warnstufe plus explizite Eingabe von ANITEW.
  await page.locator('.wipe').getByRole('button', { name: 'Alles löschen' }).click()
  await page.locator('.wipe-warn').waitFor()

  /*
   * Hier stand bis zum 02.09. `expect(.wipe-go).toBeDisabled()`.
   *
   * Der Knopf ist jetzt nicht mehr gesperrt, sondern auskunftsfähig: Am Gerät
   * hieß „gesperrt", dass der Knopf mit dem leuchtenden Rahmen wie die
   * Hauptaktion aussieht und auf einen Druck nichts tut — keinen Hinweis,
   * keine Bewegung, keine Auskunft, was fehlt. Ein gesperrter Knopf ist eine
   * Auskunft, die niemand hört.
   *
   * Die Zusage aus N4 — „ein einzelner Fehlgriff richtet nichts an" — ist
   * dieselbe geblieben und wird hier ab jetzt **schärfer** geprüft als
   * vorher: nicht mehr am `disabled`-Attribut, sondern am Ergebnis. Ein
   * Druck ohne das Wort löscht nachweislich nichts und sagt, was fehlt.
   */
  await page.locator('.wipe-go').click()
  await expect(page.locator('.wipe-missing')).toBeVisible()
  const nachFehlgriff = await page.evaluate(() => {
    return new Promise<number>((resolve) => {
      const open = indexedDB.open('anitew')
      open.onsuccess = () => {
        const req = open.result.transaction('itemStates').objectStore('itemStates').count()
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => resolve(-1)
      }
    })
  })
  expect(nachFehlgriff, 'ein Druck ohne das Wort hat gelöscht').toBe(1)

  await page.locator('.wipe-confirm-input').fill('ANITEW')
  await expect(page.locator('.wipe-go')).toBeEnabled()

  // Der neue Reset zeigt keine flüchtige Erfolgsmeldung mehr: Nach dem
  // vollständigen Löschen startet ANITEW absichtlich wie beim ersten Öffnen.
  const reload = page.waitForNavigation({ waitUntil: 'domcontentloaded' })
  await Promise.all([reload, page.locator('.wipe-go').click()])
  await expect(page.locator('.arrival')).toBeVisible()

  const afterWipe = await page.evaluate(() => {
    return new Promise<number>((resolve) => {
      const open = indexedDB.open('anitew')
      open.onsuccess = () => {
        const database = open.result
        if (!database.objectStoreNames.contains('itemStates')) {
          resolve(0)
          return
        }
        const req = database.transaction('itemStates').objectStore('itemStates').count()
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => resolve(-1)
      }
      open.onerror = () => resolve(-1)
    })
  })
  expect(afterWipe).toBe(0)
})

test('zeigt, wie viel Platz belegt ist (N5)', async ({ page }) => {
  // Gemessen, nicht erfunden — und mit „etwa“, weil der Browser den Wert grob
  // hält. Nach einer Einheit steht dort eine echte Größe.
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await openPage(page, 'Sicherung')
  await expect(page.getByText(/Auf diesem Gerät belegt: etwa/)).toBeVisible()
  await expect(page.getByText(/etwa \d+([.,]\d+)? (B|KB|MB)/)).toBeVisible()
})
