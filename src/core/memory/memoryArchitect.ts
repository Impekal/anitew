import type { MemoryNodeType } from './memoryGraph.ts'

export type MemoryMaterial = {
  id: string
  text: string
  source?: string
}

export type MemorySuggestion = {
  label: string
  type: MemoryNodeType
  reason: 'important' | 'associative' | 'distinctive' | 'actionable'
  relatedTo: string[]
}

/**
 * Deterministic first pass for the future AI Memory Architect.
 *
 * AI will eventually enrich this contract, but the domain layer must remain
 * provider-agnostic: OpenAI/Gemini/local models should produce the same
 * structured suggestions and never write directly into the memory store.
 */
export function extractMemorySuggestions(material: MemoryMaterial): MemorySuggestion[] {
  const text = material.text.trim()
  if (!text) return []

  const suggestions: MemorySuggestion[] = []
  const seen = new Set<string>()
  const push = (label: string, type: MemoryNodeType, reason: MemorySuggestion['reason']) => {
    const clean = label.trim().replace(/\s+/g, ' ')
    if (clean.length < 2 || seen.has(clean.toLowerCase())) return
    seen.add(clean.toLowerCase())
    suggestions.push({ label: clean, type, reason, relatedTo: [] })
  }

  // Dates and times are highly retrievable real-world anchors.
  for (const match of text.matchAll(/\b(?:19|20)\d{2}\b/g)) push(match[0], 'date', 'important')
  for (const match of text.matchAll(/\b\d{1,4}(?::\d{2})\b/g)) push(match[0], 'date', 'important')

  // Quoted names/labels are often deliberate entities in user-provided notes.
  for (const match of text.matchAll(/[“"]([^”"]{2,60})[”"]/g)) push(match[1], 'fact', 'distinctive')

  // Keep a compact fallback entity so every non-empty material can become
  // something trainable even before an AI provider is connected.
  if (suggestions.length === 0) {
    const firstSentence = text.split(/[.!?]\s+/)[0]
    push(firstSentence.slice(0, 80), 'fact', 'important')
  }

  return suggestions.slice(0, 12)
}
