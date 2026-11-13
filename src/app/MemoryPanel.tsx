import { Suspense, lazy } from 'react'

import type { DayKey, Platform } from '../core/index.ts'
import type { Dictionary } from '../i18n/index.ts'

/*
 * „Mein Gedächtnis“ ist eine tiefe Arbeitsseite und gehört nicht in den
 * Kaltstart. Der Wrapper bleibt winzig; Graph, Constellation, Forecasts und
 * Memory-Eingabe werden erst geladen, wenn die Seite tatsächlich geöffnet
 * wird. Das spart Start-JS, ohne irgendeine Memory-Funktion zu kürzen.
 */
const MemoryPanelImpl = lazy(() =>
  import('./MemoryPanelImpl.tsx').then((module) => ({ default: module.MemoryPanel })),
)

export function MemoryPanel(props: {
  platform: Platform
  dictionary: Dictionary
  training: string
  language: string
  today: DayKey
}) {
  return (
    <Suspense fallback={null}>
      <MemoryPanelImpl {...props} />
    </Suspense>
  )
}
