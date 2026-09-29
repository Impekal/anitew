import { describe, expect, it } from 'vitest'
import { planSession, type PlanInput } from '../../src/core/session/plan.ts'
import { planSession as basePlan, type PlanInput as BaseInput } from '../../src/core/session/planBase.ts'
import { TRAINING_MODES } from '../../src/core/modes.ts'
import { wordPool } from '../../src/core/content/words.ts'
import { gazePool } from '../../src/core/content/gaze.ts'

describe('25% answer reserve', () => {
  for (const mode of TRAINING_MODES) for (const difficulty of [-1, 0, 1] as const) {
    it(`${mode}, difficulty ${difficulty}: preserves content and encoding, extends every answer block`, () => {
      const input: PlanInput = { mode, day: '2026-09-29', language: 'de', seed: 'reserve',
        pools: { words: wordPool('de'), faces: [], numbers: [], missions: [], palace: [], reverse: [], twins: [], gaze: gazePool('reserve', 40), facts: [], memory: [] },
        modules: ['words', 'gaze'], due: { words: ['Anker', 'Besen'] }, difficulty: { words: difficulty, gaze: difficulty } }
      const before = basePlan(input as BaseInput)
      const after = planSession(input)
      let seconds = 0
      expect(after.blocks).toHaveLength(before.blocks.length)
      before.blocks.forEach((block, index) => {
        const actual = after.blocks[index]!
        expect({ ...actual, seconds: block.seconds }).toEqual(block)
        if (block.kind === 'recall' || block.kind === 'review') {
          seconds += block.seconds
          expect(Math.abs(actual.seconds - block.seconds * 1.25)).toBeLessThan(1)
          expect(actual.seconds).toBeGreaterThan(block.seconds)
        } else expect(actual.seconds).toBe(block.seconds)
      })
      expect(after.totalSeconds).toBe(before.totalSeconds + Math.round(seconds * 0.25))
      expect(after.blocks.reduce((sum, block) => sum + block.seconds, 0)).toBe(after.totalSeconds)
    })
  }
})
