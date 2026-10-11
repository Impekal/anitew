import type { Sound, SoundCue } from '../../core/index.ts'

/** Shared local sound family based on the selected ANITEW A motif.
 * UI and training share one context and the saved mute preference.
 */
/** Grundton A3. Tief genug, dass nichts schrill wird. */
const BASE_HZ = 220

/** Pentatonisch: große Sekunde, Terz, Quinte, Sexte. Keine Halbtöne. */
const SCALE = [0, 2, 4, 7, 9]

/** Insgesamt sehr leise — ein Bestätigen, kein Belohnen. */
const MASTER = 0.14

interface Note {
  /** Stufe in der Tonleiter, 0 = Grundton. Darf über 4 hinausgehen. */
  step: number
  /** Verzögerung in Sekunden ab jetzt. */
  at: number
  /** Ausklingzeit in Sekunden. */
  decay: number
  /** Lautstärke relativ zur Grundlautstärke. */
  gain: number
}

function frequency(step: number): number {
  const octave = Math.floor(step / SCALE.length)
  const degree = SCALE[((step % SCALE.length) + SCALE.length) % SCALE.length] as number
  return BASE_HZ * 2 ** (octave + degree / 12)
}

function notesFor(cue: SoundCue, step: number): Note[] {
  switch (cue) {
    case 'start':
      // Selected A: A3 → E4 → C♯4, starts at 0 / .18 / .43 seconds.
      return [
        { step: 0, at: 0, decay: .85, gain: .09 / MASTER },
        { step: 3, at: .18, decay: .85, gain: .09 / MASTER },
        { step: 2, at: .43, decay: .85, gain: .09 / MASTER },
      ]
    case 'word':
      return [{ step: 5 + step, at: 0, decay: 0.9, gain: 0.42 }]
    case 'type':
      return [{ step: 12 + (step % 3), at: 0, decay: 0.28, gain: 0.22 }]
    case 'block':
      return [
        { step: 4, at: 0, decay: 0.8, gain: 0.34 },
        { step: 2, at: 0.11, decay: 1.2, gain: 0.3 },
      ]
    case 'remember':
      return [
        { step: 2, at: 0, decay: 1.2, gain: 0.36 },
        { step: 7, at: 0.14, decay: 1.8, gain: 0.32 },
      ]
    case 'connection':
      return [
        { step: 1, at: 0.45, decay: 1.1, gain: 0.25 },
        { step: 2, at: 0.53, decay: 1.35, gain: 0.25 },
      ]
    case 'return':
      return [
        { step: 0, at: 0, decay: 1.05, gain: 0.27 },
        { step: 5, at: 0.1, decay: 1.45, gain: 0.2 },
      ]
    case 'recall':
      return [{ step: 4, at: 0, decay: 0.75, gain: 0.28 }]
    case 'error':
      // Kein Buzzer, kein dissonanter Alarm: dieselbe Familie, nur offen
      // nach unten. Kurz genug, dass der folgende Blockwechsel Platz behält.
      return [
        { step: 2, at: 0, decay: 0.62, gain: 0.22 },
        { step: 0, at: 0.1, decay: 0.82, gain: 0.18 },
      ]
    case 'landing':
      // Signature moment: etwas Persönliches ist wirklich zurückgekommen.
      // Drei sehr leise Stimmen bilden keine Fanfare, sondern einen Raum,
      // der sich kurz schließt: Grundton → Verbindung → warmer Nachklang.
      return [
        { step: 0, at: 0, decay: 1.0, gain: 0.24 },
        { step: 5, at: 0.08, decay: 1.35, gain: 0.22 },
        { step: 7, at: 0.22, decay: 1.8, gain: 0.18 },
      ]
    case 'done':
      return [
        { step: 0, at: 0, decay: 1.3, gain: 0.34 },
        { step: 3, at: 0.18, decay: 1.5, gain: 0.32 },
        { step: 2, at: 0.43, decay: 2.1, gain: 0.3 },
      ]
  }
}

