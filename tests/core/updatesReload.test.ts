import { afterEach, describe, expect, it, vi } from 'vitest'

import { keepUpToDate } from '../../src/platform/web/updates.ts'

/**
 * F-08 (Runde 2): `hadController` war eine eingefrorene `const`. Ein Tab, der
 * beim Erstbesuch geöffnet wurde (noch kein Controller), ignorierte damit
 * nicht nur die Erstinstallation, sondern **jede spätere** Übernahme — er
 * blieb für immer auf der alten Fassung. Diese Tests fahren die Übernahmen
 * mit minimalen Browser-Stubs nach; mehr Browser braucht die Logik nicht.
 */
function browserHarness(hasController: boolean) {
  const listeners: Record<string, (() => void)[]> = {}
  const serviceWorker = {
    controller: hasController ? {} : null,
    addEventListener: (type: string, listener: () => void) => {
      ;(listeners[type] ??= []).push(listener)
    },
    getRegistration: async () => undefined,
  }
  const reload = vi.fn()
  vi.stubGlobal('navigator', { serviceWorker })
  vi.stubGlobal('document', {
    addEventListener: () => undefined,
    hidden: false,
    documentElement: { dataset: {} },
  })
  vi.stubGlobal('window', {
    addEventListener: () => undefined,
    location: { reload },
  })
  return {
    takeover: () => (listeners['controllerchange'] ?? []).forEach((listener) => listener()),
    reload,
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('keepUpToDate und die Controller-Übernahmen (F-08, Runde 2)', () => {
  it('Erstbesuchs-Tab: Installation lädt nicht — das spätere Update schon, genau einmal', () => {
    const browser = browserHarness(false)
    keepUpToDate()

    browser.takeover() // Erstinstallation übernimmt die Seite
    expect(browser.reload).not.toHaveBeenCalled()

    browser.takeover() // ein echtes Update desselben langlebigen Tabs
    expect(browser.reload).toHaveBeenCalledTimes(1)

    browser.takeover() // die Schleifen-Sperre hält
    expect(browser.reload).toHaveBeenCalledTimes(1)
  })

  it('bereits kontrollierter Tab: die erste Übernahme ist ein Update und lädt', () => {
    const browser = browserHarness(true)
    keepUpToDate()
    browser.takeover()
    expect(browser.reload).toHaveBeenCalledTimes(1)
  })
})
