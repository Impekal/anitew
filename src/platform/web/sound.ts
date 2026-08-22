import type { Sound, SoundCue } from '../../core/index.ts'

/**
 * Die Töne von ANITEW (D-011/G-9).
 *
 * **Erzeugt, nicht mitgeliefert.** Kein einziges Audiofile: Alles entsteht zur
 * Laufzeit aus Sinusschwingungen. Das ist derselbe Gedanke wie bei den
 * Gesichtern (D-005) — es wiegt nichts, funktioniert offline, hat keine Lizenz
 * und lässt sich unendlich variieren.
 *
 * **Es kann nicht falsch klingen.** Alle Töne stammen aus einer
 * pentatonischen Tonleiter. Die hat keine Halbtonschritte, also gibt es keine
 * Reibung — egal in welcher Reihenfolge die Töne kommen, es klingt stimmig.
 *
 * **Es ist leise.** Weiche Anschläge, langes Ausklingen, eine Grundlautstärke
 * weit unter dem, was eine Spiele-App nimmt. Ein Ton soll bestätigen, nicht
 * belohnen (G-1).
 */

const BASE_HZ = 220
const SCALE = [0, 2, 4, 7, 9]
const MASTER = 0.14

interface Note {
  step: number
  at: number
  decay: number
  gain: number
}

function frequency(step: number): number {
  const octave = Math.floor(step / SCALE.length)
  const degree = SCALE[((step % SCALE.length) + SCALE.length) % SCALE.length] as number
  return BASE_HZ * 2 ** (octave + degree / 12)
}

function notesFor(cue: SoundCue, step: number): Note[] {
  switch (cue) {
    case 'core':
      // Der Core ist kein Menü-Klick: ein tiefer Kontakt, dann eine kleine
      // Antwort aus der Memory World. Kurz genug, um nicht zu nerven; eigen
      // genug, um nach einigen Tagen sofort als ANITEW erkannt zu werden.
      return [
        { step: -5, at: 0, decay: 0.8, gain: 0.24 },
        { step: 2, at: 0.065, decay: 1.15, gain: 0.27 },
        { step: 7, at: 0.2, decay: 1.55, gain: 0.16 },
      ]
    case 'start':
      // Das Portal öffnet nicht mit einer Fanfare, sondern mit Tiefe:
      // Unterton → Kern → weiter Nachklang. Derselbe Klangraum wie CORE,
      // nur größer. Dadurch werden Navigation und Training ein System.
      return [
        { step: -5, at: 0, decay: 1.25, gain: 0.32 },
        { step: 0, at: 0.045, decay: 1.45, gain: 0.42 },
        { step: 7, at: 0.18, decay: 2.15, gain: 0.24 },
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
    case 'landing':
      return [
        { step: 0, at: 0, decay: 1.0, gain: 0.24 },
        { step: 5, at: 0.08, decay: 1.35, gain: 0.22 },
        { step: 7, at: 0.22, decay: 1.8, gain: 0.18 },
      ]
    case 'done':
      return [
        { step: 0, at: 0, decay: 1.3, gain: 0.34 },
        { step: 2, at: 0.13, decay: 1.5, gain: 0.32 },
        { step: 4, at: 0.27, decay: 2.1, gain: 0.3 },
      ]
  }
}

/**
 * Weiche physische Marker nur an bedeutenden Übergängen.
 *
 * Die Vibration API funktioniert z. B. auf Android-Browsern. Safari/iOS-Web
 * unterstützt sie nicht zuverlässig; dort bleibt der Moment durch Klang und
 * visuelle Kompression vollständig verständlich. Eine native iOS-Hülle kann
 * später dieselben Ereignisse auf echte Haptics abbilden, ohne den Kern zu
 * ändern.
 */
function buzz(cue: SoundCue): void {
  const vibrate = (navigator as { vibrate?: (pattern: number | number[]) => boolean }).vibrate
  if (typeof vibrate !== 'function') return
  const pattern =
    cue === 'core'
      ? [6, 22, 10]
      : cue === 'start'
        ? [8, 28, 13]
        : cue === 'done'
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
    // Ein Gerät darf Haptik verweigern; die App darf deswegen nie scheitern.
  }
}

let activeSound: Sound | undefined

/**
 * Brücke für rein visuelle, nachgeladene Experience-Schichten. Sie benutzt
 * exakt dieselbe Sound-Instanz wie React und respektiert deshalb den
 * vorhandenen Ton-Schalter; kein zweiter AudioContext, keine Parallelwahrheit.
 */
export function playActiveWebSound(cue: SoundCue, step = 0): void {
  activeSound?.play(cue, step)
}

export function createWebSound(enabled: boolean): Sound {
  let on = enabled
  let context: AudioContext | undefined
  let master: GainNode | undefined

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

      document.addEventListener('visibilitychange', () => {
        if (context === undefined) return
        if (document.hidden) void context.suspend().catch(() => undefined)
        else void context.resume().catch(() => undefined)
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
    envelope.gain.setValueAtTime(0.0001, start)
    envelope.gain.exponentialRampToValueAtTime(note.gain, start + 0.012)
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + note.decay)

    for (const [multiple, level] of [
      [1, 1],
      [2, 0.28],
    ] as const) {
      const oscillator = ctx.createOscillator()
      oscillator.type = 'sine'
      oscillator.frequency.value = hz * multiple
      const voice = ctx.createGain()
      voice.gain.value = level
      oscillator.connect(voice).connect(envelope)
      oscillator.start(start)
      oscillator.stop(start + note.decay + 0.05)
    }
  }

  const sound: Sound = {
    play(cue, step = 0) {
      if (!on) return
      // Haptik hängt nicht davon ab, ob dieses Gerät WebAudio besitzt.
      buzz(cue)
      const ctx = ensure()
      if (ctx === undefined || master === undefined) return
      try {
        for (const note of notesFor(cue, step)) strike(ctx, master, note)
      } catch {
        // Ein stummer Ton ist hinnehmbar. Ein Absturz mitten in der Einheit nicht.
      }
    },
    setEnabled(next) {
      on = next
      if (!next && context !== undefined) void context.suspend().catch(() => undefined)
    },
    isEnabled() {
      return on
    },
  }

  activeSound = sound
  return sound
}
