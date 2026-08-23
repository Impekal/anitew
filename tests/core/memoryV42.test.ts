import { describe, expect, it } from 'vitest'

import {
  addMemoryNode,
  connectMemoryNodes,
  createMemoryGraph,
  reinforceMemoryNode,
} from '../../src/core/memory/memoryGraph.ts'
import {
  composeMemoryPool,
  memoryNodeIdOfItem,
  memorySceneItems,
  memorySubjectOf,
} from '../../src/core/memory/missionComposer.ts'

describe('V4.2 persönliche Abrufrichtungen', () => {
  it('öffnet die Gegenrichtung erst nach einem echten Abruf des neuen Ankers', () => {
    let graph = createMemoryGraph()
    graph = addMemoryNode(graph, { id: 'person:daniel', type: 'person', label: 'Daniel' }, 1_000)
    graph = addMemoryNode(graph, { id: 'place:madrid', type: 'place', label: 'Madrid' }, 1_000)
    graph = connectMemoryNodes(
      graph,
      { from: 'person:daniel', to: 'place:madrid', relation: 'context' },
      1_000,
    )

    const before = composeMemoryPool(graph)
    expect(before).toHaveLength(1)
    expect(memorySubjectOf(before[0] ?? '')).toBe('Daniel')

    graph = reinforceMemoryNode(graph, 'place:madrid', 2_000)
    const after = composeMemoryPool(graph)
    const reverse = after.find((scene) => memorySubjectOf(scene) === 'Madrid')
    expect(reverse).toBeDefined()

    const item = memorySceneItems(reverse ?? '')[0]
    expect(memoryNodeIdOfItem(item ?? '')).toBe('person:daniel')
  })

  it('vereinigt aus- und eingehende Beziehungen ohne dieselbe Erinnerung doppelt zu fragen', () => {
    let graph = createMemoryGraph()
    graph = addMemoryNode(graph, { id: 'event:reise', type: 'fact', label: 'Reise' }, 1_000)
    graph = addMemoryNode(graph, { id: 'date:2026', type: 'date', label: '2026' }, 1_000)
    graph = addMemoryNode(graph, { id: 'place:lome', type: 'place', label: 'Lomé' }, 1_000)
    graph = connectMemoryNodes(graph, { from: 'event:reise', to: 'date:2026', relation: 'context' }, 1_000)
    graph = connectMemoryNodes(graph, { from: 'place:lome', to: 'event:reise', relation: 'context' }, 1_000)
    graph = reinforceMemoryNode(graph, 'event:reise', 2_000)

    const scene = composeMemoryPool(graph).find((candidate) => memorySubjectOf(candidate) === 'Reise')
    const ids = memorySceneItems(scene ?? '').map((item) => memoryNodeIdOfItem(item))
    expect(ids).toEqual(expect.arrayContaining(['date:2026', 'place:lome']))
    expect(new Set(ids).size).toBe(ids.length)
  })
})
