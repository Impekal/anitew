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
 *   bestehende Wiederholungsplan. Eine optionale I5-Deadline darf diesen
 *   Plan nur vorziehen und danach beenden — sie ersetzt ihn nicht.
 *
 * Deterministisch wie der ganze Kern (D-010): Zeitpunkte werden
 * hereingereicht, nie gezogen — dieselbe Eingabe, derselbe Graph.
 */

import type { DayKey } from '../time.ts'

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
  /** Optionales reales Ziel (I5): exakter Zeitpunkt, bis wann es gebraucht wird. */
  readonly neededByAt?: number
  /** Lokaler Kalendertag desselben Ziels — stabile Grenze für den Tagesplan (P6). */
  readonly neededByDay?: DayKey
  /** Konfliktauflösung für Geräteabgleich: jüngste bewusste Deadline-Änderung gewinnt. */
  readonly neededByUpdatedAt?: number
  /**
   * Wann Name oder Beschreibung zuletzt bewusst berichtigt wurden
   * (Nutzerwunsch 02.09.) — dieselbe Konfliktauflösung wie oben.
   *
   * Ändert eine Berichtigung die Kennung, trägt sie sich beim Abgleich von
   * selbst weiter: neuer Knoten, Grabstein auf dem alten. Eine Berichtigung
   * der Groß-/Kleinschreibung oder der Beschreibung lässt die Kennung
   * dagegen stehen — ohne Marke gewönne stur der lokale Knoten, und die
   * Änderung käme beim zweiten Gerät nie an. Fehlt die Marke auf beiden
   * Seiten (alle Knoten von vor dem 02.09.), bleibt es beim Alten.
   */
  readonly editedAt?: number
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
  const removed = { ...graph.removed }
  delete removed[input.id]
  return { ...graph, nodes: [...graph.nodes, node], removed }
}

