import type { MemoryArchitectResponse } from './AIProvider.ts'

const retrievalKinds = new Set(['free-recall', 'attribute-to-entity', 'entity-to-attribute', 'association', 'interference', 'delayed-recall'])
const encodingStrategies = new Set(['association', 'story', 'spatial', 'chunking', 'elaboration'])

export function validateMemoryArchitectResponse(value: unknown): MemoryArchitectResponse | null {
  if (!value || typeof value !== 'object') return null
  const candidate = value as Partial<MemoryArchitectResponse>
  if (!Array.isArray(candidate.entities) || !Array.isArray(candidate.relations) || !Array.isArray(candidate.retrieval)) return null
  if (!candidate.encoding || !encodingStrategies.has(candidate.encoding.strategy) || typeof candidate.encoding.instruction !== 'string') return null

  const entities = candidate.entities.filter((item) => item && typeof item.id === 'string' && typeof item.name === 'string' && ['person', 'place', 'fact', 'number', 'event', 'concept'].includes(item.type))
  const entityIds = new Set(entities.map((item) => item.id))
  const relations = candidate.relations.filter((item) => item && entityIds.has(item.from) && entityIds.has(item.to) && typeof item.type === 'string' && Number.isFinite(item.confidence)).map((item) => ({ ...item, confidence: Math.max(0, Math.min(1, item.confidence)) }))
  const retrieval = candidate.retrieval.filter((item) => item && retrievalKinds.has(item.kind) && typeof item.question === 'string' && typeof item.answer === 'string' && Number.isInteger(item.difficulty) && item.difficulty >= 1 && item.difficulty <= 5).map((item) => ({ ...item, difficulty: item.difficulty as 1 | 2 | 3 | 4 | 5 }))

  return { entities, relations, retrieval, encoding: candidate.encoding }
}
