import { playInterfaceSound, interfaceSoundEnabled } from '../platform/web/sound.ts'
import '../anitew-living-adaptive.css'
import '../anitew-core-ritual.css'
import '../anitew-sensory-light.css'
import '../anitew-system-light.css'
import '../anitew-core-menu-contrast.css'
import '../anitew-core-icon-identity.css'
import '../anitew-button-aura.css'
import '../anitew-core-glyph-distinct.css'
import '../anitew-living-node-shape.css'
import '../anitew-core-mobile.css'
import './firstRunExperience.ts'
import { mountNeuralField, unmountNeuralField } from './NeuralFieldMount.tsx'

let installed = false
let coreTimer: number | undefined
let enteringFallback: number | undefined
let arrivalTimer: number | undefined
let pressTimer: number | undefined

const root = () => document.documentElement

function clearTimer(timer: number | undefined): void {
  if (timer !== undefined) window.clearTimeout(timer)
}

function soundEnabled(): boolean {
  return interfaceSoundEnabled()
}

function tactile(pattern: number[]): void {
  if (!soundEnabled()) return
  const vibrate = (navigator as { vibrate?: (value: number | number[]) => boolean }).vibrate
  if (typeof vibrate !== 'function') return
  try {
    vibrate(pattern)
  } catch {
    // Web-Haptik ist ein Bonus. Visuell bleibt der Moment vollständig.
  }
}

type ToneKind = 'core' | 'portal' | 'select' | 'navigate' | 'confirm'

/** Shared A-family cues. Session start already supplies the portal signature. */
function ritualTone(kind: ToneKind): void {
  if (kind==='portal') return
  playInterfaceSound(kind==='core'?'start':kind==='select'?'type':kind==='confirm'?'recall':'block')
}

function flashPress(): void {
  root().dataset.anitewPress = 'true'
  clearTimer(pressTimer)
  pressTimer = window.setTimeout(() => {
    delete root().dataset.anitewPress
  }, 150)
}

function pulseCore(): void {
  const html = root()
  html.dataset.anitewCoreOpening = 'true'
  tactile([6, 22, 10])
  ritualTone('core')
  clearTimer(coreTimer)
  coreTimer = window.setTimeout(() => {
    delete html.dataset.anitewCoreOpening
  }, 760)
}

function beginPortalRitual(): void {
  const html = root()
  html.dataset.anitewEntering = 'true'
  tactile([8, 28, 13])
  ritualTone('portal')
  clearTimer(enteringFallback)
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

function installCoreRitual(): void {
  if (installed) return
  installed = true
  mountNeuralField()
  root().dataset.anitewRitualReady = 'true'

  document.addEventListener(
    'click',
    (event) => {
      const target = event.target
      if (!(target instanceof Element)) return

      const firstRun = target.closest('.arrival-begin')
      if (firstRun !== null) {
        tactile([6, 22, 10])
        ritualTone('core')
        flashPress()
        return
      }

      const core = target.closest('.hamburger')
      if (core !== null && core.getAttribute('aria-expanded') !== 'true') {
        pulseCore()
        flashPress()
        return
      }

      const portal = target.closest('.start')
      if (portal instanceof HTMLButtonElement && !portal.disabled) {
        beginPortalRitual()
        flashPress()
        return
      }

      const choice = target.closest('.mode, .theme-choice')
      if (choice instanceof HTMLButtonElement && !choice.disabled) {
        tactile([6])
        ritualTone('select')
        flashPress()
        return
      }

      const drive = target.closest('.first-run-drive-connect, .sync-run, .sync-stop')
      if (drive instanceof HTMLButtonElement && !drive.disabled) {
        tactile(drive.matches('.sync-stop') ? [8] : [7, 18, 7])
        ritualTone(drive.matches('.sync-stop') ? 'navigate' : 'confirm')
        flashPress()
        return
      }

      const drawerItem = target.closest('.drawer-item')
      if (drawerItem instanceof HTMLButtonElement && !drawerItem.disabled) {
        tactile([5])
        ritualTone('navigate')
        flashPress()
      }
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
      clearTimer(pressTimer)
      unmountNeuralField()
    },
    { once: true },
  )
}

installCoreRitual()
