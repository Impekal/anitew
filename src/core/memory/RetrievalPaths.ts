import type { MemoryNode } from './MemoryTypes.ts'

export type RetrievalPathKind = 'free-recall' | 'attribute-to-person' | 'person-to-attribute' | 'place-to-person' | 'association' | 'interference' | 'delayed-recall'

export type RetrievalPath = {
  id: string
  memoryId: string
  kind: RetrievalPathKind
  question: string
  answer: string
  difficulty: number
}

function parts(node: MemoryNode): string[] {
  return (node.summary ?? '').split(/\s*[—,;·]\s*/).map((x) => x.trim()).filter(Boolean)
}

export function buildRetrievalPaths(node: MemoryNode, peers: MemoryNode[] = []): RetrievalPath[] {
  const context = parts(node)
  const paths: RetrievalPath[] = [{
    id: `${node.id}:free`, memoryId: node.id, kind: 'free-recall',
    question: `What do you remember about “${node.title}”?`, answer: node.summary ?? node.title, difficulty: 0.35,
  }]

  if (node.kind === 'person' || node.dimensions.includes('names')) {
    if (context[0]) paths.push({ id: `${node.id}:person-attribute`, memoryId: node.id, kind: 'person-to-attribute', question: `What detail is connected to ${node.title}?`, answer: context[0], difficulty: 0.45 })
    if (context[1]) paths.push({ id: `${node.id}:attribute-person`, memoryId: node.id, kind: 'attribute-to-person', question: `Who is associated with “${context[1]}”?`, answer: node.title, difficulty: 0.55 })
  }

  if (node.dimensions.includes('spatial') || node.kind === 'place') {
    if (context[0]) paths.push({ id: `${node.id}:place-person`, memoryId: node.id, kind: 'place-to-person', question: `Which memory is connected to “${context[0]}”?`, answer: node.title, difficulty: 0.6 })
  }

  if (context.length > 1) paths.push({ id: `${node.id}:association`, memoryId: node.id, kind: 'association', question: `Which detail belongs with “${context[0]}”?`, answer: context[1], difficulty: 0.65 })

  const peer = peers.find((candidate) => candidate.id !== node.id && candidate.kind === node.kind)
  if (peer) paths.push({ id: `${node.id}:interference:${peer.id}`, memoryId: node.id, kind: 'interference', question: `Which detail belongs to “${node.title}”, not “${peer.title}”?`, answer: context[0] ?? node.title, difficulty: 0.8 })

  paths.push({ id: `${node.id}:delayed`, memoryId: node.id, kind: 'delayed-recall', question: `Without looking back: what is the key detail you want to retain about “${node.title}”?`, answer: node.summary ?? node.title, difficulty: 0.9 })
  return paths
}
