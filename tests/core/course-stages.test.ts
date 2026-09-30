import { expect, it } from 'vitest'
import { availableCourseStage, courseStages } from '../../src/core/courses/stages.ts'
import { COURSE_IDS } from '../../src/core/courses/progress.ts'
import { advancedExample } from '../../src/i18n/courseAdvanced.ts'
import { readingCourses } from '../../src/i18n/courses.ts'
it('unlocks only the next stage after a recorded exercise',()=>{
 expect(availableCourseStage('long-words',[],{})).toBe(1)
 expect(availableCourseStage('long-words',['long-words'],{})).toBe(2)
 expect(availableCourseStage('long-words',['long-words'],{'long-words':2})).toBe(3)
})
it('rejects invalid imported stages and stages without the introductory exercise',()=>{
 expect(courseStages({'long-words':3,'story-method':2,unknown:3},['long-words'])).toEqual({'long-words':3})
 for(const value of [null,[],true,{'long-words':99}])expect(courseStages(value,['long-words'])).toEqual({})
})
it('provides different advanced examples and complete recall criteria in all three languages',()=>{
 for(const locale of ['de','en','fr'] as const)for(const id of COURSE_IDS){
  const advanced=advancedExample(locale,id)
  expect(advanced.example).not.toBe(readingCourses[locale].find(course=>course.id===id)?.example)
  expect(advanced.prompt.length).toBeGreaterThan(30)
  expect(advanced.explanation.length).toBeGreaterThan(60)
  expect(advanced.criteria).toHaveLength(3)
 }
})
