import type { DayKey } from '../time.ts'
import type { DueItem } from '../scheduler/due.ts'
import { selectDue } from '../scheduler/due.ts'
import type { MemoryGraph, MemoryNode } from './memoryGraph.ts'
import { memoryNodeIdOfItem } from './missionComposer.ts'
import { memoryClusters } from './memoryWorld.ts'

export const MEMORY_DAY_MS = 24 * 60 * 60 * 1_000
export const MEMORY_AFTERGLOW_WINDOW_MS = 15 * 60 * 1_000

export interface MemoryReencounter {
  readonly node: MemoryNode
  readonly daysAway: number
  readonly firstReturn: boolean
  readonly worldAnchor?: MemoryNode
  readonly worldSize: number
}

export interface MemoryAfterglow {
  readonly anchor: MemoryNode
  readonly recalled: readonly MemoryNode[]
  readonly lastRecalledAt: number
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

/**
 * Die kurze Reaktion nach einem echten persönlichen Abruf.
 *
 * Es wird nichts gespeichert und nichts hochgezählt. Wir schauen nur in das,
 * was `applyMemoryOutcome` ohnehin gerade in den Graphen geschrieben hat:
 * Welche Knoten wurden in den letzten Minuten tatsächlich abgerufen? Wenn
 * mehrere davon zur selben Memory World gehören, zeigt der Afterglow deren
 * stabilen Anker. Damit fühlt sich die Welt reaktiv an, ohne eine zweite
 * Fortschrittswährung einzuführen.
 */
export function memoryAfterglow(input: {
  graph: MemoryGraph
  now: number
  windowMs?: number
}): MemoryAfterglow | undefined {
  const windowMs = input.windowMs ?? MEMORY_AFTERGLOW_WINDOW_MS
  const recent = input.graph.nodes.filter(
    (node) =>
      node.lastRecalledAt !== undefined &&
      input.now >= node.lastRecalledAt &&
      input.now - node.lastRecalledAt <= windowMs,
  )
  if (recent.length === 0) return undefined

  const recentIds = new Set(recent.map((node) => node.id))
  const worlds = memoryClusters(input.graph)
    .map((world) => ({
      world,
      recalled: world.nodes.filter((node) => recentIds.has(node.id)),
    }))
    .filter((entry) => entry.recalled.length > 0)
    .sort((a, b) => {
      const count = b.recalled.length - a.recalled.length
      if (count !== 0) return count
      const latestA = Math.max(...a.recalled.map((node) => node.lastRecalledAt ?? 0))
      const latestB = Math.max(...b.recalled.map((node) => node.lastRecalledAt ?? 0))
      return latestB - latestA || a.world.id.localeCompare(b.world.id)
    })

  const selected = worlds[0]
  if (selected === undefined) return undefined
  return {
    anchor: selected.world.anchor,
    recalled: selected.recalled,
    lastRecalledAt: Math.max(...selected.recalled.map((node) => node.lastRecalledAt ?? 0)),
  }
}
