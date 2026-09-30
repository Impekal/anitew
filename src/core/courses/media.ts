import type { Language } from '../language.ts'
export const MEDIA_SETTINGS_KEY = 'courses.media.v1'
export const MEDIA_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const
export type SpokenLanguage = 'de' | 'en' | 'fr'
export interface MediaPreferences { audio: SpokenLanguage | 'auto'; speed: number }
export function mediaPreferences(value: unknown): MediaPreferences {
  const v = value && typeof value === 'object' ? value as Record<string,unknown> : {}
  return {audio:v.audio === 'de' || v.audio === 'en' || v.audio === 'fr' ? v.audio : 'auto', speed:MEDIA_SPEEDS.find(speed=>speed===v.speed) ?? 1}
}
export function spokenLanguage(app: Language, audio: MediaPreferences['audio']): SpokenLanguage {
  return audio !== 'auto' ? audio : app === 'de' || app === 'fr' ? app : 'en'
}
export function cueAt(cues: readonly {start:number;end:number}[], time: number): number {
  return cues.findIndex(cue=>time>=cue.start && time<cue.end)
}
