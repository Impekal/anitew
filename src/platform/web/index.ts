import type { Platform } from '../../core/index.ts'

import { createWebClock } from './clock.ts'
import { COACH_KEY_SETTING, createWebCoach } from './coach.ts'
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
    // Der Coach liest den Schlüssel bei jeder Frage frisch — wer ihn
    // entfernt, hat ihn ab der nächsten Frage wirklich entfernt.
    coach: createWebCoach(() => settings.read<string>(COACH_KEY_SETTING)),
    // Ton ist voreingestellt an — die gespeicherte Wahl wird gleich beim Start
    // nachgereicht (siehe useSoundSetting). Anders herum wäre es falsch: Wer
    // Ton eingeschaltet hat, soll ihn nicht erst nach einer Zehntelsekunde
    // bekommen und den ersten Anschlag verpassen.
    sound: createWebSound(true),
    reminders: createWebReminders(),
  }
}
