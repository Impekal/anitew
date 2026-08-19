/**
 * Der Draht des Coaches zur Anthropic-API (Backlog M · D-031).
 *
 * Die einzige Stelle der App, die das Netz für Inhalte anfasst — und sie
 * tut es nur auf Fingertipp, nur mit dem **eigenen Schlüssel** des Menschen
 * und nur zu `api.anthropic.com`. Kein eigener Server, kein Mitlesen (R-3):
 * Der Schlüssel liegt in den Einstellungen dieses Geräts und geht in genau
 * einen Header.
 *
 * Bewusst rohes `fetch` statt des offiziellen SDKs: Das Kaltstart-Budget
 * (P4) zählt jede Abhängigkeit, und für einen einzigen POST wäre das SDK
 * genau die dicke Abhängigkeit, vor der der Budget-Wächter warnt. Der
 * Preis ist, die zwei Header und die Antwortform selbst zu kennen — sie
 * stehen hier und nirgendwo sonst.
 */

import { COACH_MAX_TOKENS, COACH_MODEL } from '../../core/coach/prompt.ts'
import type { CoachPort, CoachRequest } from '../../core/coach/prompt.ts'

/** Wo der Schlüssel in den Einstellungen liegt. */
export const COACH_KEY_SETTING = 'coach.key'

const API_URL = 'https://api.anthropic.com/v1/messages'

/**
 * Was schiefgehen kann, als benennbare Fälle — die Oberfläche macht daraus
 * ehrliche Sätze statt eines rohen Stacktraces.
 */
export type CoachFailure = 'no-key' | 'bad-key' | 'offline' | 'refused' | 'failed'

export class CoachError extends Error {
  constructor(readonly reason: CoachFailure) {
    super(reason)
    this.name = 'CoachError'
  }
}

export function createWebCoach(readKey: () => Promise<string | undefined>): CoachPort {
  return {
    async ask(request: CoachRequest): Promise<string> {
      const key = await readKey()
      if (key === undefined || key.trim() === '') throw new CoachError('no-key')

      let response: Response
      try {
        response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-api-key': key.trim(),
            'anthropic-version': '2023-06-01',
            /*
             * Anthropic verlangt dieses ausdrückliche Einverständnis für
             * Aufrufe aus dem Browser — genau unser Fall: Der Schlüssel
             * gehört dem Menschen selbst, es gibt keinen Server, dem er
             * anvertraut wäre.
             */
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({
            model: COACH_MODEL,
            max_tokens: COACH_MAX_TOKENS,
            system: request.system,
            messages: [{ role: 'user', content: request.question }],
          }),
        })
      } catch {
        throw new CoachError('offline')
      }

      if (response.status === 401 || response.status === 403) throw new CoachError('bad-key')
      if (!response.ok) throw new CoachError('failed')

      const body = (await response.json()) as {
        stop_reason?: string
        content?: readonly { type: string; text?: string }[]
      }
      if (body.stop_reason === 'refusal') throw new CoachError('refused')

      const text = (body.content ?? [])
        .filter((block) => block.type === 'text')
        .map((block) => block.text ?? '')
        .join('')
        .trim()
      if (text === '') throw new CoachError('failed')
      return text
    },
  }
}
