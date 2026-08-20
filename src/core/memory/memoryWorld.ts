import type { MemoryGraph, MemoryNode } from './memoryGraph.ts'

export interface MemoryCluster {
  readonly id: string
  readonly anchor: MemoryNode
  readonly nodes: readonly MemoryNode[]
  readonly edgeCount: number
  readonly practice: number
}

/** Zusammenhangskomponenten, stabil benannt nach ihrem wichtigsten Knoten. */
export function memoryClusters(graph: MemoryGraph): readonly MemoryCluster[] {
  const byId = new Map(graph.nodes.map((node) => [node.id, node]))
  const neighbors = new Map<string, Set<string>>(graph.nodes.map((node) => [node.id, new Set()]))
  for (const edge of graph.edges) {
    neighbors.get(edge.from)?.add(edge.to)
    neighbors.get(edge.to)?.add(edge.from)
  }
  const unseen = new Set(byId.keys())
  const clusters: MemoryCluster[] = []
  while (unseen.size > 0) {
    const first = [...unseen].sort()[0]
    if (first === undefined) break
    const queue = [first]
    const ids: string[] = []
    unseen.delete(first)
    while (queue.length > 0) {
      const id = queue.shift()
      if (id === undefined) continue
      ids.push(id)
      for (const next of neighbors.get(id) ?? []) {
        if (!unseen.delete(next)) continue
        queue.push(next)
      }
    }
    const nodes = ids.map((id) => byId.get(id)).filter((node): node is MemoryNode => node !== undefined)
    const anchor = [...nodes].sort(
      (a, b) =>
        (neighbors.get(b.id)?.size ?? 0) - (neighbors.get(a.id)?.size ?? 0) ||
        a.createdAt - b.createdAt ||
        a.id.localeCompare(b.id),
    )[0]
    if (anchor === undefined) continue
    const idsSet = new Set(ids)
    const edgeCount = graph.edges.filter((edge) => idsSet.has(edge.from) && idsSet.has(edge.to)).length
    clusters.push({
      id: anchor.id,
      anchor,
      nodes,
      edgeCount,
      practice: nodes.reduce((sum, node) => sum + node.strength, 0) / nodes.length,
    })
  }
  return clusters.sort(
    (a, b) => b.nodes.length - a.nodes.length || b.edgeCount - a.edgeCount || a.id.localeCompare(b.id),
  )
}

export function memoryNeighborhood(graph: MemoryGraph, nodeId: string, depth = 1): ReadonlySet<string> {
  const visible = new Set([nodeId])
  let frontier = new Set([nodeId])
  for (let step = 0; step < depth; step++) {
    const next = new Set<string>()
    for (const edge of graph.edges) {
      if (frontier.has(edge.from) && !visible.has(edge.to)) next.add(edge.to)
      if (frontier.has(edge.to) && !visible.has(edge.from)) next.add(edge.from)
    }
    for (const id of next) visible.add(id)
    frontier = next
  }
  return visible
}
