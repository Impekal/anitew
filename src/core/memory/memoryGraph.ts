/**
 * Der Memory-Graph (V2 · D-036).
 *
 * Der Kern des persönlichen Gedächtnissystems: **echte** Informationen aus
 * dem Leben des Menschen — Personen, Orte, Fakten — als Knoten, ihre
 * Zusammengehörigkeit als Kanten. Kein Spielinhalt: Was hier steht, hat
 * der Mensch selbst hineingelegt und bestätigt.
 *
 * Zwei Währungen, sauber getrennt (R-1):
 *
 * - **`strength`** ist eine *Trainings*größe: Sie steigt mit gelungenem
 *   Abruf und sinkt mit misslungenem. Sie sagt, wo Üben lohnt — sie ist
 *   **keine** Aussage über das Gedächtnis des Menschen. Die macht weiter
 *   allein die Messung (F).
 * - **Terminplanung bleibt FSRS.** Der Graph weiß, *was* zusammengehört
 *   und *wo* es wackelt; *wann* etwas wiederkommt, entscheidet der
 *   bestehende Wiederholungsplan.
 *
 * Deterministisch wie der ganze Kern (D-010): Zeitpunkte werden
 * hereingereicht, nie gezogen — dieselbe Eingabe, derselbe Graph.
 */

export type MemoryNodeType = 'person' | 'place' | 'fact' | 'number' | 'date' | 'concept' | 'custom'

export type MemoryRelation = 'association' | 'sequence' | 'context' | 'contrast' | 'custom'

export interface MemoryNode {
  readonly id: string
  readonly type: MemoryNodeType
  readonly label: string
  readonly detail?: string
  /** Millisekunden seit 1970 — hereingereicht, nie hier gezogen. */
  readonly createdAt: number
  /** Trainingsstärke 0..1 — Übungsstand, keine Gedächtnisaussage (R-1). */
  readonly strength: number
  readonly lastRecalledAt?: number
}

export interface MemoryEdge {
  readonly id: string
  readonly from: string
  readonly to: string
  readonly relation: MemoryRelation
  readonly createdAt: number
}

export interface MemoryGraph {
  readonly nodes: readonly MemoryNode[]
  readonly edges: readonly MemoryEdge[]
}

const clamp = (value: number) => Math.max(0, Math.min(1, value))

/** Anfangsstärke: „gerade gemerkt“ — niedrig, ehrlich, mit Luft nach oben. */
export const INITIAL_STRENGTH = 0.2
/** Ein gelungener Abruf hebt um ein Stück … */
export const REINFORCE_STEP = 0.12
/** … ein misslungener senkt stärker: Verlorenes braucht mehr Zuwendung. */
export const WEAKEN_STEP = 0.18

export function createMemoryGraph(): MemoryGraph {
  return { nodes: [], edges: [] }
}

/** Eine stabile Kennung aus Art und Beschriftung — zweimal „Daniel“ ist einmal Daniel. */
export function memoryNodeId(type: MemoryNodeType, label: string): string {
  return `${type}:${label.trim().toLocaleLowerCase().replace(/\s+/gu, '-')}`
}

export function addMemoryNode(
  graph: MemoryGraph,
  input: { id: string; type: MemoryNodeType; label: string; detail?: string; strength?: number },
  now: number,
): MemoryGraph {
  if (graph.nodes.some((node) => node.id === input.id)) return graph
  const node: MemoryNode = {
    id: input.id,
    type: input.type,
    label: input.label,
    ...(input.detail === undefined ? {} : { detail: input.detail }),
    createdAt: now,
    strength: clamp(input.strength ?? INITIAL_STRENGTH),
  }
  return { ...graph, nodes: [...graph.nodes, node] }
}

export function connectMemoryNodes(
  graph: MemoryGraph,
  input: { from: string; to: string; relation: MemoryRelation },
  now: number,
): MemoryGraph {
  if (input.from === input.to) return graph
  const known = new Set(graph.nodes.map((node) => node.id))
  if (!known.has(input.from) || !known.has(input.to)) return graph
  if (
    graph.edges.some(
      (edge) => edge.from === input.from && edge.to === input.to && edge.relation === input.relation,
    )
  ) {
    return graph
  }
  const edge: MemoryEdge = {
    id: `${input.from}→${input.to}:${input.relation}`,
    from: input.from,
    to: input.to,
    relation: input.relation,
    createdAt: now,
  }
  return { ...graph, edges: [...graph.edges, edge] }
}

/** Entfernt einen Knoten **und** alle seine Kanten — halbe Kanten gibt es nicht. */
export function removeMemoryNode(graph: MemoryGraph, nodeId: string): MemoryGraph {
  return {
    nodes: graph.nodes.filter((node) => node.id !== nodeId),
    edges: graph.edges.filter((edge) => edge.from !== nodeId && edge.to !== nodeId),
  }
}

export function reinforceMemoryNode(graph: MemoryGraph, nodeId: string, now: number): MemoryGraph {
  return {
    ...graph,
    nodes: graph.nodes.map((node) =>
      node.id === nodeId
        ? { ...node, strength: clamp(node.strength + REINFORCE_STEP), lastRecalledAt: now }
        : node,
    ),
  }
}

