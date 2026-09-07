import { lazy, Suspense } from 'react'

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

export function SciencePanel({ language }: { language: string }) {
  return (
    <Suspense fallback={null}>
      <SciencePanelImpl language={language} />
    </Suspense>
  )
}
