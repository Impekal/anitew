import type { MemoryConnection, MemoryNode } from './MemoryTypes.ts'

const NODE_KEY = 'anitew.memory.nodes.v2'
const CONNECTION_KEY = 'anitew.memory.connections.v2'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function loadMemoryNodes(): MemoryNode[] {
  return read<MemoryNode[]>(NODE_KEY, [])
}

export function loadMemoryConnections(): MemoryConnection[] {
  return read<MemoryConnection[]>(CONNECTION_KEY, [])
}

export function saveMemoryNode(node: MemoryNode): void {
  const nodes = loadMemoryNodes().filter((item) => item.id !== node.id)
  write(NODE_KEY, [...nodes, node])
}

export function saveMemoryConnection(connection: MemoryConnection): void {
  const connections = loadMemoryConnections().filter((item) => item.id !== connection.id)
  write(CONNECTION_KEY, [...connections, connection])
}

export function createMemoryNode(input: Pick<MemoryNode, 'kind' | 'title' | 'summary' | 'tags' | 'dimensions'>): MemoryNode {
  const now = Date.now()
  const node: MemoryNode = {
    id: crypto.randomUUID(),
    kind: input.kind,
    title: input.title.trim(),
    summary: input.summary?.trim(),
    tags: input.tags,
    dimensions: input.dimensions,
    strength: 0.1,
    createdAt: now,
  }
  saveMemoryNode(node)
  return node
}

export function connectMemoryNodes(from: string, to: string, label?: string): MemoryConnection {
  const connection: MemoryConnection = {
    id: crypto.randomUUID(),
    from,
    to,
    label,
    strength: 0.2,
    createdAt: Date.now(),
  }
  saveMemoryConnection(connection)
  return connection
}
