import { describe, expect, it } from 'vitest'
import { courseProgress } from '../../src/core/courses/progress.ts'

describe('course progress from local settings or backup', () => {
  it('rejects malformed data and unknown course identifiers', () => {
    for (const value of [null, true, {}, 'long-words', 12]) expect(courseProgress(value)).toEqual([])
    expect(courseProgress(['long-words', null, '__proto__', 'unknown', 3])).toEqual(['long-words'])
  })
  it('retains completed courses once without trusting imported ordering', () => {
    expect(courseProgress(['long-words', 'text-meaning', 'long-words'])).toEqual(['text-meaning', 'long-words'])
  })
})

it('keeps earlier completion identifiers when the course library grows', () => {
  expect(courseProgress(['text-verbatim', 'active-recall', 'long-words', 'spaced-practice'])).toEqual(['text-verbatim', 'long-words', 'active-recall', 'spaced-practice'])
})
