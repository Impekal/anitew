import { COURSE_IDS, courseProgress, type CourseId } from './progress.ts'
export type CourseStage = 1 | 2 | 3
export type CourseStages = Partial<Record<CourseId, 2 | 3>>
export const COURSE_STAGES_KEY = 'courses.stages.v1'
export function courseStages(value: unknown, completed: unknown): CourseStages {
  const result: CourseStages = {}
  if (!value || typeof value !== 'object' || Array.isArray(value)) return result
  const valid = courseProgress(completed)
  for (const id of COURSE_IDS) {
    const stage = (value as Record<string, unknown>)[id]
    if (valid.includes(id) && (stage === 2 || stage === 3)) result[id] = stage
  }
  return result
}
export function availableCourseStage(id: CourseId, completed: readonly CourseId[], stages: CourseStages): CourseStage {
  return !completed.includes(id) ? 1 : stages[id] ? 3 : 2
}
