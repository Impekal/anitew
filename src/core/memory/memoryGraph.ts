export type MemoryNodeType = 'person' | 'place' | 'fact' | 'number' | 'date' | 'concept' | 'custom'

export type MemoryNode = {
  id: string
  type: MemoryNodeType
  label: string
  detail?: string
  createdAt: string
  strength: number
  lastRecalledAt?: string
}

export type MemoryEdge = {
  id: string
  from: string
  to: string
  relation: 'association' | 'sequence' | 'context' | 'contrast' | 'custom'
  strength: number
  createdAt: string
}

export type MemoryGraph = {
  nodes: MemoryNode[]
  edges: MemoryEdge[]
}

const clamp = (value: number) => Math.max(0, Math.min(1, value))

export function createMemoryGraph(): MemoryGraph {
  return { nodes: [], edges: [] }
}

export function addMemoryNode(
  graph: MemoryGraph,
  input: Omit<MemoryNode, 'createdAt' | 'strength'> & { createdAt?: string; strength?: number },
): MemoryGraph {
  const node: MemoryNode = {
    ...input,
    createdAt: input.createdAt ?? new Date().toISOString(),
    strength: clamp(input.strength ?? 0.2),
  }
  return { ...graph, nodes: [...graph.nodes, node] }
}

export function connectMemoryNodes(
  graph: MemoryGraph,
  input: Omit<MemoryEdge, 'createdAt' | 'strength'> & { createdAt?: string; strength?: number },
): MemoryGraph {
  if (input.from === input.to) return graph
  if (!graph.nodes.some((node) => node.id === input.from) || !graph.nodes.some((node) => node.id === input.to)) {
    return graph
  }
  if (graph.edges.some((edge) => edge.from === input.from && edge.to === input.to && edge.relation === input.relation)) {
    return graph
  }
  const edge: MemoryEdge = {
    ...input,
    createdAt: input.createdAt ?? new Date().toISOString(),
    strength: clamp(input.strength ?? 0.2),
  }
  return { ...graph, edges: [...graph.edges, edge] }
}

export function reinforceMemoryNode(graph: MemoryGraph, nodeId: string, amount = 0.08, recalledAt = new Date().toISOString()): MemoryGraph {
  return {
    ...graph,
    nodes: graph.nodes.map((node) => node.id === nodeId
      ? { ...node, strength: clamp(node.strength + amount), lastRecalledAt: recalledAt }
      : node),
  }
}

export function graphConnectionCount(graph: MemoryGraph): number {
  return graph.edges.length
}

export function graphStrength(graph: MemoryGraph): number {
  if (graph.nodes.length === 0) return 0
  return graph.nodes.reduce((sum, node) => sum + node.strength, 0) / graph.nodes.length
}
