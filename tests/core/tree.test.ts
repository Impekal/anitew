import { describe, expect, it } from 'vitest'

import { ACHIEVEMENTS } from '../../src/core/progress/achievements.ts'
import { DOMAIN_OF, SKILL_DOMAINS, domainFacts } from '../../src/core/progress/tree.ts'
import { de } from '../../src/i18n/de.ts'
import { en } from '../../src/i18n/en.ts'

/**
 * Der Fähigkeitsbaum (D-019): Gruppierung belegter Tatsachen — kein Rang,
 * kein Gewicht, keine gesperrten Äste.
 */
describe('der Fähigkeitsbaum', () => {
  it('ordnet jede Tatsache genau einer Fähigkeit zu', () => {
    for (const id of ACHIEVEMENTS) {
      expect(SKILL_DOMAINS, id).toContain(DOMAIN_OF[id])
    }
  })

  it('gruppiert, ohne zu erfinden — nur Erreichtes, Reihenfolge erhalten', () => {
    const reached = ['week', 'firstReturn', 'heldOften'] as const
    expect(domainFacts('recall', reached)).toEqual(['firstReturn', 'heldOften'])
    expect(domainFacts('practice', reached)).toEqual(['week'])
    expect(domainFacts('spatial', reached)).toEqual([])
  })

  it('gibt den neuen Modulen ihre eigene Fähigkeit (D-030)', () => {
    expect(DOMAIN_OF['heldBackwards']).toBe('working')
    expect(DOMAIN_OF['toldApart']).toBe('distinguish')
    expect(DOMAIN_OF['sawDetails']).toBe('visual')
    expect(DOMAIN_OF['namesHeld']).toBe('people')
  })

  it('lässt keine Fähigkeit für immer leer — jede kann belegt werden', () => {
    for (const domain of SKILL_DOMAINS) {
      expect(
        ACHIEVEMENTS.some((id) => DOMAIN_OF[id] === domain),
        `${domain} ohne mögliche Tatsache`,
      ).toBe(true)
    }
  })

  it('hat für jede Fähigkeit einen Namen in beiden Sprachen', () => {
    for (const dictionary of [de, en]) {
      for (const domain of SKILL_DOMAINS) {
        expect(dictionary.achievements.domains[domain].length, `${domain} ohne Namen`).toBeGreaterThan(0)
      }
    }
  })
})
