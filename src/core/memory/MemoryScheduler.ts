import type { MemoryNode } from './MemoryTypes.ts'

export type RecallOutcome = 'forgot' | 'hard' | 'good' | 'easy'

const INTERVALS_DAYS: Record<RecallOutcome, number> = {
  forgot: 0,
  hard: 1,
  good: 3,
  easy: 7,
}

export function scheduleNextRecall(node: MemoryNode, outcome: RecallOutcome): MemoryNode {
  const now = Date.now()
  const days = INTERVALS_DAYS[outcome]
  const multiplier = outcome === 'forgot' ? 0.35 : outcome === 'hard' ? 0.7 : outcome === 'easy' ? 1.25 : 1
  return {
    ...node,
    strength: Math.max(0.05, Math.min(1, node.strength * multiplier + (outcome === 'forgot' ? 0 : 0.08))),
    lastReviewedAt: now,
    nextReviewAt: now + days * 24 * 60 * 60 * 1000,
  }
}

export function dueMemoryNodes(nodes: MemoryNode[], now = Date.now()): MemoryNode[] {
  return nodes.filter((node) => node.nextReviewAt !== undefined && node.nextReviewAt <= now)
}
