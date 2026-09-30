import { describe, expect, it } from 'vitest'
import { COURSE_IDS } from '../../src/core/courses/progress.ts'
import { COACH_IDS, DEFAULT_COACHES, coachFor, coachPreferences } from '../../src/core/courses/coaches.ts'

describe('course coach preferences', () => {
  it('assigns a supported default to every course', () => {
    expect(Object.keys(DEFAULT_COACHES).sort()).toEqual([...COURSE_IDS].sort())
    for (const id of COURSE_IDS) expect(COACH_IDS).toContain(coachFor(id, coachPreferences(null)))
  })
  it('resolves global and individual choices without erasing inactive choices', () => {
    const config = { mode: 'custom', global: 'lin', courses: { 'story-method': 'original' } }
    expect(coachFor('story-method', coachPreferences(config))).toBe('original')
    expect(coachFor('text-verbatim', coachPreferences(config))).toBe('rafael')
    expect(coachFor('story-method', coachPreferences({...config, mode:'global'}))).toBe('lin')
    expect(coachFor('story-method', coachPreferences({...config, mode:'default'}))).toBe('rafael')
    expect(coachPreferences({...config, mode:'default'}).courses).toEqual(config.courses)
  })
  it('sanitizes malformed imports and migrates prototype identifiers', () => {
    for (const value of [null, [], false, 'lin', 5]) expect(coachPreferences(value)).toEqual(coachPreferences(undefined))
    expect(coachPreferences({mode:'bad', global:'https://external.test/photo', courses:{unknown:'lin','long-words':'bad'}})).toEqual(coachPreferences(null))
    expect(coachPreferences({mode:'custom', global:'ama', courses:{stories:'elena',loci:'lin',retrieval:'rafael'}})).toEqual({mode:'custom',global:'rafael',courses:{'story-method':'original','method-of-loci':'lin','active-recall':'rafael'}})
  })
})
