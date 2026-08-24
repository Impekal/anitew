import { lazy, Suspense } from 'react'

import type { Dictionary } from '../i18n/index.ts'

/*
 * Die Wissenschaftsseite ist wichtig, aber kein Kaltstart-Bestandteil. Ihre
 * Quellen, Claim-Matrix und Darstellung werden erst geladen, wenn der Mensch
 * diese Menüseite wirklich öffnet. Das hält den harten P4-Startpfad frei,
 * ohne Inhalt oder Offline-Fähigkeit zu entfernen — der Service Worker nimmt
 * den Chunk weiterhin mit.
 */
const SciencePanelImpl = lazy(async () => {
  const module = await import('./SciencePanelImpl.tsx')
  return { default: module.SciencePanelImpl }
})

export function SciencePanel({ dictionary }: { dictionary: Dictionary }) {
  return (
    <Suspense fallback={null}>
      <SciencePanelImpl dictionary={dictionary} />
    </Suspense>
  )
}
