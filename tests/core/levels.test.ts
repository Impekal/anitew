import { expect, it } from 'vitest'
import { LEVEL_THRESHOLDS, trainingLevel } from '../../src/core/progress/levels.ts'
it('counts each training day once and never penalizes a pause', () => {
  expect(trainingLevel(['2026-09-27', '2026-09-27', '2026-09-28', '2026-10-01', '2026-02-30', '2026-00-02', 'bad'], '2026-09-29', 0))
    .toMatchObject({ level: 2, xp: 20, trainedDays: 2, remaining: 30 })
  expect(trainingLevel(['2026-09-27'], '2026-09-29', 0).xp).toBe(trainingLevel(['2026-09-27'], '2026-10-29', 0).xp)
})
it('uses recorded reviews, survives missing counts and caps the level', () => {
  expect(trainingLevel([], '2026-09-29', NaN).xp).toBe(0)
  expect(trainingLevel([], '2026-09-29', -1).xp).toBe(0)
  expect(trainingLevel([], '2026-09-29', 25)).toMatchObject({ level: 3, xp: 50, progress: 0 })
  expect(trainingLevel([], '2026-09-29', 5000)).toMatchObject({ level: LEVEL_THRESHOLDS.length, remaining: 0, progress: 1 })
})

it('adds course XP once per valid completed exercise, never from repetition or unknown imports', () => {
  expect(trainingLevel([], '2026-09-30', 0, ['story-method','story-method','long-words','unknown',null])).toMatchObject({xp:20,practisedCourses:2,level:2})
  expect(trainingLevel([], '2026-09-30', 0, {course:'story-method'}).xp).toBe(0)
  expect(trainingLevel(['2026-09-30'], '2026-09-30', 2, ['story-method']).xp).toBe(24)
})
