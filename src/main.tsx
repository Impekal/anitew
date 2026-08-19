import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './app/App.tsx'
import { NeuralField } from './app/NeuralField.tsx'
import { keepUpToDate } from './platform/web/updates.ts'
import './styles.css'
import './anitew-redesign.css'

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
