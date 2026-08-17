import { useEffect, useState } from 'react'

/**
 * Lässt eine Zahl hochzählen, statt sie hinzustellen (D-011/G-7).
 *
 * Der Wert am Ende ist derselbe — es ist eine Bewegung, keine Beschönigung
 * (G-6). Aber der Unterschied zwischen „da steht 12“ und „es zählt bis 12“ ist
 * genau der Unterschied zwischen einem Bericht und einem Ergebnis.
 *
 * Wer „weniger Bewegung“ eingestellt hat, bekommt die Zahl sofort. Das ist
 * hier nicht nur höflich, sondern nötig: Eine springende Ziffer ist für
 * empfindliche Augen unangenehmer als fast alles andere.
 */
export function useCountUp(target: number, durationMs = 900): number {
  const [value, setValue] = useState(() => (prefersReducedMotion() ? target : 0))

  useEffect(() => {
    if (prefersReducedMotion() || target <= 0) {
      setValue(target)
      return
    }
    let frame = 0
    const started = performance.now()
    const tick = () => {
      const share = Math.min(1, (performance.now() - started) / durationMs)
      // Zum Ende hin langsamer — die letzte Zahl bekommt Gewicht.
      const eased = 1 - (1 - share) ** 3
      setValue(Math.round(target * eased))
      if (share < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [durationMs, target])

  return value
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
