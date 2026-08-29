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

  // Das Theme gehört zum ersten Paint und nicht in eine 20-KB-Refinement-
  // Schicht, die erst nach dem Start geladen wird. So gibt es beim Wiederstart
  // keinen dunklen Blitz, bevor eine gespeicherte helle/System-Darstellung
  // angewandt wird.
  const storedTheme = window.localStorage.getItem(theme)
  document.documentElement.dataset.anitewTheme =
    storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'system'
} catch {
  // Darstellung ist Komfort. Geblocktes localStorage darf den Start nie stoppen.
}

let signatureTimer: number | undefined
let signatureRunning = false
let signatureReady = false
let pageIsLeaving = false
let refinementLoad: Promise<unknown> | undefined
let atmosphereTimer: number | undefined
let atmosphereIdleId: number | undefined
let atmosphereMounted = false
let unmountAtmosphere: (() => void) | undefined

function loadExperienceRefinement(): Promise<unknown> {
  refinementLoad ??= import('./app/experienceRefinement.ts').catch(() => undefined)
  return refinementLoad
}

function refinementIsVisible(): boolean {
  return document.querySelector('.onboarding, .drawer, .first-run-guide') !== null
}

/*
 * A-14: `experienceRefinement` ist kein Startseiten-Kern. Es baut das
 * Onboarding aus, verfeinert den Core und beobachtet danach DOM-Aenderungen.
 * Auf jedem normalen Wiederstart nach 750 ms rund 21 KB CSS + 13 KB JS zu
 * parsen und einen globalen Observer anzuschalten, obwohl keines dieser
 * Elemente sichtbar ist, erzeugt Arbeit ohne Nutzerwert.
 *
 * Auf einem echten Erstbesuch bleibt das Verhalten gleich: Wenn das
 * Onboarding nach der Ruhephase noch sichtbar ist, wird die Schicht geladen.
 * Wer vorher schon mit Tastatur oder Finger interagiert, laedt sie bereits bei
 * der ersten Absicht. Dasselbe gilt fuer den Core. So ist nichts entfernt,
 * nur aus dem unbeteiligten Startpfad genommen.
 */
function prepareRefinementForInteraction(event: Event): void {
  const target = event.target
  if (!(target instanceof Element)) return
  if (
    target.closest('.hamburger, .onboarding button, .first-run-guide button') !== null
  ) {
    void loadExperienceRefinement()
  }
}
document.addEventListener('pointerdown', prepareRefinementForInteraction, true)
document.addEventListener('focusin', prepareRefinementForInteraction, true)

const deferredLoads: Array<() => Promise<unknown>> = [
  () => import('./anitew-wow.css'),
  () => import('./anitew-wow-session.css'),
  () => import('./anitew-living.css'),
  () => import('./anitew-core-pages.css'),
  /*
   * Der Zusammenfassungs-Bildschirm nach einer Einheit — frühestens eine
   * Minute entfernt, also nichts fürs erste Bild. Er lag bis hierher im
   * Kaltstart und hat dort rund 600 Bytes belegt, die woanders gefehlt
   * haben (siehe den Kommentar zum Deck-Streifen in
   * anitew-overlay-safety.css).
   */
  () => import('./anitew-phase5.css'),
  () => import('./app/coreRitual.ts'),
  () => import('./app/mobileCoreLayout.ts'),
  () => import('./app/driveRedirectFeedback.ts'),
]

