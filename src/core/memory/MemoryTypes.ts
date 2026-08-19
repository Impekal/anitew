export type MemoryDimension =
  | 'focus'
  | 'encoding'
  | 'retrieval'
  | 'working-memory'
  | 'associative'
  | 'spatial'
  | 'names'
  | 'numbers'
  | 'language'

export type MemoryItemKind =
  | 'fact'
  | 'person'
  | 'place'
  | 'number'
  | 'word'
  | 'event'
  | 'custom'

export interface MemoryNode {
  id: string
  kind: MemoryItemKind
  title: string
  summary?: string
  tags: string[]
  dimensions: MemoryDimension[]
  strength: number
  createdAt: number
  lastReviewedAt?: number
  nextReviewAt?: number
}

export interface MemoryConnection {
  id: string
  from: string
  to: string
  label?: string
  strength: number
  createdAt: number
}

export interface MemoryProfile {
  dimensions: Partial<Record<MemoryDimension, number>>
  totalNodes: number
  totalConnections: number
  currentStreak: number
  updatedAt: number
}
