import { weakenMemoryNode } from '../../src/core/memory/memoryGraph.ts'
import { describe, expect, it } from 'vitest'

import {
  addMemoryNode,
  composeDailyMission,
  connectMemoryNodes,
  createMemoryGraph,
  memoryClusters,
  memoryNeighborhood,
  memoryPulse,
} from '../../src/core/index.ts'
import { composeMemoryPool, memorySceneItems } from '../../src/core/memory/missionComposer.ts'

function graphAt(now = 1_000) {
  let graph = createMemoryGraph()
  graph = addMemoryNode(graph, { id: 'person:daniel', type: 'person', label: 'Daniel' }, now)
  graph = addMemoryNode(graph, { id: 'place:madrid', type: 'place', label: 'Madrid' }, now)
  graph = connectMemoryNodes(
    graph,
    { from: 'person:daniel', to: 'place:madrid', relation: 'association' },
    now,
  )
  return graph
}

describe('Memory Pulse', () => {
  it('nennt nur echte fällige Graph-Knoten und neue Erinnerungen', () => {
    const graph = graphAt(1_000)
    const item = memorySceneItems(composeMemoryPool(graph)[0] ?? '')[0] ?? ''
    const signals = memoryPulse({
      graph,
      today: '2026-08-20',
      now: 2_000,
      due: [
        {
          itemId: `memory:de:${item}`,
          memory: { stability: 1, difficulty: 5, reviews: 1, lapses: 0, state: 1, dueDay: '2026-08-20' },
        },
      ],
    })
    expect(signals).toContainEqual({ kind: 'attention', count: 1 })
    expect(signals).toContainEqual({ kind: 'new', count: 2 })
  })

  it('findet eine lange nicht gesehene Erinnerung ohne einen Score zu erfinden', () => {
    const graph = graphAt(0)
    const signals = memoryPulse({ graph, due: [], today: '2026-08-20', now: 30 * 86_400_000 })
    expect(signals.some((signal) => signal.kind === 'stale')).toBe(true)
  })
})

describe('Memory World', () => {
  it('bildet stabile Zusammenhangswelten und begrenzte Nachbarschaften', () => {
    let graph = graphAt()
    graph = addMemoryNode(graph, { id: 'fact:solo', type: 'fact', label: 'Solo' }, 2_000)
    const clusters = memoryClusters(graph)
    expect(clusters.map((cluster) => cluster.nodes.length)).toEqual([2, 1])
    expect(clusters[0]?.anchor.id).toBe('person:daniel')
    expect([...memoryNeighborhood(graph, 'person:daniel')].sort()).toEqual([
      'person:daniel',
      'place:madrid',
    ])
  })
})

describe('Adaptive Daily Mission', () => {
  it('lässt echte FSRS-Fälligkeit vor allen anderen Signalen gewinnen', () => {
    const decision = composeDailyMission({
      seconds: 300,
      dueByModule: { faces: 2, memory: 4 },
      personalScenes: 2,
      untrainedPersonalItems: 3,
      dimensions: {},
      interferenceErrors: 5,
    })
    expect(decision).toMatchObject({ focus: 'memory', reason: 'due' })
    expect(decision.modules[0]).toBe('memory')
  })

  it('nimmt neue persönliche Inhalte, wenn FSRS nichts fordert', () => {
    expect(
      composeDailyMission({
        seconds: 60,
        dueByModule: {},
        personalScenes: 1,
        untrainedPersonalItems: 2,
        dimensions: {},
        interferenceErrors: 0,
      }),
    ).toMatchObject({ focus: 'memory', reason: 'personal' })
  })

  it('reagiert auf Interferenz statt generisch zu rotieren', () => {
    expect(
      composeDailyMission({
        seconds: 300,
        dueByModule: {},
        personalScenes: 0,
        untrainedPersonalItems: 0,
        dimensions: {},
        interferenceErrors: 3,
      }),
    ).toMatchObject({ focus: 'twins', reason: 'interference' })
  })
})


describe('Phase 2 evidence guards', () => {
  it('macht aus einer Sofort-Achse keinen Tages-Schwerpunkt', () => {
    const decision = composeDailyMission({
      seconds: 300,
      dueByModule: {},
      personalScenes: 0,
      untrainedPersonalItems: 0,
      dimensions: { working: { chances: 20, lost: 3 } },
      interferenceErrors: 0,
    })
    expect(decision.focus).toBeUndefined()
    expect(decision.reason).toBe('balanced')
  })

  it('behandelt null Wiedersehen als fehlende Evidenz, nicht als Untertraining', () => {
    const decision = composeDailyMission({
      seconds: 300,
      dueByModule: {},
      personalScenes: 0,
      untrainedPersonalItems: 0,
      dimensions: { words: { chances: 0, lost: 0 } },
      interferenceErrors: 0,
    })
    expect(decision.focus).toBeUndefined()
    expect(decision.reason).toBe('balanced')
  })

  it('erfindet bei gleich viel Training keinen untertrainierten Gewinner', () => {
    const decision = composeDailyMission({
      seconds: 300,
      dueByModule: {},
      personalScenes: 0,
      untrainedPersonalItems: 0,
      dimensions: {
        words: { chances: 21, lost: 5 },
        numbers: { chances: 21, lost: 6 },
      },
      interferenceErrors: 0,
    })
    expect(decision.focus).toBeUndefined()
    expect(decision.reason).toBe('balanced')
  })

  it('darf eine echte verzögerte Gelegenheit als wenig trainiert priorisieren', () => {
    const decision = composeDailyMission({
      seconds: 300,
      dueByModule: {},
      personalScenes: 0,
      untrainedPersonalItems: 0,
      dimensions: {
        words: { chances: 4, lost: 1 },
        faces: { chances: 9, lost: 2 },
      },
      interferenceErrors: 0,
    })
    expect(decision).toMatchObject({ focus: 'words', reason: 'undertrained' })
  })

  it('nennt auch einen misslungenen Abruf nur Training, nicht Verstärkung', () => {
    const graph = weakenMemoryNode(graphAt(1_000), 'person:daniel', 2_000)
    const signals = memoryPulse({ graph, due: [], today: '2026-08-20', now: 2_000 })
    expect(signals).toContainEqual({ kind: 'practiced', count: 1 })
  })
})
