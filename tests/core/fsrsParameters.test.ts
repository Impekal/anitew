import { describe, expect, it } from 'vitest'

import {
  MAX_INTERVAL_DAYS,
  TARGET_RETENTION,
  memorySchedulerParameters,
  newMemory,
} from '../../src/core/index.ts'

describe('C10 — persönliche FSRS-Parametergrenze', () => {
  it('hält ANITEWs Scheduler-Regeln auch mit persönlichen Gewichten fest', () => {
    const defaults = memorySchedulerParameters()
    const personalized = memorySchedulerParameters(defaults.w)

    expect(personalized.request_retention).toBe(TARGET_RETENTION)
    expect(personalized.maximum_interval).toBe(MAX_INTERVAL_DAYS)
    expect(personalized.enable_fuzz).toBe(false)
    expect(personalized.enable_short_term).toBe(false)
    expect(personalized.w).toEqual(defaults.w)
  })

  it('ändert ohne Optimizer-Ausgabe kein bestehendes Scheduling-Verhalten', () => {
    const defaults = memorySchedulerParameters()

    expect(newMemory('2026-08-20', true, defaults.w)).toEqual(
      newMemory('2026-08-20', true),
    )
    expect(newMemory('2026-08-20', false, defaults.w)).toEqual(
      newMemory('2026-08-20', false),
    )
  })

  it('weist kaputte externe Gewichte an der Kern-Grenze zurück', () => {
    expect(() => memorySchedulerParameters([1, 2, 3])).toThrow()
    expect(() =>
      memorySchedulerParameters([
        Number.NaN,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
      ]),
    ).toThrow()
  })
})
