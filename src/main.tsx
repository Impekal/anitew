import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './app/App.tsx'
import { keepUpToDate } from './platform/web/updates.ts'
import './styles.css'
import './anitew-redesign.css'
import './anitew-phase4.css'
import './anitew-phase4-journey.css'
import './anitew-phase4-landing.css'
import './anitew-phase5.css'

// Die Signatur-Schichten sind bewusst kein Startpfad. Erst wenn Dokument,
// App und Service-Worker-Start vollständig zur Ruhe gekommen sind, holen wir
// die rein visuelle Tiefe nach. Die Schichten kommen absichtlich nacheinander:
// Living Memory ist die letzte Autorität und kann ältere Drawer-/Startregeln
// sicher ersetzen, statt mit parallelen CSS-Chunks um die Reihenfolge zu
// konkurrieren. V3 sitzt ganz hinten: Sie verfeinert nur Atmosphäre,
// Einführung und optionale Drive-Verbindung, nie Gedächtniswahrheit.
let signatureTimer: number | undefined
let pageIsLeaving = false

const loadSignatureExperience = () => {
  signatureTimer = window.setTimeout(() => {
    if (pageIsLeaving) return
    void (async () => {
      await import('./anitew-wow.css')
      if (pageIsLeaving) return
      await import('./anitew-wow-session.css')
      if (pageIsLeaving) return
      await import('./anitew-living.css')
      if (pageIsLeaving) return
      await import('./app/coreRitual.ts')
      if (pageIsLeaving) return
      await import('./app/mobileCoreLayout.ts')
      if (pageIsLeaving) return
      await import('./app/experienceRefinement.ts')
    })().catch(() => undefined)
  }, 750)
}

window.addEventListener(
  'pagehide',
  () => {
    pageIsLeaving = true
    if (signatureTimer !== undefined) window.clearTimeout(signatureTimer)
  },
  { once: true },
)

if (document.readyState === 'complete') loadSignatureExperience()
else window.addEventListener('load', loadSignatureExperience, { once: true })

keepUpToDate()

const container = document.getElementById('root')
if (!container) throw Error('#root fehlt')

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
