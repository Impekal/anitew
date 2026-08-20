import type { DayKey } from '../time.ts'
import type { DueItem } from '../scheduler/due.ts'
import { selectDue } from '../scheduler/due.ts'
import type { MemoryGraph, MemoryNode } from './memoryGraph.ts'
import { memoryNodeIdOfItem } from './missionComposer.ts'

export const RECENT_MEMORY_WINDOW_MS = 24 * 60 * 60 * 1_000
export const STALE_MEMORY_WINDOW_MS = 21 * RECENT_MEMORY_WINDOW_MS

export type MemoryPulseSignal =
  | { kind: 'attention'; count: number }
  | { kind: 'practiced'; count: number }
  | { kind: 'new'; count: number }
  | { kind: 'stale'; node: MemoryNode }
  | { kind: 'quiet' }

export function memoryPulse(input: {
  graph: MemoryGraph
  due: readonly DueItem[]
  today: DayKey
  now: number
}): readonly MemoryPulseSignal[] {
  const known = new Set(input.graph.nodes.map((node) => node.id))
  const dueIds = new Set(
    selectDue(input.due, input.today, Number.MAX_SAFE_INTEGER)
      .map((item) => memoryNodeIdOfItem(item.itemId.split(':').slice(2).join(':')))
      .filter((id): id is string => id !== undefined && known.has(id)),
  )
  const recent = input.graph.nodes.filter(
    (node) =>
      node.lastRecalledAt !== undefined && input.now - node.lastRecalledAt <= RECENT_MEMORY_WINDOW_MS,
  )
  const fresh = input.graph.nodes.filter(
    (node) => input.now - node.createdAt <= RECENT_MEMORY_WINDOW_MS,
  )
  const stale = [...input.graph.nodes]
    .filter(
      (node) =>
        input.now - (node.lastRecalledAt ?? node.createdAt) >= STALE_MEMORY_WINDOW_MS,
    )
    .sort(
      (a, b) =>
        (a.lastRecalledAt ?? a.createdAt) - (b.lastRecalledAt ?? b.createdAt) ||
        a.id.localeCompare(b.id),
    )[0]

  const signals: MemoryPulseSignal[] = []
  if (dueIds.size > 0) signals.push({ kind: 'attention', count: dueIds.size })
  if (recent.length > 0) signals.push({ kind: 'practiced', count: recent.length })
  if (fresh.length > 0) signals.push({ kind: 'new', count: fresh.length })
  if (stale !== undefined) signals.push({ kind: 'stale', node: stale })
  return signals.length === 0 ? [{ kind: 'quiet' }] : signals.slice(0, 2)
}
