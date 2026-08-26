import { useCallback, useEffect, useState } from 'react'

import type { Platform } from '../core/index.ts'

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
    const next = !platform.sound.isEnabled()

    // Der Klang schaltet sofort um — daran hängt die Rückmeldung, und ein
    // Ton, der erst nach einem Datenbankschreibvorgang kommt, fühlt sich
    // träge an. Beim Einschalten hört man gleich, was man eingeschaltet hat;
    // der Tipp ist zugleich die Geste, die iOS für die Tonausgabe verlangt.
    platform.sound.setEnabled(next)
    document.documentElement.dataset.anitewSound = next ? 'on' : 'off'
    if (next) platform.sound.play('word', 2)

    /*
     * Die **Anzeige** wechselt dagegen erst, wenn die Wahl geschrieben ist.
     *
     * Vorher lief das Schreiben nebenher, und wer sofort danach neu lud, bekam
     * den alten Zustand zurück — derselbe Fehler wie beim Verwerfen einer
     * Einheit, und wieder von einem E2E-Test gefunden, der nur im vollen Lauf
     * fehlschlug. Ein Schalter, der etwas anderes zeigt als das, was
     * gespeichert ist, ist ein kaputter Schalter. Der Schreibvorgang dauert
     * wenige Millisekunden; scheitert er, gilt die Wahl immerhin für diese
     * Sitzung.
     */
    void platform.settings
      .write(SETTING_KEY, next)
      .catch(() => undefined)
      .finally(() => setEnabled(next))
  }, [platform])

  return { enabled, toggle }
}
