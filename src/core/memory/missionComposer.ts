import type { MemoryGraph, MemoryNode } from './memoryGraph.ts'

export type MissionStepKind = 'encode' | 'distractor' | 'recall' | 'association' | 'delayed-recall'

export type MissionStep = {
  id: string
  kind: MissionStepKind
  nodeIds: string[]
  durationSeconds: number
  prompt: string
}

export type MemoryMission = {
  id: string
  title: string
  durationSeconds: number
  steps: MissionStep[]
}

function weakest(nodes: MemoryNode[], count: number): MemoryNode[] {
  return [...nodes].sort((a, b) => a.strength - b.strength).slice(0, count)
}

export function composeMemoryMission(graph: MemoryGraph, durationSeconds = 300): MemoryMission {
  const targets = weakest(graph.nodes, Math.min(6, Math.max(2, Math.ceil(graph.nodes.length / 4))))
  const ids = targets.map((node) => node.id)
  const safeDuration = Math.max(60, durationSeconds)
  const steps: MissionStep[] = [
    { id: 'encode', kind: 'encode', nodeIds: ids, durationSeconds: Math.round(safeDuration * 0.22), prompt: 'Build a clear mental picture of these memories.' },
    { id: 'distractor', kind: 'distractor', nodeIds: [], durationSeconds: Math.round(safeDuration * 0.16), prompt: 'Hold what you learned while your attention shifts.' },
    { id: 'recall', kind: 'recall', nodeIds: ids, durationSeconds: Math.round(safeDuration * 0.27), prompt: 'Retrieve the information without looking.' },
    { id: 'association', kind: 'association', nodeIds: ids, durationSeconds: Math.round(safeDuration * 0.18), prompt: 'Strengthen the links between memories.' },
    { id: 'delayed', kind: 'delayed-recall', nodeIds: ids.slice(0, Math.max(1, Math.ceil(ids.length / 2))), durationSeconds: Math.round(safeDuration * 0.17), prompt: 'One final retrieval. What stayed with you?' },
  ]

  return {
    id: `mission:${Date.now()}`,
    title: targets.length ? 'Strengthen your weakest memories' : 'Build your memory system',
    durationSeconds: steps.reduce((sum, step) => sum + step.durationSeconds, 0),
    steps,
  }
}
