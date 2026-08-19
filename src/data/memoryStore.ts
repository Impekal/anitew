/**
 * Der Memory-Graph im Speicher (D-036).
 *
 * Eine Zeile in den Einstellungen — bewusst dort und nicht in einer
 * eigenen Tabelle (kein Schema-Sprung): So wandert der Graph mit der
 * Sicherung (N2) und dem Drive-Abgleich (D-033) mit, ohne dass jemand
 * daran denken muss. Der Sonderfall dafür liegt im Sicherungs-Import:
 * Einstellungen gewinnt sonst die Fassung der Datei — für den Graphen
 * wäre das Überschreiben, deshalb wird er dort **vereinigt** (N9).
 *
 * Alles Gelesene geht durch `readMemoryGraph`: Die Einstellungen können
 * aus einer Sicherung kommen, und eine Sicherung kann alles enthalten.
 */

import {
  type MemoryGraph,
  memoryLabelsOf,
  mergeMemoryGraph,
  readMemoryGraph,
  reinforceMemoryNode,
  weakenMemoryNode,
} from '../core/index.ts'

import { db } from './db.ts'

export const MEMORY_GRAPH_KEY = 'memory.graph'
/** Ob „Mein Gedächtnis“ je geöffnet wurde — für die Entdeckungszeile. */
export const MEMORY_VISITED_KEY = 'memory.visited'

/** Der gespeicherte Graph — bei jedem Fehler ehrlich der leere. */
export async function loadMemoryGraph(): Promise<MemoryGraph> {
  try {
    const stored = (await db.settings.get(MEMORY_GRAPH_KEY))?.value
    return readMemoryGraph(stored)
  } catch {
    return readMemoryGraph(undefined)
  }
}

/**
 * Schreibt den Graphen. Wirft bei Speicherfehlern — der Aufrufer soll
 * wissen, dass **nicht** gespeichert wurde, statt es dem Menschen als
 * erledigt zu zeigen (dieselbe Haltung wie bei der Sicherung).
 */
export async function saveMemoryGraph(graph: MemoryGraph): Promise<void> {
  await db.settings.put({ key: MEMORY_GRAPH_KEY, value: graph })
}

/**
 * Vereinigt Fremdes mit dem Bestand und speichert das Ergebnis — die
 * eine Stelle für „zwei Geräte, beide haben recht“ (N9). Gibt den
 * vereinigten Graphen zurück.
 */
export async function mergeMemoryGraphIntoStore(incoming: unknown): Promise<MemoryGraph> {
  const mine = await loadMemoryGraph()
  const merged = mergeMemoryGraph(mine, readMemoryGraph(incoming))
  await saveMemoryGraph(merged)
  return merged
}

/**
 * Führt ein Abrufergebnis des Memory-Moduls in den Graphen zurück (D-036):
 * richtig hebt die Stärke des gefragten Dings, falsch senkt sie. Die
 * Kennungen tragen die Beschriftungen; gefunden wird über sie — dieselbe
 * Beschriftung ist dieselbe Erinnerung. FSRS bleibt davon unberührt: Der
 * Termin läuft über `recordOutcome`, hier läuft nur die Auswahl der
 * nächsten Einheit.
 */
export async function applyMemoryOutcome(
  outcome: { correct: readonly string[]; missed: readonly string[] },
  now: number,
): Promise<void> {
  let graph = await loadMemoryGraph()
  if (graph.nodes.length === 0) return
  const byLabel = new Map(graph.nodes.map((node) => [node.label, node.id]))
  for (const item of outcome.correct) {
    const id = byLabel.get(memoryLabelsOf(item).target)
    if (id !== undefined) graph = reinforceMemoryNode(graph, id, now)
  }
  for (const item of outcome.missed) {
    const id = byLabel.get(memoryLabelsOf(item).target)
    if (id !== undefined) graph = weakenMemoryNode(graph, id, now)
  }
  await saveMemoryGraph(graph)
}
