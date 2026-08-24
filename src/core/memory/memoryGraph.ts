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
 *   bestehende Wiederholungsplan. Ein optionaler `neededByAt`-Zeitpunkt
 *   (I5) darf diesen Plan nur vorziehen und danach beenden — er ersetzt ihn
 *   nicht.
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
  /** Optionales reales Ziel (I5): bis wann dieser Inhalt gebraucht wird. */
  readonly neededByAt?: number
  /** Konfliktauflösung für Geräteabgleich: jüngste bewusste Deadline-Änderung gewinnt. */
  readonly neededByUpdatedAt?: number
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
  /**
   * Grabsteine: Kennung → Zeitpunkt des Entfernens. Ohne sie brächte die
   * Vereinigung (N9) jedes bewusst Entfernte vom anderen Gerät zurück.
   * Ein Grabstein weicht nur einem **jüngeren** Lebenszeichen — wer etwas
   * nach dem Entfernen neu merkt oder abruft, hat es zurückgeholt.
   */
  readonly removed: Readonly<Record<string, number>>
}

const clamp = (value: number) => Math.max(0, Math.min(1, value))

/** Anfangsstärke: „gerade gemerkt“ — niedrig, ehrlich, mit Luft nach oben. */
export const INITIAL_STRENGTH = 0.2
/** Ein gelungener Abruf hebt um ein Stück … */
export const REINFORCE_STEP = 0.12
/** … ein misslungener senkt stärker: Verlorenes braucht mehr Zuwendung. */
export const WEAKEN_STEP = 0.18

export function createMemoryGraph(): MemoryGraph {
  return { nodes: [], edges: [], removed: {} }
}

/** Eine stabile Kennung aus Art und Beschriftung — zweimal „Daniel“ ist einmal Daniel. */
export function memoryNodeId(type: MemoryNodeType, label: string): string {
  return `${type}:${label.trim().toLocaleLowerCase().replace(/\s+/gu, '-')}`
}

export function addMemoryNode(
  graph: MemoryGraph,
  input: {
    id: string
    type: MemoryNodeType
    label: string
    detail?: string
    strength?: number
    neededByAt?: number
  },
  now: number,
): MemoryGraph {
  const existing = graph.nodes.find((node) => node.id === input.id)
  if (existing !== undefined) {
    if (input.neededByAt === undefined || existing.neededByAt === input.neededByAt) return graph
    return {
      ...graph,
      nodes: graph.nodes.map((node) =>
        node.id === input.id
          ? { ...node, neededByAt: input.neededByAt, neededByUpdatedAt: now }
          : node,
      ),
    }
  }

  const node: MemoryNode = {
    id: input.id,
    type: input.type,
    label: input.label,
    ...(input.detail === undefined ? {} : { detail: input.detail }),
    createdAt: now,
    strength: clamp(input.strength ?? INITIAL_STRENGTH),
    ...(input.neededByAt === undefined
      ? {}
      : { neededByAt: input.neededByAt, neededByUpdatedAt: now }),
  }
  // Neu gemerkt hebt den Grabstein auf — der Mensch hat es zurückgeholt.
  const removed = { ...graph.removed }
  delete removed[input.id]
  return { ...graph, nodes: [...graph.nodes, node], removed }
}

/**
 * Setzt oder entfernt eine reale Deadline für bestehende Knoten.
 * `now` ist Teil des Zustands, damit N9 beim Geräteabgleich die jüngste
 * bewusste Änderung bestimmen kann statt zufällig eine Fassung zu wählen.
 */