export function setMemoryDeadline(
  graph: MemoryGraph,
  nodeIds: readonly string[],
  deadline: { at: number; day: DayKey } | undefined,
  now: number,
): MemoryGraph {
  const ids = new Set(nodeIds)
  let changed = false
  const nodes = graph.nodes.map((node) => {
    if (!ids.has(node.id)) return node
    if (
      deadline !== undefined &&
      node.neededByAt === deadline.at &&
      node.neededByDay === deadline.day
    ) {
      return node
    }
    changed = true
    const { neededByAt: _at, neededByDay: _day, ...withoutDeadline } = node
    return deadline === undefined
      ? { ...withoutDeadline, neededByUpdatedAt: now }
      : {
          ...withoutDeadline,
          neededByAt: deadline.at,
          neededByDay: deadline.day,
          neededByUpdatedAt: now,
        }
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
 * Berichtigt den Namen eines Begriffs — und wirft dabei nichts weg
 * (Nutzerwunsch 02.09.: „vielleicht hat man ihn auch nur falsch geschrieben").
 *
 * Zwei Fälle, und der Unterschied ist die Kennung:
 *
 * 1. **Dieselbe Kennung.** `memoryNodeId` schreibt klein und ersetzt
 *    Leerzeichen; „daniel" → „Daniel" ändert deshalb nur die Anzeige. Nichts
 *    zieht um, kein Grabstein — es gibt nichts zu vermelden.
 * 2. **Neue Kennung.** Der Begriff behält seinen Verlauf (wann angelegt, wie
 *    stark, wann zuletzt abgerufen, sein Ziel) und bekommt ihn unter der
 *    neuen Kennung. Alle Verbindungen zeigen mit um und behalten, seit wann
 *    es sie gibt. Die alte Kennung wird zum Grabstein, sonst brächte das
 *    zweite Gerät den alten Namen beim nächsten Abgleich zurück.
 *
 * **Zusammenlegen ist etwas anderes als berichtigen.** Trägt schon ein
 * anderer Begriff die neue Kennung, geschieht nichts: Zwei Verläufe zu einem
 * zu verschmelzen ist eine Entscheidung, die niemand nebenbei über einen
 * Tippfehler treffen sollte.
 */
export function renameMemoryNode(
  graph: MemoryGraph,
  nodeId: string,
  nextLabel: string,
  now: number,
): MemoryGraph {
  const label = nextLabel.trim()
  const node = graph.nodes.find((entry) => entry.id === nodeId)
  if (node === undefined || label === '') return graph

  const nextId = memoryNodeId(node.type, label)
  if (nextId === nodeId) {
    return {
      ...graph,
      nodes: graph.nodes.map((entry) =>
        entry.id === nodeId ? { ...entry, label, editedAt: now } : entry,
      ),
    }
  }
  if (graph.nodes.some((entry) => entry.id === nextId)) return graph

  const umgezogen = (id: string) => (id === nodeId ? nextId : id)
  /*
   * Einen Grabstein auf dem **neuen** Namen lösen — sonst stirbt der Begriff
   * beim nächsten Abgleich.
   *
   * Wer „Danile" zu „Daniel" berichtigt und es sich anders überlegt, landet
   * wieder auf einer Kennung, die inzwischen einen Grabstein trägt. Der
   * Begriff behält beim Umzug sein Entstehungsdatum, und das ist älter als
   * der Grabstein — die Vereinigung würde ihn also wegräumen. `addMemoryNode`
   * löst den Grabstein aus demselben Grund.
   */
  const removed = { ...graph.removed, [nodeId]: now }
  delete removed[nextId]
  return {
    ...graph,
    nodes: graph.nodes.map((entry) =>
      entry.id === nodeId ? { ...entry, id: nextId, label, editedAt: now } : entry,
    ),
    edges: graph.edges.map((edge) => {
      if (edge.from !== nodeId && edge.to !== nodeId) return edge
      const from = umgezogen(edge.from)
      const to = umgezogen(edge.to)
      return { ...edge, id: `${from}→${to}:${edge.relation}`, from, to }
    }),
    removed,
  }
}

/** Ändert die Beschreibung eines Begriffs. Leer heißt: keine mehr. */
export function setMemoryDetail(
  graph: MemoryGraph,
  nodeId: string,
  detail: string,
  now: number,
): MemoryGraph {
  const text = detail.trim()
  return {
    ...graph,
    nodes: graph.nodes.map((entry) => {
      if (entry.id !== nodeId) return entry
      // Erst weg, dann neu: Sonst bliebe eine geleerte Beschreibung stehen.
      const { detail: _weg, ...ohne } = entry
      const berichtigt = { ...ohne, editedAt: now }
      return text === '' ? berichtigt : { ...berichtigt, detail: text }
    }),
  }
}

/**
 * Berichtigt die **Art** einer Verbindung.
 *
 * Die Kennung einer Verbindung enthält ihre Art (`von→nach:art`), eine
 * Änderung ergibt also eine neue Kennung. Seit wann es die Verbindung gibt,
 * bleibt: Wer „Assoziation" in „Reihenfolge" ändert, korrigiert eine Angabe
 * und knüpft nicht neu. Die alte Kennung wird zum Grabstein.
 */
export function editMemoryEdge(
  graph: MemoryGraph,
  edgeId: string,
  relation: MemoryRelation,
  now: number,
): MemoryGraph {
  const edge = graph.edges.find((entry) => entry.id === edgeId)
  if (edge === undefined || edge.relation === relation) return graph

  const nextId = `${edge.from}→${edge.to}:${relation}`
  if (graph.edges.some((entry) => entry.id === nextId)) return graph

  // Wie beim Umbenennen: Ein Grabstein auf der neuen Kennung muss weichen.
  // Die Verbindung behält ihr Entstehungsdatum, ist also älter als er.
  const removed = { ...graph.removed, [edgeId]: now }
  delete removed[nextId]
  return {
    ...graph,
    edges: graph.edges.map((entry) =>
      entry.id === edgeId ? { ...entry, id: nextId, relation } : entry,
    ),
    removed,
  }
}

/**
 * Nimmt **eine** Verbindung weg und lässt beide Begriffe stehen.
 *
 * Bisher gab es nur „Begriff weg", und der nahm seine Verbindungen mit. Wer
 * eine falsch gezogene Linie loswerden wollte, musste einen Begriff opfern.
 */
export function disconnectMemoryNodes(
  graph: MemoryGraph,
  edgeId: string,
  now: number,
): MemoryGraph {
  if (!graph.edges.some((edge) => edge.id === edgeId)) return graph
  return {
    ...graph,
    edges: graph.edges.filter((edge) => edge.id !== edgeId),
    removed: { ...graph.removed, [edgeId]: now },
  }
}

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

export function edgesFrom(graph: MemoryGraph, nodeId: string): readonly MemoryEdge[] {
  return graph.edges.filter((edge) => edge.from === nodeId)
}

export function nodeById(graph: MemoryGraph, nodeId: string): MemoryNode | undefined {
  return graph.nodes.find((node) => node.id === nodeId)
}

export function nodesByStrength(graph: MemoryGraph): readonly MemoryNode[] {
  return [...graph.nodes].sort((a, b) => a.strength - b.strength || a.createdAt - b.createdAt)
}

export function latestNodes(graph: MemoryGraph, count: number): readonly MemoryNode[] {
  return [...graph.nodes].sort((a, b) => b.createdAt - a.createdAt).slice(0, count)
}

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
    /*
     * Name und Beschreibung folgen der jüngeren Berichtigung (02.09.).
     *
     * Trägt keine Seite eine Marke — alles, was vor dem Berichtigen entstanden
     * ist —, gilt weiter die alte Regel: der lokale Name, und eine
     * Beschreibung geht nicht verloren, wenn nur eine Seite eine hat. Sobald
     * jemand bewusst berichtigt hat, zählt seine Fassung; auch die geleerte
     * Beschreibung, denn Leeren ist ebenfalls eine Entscheidung.
     */
    const editSource = (node.editedAt ?? -1) > (existing.editedAt ?? -1) ? node : existing
    const unberuehrt = existing.editedAt === undefined && node.editedAt === undefined
    const detail = unberuehrt ? (existing.detail ?? node.detail) : editSource.detail
    const editedAt = editSource.editedAt
    const deadlineSource =
      (node.neededByUpdatedAt ?? -1) > (existing.neededByUpdatedAt ?? -1) ? node : existing
    const base: MemoryNode = {
      ...existing,
      label: unberuehrt ? existing.label : editSource.label,
      createdAt: Math.min(existing.createdAt, node.createdAt),
      strength: Math.max(existing.strength, node.strength),
      ...(lastRecalledAt === undefined ? {} : { lastRecalledAt }),
      ...(detail === undefined ? {} : { detail }),
      ...(editedAt === undefined ? {} : { editedAt }),
    }
    const { neededByAt: _at, neededByDay: _day, neededByUpdatedAt: _updated, ...withoutDeadline } = base
    // Eine bewusst geleerte Beschreibung darf nicht aus `...existing`
    // zurückkommen — deshalb hier entfernen und oben nur Gültiges setzen.
    if (detail === undefined) delete (withoutDeadline as { detail?: string }).detail
    nodes.set(node.id, {
      ...withoutDeadline,
      ...(deadlineSource.neededByAt === undefined ? {} : { neededByAt: deadlineSource.neededByAt }),
      ...(deadlineSource.neededByDay === undefined ? {} : { neededByDay: deadlineSource.neededByDay }),
      ...(deadlineSource.neededByUpdatedAt === undefined
        ? {}
        : { neededByUpdatedAt: deadlineSource.neededByUpdatedAt }),
    })
  }

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

  /*
   * Grabsteine gelten auch für Verbindungen (Nutzerwunsch 02.09.).
   *
   * Bisher wirkten sie nur auf Begriffe — Verbindungen ließen sich ja gar
   * nicht einzeln entfernen. Seit man das kann, und seit eine Berichtigung
   * ihrer Art die alte Kennung zurücklässt, muss dieselbe Regel gelten:
   * Ein Grabstein weicht nur einem **jüngeren** Lebenszeichen. Bei einer
   * Verbindung ist das ihr Entstehen — wer sie nach dem Entfernen bewusst
   * neu zieht, hat sie zurückgeholt.
   *
   * Ohne das brächte das zweite Gerät jede weggeworfene Linie und jede alte
   * Art beim nächsten Abgleich wieder mit, und zwar für immer.
   */
  for (const [id, at] of removed) {
    const edge = edges.get(id)
    if (edge === undefined) continue
    if (edge.createdAt > at) removed.delete(id)
    else edges.delete(id)
  }

  return {
    nodes: [...nodes.values()],
    edges: [...edges.values()],
    removed: Object.fromEntries(removed),
  }
}

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
    .map((node) => {
      /*
       * Das Spreizen eines fremden Objekts vor der Prüfung würde ungültige
       * optionale Felder versehentlich wieder mitnehmen. Deshalb werden die
       * drei I5-Felder zuerst entfernt und nur validierte Werte zurückgesetzt.
       */
      const {
        neededByAt,
        neededByDay,
        neededByUpdatedAt,
        editedAt,
        ...withoutDeadline
      } = node
      const validDay =
        typeof neededByDay === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(neededByDay)
          ? (neededByDay as DayKey)
          : undefined
      return {
        ...withoutDeadline,
        ...(typeof neededByAt === 'number' && Number.isFinite(neededByAt) ? { neededByAt } : {}),
        ...(validDay === undefined ? {} : { neededByDay: validDay }),
        ...(typeof neededByUpdatedAt === 'number' && Number.isFinite(neededByUpdatedAt)
          ? { neededByUpdatedAt }
          : {}),
        ...(typeof editedAt === 'number' && Number.isFinite(editedAt) ? { editedAt } : {}),
      }
    })
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