async function runSignatureExperience(): Promise<void> {
  if (signatureRunning || signatureReady || pageIsLeaving) return
  signatureRunning = true
  try {
    for (const load of deferredLoads) {
      if (pageIsLeaving) return
      // Ein einzelner defekter/unterbrochener Chunk darf nie alle spaeteren
      // Startverbesserungen blockieren. Jede Stufe ist best effort fuer sich.
      await load().catch(() => undefined)
    }
    if (pageIsLeaving) return

    // Fresh onboarding / bereits geoeffneter Core: hier ist die Schicht
    // sichtbar relevant. Auf einem normalen Startbildschirm bleibt sie bis
    // zur ersten Core-Interaktion komplett aus dem Hauptthread.
    if (refinementIsVisible()) await loadExperienceRefinement()
    if (pageIsLeaving) return

    signatureReady = true
    /*
     * Ende der nachgelagerten Startarbeit — als Messpunkt, nicht als
     * Testhilfe. Die Marke bedeutet: alle fuer diesen Bildschirm relevanten
     * Stufen wurden versucht; ein optionaler Chunkfehler macht den Rest der
     * App nicht kaputt.
     */
    try {
      performance.mark?.('anitew:deferred-ready')
    } catch {
      // Messen ist Diagnose. Fehlt die API, laeuft die App unveraendert weiter.
    }
  } finally {
    signatureRunning = false
  }
}

function loadSignatureExperience(): void {
  if (signatureReady || signatureRunning || signatureTimer !== undefined || pageIsLeaving) return
  signatureTimer = window.setTimeout(() => {
    signatureTimer = undefined
    void runSignatureExperience()
  }, 750)
}

/**
 * Das neuronale Feld ist reine Atmosphäre. Vorher wurde sein React/SVG-Baum
 * mitten in derselben 0,7–5,6-s-Phase aufgebaut, in der A-14 bis zu 610-ms-
 * Long Tasks gemessen hat. Es bekommt deshalb einen eigenen, späten Idle-
 * Slot: frühestens 5,5 s nach dem Start und dann erst, wenn der Browser Luft
 * meldet. Das Feld bleibt vollständig erhalten; es konkurriert nur nicht mehr
 * mit dem ersten Tippen des Nutzers.
 */
function scheduleAtmosphere(): void {
  if (pageIsLeaving || atmosphereMounted || atmosphereTimer !== undefined || atmosphereIdleId !== undefined) return
  atmosphereTimer = window.setTimeout(() => {
    atmosphereTimer = undefined
    const mount = () => {
      atmosphereIdleId = undefined
      if (pageIsLeaving || atmosphereMounted) return
      void import('./app/NeuralFieldMount.tsx')
        .then(({ mountNeuralField, unmountNeuralField }) => {
          if (pageIsLeaving || atmosphereMounted) return
          mountNeuralField()
          atmosphereMounted = true
          unmountAtmosphere = unmountNeuralField
        })
        .catch(() => undefined)
    }
    if ('requestIdleCallback' in window) {
      atmosphereIdleId = window.requestIdleCallback(mount, { timeout: 1_500 })
    } else {
      atmosphereIdleId = window.setTimeout(mount, 500)
    }
  }, 5_500)
}

const GOOGLE_LOGOUT_PENDING_KEY = 'anitew.google-oauth.logout-pending.v1'

/**
 * Offline auf „Google-Konto trennen“: `sync.on` ist bereits aus, der HttpOnly-
 * Cookie kann aber nur der Worker löschen. Die kleine lokale Marke startet
 * beim nächsten Seitenstart oder Online-Ereignis genau diesen Aufräumschritt
 * erneut. Normalerweise wird dafür kein zusätzlicher Chunk geladen.
 */
function resumePendingGoogleLogout(): void {
  let pending = false
  try {
    pending = window.localStorage.getItem(GOOGLE_LOGOUT_PENDING_KEY) === '1'
  } catch {
    return
  }
  if (!pending) return
  void import('./platform/web/oauthLogout.ts')
    .then(({ retryPendingGoogleLogout }) => retryPendingGoogleLogout())
    .catch(() => undefined)
}

window.addEventListener('online', resumePendingGoogleLogout)
resumePendingGoogleLogout()

