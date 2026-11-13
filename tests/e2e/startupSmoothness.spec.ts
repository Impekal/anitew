import { expect, test } from '@playwright/test'

import { startButton, visit } from './helpers.ts'

test('normaler Wiederstart hat nach sichtbarem Startknopf keine halbe Sekunde Blockade', async ({ page }) => {
  // Erst einmal wie ein echter Nutzer durch den Erstlauf, damit die Messung
  // den normalen Wiederstart prüft und nicht Onboarding-Arbeit mitmisst.
  await visit(page)

  await page.addInitScript(() => {
    const tasks: { start: number; duration: number }[] = []
    ;(window as unknown as { __anitewStartupTasks: typeof tasks }).__anitewStartupTasks = tasks
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          tasks.push({ start: entry.startTime, duration: entry.duration })
        }
      })
      observer.observe({ entryTypes: ['longtask'] })
    } catch {
      // Chromium im Release-Gate kennt die API. Andere Browser werden unten
      // nicht fälschlich als grün ausgegeben, sondern der Fall wird übersprungen.
    }
  })

  await page.reload({ waitUntil: 'commit' })
  await expect(startButton(page)).toBeVisible({ timeout: 10_000 })
  const visibleAt = await page.evaluate(() => performance.now())

  // A-14 lag vollständig in den ersten ~5,6 Sekunden. Das dekorative neuronale
  // Feld startet inzwischen bewusst frühestens nach 5,5 s und erst im Idle;
  // dieses Fenster misst deshalb genau die Bedienbarkeit des Startbildschirms.
  const remaining = Math.max(0, 5_300 - visibleAt)
  await page.waitForTimeout(remaining)

  const tasks = await page.evaluate((from) => {
    const stored = (window as unknown as {
      __anitewStartupTasks?: { start: number; duration: number }[]
    }).__anitewStartupTasks
    if (stored === undefined) return null
    return stored
      .filter((entry) => entry.start >= from && entry.start < 5_300)
      .map((entry) => ({
        at: Math.round(entry.start),
        duration: Math.round(entry.duration),
      }))
  }, visibleAt)

  if (tasks === null) {
    test.skip(true, 'Browser kennt die Longtask-API nicht')
    return
  }

  const worst = tasks.reduce((max, task) => Math.max(max, task.duration), 0)
  const detail = tasks.map((task) => `${task.duration} ms @ ${task.at} ms`).join(', ')

  // Der alte Befund hatte 610 ms. 500 ms ist absichtlich keine Mikrobenchmark,
  // sondern eine harte Regressiongrenze: eine halbe Sekunde ohne Reaktion ist
  // auf einem Telefon sichtbar kaputt; kleinere Schwankungen eines CI-Runners
  // sollen das Tor dagegen nicht zufällig rot machen.
  expect(worst, `Long Tasks nach sichtbarem Start: ${detail || 'keine'}`).toBeLessThan(500)
})
