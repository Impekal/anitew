/**
 * Der Sprachwechsel auf einem langsamen Gerät (gemessen 02.09.).
 *
 * Der Welcome-Screen entsteht aus zwei Quellen: React rendert ihn, und zwei
 * verzögerte Schichten (`firstRunExperience`, `experienceRefinement`) bauen
 * ihn danach imperativ aus. Beide lesen die Sprache aus **einer** Quelle:
 * `document.documentElement.lang`. Und beide markieren das `.arrival`-Element
 * danach als erledigt — sie fassen es nie wieder an.
 *
 * Daraus wird ein Wettlauf: Der Remount des `.arrival`-Elements ist eine
 * DOM-Änderung, ihre MutationObserver laufen am Mikrotask-Checkpoint
 * desselben Tasks. Setzt React das `lang`-Attribut in einem *passiven*
 * Effekt, läuft der erst im nächsten Task — die Schichten bauen den
 * Bildschirm dann in der **alten** Sprache aus und rühren ihn nie wieder an.
 *
 * Gemessen am 02.09. unter CPU-Drosselung ×20: in sechs von acht Läufen blieb
 * der ganze Willkommensbildschirm deutsch, obwohl `html lang="es"` stand.
 * Auf einer schnellen Maschine passiert es selten — deshalb sah es in CI wie
 * Flackern aus. Am Gerät heißt es: halb übersetzt, dauerhaft.
 *
 * Die Drosselung ist hier keine Schikane, sondern das Zielgerät: Diese App
 * wird auf älteren Telefonen benutzt.
 */

import { expect, test } from '@playwright/test'

/** Titel und Philosophie kommen aus `firstRunLayerCopy.ts`, nicht aus React. */
const WECHSEL = [
  {
    pill: 'Español',
    tag: 'es',
    titel: 'Bienvenido a tu sistema de memoria.',
    philosophie: 'Recordar. Conectar. Conservar.',
  },
  {
    pill: 'Italiano',
    tag: 'it',
    titel: 'Benvenuto nel tuo sistema di memoria.',
    philosophie: 'Ricordare. Collegare. Conservare.',
  },
  {
    pill: 'Português',
    tag: 'pt',
    titel: 'Bem-vindo ao teu sistema de memória.',
    philosophie: 'Lembrar. Ligar. Guardar.',
  },
  {
    pill: 'Français',
    tag: 'fr',
    titel: 'Bienvenue dans ton système de mémoire.',
    philosophie: 'Retenir. Relier. Garder.',
  },
] as const

test('wechselt die Sprache auch auf einem langsamen Gerät vollständig', async ({ page }) => {
  test.setTimeout(180_000)
  const cdp = await page.context().newCDPSession(page)

  await page.goto('/')
  // Erst der fertig ausgebaute Bildschirm — vorher gibt es nichts umzuschalten.
  await expect(page.locator('.first-run-drive-card')).toBeVisible({ timeout: 30_000 })

  for (const wechsel of WECHSEL) {
    // Gedrosselt wird nur der Wechsel selbst: Dort sitzt der Wettlauf.
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 20 })
    await page
      .locator('.arrival-language:not(.arrival-language-training)')
      .getByRole('button', { name: wechsel.pill })
      .click()
    await expect(page.locator('html')).toHaveAttribute('lang', wechsel.tag, { timeout: 60_000 })
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 })

    /*
     * Geprüft wird der **imperativ** gebaute Teil, nicht der von React.
     * `.first-run-philosophy` gibt es nur, weil eine der Schichten sie
     * angelegt hat — steht sie richtig, hat die Schicht die neue Sprache
     * gesehen. Die Begrüßung überschreibt sie ebenfalls; blieb sie deutsch,
     * war Reacts richtige Fassung schon wieder übermalt.
     */
    await expect(page.locator('.onboarding .first-run-philosophy')).toHaveText(
      wechsel.philosophie,
      { timeout: 15_000 },
    )
    await expect(page.locator('.onboarding .brand .greeting')).toHaveText(wechsel.titel, {
      timeout: 15_000,
    })
  }
})
