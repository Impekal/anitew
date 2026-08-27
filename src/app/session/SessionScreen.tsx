import { Suspense, lazy } from 'react'

import type { OwnPalace, Platform } from '../../core/index.ts'
import type { SessionProgress } from '../../data/sessions.ts'
import type { Dictionary } from '../../i18n/index.ts'

/*
 * Die komplette Trainingsoberfläche gehört nicht in den Kaltstart. Sie wird
 * erst nach dem bewussten Start einer Einheit geladen. Das hält P4 sowohl beim
 * Bundle als auch auf dem Hauptthread ein, ohne Trainingslogik zu verändern.
 */
const SessionScreenImpl = lazy(() =>
  import('./SessionScreenImpl.tsx').then((module) => ({ default: module.SessionScreen })),
)

export function SessionScreen(props: {
  platform: Platform
  dictionary: Dictionary
  progress: SessionProgress
  taught: readonly number[]
  own?: readonly OwnPalace[]
  onLeave: () => void
  onComplete: () => void
  onAgain: () => void
}) {
  return (
    <Suspense fallback={null}>
      <SessionScreenImpl {...props} />
    </Suspense>
  )
}
