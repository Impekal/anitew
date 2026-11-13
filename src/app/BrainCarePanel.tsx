import { lazy, Suspense } from 'react'


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
  onDemanding,
}: {
  onDemanding?: () => void
}) {
  return (
    <Suspense fallback={null}>
      <BrainCarePanelImpl onDemanding={onDemanding} />
    </Suspense>
  )
}
