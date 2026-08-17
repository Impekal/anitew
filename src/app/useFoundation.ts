import { useEffect, useState } from 'react'

import { type DayKey, type Platform, dayKeyOf } from '../core/index.ts'

export interface FoundationState {
  storage: 'checking' | 'ok' | 'failed'
  today: DayKey | undefined
  firstSeenAt: number | undefined
  openCount: number | undefined
  installed: boolean
  offline: 'ready' | 'pending' | 'unavailable'
}

/**
 * Der Nachweis, dass das Fundament trägt.
 *
 * M0 hat kein Training, also gibt es nichts anzuzeigen — außer dem, was
 * tatsächlich schon funktioniert. Genau das tut diese Anzeige: Sie schreibt bei
 * jedem Start in die Datenbank und liest zurück, was dort steht. Wenn „bisher
 * 4-mal geöffnet, zum ersten Mal am …“ nach einem Neustart des Telefons noch
 * stimmt, dann sind Datenbank, Migrationen, Zeitrechnung und der
 * Plattform-Adapter in Ordnung — und zwar bewiesen statt behauptet.
 *
 * Die Anzeige verschwindet mit M1. Sie ist ausdrücklich kein Fortschrittswert:
 * Was hier steht, ist gemessen (Regel R-1).
 */
export function useFoundation(platform: Platform): FoundationState {
  const [state, setState] = useState<FoundationState>({
    storage: 'checking',
    today: undefined,
    firstSeenAt: undefined,
    openCount: undefined,
    installed: isStandalone(),
    offline: serviceWorkerState(),
  })

  useEffect(() => {
    let cancelled = false

    void (async () => {
      const now = platform.clock.now()
      const today = dayKeyOf(now, { offsetMinutes: platform.clock.offsetMinutes(now) })

      try {
        const firstSeenAt = (await platform.settings.read<number>('firstSeenAt')) ?? now
        const openCount = ((await platform.settings.read<number>('openCount')) ?? 0) + 1
        await platform.settings.write('firstSeenAt', firstSeenAt)
        await platform.settings.write('openCount', openCount)

        // Zurücklesen statt das Geschriebene anzuzeigen — sonst prüft die
        // Anzeige nur, dass ein Aufruf nicht geworfen hat.
        const storedCount = await platform.settings.read<number>('openCount')
        if (cancelled) return
        setState((previous) => ({
          ...previous,
          storage: storedCount === openCount ? 'ok' : 'failed',
          today,
          firstSeenAt,
          openCount: storedCount,
        }))
      } catch {
        if (cancelled) return
        setState((previous) => ({ ...previous, storage: 'failed', today }))
      }
    })()

    return () => {
      cancelled = true
    }
  }, [platform])

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    let cancelled = false
    void navigator.serviceWorker.ready.then(() => {
      if (!cancelled) setState((previous) => ({ ...previous, offline: 'ready' }))
    })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}

/** Läuft die App vom Startbildschirm aus, oder in einem Browsertab? */
function isStandalone(): boolean {
  if (window.matchMedia('(display-mode: standalone)').matches) return true
  // Safari auf iOS kennt `display-mode` nicht und setzt stattdessen dieses
  // eigene Merkmal — ohne den Sonderfall meldet jedes iPhone „im Browser“.
  return (navigator as { standalone?: boolean }).standalone === true
}

function serviceWorkerState(): FoundationState['offline'] {
  if (!('serviceWorker' in navigator)) return 'unavailable'
  return navigator.serviceWorker.controller ? 'ready' : 'pending'
}
