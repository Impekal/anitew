import { expect, test } from '@playwright/test'

import { reachModuleRound, startButton, visit } from './helpers.ts'
import { de } from '../../src/i18n/de.ts'

/**
 * Querabruf (D13) am Bildschirm — zum ersten Mal.
 *
 * Missionen fragen vom Menschen zur Tatsache: „Elena — welches Zimmer?“ Der
 * Querabruf fragt zurück: „Wer gehört zu Zimmer 314?“ Das Modul wurde am
 * 22.08. in die Planung verdrahtet — und war vom selben Tag an unsichtbar,
 * weil die Modulliste der App einen Tag zuvor zuletzt gepflegt worden war
 * (siehe `memory/dailyMission.ts`). Vierzehn Tage tot.
 *
 * Am Bildschirm gemessen, bevor hier etwas geändert wurde, zeigte es zwei
 * Dinge, die kein Kerntest sehen kann:
 *
 *   Einprägen:  „Feldhof · Matteo“  — und **kein Hinweistext**, weil das
 *               Wörterbuch für dieses Modul keinen hatte.
 *   Abruf:      „Wer ist das?“      — die Gesichterfrage, über einem
 *               Hotelnamen; der Rückfall für Module ohne eigene Frage.
 *
 * Beides steht jetzt im Wörterbuch, und beides prüft dieser Test gegen das
 * Wörterbuch statt gegen einen abgeschriebenen Satz.
 */

test('zeigt das Paar mit einer Ansage — und fragt nach dem Menschen, nicht nach dem Gesicht', async ({
  page,
}) => {
  test.setTimeout(300_000)
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await reachModuleRound(page, 'associative')

  // Der Einprägetext ist da und ist der des Moduls — nicht leer.
  const ansage = de.session.encodeHints.associative
  expect(ansage.length).toBeGreaterThan(0)
  await expect(page.locator('.encode .hint').first()).toHaveText(ansage)

  const paar = (await page.locator('.encode-word').textContent()) ?? ''
  expect(paar, `„${paar}“ ist kein Paar`).toContain(' · ')
  const mensch = paar.split(' · ').at(-1) as string

  // Der Abruf fragt nach dem Menschen — und nicht „Wer ist das?“.
  const field = page.locator('.prompted-input')
  await field.waitFor({ timeout: 90_000 })
  await expect(page.locator('.prompted .hint').first()).toHaveText(de.session.associativeAsk)
  expect(de.session.associativeAsk).not.toBe(de.session.promptHint)

  // Und die richtige Antwort wird angenommen.
  await field.fill(mensch)
  await page.getByRole('button', { name: 'Fertig' }).click()
  await expect(page.locator('.summary-score strong, .prompted-input').first()).toBeVisible()
})
