import '../anitew-core-ritual.css'

type RitualSound = {
  play(cue: 'connection'): void
  isEnabled(): boolean
}
type RitualWindow = Window & { __anitewSound?: RitualSound }

let installed = false
let coreTimer: number | undefined
let enteringFallback: number | undefined
let arrivalTimer: number | undefined

const root = () => document.documentElement
const sound = () => (window as RitualWindow).__anitewSound

function clearTimer(timer: number | undefined): void {
  if (timer !== undefined) window.clearTimeout(timer)
}

function tactile(pattern: number[]): void {
  const vibrate = (navigator as { vibrate?: (value: number | number[]) => boolean }).vibrate
  if (typeof vibrate !== 'function') return
  try {
    vibrate(pattern)
  } catch {
    // Web-Haptik ist ein Bonus. Visuell und akustisch bleibt der Moment ganz.
  }
}

function pulseCore(): void {
  const html = root()
  html.dataset.anitewCoreOpening = 'true'
  const active = sound()
  if (active?.isEnabled() === true) {
    tactile([6, 22, 10])
    // Der Core ist die Welt der Verbindungen. Deshalb benutzt er bewusst
    // das bestehende Connection-Motiv statt einen zweiten Klangkosmos.
    active.play('connection')
  }
  clearTimer(coreTimer)
  coreTimer = window.setTimeout(() => {
    delete html.dataset.anitewCoreOpening
  }, 760)
}

function beginPortalRitual(): void {
  const html = root()
  html.dataset.anitewEntering = 'true'
  if (sound()?.isEnabled() === true) tactile([8, 28, 13])
  clearTimer(enteringFallback)
  // Der Trainingsplan entsteht normalerweise sofort. Falls eine Datenbank auf
  // einem schwachen Gerät hängt, darf der Startbildschirm aber nie dauerhaft
  // weggeblendet bleiben.
  enteringFallback = window.setTimeout(() => {
    delete html.dataset.anitewEntering
    delete html.dataset.anitewSessionArriving
  }, 2_400)
}

function noticeSessionArrival(): void {
  const html = root()
  if (html.dataset.anitewEntering !== 'true') return
  if (document.querySelector('.session') === null) return
  html.dataset.anitewSessionArriving = 'true'
  clearTimer(arrivalTimer)
  arrivalTimer = window.setTimeout(() => {
    delete html.dataset.anitewEntering
    delete html.dataset.anitewSessionArriving
  }, 760)
}

/**
 * Verbindet die bereits vorhandenen React-Aktionen mit der Signature-Choreografie.
 * Kein eigener Navigationszustand und kein zweites Setting: Diese Schicht
 * beobachtet nur die zwei bedeutenden Gesten und lässt die bestehende App
 * Navigation, Training und Tonwahl beherrschen.
 */
export function installCoreRitual(): void {
  if (installed) return
  installed = true
  root().dataset.anitewRitualReady = 'true'

  document.addEventListener(
    'click',
    (event) => {
      const target = event.target
      if (!(target instanceof Element)) return

      const core = target.closest('.hamburger')
      if (core !== null && core.getAttribute('aria-expanded') !== 'true') {
        pulseCore()
        return
      }

      const portal = target.closest('.start')
      if (portal instanceof HTMLButtonElement && !portal.disabled) beginPortalRitual()
    },
    true,
  )

  const observer = new MutationObserver(noticeSessionArrival)
  observer.observe(document.getElementById('root') ?? document.body, {
    childList: true,
    subtree: true,
  })

  window.addEventListener(
    'pagehide',
    () => {
      observer.disconnect()
      clearTimer(coreTimer)
      clearTimer(enteringFallback)
      clearTimer(arrivalTimer)
    },
    { once: true },
  )
}
