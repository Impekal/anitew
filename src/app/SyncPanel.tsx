import { lazy, Suspense } from 'react'

import type { Platform } from '../core/index.ts'
import type { Dictionary } from '../i18n/index.ts'

const SyncPanelImpl = lazy(async () => {
  /*
   * Die Google-Bibliothek wird erst geladen, wenn der Mensch die Abgleich-
   * Seite wirklich öffnet. Das wahrt „lokal zuerst“, aber wenn der Knopf
   * sichtbar wird, ist GIS bereits bereit. So kann der folgende Klick das
   * OAuth-Popup synchron aus der echten Benutzer-Geste öffnen — wichtig auf
   * iOS und in Browsern mit strengem Popup-Schutz.
   */
  const [module, drive] = await Promise.all([
    import('./SyncPanelImpl.tsx'),
    import('../platform/web/drive.ts'),
  ])
  await drive.preloadDriveAuth().catch(() => undefined)
  return { default: module.SyncPanelImpl }
})

export function SyncPanel(props: { platform: Platform; dictionary: Dictionary }) {
  return (
    <Suspense fallback={null}>
      <SyncPanelImpl {...props} />
    </Suspense>
  )
}
