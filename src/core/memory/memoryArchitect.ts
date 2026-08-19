/**
 * Der Memory-Architekt — die Schnittstelle für KI-Anreicherung (D-037).
 *
 * Der Vertrag ist die eigentliche Entscheidung: **KI schreibt nie in den
 * Graphen.** Ein Anbieter (Gemini, Anthropic, … — dieselben Drähte wie
 * beim Coach) darf aus Text *Vorschläge in genau der Form* machen, die
 * auch die deterministische Extraktion liefert (`RememberSuggestions`).
 * Prüfen, zeigen, bestätigen und speichern bleibt deterministische
 * ANITEW-Logik — dieselbe Bestätigungsoberfläche, derselbe Weg.
 *
 * Bis ein Anbieter angeschlossen ist, **ist** die deterministische
 * Extraktion der Architekt. Dadurch gibt es keinen KI-Pflichtpfad (M2)
 * und keinen zweiten Datenweg, der anders geprüft würde.
 */

import { type RememberSuggestions, suggestMemories } from './rememberThis.ts'
import { type MemoryNodeType, memoryNodeId } from './memoryGraph.ts'

/** Was ein Architekt können muss: Text rein, Vorschläge raus. Mehr nicht. */
export interface MemoryArchitect {
  suggest(text: string): Promise<RememberSuggestions>
}

/** Der Architekt ohne Netz — immer da, immer gleich (M2/M5). */
export const OFFLINE_ARCHITECT: MemoryArchitect = {
  suggest: (text) => Promise.resolve(suggestMemories({ text })),
}

const NODE_TYPES: readonly MemoryNodeType[] = [
  'person',
  'place',
  'fact',
  'number',
  'date',
  'concept',
  'custom',
]

/**
 * Wäscht eine Anbieter-Antwort in gültige Vorschläge: unbekannte Typen
 * fallen auf `custom`, Beschriftungen werden gewaschen und gedeckelt,
 * Kanten ohne beide Enden fliegen. Eine KI-Antwort ist Fremdmaterial —
 * dieselbe Haltung wie gegenüber einer Sicherungsdatei.
 */
export function sanitizeArchitectSuggestions(raw: unknown): RememberSuggestions {
  if (typeof raw !== 'object' || raw === null) return { nodes: [], edges: [] }
  const candidate = raw as { nodes?: unknown; edges?: unknown }

  const nodes = (Array.isArray(candidate.nodes) ? candidate.nodes : [])
    .map((entry) => {
      if (typeof entry !== 'object' || entry === null) return undefined
      const node = entry as { type?: unknown; label?: unknown; detail?: unknown }
      if (typeof node.label !== 'string') return undefined
      const label = node.label
        .replace(/[\u0000-\u001f\u007f]/gu, ' ')
        .replace(/\s+/gu, ' ')
        .trim()
        .slice(0, 80)
      if (label.length < 2) return undefined
      const type = NODE_TYPES.includes(node.type as MemoryNodeType)
        ? (node.type as MemoryNodeType)
        : 'custom'
      return {
        id: memoryNodeId(type, label),
        type,
        label,
        ...(typeof node.detail === 'string' ? { detail: node.detail.slice(0, 200) } : {}),
      }
    })
    .filter((node): node is NonNullable<typeof node> => node !== undefined)
    .slice(0, 12)

  const known = new Set(nodes.map((node) => node.id))
  const edges = (Array.isArray(candidate.edges) ? candidate.edges : [])
    .map((entry) => {
      if (typeof entry !== 'object' || entry === null) return undefined
      const edge = entry as { from?: unknown; to?: unknown }
      if (typeof edge.from !== 'string' || typeof edge.to !== 'string') return undefined
      if (!known.has(edge.from) || !known.has(edge.to) || edge.from === edge.to) return undefined
      return { from: edge.from, to: edge.to, relation: 'association' as const }
    })
    .filter((edge): edge is NonNullable<typeof edge> => edge !== undefined)
    .slice(0, 11)

  return { nodes, edges }
}
