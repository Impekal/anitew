import { useCallback, useEffect, useState } from 'react'

import type { Platform } from '../core/index.ts'
import { persistThenApply } from './persistThenApply.ts'

const SETTING_KEY = 'sound'

/**
 * Ton an oder aus (Backlog O6, D-011/G-9).
 *
 * Voreingestellt **an** — sonst hörte niemand je, dass es Ton gibt, und eine
 * Einstellung, die man erst finden muss, um etwas zu bekommen, ist keine.
 * Abschalten geht mit einem Tipp auf dem ersten Bildschirm, und die Wahl
 * bleibt.
 */
export function useSoundSetting(platform: Platform) {
  const [enabled, setEnabled] = useState(true)
  // R3-06: Ein gescheitertes Speichern wird gesagt, nicht verschluckt.
  const [saveFailed, setSaveFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    void platform.settings
      .read<boolean>(SETTING_KEY)
      .then((stored) => {
        if (cancelled || stored === undefined) return
        setEnabled(stored)
        platform.sound.setEnabled(stored)
        document.documentElement.dataset.anitewSound = stored ? 'on' : 'off'
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [platform])

  const toggle = useCallback(() => {
    const previous = platform.sound.isEnabled()
    const next = !previous
    const apply = (on: boolean) => {
      platform.sound.setEnabled(on)
      document.documentElement.dataset.anitewSound = on ? 'on' : 'off'
    }

    // Der Klang schaltet sofort um — daran hängt die Rückmeldung, und ein
    // Ton, der erst nach einem Datenbankschreibvorgang kommt, fühlt sich
    // träge an. Beim Einschalten hört man gleich, was man eingeschaltet hat;
    // der Tipp ist zugleich die Geste, die iOS für die Tonausgabe verlangt.
    apply(next)
    if (next) platform.sound.play('word', 2)

    /*
     * Die **Anzeige** wechselt erst, wenn die Wahl geschrieben ist — und
     * anders als vorher wirklich nur dann (R3-06): Das alte `finally` setzte
     * sie auch im Fehlerfall, entgegen diesem Kommentar. Scheitert das
     * Speichern, geht auch die Klangmaschine zurück auf den vorherigen
     * Stand; ein Schalter, der etwas anderes zeigt oder tut als das
     * Gespeicherte, ist ein kaputter Schalter.
     */
    void persistThenApply(
      () => platform.settings.write(SETTING_KEY, next),
      () => {
        setSaveFailed(false)
        setEnabled(next)
      },
      () => {
        apply(previous)
        setEnabled(previous)
        setSaveFailed(true)
      },
    )
  }, [platform])

  return { enabled, toggle, saveFailed }
}
