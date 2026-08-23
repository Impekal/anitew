/**
 * Der Missions-Komponist (D-036) — angeschlossen, nicht daneben.
 *
 * Er entscheidet, **was** trainiert wird: die schwächsten Erinnerungen
 * zuerst. **Wie** trainiert wird, macht die bestehende Session-Engine —
 * und **wann** etwas wiederkommt, bleibt FSRS. Keine zweite Engine.
 *
 * Die fünf Schritte der Memory-Mission liegen auf der vorhandenen
 * Maschinerie, statt sie zu doppeln:
 *
 *   ENCODE          → der Einprägeblock der Runde (Szene: Anker + Dinge)
 *   DISTRACTOR      → die Runde eines anderen Moduls dazwischen (Rotation)
 *   RECALL          → der gestützte Abruf derselben Runde
 *   ASSOCIATION     → die Frageform selbst: „Anker — was gehört dazu?“
 *   DELAYED RECALL  → das Wiedersehen nach Tagen — das ist FSRS, und es
 *                     ist der einzige ehrliche „delayed recall“
 *
 * Eine Szene wird als **eine Zeichenkette** kodiert (Anker + Dinge,
 * getrennt durch U+001F; jedes abfragbare Stück als Anker U+001E Ding).
 * Dadurch ist jeder Termin selbsttragend: Auch wenn der Graph sich
 * ändert, weiß das Wiedersehen noch, was gefragt war — dieselbe
 * Eigenschaft wie bei den eigenen Karten (D-032). Steuerzeichen können
 * in keiner Beschriftung vorkommen; die Extraktion wäscht sie heraus.
 */

import { type MemoryGraph, type MemoryNode, edgesFrom, nodeById, nodesByStrength } from './memoryGraph.ts'

/** Trennt Anker und Dinge in der Szenen-Kennung. */
export const MEMORY_SCENE_SEPARATOR = '\u001f'
/** Trennt Anker und Ding in der Stück-Kennung. */
export const MEMORY_ITEM_SEPARATOR = '\u001e'
/** Trennt die sichtbare Beschriftung von stabilen Graph-Kennungen. */
export const MEMORY_ID_SEPARATOR = '\u001d'

/** Mehr Szenen je Einheit wären Beschäftigung — der Rest kommt morgen. */
export const MAX_MEMORY_SCENES = 6
/** Mehr als vier Dinge je Anker zerfallen — dann lieber zwei Szenen. */
export const MAX_ITEMS_PER_SCENE = 4

/** Der Anker einer Szenen- oder Stück-Kennung. */
export function memorySubjectOf(item: string): string {
  const end = Math.min(
    ...[item.indexOf(MEMORY_SCENE_SEPARATOR), item.indexOf(MEMORY_ITEM_SEPARATOR)]
      .filter((at) => at >= 0)
      .concat(item.length),
  )
  return item.slice(0, end)
}

/** Die abfragbaren Stücke einer Szenen-Kennung. */
export function memorySceneItems(anchor: string): readonly string[] {
  const [subject, ...targets] = anchor.split(MEMORY_SCENE_SEPARATOR)
  if (subject === undefined || subject === '') return []
  return targets
    .filter((target) => target !== '')
    .map((target) => `${subject}${MEMORY_ITEM_SEPARATOR}${target}`)
}

/** Die gesuchte Antwort eines Stücks. */
export function memoryTargetOf(item: string): string {
  const at = item.indexOf(MEMORY_ITEM_SEPARATOR)
  const target = at >= 0 ? item.slice(at + MEMORY_ITEM_SEPARATOR.length) : item
  return target.split(MEMORY_ID_SEPARATOR)[0] ?? target
}

/** Stabile Graph-Kennung des abgefragten Knotens; bei alten Terminen nicht vorhanden. */
export function memoryNodeIdOfItem(item: string): string | undefined {
  const parts = item.split(MEMORY_ID_SEPARATOR)
  return parts.length >= 3 ? parts[2] || undefined : undefined
}

/** Anker und Ding eines Stücks, als Beschriftungen. */
export function memoryLabelsOf(item: string): { subject: string; target: string } {
  return { subject: memorySubjectOf(item), target: memoryTargetOf(item) }
}

/**
 * Verbindungen, die von diesem Knoten **weg** zeigen, sind die zuerst
 * bestätigte Abrufrichtung. Eine eingehende Kante wird erst dann zur
 * Gegenrichtung, wenn der Knoten selbst schon einmal abgerufen wurde.
 *
 * Das ist die V4.2-Regel für echte Rekonstruktion: Aus „Daniel → Madrid“
 * wird nicht sofort eine zweite künstliche Karte. Erst nachdem Madrid im
 * Training wirklich aufgetaucht ist, darf auch „Madrid → Daniel“ entstehen.
 * So wächst aus einer geführten Assoziation eine zweite Abrufroute, ohne
 * einen neuen Score, Level oder Scheduler einzuführen.
 */
function connectedForScene(graph: MemoryGraph, subject: MemoryNode): readonly MemoryNode[] {
  const connected = new Map<string, MemoryNode>()

  for (const edge of edgesFrom(graph, subject.id)) {
    const node = nodeById(graph, edge.to)
    if (node !== undefined) connected.set(node.id, node)
  }

  if (subject.lastRecalledAt !== undefined) {
    for (const edge of graph.edges) {
      if (edge.to !== subject.id) continue
      const node = nodeById(graph, edge.from)
      if (node !== undefined) connected.set(node.id, node)
    }
  }

  return [...connected.values()]
    .sort(
      (a, b) =>
        a.strength - b.strength ||
        (a.lastRecalledAt ?? a.createdAt) - (b.lastRecalledAt ?? b.createdAt) ||
        a.id.localeCompare(b.id),
    )
    .slice(0, MAX_ITEMS_PER_SCENE)
}

/**
 * Der Vorrat des Memory-Moduls für den Planer: die schwächsten Anker
 * zuerst, jeder mit seinen schwächsten Dingen.
 *
 * Beim ersten Lernen gilt nur die **bestätigte Richtung** einer Beziehung.
 * Nach dem ersten echten Abruf eines Knotens darf er zusätzlich seine
 * eingehenden Beziehungen als Gegenrichtung tragen. Dadurch entstehen mit
 * der Zeit mehrere Abrufwege — Person → Ort, später Ort → Person; Ereignis →
 * Datum, später Datum → Ereignis — ohne Quizlet-Doppelkarte und ohne etwas
 * Neues zu erfinden. Anker ohne trainierbare Verbindung bleiben draußen.
 */
export function composeMemoryPool(graph: MemoryGraph, maxScenes = MAX_MEMORY_SCENES): string[] {
  const scenes: string[] = []
  for (const subject of nodesByStrength(graph)) {
    if (scenes.length >= maxScenes) break
    const connected = connectedForScene(graph, subject)
    if (connected.length === 0) continue
    scenes.push(
      [
        subject.label,
        ...connected.map(
          (node) =>
            `${node.label}${MEMORY_ID_SEPARATOR}${subject.id}${MEMORY_ID_SEPARATOR}${node.id}`,
        ),
      ].join(MEMORY_SCENE_SEPARATOR),
    )
  }
  return scenes
}
