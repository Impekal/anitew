import { frequency } from './tone.ts'

/**
 * Der Klang waehrend der Einheit (Geraetewunsch 31.08.).
 *
 * **Ehrlich gesagt, was er ist**: ein sehr leiser, langsamer Grundklang aus
 * derselben Familie wie alles andere — zwei liegende Toene (Grundton und
 * Quinte) plus ein drittes, kaum hoerbares Atmen darueber. Er ist kein
 * Musikstueck und wiederholt keine Melodie: Wiederholung zieht Aufmerksamkeit
 * auf sich, und die soll beim Merken bleiben.
 *
 * **Was er nicht ist**: ein Konzentrationsversprechen. Ob ein Dauerklang beim
 * Merken hilft, haengt am Menschen — manche brauchen Stille. Deshalb ist er
 * abschaltbar wie jeder andere Bereich, und die App behauptet nichts, was sie
 * nicht gemessen hat (R-1).
 *
 * **Akku**: Vier Oszillatoren, keine Zeitgeber, kein Nachschub — die
 * WebAudio-Uhr laeuft im Audio-Thread. Er startet nur in der Einheit und wird
 * angehalten, sobald die App in den Hintergrund geht oder die Einheit endet
 * (BACKLOG P9).
 */
const AMBIENT_VOICES = [
  { step: 0, level: 0.5, detune: 0 },
  { step: 0, level: 0.4, detune: 6 },
  { step: 4, level: 0.24, detune: -4 },
  { step: 7, level: 0.16, detune: 3 },
] as const

/** Sehr leise: knapp ueber der Hoerschwelle im ruhigen Raum. */
const AMBIENT_GAIN = 0.055

/** Weiches Auf- und Abblenden, damit nichts klickt. */
const AMBIENT_FADE = 1.4

/** Startet den Dauerklang und gibt zurueck, wie er wieder aufhoert. */
export function startAmbientVoices(
  ctx: AudioContext,
  out: GainNode,
): { gain: GainNode; stop: () => void } {
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(AMBIENT_GAIN, ctx.currentTime + AMBIENT_FADE)
  gain.connect(out)

  const oscillators = AMBIENT_VOICES.map((voice) => {
    const oscillator = ctx.createOscillator()
    oscillator.type = 'sine'
    oscillator.frequency.value = frequency(voice.step) / 2
    oscillator.detune.value = voice.detune
    const level = ctx.createGain()
    level.gain.value = voice.level
    oscillator.connect(level).connect(gain)
    oscillator.start()
    return oscillator
  })

  return {
    gain,
    stop: () => {
      for (const oscillator of oscillators) {
        try {
          oscillator.stop(ctx.currentTime + AMBIENT_FADE + 0.1)
        } catch {
          // Ein bereits gestoppter Oszillator ist kein Fehler.
        }
      }
    },
  }
}

export { AMBIENT_FADE }
