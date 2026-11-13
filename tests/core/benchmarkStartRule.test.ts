import { describe, expect, it } from 'vitest'

import { type BenchmarkSlot, benchmarkStartRefusal } from '../../src/core/index.ts'

/**
 * R3-04 (Runde 3): Die Startregel der Messung ist eine Tatsache im Kern, kein
 * Zustand der Oberfläche. Vorher entschied allein die Sichtbarkeit eines
 * Knopfes — ein Doppeltipp oder ein zweites Fenster konnte damit zwei
 * Messungen anlegen, und der feste Abstand von vierzehn Tagen hing an der
 * Anzeige.
 */
const slot = (over: Partial<BenchmarkSlot> = {}): BenchmarkSlot => ({
  ordinal: 1,
  day: '2026-08-01',
  completed: true,
  immediate: 12,
  ...over,
})

describe('die Startregel der Messung', () => {
  it('erlaubt die allererste Messung', () => {
    expect(benchmarkStartRefusal([], '2026-08-26')).toBeUndefined()
  })

  it('lehnt ab, solange eine Messung offen ist', () => {
    const open = slot({ completed: false })
    expect(benchmarkStartRefusal([open], '2026-09-30')).toBe('open-run')
  })

  it('zählt eine abgebrochene Messung nicht als offen', () => {
    const abandoned = slot({ completed: false, abandoned: true, day: '2026-08-01' })
    // Abgebrochen ohne ersten Abruf: Der Termin bleibt derselbe Tag.
    expect(benchmarkStartRefusal([{ ...abandoned, immediate: undefined }], '2026-08-01')).toBeUndefined()
  })

  it('hält den Abstand von vierzehn Tagen ein', () => {
    const done = slot({ day: '2026-08-01', immediate: 11 })
    expect(benchmarkStartRefusal([done], '2026-08-14')).toBe('not-due')
    expect(benchmarkStartRefusal([done], '2026-08-15')).toBeUndefined()
  })

  it('rechnet vom jüngsten Lauf, nicht vom ersten', () => {
    const runs = [
      slot({ ordinal: 1, day: '2026-07-01' }),
      slot({ ordinal: 2, day: '2026-08-01' }),
    ]
    expect(benchmarkStartRefusal(runs, '2026-08-10')).toBe('not-due')
    expect(benchmarkStartRefusal(runs, '2026-08-15')).toBeUndefined()
  })
})
