import { describe, expect, it } from 'vitest'

import {
  interferenceKey,
  interferes,
  withoutInterference,
} from '../../src/core/content/interference.ts'
import { wordPool } from '../../src/core/content/words.ts'

describe('C6 runtime interference guard', () => {
  it('normalisiert Akzente und Zeichensetzung, ohne Sprache zu behaupten', () => {
    expect(interferenceKey('Écharpe!')).toBe('echarpe')
    expect(interferenceKey('cerf-volant')).toBe('cerfvolant')
  })

  it('fängt echte Fast-Dubletten konservativ ab', () => {
    expect(interferes('Insel', 'Pinsel')).toBe(true)
    expect(interferes('paddle', 'saddle')).toBe(true)
    expect(interferes('memory', 'memories')).toBe(true)
  })

  it('verwechselt normale Ähnlichkeit nicht mit Interferenz', () => {
    expect(interferes('Schlitten', 'Schlüssel')).toBe(false)
    expect(interferes('Hammer', 'Hängematte')).toBe(false)
    expect(interferes('bougie', 'boussole')).toBe(false)
  })

  it('behält die erste Form stabil und entfernt nur spätere Konflikte', () => {
    expect(withoutInterference(['Insel', 'Pinsel', 'Vulkan', 'Volkan'])).toEqual([
      'Insel',
      'Vulkan',
    ])
  })

  it('wendet den Schutz auf neue Wortvorräte zur Laufzeit an', () => {
    expect(wordPool('de')).toContain('Insel')
    expect(wordPool('de')).not.toContain('Pinsel')
    expect(wordPool('en')).toContain('paddle')
    expect(wordPool('en')).not.toContain('saddle')
    expect(wordPool('fr').length).toBe(50)
  })
})
