import { describe, expect, it } from 'vitest'

import type { SettingsStore } from '../../src/core/index.ts'
import { createLatestOnly, hasStoredCoachKey } from '../../src/app/coachKeyPresence.ts'

/**
 * R3-03 (Runde 3): Ein langsamer Lesevorgang für Anbieter A darf nach einem
 * schnellen Wechsel zu Anbieter B nicht mehr den sichtbaren Zustand setzen.
 *
 * Der Test baut genau diese Umkehrung: Anthropic liest zweistufig und
 * absichtlich langsam, Gemini antwortet sofort. Ohne Wächter gewänne die
 * späte Anthropic-Antwort — die Oberfläche zeigte dann Gemini und behauptete
 * einen Schlüssel, der dort nicht liegt.
 */
function delayedSettings(delays: Readonly<Record<string, number>>, values: Readonly<Record<string, string>>): SettingsStore {
  return {
    read: <T>(key: string): Promise<T | undefined> =>
      new Promise((resolve) =>
        setTimeout(() => resolve(values[key] as T | undefined), delays[key] ?? 0),
      ),
    write: async () => undefined,
    remove: async () => undefined,
  } as unknown as SettingsStore
}

describe('der Schlüssel-Lesevorgang des Coaches', () => {
  it('findet den Anthropic-Schlüssel auch über die alte anbieterlose Zeile', async () => {
    const settings = delayedSettings({}, { 'coach.key': 'sk-alt' })
    expect(await hasStoredCoachKey(settings, 'anthropic')).toBe(true)
    // Für andere Anbieter gilt die Altzeile ausdrücklich nicht.
    expect(await hasStoredCoachKey(settings, 'gemini')).toBe(false)
  })

  it('wertet Leerraum nicht als Schlüssel', async () => {
    const settings = delayedSettings({}, { 'coach.key.gemini': '   ' })
    expect(await hasStoredCoachKey(settings, 'gemini')).toBe(false)
  })

  it('verwirft das späte Ergebnis des vorherigen Anbieters (Race)', async () => {
    const settings = delayedSettings(
      // Anthropic trödelt zweistufig, Gemini ist sofort da.
      { 'coach.key.anthropic': 40, 'coach.key': 40, 'coach.key.gemini': 1 },
      { 'coach.key': 'sk-alt-anthropic' },
    )
    const latest = createLatestOnly()
    const applied: { provider: string; hasKey: boolean }[] = []

    const load = (provider: 'anthropic' | 'gemini') => {
      const token = latest.begin()
      return hasStoredCoachKey(settings, provider).then((hasKey) => {
        if (latest.isCurrent(token)) applied.push({ provider, hasKey })
      })
    }

    // Erst Anthropic wählen, sofort zu Gemini wechseln.
    const first = load('anthropic')
    const second = load('gemini')
    await Promise.all([first, second])

    // Genau ein angewandtes Ergebnis — und zwar das des zuletzt gewählten
    // Anbieters. Ohne Wächter stünde hier zusätzlich Anthropics `true`.
    expect(applied).toEqual([{ provider: 'gemini', hasKey: false }])
  })

  it('verwirft nach cancelAll auch das jüngste Ergebnis', async () => {
    const settings = delayedSettings({ 'coach.key.gemini': 5 }, { 'coach.key.gemini': 'AIza' })
    const latest = createLatestOnly()
    const applied: boolean[] = []
    const token = latest.begin()
    const run = hasStoredCoachKey(settings, 'gemini').then((has) => {
      if (latest.isCurrent(token)) applied.push(has)
    })
    latest.cancelAll()
    await run
    expect(applied).toEqual([])
  })
})
