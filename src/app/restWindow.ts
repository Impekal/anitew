/*
 * Das Ruhefenster (Gerätemeldung 31.08.: „macht das Handy heiß und
 * verbraucht extrem viel Akku").
 *
 * Gemessen am gebauten Stand: Der Welcome-Screen fährt ~94 Endlos-Animationen
 * gleichzeitig, und schon eine einzige zwingt die Render-Pipeline dauerhaft
 * auf volle Bildrate — mit Deko 134 % eines Kerns, mit wirklich pausierter
 * Deko 6 % (Software-Rendering macht die Renderarbeit als CPU sichtbar; auf
 * dem Telefon heißt dieselbe Arbeit GPU-Takt, Wärme, Akku).
 *
 * Deshalb: Nach einem Fenster ohne Eingabe werden alle laufenden
 * CSS-Animationen angehalten; die nächste Eingabe setzt genau die
 * angehaltenen fort. Die „lebende Welt" bleibt beim Bedienen unverändert —
 * sie schläft nur, wenn niemand hinsieht bzw. niemand etwas tut.
 *
 * Bewusste Grenzen:
 * - Nur CSS-Animationen. Übergänge (CSSTransition) sind endlich und tragen
 *   Zustandswechsel — ein angehaltener Übergang würde Oberfläche einfrieren,
 *   die gerade etwas mitteilt.
 * - Pausiert wird über die Web-Animations-Objekte, nicht über ein
 *   Stylesheet: Mehrere Deko-Regeln setzen `animation: … !important`, und
 *   der Shorthand stellt `animation-play-state` mit derselben Wucht zurück —
 *   ein pausierendes CSS-Blatt verliert dort (gemessen: 102 % statt 6 %).
 * - Wer während der Ruhe zu laufen beginnt (das Neuralfeld mountet z. B.
 *   erst ~5,5 s nach dem Start), wird über `animationstart` sofort mit
 *   angehalten — ereignisgetrieben, kein Wecker im Schlaf.
 */

const DEFAULT_REST_AFTER_MS = 20_000

/**
 * `restAfter` ist ausschließlich E2E-Vertrag (wie `firstLaunch` in
 * index.html): Er verkürzt die Wartezeit, die Mechanik bleibt dieselbe.
 */
function restDelay(): number {
  try {
    const raw = new URLSearchParams(window.location.search).get('restAfter')
    if (raw === null || raw === '') return DEFAULT_REST_AFTER_MS
    const parsed = Number(raw)
    if (!Number.isFinite(parsed)) return DEFAULT_REST_AFTER_MS
    return Math.min(Math.max(parsed, 500), 120_000)
  } catch {
    return DEFAULT_REST_AFTER_MS
  }
}

function isCssAnimation(animation: Animation): boolean {
  return typeof CSSAnimation !== 'undefined' && animation instanceof CSSAnimation
}

export function installRestWindow(): void {
  const delay = restDelay()
  let timer: number | undefined
  let resting = false
  const paused: Animation[] = []

  const sweep = (): void => {
    for (const animation of document.getAnimations()) {
      if (animation.playState !== 'running') continue
      if (!isCssAnimation(animation)) continue
      try {
        /*
         * Endloses pausiert, Endliches endet sofort: Eine Einblende-Animation
         * bei Frame 0 anzuhalten hieße, frisch erscheinenden Inhalt unsichtbar
         * einzufrieren, bis jemand wieder tippt. `finish()` springt ans Ziel —
         * der Inhalt steht da, als wäre die Animation normal zu Ende gelaufen.
         */
        if (animation.effect?.getTiming().iterations === Infinity) {
          animation.pause()
          paused.push(animation)
        } else {
          animation.finish()
        }
      } catch {
        // Eine widerspenstige Animation lässt die übrigen trotzdem ruhen.
      }
    }
  }

  const rest = (): void => {
    timer = undefined
    if (resting || document.hidden) return
    resting = true
    sweep()
    document.documentElement.dataset.anitewRest = 'on'
  }

  const wake = (): void => {
    if (resting) {
      resting = false
      delete document.documentElement.dataset.anitewRest
      for (const animation of paused.splice(0)) {
        try {
          // Nur fortsetzen, was noch angehalten dasteht — was inzwischen
          // ausgebaut wurde, hat kein Weiter mehr verdient (und keins nötig).
          if (animation.playState === 'paused') animation.play()
        } catch {
          // siehe oben: best effort je Animation.
        }
      }
    }
    if (timer !== undefined) window.clearTimeout(timer)
    timer = window.setTimeout(rest, delay)
  }

  const listenerOptions: AddEventListenerOptions = { capture: true, passive: true }
  for (const type of ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart', 'scroll']) {
    document.addEventListener(type, wake, listenerOptions)
  }
  document.addEventListener(
    'animationstart',
    () => {
      if (resting) sweep()
    },
    listenerOptions,
  )
  document.addEventListener('visibilitychange', () => {
    // Zurück ins Sichtbare = jemand schaut wieder hin: Welt weckt, Fenster neu.
    if (!document.hidden) wake()
  })

  wake()
}