/**
 * Ein kurzer, weicher Stoß bei den Wechseln, die zählen (O6).
 *
 * Nicht bei jedem Wort — das wäre ein zappelndes Telefon. Nur wenn ein Block,
 * eine echte Wiederbegegnung, ein echter persönlicher Abruf oder die Einheit
 * zu Ende ist. RETURN sagt „da — wieder“. LANDING ist noch kleiner und enger:
 * „gefunden“ — ohne Siegesgeste. ERROR vibriert absichtlich **nicht**.
 */
function buzz(cue: SoundCue): void {
  const vibrate = (navigator as { vibrate?: (pattern: number | number[]) => boolean }).vibrate
  if (typeof vibrate !== 'function') return
  const pattern =
    cue === 'done'
      ? [16, 40, 16]
      : cue === 'return'
        ? [9, 34, 9]
        : cue === 'landing'
          ? [7, 24, 12]
          : cue === 'block'
            ? [14]
            : undefined
  if (pattern === undefined) return
  try {
    vibrate(pattern)
  } catch {
    // Manche Browser verlangen für `vibrate` eine vorangegangene Berührung.
  }
}

let interfaceSound: Sound | undefined
/** Core navigation uses the same context and setting as training. */
export function sharedWebSound(): Sound { return interfaceSound ?? createWebSound(true) }
export function playInterfaceSound(cue: SoundCue): void { interfaceSound?.play(cue) }
export function interfaceSoundEnabled(): boolean { return interfaceSound?.isEnabled() ?? false }

export function createWebSound(enabled: boolean): Sound {
  let on = enabled
  let context: AudioContext | undefined
  let master: GainNode | undefined
  const active = new Set<OscillatorNode>()
  const stopAll = () => { for (const oscillator of active) { try { oscillator.stop() } catch {} }; active.clear() }

  const ensure = (): AudioContext | undefined => {
    if (context === undefined) {
      const Ctor =
        window.AudioContext ??
        (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (Ctor === undefined) return undefined
      context = new Ctor()
      master = context.createGain()
      master.gain.value = MASTER
      master.connect(context.destination)

      window.addEventListener('pagehide', () => { stopAll(); if(context)void context.suspend().catch(()=>undefined) })
      document.addEventListener('visibilitychange', () => {
        if (context === undefined) return
        if (document.hidden) { stopAll(); void context.suspend().catch(() => undefined) }
      })
    }
    if (context.state === 'suspended') void context.resume().catch(() => undefined)
    return context
  }

  const strike = (ctx: AudioContext, out: GainNode, note: Note) => {
    const start = ctx.currentTime + note.at
    const hz = frequency(note.step)

    const envelope = ctx.createGain()
    envelope.connect(out)
    const curve=Float32Array.from({length:256},(_,i)=>{
      const t=i/255*note.decay
      return note.gain*Math.min(1,t/.018)*Math.min(1,(note.decay-t)/.07)*Math.exp(-4*t/note.decay)
    })
    envelope.gain.setValueCurveAtTime(curve,start,note.decay)

    for (const [multiple, level] of [
      [1, 1],
      [2, 0.055],
    ] as const) {
      const oscillator = ctx.createOscillator()
      oscillator.type = 'sine'
      oscillator.frequency.value = hz * multiple
      const voice = ctx.createGain()
      voice.gain.value = level
      oscillator.connect(voice).connect(envelope)
      active.add(oscillator)
      oscillator.onended=()=>{active.delete(oscillator);oscillator.disconnect();voice.disconnect()}
      oscillator.start(start)
      oscillator.stop(start + note.decay + 0.05)
    }
  }

  const sound: Sound = {
    play(cue, step = 0) {
      if (!on || document.hidden) return
      const ctx = ensure()
      if (ctx === undefined || master === undefined) return
      buzz(cue)
      try {
        for (const note of notesFor(cue, step)) strike(ctx, master, note)
      } catch {
        // Ein stummer Ton ist hinnehmbar. Ein Absturz mitten in der Einheit nicht.
      }
    },
    setEnabled(next) {
      on = next
      if (!next) { stopAll(); if (context !== undefined) void context.suspend().catch(() => undefined) }
    },
    isEnabled() {
      return on
    },
  }
  interfaceSound=sound
  return sound
}
