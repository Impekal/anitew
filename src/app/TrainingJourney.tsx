import { lazy, Suspense, type ComponentProps } from 'react'
const Impl = lazy(() => import('./TrainingJourneyImpl.tsx').then(module => ({ default: module.TrainingJourneyImpl })))
export function TrainingJourney(props: ComponentProps<typeof Impl>) {
 return <Suspense fallback={null}><Impl {...props} /></Suspense>
}
