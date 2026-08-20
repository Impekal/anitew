import { describe, expect, it } from 'vitest'

import {
  MEMORY_ID_SEPARATOR,
  MEMORY_ITEM_SEPARATOR,
  connectMemoryNodes,
  createMemoryGraph,
  addMemoryNode,
  reinforceMemoryNode,
  memoryAfterglow,
  memoryReencounter,
  type DueItem,
} from '../../src/core/index.ts'

const DAY = 86_400_000
const MINUTE = 60_000

const memory = (dueDay: string): DueItem['memory'] => ({
  stability: 2,
  difficulty: 5,
  reviews: 1,
  lapses: 0,
  state: 2,
  lastDay: '2026-08-18',
  dueDay,
})

// Production persists item IDs as module:language:payload (itemIdOf in data/items.ts).
// Keep these fixtures on that canonical contract so RETURN is tested against
// the same IDs loadDue() actually returns.
const item = (subject: string, target: string, subjectId: string, targetId: string, dueDay: string): DueItem => ({
  itemId: `memory:de:${subject}${MEMORY_ITEM_SEPARATOR}${target}${MEMORY_ID_SEPARATOR}${subjectId}${MEMORY_ID_SEPARATOR}${targetId}`,
  memory: memory(dueDay),
})

describe('memoryReencounter', () => {
  it('nimmt den Termin aus FSRS und liefert den echten Graph-Knoten zurück', () => {
    const now = Date.UTC(2026, 7, 20, 12)
    let graph = createMemoryGraph()
    graph = addMemoryNode(graph, { id: 'person:daniel', type: 'person', label: 'Daniel' }, now - 10 * DAY)
    graph = addMemoryNode(graph, { id: 'place:madrid', type: 'place', label: 'Madrid' }, now - 10 * DAY)
    graph = connectMemoryNodes(graph, { from: 'person:daniel', to: 'place:madrid', relation: 'association' }, now - 10 * DAY)

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

  it('folgt der bestehenden FSRS-Dringlichkeit statt eine eigene Reihenfolge zu bauen', () => {
    const now = Date.UTC(2026, 7, 20, 12)
    let graph = createMemoryGraph()
    graph = addMemoryNode(graph, { id: 'person:daniel', type: 'person', label: 'Daniel' }, now - 20 * DAY)
    graph = addMemoryNode(graph, { id: 'place:madrid', type: 'place', label: 'Madrid' }, now - 20 * DAY)
    graph = addMemoryNode(graph, { id: 'concept:gitarre', type: 'concept', label: 'Gitarre' }, now - 20 * DAY)

    const result = memoryReencounter({
      graph,
      due: [
        item('Daniel', 'Madrid', 'person:daniel', 'place:madrid', '2026-08-20'),
        item('Daniel', 'Gitarre', 'person:daniel', 'concept:gitarre', '2026-08-17'),
      ],
      today: '2026-08-20',
      now,
    })

    expect(result?.node.id).toBe('concept:gitarre')
  })

  it('zählt die Abwesenheit seit dem letzten echten Abruf, nicht seit dem Anlegen', () => {
    const now = Date.UTC(2026, 7, 20, 12)
    let graph = createMemoryGraph()
    graph = addMemoryNode(graph, { id: 'place:madrid', type: 'place', label: 'Madrid' }, now - 30 * DAY)
    graph = reinforceMemoryNode(graph, 'place:madrid', now - 4 * DAY)

    const result = memoryReencounter({
      graph,
      due: [item('Daniel', 'Madrid', 'person:daniel', 'place:madrid', '2026-08-20')],
      today: '2026-08-20',
      now,
    })

    expect(result?.daysAway).toBe(4)
    expect(result?.firstReturn).toBe(false)
  })

  it('nimmt nichts, wenn FSRS heute kein Graph-Item fällig nennt', () => {
    const now = Date.UTC(2026, 7, 20, 12)
    let graph = createMemoryGraph()
    graph = addMemoryNode(graph, { id: 'place:madrid', type: 'place', label: 'Madrid' }, now - 10 * DAY)

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
    graph = addMemoryNode(graph, { id: 'place:madrid', type: 'place', label: 'Madrid' }, now - 10 * DAY)

    expect(
      memoryReencounter({
        graph,
        due: [{ itemId: `memory:de:Daniel${MEMORY_ITEM_SEPARATOR}Madrid`, memory: memory('2026-08-20') }],
        today: '2026-08-20',
        now,
      }),
    ).toBeUndefined()
  })
})

describe('memoryAfterglow', () => {
  it('lässt nach einem echten Abruf die betroffene Memory World reagieren', () => {
    const now = Date.UTC(2026, 7, 20, 12)
    let graph = createMemoryGraph()
    graph = addMemoryNode(graph, { id: 'person:daniel', type: 'person', label: 'Daniel' }, now - 30 * DAY)
    graph = addMemoryNode(graph, { id: 'place:madrid', type: 'place', label: 'Madrid' }, now - 30 * DAY)
    graph = addMemoryNode(graph, { id: 'concept:gitarre', type: 'concept', label: 'Gitarre' }, now - 30 * DAY)
    graph = connectMemoryNodes(graph, { from: 'person:daniel', to: 'place:madrid', relation: 'association' }, now - 30 * DAY)
    graph = connectMemoryNodes(graph, { from: 'person:daniel', to: 'concept:gitarre', relation: 'association' }, now - 30 * DAY)
    graph = reinforceMemoryNode(graph, 'place:madrid', now - 2 * MINUTE)
    graph = reinforceMemoryNode(graph, 'concept:gitarre', now - 1 * MINUTE)

    const result = memoryAfterglow({ graph, now })

    expect(result?.anchor.id).toBe('person:daniel')
    expect(result?.recalled.map((node) => node.id).sort()).toEqual(['concept:gitarre', 'place:madrid'])
    expect(result?.lastRecalledAt).toBe(now - MINUTE)
  })

  it('verschwindet wieder: ein alter Abruf ist kein dauerndes Erfolgsbanner', () => {
    const now = Date.UTC(2026, 7, 20, 12)
    let graph = createMemoryGraph()
    graph = addMemoryNode(graph, { id: 'place:madrid', type: 'place', label: 'Madrid' }, now - 30 * DAY)
    graph = reinforceMemoryNode(graph, 'place:madrid', now - 20 * MINUTE)

    expect(memoryAfterglow({ graph, now })).toBeUndefined()
  })

  it('wählt bei mehreren Welten die mit den meisten gerade abgerufenen Knoten', () => {
    const now = Date.UTC(2026, 7, 20, 12)
    let graph = createMemoryGraph()
    graph = addMemoryNode(graph, { id: 'person:daniel', type: 'person', label: 'Daniel' }, now - 30 * DAY)
    graph = addMemoryNode(graph, { id: 'place:madrid', type: 'place', label: 'Madrid' }, now - 30 * DAY)
    graph = addMemoryNode(graph, { id: 'concept:gitarre', type: 'concept', label: 'Gitarre' }, now - 30 * DAY)
    graph = addMemoryNode(graph, { id: 'person:mira', type: 'person', label: 'Mira' }, now - 30 * DAY)
    graph = addMemoryNode(graph, { id: 'concept:cello', type: 'concept', label: 'Cello' }, now - 30 * DAY)
    graph = connectMemoryNodes(graph, { from: 'person:daniel', to: 'place:madrid', relation: 'association' }, now - 30 * DAY)
    graph = connectMemoryNodes(graph, { from: 'person:daniel', to: 'concept:gitarre', relation: 'association' }, now - 30 * DAY)
    graph = connectMemoryNodes(graph, { from: 'person:mira', to: 'concept:cello', relation: 'association' }, now - 30 * DAY)
    graph = reinforceMemoryNode(graph, 'place:madrid', now - 3 * MINUTE)
    graph = reinforceMemoryNode(graph, 'concept:gitarre', now - 2 * MINUTE)
    graph = reinforceMemoryNode(graph, 'concept:cello', now - MINUTE)

    expect(memoryAfterglow({ graph, now })?.anchor.id).toBe('person:daniel')
  })
})
