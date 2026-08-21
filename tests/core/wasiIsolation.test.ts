import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('C10 browser WASI deployment isolation', () => {
  it('ships the cross-origin isolation headers required by the local optimizer worker', () => {
    const headers = readFileSync(new URL('../../public/_headers', import.meta.url), 'utf8')

    expect(headers).toContain('Cross-Origin-Opener-Policy: same-origin')
    expect(headers).toContain('Cross-Origin-Embedder-Policy: require-corp')
  })
})
