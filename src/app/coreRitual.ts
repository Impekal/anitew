import { playInterfaceSound, interfaceSoundEnabled } from '../platform/web/sound.ts'
import '../anitew-living-adaptive.css'
import '../anitew-core-ritual.css'
import '../anitew-sensory-light.css'
import '../anitew-system-light.css'
import '../anitew-button-aura.css'
import '../anitew-living-node-shape.css'

import { firstRunGuidePending } from './firstRunGuideState.ts'

let installed = false
let coreTimer: number | undefined
let enteringFallback: number | undefined
let arrivalTimer: number | undefined
let pressTimer: number | undefined
let coreStylesLoad: Promise<unknown> | undefined
let firstRunLoad: Promise<unknown> | undefined

const root = () => document.documentElement

function clearTimer(timer: number | undefined): void {
  if (timer !== undefined) window.clearTimeout(timer)
}

/**
 * A-14: Diese vier Blätter gestalten ausschließlich den geöffneten Core.
 * Früher wurden sie bei jedem Start nach 750 ms geparst und auf den gesamten
 * DOM angewandt, obwohl der Nutzer den Core vielleicht gar nicht öffnet.
 */
function ensureCoreStyles(): Promise<unknown> {
  coreStylesLoad ??= Promise.all([
    import('../anitew-core-menu-contrast.css'),
    import('../anitew-core-icon-identity.css'),
    import('../anitew-core-glyph-distinct.css'),
    import('../anitew-core-mobile.css'),
  ]).catch(() => undefined)
  return coreStylesLoad
}

function ensureFirstRunExperience(): Promise<unknown> {
  firstRunLoad ??= import('./firstRunExperience.ts').catch(() => undefined)
  return firstRunLoad
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

function prewarmInteraction(event: Event): void {
  const target = event.target
  if (!(target instanceof Element)) return
  if (target.closest('.hamburger, .drawer-item') !== null) void ensureCoreStyles()
  if (target.closest('.arrival-begin') !== null) void ensureFirstRunExperience()
}

function installCoreRitual(): void {
  if (installed) return
  installed = true
  root().dataset.anitewRitualReady = 'true'

  /*
   * Auf einem echten Erstlauf gehört die Einführung weiterhin zur Signature-
   * Experience. Dazu kommt der eine Fall, in dem ein späterer Start sie doch
   * braucht: Wer die App mitten in der Führung geschlossen hat, trägt
   * `pending=1` im Speicher — ohne das Modul konnte diese Marke nie wieder
   * etwas zeigen (gemessen 30.08., siehe firstRunGuideState.ts). Auf jedem
   * anderen Start wird dieser Code weiterhin gar nicht geladen.
   */
  if (document.querySelector('.onboarding') !== null || firstRunGuidePending()) {
    void ensureFirstRunExperience()
  }

  // Finger wie Tastatur: Vor der eigentlichen Aktivierung beginnen die
  // Core-spezifischen Blätter zu laden. Das vermeidet einen ungestylten Frame
  // beim Öffnen, ohne sie auf jedem Start vorab zu parsen.
  document.addEventListener('pointerdown', prewarmInteraction, true)
  document.addEventListener('focusin', prewarmInteraction, true)

  document.addEventListener(
    'click',
    (event) => {
      const target = event.target
      if (!(target instanceof Element)) return

      const firstRun = target.closest('.arrival-begin')
      if (firstRun !== null) {
        void ensureFirstRunExperience()
        tactile([6, 22, 10])
        ritualTone('core')
        flashPress()
        return
      }

      const core = target.closest('.hamburger')
      if (core !== null && core.getAttribute('aria-expanded') !== 'true') {
        void ensureCoreStyles()
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
        void ensureCoreStyles()
        tactile([5])
        ritualTone('navigate')
        flashPress()
      }
    },
    true,
  )

  // Dieser Observer darf bei BFCache nicht dauerhaft getrennt werden: das
  // Dokument wird nur eingefroren und später mit demselben Modul fortgesetzt.
  // Beim echten Verlassen entsorgt der Browser ihn ohnehin zusammen mit dem
  // Dokument.
  const observer = new MutationObserver(noticeSessionArrival)
  observer.observe(document.getElementById('root') ?? document.body, {
    childList: true,
    subtree: true,
  })

  window.addEventListener(
    'pagehide',
    (event) => {
      if (!event.persisted) observer.disconnect()
      clearTimer(coreTimer)
      clearTimer(enteringFallback)
      clearTimer(arrivalTimer)
      clearTimer(pressTimer)
      delete root().dataset.anitewCoreOpening
      delete root().dataset.anitewEntering
      delete root().dataset.anitewSessionArriving
    },
  )
}

installCoreRitual()
