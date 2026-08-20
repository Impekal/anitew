import { describe, expect, it } from 'vitest'

import { composeDailyMission } from '../../src/core/index.ts'

describe('Phase 3 adaptive daily mission', () => {
  it('ordnet mehrere FSRS-fällige Module vor neuem Stoff statt nur einen Sieger zu merken', () => {
    const decision = composeDailyMission({
      seconds: 300,
      dueByModule: { faces: 2, words: 5 },
      personalScenes: 1,
      untrainedPersonalItems: 4,
      dimensions: {},
      interferenceErrors: 0,
    })

    expect(decision).toMatchObject({ focus: 'words', reason: 'due' })
    expect(decision.modules.slice(0, 3)).toEqual(['words', 'faces', 'memory'])
    expect(decision.signals).toEqual(
      expect.arrayContaining([
        { moduleId: 'words', reason: 'due', amount: 5 },
        { moduleId: 'faces', reason: 'due', amount: 2 },
        { moduleId: 'memory', reason: 'personal', amount: 4 },
      ]),
    )
  })

  it('summiert Gründe nicht zu einem erfundenen Adaptiv-Score', () => {
    const decision = composeDailyMission({
      seconds: 300,
      dueByModule: { memory: 1, faces: 2 },
      personalScenes: 2,
      untrainedPersonalItems: 100,
      dimensions: {},
      interferenceErrors: 0,
    })

    // Hundert neue persönliche Items schlagen zwei echte FSRS-Fälligkeiten
    // nicht durch Addition. Timing bleibt die stärkste vorhandene Wahrheit.
    expect(decision.focus).toBe('faces')
    expect(decision.reason).toBe('due')
    expect(decision.modules.slice(0, 3)).toEqual(['faces', 'memory', 'facts'])
  })

  it('kann Interferenz und Trainingslücke gleichzeitig in die Rotation einbauen', () => {
    const decision = composeDailyMission({
      seconds: 300,
      dueByModule: {},
      personalScenes: 0,
      untrainedPersonalItems: 0,
      dimensions: {
        words: { chances: 3, lost: 1 },
        faces: { chances: 12, lost: 2 },
      },
      interferenceErrors: 4,
    })

    expect(decision).toMatchObject({ focus: 'twins', reason: 'interference' })
    expect(decision.modules.slice(0, 2)).toEqual(['twins', 'words'])
    expect(decision.signals).toEqual(
      expect.arrayContaining([
        { moduleId: 'twins', reason: 'interference', amount: 4 },
        { moduleId: 'words', reason: 'undertrained', amount: 3 },
      ]),
    )
  })

  it('bleibt balanced, wenn keine belegbare Asymmetrie existiert', () => {
    const decision = composeDailyMission({
      seconds: 300,
      dueByModule: {},
      personalScenes: 0,
      untrainedPersonalItems: 0,
      dimensions: {
        words: { chances: 7, lost: 2 },
        faces: { chances: 7, lost: 4 },
      },
      interferenceErrors: 2,
    })

    expect(decision.focus).toBeUndefined()
    expect(decision.reason).toBe('balanced')
    expect(decision.signals).toEqual([])
  })
})
