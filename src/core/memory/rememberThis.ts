import type { MemoryGraph, MemoryNodeType } from './memoryGraph.ts'
import { addMemoryNode, connectMemoryNodes } from './memoryGraph.ts'

export type RememberInput = {
  text: string
  title?: string
}

export type MemorySuggestion = {
  id: string
  type: MemoryNodeType
  label: string
  detail?: string
  confidence: number
  relationTo?: string
  relation?: 'association' | 'sequence' | 'context' | 'contrast' | 'custom'
}

const patterns: Array<{ type: MemoryNodeType; regex: RegExp }> = [
  { type: 'date', regex: /\b(?:19|20)\d{2}\b/ },
  { type: 'number', regex: /\b\d+(?:[.,]\d+)?\b/ },
]

function nodeId(type: MemoryNodeType, label: string): string {
  return `${type}:${label.trim().toLocaleLowerCase().replace(/\s+/g, '-')}`
}

export function suggestMemories(input: RememberInput): MemorySuggestion[] {
  const text = input.text.trim()
  if (!text) return []

  const suggestions: MemorySuggestion[] = []
  const seen = new Set<string>()

  const push = (type: MemoryNodeType, label: string, confidence = 0.62, detail?: string) => {
    const clean = label.trim()
    if (!clean || clean.length < 2) return
    const id = nodeId(type, clean)
    if (seen.has(id)) return
    seen.add(id)
    suggestions.push({ id, type, label: clean, detail, confidence })
  }

  for (const { type, regex } of patterns) {
    for (const match of text.matchAll(new RegExp(regex.source, 'g'))) push(type, match[0], 0.94)
  }

  const quoted = [...text.matchAll(/["“”']([^"“”']{2,80})["“”']/g)]
  quoted.forEach((match) => push('fact', match[1], 0.86))

  // Conservative extraction: avoid pretending that generic words are known entities.
  // The AI Memory Architect can later replace this with provider-backed extraction.
  if (input.title) push('concept', input.title, 0.9)
  if (suggestions.length === 0) push('fact', text.slice(0, 120), 0.58, text.length > 120 ? text : undefined)

  return suggestions.slice(0, 12)
}

export function applyRememberedSuggestions(graph: MemoryGraph, suggestions: MemorySuggestion[]): MemoryGraph {
  let next = graph
  for (const suggestion of suggestions) {
    if (!next.nodes.some((node) => node.id === suggestion.id)) {
      next = addMemoryNode(next, {
        id: suggestion.id,
        type: suggestion.type,
        label: suggestion.label,
        detail: suggestion.detail,
      })
    }
  }

  for (const suggestion of suggestions) {
    if (!suggestion.relationTo || !suggestion.relation) continue
    next = connectMemoryNodes(next, {
      id: `${suggestion.relationTo}:${suggestion.id}:${suggestion.relation}`,
      from: suggestion.relationTo,
      to: suggestion.id,
      relation: suggestion.relation,
    })
  }
  return next
}
