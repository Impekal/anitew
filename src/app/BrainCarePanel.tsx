import { lazy, Suspense } from 'react'

import type { Dictionary } from '../i18n/index.ts'

/*
 * Wie die Wissenschaftsseite: wichtig, aber kein Kaltstart-Bestandteil (P4).
 * Tipps, Quellen und Darstellung kommen erst, wenn jemand die Seite öffnet;
 * der Service Worker nimmt den Chunk trotzdem mit, offline bleibt sie da.
 */
const BrainCarePanelImpl = lazy(async () => {
  const module = await import('./BrainCarePanelImpl.tsx')
  return { default: module.BrainCarePanelImpl }
})

export function BrainCarePanel({
  dictionary,
  onDemanding,
}: {
  dictionary: Dictionary
  onDemanding?: () => void
}) {
  return (
    <Suspense fallback={null}>
      <BrainCarePanelImpl dictionary={dictionary} onDemanding={onDemanding} />
    </Suspense>
  )
}
