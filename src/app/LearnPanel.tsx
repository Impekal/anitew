import { lazy, Suspense } from 'react'

import type { ModuleId, TrainingMode } from '../core/index.ts'
import type { Dictionary } from '../i18n/index.ts'

/*
  Erst laden, wenn jemand den Bereich öffnet: Die vier Lektionen und ihre
  Übersetzungen wiegen mehr als der Startbildschirm, und dort werden sie nie
  gebraucht. Dieselbe Regel wie beim Abgleich und bei den Persönlichkeiten.
*/
const LearnPanelImpl = lazy(async () => {
  const module = await import('./LearnPanelImpl.tsx')
  return { default: module.LearnPanelImpl }
})

export function LearnPanel(props: {
  dictionary: Dictionary
  language: string
  onPractise: (module: ModuleId, mode: TrainingMode) => void
}) {
  return (
    <Suspense fallback={null}>
      <LearnPanelImpl {...props} />
    </Suspense>
  )
}
