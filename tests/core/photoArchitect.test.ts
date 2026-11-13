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
