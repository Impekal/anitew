import type { AIProvider, AIProviderId } from './AIProvider.ts'
import { NoAIProvider } from './AIProvider.ts'

const providers = new Map<AIProviderId, AIProvider>()
providers.set('none', new NoAIProvider())

export function registerAIProvider(provider: AIProvider): void {
  providers.set(provider.id, provider)
}

export function getAIProvider(id: AIProviderId = 'none'): AIProvider {
  return providers.get(id) ?? providers.get('none')!
}

export function listAIProviders(): AIProviderId[] {
  return [...providers.keys()]
}
