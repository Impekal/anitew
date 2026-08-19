import type { MemoryDimension, MemoryItemKind, MemoryNode } from './MemoryTypes.ts'

export type MemoryDraft = {
  title: string
  summary: string
  kind: MemoryItemKind
  dimensions: MemoryDimension[]
  tags: string[]
}

const patterns: Array<{ kind: MemoryItemKind; pattern: RegExp }> = [
  { kind: 'person', pattern: /\b(ich traf|kennengelernt|kollege|kollegin|freund|freundin|herr|frau|mr\.?|mrs\.?|ms\.?)\b/i },
  { kind: 'place', pattern: /\b(in|aus|nach|bei)\s+[A-ZÄÖÜ][\p{L}-]+/u },
  { kind: 'number', pattern: /\b\d+(?:[.,]\d+)?\b/ },
  { kind: 'event', pattern: /\b(heute|morgen|gestern|termin|meeting|treffen|geburtstag|reise|reise[n]?|konferenz)\b/i },
]

function inferKind(text: string): MemoryItemKind {
  return patterns.find((item) => item.pattern.test(text))?.kind ?? 'fact'
}

function inferDimensions(text: string, kind: MemoryItemKind): MemoryDimension[] {
  const result = new Set<MemoryDimension>(['associative'])
  if (kind === 'person' || /\bname|heißt|nannte/i.test(text)) result.add('names')
  if (kind === 'number' || /\b\d/.test(text)) result.add('numbers')
  if (/\b(links|rechts|oben|unten|neben|vor|hinter|zwischen|straße|stadt|ort|berlin|hamburg|paris|rom|london)\b/i.test(text)) result.add('spatial')
  if (/\b(deutsch|englisch|französisch|spanisch|italienisch|japanisch|chinesisch)\b/i.test(text)) result.add('language')
  return [...result]
}

export function architectMemory(text: string): MemoryDraft {
  const clean = text.trim().replace(/\s+/g, ' ')
  const kind = inferKind(clean)
  const dimensions = inferDimensions(clean, kind)
  const tags = clean.match(/#[\p{L}\p{N}_-]+/gu)?.map((tag) => tag.slice(1)) ?? []

  return {
    title: clean.length > 90 ? `${clean.slice(0, 87)}…` : clean,
    summary: clean,
    kind,
    dimensions,
    tags,
  }
}

export function nodeFromDraft(draft: MemoryDraft): MemoryNode {
  const now = Date.now()
  return {
    id: crypto.randomUUID(),
    kind: draft.kind,
    title: draft.title,
    summary: draft.summary,
    tags: draft.tags,
    dimensions: draft.dimensions,
    strength: 0.1,
    createdAt: now,
  }
}
