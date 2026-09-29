import type { SettingsStore } from '../../core/ports.ts'
import {
  COACH_PROVIDERS, COACH_PROVIDER_SETTING, DEFAULT_COACH_PROVIDER,
  LEGACY_COACH_KEY_SETTING, coachKeySettingFor, type CoachProvider,
} from './coach.ts'

export const COACH_KEYS_SETTING = 'coach.keys'
export const MAX_COACH_KEYS = 20
export interface CoachKey {
  id: string
  provider: CoachProvider
  key: string
  label: string
}

/** Configuration is untrusted, including old settings. No key is ever a URL. */
export function cleanCoachKeys(value: unknown): CoachKey[] {
  if (!Array.isArray(value)) return []
  const result: CoachKey[] = []
  for (const entry of value) {
    if (entry === null || typeof entry !== 'object') continue
    const { id, provider, key, label } = entry as Partial<CoachKey>
    if (typeof id !== 'string' || !id || typeof key !== 'string' || !key.trim() ||
        !COACH_PROVIDERS.includes(provider as CoachProvider)) continue
    if (result.some(saved => saved.id === id.slice(0, 100) || (saved.provider === provider && saved.key === key.trim()))) continue
    result.push({ id: id.slice(0, 100), provider: provider as CoachProvider, key: key.trim(),
      label: typeof label === 'string' ? label.replace(/[\x00-\x1f\x7f]/g, '').trim().slice(0, 60) : '' })
    if (result.length === MAX_COACH_KEYS) break
  }
  return result
}

export async function loadCoachKeys(settings: SettingsStore): Promise<CoachKey[]> {
  const saved = await settings.read<unknown>(COACH_KEYS_SETTING)
  // A saved empty list means all keys were removed. Never resurrect legacy keys.
  if (saved !== undefined) return cleanCoachKeys(saved)
  const selected = await settings.read<unknown>(COACH_PROVIDER_SETTING)
  const preferred = COACH_PROVIDERS.includes(selected as CoachProvider) ? selected as CoachProvider : DEFAULT_COACH_PROVIDER
  const order = [preferred, ...COACH_PROVIDERS.filter(provider => provider !== preferred)]
  const entries = await Promise.all(order.map(async provider => ({
    id: `legacy-${provider}`, provider, label: '',
    key: await settings.read<unknown>(coachKeySettingFor(provider)) ??
      (provider === 'anthropic' ? await settings.read<unknown>(LEGACY_COACH_KEY_SETTING) : undefined),
  })))
  return cleanCoachKeys(entries)
}

export async function saveCoachKeys(settings: SettingsStore, keys: readonly CoachKey[]): Promise<void> {
  await settings.write(COACH_KEYS_SETTING, cleanCoachKeys(keys))
  // Canonical write comes first so a failed cleanup cannot lose the saved list.
  await Promise.all([
    ...COACH_PROVIDERS.map(provider => settings.remove(coachKeySettingFor(provider))),
    settings.remove(LEGACY_COACH_KEY_SETTING),
  ]).catch(() => undefined)
}
