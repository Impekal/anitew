import { expect, test } from '@playwright/test'

import { openPage, visit } from './helpers.ts'

/**
 * Der Lernbereich (Nutzerwunsch 03.09.).
 *
 * Wörtlich: „können wir eine Kategorie/Button einfügen mit Lernen? Wo man
 * dann in Ruhe alle Methoden lernen kann und üben kann … Und man kann
 * jederzeit lernen, weiterlernen, neu anfangen innerhalb jeder Lektion und
 * innerhalb des ganzen."
 *
 * Geprüft wird genau das, und zwar am Ergebnis: dass die vier Methoden
 * auffindbar sind, dass eine Lektion sich wirklich öffnet, dass der
 * Fortschritt sich bewegt und dass „neu anfangen" ihn auch wieder hergibt.
 *
 * **Was hier bewusst nicht geprüft wird:** ob die Lektionstexte gut sind.
 * Das kann kein Test. Er kann nur sagen, dass sie da sind, wo sie hingehören.
 */

test('führt alle vier Methoden an einem Ort — und öffnet ihre Lektion', async ({ page }) => {
  await visit(page)
  await openPage(page, 'Lernen')

  const karten = page.locator('.learn-card')
  await expect(karten).toHaveCount(4)
  for (const titel of [
    'Die Geschichten-Methode',
    'Die Verknüpfung',
    'Das Major-System',
    'Der Gedächtnispalast',
  ]) {
    await expect(page.locator('.learn-title', { hasText: titel })).toHaveCount(1)
  }

  // Am Anfang ist nichts gelernt — also heißt der Knopf „Lernen".
  await expect(page.locator('.learn-progress')).toContainText('0 von 4')
  const erste = karten.first()
  await expect(erste.locator('.learn-go')).toHaveText('Lernen')

  /*
   * Und jetzt das, was vorher nirgends ging: die Lektion aufschlagen, ohne
   * eine Einheit zu starten und ohne dass eine Uhr läuft.
   */
  await erste.locator('.learn-go').click()
  await expect(erste.locator('.learn-lesson')).toBeVisible()
  await expect(erste.locator('.learn-lesson-steps li')).toHaveCount(3)
  await expect(page.locator('.learn-progress')).toContainText('1 von 4')
  await expect(erste.locator('.learn-done')).toBeVisible()
})

test('zählt das Major-System Schritt für Schritt — Verfahren zuerst', async ({ page }) => {
  /*
   * Die Reihenfolge ist der Befund vom 01.09.: Wer die Zuordnungen lernt,
   * ohne den Gedanken dahinter gehört zu haben, hält sie für eine Marotte.
   * Das Verfahren ist deshalb der erste der elf Schritte.
   */
  await visit(page)
  await openPage(page, 'Lernen')

  const major = page.locator('.learn-card', { hasText: 'Das Major-System' })
  await expect(major.locator('.learn-steps')).toContainText('0 von 11')

  await major.locator('.learn-go').click()
  await expect(major.locator('.learn-steps')).toContainText('1 von 11')
  // Nach dem Verfahren steht dort, welche Ziffer als Nächstes drankäme.
  await expect(major.locator('.learn-next')).toBeVisible()
  // Noch keine Ziffer gelernt: also steht auch noch keine Tabelle da.
  await expect(major.locator('.learn-hooks li')).toHaveCount(0)

  await major.locator('.learn-go').click()
  await expect(major.locator('.learn-steps')).toContainText('2 von 11')
  await expect(major.locator('.learn-hooks li')).toHaveCount(1)
})

test('nimmt eine Lektion wirklich zurück — und fragt vorher', async ({ page }) => {
  await visit(page)
  await openPage(page, 'Lernen')

  const erste = page.locator('.learn-card').first()
  await erste.locator('.learn-go').click()
  await expect(page.locator('.learn-progress')).toContainText('1 von 4')

  /*
   * Ein einzelner Fehlgriff darf nichts anrichten — dieselbe Zusage wie beim
   * Löschen (N4). Deshalb erst die Rückfrage.
   */
  await erste.locator('.learn-restart').click()
  await expect(erste.locator('.learn-ask')).toBeVisible()
  await expect(page.locator('.learn-progress'), 'die Rückfrage allein hat schon gelöscht')
    .toContainText('1 von 4')

  await erste.locator('.learn-ask button', { hasText: 'Abbrechen' }).click()
  await expect(erste.locator('.learn-ask')).toHaveCount(0)
  await expect(page.locator('.learn-progress')).toContainText('1 von 4')

  await erste.locator('.learn-restart').click()
  await erste.locator('.learn-ask button', { hasText: 'Diese Lektion neu anfangen' }).click()
  await expect(page.locator('.learn-progress')).toContainText('0 von 4')
  await expect(erste.locator('.learn-go')).toHaveText('Lernen')
})

test('setzt auf Wunsch alles zurück — und hält den Stand über das Neuladen', async ({ page }) => {
  await visit(page)
  await openPage(page, 'Lernen')

  const karten = page.locator('.learn-card')
  await karten.nth(0).locator('.learn-go').click()
  await karten.nth(1).locator('.learn-go').click()
  await expect(page.locator('.learn-progress')).toContainText('2 von 4')

  /*
   * Der eigentliche Beweis, dass der Stand wirklich gespeichert wird und
   * nicht nur im Bildschirm steht: einmal neu laden.
   */
  await page.reload()
  await openPage(page, 'Lernen')
  await expect(page.locator('.learn-progress')).toContainText('2 von 4')

  await page.locator('.learn-restart-all').click()
  await page.locator('.learn-ask button', { hasText: 'Alles neu anfangen' }).click()
  await expect(page.locator('.learn-progress')).toContainText('0 von 4')

  await page.reload()
  await openPage(page, 'Lernen')
  await expect(page.locator('.learn-progress'), 'das Zurücksetzen hat das Neuladen nicht überlebt')
    .toContainText('0 von 4')
})

test('„Üben" führt zum Startknopf, statt still etwas zu tun', async ({ page }) => {
  /*
   * Derselbe Befund wie am 01.09. bei „Anspruchsvolle Einheit starten": Ein
   * Knopf, der die Seite schließt und den Menschen dann suchen lässt, fühlt
   * sich an, als sei nichts passiert.
   */
  await visit(page)
  await openPage(page, 'Lernen')

  await page.locator('.learn-card').first().locator('.learn-practise').click()
  await expect(page.locator('.learn')).toHaveCount(0)
  await expect(page.locator('.challenge .start')).toBeVisible()
})
