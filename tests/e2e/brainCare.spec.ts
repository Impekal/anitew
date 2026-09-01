import { expect, test } from '@playwright/test'

import { openPage, startButton, visit } from './helpers.ts'

/**
 * „Geistig aktiv bleiben" und der Tipp des Tages (Gerätewunsch 31.08.).
 *
 * Geprüft wird beides an der Wirkung: dass die Seite ihre Tipps **mit
 * Belegstand** zeigt statt als Ratgeberliste, dass die Grenze dasteht — und
 * dass der Tages-Tipp sich wie versprochen benimmt: höchstens einmal am Tag,
 * wegtippbar, abschaltbar, und nichts blockierend.
 */

test('die Seite zeigt Tipps mit ihrem Belegstand und nennt die Grenze', async ({ page }) => {
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await openPage(page, 'Geistig aktiv bleiben')

  // Dieselben Gruppen wie auf der Wissenschaftsseite — der Stand steht über
  // dem Rat, nicht in einer Fußnote.
  await expect(page.locator('.brain-care .standing-established')).toBeVisible()
  await expect(page.locator('.brain-care .standing-narrow')).toBeVisible()
  await expect(page.locator('.brain-care .standing-unsupported')).toBeVisible()

  // Der Schlaf-Tipp steht unter „Gut belegt", der Ernährungs-Tipp nicht.
  await expect(page.locator('.standing-established')).toContainText(/Schlaf/)
  await expect(page.locator('.standing-unsupported')).toContainText(/Ernährung/)

  // Quellen sind da, aufklappbar, mit Autor und Jahr.
  const quellen = page.locator('.brain-care details').first()
  await quellen.click()
  await expect(quellen).toContainText(/\b(19|20)\d{2}\b/)

  // Und die Grenze steht auf der Seite, nicht im Kleingedruckten.
  await expect(page.locator('.brain-care-honest')).toContainText(/keine Zusagen für dich/)
})

test('der Bereich fuehrt ins fordernde Training statt daneben ein zweites zu bauen', async ({
  page,
}) => {
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await openPage(page, 'Geistig aktiv bleiben')

  /*
   * Der Wunsch war „eventuell auch mit schwierigen Aufgaben". Die Antwort
   * ist ein Weg, kein zweiter Aufgabenvorrat: Der Knopf schliesst die Seite
   * und stellt die lange Einheit ein — Anspruch kommt aus dem Training, das
   * es schon gibt.
   */
  await page.getByRole('button', { name: 'Fordernde Einheit starten' }).click()
  await expect(page.locator('.page')).toBeHidden()
  await expect(page.locator('.mode-active')).toHaveText(/15 Minuten/)
  await expect(startButton(page)).toBeVisible()
})

test('der Tipp des Tages kommt einmal, geht weg und blockiert nichts', async ({ page }) => {
  await visit(page)
  const tip = page.locator('.daily-tip')
  await expect(tip).toBeVisible({ timeout: 10_000 })

  // Er versperrt den Weg nicht: Der Startknopf bleibt bedienbar.
  await expect(startButton(page)).toBeVisible()

  await tip.getByRole('button', { name: 'Verstanden' }).click()
  await expect(tip).toBeHidden()

  // Neu laden am selben Tag: kein zweites Mal.
  await page.reload()
  await expect(startButton(page)).toBeVisible()
  await expect(page.locator('.daily-tip')).toHaveCount(0)
})

test('wer ihn abschaltet, sieht ihn auch morgen nicht', async ({ page }) => {
  await visit(page)
  const tip = page.locator('.daily-tip')
  await expect(tip).toBeVisible({ timeout: 10_000 })
  await tip.getByRole('button', { name: 'Keinen Tipp mehr zeigen' }).click()
  await expect(tip).toBeHidden()

  /*
   * Der gespeicherte „zuletzt gezeigt"-Tag wird zurückgesetzt — das ist der
   * Zustand von morgen. Ohne den Abschalter käme der Tipp jetzt wieder;
   * genau das darf er nicht.
   */
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      const open = indexedDB.open('anitew')
      open.onsuccess = () => {
        const request = open.result
          .transaction('settings', 'readwrite')
          .objectStore('settings')
          .delete('brainTip.lastShown')
        request.onsuccess = () => resolve()
        request.onerror = () => resolve()
      }
      open.onerror = () => resolve()
    })
  })

  await page.reload()
  await expect(startButton(page)).toBeVisible()
  await expect(page.locator('.daily-tip')).toHaveCount(0)
})
