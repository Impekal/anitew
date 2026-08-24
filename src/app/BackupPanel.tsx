import { lazy, Suspense } from 'react'

import type { Platform } from '../core/index.ts'
import type { Dictionary } from '../i18n/index.ts'

const BackupPanelImpl = lazy(async () => {
  const module = await import('./BackupPanelImpl.tsx')
  return { default: module.BackupPanel }
})

export function BackupPanel(props: { platform: Platform; dictionary: Dictionary }) {
  return (
    <Suspense fallback={null}>
      <BackupPanelImpl {...props} />
    </Suspense>
  )
}
