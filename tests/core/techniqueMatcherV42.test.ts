import { describe, expect, it } from 'vitest'

import { techniqueForMaterial } from '../../src/core/technique/encodings.ts'

describe('V4.2 Technik-Matcher', () => {
  it('ordnet nur nach Materialstruktur zu, nicht nach erfundener Nutzerstärke', () => {
    expect(techniqueForMaterial('person')).toBe('link')
    expect(techniqueForMaterial('place')).toBe('palace')
    expect(techniqueForMaterial('number')).toBe('major')
    expect(techniqueForMaterial('date')).toBe('major')
    expect(techniqueForMaterial('sequence')).toBe('story')
  })

  it('macht aus einer einzelnen Tatsache keine unnötige Technikempfehlung', () => {
    expect(techniqueForMaterial('fact', 1)).toBeUndefined()
    expect(techniqueForMaterial('fact', 3)).toBe('story')
    expect(techniqueForMaterial('concept', 4)).toBe('story')
  })
})
