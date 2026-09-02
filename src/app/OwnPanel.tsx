import { Suspense, lazy } from 'react'

import type { Platform } from '../core/index.ts'
import type { Dictionary } from '../i18n/index.ts'

/*
 * „Eigene Inhalte" ist eine tiefe Arbeitsseite und gehört nicht in den
 * Kaltstart (P4). Der Wrapper bleibt winzig; Eingabefeld, Zerlegung, Vorschau
 * und Kartenliste werden erst geladen, wenn die Seite geöffnet wird.
 *
 * Dasselbe Muster wie bei `MemoryPanel`, `CoachPanel` und `PalacePanel`. Der
 * Anlass war wieder das Budget: Es riss, und statt die Grenze zu heben lag es
 * näher, die letzte große Seite aus dem ersten Bild zu nehmen, die dort
 * ohnehin nichts verloren hat.
 */
const OwnPanelImpl = lazy(() =>
  import('./OwnPanelImpl.tsx').then((module) => ({ default: module.OwnPanel })),
)

export function OwnPanel(props: {
  language: string
  dictionary: Dictionary
  platform: Platform
}) {
  return (
    <Suspense fallback={null}>
      <OwnPanelImpl {...props} />
    </Suspense>
  )
}
