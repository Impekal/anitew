/**
 * Der KI-Memory-Architekt auf den Coach-Drähten (D-037 · D-034).
 *
 * Kein zweiter Netzpfad: Der Architekt spricht über denselben `CoachPort`
 * wie der Coach — gleicher Anbieter, gleicher Schlüssel, gleiche
 * Fehlerworte. Der Kern baut die Anweisung und liest die Antwort; hier
 * wird nur verbunden. Und die Antwort ist **Vorschlag**, nie Schreibzugriff:
 * Sie landet in derselben Bestätigungsoberfläche wie die deterministische
 * Extraktion.
 */

import type { CoachPort } from '../../core/coach/prompt.ts'
import {
  type MemoryArchitect,
  architectSystem,
  parseArchitectAnswer,
} from '../../core/memory/memoryArchitect.ts'
import { CoachError } from './coach.ts'

export function createWebArchitect(coach: CoachPort): MemoryArchitect {
  return {
    async suggest(text) {
      const answer = await coach.ask({ system: architectSystem(), question: text })
      const suggestions = parseArchitectAnswer(answer)
      // Kein lesbares JSON ist ein Fehler des Anbieters, kein leeres Ergebnis.
      if (suggestions === undefined) throw new CoachError('failed')
      return suggestions
    },
  }
}
