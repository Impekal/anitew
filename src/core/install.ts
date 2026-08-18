/**
 * Der Weg auf den Startbildschirm (Backlog Q1, Q5).
 *
 * Warum das überhaupt eine Entscheidung im Kern ist und kein Hinweis in der
 * Oberfläche: **Auf iOS entscheidet sich hier, ob jemand seine
 * Trainingsgeschichte behält.**
 *
 * Safari räumt den Speicher einer Webseite auf, die sieben Tage lang nicht
 * benutzt wurde. Für eine App, die aus Terminen über Wochen besteht (D-004),
 * ist das kein Detail, sondern der Totalverlust — und genau der Fall, der
 * dieses Projekt einmal getroffen hat und weshalb es die Sicherung gibt (N2).
 * Vom Startbildschirm aus gestartet gilt diese Räumung nicht.
 *
 * Der Hinweis ist deshalb **keine Werbung für eine Installation**, sondern
 * eine Auskunft über eine Gefahr. Er steht dort, wo sie besteht, und
 * verschwindet, sobald sie vorbei ist.
 */

export type InstallAdvice =
  /** Läuft schon vom Startbildschirm — nichts zu sagen. */
  | { kind: 'none' }
  /**
   * iOS im Browser: Der Speicher kann nach sieben Tagen ohne Benutzung
   * weggeräumt werden. Der Weg dorthin ist von Hand und heißt überall anders,
   * deshalb wird er benannt.
   */
  | { kind: 'ios' }
  /**
   * Anderswo im Browser: Es ist ein Angebot und keine Warnung — der Speicher
   * bleibt auch im Tab. Deshalb kein eigener Hinweis; die Einladung des
   * Browsers reicht.
   */
  | { kind: 'browser' }

/**
 * Was zur Installation zu sagen ist.
 *
 * Nimmt die Zeichenkette der Browserkennung entgegen statt sie selbst zu
 * lesen — damit lässt sich die Entscheidung ohne Browser prüfen (D-010), und
 * das ist bei einer Regel, die auf Gerätemerkmalen beruht, besonders nötig.
 */
export function installAdvice(userAgent: string, standalone: boolean): InstallAdvice {
  if (standalone) return { kind: 'none' }
  return isApplePortable(userAgent) ? { kind: 'ios' } : { kind: 'browser' }
}

/**
 * iPhone oder iPad?
 *
 * Das iPad meldet sich seit iPadOS 13 als „Macintosh“ und ist nur noch daran
 * zu erkennen, dass es Berührungen kennt — deshalb der zweite Zweig. Ein
 * echter Mac fällt heraus, und das ist richtig: Safari auf dem Mac räumt den
 * Speicher einer benutzten Seite nicht nach sieben Tagen weg.
 */
function isApplePortable(userAgent: string): boolean {
  if (/iPhone|iPad|iPod/i.test(userAgent)) return true
  return /Macintosh/i.test(userAgent) && /Mobile|Touch/i.test(userAgent)
}
