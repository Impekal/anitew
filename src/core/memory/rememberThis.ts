/**
 * „Das will ich behalten“ — aus echtem Text werden Graph-Vorschläge (D-036).
 *
 * Der Weg: Der Mensch schreibt einen Satz aus seinem Leben („Daniel
 * arbeitet im Museum, kommt aus Madrid und spielt Gitarre.“), die App
 * schlägt Knoten und Beziehungen vor — und **nichts wird gespeichert,
 * bevor der Mensch es bestätigt hat**. Diese Extraktion ist bewusst
 * deterministisch und bescheiden: Sie findet Großgeschriebenes, Zahlen,
 * Jahre und Zitate und rät nicht darüber hinaus. Der KI-Architekt
 * (D-037, später) darf sie anreichern — er liefert dann dieselbe Form
 * von Vorschlägen, und dieselbe Bestätigung entscheidet.
 *
 * Sprachlich trägt sie Deutsch und Englisch: Im Deutschen ist jedes
 * Substantiv groß — deshalb filtert eine Stoppwortliste Satzanfänge und
 * Alltagswörter, statt Großschreibung mit Bedeutung zu verwechseln.
 */

import {
  type MemoryGraph,
  type MemoryNodeType,
  type MemoryRelation,
  addMemoryNode,
  connectMemoryNodes,
  memoryNodeId,
  setMemoryDeadline,
} from './memoryGraph.ts'

export interface RememberInput {
  readonly text: string
}

export interface NodeSuggestion {
  readonly id: string
  readonly type: MemoryNodeType
  readonly label: string
  readonly detail?: string
}

export interface EdgeSuggestion {
  readonly from: string
  readonly to: string
  readonly relation: MemoryRelation
}

export interface RememberSuggestions {
  readonly nodes: readonly NodeSuggestion[]
  readonly edges: readonly EdgeSuggestion[]
}

/*
 * Wörter, die groß dastehen können, ohne etwas zu benennen: Satzanfänge,
 * Artikel, Pronomen, Häufiges. Klein gehalten — lieber ein Vorschlag zu
 * viel (der Mensch wählt ab) als ein Name verschluckt.
 */
const STOPWORDS = new Set(
  (
    'der die das ein eine einer eines dem den und oder aber doch wenn weil dann dort hier ' +
    'er sie es ich du wir ihr man sein seine ihre seinem ihrem heute morgen gestern jetzt ' +
    'the a an and or but if then he she it i we they his her their today tomorrow yesterday ' +
    'am im in aus von zu bei mit nach für auf an unter über at on from with for to of'
  ).split(' '),
)

/* Präpositionen, die auf einen **Ort** deuten: „im Museum“, „aus Madrid“. */
const PLACE_HINTS = new Set(['im', 'in', 'aus', 'nach', 'bei', 'at', 'from', 'to'])

