import type { Platform } from '../../core/index.ts'

import { createWebClock } from './clock.ts'
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
  return {
    clock: createWebClock(),
    settings: createWebSettings(),
    // Ton ist voreingestellt an — die gespeicherte Wahl wird gleich beim Start
    // nachgereicht (siehe useSoundSetting). Anders herum wäre es falsch: Wer
    // Ton eingeschaltet hat, soll ihn nicht erst nach einer Zehntelsekunde
    // bekommen und den ersten Anschlag verpassen.
    sound: createWebSound(true),
  }
}
