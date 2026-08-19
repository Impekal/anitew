import type { MemoryNode } from './MemoryTypes.ts'
import { buildRecallPrompts, type RecallPrompt } from './RecallEngine.ts'

export type MissionStep = RecallPrompt & { order: number }

export type MemoryMission = {
  id: string
  title: string
  subtitle: string
  steps: MissionStep[]
  createdAt: number
}

export function composeMemoryMission(nodes: MemoryNode[], limit = 5): MemoryMission | null {
  const candidates = nodes
    .filter((node) => node.title.trim())
    .sort((a, b) => (a.nextReviewAt ?? 0) - (b.nextReviewAt ?? 0) || a.strength - b.strength)
    .slice(0, limit)

  if (!candidates.length) return null

  const steps: MissionStep[] = candidates.flatMap((node) => buildRecallPrompts(node).slice(0, 1))
    .map((prompt, index) => ({ ...prompt, order: index + 1 }))

  return {
    id: crypto.randomUUID(),
    title: candidates.length === 1 ? 'One thing worth remembering' : 'Your memory mission',
    subtitle: `${candidates.length} memories selected for active recall.`,
    steps,
    createdAt: Date.now(),
  }
}
