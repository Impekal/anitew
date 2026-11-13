import { lazy, Suspense } from 'react'

import type { Platform } from '../core/index.ts'
import type { Dictionary } from '../i18n/index.ts'

/**
 * „Neu anfangen“ lädt verzögert.
 *
 * Der Bildschirm wird selten geöffnet und trägt seit dem 01.09. seine Texte
 * in sechs Sprachen (`i18n/panelCopy.ts`). Statisch geladen lagen die im
 * Kaltstart-Bündel und rissen das Budget (P4): 181,4 statt 180 KB. Verzögert
 * geladen kostet er dort nichts — und der Rest des Bildschirms geht gleich
 * mit. Dasselbe Muster wie `SyncPanel` und `BackupPanel`.
 */
const ResetPanelImpl = lazy(async () => {
  const module = await import('./ResetPanelImpl.tsx')
  return { default: module.ResetPanelImpl }
})

export function ResetPanel(props: { platform: Platform; dictionary: Dictionary }) {
  return (
    <Suspense fallback={null}>
      <ResetPanelImpl {...props} />
    </Suspense>
  )
}
