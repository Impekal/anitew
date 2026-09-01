import type { Sound, SoundCue } from '../../core/index.ts'
import { frequency } from './tone.ts'
import {
  ALL_SOUND_ON,
  ambientAudible,
  audible,
  type SoundCategorySetting,
} from '../../core/sound/categories.ts'

/**
 * Die Töne von ANITEW (D-011/G-9).
 *
 * **Erzeugt, nicht mitgeliefert.** Kein einziges Audiofile: Alles entsteht zur
 * Laufzeit aus Sinusschwingungen. Das ist derselbe Gedanke wie bei den
 * Gesichtern (D-005) — es wiegt nichts, funktioniert offline, hat keine Lizenz
 * und lässt sich unendlich variieren.
 *
 * **Eine Klangfamilie.** Start, Retrieve, Long Return, Completion und Error
 * stammen aus derselben warmen Pentatonik und denselben zwei weichen
 * Sinus-Partialen. Der Fehlerklang ist deshalb kein Alarm: Er löst nach unten
 * auf und sagt nur „noch offen“.
 *
 * **Es ist leise.** Weiche Anschläge, langes Ausklingen, eine Grundlautstärke
 * weit unter dem, was eine Spiele-App nimmt. Ein Ton soll bestätigen, nicht
 * belohnen (G-1): Wer ihn abschaltet, soll nichts vermissen außer der
 * Bestätigung.
 *
 * Zwei Eigenheiten der Browser, die hier gelöst sind:
 *
 * 1. **iOS gibt keinen Ton ohne Berührung.** Der AudioContext entsteht deshalb
 *    erst beim ersten `play()` — und das erste `play()` ist `start`, ausgelöst
 *    vom Fingertipp auf den Startknopf. Wird er trotzdem angehalten geliefert,
 *    versucht `resume()` es bei jedem weiteren Ton erneut.
 * 2. **Der Ton läuft weiter, wenn die App in den Hintergrund geht.** Deshalb
 *    wird der Kontext beim Verstecken angehalten und beim Zurückkommen wieder
 *    aufgenommen.
 */

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



function notesFor(cue: SoundCue, step: number): Note[] {
  switch (cue) {
    case 'start':
      // Audio-Logo: 0.18 s Attack-Folge, 1.4 s warmer Ausklang.
      return [
        { step: 0, at: 0, decay: 1.1, gain: 0.5 },
        { step: 2, at: 0.09, decay: 1.1, gain: 0.45 },
        { step: 4, at: 0.18, decay: 1.4, gain: 0.4 },
      ]
    case 'arrival':
      /*
       * Die einzige Melodie der App — fuer die drei Sekunden Ankommen
       * (D-011/G-1). Sie steigt langsam durch die Pentatonik und loest sich
       * in einer offenen Quinte auf: ein Aufmachen, kein Fanfarenstoss. Die
       * Toene liegen weit auseinander (0,0 / 0,42 / 0,86 / 1,3 s), damit
       * nichts draengt; der letzte klingt ueber das Ende des Ankommens
       * hinaus und traegt in die Einheit hinein.
       */
      return [
        { step: 0, at: 0, decay: 1.6, gain: 0.26 },
        { step: 2, at: 0.42, decay: 1.6, gain: 0.24 },
        { step: 4, at: 0.86, decay: 1.8, gain: 0.22 },
        { step: 7, at: 1.3, decay: 2.6, gain: 0.2 },
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
        { step: 2, at: 0.13, decay: 1.5, gain: 0.32 },
        { step: 4, at: 0.27, decay: 2.1, gain: 0.3 },
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

export function createWebSound(enabled: boolean): Sound {
  let on = enabled
  let categories: SoundCategorySetting = ALL_SOUND_ON
  let context: AudioContext | undefined
  let master: GainNode | undefined
  let ambient: { gain: GainNode; stop: () => void } | undefined

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

  /*
   * Der Dauerklang wird erst geladen, wenn er zum ersten Mal gebraucht wird
   * (P4): Er gehoert zur Einheit, nicht zum Start. Der Chunk ist winzig und
   * liegt im Precache, also auch offline sofort da. `wanted` faengt den Fall
   * ab, dass jemand die Einheit verlaesst, waehrend das Modul noch laedt —
   * sonst finge der Klang an, nachdem er schon aufhoeren sollte.
   */
  let ambientModule: Promise<typeof import('./ambient.ts')> | undefined
  let wanted = false

  const mark = () => {
    // Ein Signal fuer die Pruefung — der Klang selbst laesst sich im Test
    // nicht hoeren, sein Laufen schon.
    if (ambient === undefined) delete document.documentElement.dataset.anitewAmbient
    else document.documentElement.dataset.anitewAmbient = 'focus'
  }

  const stopAmbient = () => {
    wanted = false
    if (ambient === undefined) return
    const running = ambient
    ambient = undefined
    mark()
    try {
      const ctx = context
      if (ctx === undefined) return
      // Dieselbe Blende wie beim Aufziehen; der Wert steht bei den Stimmen.
      const end = ctx.currentTime + 1.4
      running.gain.gain.cancelScheduledValues(ctx.currentTime)
      running.gain.gain.setValueAtTime(running.gain.gain.value, ctx.currentTime)
      running.gain.gain.exponentialRampToValueAtTime(0.0001, end)
      running.stop()
    } catch {
      // Ein Klang, der nicht sauber ausblendet, darf die Einheit nicht stoppen.
    }
  }

  const startAmbient = () => {
    if (!ambientAudible(on, categories) || ambient !== undefined) return
    const ctx = ensure()
    if (ctx === undefined || master === undefined) return
    wanted = true
    const out = master
    ambientModule ??= import('./ambient.ts')
    void ambientModule
      .then(({ startAmbientVoices }) => {
        if (!wanted || ambient !== undefined || !ambientAudible(on, categories)) return
        ambient = startAmbientVoices(ctx, out)
        mark()
      })
      .catch(() => undefined)
  }

  return {
    play(cue, step = 0) {
      if (!audible(cue, on, categories)) return
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
      if (!next) {
        stopAmbient()
        if (context !== undefined) void context.suspend().catch(() => undefined)
      }
    },
    isEnabled() {
      return on
    },
    setCategories(next) {
      categories = next
      // Sofort wirken, nicht erst beim naechsten Start: Wer den Dauerklang
      // mitten in der Einheit abschaltet, will ihn jetzt weghaben.
      if (!ambientAudible(on, categories)) stopAmbient()
    },
    categories() {
      return categories
    },
    startAmbient,
    stopAmbient,
  }
}