/** Ein misslungener Abruf: Die Stärke sinkt — die Auswahl übt es bevorzugt. */
export function weakenMemoryNode(graph: MemoryGraph, nodeId: string, now: number): MemoryGraph {
  return {
    ...graph,
    nodes: graph.nodes.map((node) =>
      node.id === nodeId
        ? { ...node, strength: clamp(node.strength - WEAKEN_STEP), lastRecalledAt: now }
        : node,
    ),
  }
}

export function graphConnectionCount(graph: MemoryGraph): number {
  return graph.edges.length
}

export function graphStrength(graph: MemoryGraph): number {
  if (graph.nodes.length === 0) return 0
  return graph.nodes.reduce((sum, node) => sum + node.strength, 0) / graph.nodes.length
}

/** Die Kanten, die von einem Knoten ausgehen. */
export function edgesFrom(graph: MemoryGraph, nodeId: string): readonly MemoryEdge[] {
  return graph.edges.filter((edge) => edge.from === nodeId)
}

export function nodeById(graph: MemoryGraph, nodeId: string): MemoryNode | undefined {
  return graph.nodes.find((node) => node.id === nodeId)
}

/** Aufsteigend nach Stärke — vorn steht, was am meisten Zuwendung braucht. */
export function nodesByStrength(graph: MemoryGraph): readonly MemoryNode[] {
  return [...graph.nodes].sort((a, b) => a.strength - b.strength || a.createdAt - b.createdAt)
}

/** Absteigend nach Alter — vorn das zuletzt Hinzugefügte. */
export function latestNodes(graph: MemoryGraph, count: number): readonly MemoryNode[] {
  return [...graph.nodes].sort((a, b) => b.createdAt - a.createdAt).slice(0, count)
}

/**
 * Vereinigung zweier Graphen — die Regel der Sicherung (N9): nie löschen,
 * bei zwei Fassungen desselben Knotens gewinnt die **längere Geschichte**
 * (ältestes createdAt, jüngstes lastRecalledAt, höhere Stärke). Zwei
 * Geräte, die getrennt liefen, haben beide recht.
 */
export function mergeMemoryGraph(mine: MemoryGraph, theirs: MemoryGraph): MemoryGraph {
  const nodes = new Map<string, MemoryNode>()
  for (const node of [...mine.nodes, ...theirs.nodes]) {
    const existing = nodes.get(node.id)
    if (existing === undefined) {
      nodes.set(node.id, node)
      continue
    }
    const lastRecalledAt = [existing.lastRecalledAt, node.lastRecalledAt]
      .filter((at): at is number => at !== undefined)
      .sort((a, b) => b - a)[0]
    const detail = existing.detail ?? node.detail
    nodes.set(node.id, {
      ...existing,
      createdAt: Math.min(existing.createdAt, node.createdAt),
      strength: Math.max(existing.strength, node.strength),
      ...(lastRecalledAt === undefined ? {} : { lastRecalledAt }),
      ...(detail === undefined ? {} : { detail }),
    })
  }

  const edges = new Map<string, MemoryEdge>()
  for (const edge of [...mine.edges, ...theirs.edges]) {
    if (!nodes.has(edge.from) || !nodes.has(edge.to)) continue
    const existing = edges.get(edge.id)
    edges.set(
      edge.id,
      existing === undefined
        ? edge
        : { ...existing, createdAt: Math.min(existing.createdAt, edge.createdAt) },
    )
  }

  return { nodes: [...nodes.values()], edges: [...edges.values()] }
}

/**
 * Liest einen Graphen aus Unbekanntem — Einstellungen können aus einer
 * Sicherung kommen, und eine Sicherung kann alles enthalten. Kaputte
 * Knoten fallen heraus; Kanten ohne beide Enden auch.
 */
export function readMemoryGraph(raw: unknown): MemoryGraph {
  if (typeof raw !== 'object' || raw === null) return createMemoryGraph()
  const candidate = raw as { nodes?: unknown; edges?: unknown }
  const nodes = (Array.isArray(candidate.nodes) ? candidate.nodes : []).filter(
    (node): node is MemoryNode =>
      typeof node === 'object' &&
      node !== null &&
      typeof (node as MemoryNode).id === 'string' &&
      typeof (node as MemoryNode).label === 'string' &&
      typeof (node as MemoryNode).type === 'string' &&
      typeof (node as MemoryNode).createdAt === 'number' &&
      typeof (node as MemoryNode).strength === 'number',
  )
  const known = new Set(nodes.map((node) => node.id))
  const edges = (Array.isArray(candidate.edges) ? candidate.edges : []).filter(
    (edge): edge is MemoryEdge =>
      typeof edge === 'object' &&
      edge !== null &&
      typeof (edge as MemoryEdge).id === 'string' &&
      typeof (edge as MemoryEdge).from === 'string' &&
      typeof (edge as MemoryEdge).to === 'string' &&
      typeof (edge as MemoryEdge).createdAt === 'number' &&
      known.has((edge as MemoryEdge).from) &&
      known.has((edge as MemoryEdge).to),
  )
  return { nodes, edges }
}
