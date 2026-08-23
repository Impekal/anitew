import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './app/App.tsx'
import { keepUpToDate } from './platform/web/updates.ts'
import './styles.css'
import './anitew-redesign.css'
import './anitew-overlay-safety.css'
import './anitew-phase4.css'
import './anitew-phase4-journey.css'
import './anitew-phase4-landing.css'
import './anitew-phase5.css'

// Dunkel ist der ANITEW-Erststart. Die Markierung trennt „noch nie gewählt“
// von einem später ausdrücklich gewählten „System“: System entfernt weiterhin
// den Theme-Key, darf beim nächsten Start aber nicht wieder zu Dunkel werden.
try {
  const themeDefaultSeeded = 'anitew.theme-default.v2'
  const theme = 'anitew.theme.v1'
  if (window.localStorage.getItem(themeDefaultSeeded) !== '1') {
    if (window.localStorage.getItem(theme) === null) window.localStorage.setItem(theme, 'dark')
    window.localStorage.setItem(themeDefaultSeeded, '1')
  }
} catch {
  // Darstellung ist Komfort. Geblocktes localStorage darf den Start nie stoppen.
}

// Die Signatur-Schichten sind bewusst kein Startpfad. Erst wenn Dokument,
// App und Service-Worker-Start vollständig zur Ruhe gekommen sind, holen wir
// die rein visuelle Tiefe nach.
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
      await import('./app/experienceRefinement.ts')
      if (pageIsLeaving) return
      await import('./app/driveRedirectFeedback.ts')
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

const rootContainer = document.getElementById('root')
if (rootContainer === null) throw Error('#root fehlt')
const container: HTMLElement = rootContainer

function render(): void {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

const oauthReturn = new URL(window.location.href).searchParams.has('googleOAuth')
if (oauthReturn) {
  void import('./app/driveRedirectReturn.ts')
    .then(({ finishGoogleDriveRedirect }) => finishGoogleDriveRedirect())
    .catch(() => undefined)
    .finally(render)
} else render()
