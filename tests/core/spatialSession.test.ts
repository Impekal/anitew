import { describe, expect, it } from 'vitest'

import {
  entersReview,
  isPrompted,
  leniencyFor,
  planSession,
  reviewItemsOf,
  spatialCellOf,
  spatialPool,
  targetOf,
  TRAINING_MODULES,
  type Pools,
} from '../../src/core/index.ts'

function pools(seed: string): Pools {
  return {
    words: [],
    faces: [],
    numbers: [],
    missions: [],
    palace: [],
    reverse: [],
    twins: [],
    gaze: [],
    facts: [],
    memory: [], people: [],
    spatial: spatialPool(seed, 20),
  }
}

describe('D12 spatial session wiring', () => {
  it('is a normal prompted FSRS module with exact cell grading', () => {
    const item = spatialPool('target', 1)[0]!
    const target = spatialCellOf(item)

    expect(TRAINING_MODULES).toContain('spatial')
    expect(isPrompted('spatial')).toBe(true)
    expect(entersReview('spatial')).toBe(true)
    expect(leniencyFor('spatial')).toBe('exact')
    expect(target).toBeDefined()
    expect(targetOf('spatial', item, 'de')).toBe(target)
  })

  it('plans deterministic spatial encode and recall without changing the time budget', () => {
    const seed = 'd12-session'
    const plan = planSession({
      mode: 'short',
      day: '2026-08-21',
      language: 'de',
      seed,
      pools: pools(seed),
      modules: ['spatial'],
    })

    expect(plan.totalSeconds).toBe(180)
    expect(plan.blocks.reduce((sum, block) => sum + block.seconds, 0)).toBe(180)
    expect(plan.blocks.every((block) => block.moduleId === 'spatial')).toBe(true)

    const encoded = plan.blocks.filter((block) => block.kind === 'encode').flatMap((block) => block.items)
    const recalled = plan.blocks.filter((block) => block.kind === 'recall').flatMap((block) => block.items)
    expect(encoded.length).toBeGreaterThanOrEqual(3)
    expect(recalled).toEqual(encoded)
    expect(encoded.every((item) => spatialCellOf(item) !== undefined)).toBe(true)
  })

  it('keeps an older spatial item as a normal due review', () => {
    const seed = 'd12-review'
    const due = spatialPool('older', 1)[0]!
    const plan = planSession({
      mode: 'short',
      day: '2026-08-21',
      language: 'de',
      seed,
      pools: pools(seed),
      due: { spatial: [due] },
      modules: ['spatial'],
    })

    expect(reviewItemsOf(plan, 'spatial')).toEqual([due])
  })
})
