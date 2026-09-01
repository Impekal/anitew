import { lazy, Suspense } from 'react'

import type { DayKey, Platform } from '../core/index.ts'

/*
 * Der Tipp des Tages hängt nicht im Kaltstart (P4): Sein Blatt, sein Text
 * und die Tippliste kommen erst, wenn der Startbildschirm steht — und wer
 * ihn abgeschaltet hat, lädt trotzdem nur diesen winzigen Rahmen.
 */
const DailyTip = lazy(async () => {
  const module = await import('./DailyTip.tsx')
  return { default: module.DailyTip }
})

export function DailyTipMount({ platform, today }: { platform: Platform; today: DayKey }) {
  return (
    <Suspense fallback={null}>
      <DailyTip platform={platform} today={today} />
    </Suspense>
  )
}
