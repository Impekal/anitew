import { useEffect, useState } from 'react'

import type { Platform } from '../core/index.ts'

/**
 * Bleibt auf diesem Gerät überhaupt etwas gespeichert? (Backlog P7)
 *
 * Der Fall, den das fängt, ist kein Randfall: Im **privaten Safari-Fenster**
 * und bei „alle Cookies blockieren“ gibt es keine Datenbank. Die App läuft
 * dann weiter — aber alles, was jemand übt, ist beim Schließen weg. Genau die
 * Art stiller Datenverlust, gegen die diese App gebaut ist (N2).
 *
 * Deshalb wird es **gesagt**, statt es geschehen zu lassen. Eine Runde
 * schreiben und zurücklesen ist der einzige ehrliche Test: Ob ein Aufruf
 * geworfen hat, sagt weniger als ob der Wert danach wirklich dasteht.
 *
 * `undefined` heißt „wird noch geprüft“ — daraus folgt **keine** Warnung, denn
 * eine Warnung, die eine Zehntelsekunde lang aufblitzt und dann verschwindet,
 * ist schlimmer als keine.
 */
export function useStoragePersists(platform: Platform): boolean | undefined {
  const [persists, setPersists] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const probe = `probe:${platform.clock.now()}`
      try {
        await platform.settings.write('storage.probe', probe)
        const read = await platform.settings.read<string>('storage.probe')
        if (!cancelled) setPersists(read === probe)
      } catch {
        // Geworfen heißt: kein Speicher. Das ist eine Antwort, kein Fehler.
        if (!cancelled) setPersists(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [platform])

  return persists
}
