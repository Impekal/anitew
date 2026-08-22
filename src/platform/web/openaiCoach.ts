import { COACH_MAX_TOKENS, type CoachRequest } from '../../core/coach/prompt.ts'
import { CoachError } from './coach.ts'

export interface OpenAiCoachCall {
  url: string
  headers: Record<string, string>
  body: unknown
  parse(payload: unknown): string
}

/** OpenAI's Responses API stays out of ANITEW's cold-start bundle. */
export function openAiResponsesCall(key: string, request: CoachRequest): OpenAiCoachCall {
  return {
    url: 'https://api.openai.com/v1/responses',
    headers: { authorization: `Bearer ${key}` },
    body: {
      model: 'gpt-5.6-luna',
      instructions: request.system,
      input: request.question,
      max_output_tokens: COACH_MAX_TOKENS,
    },
    parse: (payload) => {
      const body = payload as {
        output?: readonly {
          type?: string
          content?: readonly { type?: string; text?: string }[]
        }[]
      }
      const content = (body.output ?? [])
        .filter((item) => item.type === 'message')
        .flatMap((item) => item.content ?? [])
      if (content.some((part) => part.type === 'refusal')) throw new CoachError('refused')
      return content
        .filter((part) => part.type === 'output_text')
        .map((part) => part.text ?? '')
        .join('')
    },
  }
}
