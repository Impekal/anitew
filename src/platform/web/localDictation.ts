export type LocalDictationResult =
  | { readonly status: 'ok'; readonly text: string }
  | { readonly status: 'unavailable' }
  | { readonly status: 'failed' }

type Availability = 'available' | 'downloadable' | 'downloading' | 'unavailable'

interface RecognitionAlternativeLike {
  readonly transcript: string
}

interface RecognitionResultLike {
  readonly length: number
  readonly isFinal?: boolean
  readonly [index: number]: RecognitionAlternativeLike
}

interface RecognitionResultListLike {
  readonly length: number
  readonly [index: number]: RecognitionResultLike
}

interface RecognitionEventLike {
  readonly results: RecognitionResultListLike
}

interface RecognitionLike {
  lang: string
  continuous: boolean
  interimResults: boolean
  processLocally?: boolean
  onresult: ((event: RecognitionEventLike) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
  start(): void
}

interface RecognitionConstructor {
  new (): RecognitionLike
  available?(options: {
    readonly langs: readonly string[]
    readonly processLocally: boolean
  }): Promise<Availability>
}

function recognitionConstructor(): RecognitionConstructor | undefined {
  const scope = globalThis as typeof globalThis & {
    SpeechRecognition?: RecognitionConstructor
    webkitSpeechRecognition?: RecognitionConstructor
  }
  return scope.SpeechRecognition ?? scope.webkitSpeechRecognition
}

/**
 * One short dictation turn that is allowed to run only on-device.
 *
 * ANITEW deliberately does not fall back to remote browser speech services:
 * own material is local-first, so a browser without a confirmed local speech
 * pack gets `unavailable` instead of receiving the user's voice.
 */
export async function dictateLocally(languageTag: string): Promise<LocalDictationResult> {
  const Recognition = recognitionConstructor()
  if (Recognition?.available === undefined) return { status: 'unavailable' }

  let availability: Availability
  try {
    availability = await Recognition.available({
      langs: [languageTag],
      processLocally: true,
    })
  } catch {
    return { status: 'unavailable' }
  }
  if (availability !== 'available') return { status: 'unavailable' }

  return new Promise((resolve) => {
    const recognition = new Recognition()
    if (!('processLocally' in recognition)) {
      resolve({ status: 'unavailable' })
      return
    }

    recognition.lang = languageTag
    recognition.continuous = false
    recognition.interimResults = false
    recognition.processLocally = true
    if (recognition.processLocally !== true) {
      resolve({ status: 'unavailable' })
      return
    }

    let settled = false
    const finish = (result: LocalDictationResult) => {
      if (settled) return
      settled = true
      resolve(result)
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript.trim() ?? ''
      finish(transcript === '' ? { status: 'failed' } : { status: 'ok', text: transcript })
    }
    recognition.onerror = () => finish({ status: 'failed' })
    recognition.onend = () => finish({ status: 'failed' })

    try {
      recognition.start()
    } catch {
      finish({ status: 'failed' })
    }
  })
}
