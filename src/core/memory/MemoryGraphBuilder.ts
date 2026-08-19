import type { MemoryConnection, MemoryNode } from './MemoryTypes.ts'
import { connectMemoryNodes } from './MemoryStore.ts'

export type MemoryGraph = { nodes: MemoryNode[]; connections: MemoryConnection[] }

const PLACE_WORDS = /\b(in|aus|nach|bei|lebt|woh|wohnhaft|stadt|land|berlin|hamburg|paris|london|rom|madrid|delhi|accra|ghana|indien|deutschland|frankreich|italien|spanien)\b/i
const PERSON_HINT = /\b(person|personality|mensch|kollege|kollegin|freund|freundin|herr|frau|name|heißt)\b/i
const JOB_HINT = /\b(arbeitet|beruf|architekt|ärzt|professor|wissenschaft|ingenieur|designer|lehrer|journalist|museum)\b/i

function unique(values: string[]) { return [...new Set(values.map((v) => v.trim()).filter(Boolean))] }

export function buildMemoryGraph(nodes: MemoryNode[]): MemoryGraph {
  const connections: MemoryConnection[] = []
  const existing = new Set<string>()
  const add = (from: string, to: string, label: string) => {
    const key = `${from}:${to}:${label}`
    if (from === to || existing.has(key)) return
    existing.add(key)
    connections.push({ id: crypto.randomUUID(), from, to, label, strength: 0.25, createdAt: Date.now() })
  }

  for (const node of nodes) {
    const words = unique(`${node.title} ${node.summary ?? ''}`.split(/[,·—;]+/))
    const possible = nodes.filter((other) => other.id !== node.id)
    for (const other of possible) {
      const sameTag = node.tags.some((tag) => other.tags.includes(tag))
      const sameDimension = node.dimensions.some((dimension) => other.dimensions.includes(dimension))
      const textOverlap = other.title.split(/\s+/).some((word) => word.length > 4 && node.title.toLocaleLowerCase().includes(word.toLocaleLowerCase()))
      if (sameTag) add(node.id, other.id, 'shared tag')
      else if (textOverlap) add(node.id, other.id, 'shared context')
      else if (sameDimension && (PERSON_HINT.test(node.title) || JOB_HINT.test(node.summary ?? '') || PLACE_WORDS.test(node.summary ?? ''))) add(node.id, other.id, 'semantic association')
    }
    // Keep a compact semantic hint on the node itself without inventing entities.
    if (words.length > 1 && (PLACE_WORDS.test(node.summary ?? '') || JOB_HINT.test(node.summary ?? ''))) {
      const related = possible.find((other) => other.kind === 'person' && PERSON_HINT.test(other.title))
      if (related) add(related.id, node.id, 'real-life detail')
    }
  }
  return { nodes, connections }
}

export function persistGraphConnections(graph: MemoryGraph): void {
  graph.connections.forEach((connection) => connectMemoryNodes(connection.from, connection.to, connection.label))
}
