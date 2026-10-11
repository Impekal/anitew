import { expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { courseVideos } from '../../src/i18n/courseVideos.ts'
import { courseNarration } from '../../src/i18n/courseNarrations.ts'

it('publishes sources and exact file identities for every selectable video', () => {
  const catalog = JSON.parse(readFileSync('public/course-media/video/catalog.json', 'utf8'))
  expect(catalog.assets).toEqual(courseVideos.map(({ course, coach, language, presentation, src, bytes, sha256, duration, credits }) => ({
    course, coach, language, presentation: presentation ?? 'coach-and-illustrations',
    src, bytes, sha256, duration, credits,
  })))
})

it('keeps original-language illustrated captions aligned with the actual spoken version', () => {
  for (const video of courseVideos.filter(v => v.presentation === 'illustrated')) {
    const narration = courseNarration(video.course, video.language, video.coach)!
    expect(narration, `${video.course}/${video.language}`).toBeDefined()
    expect(video.captions?.[video.language], `${video.course}/${video.language}`).toEqual(
      narration.cues.map(cue => cue.spokenText ?? cue.text),
    )
    if (video.language === 'fr') {
      expect(narration.synthesis).toBe('qwen-french-shared')
      expect(video.credits.some(credit => /kyutai|fabien|cml-tts/i.test(credit.name))).toBe(false)
    }
  }
})
