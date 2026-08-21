import { lazy, Suspense } from 'react'

import type { Advice, CoachContext, Platform } from '../core/index.ts'
import type { Dictionary } from '../i18n/index.ts'

const CoachPanelImpl = lazy(async () => {
  const module = await import('./CoachPanelImpl.tsx')
  return { default: module.CoachPanelImpl }
})

export function CoachPanel(props: {
  advice: readonly Advice[]
  context: CoachContext
  platform: Platform
  dictionary: Dictionary
}) {
  return (
    <Suspense fallback={null}>
      <CoachPanelImpl {...props} />
    </Suspense>
  )
}