const YEAR = /\b(?:1[5-9]|20)\d{2}\b/gu
const NUMBER = /\b\d+(?:[.,:]\d+)?\b/gu
const QUOTED = /["“”'']([^"“”'']{2,80})["“”'']/gu

/** Ein Wort samt seinem Vorgänger — der Vorgänger trägt den Ortshinweis. */
interface Candidate {
  readonly word: string
  readonly before: string
}

function capitalizedCandidates(text: string): Candidate[] {
  const tokens = text.split(/[\s,;]+/u).map((token) => token.replace(/[.!?:()«»]+$/gu, ''))
  const out: Candidate[] = []
  for (let at = 0; at < tokens.length; at++) {
    const word = tokens[at] ?? ''
    if (!/^\p{Lu}[\p{L}-]+$/u.test(word)) continue
    if (STOPWORDS.has(word.toLocaleLowerCase())) continue
    out.push({ word, before: (tokens[at - 1] ?? '').toLocaleLowerCase() })
  }
  return out
}

/**
 * Aus Text werden Vorschläge: Knoten und Beziehungen.
 *
 * Das erste gefundene Ding gilt als **Anker** (bei „Daniel arbeitet im
 * Museum …“ ist das Daniel): Alle weiteren Funde werden ihm als
 * Zusammengehörigkeit vorgeschlagen — genau die Struktur, die später
 * geübt wird („Daniel — was gehört dazu?“).
 */
export function suggestMemories(input: RememberInput): RememberSuggestions {
  const text = input.text.trim()
  if (text === '') return { nodes: [], edges: [] }

  const nodes: NodeSuggestion[] = []
  const seen = new Set<string>()
  const push = (type: MemoryNodeType, label: string, detail?: string) => {
    // Steuerzeichen raus (dieselbe Wäsche wie überall): Sie sind in den
    // Szenen-Kennungen des Trainings die Trennzeichen (D-036).
    const clean = label
      .replace(/[\u0000-\u001f\u007f]/gu, ' ')
      .replace(/\s+/gu, ' ')
      .trim()
    if (clean.length < 2) return
    const id = memoryNodeId(type, clean)
    if (seen.has(id)) return
    seen.add(id)
    nodes.push({ id, type, label: clean, ...(detail === undefined ? {} : { detail }) })
  }

  const capitalized = capitalizedCandidates(text)
  capitalized.forEach((candidate, index) => {
    const type: MemoryNodeType =
      index === 0
        ? // Der erste benannte Gegenstand eines Merksatzes ist fast immer
          // sein Subjekt — und Merksätze über das eigene Leben handeln
          // fast immer von Menschen. Der Mensch korrigiert per Abwahl.
          'person'
        : PLACE_HINTS.has(candidate.before)
          ? 'place'
          : 'concept'
    push(type, candidate.word)
  })

  for (const match of text.matchAll(YEAR)) push('date', match[0])
  for (const match of text.matchAll(NUMBER)) push('number', match[0])
  for (const match of text.matchAll(QUOTED)) push('fact', match[1] ?? '')

  // Gar nichts erkannt: Der ganze Satz wird eine Karte — besser eine
  // ehrliche als eine geratene Struktur.
  if (nodes.length === 0) {
    push('fact', text.slice(0, 80), text.length > 80 ? text : undefined)
  }

  const anchor = nodes[0]
  const edges: EdgeSuggestion[] =
    anchor === undefined
      ? []
      : nodes
          .slice(1)
          .map((node) => ({ from: anchor.id, to: node.id, relation: 'association' as const }))

  return { nodes: nodes.slice(0, 12), edges: edges.slice(0, 11) }
}

/**
 * Bestätigte Vorschläge in den Graphen — nur die bestätigten: Der Mensch
 * hat vorher abgewählt, was nicht stimmt. Kanten, deren Enden abgewählt
 * wurden, fallen still mit (connectMemoryNodes prüft beide Enden).
 *
 * `neededByAt` (I5) gehört zur **bewussten Bestätigung** desselben Vorgangs:
 * Wenn gesetzt, bekommen genau diese bestätigten Knoten denselben realen
 * Zielzeitpunkt. Ohne Wert bleibt eine bereits vorhandene Deadline unberührt.
 */
export function applyRememberedSuggestions(
  graph: MemoryGraph,
  suggestions: RememberSuggestions,
  now: number,
  neededByAt?: number,
): MemoryGraph {
  const normalized = normalizeRememberSuggestions(suggestions)
  let next = graph
  for (const node of normalized.nodes) {
    next = addMemoryNode(next, node, now)
  }
  for (const edge of normalized.edges) {
    next = connectMemoryNodes(next, edge, now)
  }
  if (neededByAt !== undefined) {
    next = setMemoryDeadline(
      next,
      normalized.nodes.map((node) => node.id),
      neededByAt,
      now,
    )
  }
  return next
}

/**
 * Bearbeitung kann zwei Vorschläge auf dieselbe stabile Kennung führen.
 * Dann gewinnt deterministisch der erste Knoten, fehlende Details werden
 * ergänzt, und Kanten werden nach dem Kollaps dedupliziert. Self-Edges fallen.
 */
export function normalizeRememberSuggestions(
  suggestions: RememberSuggestions,
): RememberSuggestions {
  const nodes = new Map<string, NodeSuggestion>()
  const canonical = new Map<string, string>()
  for (const node of suggestions.nodes) {
    const id = memoryNodeId(node.type, node.label)
    canonical.set(node.id, id)
    const existing = nodes.get(id)
    if (existing === undefined) nodes.set(id, { ...node, id })
    else if (existing.detail === undefined && node.detail !== undefined) {
      nodes.set(id, { ...existing, detail: node.detail })
    }
  }
  const known = new Set(nodes.keys())
  const edges = new Map<string, EdgeSuggestion>()
  for (const edge of suggestions.edges) {
    const from = canonical.get(edge.from) ?? edge.from
    const to = canonical.get(edge.to) ?? edge.to
    if (!known.has(from) || !known.has(to) || from === to) continue
    const normalized = { ...edge, from, to }
    edges.set(`${from}→${to}:${edge.relation}`, normalized)
  }
  return { nodes: [...nodes.values()], edges: [...edges.values()] }
}
