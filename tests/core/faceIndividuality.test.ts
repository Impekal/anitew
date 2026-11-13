import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { faceFor } from '../../src/core/content/faces.ts'
import { namePool } from '../../src/core/content/names.ts'

// V4 replaces procedural SVG faces with bundled portrait photographs. Shape,
// beard and eye-coordinate tests describe the retired renderer, not these photos.
// Preserve the actual identity contract across every supported training language.
describe('photographic identities survive language changes', () => {
  const languages = ['de', 'en', 'fr', 'es', 'it', 'pt'] as const
  for (const language of languages) it(`resolves every ${language} name to a distinct local portrait`, () => {
    const names = namePool(language)
    const faces = names.map(faceFor)
    expect(faces.every(face => face !== undefined)).toBe(true)
    expect(new Set(faces.map(face => face?.src)).size).toBe(names.length)
    const credits = JSON.parse(readFileSync('public/portraits/manifest.json', 'utf8')) as { id: string }[]
    for (const name of names) {
      expect(faceFor(name)).toEqual(faceFor(name))
      expect(credits.some(credit => credit.id === faceFor(name)?.id)).toBe(true)
    }
  })
  it('keeps the v4 portrait assignments fixed for previously learned names', () => {
    expect(faceFor('Emil')).toEqual({'id': '7672102', 'src': '/portraits/pexels-7672102.webp'})
    expect(faceFor('Anton')).toEqual({'id': '11971337', 'src': '/portraits/pexels-11971337.webp'})
    expect(faceFor('Beata')).toEqual({'id': '7955853', 'src': '/portraits/pexels-7955853.webp'})
  })
})
