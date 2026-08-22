import { playActiveWebSound } from '../platform/web/sound.ts'
import '../anitew-core-ritual.css'

let installed = false
let coreTimer: number | undefined
let enteringFallback: number | undefined
let arrivalTimer: number | undefined

const root = () => document.documentElement

function clearTimer(timer: number | undefined): void {
  if (timer !== undefined) window.clearTimeout(timer)
}

function pulseCore(): void {
  const html = root()
  html.dataset.anitewCoreOpening = 'true'
  playActiveWebSound('core')
  clearTimer(coreTimer)
  coreTimer = window.setTimeout(() => {
    delete html.dataset.anitewCoreOpening
  }, 760)
}

function beginPortalRitual(): void {
  const html = root()
  html.dataset.anitewEntering = 'true'
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
 *
 * Kein eigener Navigationszustand, kein zweites Sound-Setting: Der Core bleibt
 * derselbe zugängliche Button und der Trainingsstart bleibt dieselbe React-
 * Aktion. Diese Schicht beobachtet nur die zwei bedeutenden Gesten und lässt
 * die bestehende App ihre Arbeit tun.
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
