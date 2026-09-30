import { expect, it } from 'vitest'
import { MEDIA_SPEEDS, cueAt, mediaPreferences, spokenLanguage } from '../../src/core/courses/media.ts'
import { SUPPORTED_LANGUAGES } from '../../src/core/language.ts'
import { storyMedia } from '../../src/i18n/storyMedia.ts'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

it('defaults primary languages to their narration and all others to English',()=>{
  for(const language of SUPPORTED_LANGUAGES){
    expect(spokenLanguage(language,'auto')).toBe(language==='de'||language==='fr'?language:'en')
    for(const audio of ['de','en','fr'] as const)expect(spokenLanguage(language,audio)).toBe(audio)
    expect(storyMedia.subtitles[language]).toHaveLength(21)
  }
})
it('rejects invalid saved media preferences',()=>{
  for(const value of [null,[],false,{}, {audio:'https://external.test',speed:100}])expect(mediaPreferences(value)).toEqual({audio:'auto',speed:1,view:'read'})
  for(const speed of MEDIA_SPEEDS)expect(mediaPreferences({audio:'fr',speed})).toEqual({audio:'fr',speed,view:'read'})
})
it('keeps local media, cue order and subtitles consistent',()=>{
  for(const pack of Object.values(storyMedia.packs)){
    expect(pack.src).toMatch(/^\/course-media\/story\/(de|en|fr)\.m4a$/)
    expect(pack.cues).toHaveLength(21)
    for(const [index,cue] of pack.cues.entries()){
      expect(cue.end).toBeGreaterThan(cue.start)
      expect(cueAt(pack.cues,cue.start)).toBe(index)
      if(index)expect(cue.start).toBeGreaterThanOrEqual(pack.cues[index-1].end)
    }
    expect(pack.cues[17].start-pack.cues[16].start).toBeGreaterThan(1)
    expect(cueAt(pack.cues,-1)).toBe(-1)
  }
})
it('preserves the accepted German narration byte for byte',()=>{
  const audio=readFileSync('public/course-media/story/de.m4a')
  expect(createHash('sha256').update(audio).digest('hex')).toBe('d32cfdbcb103610d1d387dc32ef8fb4585dd51efbf8db8c0b513d544c455dd80')
})

it('remembers an explicit video choice without enabling it from untrusted strings',()=>{
 expect(mediaPreferences({video:true}).video).toBe(true)
 expect(mediaPreferences({video:'true'}).video).toBeUndefined()
})