window.addEventListener('pagehide', () => {
  // `pagehide` bedeutet bei BFCache nicht, dass dieses Dokument stirbt. Wir
  // stoppen nur die Arbeit waehrend es eingefroren ist und koennen sie nach
  // `pageshow` wieder aufnehmen.
  pageIsLeaving = true
  if (signatureTimer !== undefined) {
    window.clearTimeout(signatureTimer)
    signatureTimer = undefined
  }
  if (atmosphereTimer !== undefined) {
    window.clearTimeout(atmosphereTimer)
    atmosphereTimer = undefined
  }
  if (atmosphereIdleId !== undefined) {
    if ('cancelIdleCallback' in window) window.cancelIdleCallback(atmosphereIdleId)
    else window.clearTimeout(atmosphereIdleId)
    atmosphereIdleId = undefined
  }
  unmountAtmosphere?.()
  unmountAtmosphere = undefined
  atmosphereMounted = false
})

window.addEventListener('pageshow', (event) => {
  if (!event.persisted) return
  pageIsLeaving = false
  loadSignatureExperience()
  scheduleAtmosphere()
  resumePendingGoogleLogout()
})

if (document.readyState === 'complete') {
  loadSignatureExperience()
  scheduleAtmosphere()
} else {
  window.addEventListener('load', loadSignatureExperience, { once: true })
  window.addEventListener('load', scheduleAtmosphere, { once: true })
}

keepUpToDate()
void import('./app/coreNavigationReturn.ts').catch(() => undefined)
void import('./app/drawerAccessibility.ts')
  .then(({ installDrawerAccessibility }) => installDrawerAccessibility())
  .catch(() => undefined)
void import('./platform/web/diagnostics.ts')
  .then(({ installLocalDiagnostics }) => installLocalDiagnostics())
  .catch(() => undefined)

const rootContainer = document.getElementById('root')
if (rootContainer === null) throw Error('#root fehlt')
const container: HTMLElement = rootContainer
const root = createRoot(container)

let legalLanguageObserver: MutationObserver | undefined

function syncLegalFooterLanguage(footer: HTMLElement): void {
  const german = document.documentElement.lang === 'de'
  footer.setAttribute('aria-label', german ? 'Rechtliches' : 'Legal information')
  const links = footer.querySelectorAll<HTMLAnchorElement>('a')
  if (links[0] !== undefined) links[0].textContent = german ? 'Impressum' : 'Imprint'
  if (links[1] !== undefined) links[1].textContent = german ? 'Datenschutz' : 'Privacy'
}

function ensureLegalFooter(): void {
  const existing = document.getElementById('anitew-legal-footer')
  if (existing !== null) {
    syncLegalFooterLanguage(existing)
    return
  }
  const footer = document.createElement('nav')
  footer.id = 'anitew-legal-footer'
  footer.style.cssText =
    'position:relative;z-index:1;padding:0 16px max(18px,env(safe-area-inset-bottom));text-align:center;font:500 12px/1.5 system-ui,sans-serif;color:#777;'
  // Zwölf Pixel hohe Schrift ergibt ein zwölf Pixel hohes Ziel — zu wenig für
  // einen Daumen und unter der Mindestgröße aus WCAG 2.5.8. Die Schrift bleibt
  // klein und zurückhaltend; nur die anfassbare Fläche wächst über Polsterung
  // auf 44 px. Sichtbar ändert sich nichts außer dem Abstand der beiden Links.
  const linkStyle =
    'color:inherit;display:inline-flex;align-items:center;min-height:44px;padding:0 10px;'
  footer.innerHTML =
    `<a style="${linkStyle}" href="/impressum.html"></a><span aria-hidden="true">·</span><a style="${linkStyle}" href="/datenschutz.html"></a>`
  document.body.append(footer)
  syncLegalFooterLanguage(footer)

  if (legalLanguageObserver === undefined) {
    legalLanguageObserver = new MutationObserver(() => syncLegalFooterLanguage(footer))
    legalLanguageObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang'],
    })
  }
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
