import { describe, expect, it } from 'vitest'

import { createRng, seedFrom } from '../../src/core/rng.ts'

describe('createRng', () => {
  it('liefert aus demselben Seed dieselbe Folge', () => {
    const a = createRng(1234)
    const b = createRng(1234)
    const first = Array.from({ length: 20 }, () => a.next())
    const second = Array.from({ length: 20 }, () => b.next())
    expect(first).toEqual(second)
  })

  it('liefert aus verschiedenen Seeds verschiedene Folgen', () => {
    const a = createRng('montag')
    const b = createRng('dienstag')
    expect(a.next()).not.toBe(b.next())
  })

  it('bleibt in [0, 1)', () => {
    const rng = createRng(7)
    for (let i = 0; i < 2000; i++) {
      const value = rng.next()
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    }
  })

  it('verkraftet Seed 0', () => {
    // mulberry32 fängt mit Zustand 0 auffällig schwach an; createRng weicht aus.
    const rng = createRng(0)
    const values = Array.from({ length: 5 }, () => rng.next())
    expect(new Set(values).size).toBe(5)
  })
})

describe('int / between', () => {
  it('bleibt in den Grenzen', () => {
    const rng = createRng('grenzen')
    for (let i = 0; i < 1000; i++) {
      const value = rng.int(6)
      expect(Number.isInteger(value)).toBe(true)
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(6)
    }
    for (let i = 0; i < 1000; i++) {
      const value = rng.between(10, 15)
      expect(value).toBeGreaterThanOrEqual(10)
      expect(value).toBeLessThan(15)
    }
  })

  it('trifft alle Werte eines kleinen Bereichs', () => {
    const rng = createRng('verteilung')
    const seen = new Set<number>()
    for (let i = 0; i < 500; i++) seen.add(rng.int(6))
    expect(seen.size).toBe(6)
  })

  it('weist unsinnige Grenzen zurück', () => {
    const rng = createRng(1)
    expect(() => rng.int(0)).toThrow(RangeError)
    expect(() => rng.int(-3)).toThrow(RangeError)
    expect(() => rng.between(5, 5)).toThrow(RangeError)
  })
})

describe('pick / shuffle / sample', () => {
  it('wählt aus der Liste', () => {
    const rng = createRng('wahl')
    const items = ['a', 'b', 'c']
    for (let i = 0; i < 50; i++) expect(items).toContain(rng.pick(items))
  })

  it('wirft bei einer leeren Liste, statt undefined zu liefern', () => {
    expect(() => createRng(1).pick([])).toThrow(RangeError)
  })

  it('mischt, ohne die Eingabe anzufassen oder Elemente zu verlieren', () => {
    const items = Array.from({ length: 30 }, (_, i) => i)
    const original = items.slice()
    const shuffled = createRng('mischen').shuffle(items)
    expect(items).toEqual(original)
    expect(shuffled.slice().sort((a, b) => a - b)).toEqual(original)
    expect(shuffled).not.toEqual(original)
  })

  it('zieht ohne Zurücklegen', () => {
    const items = Array.from({ length: 20 }, (_, i) => i)
    const drawn = createRng('ziehen').sample(items, 8)
    expect(drawn).toHaveLength(8)
    expect(new Set(drawn).size).toBe(8)
  })

  it('zieht nicht mehr, als da ist', () => {
    expect(() => createRng(1).sample([1, 2, 3], 4)).toThrow(RangeError)
  })
})

describe('seedFrom', () => {
  it('ist stabil und unterscheidet ähnliche Texte', () => {
    expect(seedFrom('item-42')).toBe(seedFrom('item-42'))
    expect(seedFrom('item-42')).not.toBe(seedFrom('item-43'))
  })

  it('bleibt eine vorzeichenlose 32-Bit-Zahl', () => {
    for (const text of ['', 'a', 'ANITEW', '2026-08-17', '日本語']) {
      const seed = seedFrom(text)
      expect(Number.isInteger(seed)).toBe(true)
      expect(seed).toBeGreaterThanOrEqual(0)
      expect(seed).toBeLessThan(2 ** 32)
    }
  })
})
