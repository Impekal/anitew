import type { MemoryNode } from './MemoryTypes.ts'

export type EncodingStrategy = 'elaborative' | 'visual' | 'spatial' | 'association' | 'chunking' | 'story'

export type EncodingPlan = {
  strategy: EncodingStrategy
  instruction: string
  cue: string
}

export function chooseEncodingStrategy(node: MemoryNode): EncodingPlan {
  if (node.dimensions.includes('spatial') || node.kind === 'place') return { strategy: 'spatial', instruction: 'Place this memory somewhere familiar in your mind.', cue: 'Where did you place it?' }
  if (node.dimensions.includes('names') || node.kind === 'person') return { strategy: 'association', instruction: 'Link the person to one vivid, distinctive detail.', cue: 'What detail brings this person back?' }
  if (node.dimensions.includes('numbers') || node.kind === 'number') return { strategy: 'chunking', instruction: 'Group the number into meaningful chunks instead of repeating it.', cue: 'What were the chunks?' }
  if (node.summary && node.summary.length > 70) return { strategy: 'story', instruction: 'Turn the information into a short, unusual story with a clear beginning and end.', cue: 'What happened in the story?' }
  if (node.tags.length) return { strategy: 'elaborative', instruction: 'Connect each tag to something you already know.', cue: 'What existing knowledge did you connect it to?' }
  return { strategy: 'elaborative', instruction: 'Explain why this information matters in your own words.', cue: 'Why does it matter?' }
}
