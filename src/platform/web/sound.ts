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
 * Genau deshalb steht sie auf Kinderxylophonen.
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
      // Drei Töne aufwärts: ein Vorhang, der aufgeht.
      return [
        { step: 0, at: 0, decay: 1.1, gain: 0.5 },
        { step: 2, at: 0.09, decay: 1.1, gain: 0.45 },
        { step: 4, at: 0.18, decay: 1.4, gain: 0.4 },
      ]
    case 'word':
      // Steigt mit jedem Wort. Man hört, wie weit die Runde ist.
      return [{ step: 5 + step, at: 0, decay: 0.9, gain: 0.42 }]
    case 'type':
      // Kurz und hoch, fast ein Tropfen. Er darf beim Tippen nicht nerven.
      return [{ step: 12 + (step % 3), at: 0, decay: 0.28, gain: 0.22 }]
    case 'block':
      // Zwei Töne abwärts: etwas ist zu Ende, nichts ist schiefgegangen.
      return [
        { step: 4, at: 0, decay: 0.8, gain: 0.34 },
        { step: 2, at: 0.11, decay: 1.2, gain: 0.3 },
      ]
    case 'remember':
      // Zwei ruhige Töne aufwärts mit langem Ausklingen: etwas ist
      // aufgehoben. Kleiner als „done" — Merken ist ein Anfang, kein Finale.
      return [
        { step: 2, at: 0, decay: 1.2, gain: 0.36 },
        { step: 7, at: 0.14, decay: 1.8, gain: 0.32 },
      ]
    case 'connection':
      // Zwei nahe, ineinandergreifende Stimmen: eine Beziehung entsteht.
      return [
        { step: 1, at: 0.45, decay: 1.1, gain: 0.25 },
        { step: 2, at: 0.53, decay: 1.35, gain: 0.25 },
      ]
    case 'return':
      // Ein tiefer Ton kommt zurück, ein zweiter öffnet kurz den Raum darum.
      // Kein Sieg, kein Jingle: eher Wiedererkennen als Belohnung.
      return [
        { step: 0, at: 0, decay: 1.05, gain: 0.27 },
        { step: 5, at: 0.1, decay: 1.45, gain: 0.2 },
      ]
    case 'recall':
      // Ein einzelner warmer Impuls: aufgelöst, aber nicht als Sieg verkauft.
      return [{ step: 4, at: 0, decay: 0.75, gain: 0.28 }]
    case 'done':
      // Ein warmer Schluss, kein Sieges-Jingle: drei tiefe Atemzüge.
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
 * eine echte Wiederbegegnung oder die Einheit zu Ende ist: eine Bestätigung,
 * die man in der Tasche spürt. RETURN ist bewusst zweiteilig: „da“ — „wieder“.
 */
function buzz(cue: SoundCue): void {
  const vibrate = (navigator as { vibrate?: (pattern: number | number[]) => boolean }).vibrate
  if (typeof vibrate !== 'function') return
  const pattern =
    cue === 'done'
      ? [16, 40, 16]
      : cue === 'return'
        ? [9, 34, 9]
        : cue === 'block'
          ? [14]
          : undefined
  if (pattern === undefined) return
  try {
    vibrate(pattern)
  } catch {
    // Manche Browser verlangen für `vibrate` eine vorangegangene Berührung.
    // Dann fällt es aus — es war nie mehr als eine Beigabe.
  }
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

      // Im Hintergrund schweigen und beim Zurückkommen weitermachen.
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
    // Weicher Anschlag statt Klick: 12 ms hoch, dann exponentiell aus.
    envelope.gain.setValueAtTime(0.0001, start)
    envelope.gain.exponentialRampToValueAtTime(note.gain, start + 0.012)
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + note.decay)

    // Grundton plus eine leise Oktave darüber — das gibt dem Sinus Glanz,
    // ohne dass er metallisch wird.
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

  return {
    play(cue, step = 0) {
      if (!on) return
      const ctx = ensure()
      if (ctx === undefined || master === undefined) return
      /*
       * Haptik hängt am selben Schalter wie der Ton (O6): „dezent und
       * abschaltbar“ heißt hier ein Schalter für beides, nicht zwei. Nur bei
       * den bedeutsamen Wechseln — nicht bei jedem Wort —, und nur, wo das
       * Gerät es kann. iOS-Safari kennt `vibrate` nicht; dort bleibt es ein
       * stiller Verzicht, kein Fehler.
       */
      buzz(cue)
      try {
        for (const note of notesFor(cue, step)) strike(ctx, master, note)
      } catch {
        // Ein stummer Ton ist ein hinnehmbarer Fehler. Ein Absturz mitten in
        // einer Trainingseinheit wäre keiner.
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
}
