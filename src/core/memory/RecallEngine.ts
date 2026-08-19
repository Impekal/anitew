import type { MemoryNode } from './MemoryTypes.ts'

export type RecallPrompt = {
  id: string
  memoryId: string
  kind: 'free-recall' | 'association' | 'recognition'
  question: string
  answer: string
  dueAt: number
}

export function buildRecallPrompts(node: MemoryNode): RecallPrompt[] {
  const context = node.summary?.trim()
  const prompts: RecallPrompt[] = [
    {
      id: `${node.id}:free`,
      memoryId: node.id,
      kind: 'free-recall',
      question: `What do you remember about “${node.title}”?`,
      answer: [node.title, context].filter(Boolean).join(' — '),
      dueAt: Date.now() + 24 * 60 * 60 * 1000,
    },
  ]

  if (context) {
    prompts.push({
      id: `${node.id}:association`,
      memoryId: node.id,
      kind: 'association',
      question: `Which detail is associated with “${node.title}”?`,
      answer: context,
      dueAt: Date.now() + 3 * 24 * 60 * 60 * 1000,
    })
  }

  return prompts
}

export function scoreRecall(expected: string, response: string): number {
  const normalize = (value: string) => value.toLocaleLowerCase().trim().replace(/[^\p{L}\p{N}\s]/gu, '')
  const target = normalize(expected)
  const answer = normalize(response)
  if (!answer) return 0
  if (answer === target) return 1
  const targetWords = new Set(target.split(/\s+/).filter(Boolean))
  const answerWords = new Set(answer.split(/\s+/).filter(Boolean))
  if (!targetWords.size) return 0
  const overlap = [...targetWords].filter((word) => answerWords.has(word)).length
  return Math.min(1, overlap / targetWords.size)
}
