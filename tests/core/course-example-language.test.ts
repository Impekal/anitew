import { expect, it } from 'vitest'
import { courseVideos } from '../../src/i18n/courseVideos.ts'
import { libraryCaptions } from '../../src/i18n/courseCaptions.ts'
import { courseLibraryMedia } from '../../src/i18n/courseLibraryMedia.ts'

const examples = {
  'long-words': { de: 'Krankenversicherungsbeitrag', en: 'unpredictability', fr: 'incompréhensible' },
  'number-images': { de: 'Tanne', en: 'tin', fr: 'tonne' },
  'keyword-method': { de: 'bell', en: 'pain', fr: 'bell' },
} as const

for (const course of Object.keys(examples) as (keyof typeof examples)[]) {
  it(`${course}: changing subtitle language retains the spoken example in audio and video`, () => {
    for (const spoken of ['de', 'en', 'fr'] as const) {
      const video = courseVideos.find(v => v.course === course && v.language === spoken)!
      const index = courseLibraryMedia[course][spoken].cues.findIndex(c => c.section === 'example')
      expect(index).toBeGreaterThanOrEqual(0)
      for (const [target, lines] of Object.entries(video.captions!)) {
        const marker = examples[course][spoken]
        expect(lines[index], `${spoken} → ${target} video`).toContain(marker)
        expect(libraryCaptions(course, spoken, target)![index], `${spoken} → ${target} audio`).toContain(marker)
      }
    }
  })
}
