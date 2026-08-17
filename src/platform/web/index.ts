import type { Platform } from '../../core/index.ts'

import { createWebClock } from './clock.ts'
import { createWebSettings } from './settings.ts'

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
  }
}
