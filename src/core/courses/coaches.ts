import { COURSE_IDS, type CourseId } from './progress.ts'
export const COACH_IDS = ['original', 'lin', 'rafael'] as const
export type CoachId = typeof COACH_IDS[number]
export type CoachMode = 'default' | 'global' | 'custom'
export interface CoachPreferences { mode: CoachMode; global: CoachId; courses: Partial<Record<CourseId, CoachId>> }
export const COACH_SETTINGS_KEY = 'courses.coaches.v1'
// Atta is the default; explicit global and per-course choices still take priority.
export const DEFAULT_COACHES = Object.fromEntries(COURSE_IDS.map(id => [id, 'rafael'])) as Record<CourseId, CoachId>

const record = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)
function coach(value: unknown): CoachId | undefined {
  if (value === 'elena') return 'original'
  if (value === 'ama') return 'rafael'
  return COACH_IDS.find(id => id === value)
}
export function coachPreferences(value: unknown): CoachPreferences {
  const result: CoachPreferences = { mode: 'default', global: 'rafael', courses: {} }
  if (!record(value)) return result
  if (value.mode === 'global' || value.mode === 'custom') result.mode = value.mode
  result.global = coach(value.global) ?? 'rafael'
  if (record(value.courses)) {
    const aliases: Partial<Record<CourseId, string>> = { 'story-method': 'stories', 'method-of-loci': 'loci', 'active-recall': 'retrieval', 'spaced-practice': 'spaced' }
    for (const id of COURSE_IDS) {
      const old = aliases[id]
      const selected = coach(value.courses[id]) ?? (old ? coach(value.courses[old]) : undefined)
      if (selected) result.courses[id] = selected
    }
  }
  return result
}
export function coachFor(course: CourseId, preferences: CoachPreferences): CoachId {
  return preferences.mode === 'global' ? preferences.global : preferences.mode === 'custom' ? preferences.courses[course] ?? DEFAULT_COACHES[course] : DEFAULT_COACHES[course]
}
