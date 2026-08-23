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
let ritualAudio: AudioContext | undefined

const root = () => document.documentElement

function clearTimer(timer: number | undefined): void {
  if (timer !== undefined) window.clearTimeout(timer)
}

function soundEnabled(): boolean {
  return document.querySelector('.sound-toggle')?.getAttribute('aria-pressed') !== 'false'
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

/**
 * ANITEWs akustische Sprache bleibt klein und bedeutungsvoll: Auswahl ist ein
 * trockener kurzer Impuls, Navigation etwas weicher, Core/Portal tragen die
 * tiefe Marken-DNA. Keine Zufallssounds und keine Belohnungsmaschine.
 */
function ritualTone(kind: ToneKind): void {
  if (!soundEnabled()) return
  try {
    const Ctor =
      window.AudioContext ??
      (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (Ctor === undefined) return
    ritualAudio ??= new Ctor()
    if (ritualAudio.state === 'suspended') void ritualAudio.resume().catch(() => undefined)

    const bank: Record<ToneKind, {
      notes: readonly number[]
      delays: readonly number[]
      decays: readonly number[]
      gains: readonly number[]
      wave: OscillatorType
    }> = {
      core: {
        notes: [110, 277.18, 440],
        delays: [0, 0.065, 0.2],
        decays: [0.8, 1.15, 1.55],
        gains: [0.034, 0.038, 0.022],
        wave: 'sine',
      },
      portal: {
        notes: [110, 220, 440],
        delays: [0, 0.045, 0.18],
        decays: [1.25, 1.45, 2.15],
        gains: [0.042, 0.055, 0.032],
        wave: 'sine',
      },
      select: {
        notes: [330, 494],
        delays: [0, 0.026],
        decays: [0.11, 0.16],
        gains: [0.024, 0.013],
        wave: 'triangle',
      },
      navigate: {
        notes: [220, 330],
        delays: [0, 0.035],
        decays: [0.14, 0.2],
        gains: [0.018, 0.011],
        wave: 'sine',
      },
      confirm: {
        notes: [294, 440, 587],
        delays: [0, 0.035, 0.08],
        decays: [0.16, 0.22, 0.3],
        gains: [0.019, 0.017, 0.011],
        wave: 'sine',
      },
    }

    const voice = bank[kind]
    const now = ritualAudio.currentTime
    voice.notes.forEach((hz, index) => {
      const start = now + (voice.delays[index] ?? 0)
      const decay = voice.decays[index] ?? 0.16
      const envelope = ritualAudio?.createGain()
      const oscillator = ritualAudio?.createOscillator()
      if (envelope === undefined || oscillator === undefined || ritualAudio === undefined) return
      envelope.gain.setValueAtTime(0.0001, start)
      envelope.gain.exponentialRampToValueAtTime(voice.gains[index] ?? 0.012, start + 0.008)
      envelope.gain.exponentialRampToValueAtTime(0.0001, start + decay)
      oscillator.type = voice.wave
      oscillator.frequency.value = hz
      oscillator.connect(envelope).connect(ritualAudio.destination)
      oscillator.start(start)
      oscillator.stop(start + decay + 0.04)
    })
  } catch {
    // Ein Browser ohne freigegebenes WebAudio bekommt weiterhin die ganze
    // visuelle Choreografie; Klang darf niemals den Start blockieren.
  }
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
      if (ritualAudio !== undefined) void ritualAudio.close().catch(() => undefined)
    },
    { once: true },
  )
}

installCoreRitual()
