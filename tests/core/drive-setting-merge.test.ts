import { describe, expect, it } from 'vitest'

import { mergeDriveSettingValue } from '../../src/core/sync/settings.ts'

describe('Drive-Setting-Konflikte', () => {
  it('dreht eine vorhandene lokale Präferenz nicht auf den älteren Drive-Wert zurück', () => {
    expect(mergeDriveSettingValue('language', 'en', 'de')).toBe('en')
    expect(mergeDriveSettingValue('sound', false, true)).toBe(false)
    expect(mergeDriveSettingValue('reminders.daily', '08:30', '19:30')).toBe('08:30')
  })

  it('vereinigt bereits gelernte Major-Ziffern statt Fortschritt zu verlieren', () => {
    expect(mergeDriveSettingValue('technique.major.taught', [0, 1, 4], [0, 2, 3])).toEqual([
      0, 1, 2, 3, 4,
    ])
  })

  it('lässt monotone Technik-Marker nur in Richtung gelernt gehen', () => {
    expect(mergeDriveSettingValue('technique.palace.taught', true, false)).toBe(true)
    expect(mergeDriveSettingValue('technique.story.taught', false, true)).toBe(true)
  })

  it('vereinigt Profilverlauf und nimmt je Dimension den reicheren Messstand', () => {
    const local = [
      { day: '2026-08-20', counts: { names: { chances: 8, lost: 2 } } },
      { day: '2026-08-22', counts: { words: { chances: 3, lost: 1 } } },
    ]
    const remote = [
      { day: '2026-08-19', counts: { names: { chances: 2, lost: 1 } } },
      {
        day: '2026-08-20',
        counts: {
          names: { chances: 4, lost: 0 },
          words: { chances: 5, lost: 2 },
        },
      },
    ]

    expect(mergeDriveSettingValue('profile.history.de', local, remote)).toEqual([
      { day: '2026-08-19', counts: { names: { chances: 2, lost: 1 } } },
      {
        day: '2026-08-20',
        counts: {
          names: { chances: 8, lost: 2 },
          words: { chances: 5, lost: 2 },
        },
      },
      { day: '2026-08-22', counts: { words: { chances: 3, lost: 1 } } },
    ])
  })

  it('behält den frühesten Erststart und den höchsten Öffnungszähler', () => {
    expect(mergeDriveSettingValue('firstSeenAt', 200, 100)).toBe(100)
    expect(mergeDriveSettingValue('openCount', 8, 12)).toBe(12)
  })

  it('überlässt den Memory-Graph weiterhin seinem spezialisierten Mengen-Merge', () => {
    const remote = { nodes: [{ id: 'remote' }], edges: [] }
    expect(mergeDriveSettingValue('memory.graph', { nodes: [], edges: [] }, remote)).toBe(remote)
  })
})
