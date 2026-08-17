import type { SettingsStore } from '../../core/index.ts'
import { db } from '../../data/db.ts'

/**
 * Einstellungen in IndexedDB — nicht in `localStorage`.
 *
 * Der Grund ist nicht Geschmack: `localStorage` ist synchron und blockiert den
 * Hauptthread, und Safari räumt es bei längerer Nichtnutzung ab. Eine App, die
 * jemand drei Wochen nicht öffnet und die dann seine Sprache und seinen
 * Fortschritt vergessen hat, hat ihren einzigen Job verfehlt.
 */
export function createWebSettings(): SettingsStore {
  return {
    async read<T>(key: string): Promise<T | undefined> {
      const row = await db.settings.get(key)
      return row?.value as T | undefined
    },
    async write<T>(key: string, value: T): Promise<void> {
      await db.settings.put({ key, value })
    },
    async remove(key: string): Promise<void> {
      await db.settings.delete(key)
    },
  }
}
