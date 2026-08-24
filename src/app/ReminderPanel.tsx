import { lazy, Suspense } from 'react'

import type { Platform, TimeOfDay } from '../core/index.ts'
import type { Dictionary } from '../i18n/index.ts'

const LazyReminderPanel = lazy(async () => {
  const module = await import('./ReminderPanelImpl.tsx')
  return { default: module.ReminderPanelImpl }
})

export function ReminderPanel(props: {
  platform: Platform
  dictionary: Dictionary
  daily: TimeOfDay | undefined
  suggested?: TimeOfDay
  onChange: () => void
}) {
  return (
    <Suspense fallback={null}>
      <LazyReminderPanel {...props} />
    </Suspense>
  )
}
