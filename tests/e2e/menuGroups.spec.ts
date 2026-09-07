import { expect, test, type Page } from '@playwright/test'

import { startButton, visit } from './helpers.ts'

/**
 * Wo im Menü was steht (Nutzerbefund 06.09.).
 *
 * Wörtlich: „wo bleibt jetzt aktiv bleiben. Das finde ich nicht mehr im
 * Core." Es war nie weg — aber gemessen am Telefon (390 × 844) stand es an
 * einer Stelle, an der man es nicht sucht:
 *
 *   Menühöhe 1328 px, sichtbar 633 px
 *   „Geistig aktiv bleiben" bei y = 1027, unter „App & Gerät",
 *   zwischen „Was belegt ist" und „Datenschutz"
 *
 * Direkt darüber machte seit dem 05.09. eine Gruppe „Verstehen" auf, in der
 * es nicht vorkam. Dieser Test hält fest, wohin die beiden Seiten gehören,
 * die etwas **erklären** statt etwas einzustellen.
 */

async function openMenu(page: Page) {
  await page.setViewportSize({ width: 390, height: 844 })
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await page.locator('.menu-button, [aria-label*="Men"], [aria-label*="men"]').first().click()
  await expect(page.locator('.drawer')).toBeVisible({ timeout: 5_000 })
}

/** Die Beschriftungen einer Menügruppe, in der Reihenfolge des Bildschirms. */
async function itemsOfGroup(page: Page, label: string): Promise<string[]> {
  return page.evaluate((wanted) => {
    for (const group of document.querySelectorAll('.drawer .menu-group')) {
      if (group.querySelector('.menu-label')?.textContent?.trim() !== wanted) continue
      return [...group.querySelectorAll('.drawer-item')].map((b) => b.textContent?.trim() ?? '')
    }
    return []
  }, label)
}

test('die erklärenden Seiten stehen unter „Verstehen“', async ({ page }) => {
  await openMenu(page)
  const verstehen = await itemsOfGroup(page, 'Verstehen')
  expect(verstehen, 'die Gruppe „Verstehen" fehlt').not.toHaveLength(0)
  for (const seite of ['Hilfe', 'Fragen & Antworten', 'Was belegt ist']) {
    expect(verstehen, `„${seite}" steht nicht unter „Verstehen"`).toContain(seite)
  }
})

test('„Geistig aktiv bleiben“ steht unter „Dein Stand“', async ({ page }) => {
  /*
   * Nutzerentscheidung 06.09.: „der Punkt sollte her unter ‚Dein Stand' sein
   * und nicht ‚App & Gerät'."
   *
   * Ich hatte die Seite zuerst zu „Verstehen" gelegt, weil sie etwas erklärt.
   * Der Einwand ist besser: Sie **handelt** auch — Tipp des Tages und der
   * Knopf in die fordernde Einheit. Damit gehört sie zu dem, was der Mensch
   * mit sich vorhat.
   */
  await openMenu(page)
  const stand = await itemsOfGroup(page, 'Dein Stand')
  expect(stand, 'die Gruppe „Dein Stand" fehlt').not.toHaveLength(0)
  expect(stand, '„Geistig aktiv bleiben" steht nicht unter „Dein Stand"').toContain(
    'Geistig aktiv bleiben',
  )
})

test('„App & Gerät“ enthält nur noch Geräte-Dinge', async ({ page }) => {
  await openMenu(page)
  const geraet = await itemsOfGroup(page, 'App & Gerät')
  expect(geraet, 'die Gruppe „App & Gerät" fehlt').not.toHaveLength(0)
  /*
   * Die Gegenrichtung, und sie ist der eigentliche Fund: Eine Seite, die
   * etwas erklärt, gehört nicht zwischen Sicherung und Einstellungen.
   */
  expect(geraet).not.toContain('Geistig aktiv bleiben')
  expect(geraet).not.toContain('Was belegt ist')
  // Und diese Gruppe ist am Telefon als einzige einspaltig — je kürzer, desto
  // eher kommt man unten an (`anitew-core-mobile.css`).
  expect(geraet.length, `„App & Gerät" hat ${geraet.length} Einträge`).toBeLessThanOrEqual(7)
})

test('„Geistig aktiv bleiben“ steht im ersten Bildschirm des Menüs', async ({ page }) => {
  /*
   * Der Befund war kein Fehler im Code, sondern einer im Weg dorthin. Geprüft
   * wird deshalb die Strecke — und die Schwelle ist gemessen, nicht gewählt:
   *
   *              vorher    nachher
   *   aktiv       846 px    510 px
   *   belegt      764 px    510 px
   *   sichtbar    633 px    633 px
   *   Menühöhe   1328 px   1246 px
   *
   * Vorher lag der Eintrag 213 Pixel **unter** der Falzkante: Man musste
   * scrollen, um ihn überhaupt zu sehen. Deshalb steht hier genau diese
   * Grenze und keine gerundete Bequemlichkeit.
   */
  await openMenu(page)
  const abstand = await page.evaluate(() => {
    const item = [...document.querySelectorAll('.drawer .drawer-item')].find((b) =>
      b.textContent?.includes('Geistig aktiv bleiben'),
    )
    const scroll = document.querySelector('.drawer-scroll') as HTMLElement | null
    if (!item || !scroll) return undefined
    return {
      oben: Math.round(item.getBoundingClientRect().top - scroll.getBoundingClientRect().top),
      sichtbar: scroll.clientHeight,
    }
  })
  expect(abstand, 'der Eintrag steht nicht im Menü').toBeDefined()
  expect(
    abstand!.oben,
    `„Geistig aktiv bleiben" steht ${abstand!.oben} px tief, sichtbar sind ${abstand!.sichtbar}`,
  ).toBeLessThan(abstand!.sichtbar)
})
