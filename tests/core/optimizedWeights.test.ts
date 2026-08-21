import { generatorParameters } from 'ts-fsrs'
import { describe, expect, it } from 'vitest'

import {
  requireValidMemorySchedulerWeights,
  validatedMemorySchedulerWeights,
} from '../../src/core/index.ts'

describe('C10 optimized FSRS weights', () => {
  const defaults = generatorParameters().w

  it('accepts a complete FSRS parameter vector and returns an immutable copy', () => {
    const input = [...defaults]
    const result = validatedMemorySchedulerWeights(input)

    expect(result).toEqual(defaults)
    expect(result).not.toBe(input)
    expect(Object.isFrozen(result)).toBe(true)
  })

  it('ignores malformed persisted payloads instead of changing scheduling', () => {
    expect(validatedMemorySchedulerWeights(undefined)).toBeUndefined()
    expect(validatedMemorySchedulerWeights('not-weights')).toBeUndefined()
    expect(validatedMemorySchedulerWeights([1, 2, Number.NaN])).toBeUndefined()
    expect(validatedMemorySchedulerWeights([1, 2, 3])).toBeUndefined()
  })

  it('refuses invalid optimizer output before persistence', () => {
    expect(() => requireValidMemorySchedulerWeights([1, 2, 3])).toThrow(RangeError)
  })
})
