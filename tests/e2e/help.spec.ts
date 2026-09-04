import { expect, test } from '@playwright/test'

import { openPage, visit } from './helpers.ts'

/**
 * Hilfe und Fragen & Antworten (Nutzerwunsch 04.09.).
 *
 * Wörtlich: „Kannst du eine Sektion mit Hilfe und eine mit Q & A hinzufügen +
 * Inhalt … da kannst du auch das Prinzip/Fundament erklären, was der Name
 * Anitew bedeutet und wie das zusammenhängt mit der App, was diese App
 * unterscheidet mit anderen Apps der Kategorie."
 *
 * Geprüft wird das Ergebnis: dass beide Seiten aus dem Menü erreichbar sind,
 * dass die Antworten wirklich erscheinen und nicht nur beschriftet sind — und
 * dass die Seite die Sprache spricht, in der die App steht. Der letzte Punkt
 * ist der, der am Gerät schon zweimal gefehlt hat.
 *
 * **Was hier bewusst nicht geprüft wird:** ob die Texte gut sind. Das kann
 * kein Test.
 */

test('führt Hilfe und Fragen als eigene Seiten — beide mit Inhalt', async ({ page }) => {
  await visit(page)

  await openPage(page, 'Hilfe')
  await expect(page.locator('.page-title')).toHaveText('Hilfe')
  // Sechs Abschnitte mit je mehreren Punkten — keine leere Seite unter der
  // Überschrift, wie sie ein vergessenes Wörterbuch erzeugen würde.
  await expect(page.locator('.help-section')).toHaveCount(6)
  await expect(page.locator('.help-item').first()).toBeVisible()
  await expect.poll(async () => page.locator('.help-item').count()).toBeGreaterThanOrEqual(15)
})

test('hält die Antworten zu, bis jemand fragt — und öffnet dann wirklich', async ({ page }) => {
  /*
   * Der Sinn eines Fragenkatalogs ist das Nachschlagen. Vierzehn Antworten am
   * Stück sind eine Wand, durch die niemand die eigene Frage findet.
   *
   * Geprüft wird die Wirkung und nicht der Zustand eines Attributs: Vorher
   * steht der Antworttext nirgends auf der Seite, nachher steht er da.
   */
  await visit(page)
  await openPage(page, 'Fragen & Antworten')

  /*
   * `expect.poll` und nicht `count()`: Der Bereich wird verzögert geladen,
   * und ein blankes Zählen wiederholt nicht — es traf beim ersten Anlauf die
   * noch leere Seite und meldete null Fragen. Der Fehler lag im Test.
   */
  const fragen = page.locator('.faq-question')
  await expect.poll(async () => fragen.count()).toBeGreaterThanOrEqual(12)
  await expect(page.locator('.faq-answer')).toHaveCount(0)

  await fragen.first().click()
  await expect(page.locator('.faq-answer')).toHaveCount(1)
  await expect(page.locator('.faq-answer').first()).toBeVisible()

  // Und wieder zu: ein zweiter Druck nimmt sie zurück.
  await fragen.first().click()
  await expect(page.locator('.faq-answer')).toHaveCount(0)
})

test('beantwortet die Namensfrage wirklich — Herkunft und wörtlicher Sinn', async ({ page }) => {
  /*
   * Die Frage stand ausdrücklich im Wunsch. Eine Überschrift „Was bedeutet
   * ANITEW?" mit einer ausweichenden Antwort darunter hätte sie nicht
   * beantwortet — geprüft wird deshalb, dass die beiden Auskünfte dastehen,
   * die die Frage ausmachen: aus welcher Sprache das Wort kommt und was es
   * wörtlich heißt.
   */
  await visit(page)
  await openPage(page, 'Fragen & Antworten')

  await page.locator('.faq-question', { hasText: 'ANITEW' }).first().click()
  const antwort = page.locator('.faq-answer').first()
  await expect(antwort).toContainText('Twi')
  await expect(antwort).toContainText('Auge')
})

test('spricht die Sprache der App, nicht Deutsch', async ({ page }) => {
  /*
   * Der Befund, der an diesem Projekt schon zweimal vom Gerät kam: eine Seite
   * auf Französisch geöffnet, Text auf Deutsch. Eine Textdatei, die eine
   * Sprache vergisst, fällt sonst erst dem Menschen auf.
   */
  await visit(page)
  await page.locator('.language select').first().selectOption('fr')

  await openPage(page, 'Aide')
  await expect(page.locator('.page-title')).toHaveText('Aide')
  await expect(page.locator('.help-section-title').first()).toHaveText('Commencer')
  await expect(page.locator('.help')).not.toContainText('Anfangen')
})
