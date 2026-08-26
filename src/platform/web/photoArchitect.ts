import { COACH_MAX_TOKENS } from '../../core/coach/prompt.ts'
import {
  architectPhotoSystem,
  parseArchitectAnswer,
  type RememberSuggestions,
} from '../../core/index.ts'
import {
  COACH_PROVIDERS,
  COACH_PROVIDER_SETTING,
  type CoachFailure,
  type CoachProvider,
  DEFAULT_COACH_PROVIDER,
  LEGACY_COACH_KEY_SETTING,
  coachKeySettingFor,
  failureForStatus,
} from './coach.ts'
import { createWebSettings } from './settings.ts'

/**
 * Fotoanalyse ist absichtlich **kein** stiller Teil des normalen Foto-Imports.
 * Diese Datei wird erst nach dem ausdrücklichen Fingertipp dynamisch geladen.
 * Bis dahin bleiben die Bildbytes ausschließlich im lokalen Blob des Browsers.
 */

const VISION_PROVIDERS = ['gemini', 'anthropic', 'openai'] as const
export type VisionProvider = (typeof VISION_PROVIDERS)[number]

export type PhotoArchitectFailure =
  | CoachFailure
  | 'unsupported-provider'
  | 'unsupported-image'

export class PhotoArchitectError extends Error {
  constructor(readonly reason: PhotoArchitectFailure) {
    super(reason)
    this.name = 'PhotoArchitectError'
  }
}

interface PreparedPhoto {
  readonly mimeType: 'image/jpeg'
  readonly base64: string
}

interface ProviderCall {
  readonly url: string
  readonly headers: Readonly<Record<string, string>>
  readonly body: unknown
  parse(payload: unknown): string
}

const MAX_SIDE = 1568
const MAX_PREPARED_BYTES = 4_500_000
const JPEG_QUALITIES = [0.9, 0.78, 0.64] as const

function blobToBase64(blob: Blob): Promise<string> {
  return blob.arrayBuffer().then((buffer) => {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    const chunk = 0x8000
    for (let offset = 0; offset < bytes.length; offset += chunk) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + chunk))
    }
    return btoa(binary)
  })
}

async function loadImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.decoding = 'async'
    image.src = url
    await image.decode()
    return image
  } catch {
    throw new PhotoArchitectError('unsupported-image')
  } finally {
    URL.revokeObjectURL(url)
  }
}

/**
 * Erstellt eine flüchtige, verkleinerte JPEG-Kopie ohne Datei-/EXIF-Metadaten.
 * Das Original wird nie an einen Anbieter geschickt. Die lange Kante folgt der
 * von Anthropic für Vision empfohlenen Größenordnung; das Byte-Limit hält auch
 * Geminis Inline-Pfad weit unter dessen Request-Grenze.
 */
async function preparePhoto(file: File): Promise<PreparedPhoto> {
  if (!file.type.startsWith('image/')) throw new PhotoArchitectError('unsupported-image')

  const image = await loadImage(file)
  if (image.naturalWidth < 1 || image.naturalHeight < 1) {
    throw new PhotoArchitectError('unsupported-image')
  }

  const scale = Math.min(1, MAX_SIDE / Math.max(image.naturalWidth, image.naturalHeight))
  const width = Math.max(1, Math.round(image.naturalWidth * scale))
  const height = Math.max(1, Math.round(image.naturalHeight * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (context === null) throw new PhotoArchitectError('failed')

  // Transparente Notiz-Screenshots bleiben als JPEG lesbar statt schwarz zu werden.
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, width, height)
  context.drawImage(image, 0, 0, width, height)

  for (const quality of JPEG_QUALITIES) {
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality),
    )
    if (blob !== null && blob.size <= MAX_PREPARED_BYTES) {
      return { mimeType: 'image/jpeg', base64: await blobToBase64(blob) }
    }
  }
  throw new PhotoArchitectError('failed')
}

function parseGemini(payload: unknown): string {
  const body = payload as {
    promptFeedback?: { blockReason?: string }
    candidates?: { content?: { parts?: { text?: string }[] } }[]
  }
  if (body.promptFeedback?.blockReason !== undefined) throw new PhotoArchitectError('refused')
  return (body.candidates?.[0]?.content?.parts ?? [])
    .map((part) => part.text ?? '')
    .join('')
}

