import { createRoot, type Root } from 'react-dom/client'

import { NeuralField } from './NeuralField.tsx'

let host: HTMLDivElement | undefined
let fieldRoot: Root | undefined

/**
 * Das neuronale Hintergrundfeld ist Atmosphäre, keine Voraussetzung für den
 * ersten bedienbaren Bildschirm. Es erscheint zusammen mit der Signature-
 * Experience und bleibt danach hinter allen App-Zuständen stehen.
 */
export function mountNeuralField(): void {
  if (host !== undefined || document.querySelector('.neural') !== null) return
  host = document.createElement('div')
  host.className = 'neural-host'
  host.setAttribute('aria-hidden', 'true')
  document.body.prepend(host)
  fieldRoot = createRoot(host)
  fieldRoot.render(<NeuralField />)
}

export function unmountNeuralField(): void {
  fieldRoot?.unmount()
  host?.remove()
  fieldRoot = undefined
  host = undefined
}
