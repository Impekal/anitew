import { expect, it } from 'vitest'

import { readMemoryGraph } from '../../src/core/memory/memoryGraph.ts'

it('entfernt ungültige optionale Deadline-Felder aus einer Sicherung', () => {
  const graph = readMemoryGraph({
    nodes: [
      {
        id: 'fact:vortrag',
        type: 'fact',
        label: 'Vortrag',
        createdAt: 1,
        strength: 0.2,
        neededByAt: 'morgen',
        neededByDay: 'irgendwann',
        neededByUpdatedAt: Number.NaN,
      },
    ],
    edges: [],
    removed: {},
  })

  expect(graph.nodes[0]?.neededByAt).toBeUndefined()
  expect(graph.nodes[0]?.neededByDay).toBeUndefined()
  expect(graph.nodes[0]?.neededByUpdatedAt).toBeUndefined()
})