function parseAnthropic(payload: unknown): string {
  const body = payload as {
    stop_reason?: string
    content?: readonly { type?: string; text?: string }[]
  }
  if (body.stop_reason === 'refusal') throw new PhotoArchitectError('refused')
  return (body.content ?? [])
    .filter((part) => part.type === 'text')
    .map((part) => part.text ?? '')
    .join('')
}

function parseOpenAi(payload: unknown): string {
  const body = payload as {
    output?: readonly {
      type?: string
      content?: readonly { type?: string; text?: string }[]
    }[]
  }
  const content = (body.output ?? [])
    .filter((item) => item.type === 'message')
    .flatMap((item) => item.content ?? [])
  if (content.some((part) => part.type === 'refusal')) throw new PhotoArchitectError('refused')
  return content
    .filter((part) => part.type === 'output_text')
    .map((part) => part.text ?? '')
    .join('')
}

function callFor(provider: VisionProvider, key: string, photo: PreparedPhoto): ProviderCall {
  const system = architectPhotoSystem()
  const question =
    'Extrahiere nur klar sichtbare, merkenswerte Informationen aus diesem Bild. Erfinde nichts.'

  switch (provider) {
    case 'gemini':
      return {
        url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
        headers: { 'x-goog-api-key': key },
        body: {
          system_instruction: { parts: [{ text: system }] },
          contents: [
            {
              role: 'user',
              parts: [
                { inlineData: { mimeType: photo.mimeType, data: photo.base64 } },
                { text: question },
              ],
            },
          ],
          generationConfig: { maxOutputTokens: COACH_MAX_TOKENS },
        },
        parse: parseGemini,
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
          model: 'claude-opus-5',
          max_tokens: COACH_MAX_TOKENS,
          system,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image',
                  source: { type: 'base64', media_type: photo.mimeType, data: photo.base64 },
                },
                { type: 'text', text: question },
              ],
            },
          ],
        },
        parse: parseAnthropic,
      }
    case 'openai':
      return {
        url: 'https://api.openai.com/v1/responses',
        headers: { authorization: `Bearer ${key}` },
        body: {
          model: 'gpt-5.6-luna',
          instructions: system,
          input: [
            {
              role: 'user',
              content: [
                { type: 'input_text', text: question },
                {
                  type: 'input_image',
                  image_url: `data:${photo.mimeType};base64,${photo.base64}`,
                  detail: 'high',
                },
              ],
            },
          ],
          max_output_tokens: COACH_MAX_TOKENS,
        },
        parse: parseOpenAi,
      }
  }
}

async function configuredProvider(): Promise<{ provider: CoachProvider; key: string | undefined }> {
  const settings = createWebSettings()
  const stored = await settings.read<CoachProvider>(COACH_PROVIDER_SETTING)
  const provider =
    stored !== undefined && COACH_PROVIDERS.includes(stored) ? stored : DEFAULT_COACH_PROVIDER
  const key =
    (await settings.read<string>(coachKeySettingFor(provider))) ??
    (provider === 'anthropic'
      ? await settings.read<string>(LEGACY_COACH_KEY_SETTING)
      : undefined)
  return { provider, key }
}

/**
 * Einziger öffentliche Foto→KI-Weg. Aufruf bedeutet: Der Mensch hat gerade
 * ausdrücklich „Foto auswerten“ gedrückt. Kein Caller darf ihn beim Auswählen,
 * Anzeigen oder Speichern eines Fotos automatisch auslösen.
 */
export async function suggestMemoriesFromPhoto(file: File): Promise<RememberSuggestions> {
  const { provider, key } = await configuredProvider()
  if (key === undefined || key.trim() === '') throw new PhotoArchitectError('no-key')
  if (!VISION_PROVIDERS.includes(provider as VisionProvider)) {
    throw new PhotoArchitectError('unsupported-provider')
  }

  const photo = await preparePhoto(file)
  const call = callFor(provider as VisionProvider, key.trim(), photo)
  let response: Response
  try {
    response = await fetch(call.url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...call.headers },
      body: JSON.stringify(call.body),
    })
  } catch {
    throw new PhotoArchitectError('offline')
  }

  const classified = failureForStatus(response.status)
  if (classified !== undefined) throw new PhotoArchitectError(classified)
  if (!response.ok) throw new PhotoArchitectError('failed')

  const answer = call.parse((await response.json()) as unknown).trim()
  if (answer === '') throw new PhotoArchitectError('failed')
  const suggestions = parseArchitectAnswer(answer)
  if (suggestions === undefined) throw new PhotoArchitectError('failed')
  return suggestions
}
