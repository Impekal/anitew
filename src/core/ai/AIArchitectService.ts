import { getAIProvider } from './AIProviderRegistry.ts'
import { validateMemoryArchitectResponse } from './MemoryArchitectValidator.ts'
import type { AIProviderId, MemoryArchitectRequest, MemoryArchitectResponse } from './AIProvider.ts'
import { architectMemory } from '../memory/MemoryArchitect.ts'

export async function architectWithAI(request: MemoryArchitectRequest, providerId: AIProviderId = 'none'): Promise<MemoryArchitectResponse> {
  if (providerId === 'none') return fallback(request.text)

  try {
    const raw = await getAIProvider(providerId).architectMemory(request)
    return validateMemoryArchitectResponse(raw) ?? fallback(request.text)
  } catch {
    return fallback(request.text)
  }
}

function fallback(text: string): MemoryArchitectResponse {
  const draft = architectMemory(text)
  return {
    entities: [{ id: 'memory', name: draft.title, type: draft.kind === 'person' ? 'person' : draft.kind === 'place' ? 'place' : draft.kind === 'number' ? 'number' : draft.kind === 'event' ? 'event' : 'fact' }],
    relations: [],
    retrieval: [{ kind: 'free-recall', question: `What do you remember about “${draft.title}”?`, answer: draft.summary, difficulty: 1 }],
    encoding: { strategy: draft.dimensions.includes('spatial') ? 'spatial' : draft.dimensions.includes('numbers') ? 'chunking' : 'association', instruction: 'Create a vivid, meaningful association with the information.' },
  }
}
