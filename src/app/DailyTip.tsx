import { useEffect, useState } from 'react'

import { tipOfDay } from '../core/brainCare.ts'
import type { DayKey, Platform } from '../core/index.ts'
import { brainCareCopyFor } from '../i18n/brainCareCopy.ts'

import '../anitew-daily-tip.css'

const SHOWN_KEY = 'brainTip.lastShown'
const ENABLED_KEY = 'brainTip.enabled'

/**
 * Der Tipp des Tages (Gerätewunsch 31.08.: „bei jeder Öffnung maximal einmal
 * am Tag ein kurzer Tipp im Pop-up, aber man kann das deaktivieren").
 *
 * ── Wie er sich benimmt (D-015) ───────────────────────────────────────────
 *
 * Er **fordert nichts**. Kein Countdown, kein „jetzt trainieren!", keine
 * Zahl, die kaputtgeht, wenn man ihn wegtippt. Er blockiert auch nichts: Der
 * Startknopf bleibt erreichbar, das Blatt sitzt unten und geht mit einem Tipp
 * weg. Wer ihn nie wieder sehen will, findet den Schalter **in ihm selbst** —
 * nicht drei Menüseiten weiter.
 *
 * Einmal am Tag heißt einmal am Tag: Der gezeigte Tag wird gespeichert, und
 * derselbe Tag zeigt denselben Tipp (`tipOfDay`). Wer die App fünfmal öffnet,
 * sieht ihn einmal.
 *
 * ── Warum er wartet ───────────────────────────────────────────────────────
 *
 * Er erscheint erst, wenn der Startbildschirm steht — nicht im ersten Bild.
 * Ein Hinweis, der einem beim Ankommen ins Gesicht springt, ist ein
 * Türsteher, kein Tipp.
 */
export function DailyTip({ platform, today }: { platform: Platform; today: DayKey }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const [enabled, lastShown] = await Promise.all([
          platform.settings.read<boolean>(ENABLED_KEY),
          platform.settings.read<string>(SHOWN_KEY),
        ])
        if (cancelled) return
        if (enabled === false || lastShown === today) return
        // Erst merken, dann zeigen: Ein Absturz zwischen beidem soll den Tipp
        // nicht zweimal am Tag bringen.
        await platform.settings.write(SHOWN_KEY, today)
        if (!cancelled) setVisible(true)
      } catch {
        // Ohne Speicher kein Tipp. Ein Hinweis ist kein Grund für einen Fehler.
      }
    })()
    return () => {
      cancelled = true
    }
  }, [platform, today])

  if (!visible) return null

  const copy = brainCareCopyFor(document.documentElement.lang)
  const tip = copy.tips[tipOfDay(today)]
  if (tip === undefined) return null

  return (
    <aside className="daily-tip" aria-label={copy.daily}>
      <p className="daily-tip-label">{copy.daily}</p>
      <p className="daily-tip-text">{tip.daily}</p>
      <div className="daily-tip-actions">
        <button type="button" className="quiet" onClick={() => setVisible(false)}>
          {copy.dismiss}
        </button>
        <button
          type="button"
          className="quiet daily-tip-off"
          onClick={() => {
            setVisible(false)
            void platform.settings.write(ENABLED_KEY, false).catch(() => undefined)
          }}
        >
          {copy.dailyOff}
        </button>
      </div>
    </aside>
  )
}
