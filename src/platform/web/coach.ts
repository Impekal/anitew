/**
 * Der Draht des Coaches zu den KI-Anbietern (Backlog M · D-031 · D-034).
 *
 * Die einzige Stelle der App, die das Netz für Inhalte anfasst — und sie
 * tut es nur auf Fingertipp, nur mit dem **eigenen Schlüssel** des
 * Menschen und nur zum gewählten Anbieter. Kein eigener Server, kein
 * Mitlesen (R-3): Der Schlüssel liegt in den Einstellungen dieses Geräts
 * und geht in genau einen Header.
 *
 * Sechs Anbieter, ein Muster: Jeder ist **ein** Eintrag in einer Tabelle —
 * Adresse, Modell, Kopfzeilen, Antwortform. Bewusst rohes `fetch` statt
 * sechs SDKs: Das Kaltstart-Budget (P4) zählt jede Abhängigkeit, und für
 * je einen POST wären SDKs genau die dicken Abhängigkeiten, vor denen der
 * Budget-Wächter warnt.
 */

import { COACH_MAX_TOKENS } from '../../core/coach/prompt.ts'
import type { CoachPort, CoachRequest } from '../../core/coach/prompt.ts'

/** Die Anbieter, in der Reihenfolge der Auswahl. Gemini zuerst: Der
 *  Schlüssel ist dort in zwei Minuten angelegt und kostenlos nutzbar. */
export const COACH_PROVIDERS = [
  'gemini',
  'anthropic',
  'openai',
  'groq',
  'openrouter',
  'mistral',
] as const
export type CoachProvider = (typeof COACH_PROVIDERS)[number]

export const DEFAULT_COACH_PROVIDER: CoachProvider = 'gemini'

/** Wo die Anbieterwahl in den Einstellungen liegt. */
export const COACH_PROVIDER_SETTING = 'coach.provider'

/** Der Schlüssel je Anbieter — wer wechselt, verliert keinen Schlüssel. */
export function coachKeySettingFor(provider: CoachProvider): string {
  return `coach.key.${provider}`
}

/** Die alte Zeile aus D-031-Zeiten: ein Anthropic-Schlüssel ohne Anbieter. */
export const LEGACY_COACH_KEY_SETTING = 'coach.key'

/** Die Anzeigenamen — Eigennamen, keine Übersetzungen. */
export const COACH_PROVIDER_NAMES: Readonly<Record<CoachProvider, string>> = {
  gemini: 'Google Gemini',
  anthropic: 'Anthropic (Claude)',
  openai: 'OpenAI',
  groq: 'Groq',
  openrouter: 'OpenRouter',
  mistral: 'Mistral',
}

/** Wo der Schlüssel entsteht — der Direktlink je bestehendem statischen Anbieter. */
export const COACH_KEY_URLS: Readonly<Record<Exclude<CoachProvider, 'openai'>, string>> = {
  gemini: 'https://aistudio.google.com/apikey',
  anthropic: 'https://console.anthropic.com/settings/keys',
  groq: 'https://console.groq.com/keys',
  openrouter: 'https://openrouter.ai/settings/keys',
  mistral: 'https://console.mistral.ai/api-keys',
}

/*
 * Je Anbieter ein festes Modell — eine Modellauswahl im Menü wäre eine
 * Frage an den Menschen, die die App beantworten kann (D-031). Gewählt
 * sind die soliden Alltagsmodelle der Anbieter, nicht deren teuerste.
 */
const MODELS: Readonly<Record<Exclude<CoachProvider, 'openai'>, string>> = {
  gemini: 'gemini-2.5-flash',
  anthropic: 'claude-opus-5',
  groq: 'llama-3.3-70b-versatile',
  openrouter: 'openrouter/auto',
  mistral: 'mistral-small-latest',
}

export type CoachFailure =
  | 'no-key'
  | 'bad-key'
  | 'forbidden'
  | 'limited'
  | 'offline'
  | 'refused'
  | 'failed'

export class CoachError extends Error {
  constructor(readonly reason: CoachFailure) {
    super(reason)
    this.name = 'CoachError'
  }
}

/**
 * Eine HTTP-Antwort der Anbieter in eine ehrliche Diagnose übersetzen
 * (F-09, Runde 2). 401 und 403 sind **nicht** dasselbe: Groq etwa meldet
 * 403 bei fehlender Berechtigung trotz gültigem Schlüssel — wer dann
 * „Schlüssel prüfen“ liest, sucht am falschen Ort. Text- und Fotopfad
 * benutzen dieselbe Tabelle, damit die Diagnosen nie auseinanderlaufen.
 */
