import type { DayKey } from '../time.ts'
import type { DueItem } from '../scheduler/due.ts'
import { selectDue } from '../scheduler/due.ts'
import type { MemoryGraph, MemoryNode } from './memoryGraph.ts'
import { memoryNodeIdOfItem } from './missionComposer.ts'
import { memoryClusters } from './memoryWorld.ts'

export const MEMORY_DAY_MS = 24 * 60 * 60 * 1_000

export interface MemoryReencounter {
  readonly node: MemoryNode
  readonly daysAway: number
  readonly firstReturn: boolean
  readonly worldAnchor?: MemoryNode
  readonly worldSize: number
}

/**
 * Wählt genau eine belegbare Wiederbegegnung für den Startbildschirm.
 *
 * Der Zeitpunkt kommt ausschließlich aus FSRS (`due`). Der Graph liefert nur
 * Identität und Zusammenhang. Damit entsteht kein zweiter Scheduler und auch
 * kein neuer Score: Die Funktion beantwortet nur die Produktfrage
 * „Welche echte Erinnerung kehrt heute zurück — und aus welchem Teil meines
 * Netzes kommt sie?“
 */
export function memoryReencounter(input: {
  graph: MemoryGraph
  due: readonly DueItem[]
  today: DayKey
  now: number
}): MemoryReencounter | undefined {
  const byId = new Map(input.graph.nodes.map((node) => [node.id, node]))
  const seen = new Set<string>()

  const candidate = selectDue(input.due, input.today, Number.MAX_SAFE_INTEGER)
    .map((item) => {
      const payload = item.itemId.split(':').slice(2).join(':')
      const id = memoryNodeIdOfItem(payload)
      if (id === undefined || seen.has(id)) return undefined
      seen.add(id)
      return byId.get(id)
    })
    .find((node): node is MemoryNode => node !== undefined)

  if (candidate === undefined) return undefined

  const lastTouch = candidate.lastRecalledAt ?? candidate.createdAt
  const daysAway = Math.max(0, Math.floor((input.now - lastTouch) / MEMORY_DAY_MS))
  const world = memoryClusters(input.graph).find((cluster) =>
    cluster.nodes.some((node) => node.id === candidate.id),
  )

  return {
    node: candidate,
    daysAway,
    firstReturn: candidate.lastRecalledAt === undefined,
    ...(world !== undefined && world.nodes.length > 1 ? { worldAnchor: world.anchor } : {}),
    worldSize: world?.nodes.length ?? 1,
  }
}
