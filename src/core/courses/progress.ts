/** Course completion records practice, not measured memory performance. */
export const COURSE_IDS = ['text-meaning', 'text-verbatim', 'long-words', 'active-recall', 'spaced-practice', 'meaningful-groups', 'self-explanation', 'story-method', 'method-of-loci', 'keyword-method', 'number-images', 'interleaved-practice'] as const
export type CourseId = (typeof COURSE_IDS)[number]
export const COURSE_PROGRESS_KEY = 'courses.practised.v1'
export function courseProgress(value: unknown): CourseId[] {
  return Array.isArray(value) ? COURSE_IDS.filter(id => value.includes(id)) : []
}
