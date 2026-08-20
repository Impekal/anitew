import { expect, test } from '@playwright/test'

import { startButton } from './helpers.ts'

/**
 * N3 — erster Start nach der Installation ohne Netz.
 *
 * Eine installierte PWA darf nicht erst beim zweiten App-Start offline werden.
 * Die Installation selbst braucht naturgemäß einmal Netz; danach muss der
 * precache genügen, auch wenn die erste echte App-Seite in einem frischen Tab
 * geöffnet wird. Genau diesen Übergang bildet der Test ab: online installieren,
 * Installationsseite schließen, Netz kappen, neue Seite aus dem Cache starten.
 */
test('startet nach der Installation auf einer frischen Seite vollständig offline', async ({
  context,
  page,
}) => {
  await page.goto('/')
  await expect(startButton(page)).toBeVisible()

  // Nicht nur "registriert", sondern fertig installiert. Erst dann ist die
  // Aussage belastbar, dass der Cache die App ohne Netz tragen kann.
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
  })

  // Der bestehende Tab soll nicht versehentlich aus seinem Dokumentzustand
  // weiterleben. Ein neuer Tab ist der harte Fall: HTML, JS und CSS müssen aus
  // dem Service-Worker-Cache kommen. Der echte Startknopf ist dabei der
  // belastbare Endzustand; seine interne Containerklasse ist kein Vertrag.
  await page.close()
  await context.setOffline(true)
  try {
    const installedLaunch = await context.newPage()
    await installedLaunch.goto('/', { waitUntil: 'commit' })
    await expect(startButton(installedLaunch)).toBeVisible({ timeout: 30_000 })
  } finally {
    await context.setOffline(false)
  }
})
