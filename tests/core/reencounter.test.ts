import { describe, expect, it } from 'vitest'

import {
  MEMORY_ID_SEPARATOR,
  MEMORY_ITEM_SEPARATOR,
  connectMemoryNodes,
  createMemoryGraph,
  addMemoryNode,
  memoryReencounter,
  type DueItem,
} from '../../src/core/index.ts'

const memory = (dueDay: string): DueItem['memory'] => ({
  stability: 2,
  difficulty: 5,
  reviews: 1,
  lapses: 0,
  state: 2,
  lastDay: '2026-08-18',
  dueDay,
})

const item = (subject: string, target: string, subjectId: string, targetId: string, dueDay: string): DueItem => ({
  itemId: `de:memory:${subject}${MEMORY_ITEM_SEPARATOR}${target}${MEMORY_ID_SEPARATOR}${subjectId}${MEMORY_ID_SEPARATOR}${targetId}`,
  memory: memory(dueDay),
})

describe('memoryReencounter', () => {
  it('nimmt den Termin aus FSRS und liefert den echten Graph-Knoten zurück', () => {
    const now = Date.UTC(2026, 7, 20, 12)
    let graph = createMemoryGraph()
    graph = addMemoryNode(graph, { id: 'person:daniel', type: 'person', label: 'Daniel' }, now - 10 * 86_400_000)
    graph = addMemoryNode(graph, { id: 'place:madrid', type: 'place', label: 'Madrid' }, now - 10 * 86_400_000)
    graph = connectMemoryNodes(graph, { from: 'person:daniel', to: 'place:madrid', relation: 'association' }, now - 10 * 86_400_000)

    const result = memoryReencounter({
      graph,
      due: [item('Daniel', 'Madrid', 'person:daniel', 'place:madrid', '2026-08-20')],
      today: '2026-08-20',
      now,
    })

    expect(result?.node.id).toBe('place:madrid')
    expect(result?.node.label).toBe('Madrid')
    expect(result?.daysAway).toBe(10)
    expect(result?.firstReturn).toBe(true)
    expect(result?.worldAnchor?.id).toBe('person:daniel')
    expect(result?.worldSize).toBe(2)
  })

  it('nimmt nichts, wenn FSRS heute kein Graph-Item fällig nennt', () => {
    const now = Date.UTC(2026, 7, 20, 12)
    let graph = createMemoryGraph()
    graph = addMemoryNode(graph, { id: 'place:madrid', type: 'place', label: 'Madrid' }, now - 10 * 86_400_000)

    expect(
      memoryReencounter({
        graph,
        due: [item('Daniel', 'Madrid', 'person:daniel', 'place:madrid', '2026-08-21')],
        today: '2026-08-20',
        now,
      }),
    ).toBeUndefined()
  })

  it('behauptet keinen knotengenauen Rückkehrmoment für alte Termine ohne stabile Graph-ID', () => {
    const now = Date.UTC(2026, 7, 20, 12)
    let graph = createMemoryGraph()
    graph = addMemoryNode(graph, { id: 'place:madrid', type: 'place', label: 'Madrid' }, now - 10 * 86_400_000)

    expect(
      memoryReencounter({
        graph,
        due: [{ itemId: `de:memory:Daniel${MEMORY_ITEM_SEPARATOR}Madrid`, memory: memory('2026-08-20') }],
        today: '2026-08-20',
        now,
      }),
    ).toBeUndefined()
  })
})
