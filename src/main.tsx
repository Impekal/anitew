import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './app/App.tsx'
import { NeuralField } from './app/NeuralField.tsx'
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
// konkurrieren.
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
      await import('./anitew-living-adaptive.css')
    })().catch(() => undefined)
  }, 750)
}

// Ein altes Dokument darf beim Reload keine optionalen Chunks mehr anwerfen.
// Sonst können genau diese Requests mit Service-Worker-Übernahme und dem neuen
// Dokument konkurrieren. Funktional geht nichts verloren: das neue Dokument
// lädt seine eigene Signatur nach stabilem Start selbst.
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

// Neue Fassungen kommen von selbst an — siehe updates.ts. Steht vor dem
// Rendern, damit auch ein Fehler in der App die Aktualisierung nicht blockiert.
keepUpToDate()

const container = document.getElementById('root')
if (container === null) throw new Error('#root fehlt in index.html')

createRoot(container).render(
  <StrictMode>
    {/* Liegt hinter allem und über jedem Bildschirm — deshalb hier und nicht
        in App: So wird es beim Wechsel zwischen Start und Einheit nicht neu
        aufgebaut und flackert nicht (D-011/G-3, G-8). */}
    <NeuralField />
    <App />
  </StrictMode>,
)
