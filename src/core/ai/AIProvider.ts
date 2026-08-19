export type AIProviderId = 'none' | 'openai' | 'gemini' | 'anthropic' | 'openrouter' | 'custom'

export type MemoryArchitectRequest = {
  text: string
  language?: string
}

export type MemoryEntity = {
  id: string
  name: string
  type: 'person' | 'place' | 'fact' | 'number' | 'event' | 'concept'
}

export type MemoryRelation = {
  from: string
  to: string
  type: string
  confidence: number
}

export type RetrievalSuggestion = {
  kind: 'free-recall' | 'attribute-to-entity' | 'entity-to-attribute' | 'association' | 'interference' | 'delayed-recall'
  question: string
  answer: string
  difficulty: 1 | 2 | 3 | 4 | 5
}

export type EncodingSuggestion = {
  strategy: 'association' | 'story' | 'spatial' | 'chunking' | 'elaboration'
  instruction: string
}

export type MemoryArchitectResponse = {
  entities: MemoryEntity[]
  relations: MemoryRelation[]
  retrieval: RetrievalSuggestion[]
  encoding: EncodingSuggestion
}

export interface AIProvider {
  readonly id: AIProviderId
  architectMemory(request: MemoryArchitectRequest): Promise<MemoryArchitectResponse>
}

export class NoAIProvider implements AIProvider {
  readonly id = 'none' as const

  async architectMemory(): Promise<MemoryArchitectResponse> {
    return { entities: [], relations: [], retrieval: [], encoding: { strategy: 'elaboration', instruction: '' } }
  }
}