export function failureForStatus(status: number): CoachFailure | undefined {
  if (status === 401) return 'bad-key'
  if (status === 403) return 'forbidden'
  if (status === 429) return 'limited'
  return undefined
}

interface ProviderCall {
  url: string
  headers: Record<string, string>
  body: unknown
  /** Zieht den Antworttext heraus — oder wirft den passenden Fehler. */
  parse(payload: unknown): string
}

/** Die OpenAI-kompatible Form, die Groq, OpenRouter und Mistral sprechen. */
function openAiCall(url: string, key: string, model: string, request: CoachRequest): ProviderCall {
  return {
    url,
    headers: { authorization: `Bearer ${key}` },
    body: {
      model,
      max_tokens: COACH_MAX_TOKENS,
      messages: [
        { role: 'system', content: request.system },
        { role: 'user', content: request.question },
      ],
    },
    parse: (payload) => {
      const body = payload as { choices?: { message?: { content?: string } }[] }
      return body.choices?.[0]?.message?.content ?? ''
    },
  }
}

function callFor(provider: CoachProvider, key: string, request: CoachRequest) {
  switch (provider) {
    case 'gemini':
      return {
        url: `https://generativelanguage.googleapis.com/v1beta/models/${MODELS.gemini}:generateContent`,
        headers: { 'x-goog-api-key': key },
        body: {
          system_instruction: { parts: [{ text: request.system }] },
          contents: [{ role: 'user', parts: [{ text: request.question }] }],
          generationConfig: { maxOutputTokens: COACH_MAX_TOKENS },
        },
        parse: (payload: unknown) => {
          const body = payload as {
            promptFeedback?: { blockReason?: string }
            candidates?: { content?: { parts?: { text?: string }[] } }[]
          }
          if (body.promptFeedback?.blockReason !== undefined) throw new CoachError('refused')
          return (body.candidates?.[0]?.content?.parts ?? [])
            .map((part) => part.text ?? '')
            .join('')
        },
      }
    case 'anthropic':
      return {
        url: 'https://api.anthropic.com/v1/messages',
        headers: {
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: {
          model: MODELS.anthropic,
          max_tokens: COACH_MAX_TOKENS,
          system: request.system,
          messages: [{ role: 'user', content: request.question }],
        },
        parse: (payload: unknown) => {
          const body = payload as {
            stop_reason?: string
            content?: readonly { type: string; text?: string }[]
          }
          if (body.stop_reason === 'refusal') throw new CoachError('refused')
          return (body.content ?? [])
            .filter((block) => block.type === 'text')
            .map((block) => block.text ?? '')
            .join('')
        },
      }
    case 'openai':
      return import('./openaiCoach.ts').then(({ openAiResponsesCall }) =>
        openAiResponsesCall(key, request),
      )
    case 'groq':
      return openAiCall('https://api.groq.com/openai/v1/chat/completions', key, MODELS.groq, request)
    case 'openrouter':
      return openAiCall(
        'https://openrouter.ai/api/v1/chat/completions',
        key,
        MODELS.openrouter,
        request,
      )
    case 'mistral':
      return openAiCall('https://api.mistral.ai/v1/chat/completions', key, MODELS.mistral, request)
  }
}

export interface CoachConfig {
  provider: CoachProvider
  key: string | undefined
}

export function createWebCoach(readConfig: () => Promise<CoachConfig>): CoachPort {
  return {
    async ask(request: CoachRequest): Promise<string> {
      const { provider, key } = await readConfig()
      if (key === undefined || key.trim() === '') throw new CoachError('no-key')

      const call = await callFor(provider, key.trim(), request)
      let response: Response
      try {
        response = await fetch(call.url, {
          method: 'POST',
          headers: { 'content-type': 'application/json', ...call.headers },
          body: JSON.stringify(call.body),
        })
      } catch {
        throw new CoachError('offline')
      }

      const classified = failureForStatus(response.status)
      if (classified !== undefined) throw new CoachError(classified)
      if (!response.ok) throw new CoachError('failed')

      const text = call.parse((await response.json()) as unknown).trim()
      if (text === '') throw new CoachError('failed')
      return text
    },
  }
}
