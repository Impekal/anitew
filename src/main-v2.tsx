import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppV2 } from './app/AppV2.tsx'
import { NeuralField } from './app/NeuralField.tsx'
import { keepUpToDate } from './platform/web/updates.ts'
import './styles.css'
import './anitew-redesign.css'
import './anitew-v2.css'

keepUpToDate()
const container = document.getElementById('root')
if (container === null) throw new Error('#root fehlt in index.html')

createRoot(container).render(
  <StrictMode>
    <NeuralField />
    <AppV2 />
  </StrictMode>,
)
