import { Suspense, lazy } from 'react'

import type { OwnPalace, Platform } from '../core/index.ts'

/*
 * Der Gedächtnispalast ist eine tiefe Arbeitsseite und gehört nicht in den
 * Kaltstart (P4). Der Wrapper bleibt winzig; die Formulare für mehrere Wege,
 * das Anhängen von Orten und das Umbenennen werden erst geladen, wenn die
 * Seite tatsächlich geöffnet wird.
 *
 * Der Anlass war handfest: Mit den mehreren Wegen wuchs das Panel so weit,
 * dass das Kaltstart-Budget riss — 165,4 KB gegen 165 KB. Das Budget zu heben
 * wäre der bequeme Weg gewesen und der falsche: Eine Seite, die man erst nach
 * dem dritten Fingertipp sieht, hat im ersten Bild nichts verloren.
 */
const PalacePanelImpl = lazy(() =>
  import('./PalacePanelImpl.tsx').then((module) => ({ default: module.PalacePanel })),
)

export function PalacePanel(props: {
  own: readonly OwnPalace[]
  onChange: () => void
  platform: Platform
}) {
  return (
    <Suspense fallback={null}>
      <PalacePanelImpl {...props} />
    </Suspense>
  )
}
