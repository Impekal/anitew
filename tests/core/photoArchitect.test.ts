import { expect, test } from 'vitest'

import { architectPhotoSystem, parseArchitectAnswer } from '../../src/core/index.ts'

test('Foto-Architekt verlangt sichtbare Deckung statt erfundener Ergänzungen', () => {
  const prompt = architectPhotoSystem()
  expect(prompt).toContain('aus einem Bild')
  expect(prompt).toContain('klar sichtbaren Text oder klar erkennbare Bildinformation')
  expect(prompt).toContain('Erfinde nichts hinzu')
  expect(prompt).toContain('AUSSCHLIESSLICH mit einem JSON-Objekt')
})

test('Foto-Antwort läuft durch dieselbe Fremdmaterial-Wäsche wie Text-KI', () => {
  const parsed = parseArchitectAnswer(
    JSON.stringify({
      nodes: [
        { type: 'person', label: 'Mira' },
        { type: 'unbekannt', label: 'Cello' },
      ],
      edges: [{ from: 'Mira', to: 'Cello' }],
    }),
  )

  expect(parsed?.nodes).toHaveLength(2)
  expect(parsed?.nodes[1]?.type).toBe('custom')
  expect(parsed?.edges).toHaveLength(1)
})

import { configuredPhotoProvider, PhotoArchitectError } from '../../src/platform/web/photoArchitect.ts'
import type { SettingsStore } from '../../src/core/ports.ts'

function photoSettings(rows: Record<string, unknown>): SettingsStore {
  return { read: async <T>(key: string) => rows[key] as T | undefined,
    write: async () => undefined, remove: async () => undefined }
}

test('photo analysis reads the same canonical key order as the coach', async () => {
  const settings = photoSettings({ 'coach.keys': [
    { id: 'first', provider: 'openai', key: 'preferred-photo-key', label: '' },
    { id: 'second', provider: 'gemini', key: 'reserve-key', label: '' },
  ], 'coach.provider': 'gemini', 'coach.key.gemini': 'stale-key' })
  expect(await configuredPhotoProvider(settings)).toEqual({ provider: 'openai', key: 'preferred-photo-key' })
})

test('an explicitly emptied key list cannot resurrect a legacy photo credential', async () => {
  await expect(configuredPhotoProvider(photoSettings({ 'coach.keys': [], 'coach.key.gemini': 'old-key' })))
    .rejects.toEqual(new PhotoArchitectError('no-key'))
})

test('photo analysis keeps legacy keys usable before migration', async () => {
  expect(await configuredPhotoProvider(photoSettings({ 'coach.provider': 'anthropic', 'coach.key': 'legacy-key' })))
    .toEqual({ provider: 'anthropic', key: 'legacy-key' })
})

test('an unsupported primary entry does not silently send a photo to a reserve provider', async () => {
  await expect(configuredPhotoProvider(photoSettings({ 'coach.keys': [
    { id: 'first', provider: 'groq', key: 'text-key', label: '' },
    { id: 'second', provider: 'gemini', key: 'photo-key', label: '' },
  ] }))).rejects.toEqual(new PhotoArchitectError('unsupported-provider'))
})
