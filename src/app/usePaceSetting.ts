import { useCallback, useEffect, useState } from 'react'

import type { Pace, Platform } from '../core/index.ts'
import { persistThenApply } from './persistThenApply.ts'

const SETTING_KEY = 'pace'

/** Nur diese drei — was sonst gespeichert dasteht, wird ignoriert. */
const ERLAUBT: readonly Pace[] = ['much', 'normal', 'little']

/**
 * Zeit zum Einprägen (Nutzerbefund 05.09.).
 *
 * Wörtlich: „Man hat kaum Zeit, sich was auszudenken … da man die Methoden
 * lernen muss. Wenn das so schnell geht, schafft man es nicht, was zu lernen."
 *
 * Gemessen waren es vier Sekunden je Stück — in jedem Modul außer den Szenen
 * und in **jedem Modus**: Die Viertelstunde gab je Wort genau so viel Zeit wie
 * die Notfall-Minute, nur mehr Runden. Es gab keinen Zustand, in dem man sich
 * Zeit nehmen konnte.
 *
 * Eine Einstellung und keine Automatik, und das mit Absicht: Wie schnell
 * jemand sich ein Bild ausdenkt, weiß keine Trefferquote. Die App kann sehen,
 * ob etwas behalten wurde — nicht, ob dafür genug Zeit war (R-1).
 *
 * Voreingestellt `normal`, damit niemand erst etwas einstellen muss, um eine
 * brauchbare Einheit zu bekommen.
 */
export function usePaceSetting(platform: Platform) {
  const [pace, setPace] = useState<Pace>('normal')
  // R3-06: Ein gescheitertes Speichern wird gesagt, nicht verschluckt.
  const [saveFailed, setSaveFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    void platform.settings
      .read<Pace>(SETTING_KEY)
      .then((stored) => {
        if (cancelled || stored === undefined) return
        if (ERLAUBT.includes(stored)) setPace(stored)
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [platform])

  const choose = useCallback(
    (next: Pace) => {
      const previous = pace
      /*
       * Anders als beim Ton wird hier **nichts** vorab angewendet: Das Tempo
       * wirkt erst beim Planen der nächsten Einheit, es gibt also nichts, was
       * sofort hörbar oder sichtbar wäre. Die Anzeige folgt deshalb dem
       * geschriebenen Stand — ein Schalter, der etwas anderes zeigt als das
       * Gespeicherte, ist ein kaputter Schalter (R3-06).
       */
      void persistThenApply(
        () => platform.settings.write(SETTING_KEY, next),
        () => {
          setSaveFailed(false)
          setPace(next)
        },
        () => {
          setPace(previous)
          setSaveFailed(true)
        },
      )
    },
    [platform, pace],
  )

  return { pace, choose, saveFailed }
}
