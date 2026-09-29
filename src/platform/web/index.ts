import type { Platform } from '../../core/index.ts'

import { createWebClock } from './clock.ts'
import { createWebCoach } from './coach.ts'
import { loadCoachKeys } from './coachKeys.ts'
import { createWebReminders } from './reminders.ts'
import { createWebSettings } from './settings.ts'
import { createWebSound } from './sound.ts'

/**
 * Die Web-Umsetzung der Plattformschnittstellen aus `core/ports.ts`.
 *
 * Wenn ANITEW später als Android-TWA oder als native iOS-App läuft (D-009,
 * Backlog Q), tritt neben diesen Ordner ein zweiter. Der Kern bleibt
 * unverändert — das ist der ganze Zweck der Übung (D-010).
 */
export function createWebPlatform(): Platform {
  const settings = createWebSettings()
  return {
    clock: createWebClock(),
    settings,
    // Der Coach liest Anbieter und Schlüssel bei jeder Frage frisch — wer
    // wechselt oder entfernt, hat ab der nächsten Frage wirklich gewechselt.
    coach: createWebCoach(() => loadCoachKeys(settings)),
    // Ton ist voreingestellt an — die gespeicherte Wahl wird gleich beim Start
    // nachgereicht (siehe useSoundSetting). Anders herum wäre es falsch: Wer
    // Ton eingeschaltet hat, soll ihn nicht erst nach einer Zehntelsekunde
    // bekommen und den ersten Anschlag verpassen.
    sound: createWebSound(true),
    reminders: createWebReminders(),
  }
}
