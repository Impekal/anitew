import { describe, expect, it } from 'vitest'

import * as core from '../../src/core/index.ts'

/**
 * D-010 in einem Test.
 *
 * Die eigentliche Absicherung ist `tsconfig.core.json`: Es übersetzt src/core/
 * ohne die DOM-Bibliothek, `window` und Konsorten sind dort schlicht keine
 * bekannten Namen. Dieser Test prüft die andere Hälfte — dass der Kern sich in
 * einer Umgebung *ohne* Browser überhaupt laden lässt und arbeitet.
 *
 * Vitest läuft hier in Node, ganz ohne DOM. Würde irgendwo in src/core/ beim
 * Laden auf `document` zugegriffen, stürbe schon der Import.
 */
describe('der Kern läuft ohne Browser', () => {
  it('lädt in Node', () => {
    expect(typeof core.createRng).toBe('function')
    expect(typeof core.dayKeyOf).toBe('function')
    expect(typeof core.resolveLanguage).toBe('function')
  })

  it('bestätigt, dass hier wirklich kein DOM vorhanden ist', () => {
    expect(typeof globalThis).toBe('object')
    expect('document' in globalThis).toBe(false)
    expect('window' in globalThis).toBe(false)
  })

  it('rechnet, ohne irgendetwas anzufassen', () => {
    const rng = core.createRng('2026-08-17')
    expect(core.dayKeyOf(Date.parse('2026-08-17T10:00:00Z'), { offsetMinutes: 0 })).toBe(
      '2026-08-17',
    )
    expect(rng.int(10)).toBeLessThan(10)
  })
})

describe('die Zeitmodi', () => {
  it('sind Zeitbudgets, keine eigenen Abläufe (J2)', () => {
    expect(core.MODES.daily.seconds).toBe(300)
    expect(core.MODES.emergency.seconds).toBe(60)
    expect(core.MODES.extended.seconds).toBe(900)
  })

  it('halten alle die Streak, aber nicht alle sind eine volle Challenge (D-008)', () => {
    for (const mode of core.TRAINING_MODES) {
      expect(core.MODES[mode].keepsStreak).toBe(true)
    }
    expect(core.MODES.emergency.countsAsFullChallenge).toBe(false)
    expect(core.MODES.daily.countsAsFullChallenge).toBe(true)
  })

  it('kennt keinen erfundenen Modus', () => {
    expect(core.modeOf('daily')?.seconds).toBe(300)
    expect(core.modeOf('toString')).toBeUndefined()
  })
})
