import { expect, it } from 'vitest'
import { faceFor } from '../../src/core/content/faces.ts'
import { namePool } from '../../src/core/content/names.ts'
import { planSession, type Pools } from '../../src/core/session/plan.ts'
import { wordPool } from '../../src/core/content/words.ts'

// The SVG-distance tests no longer describe the photographic renderer.
// Check the visible training contract: distinct, existing portraits per round.
it('uses distinct photographic identities in every face round', () => {
  const pools: Pools = { words: wordPool('de'), faces: namePool('de'), numbers: [],
    missions: [], palace: [], reverse: [], twins: [], gaze: [], facts: [], memory: [], people: [], math: [] }
  let rounds = 0
  for (let index = 0; index < 300; index++) {
    const plan = planSession({ mode: 'daily', day: '2026-09-01', language: 'de',
      seed: `variety-${index}`, pools, modules: ['faces'] })
    for (const block of plan.blocks) {
      if (block.moduleId !== 'faces' || block.kind !== 'encode') continue
      rounds++
      const portraits = block.items.map(name => faceFor(name)?.src)
      expect(portraits.every(Boolean)).toBe(true)
      expect(new Set(portraits).size).toBe(block.items.length)
    }
  }
  expect(rounds).toBeGreaterThan(500)
})
