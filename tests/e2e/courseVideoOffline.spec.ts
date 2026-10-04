import { expect, test } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { visit } from './helpers.ts'

// Synthetic two-second color pattern and tone, never included in the app catalog.
// Created with FFmpeg testsrc2 + sine; no coach or third-party media.
const bytes = readFileSync(new URL('../fixtures/course-offline.mp4', import.meta.url))
const src = '/course-media/video/offline-fixture.mp4'
const sha256 = createHash('sha256').update(bytes).digest('hex')

test('verified video supports offline restart, native seeking, byte ranges and removal', async ({ page, context }) => {
  test.setTimeout(60_000)
  await visit(page)
  await page.evaluate(async ({ src, data, sha256 }) => {
    await navigator.serviceWorker.ready
    if (!navigator.serviceWorker.controller) await new Promise<void>(resolve =>
      navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true }))
    // Reproduce the verified cache entry written by downloadAudio. Its checksum
    // and interrupted-download behavior have separate unit coverage.
    const body = Uint8Array.from(atob(data), char => char.charCodeAt(0))
    await (await caches.open('anitew-course-audio-v1')).put(src, new Response(body, {
      headers: { 'Content-Type': 'video/mp4', 'Content-Length': String(body.length),
        'Accept-Ranges': 'bytes', 'X-ANITEW-SHA256': sha256, 'X-ANITEW-Offline': 'verified' },
    }))
  }, { src, data: bytes.toString('base64'), sha256 })
  await context.setOffline(true)
  try {
    await page.reload()
    const readRange = (range: string) => page.evaluate(async ({ src, range }) => {
      const response = await fetch(src, { headers: { Range: range } })
      return { status: response.status, type: response.headers.get('Content-Type'),
        range: response.headers.get('Content-Range'), body: Array.from(new Uint8Array(await response.arrayBuffer())) }
    }, { src, range })
    for (const [range, start, end] of [
      ['bytes=100-199', 100, 200], ['bytes=-64', bytes.length - 64, bytes.length],
      [`bytes=${bytes.length - 32}-`, bytes.length - 32, bytes.length],
    ] as const) {
      const result = await readRange(range)
      expect(result.status).toBe(206)
      expect(result.type).toBe('video/mp4')
      expect(result.range).toBe(`bytes ${start}-${end - 1}/${bytes.length}`)
      expect(result.body).toEqual(Array.from(bytes.subarray(start, end)))
    }
    expect((await readRange(`bytes=${bytes.length + 1}-`)).status).toBe(416)
    await page.evaluate(src => {
      const video = document.createElement('video')
      video.id = 'offline-video-fixture'; video.muted = true; video.playsInline = true
      video.src = src; document.body.append(video); video.load()
    }, src)
    const video = page.locator('#offline-video-fixture')
    await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.readyState)).toBeGreaterThanOrEqual(2)
    expect(await video.evaluate((el: HTMLVideoElement) => el.duration)).toBeCloseTo(2, 1)
    await video.evaluate((el: HTMLVideoElement) => { el.currentTime = 1 })
    await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.seeking)).toBe(false)
    await video.evaluate((el: HTMLVideoElement) => el.play())
    await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime)).toBeGreaterThan(1.2)
    await video.evaluate((el: HTMLVideoElement) => { el.pause(); el.removeAttribute('src'); el.load(); el.remove() })
    await page.evaluate(async src => { await (await caches.open('anitew-course-audio-v1')).delete(src) }, src)
    expect(await page.evaluate(async src => {
      try { const response = await fetch(src); return response.ok } catch { return false }
    }, src)).toBe(false)
  } finally {
    await context.setOffline(false)
  }
})
