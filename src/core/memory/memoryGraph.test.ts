import { describe, expect, it } from 'vitest'

import {
  addMemoryNode,
  connectMemoryNodes,
  createMemoryGraph,
  graphConnectionCount,
  graphStrength,
  reinforceMemoryNode,
} from './memoryGraph.ts'

describe('memory graph', () => {
  it('creates and connects real memory entities', () => {
    let graph = createMemoryGraph()
    graph = addMemoryNode(graph, { id: 'maya', type: 'person', label: 'Maya' })
    graph = addMemoryNode(graph, { id: 'delhi', type: 'place', label: 'Delhi' })
    graph = connectMemoryNodes(graph, {
      id: 'maya-delhi',
      from: 'maya',
      to: 'delhi',
      relation: 'association',
    })

    expect(graph.nodes).toHaveLength(2)
    expect(graphConnectionCount(graph)).toBe(1)
  })

  it('rejects invalid and duplicate connections', () => {
    let graph = createMemoryGraph()
    graph = addMemoryNode(graph, { id: 'a', type: 'fact', label: 'A' })
    graph = addMemoryNode(graph, { id: 'b', type: 'fact', label: 'B' })
    graph = connectMemoryNodes(graph, { id: 'a-b', from: 'a', to: 'b', relation: 'association' })
    graph = connectMemoryNodes(graph, { id: 'a-b-duplicate', from: 'a', to: 'b', relation: 'association' })
    graph = connectMemoryNodes(graph, { id: 'missing', from: 'a', to: 'missing-node', relation: 'association' })

    expect(graphConnectionCount(graph)).toBe(1)
  })

  it('reinforces recall without exceeding one', () => {
    let graph = createMemoryGraph()
    graph = addMemoryNode(graph, { id: 'x', type: 'fact', label: 'X', strength: 0.97 })
    graph = reinforceMemoryNode(graph, 'x', 0.2, '2026-08-19T12:00:00.000Z')

    expect(graph.nodes[0].strength).toBe(1)
    expect(graph.nodes[0].lastRecalledAt).toBe('2026-08-19T12:00:00.000Z')
    expect(graphStrength(graph)).toBe(1)
  })
})
