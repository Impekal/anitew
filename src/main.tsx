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

// Die Signatur-Schicht ist bewusst kein Kaltstart-CSS: Der erste echte
// Bildschirm bleibt sofort benutzbar, danach bekommt dieselbe Oberfläche
// Tiefe, Glühen und die lebendige Memory-DNA. Fällt der optionale Chunk aus,
// bleibt ANITEW vollständig funktional und lesbar.
requestAnimationFrame(() => {
  void import('./anitew-wow.css').catch(() => undefined)
})

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
