import { lazy, Suspense } from 'react'

import type { Platform } from '../core/index.ts'
import type { Dictionary } from '../i18n/index.ts'
import { prepareDriveAuth } from './driveAuthBridge.ts'

const SyncPanelImpl = lazy(async () => {
  /*
   * Die Google-Bibliothek wird erst geladen, wenn der Mensch die Abgleich-
   * Seite wirklich öffnet. Das wahrt „lokal zuerst“, aber wenn der Knopf
   * sichtbar wird, ist GIS bereits bereit UND der synchrone Token-Starter im
   * Bridge-Modul hinterlegt. So bleibt der folgende Klick vollständig in der
   * echten Benutzer-Geste — wichtig auf iOS und bei strengen Popup-Blockern.
   */
  const [module] = await Promise.all([
    import('./SyncPanelImpl.tsx'),
    prepareDriveAuth().catch(() => undefined),
  ])
  return { default: module.SyncPanelImpl }
})

export function SyncPanel(props: { platform: Platform; dictionary: Dictionary }) {
  return (
    <Suspense fallback={null}>
      <SyncPanelImpl {...props} />
    </Suspense>
  )
}
