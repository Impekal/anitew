import '../anitew-living-adaptive.css'
import '../anitew-core-ritual.css'
import './firstRunExperience.ts'
import { mountNeuralField, unmountNeuralField } from './NeuralFieldMount.tsx'

let installed = false
let coreTimer: number | undefined
let enteringFallback: number | undefined
let arrivalTimer: number | undefined
let ritualAudio: AudioContext | undefined

const root = () => document.documentElement

function clearTimer(timer: number | undefined): void {
  if (timer !== undefined) window.clearTimeout(timer)
}

function soundEnabled(): boolean {
  return document.querySelector('.sound-toggle')?.getAttribute('aria-pressed') !== 'false'
}

function tactile(pattern: number[]): void {
  const vibrate = (navigator as { vibrate?: (value: number | number[]) => boolean }).vibrate
  if (typeof vibrate !== 'function') return
  try {
    vibrate(pattern)
  } catch {
    // Web-Haptik ist ein Bonus. Visuell bleibt der Moment vollständig.
  }
}

/**
 * Ein winziger, rein nachgeladener Klangfingerabdruck für den Core. Er lebt
 * absichtlich in diesem Experience-Chunk: Der normale Trainingssound bleibt
 * unverändert im Startbundle und der Woooooow-Pass kostet keine Kaltstart-Bytes.
 */
function ritualTone(kind: 'core' | 'portal'): void {
  if (!soundEnabled()) return
  try {
    const Ctor =
      window.AudioContext ??
      (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (Ctor === undefined) return
    ritualAudio ??= new Ctor()
    if (ritualAudio.state === 'suspended') void ritualAudio.resume().catch(() => undefined)

    const now = ritualAudio.currentTime
    const notes = kind === 'core' ? ([110, 277.18, 440] as const) : ([110, 220, 440] as const)
    const delays = kind === 'core' ? [0, 0.065, 0.2] : [0, 0.045, 0.18]
    const decays = kind === 'core' ? [0.8, 1.15, 1.55] : [1.25, 1.45, 2.15]
    const gains = kind === 'core' ? [0.034, 0.038, 0.022] : [0.042, 0.055, 0.032]

    notes.forEach((hz, index) => {
      const start = now + (delays[index] ?? 0)
      const decay = decays[index] ?? 1
      const envelope = ritualAudio?.createGain()
      const oscillator = ritualAudio?.createOscillator()
      if (envelope === undefined || oscillator === undefined || ritualAudio === undefined) return
      envelope.gain.setValueAtTime(0.0001, start)
      envelope.gain.exponentialRampToValueAtTime(gains[index] ?? 0.03, start + 0.012)
      envelope.gain.exponentialRampToValueAtTime(0.0001, start + decay)
      oscillator.type = 'sine'
      oscillator.frequency.value = hz
      oscillator.connect(envelope).connect(ritualAudio.destination)
      oscillator.start(start)
      oscillator.stop(start + decay + 0.05)
    })
  } catch {
    // Ein Browser ohne freigegebenes WebAudio bekommt weiterhin die ganze
    // visuelle Choreografie; Klang darf niemals den Start blockieren.
  }
}

function pulseCore(): void {
  const html = root()
  html.dataset.anitewCoreOpening = 'true'
  if (soundEnabled()) {
    tactile([6, 22, 10])
    ritualTone('core')
  }
  clearTimer(coreTimer)
  coreTimer = window.setTimeout(() => {
    delete html.dataset.anitewCoreOpening
  }, 760)
}

function beginPortalRitual(): void {
  const html = root()
  html.dataset.anitewEntering = 'true'
  if (soundEnabled()) {
    tactile([8, 28, 13])
    ritualTone('portal')
  }
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

      // Beim allerersten Einstieg ist „Los geht’s“ die erste freigegebene
      // Nutzer-Geste. Genau dort darf das Sonic Logo zuverlässig erklingen —
      // iOS blockiert Ton beim bloßen Seitenaufruf. Danach tragen Core und
      // Portal dieselbe Klang-DNA weiter.
      const firstRun = target.closest('.arrival-begin')
      if (firstRun !== null) {
        tactile([6, 22, 10])
        ritualTone('core')
        return
      }

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
      unmountNeuralField()
      if (ritualAudio !== undefined) void ritualAudio.close().catch(() => undefined)
    },
    { once: true },
  )
}

installCoreRitual()
