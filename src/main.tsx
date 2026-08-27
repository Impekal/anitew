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
      await import('./anitew-core-pages.css')
      if (pageIsLeaving) return
      /*
       * Der Zusammenfassungs-Bildschirm nach einer Einheit — frühestens eine
       * Minute entfernt, also nichts fürs erste Bild. Er lag bis hierher im
       * Kaltstart und hat dort rund 600 Bytes belegt, die woanders gefehlt
       * haben (siehe den Kommentar zum Deck-Streifen in
       * anitew-overlay-safety.css).
       */
      await import('./anitew-phase5.css')
      if (pageIsLeaving) return
      await import('./app/coreRitual.ts')
      if (pageIsLeaving) return
      await import('./app/mobileCoreLayout.ts')
      if (pageIsLeaving) return
      await import('./app/experienceRefinement.ts')
      if (pageIsLeaving) return
      await import('./app/driveRedirectFeedback.ts')
      /*
       * Ende der nachgelagerten Startarbeit — als Messpunkt, nicht als
       * Testhilfe.
       *
       * Alles oberhalb laeuft absichtlich **nach** dem ersten Bild: neun
       * Stuecke nacheinander, jedes mit eigener Anfrage. Wann dieser Zug
       * durch ist, haengt vom Geraet und vom Netz ab und war bisher von
       * aussen nicht erkennbar. Wer die Ruhe danach messen will — ein Test
       * ebenso wie eine spaetere Feldmessung — musste raten.
       *
       * Eine Marke kostet nichts und beendet das Raten.
       */
      try {
        performance.mark?.('anitew:deferred-ready')
      } catch {
        // Messen ist Diagnose. Fehlt die API, laeuft die App unveraendert weiter.
      }
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
void import('./app/coreNavigationReturn.ts').catch(() => undefined)
void import('./platform/web/diagnostics.ts')
  .then(({ installLocalDiagnostics }) => installLocalDiagnostics())
  .catch(() => undefined)

const rootContainer = document.getElementById('root')
if (rootContainer === null) throw Error('#root fehlt')
const container: HTMLElement = rootContainer
const root = createRoot(container)

function ensureLegalFooter(): void {
  if (document.getElementById('anitew-legal-footer') !== null) return
  const footer = document.createElement('nav')
  footer.id = 'anitew-legal-footer'
  footer.setAttribute('aria-label', 'Rechtliches')
  footer.style.cssText =
    'position:relative;z-index:1;padding:0 16px max(18px,env(safe-area-inset-bottom));text-align:center;font:500 12px/1.5 system-ui,sans-serif;color:#777;'
  // Zwölf Pixel hohe Schrift ergibt ein zwölf Pixel hohes Ziel — zu wenig für
  // einen Daumen und unter der Mindestgröße aus WCAG 2.5.8. Die Schrift bleibt
  // klein und zurückhaltend; nur die anfassbare Fläche wächst über Polsterung
  // auf 44 px. Sichtbar ändert sich nichts außer dem Abstand der beiden Links.
  const linkStyle =
    'color:inherit;display:inline-flex;align-items:center;min-height:44px;padding:0 10px;'
  footer.innerHTML =
    `<a style="${linkStyle}" href="/impressum.html">Impressum</a><span aria-hidden="true">·</span><a style="${linkStyle}" href="/datenschutz.html">Datenschutz</a>`
  document.body.append(footer)
}

function renderApp(): void {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  ensureLegalFooter()
}

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as { standalone?: boolean }).standalone === true
  )
}

function browserContinuationAccepted(): boolean {
  try {
    return window.sessionStorage.getItem('anitew.install-gate.continue.v1') === '1'
  } catch {
    return false
  }
}

function shouldShowInstallGate(): boolean {
  const forced = new URL(window.location.href).searchParams.get('installGate') === '1'
  if (forced) return true
  if (navigator.webdriver === true) return false
  if (isStandalone()) return false
  return !browserContinuationAccepted()
}

function renderEntry(): void {
  if (!shouldShowInstallGate()) {
    renderApp()
    return
  }
  void import('./app/install/InstallGate.tsx')
    .then(({ InstallGate }) => {
      root.render(
        <StrictMode>
          <InstallGate onContinue={renderApp} />
        </StrictMode>,
      )
    })
    .catch(renderApp)
}

const oauthReturn = new URL(window.location.href).searchParams.has('googleOAuth')
if (oauthReturn) {
  void import('./app/driveRedirectReturn.ts')
    .then(({ finishGoogleDriveRedirect }) => finishGoogleDriveRedirect())
    .catch(() => undefined)
    .finally(renderApp)
} else renderEntry()
