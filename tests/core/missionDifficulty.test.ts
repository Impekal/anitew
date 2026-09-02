import { describe, expect, it } from 'vitest'

import { MODES } from '../../src/core/modes.ts'
import { planSession as adaptivePlanSession } from '../../src/core/session/adaptivePlan.ts'
import { planSession as basePlanSession, type Pools } from '../../src/core/session/plan.ts'

const missionPeople = ['Elena', 'Mara', 'Jonas', 'Luca', 'Nora', 'Amir', 'Sofia', 'Theo']

const pools: Pools = {
  words: [],
  faces: [],
  numbers: [],
  missions: missionPeople,
  palace: [],
  reverse: [],
  twins: [],
  gaze: [],
  facts: [],
  memory: [], people: [],
}

const input = {
  mode: 'daily' as const,
  day: '2026-08-20' as const,
  language: 'de',
  seed: 'h6-missions',
  pools,
  modules: ['missions'] as const,
}

const missionEncodes = (delta: -1 | 0 | 1) =>
  adaptivePlanSession({ ...input, difficulty: { missions: delta } }).blocks.filter(
    (block) => block.kind === 'encode' && block.moduleId === 'missions',
  )

describe('H6 — adaptive Missionsschwierigkeit', () => {
  it('lässt die vollständigen fünf Fakten und ihre Auswahl unverändert', () => {
    const base = basePlanSession(input)
    for (const delta of [-1, 0, 1] as const) {
      const adapted = adaptivePlanSession({ ...input, difficulty: { missions: delta } })
      expect(adapted.blocks.map((block) => block.items)).toEqual(
        base.blocks.map((block) => block.items),
      )
      for (const block of missionEncodes(delta)) expect(block.items).toHaveLength(5)
    }
  })

  it('gibt bei Überlastung mehr und bei sehr sicherer Leistung weniger Einprägezeit', () => {
    const easier = missionEncodes(-1)
    const normal = missionEncodes(0)
    const harder = missionEncodes(1)

    expect(easier).toHaveLength(normal.length)
    expect(harder).toHaveLength(normal.length)
    for (let index = 0; index < normal.length; index++) {
      expect(easier[index]?.seconds).toBe((normal[index]?.seconds ?? 0) + 5)
      expect(harder[index]?.seconds).toBe((normal[index]?.seconds ?? 0) - 5)
    }
  })

  it('verschiebt nur Zeit innerhalb der Runde — das Sessionbudget bleibt exakt', () => {
    for (const delta of [-1, 0, 1] as const) {
      const plan = adaptivePlanSession({ ...input, difficulty: { missions: delta } })
      expect(plan.blocks.reduce((sum, block) => sum + block.seconds, 0)).toBe(MODES.daily.seconds)
      for (const block of plan.blocks.filter(
        (entry) => entry.kind === 'recall' && entry.moduleId === 'missions',
      )) {
        expect(block.seconds).toBeGreaterThan(0)
      }
    }
  })
})
