import { describe, expect, it } from 'vitest'

import { ACHIEVEMENTS, type AchievementInput, achievementsOf } from '../../src/core/index.ts'
import { de } from '../../src/i18n/de.ts'
import { en } from '../../src/i18n/en.ts'

/**
 * Erreichtes (Backlog K3 · D-019).
 *
 * Geprüft wird vor allem, dass es **kein** verkapptes Rangsystem ist: nur
 * Erreichtes steht da, nichts wird aus dem Nichts wahr, und jede Tatsache
 * folgt aus Zahlen, die es ohnehin gibt.
 */
const NONE: AchievementInput = {
  returnsTotal: 0,
  returnsLongest: 0,
  streakBest: 0,
  taughtCount: 0,
  completedBenchmarks: 0,
  hasOwnPalace: false,
  heldBackTotal: 0,
  toldApartTotal: 0,
  detailsHeldTotal: 0,
  namesHeldTotal: 0,
}

describe('Erreichtes', () => {
  it('sagt am Anfang gar nichts', () => {
    // Kein „0 von 8 freigeschaltet“ — das wäre die Aufforderung, die K7
    // ausschließt.
    expect(achievementsOf(NONE)).toEqual([])
  })

  it('nennt die erste Tatsache, sobald etwas zurückkam', () => {
    expect(achievementsOf({ ...NONE, returnsTotal: 1 })).toEqual(['firstReturn'])
  })

  it('unterscheidet Woche und zwei Wochen an der Serie', () => {
    expect(achievementsOf({ ...NONE, streakBest: 7 })).toContain('week')
    expect(achievementsOf({ ...NONE, streakBest: 7 })).not.toContain('fortnight')
    expect(achievementsOf({ ...NONE, streakBest: 14 })).toContain('fortnight')
  })

  it('kennt die Eichung erst ab zwei abgeschlossenen Messungen (F2b)', () => {
    expect(achievementsOf({ ...NONE, completedBenchmarks: 1 })).not.toContain('calibrated')
    expect(achievementsOf({ ...NONE, completedBenchmarks: 2 })).toContain('calibrated')
  })

  it('nennt Technik und Palast, wenn sie da sind', () => {
    expect(achievementsOf({ ...NONE, taughtCount: 10 })).toContain('majorLearned')
    expect(achievementsOf({ ...NONE, taughtCount: 9 })).not.toContain('majorLearned')
    expect(achievementsOf({ ...NONE, hasOwnPalace: true })).toContain('ownPalace')
  })

  it('kennt die Modul-Tatsachen erst ab ihrer Schwelle (D-030)', () => {
    expect(achievementsOf({ ...NONE, heldBackTotal: 49 })).not.toContain('heldBackwards')
    expect(achievementsOf({ ...NONE, heldBackTotal: 50 })).toContain('heldBackwards')
    expect(achievementsOf({ ...NONE, toldApartTotal: 25 })).toContain('toldApart')
    expect(achievementsOf({ ...NONE, detailsHeldTotal: 25 })).toContain('sawDetails')
    expect(achievementsOf({ ...NONE, namesHeldTotal: 24 })).not.toContain('namesHeld')
    expect(achievementsOf({ ...NONE, namesHeldTotal: 25 })).toContain('namesHeld')
  })

  it('hält eine feste, vollständige Reihenfolge', () => {
    const all: AchievementInput = {
      returnsTotal: 100,
      returnsLongest: 5,
      streakBest: 14,
      taughtCount: 10,
      completedBenchmarks: 2,
      hasOwnPalace: true,
      heldBackTotal: 50,
      toldApartTotal: 25,
      detailsHeldTotal: 25,
      namesHeldTotal: 25,
    }
    expect(achievementsOf(all)).toEqual([...ACHIEVEMENTS])
  })

  it('hat für jede Tatsache einen Text in beiden Sprachen', () => {
    for (const dictionary of [de, en]) {
      for (const id of ACHIEVEMENTS) {
        expect(dictionary.achievements.facts[id].length, `${id} ohne Text`).toBeGreaterThan(0)
      }
    }
  })
})
