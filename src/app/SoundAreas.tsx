import { Suspense, lazy } from 'react'

import type { Dictionary } from '../i18n/index.ts'

import type { useSoundSetting } from './useSoundSetting.ts'

/*
 * Die Ton-Bereiche erscheinen erst in den Einstellungen und nur bei
 * eingeschaltetem Ton. Der Wrapper bleibt winzig, der Inhalt kommt beim
 * Öffnen — das Kaltstart-Budget (P4) bleibt unberührt.
 */
const SoundAreasImpl = lazy(() =>
  import('./SoundAreasImpl.tsx').then((module) => ({ default: module.SoundAreas })),
)

export function SoundAreas(props: {
  dictionary: Dictionary
  sound: ReturnType<typeof useSoundSetting>
}) {
  return (
    <Suspense fallback={null}>
      <SoundAreasImpl {...props} />
    </Suspense>
  )
}
