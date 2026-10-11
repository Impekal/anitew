import { readFileSync, writeFileSync } from 'node:fs'

// Keep the downloadable provenance index aligned with the player catalog.
// The original single-film manifest remains as production history.
const source = readFileSync(new URL('../src/i18n/courseVideos.ts', import.meta.url), 'utf8')
// The declaration has an array type before its initializer.
const initializer = source.indexOf('=', source.indexOf('export const courseVideos:')) + 1
const end = source.indexOf('\nexport function courseVideo', initializer)
const videos = JSON.parse(source.slice(initializer, end).trim())
const catalog = {
  description: 'Locally bundled ANITEW course videos. Technical metadata is not a claim of subjective approval.',
  assets: videos.map(({ course, coach, language, presentation, src, bytes, sha256, duration, credits }) => ({
    course, coach, language, presentation: presentation ?? 'coach-and-illustrations',
    src, bytes, sha256, duration, credits,
  })),
}
writeFileSync(new URL('../public/course-media/video/catalog.json', import.meta.url), JSON.stringify(catalog, null, 2) + '\n')
console.log(`Wrote sources for ${catalog.assets.length} course videos`)
