import { useCallback, useEffect, useState } from 'react'

import type { Platform } from '../core/index.ts'
import {
  ALL_SOUND_ON,
  type SoundCategory,
  type SoundCategorySetting,
} from '../core/sound/categories.ts'
import { persistThenApply } from './persistThenApply.ts'

const SETTING_KEY = 'sound'
/*
 * Eigener Schluessel, nicht im alten mit drin: Wer die App schon benutzt,
 * hat unter 'sound' ein `boolean` stehen. Ein Feld, das mal ein Wahrheitswert
 * und mal ein Objekt ist, ist eine Falle fuer jede spaetere Lesung — und die
 * bestehende Wahl soll den Hauptschalter unveraendert weiter steuern.
 */
const CATEGORY_KEY = 'sound.categories'

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
  const [categories, setCategories] = useState<SoundCategorySetting>(ALL_SOUND_ON)
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

    /*
     * Die Bereiche werden **zusammengefuehrt**, nicht ersetzt: Ein
     * gespeicherter Stand von frueher kennt einen spaeter hinzugekommenen
     * Bereich nicht, und der soll dann an sein (Voreinstellung), nicht
     * fehlen.
     */
    void platform.settings
      .read<Partial<SoundCategorySetting>>(CATEGORY_KEY)
      .then((stored) => {
        if (cancelled || stored === undefined) return
        const merged = { ...ALL_SOUND_ON, ...stored }
        setCategories(merged)
        platform.sound.setCategories(merged)
      })
      .catch(() => undefined)

    return () => {
      cancelled = true
    }
  }, [platform])

  /**
   * Einen einzelnen Bereich umschalten (Geraetewunsch 31.08.).
   *
   * Wie beim Hauptschalter: Der Klang folgt sofort, die Anzeige erst mit dem
   * geschriebenen Stand (R3-06). Beim Einschalten kommt eine kurze Probe des
   * Bereichs — man soll hoeren, was man gerade eingeschaltet hat.
   */
  const toggleCategory = useCallback(
    (category: SoundCategory) => {
      const previous = platform.sound.categories()
      const next = { ...previous, [category]: !previous[category] }

      platform.sound.setCategories(next)
      if (next[category] && enabled) {
        if (category === 'arrival') platform.sound.play('arrival')
        else if (category === 'feedback') platform.sound.play('word', 2)
        // `focus` probiert sich nicht selbst an: Ein Dauerklang, der auf einer
        // Einstellungsseite anfaengt und dort bliebe, waere genau die
        // Dauerlast, die er nicht sein soll.
      }
      if (category === 'focus' && !next.focus) platform.sound.stopAmbient()

      void persistThenApply(
        () => platform.settings.write(CATEGORY_KEY, next),
        () => {
          setSaveFailed(false)
          setCategories(next)
        },
        () => {
          platform.sound.setCategories(previous)
          setCategories(previous)
          setSaveFailed(true)
        },
      )
    },
    [platform, enabled],
  )

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

  return { enabled, toggle, categories, toggleCategory, saveFailed }
}
