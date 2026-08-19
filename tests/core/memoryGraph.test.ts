import { describe, expect, it } from 'vitest'

import {
  INITIAL_STRENGTH,
  REINFORCE_STEP,
  addMemoryNode,
  connectMemoryNodes,
  createMemoryGraph,
  graphConnectionCount,
  graphStrength,
  latestNodes,
  memoryNodeId,
  mergeMemoryGraph,
  nodesByStrength,
  readMemoryGraph,
  reinforceMemoryNode,
  removeMemoryNode,
  weakenMemoryNode,
} from '../../src/core/memory/memoryGraph.ts'

/**
 * Der Memory-Graph (D-036).
 *
 * Die Regeln hinter den Fällen: **deterministisch** (Zeit wird
 * hereingereicht), **zwei Währungen** (Stärke ist Trainingsstand, keine
 * Gedächtnisaussage), und beim Vereinigen gilt die Sicherungsregel N9 —
 * nie löschen, die längere Geschichte gewinnt.
 */
describe('der Memory-Graph', () => {
  const at = 1_000

  it('legt echte Erinnerungen an und verbindet sie', () => {
    let graph = createMemoryGraph()
    graph = addMemoryNode(graph, { id: 'person:maya', type: 'person', label: 'Maya' }, at)
    graph = addMemoryNode(graph, { id: 'place:delhi', type: 'place', label: 'Delhi' }, at)
    graph = connectMemoryNodes(
      graph,
      { from: 'person:maya', to: 'place:delhi', relation: 'association' },
      at,
    )

    expect(graph.nodes).toHaveLength(2)
    expect(graphConnectionCount(graph)).toBe(1)
    expect(graph.nodes[0]?.strength).toBe(INITIAL_STRENGTH)
  })

  it('weist Kaputtes ab: Selbstbezug, fehlende Enden, Doppeltes', () => {
    let graph = createMemoryGraph()
    graph = addMemoryNode(graph, { id: 'a', type: 'fact', label: 'Anker' }, at)
    graph = connectMemoryNodes(graph, { from: 'a', to: 'a', relation: 'association' }, at)
    graph = connectMemoryNodes(graph, { from: 'a', to: 'fehlt', relation: 'association' }, at)
    expect(graphConnectionCount(graph)).toBe(0)

    graph = addMemoryNode(graph, { id: 'b', type: 'fact', label: 'Blatt' }, at)
    graph = connectMemoryNodes(graph, { from: 'a', to: 'b', relation: 'association' }, at)
    graph = connectMemoryNodes(graph, { from: 'a', to: 'b', relation: 'association' }, at)
    expect(graphConnectionCount(graph)).toBe(1)

    // Zweimal dieselbe Kennung ist einmal dieselbe Erinnerung.
    graph = addMemoryNode(graph, { id: 'a', type: 'fact', label: 'Anders' }, at)
    expect(graph.nodes).toHaveLength(2)
  })

  it('hebt bei Erfolg, senkt bei Verlust — und bleibt in 0..1', () => {
    let graph = createMemoryGraph()
    graph = addMemoryNode(graph, { id: 'n', type: 'fact', label: 'Nadel' }, at)
    graph = reinforceMemoryNode(graph, 'n', at + 1)
    expect(graph.nodes[0]?.strength).toBeCloseTo(INITIAL_STRENGTH + REINFORCE_STEP)
    expect(graph.nodes[0]?.lastRecalledAt).toBe(at + 1)

    for (let round = 0; round < 20; round++) graph = weakenMemoryNode(graph, 'n', at + 2)
    expect(graph.nodes[0]?.strength).toBe(0)
    for (let round = 0; round < 20; round++) graph = reinforceMemoryNode(graph, 'n', at + 3)
    expect(graph.nodes[0]?.strength).toBe(1)
    expect(graphStrength(graph)).toBe(1)
  })

  it('löscht einen Knoten samt seiner Kanten — halbe Kanten gibt es nicht', () => {
    let graph = createMemoryGraph()
    graph = addMemoryNode(graph, { id: 'a', type: 'fact', label: 'Anker' }, at)
    graph = addMemoryNode(graph, { id: 'b', type: 'fact', label: 'Blatt' }, at)
    graph = connectMemoryNodes(graph, { from: 'a', to: 'b', relation: 'association' }, at)
    graph = removeMemoryNode(graph, 'b', at + 1)
    expect(graph.nodes).toHaveLength(1)
    expect(graphConnectionCount(graph)).toBe(0)
    // Zurück bleibt der Grabstein — und neu Merken räumt ihn wieder weg.
    expect(graph.removed['b']).toBe(at + 1)
    graph = addMemoryNode(graph, { id: 'b', type: 'fact', label: 'Blatt' }, at + 2)
    expect(graph.removed['b']).toBeUndefined()
  })

  it('lässt Entferntes im Merge nicht auferstehen — außer nach jüngerem Lebenszeichen', () => {
    let shared = createMemoryGraph()
    shared = addMemoryNode(shared, { id: 'x', type: 'fact', label: 'X' }, 10)
    // Gerät A entfernt bei 100 — Gerät B hält die alte Fassung (Abruf bei 80).
    const a = removeMemoryNode(shared, 'x', 100)
    const b = reinforceMemoryNode(shared, 'x', 80)
    const merged = mergeMemoryGraph(a, b)
    expect(merged.nodes).toHaveLength(0)
    expect(merged.removed['x']).toBe(100)

    // Gerät B merkt es sich später NEU (150) — das Lebenszeichen gewinnt.
    let bAgain = mergeMemoryGraph(createMemoryGraph(), merged)
    bAgain = addMemoryNode(bAgain, { id: 'x', type: 'fact', label: 'X' }, 150)
    const revived = mergeMemoryGraph(merged, bAgain)
    expect(revived.nodes).toHaveLength(1)
    expect(revived.removed['x']).toBeUndefined()
  })

  it('sortiert nach Zuwendungsbedarf und nach Frische', () => {
    let graph = createMemoryGraph()
    graph = addMemoryNode(graph, { id: 'alt', type: 'fact', label: 'Alt' }, 1)
    graph = addMemoryNode(graph, { id: 'neu', type: 'fact', label: 'Neu' }, 2)
    graph = reinforceMemoryNode(graph, 'alt', 3)
    expect(nodesByStrength(graph)[0]?.id).toBe('neu')
    expect(latestNodes(graph, 1)[0]?.id).toBe('neu')
  })

  it('vereinigt wie die Sicherung: nie löschen, die längere Geschichte gewinnt', () => {
    let mine = createMemoryGraph()
    mine = addMemoryNode(mine, { id: 'p', type: 'person', label: 'Paul' }, 100)
    mine = reinforceMemoryNode(mine, 'p', 500)

    let theirs = createMemoryGraph()
    theirs = addMemoryNode(theirs, { id: 'p', type: 'person', label: 'Paul' }, 50)
    theirs = addMemoryNode(theirs, { id: 'o', type: 'place', label: 'Oslo' }, 60)
    theirs = connectMemoryNodes(theirs, { from: 'p', to: 'o', relation: 'association' }, 60)

    const merged = mergeMemoryGraph(mine, theirs)
    expect(merged.nodes).toHaveLength(2)
    expect(merged.edges).toHaveLength(1)
    const paul = merged.nodes.find((node) => node.id === 'p')
    expect(paul?.createdAt).toBe(50)
    expect(paul?.strength).toBeCloseTo(INITIAL_STRENGTH + REINFORCE_STEP)
    expect(paul?.lastRecalledAt).toBe(500)
  })

  it('liest Unbekanntes streng: Kaputtes fällt, Kanten ohne Enden auch', () => {
    expect(readMemoryGraph('quatsch')).toEqual({ nodes: [], edges: [], removed: {} })
    const read = readMemoryGraph({
      nodes: [
        { id: 'a', type: 'fact', label: 'Anker', createdAt: 1, strength: 0.5 },
        { id: 'kaputt', label: 'ohne Typ' },
      ],
      edges: [{ id: 'x', from: 'a', to: 'fehlt', relation: 'association', createdAt: 1 }],
    })
    expect(read.nodes).toHaveLength(1)
    expect(read.edges).toHaveLength(0)
  })

  it('bildet stabile Kennungen — zweimal „Daniel“ ist einmal Daniel', () => {
    expect(memoryNodeId('person', ' Daniel ')).toBe(memoryNodeId('person', 'daniel'))
  })
})
