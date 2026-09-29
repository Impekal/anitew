import { expect, test } from '@playwright/test'
import { faceFor } from '../../src/core/content/faces.ts'
import { namePool } from '../../src/core/content/names.ts'
import { visit } from './helpers.ts'

const names = [...new Set(['de', 'en', 'fr', 'es'].flatMap(language => namePool(language as 'de')))]
const sources = names.map(name => faceFor(name)!.src)

test('alle Portraitfotos sind schon vor dem ersten Anzeigen offline verfügbar', async ({ page, context }) => {
  test.setTimeout(60_000)
  const externalImages: string[] = []
  context.on('request', request => {
    if (request.resourceType() === 'image' && new URL(request.url()).origin !== 'http://127.0.0.1:4173') {
      externalImages.push(request.url())
    }
  })
  await visit(page)
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  await page.close()
  await context.setOffline(true)
  try {
    const offline = await context.newPage()
    await offline.goto('/', { waitUntil: 'commit' })
    const results = await offline.evaluate(async urls => {
      return await Promise.all(urls.map(async src => {
        const image = new Image()
        image.src = src
        await image.decode()
        return { src: image.currentSrc, width: image.naturalWidth, height: image.naturalHeight }
      }))
    }, sources)
    expect(results).toHaveLength(186)
    expect(new Set(results.map(result => result.src)).size).toBe(186)
    expect(results.every(result => result.width === 320 && result.height === 400)).toBe(true)
    expect(externalImages).toEqual([])
    await offline.goto('/portraits/credits.html')
    await expect(offline.getByRole('heading', { name: 'Portraits · Photo credits' })).toBeVisible()
  } finally {
    await context.setOffline(false)
  }
})
