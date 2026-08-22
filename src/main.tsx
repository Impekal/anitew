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
// die rein visuelle Tiefe nach. So konkurriert ein Reload weder mit den
// optionalen CSS-Chunks noch mit der Update-Prüfung. Fällt das Nachladen aus,
// bleibt ANITEW vollständig funktional und lesbar.
const loadSignatureExperience = () => {
  window.setTimeout(() => {
    void Promise.all([
      import('./anitew-wow.css'),
      import('./anitew-wow-session.css'),
      import('./anitew-living.css'),
    ]).catch(() => undefined)
  }, 750)
}

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