export function setMemoryDeadline(
  graph: MemoryGraph,
  nodeIds: readonly string[],
  neededByAt: number | undefined,
  now: number,
): MemoryGraph {
  const ids = new Set(nodeIds)
  let changed = false
  const nodes = graph.nodes.map((node) => {
    if (!ids.has(node.id)) return node
    if (node.neededByAt === neededByAt && node.neededByUpdatedAt === now) return node
    changed = true
    if (neededByAt === undefined) {
      const { neededByAt: _old, ...withoutDeadline } = node
      return { ...withoutDeadline, neededByUpdatedAt: now }
    }
    return { ...node, neededByAt, neededByUpdatedAt: now }
  })
  return changed ? { ...graph, nodes } : graph
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

/**
 * Entfernt einen Knoten **und** alle seine Kanten — halbe Kanten gibt es
 * nicht. Zurück bleibt ein Grabstein, damit die Vereinigung mit einem
 * anderen Gerät das Entfernte nicht wieder hereinträgt.
 */
export function removeMemoryNode(graph: MemoryGraph, nodeId: string, now: number): MemoryGraph {
  return {
    nodes: graph.nodes.filter((node) => node.id !== nodeId),
    edges: graph.edges.filter((edge) => edge.from !== nodeId && edge.to !== nodeId),
    removed: { ...graph.removed, [nodeId]: now },
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

/** Die Kanten, die von diesem Knoten ausgehen. */
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
 * Vereinigung zweier Graphen — die Regel der Sicherung (N9): nie stumm
 * löschen, bei zwei Fassungen desselben Knotens gewinnt die **längere
 * Geschichte** (ältestes createdAt, jüngstes lastRecalledAt, höhere
 * Stärke). Zwei Geräte, die getrennt liefen, haben beide recht — mit
 * einer Ausnahme: Ein Grabstein schlägt jedes **ältere** Lebenszeichen
 * (Entfernen war eine bewusste Tat), und ein jüngeres Lebenszeichen —
 * neu gemerkt oder nach dem Entfernen abgerufen — räumt den Grabstein weg.
 *
 * Die I5-Deadline ist bewusst kein Teil dieser „längeren Geschichte“:
 * dort gewinnt die Fassung mit dem jüngeren `neededByUpdatedAt`, damit eine
 * Terminänderung auf Gerät B nicht durch eine ältere Sicherung zurückspringt.
 */
export function mergeMemoryGraph(mine: MemoryGraph, theirs: MemoryGraph): MemoryGraph {
  const removed = new Map<string, number>()
  for (const [id, at] of [...Object.entries(mine.removed), ...Object.entries(theirs.removed)]) {
    const existing = removed.get(id)
    removed.set(id, existing === undefined ? at : Math.max(existing, at))
  }

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
    const deadlineSource =
      (node.neededByUpdatedAt ?? -1) > (existing.neededByUpdatedAt ?? -1) ? node : existing
    const base: MemoryNode = {
      ...existing,
      createdAt: Math.min(existing.createdAt, node.createdAt),
      strength: Math.max(existing.strength, node.strength),
      ...(lastRecalledAt === undefined ? {} : { lastRecalledAt }),
      ...(detail === undefined ? {} : { detail }),
    }
    const withoutDeadline: MemoryNode = (() => {
      const { neededByAt: _at, neededByUpdatedAt: _updated, ...rest } = base
      return rest
    })()
    nodes.set(node.id, {
      ...withoutDeadline,
      ...(deadlineSource.neededByAt === undefined ? {} : { neededByAt: deadlineSource.neededByAt }),
      ...(deadlineSource.neededByUpdatedAt === undefined
        ? {}
        : { neededByUpdatedAt: deadlineSource.neededByUpdatedAt }),
    })
  }

  // Grabstein gegen Lebenszeichen: Bei Gleichstand gewinnt das Entfernen.
  for (const [id, at] of removed) {
    const node = nodes.get(id)
    if (node === undefined) continue
    const lastSign = Math.max(node.createdAt, node.lastRecalledAt ?? 0, node.neededByUpdatedAt ?? 0)
    if (lastSign > at) removed.delete(id)
    else nodes.delete(id)
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

  return {
    nodes: [...nodes.values()],
    edges: [...edges.values()],
    removed: Object.fromEntries(removed),
  }
}

/**
 * Liest einen Graphen aus Unbekanntem — Einstellungen können aus einer
 * Sicherung kommen, und eine Sicherung kann alles enthalten. Kaputte
 * Knoten fallen heraus; Kanten ohne beide Enden auch.
 */
export function readMemoryGraph(raw: unknown): MemoryGraph {
  if (typeof raw !== 'object' || raw === null) return createMemoryGraph()
  const candidate = raw as { nodes?: unknown; edges?: unknown; removed?: unknown }
  const nodes = (Array.isArray(candidate.nodes) ? candidate.nodes : [])
    .filter(
      (node): node is MemoryNode =>
        typeof node === 'object' &&
        node !== null &&
        typeof (node as MemoryNode).id === 'string' &&
        typeof (node as MemoryNode).label === 'string' &&
        typeof (node as MemoryNode).type === 'string' &&
        typeof (node as MemoryNode).createdAt === 'number' &&
        typeof (node as MemoryNode).strength === 'number',
    )
    .map((node) => ({
      ...node,
      ...(typeof node.neededByAt === 'number' ? { neededByAt: node.neededByAt } : {}),
      ...(typeof node.neededByUpdatedAt === 'number'
        ? { neededByUpdatedAt: node.neededByUpdatedAt }
        : {}),
    }))
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
  // Ältere Stände (vor den Grabsteinen) tragen keine — das ist ein leeres Feld.
  const removed =
    typeof candidate.removed === 'object' && candidate.removed !== null
      ? Object.fromEntries(
          Object.entries(candidate.removed as Record<string, unknown>).filter(
            (entry): entry is [string, number] => typeof entry[1] === 'number',
          ),
        )
      : {}
  return { nodes, edges, removed }
}
