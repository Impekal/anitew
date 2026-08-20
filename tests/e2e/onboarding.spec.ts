import { expect, test } from '@playwright/test'

import { openPage, startButton } from './helpers.ts'

/**
 * Das Kennenlernen (Onboarding).
 *
 * Hier wird absichtlich **nicht** `visit` benutzt: Diese Prüfungen wollen
 * genau den allerersten Start sehen, den alle anderen überspringen.
 *
 * Die Regel hinter allen Fällen: Was jemand über sich sagt, wird Vorschlag
 * und Anrede — nie eine Aussage über sein Gedächtnis (R-1). Und einmal
 * beantwortet (auch mit „nichts“) kommt keine Frage wieder (D-015).
 */

test('erzeugt in unter drei Schritten die erste echte Erinnerung, ohne ein Urteil', async ({
  page,
}) => {
  await page.goto('/')

  // Der erste Bildschirm ist die Begrüßung, nicht ein Formular.
  await expect(page.locator('.arrival')).toBeVisible()
  await expect(page.getByText('Dein Gedächtnis, trainiert.')).toBeVisible()

  await startButton(page).click()

  await page.locator('.remember-input').fill('Daniel arbeitet im Museum und kommt aus Madrid.')
  await page.locator('.arrival-next').click()

  // Nur noch das reale Zeitbudget; keine acht Erklärscreens.
  await page.locator('.choice', { hasText: '3 Minuten' }).click()

  // Danach steht der Startbildschirm mit der gewählten Dauer …
  await expect(page.locator('.challenge')).toBeVisible()
  await expect(page.locator('.mode-active')).toHaveText('3 Minuten')

  // … und der echten ersten Erinnerung im lokalen Graphen.
  await openPage(page, 'Mein Gedächtnis')
  await expect(page.locator('.memory-counts')).toContainText('3 Erinnerungen')
})

test('lässt alles überspringen — und fragt danach nie wieder', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.arrival')).toBeVisible()

  // Der Ausgang ist ein echter Knopf auf dem ersten Schritt (D-015).
  // Der Startbildschirm baut sich nach dem Klick asynchron auf — unter
  // Suite-Volllast hat das die 5-Sekunden-Standardfrist einmal gerissen
  // (dieselbe Familie wie der Neulade-Fall unten bei „Über dich“).
  await page.locator('.arrival .quiet').click()
  await expect(page.locator('.challenge')).toBeVisible({ timeout: 15_000 })

  // Auch ein leeres Profil ist eine Antwort: Beim nächsten Öffnen steht
  // sofort der Startbildschirm.
  await page.reload()
  await expect(page.locator('.challenge')).toBeVisible({ timeout: 15_000 })
  await expect(page.locator('.arrival')).toHaveCount(0)
})

test('macht die Antworten unter „Über dich“ änderbar — und die Änderung wirkt', async ({
  page,
}) => {
  await page.goto('/')
  await page.locator('.arrival .quiet').click()
  await expect(page.locator('.challenge')).toBeVisible()

  // Ohne Antworten: kein Schwerpunkt aus dem Nichts (K7).
  await expect(page.locator('.focus')).toHaveCount(0)

  // Nachträglich ein Ziel setzen.
  await openPage(page, 'Über dich')
  await page.locator('.about-field select').first().selectOption('names')

  /*
   * Erst neuladen, wenn die Antwort wirklich **geschrieben** ist. Das
   * Speichern läuft asynchron in die Einstellungen; ein sofortiges
   * Neuladen konnte es unter Suite-Volllast überholen — dann fehlte das
   * Ziel nach dem Neuladen zu Recht, und der Test wartete auf einen
   * Schwerpunkt, den es nie geben würde. Ablesen der persistierten
   * Wahrheit statt Wette aufs Timing — dieselbe Lehre wie bei der
   * Modul-Erkennung (pollFirstModule).
   */
  await expect
    .poll(
      () =>
        page.evaluate(async () => {
          const open = indexedDB.open('anitew')
          const database: IDBDatabase = await new Promise((resolve, reject) => {
            open.onsuccess = () => resolve(open.result)
            open.onerror = () => reject(open.error)
          })
          const row: { value?: { goal?: string } } | undefined = await new Promise(
            (resolve, reject) => {
              const request = database
                .transaction('settings', 'readonly')
                .objectStore('settings')
                .get('profile.onboarding')
              request.onsuccess = () => resolve(request.result)
              request.onerror = () => reject(request.error)
            },
          )
          return row?.value?.goal
        }),
      { timeout: 10_000 },
    )
    .toBe('names')

  // Die Änderung überlebt das Neuladen und wird zum Vorschlag. Nach dem
  // Neuladen liest die App Profil und Zählungen erst asynchron — unter
  // Suite-Volllast hat das die 5-Sekunden-Standardfrist einmal gerissen.
  await page.reload()
  await expect(page.locator('.focus')).toContainText('Gesichter', { timeout: 15_000 })
  await expect(page.locator('.focus-why')).toContainText('vorgenommen')
})
