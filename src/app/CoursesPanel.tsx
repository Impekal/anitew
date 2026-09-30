import { lazy, Suspense } from 'react'
import type { Language, Platform } from '../core/index.ts'
const Content = lazy(async () => ({ default: (await import('./CoursesPanelImpl.tsx')).CoursesPanelImpl }))
export function CoursesPanel(props: { language: Language; platform: Platform }) {
  return <Suspense fallback={null}><Content {...props} /></Suspense>
}
