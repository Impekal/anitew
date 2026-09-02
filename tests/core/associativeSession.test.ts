import { describe, expect, it } from 'vitest'

import {
  associationCueFor,
  associationItems,
  displayOf,
  entersReview,
  isPrompted,
  leniencyFor,
  planSession,
  reviewItemsOf,
  targetOf,
  TRAINING_MODULES,
  type Pools,
} from '../../src/core/index.ts'

function pools(): Pools {
  return {
    words: [],
    faces: [],
    numbers: [],
    missions: ['Elena', 'Noah', 'Mina'],
    palace: [],
    reverse: [],
    twins: [],
    gaze: [],
    facts: [],
    memory: [], people: [],
    spatial: [],
  }
}

describe('D13 associative session wiring', () => {
  it('is a prompted FSRS module whose target is the original person without leaking it in the cue', () => {
    const item = associationItems('Elena')[0]!
    const cue = associationCueFor(item, 'de')

    expect(TRAINING_MODULES).toContain('associative')
    expect(isPrompted('associative')).toBe(true)
    expect(entersReview('associative')).toBe(true)
    expect(leniencyFor('associative')).toBe('typos')
    expect(cue).toBeDefined()
    expect(targetOf('associative', item, 'de')).toBe('Elena')
    expect(displayOf('associative', item, 'de')).toBe(cue?.cue)
  })

  it('derives reverse-association items from the deterministic mission pool', () => {
    const plan = planSession({
      mode: 'short',
      day: '2026-08-22',
      language: 'de',
      seed: 'd13-session',
      pools: pools(),
      modules: ['associative'],
    })

    expect(plan.totalSeconds).toBe(180)
    expect(plan.blocks.reduce((sum, block) => sum + block.seconds, 0)).toBe(180)
    expect(plan.blocks.every((block) => block.moduleId === 'associative')).toBe(true)

    const encoded = plan.blocks.filter((block) => block.kind === 'encode').flatMap((block) => block.items)
    const recalled = plan.blocks.filter((block) => block.kind === 'recall').flatMap((block) => block.items)
    expect(encoded.length).toBeGreaterThanOrEqual(3)
    expect(recalled).toEqual(encoded)
    expect(encoded.every((item) => associationCueFor(item, 'de') !== undefined)).toBe(true)
  })

  it('keeps an older associative item in the normal due-review path', () => {
    const due = associationItems('Elena')[1]!
    const plan = planSession({
      mode: 'short',
      day: '2026-08-22',
      language: 'de',
      seed: 'd13-review',
      pools: pools(),
      due: { associative: [due] },
      modules: ['associative'],
    })

    expect(reviewItemsOf(plan, 'associative')).toEqual([due])
  })
})
