import { describe, expect, it } from 'vitest'

import {
  PROFILE_HISTORY_LIMIT,
  readProfileHistory,
  recordProfileSnapshot,
} from '../../src/core/index.ts'

describe('der Verlauf des Gedächtnisprofils (E4)', () => {
  it('speichert nur eine Momentaufnahme je Tag und ersetzt sie mit der neueren Wahrheit', () => {
    const first = recordProfileSnapshot([], '2026-08-19', {
      words: { chances: 20, lost: 5 },
    })
    const second = recordProfileSnapshot(first, '2026-08-19', {
      words: { chances: 24, lost: 5 },
    })

    expect(second).toHaveLength(1)
    expect(second[0]).toEqual({
      day: '2026-08-19',
      counts: { words: { chances: 24, lost: 5 } },
    })
  })

  it('behält Rohzählungen statt eines eingefrorenen Scores', () => {
    const [snapshot] = recordProfileSnapshot([], '2026-08-19', {
      words: { chances: 20, lost: 4 },
      faces: { chances: 17, lost: 3 },
    })

    expect(snapshot?.counts.words).toEqual({ chances: 20, lost: 4 })
    expect(snapshot?.counts.faces).toEqual({ chances: 17, lost: 3 })
    expect(snapshot).not.toHaveProperty('score')
    expect(snapshot).not.toHaveProperty('rate')
  })

  it('liest nur wohlgeformte Momentaufnahmen und sortiert nach Tag', () => {
    const history = readProfileHistory([
      { day: '2026-08-20', counts: { words: { chances: 20, lost: 2 } } },
      { day: 'kaputt', counts: {} },
      { day: '2026-08-18', counts: { words: { chances: 16, lost: 3 } } },
      { day: '2026-08-19', counts: { words: { chances: 3, lost: 4 } } },
      { day: '2026-08-19', counts: { unknown: { chances: 4, lost: 1 } } },
    ])

    expect(history.map((snapshot) => snapshot.day)).toEqual(['2026-08-18', '2026-08-20'])
  })

  it('begrenzt die Historie, ohne die neuesten Tage zu verlieren', () => {
    let history = [] as ReturnType<typeof recordProfileSnapshot>
    for (let index = 0; index < PROFILE_HISTORY_LIMIT + 3; index += 1) {
      const day = `2026-${String(1 + Math.floor(index / 28)).padStart(2, '0')}-${String(1 + (index % 28)).padStart(2, '0')}` as `${number}-${number}-${number}`
      history = recordProfileSnapshot(history, day, {
        words: { chances: index, lost: Math.floor(index / 4) },
      })
    }

    expect(history).toHaveLength(PROFILE_HISTORY_LIMIT)
    expect(history.at(-1)?.counts.words?.chances).toBe(PROFILE_HISTORY_LIMIT + 2)
  })

  it('kann die Historie ausdrücklich abschalten', () => {
    expect(recordProfileSnapshot([], '2026-08-19', { words: { chances: 20, lost: 4 } }, 0)).toEqual([])
  })
})
