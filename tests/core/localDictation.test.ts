import { afterEach, describe, expect, it } from 'vitest'

import { dictateLocally } from '../../src/platform/web/localDictation.ts'

type SpeechScope = typeof globalThis & {
  SpeechRecognition?: unknown
  webkitSpeechRecognition?: unknown
}

const scope = globalThis as SpeechScope

afterEach(() => {
  delete scope.SpeechRecognition
  delete scope.webkitSpeechRecognition
})

describe('local-only dictation runtime', () => {
  it('starts recognition only after confirmed on-device availability', async () => {
    const availableCalls: unknown[] = []
    let starts = 0

    class Recognition {
      static async available(options: unknown) {
        availableCalls.push(options)
        return 'available' as const
      }

      lang = ''
      continuous = true
      interimResults = true
      processLocally = false
      onresult: ((event: any) => void) | null = null
      onerror: (() => void) | null = null
      onend: (() => void) | null = null

      start() {
        starts += 1
        if (this.processLocally !== true) throw new Error('remote fallback attempted')
        queueMicrotask(() => {
          this.onresult?.({
            results: {
              0: { 0: { transcript: 'Notrufnummer: 112' }, length: 1, isFinal: true },
              length: 1,
            },
          })
        })
      }
    }

    scope.SpeechRecognition = Recognition

    await expect(dictateLocally('de-DE')).resolves.toEqual({
      status: 'ok',
      text: 'Notrufnummer: 112',
    })
    expect(availableCalls).toEqual([{ langs: ['de-DE'], processLocally: true }])
    expect(starts).toBe(1)
  })

  it('refuses downloadable or remote-only recognition instead of falling back to cloud speech', async () => {
    let starts = 0

    class Recognition {
      static async available() {
        return 'downloadable' as const
      }

      lang = ''
      continuous = false
      interimResults = false
      processLocally = false
      onresult = null
      onerror = null
      onend = null

      start() {
        starts += 1
      }
    }

    scope.SpeechRecognition = Recognition

    await expect(dictateLocally('de-DE')).resolves.toEqual({ status: 'unavailable' })
    expect(starts).toBe(0)
  })

  it('is unavailable when the browser cannot prove local speech recognition', async () => {
    await expect(dictateLocally('de-DE')).resolves.toEqual({ status: 'unavailable' })
  })
})
