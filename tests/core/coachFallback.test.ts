import { afterEach, expect, it, vi } from 'vitest'
import { createWebCoach, COACH_ATTEMPT_TIMEOUT_MS } from '../../src/platform/web/coach.ts'
import { cleanCoachKeys, loadCoachKeys, saveCoachKeys } from '../../src/platform/web/coachKeys.ts'
import type { SettingsStore } from '../../src/core/ports.ts'
const question = { system: 'system', question: 'question' }
const success = () => new Response(JSON.stringify({ choices: [{ message: { content: 'answer' } }] }))
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers() })
it('tries same-provider and cross-provider entries in exact order with isolated credentials', async () => {
  const fetcher = vi.fn().mockResolvedValueOnce(new Response('', { status: 429 }))
    .mockResolvedValueOnce(new Response('', { status: 503 })).mockResolvedValueOnce(success())
  vi.stubGlobal('fetch', fetcher)
  const onAttempt = vi.fn()
  const coach = createWebCoach(async () => [
    { provider: 'gemini', key: 'first' }, { provider: 'groq', key: 'second' }, { provider: 'gemini', key: 'third' }, { provider: 'mistral', key: 'fourth' },
  ])
  // Third responds in the wrong format, so the fourth must take over.
  fetcher.mockResolvedValueOnce(success())
  expect(await coach.ask({ ...question, onAttempt })).toBe('answer')
  expect(onAttempt.mock.calls.map(([entry]) => entry.position)).toEqual([1, 2, 3, 4])
  const calls = fetcher.mock.calls
  expect(calls[0]![1].headers['x-goog-api-key']).toBe('first')
  expect(calls[1]![1].headers.authorization).toBe('Bearer second')
  expect(calls[2]![1].headers['x-goog-api-key']).toBe('third')
  for (const [url, options] of calls) {
    expect(url).not.toMatch(/first|second|third|fourth/)
    expect(options.body).not.toMatch(/first|second|third|fourth/)
    expect(options.redirect).toBe('error')
  }
})
it('skips a rate-limited key until Retry-After expires, then restores priority', async () => {
  vi.useFakeTimers()
  const fetcher = vi.fn().mockResolvedValueOnce(new Response('', { status: 429, headers: { 'retry-after': '60' } })).mockImplementation(async () => success())
  vi.stubGlobal('fetch', fetcher)
  const coach = createWebCoach(async () => [{ provider: 'groq', key: 'a' }, { provider: 'groq', key: 'b' }])
  await coach.ask(question); await coach.ask(question)
  expect(fetcher.mock.calls.map(([, options]) => options.headers.authorization)).toEqual(['Bearer a', 'Bearer b', 'Bearer b'])
  await vi.advanceTimersByTimeAsync(60_000)
  await coach.ask(question)
  expect(fetcher.mock.lastCall?.[1].headers.authorization).toBe('Bearer a')
})
it('aborts a hanging attempt and uses the next key', async () => {
  vi.useFakeTimers()
  const fetcher = vi.fn().mockImplementationOnce(() => new Promise(() => {})).mockResolvedValueOnce(success())
  vi.stubGlobal('fetch', fetcher)
  const pending = createWebCoach(async () => [{ provider: 'groq', key: 'a' }, { provider: 'groq', key: 'b' }]).ask(question)
  await vi.advanceTimersByTimeAsync(COACH_ATTEMPT_TIMEOUT_MS)
  expect(await pending).toBe('answer')
  expect(fetcher.mock.calls[0]![1].signal.aborted).toBe(true)
})
it('falls back on empty, invalid structured answers and network failure', async () => {
  const fetcher = vi.fn().mockRejectedValueOnce(new TypeError('network'))
    .mockResolvedValueOnce(new Response('{}')).mockResolvedValueOnce(success())
    .mockResolvedValueOnce(new Response(JSON.stringify({ choices: [{ message: { content: '{"nodes":[]}' } }] })))
  vi.stubGlobal('fetch', fetcher)
  const coach = createWebCoach(async () => ['a','b','c','d'].map(key => ({ provider: 'groq', key })))
  expect(await coach.ask({ ...question, accepts: answer => answer.startsWith('{') })).toBe('{"nodes":[]}')
  expect(fetcher).toHaveBeenCalledTimes(4)
})
function settings(values: Record<string, unknown>): SettingsStore {
  return { read: async <T>(key: string) => values[key] as T | undefined,
    write: async (key, value) => { values[key] = value }, remove: async key => { delete values[key] } }
}
it('migrates selected legacy provider first and never resurrects deleted entries', async () => {
  const values = { 'coach.provider': 'groq', 'coach.key.gemini': 'g', 'coach.key.groq': 'q', 'coach.key': 'legacy' }
  const store = settings(values)
  expect((await loadCoachKeys(store)).map(entry => entry.provider)).toEqual(['groq', 'gemini', 'anthropic'])
  await saveCoachKeys(store, [])
  expect(await loadCoachKeys(store)).toEqual([])
  expect(values).toEqual({ 'coach.provider': 'groq', 'coach.keys': [] })
})
it('preserves legacy keys if saving fails and rejects duplicates and unknown providers', async () => {
  const store = settings({ 'coach.key.groq': 'q' })
  store.write = async () => { throw new Error('quota') }
  await expect(saveCoachKeys(store, [])).rejects.toThrow('quota')
  expect((await loadCoachKeys(store))[0]?.key).toBe('q')
  expect(cleanCoachKeys([{ id: 'a', provider: 'groq', key: ' x ' }, { id: 'b', provider: 'groq', key: 'x' }, { id: 'c', provider: 'unknown', key: 'q' }])).toHaveLength(1)
})
