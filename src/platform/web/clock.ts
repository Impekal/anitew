import type { Clock, Instant } from '../../core/index.ts'

/**
 * Die Uhr des Browsers.
 *
 * Zwei Dinge, die hier leicht falsch gemacht werden:
 *
 * `getTimezoneOffset()` liefert die Minuten, die man von der Ortszeit
 * abziehen muss, um UTC zu erhalten — für Berlin im Sommer also −120. Der Kern
 * rechnet umgekehrt (D-007/time.ts), deshalb das Minuszeichen.
 *
 * `performance.now()` statt `Date.now()` für Dauern: Die Wanduhr kann während
 * einer laufenden Session springen, durch die Zeitumstellung, durch einen
 * Abgleich mit dem Netz oder weil jemand die Streak überlisten will
 * (Backlog P5). Ein Block, der 60 Sekunden dauern soll, darf davon nichts
 * merken.
 */
export function createWebClock(): Clock {
  return {
    now(): Instant {
      return Date.now()
    },
    offsetMinutes(at: Instant): number {
      return -new Date(at).getTimezoneOffset()
    },
    elapsed(): number {
      return performance.now()
    },
  }
}
