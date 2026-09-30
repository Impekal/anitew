import { describe, expect, it } from 'vitest'
import { COURSE_IDS, courseProgress } from '../../src/core/courses/progress.ts'
import { readingCourses } from '../../src/i18n/courses.ts'

describe('additive reading course library', () => {
  it('preserves the original five course identities and imported completion records', () => {
    const original = ['text-meaning', 'text-verbatim', 'long-words', 'active-recall', 'spaced-practice']
    expect(courseProgress(original)).toEqual(original)
    for (const language of ['de', 'en', 'fr'] as const) {
      expect(readingCourses[language].map(course => course.id)).toEqual(expect.arrayContaining(original))
    }
  })
  it('has a unique, complete course in each offered language for every persisted identity', () => {
    for (const language of ['de', 'en', 'fr'] as const) {
      const courses = readingCourses[language]
      expect(courses.map(course => course.id).sort()).toEqual([...COURSE_IDS].sort())
      for (const course of courses) {
        for (const text of [course.title, course.purpose, course.limit, course.example, course.explanation, course.prompt, course.transfer]) expect(text.trim()).not.toBe('')
        expect(course.steps.length).toBeGreaterThan(0)
        expect(course.criteria.length).toBeGreaterThan(0)
        if (course.ownCriteria) expect(course.ownCriteria.length).toBeGreaterThan(0)
      }
    }
  })
})
