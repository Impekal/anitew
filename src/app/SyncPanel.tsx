import { lazy, Suspense } from 'react'

import type { Platform } from '../core/index.ts'
import type { Dictionary } from '../i18n/index.ts'

const SyncPanelImpl = lazy(async () => {
  const module = await import('./SyncPanelImpl.tsx')
  return { default: module.SyncPanelImpl }
})

export function SyncPanel(props: { platform: Platform; dictionary: Dictionary }) {
  return (
    <Suspense fallback={null}>
      <SyncPanelImpl {...props} />
    </Suspense>
  )
}
