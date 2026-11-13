import type { Platform } from '../../core/index.ts'

import { createWebClock } from './clock.ts'
import { createWebReminders } from './reminders.ts'
import { createWebSettings } from './settings.ts'
import { sharedWebSound } from './sound.ts'

/**
 * Die Web-Umsetzung der Plattformschnittstellen aus `core/ports.ts`.
 *
 * Wenn ANITEW später als Android-TWA oder als native iOS-App läuft (D-009,
 * Backlog Q), tritt neben diesen Ordner ein zweiter. Der Kern bleibt
 * unverändert — das ist der ganze Zweck der Übung (D-010).
 */
export function createWebPlatform(): Platform {
  const settings = createWebSettings()
  // Provider request formats and credentials are only needed after a question.
  // Keep one instance so per-key cooldowns survive consecutive requests.
  let coach: Promise<Platform['coach']> | undefined
  const loadCoach = () => coach ??= Promise.all([
    import('./coach.ts'), import('./coachKeys.ts'),
  ]).then(([{ createWebCoach }, { loadCoachKeys }]) =>
    createWebCoach(() => loadCoachKeys(settings)),
  ).catch(error => { coach = undefined; throw error })
  return {
    clock: createWebClock(),
    settings,
    // Der Coach liest Anbieter und Schlüssel bei jeder Frage frisch — wer
    // wechselt oder entfernt, hat ab der nächsten Frage wirklich gewechselt.
    coach: { async ask(request) { return (await loadCoach()).ask(request) } },
    // Ton ist voreingestellt an — die gespeicherte Wahl wird gleich beim Start
    // nachgereicht (siehe useSoundSetting). Anders herum wäre es falsch: Wer
    // Ton eingeschaltet hat, soll ihn nicht erst nach einer Zehntelsekunde
    // bekommen und den ersten Anschlag verpassen.
    sound: sharedWebSound(),
    reminders: createWebReminders(),
  }
}
