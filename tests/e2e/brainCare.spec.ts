import { expect, test } from '@playwright/test'

import { openPage, startButton, visit } from './helpers.ts'
import { TRAINING_MODULES } from '../../src/core/session/plan.ts'

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
  test.setTimeout(120_000)
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await openPage(page, 'Geistig aktiv bleiben')

  /*
   * Der Wunsch war „eventuell auch mit schwierigen Aufgaben". Die Antwort
   * ist ein Weg, kein zweiter Aufgabenvorrat: Anspruch kommt aus dem
   * Training, das es schon gibt — nur in seiner langen Form.
   *
   * ── Und der Weg endet jetzt wirklich dort (06.09.) ──────────────────────
   *
   * Zweimal gemeldet, wörtlich: „‚lancer une séance exigeante‘ ramène au
   * Core" (01.09.) und „fordernde Einheit starten führt zurück ins Core"
   * (06.09.). Der erste Eingriff holte nur den Startknopf ins Bild und gab
   * ihm den Fokus. Das war eine Verbesserung am **Landeplatz** — der Knopf
   * stellte die Einheit weiter bloß ein, statt sie zu beginnen. Ein Etikett
   * mit einem Verb, das nichts tut, wird beim zweiten Mal genauso gemeldet
   * wie beim ersten.
   *
   * Dieser Test prüfte bis dahin genau die alte Mechanik: Seite zu,
   * „15 Minuten" gewählt, Startknopf im Bild. Alle drei Aussagen waren wahr
   * und trotzdem war der Befund berechtigt — sie beschrieben eine
   * Vorbereitung, keinen Start. Geprüft wird deshalb ab jetzt die Wirkung.
   */
  await page.getByRole('button', { name: 'Fordernde Einheit starten' }).click()

  // Eine Einheit läuft: Ankommen (D-011/G-1), danach der Abbruch-Knopf.
  await page.locator('.settle').click({ timeout: 15_000 })
  await expect(page.locator('.session-abort')).toBeVisible({ timeout: 15_000 })
  await expect(page.locator('.page')).toBeHidden()

  const plan = await page.evaluate(() => {
    return new Promise<{ sekunden?: number; module?: string[] } | undefined>((resolve) => {
      const open = indexedDB.open('anitew')
      open.onsuccess = () => {
        const request = open.result
          .transaction('settings')
          .objectStore('settings')
          .get('activeSession')
        request.onsuccess = () => {
          const value = request.result?.value as
            | { plan?: { totalSeconds?: number; blocks?: { moduleId?: string }[] } }
            | undefined
          resolve({
            ...(value?.plan?.totalSeconds === undefined
              ? {}
              : { sekunden: value.plan.totalSeconds }),
            module: [...new Set((value?.plan?.blocks ?? []).map((b) => b.moduleId ?? '?'))],
          })
        }
        request.onerror = () => resolve(undefined)
      }
      open.onerror = () => resolve(undefined)
    })
  })

  // Die lange Länge, nicht die Voreinstellung.
  expect(plan?.sekunden, 'die Einheit ist nicht die fordernde').toBe(900)

  /*
   * Und kein zweiter Aufgabenvorrat — das ist die eigentliche Aussage dieses
   * Tests. Was läuft, sind die gewöhnlichen Trainingsmodule; „schwierig"
   * heißt hier länger und breiter, nicht anderswoher.
   */
  expect(plan?.module?.length, 'die Einheit hat gar keine Module').toBeGreaterThan(0)
  for (const modul of plan?.module ?? []) {
    expect(TRAINING_MODULES as readonly string[], `„${modul}" ist kein Trainingsmodul`).toContain(
      modul,
    )
  }

  /*
   * Zuletzt: Wer die Einheit verwirft, findet auf dem Startbildschirm die
   * fordernde Länge vorgewählt. Der Knopf hinterlässt also einen Zustand,
   * der zu dem passt, was gerade lief.
   */
  await page.locator('.session-abort').click()
  await expect(page.locator('.mode-active:not(.language-pace)')).toHaveText(/15 Minuten/)
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
