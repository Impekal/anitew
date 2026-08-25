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

/** Eine Beschriftung waschen — für Knoten und Kanten-Enden dieselbe Hand. */
function washLabel(value: string): string {
  return value
    .replace(/[\u0000-\u001f\u007f]/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim()
    .slice(0, 80)
}

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
      const label = washLabel(node.label)
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

function architectOutputRules(source: 'Text' | 'Bild'): readonly string[] {
  const sourceRule =
    source === 'Text'
      ? '- "label" steht wörtlich oder fast wörtlich im Text. Erfinde nichts hinzu.'
      : '- "label" muss durch klar sichtbaren Text oder klar erkennbare Bildinformation gedeckt sein. Erfinde nichts hinzu.'
  return [
    'Antworte AUSSCHLIESSLICH mit einem JSON-Objekt, ohne Erklärung, ohne Markdown-Zaun:',
    '{"nodes":[{"type":"person","label":"..."}],"edges":[{"from":"Label","to":"Label"}]}',
    'Regeln, ohne Ausnahme:',
    `- "type" ist eines von: ${NODE_TYPES.join(', ')}.`,
    '- "label" ist kurz (1 bis 3 Wörter) und in der Sprache der Quelle.',
    sourceRule,
    '- Höchstens 10 Knoten. Nur, was sich zu merken lohnt.',
    '- "edges" verbinden Zusammengehöriges; "from" und "to" sind exakt Labels',
    '  aus "nodes". Meist hängt alles an einer Person oder einem Thema.',
    '- Findest du nichts Sicheres, antworte {"nodes":[],"edges":[]}.',
  ]
}

/**
 * Die Anweisung an den Text-Anbieter. Sie verlangt **nur** die Form, die auch
 * die deterministische Extraktion liefert — und verbietet Erfundenes.
 */
export function architectSystem(): string {
  return [
    'Du extrahierst Gedächtnis-Knoten aus einem Text für ANITEW, eine Gedächtnistraining-App.',
    ...architectOutputRules('Text'),
  ].join('\n')
}

/**
 * Dasselbe Datenformat für ein Foto, aber mit einer strengeren Quellenregel:
 * Nur sichtbar gedeckte Information darf vorgeschlagen werden. Die Bildanalyse
 * bleibt dadurch Vorschlag — die menschliche Bestätigung folgt unverändert.
 */
export function architectPhotoSystem(): string {
  return [
    'Du extrahierst Gedächtnis-Knoten aus einem Bild für ANITEW, eine Gedächtnistraining-App.',
    'Transkribiere nicht wahllos das ganze Bild. Wähle nur wenige Informationen, die sich sinnvoll abrufen lassen.',
    ...architectOutputRules('Bild'),
  ].join('\n')
}

/**
 * Liest eine Anbieter-Antwort: das JSON herausschälen (auch aus einem
 * Markdown-Zaun), Kanten von Beschriftungen auf IDs übersetzen, dann
 * alles durch dieselbe Wäsche wie jedes Fremdmaterial. `undefined`
 * heißt: kein lesbares JSON — ein Fehler, kein leeres Ergebnis.
 */
export function parseArchitectAnswer(answer: string): RememberSuggestions | undefined {
  const start = answer.indexOf('{')
  const end = answer.lastIndexOf('}')
  if (start < 0 || end <= start) return undefined

  let parsed: unknown
  try {
    parsed = JSON.parse(answer.slice(start, end + 1))
  } catch {
    return undefined
  }
  if (typeof parsed !== 'object' || parsed === null) return undefined
  const raw = parsed as { nodes?: unknown; edges?: unknown }

  // Erst die Knoten waschen — sie liefern die Landkarte Label → ID.
  const nodes = sanitizeArchitectSuggestions({ nodes: raw.nodes, edges: [] }).nodes
  const byLabel = new Map(nodes.map((node) => [node.label.toLowerCase(), node.id]))
  const endOf = (value: unknown): string | undefined =>
    typeof value === 'string' ? byLabel.get(washLabel(value).toLowerCase()) : undefined

  const edges = (Array.isArray(raw.edges) ? raw.edges : []).map((entry) => {
    if (typeof entry !== 'object' || entry === null) return undefined
    const edge = entry as { from?: unknown; to?: unknown }
    const from = endOf(edge.from)
    const to = endOf(edge.to)
    return from !== undefined && to !== undefined ? { from, to } : undefined
  })

  return sanitizeArchitectSuggestions({ nodes: raw.nodes, edges })
}
