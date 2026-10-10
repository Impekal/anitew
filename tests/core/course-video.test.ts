import {expect,it} from 'vitest'
import {readFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {courseVideos,courseVideo} from '../../src/i18n/courseVideos.ts'
import {courseNarration} from '../../src/i18n/courseNarrations.ts'
import {videoCaptions} from '../../src/core/courses/captions.ts'
import {storyMedia} from '../../src/i18n/storyMedia.ts'
it('retains the complete Atta English video alongside approved French illustrations',()=>{
 expect(courseVideos).toHaveLength(9)
 const video=courseVideo('story-method','en','rafael')!
 expect(video).toBeDefined()
 expect(video.src).toMatch(/^\/course-media\/video\/atta-story-en-[a-f0-9]+\.mp4$/)
 const bytes=readFileSync(`public${video.src}`)
 expect(bytes.length).toBe(video.bytes)
 expect(createHash('sha256').update(bytes).digest('hex')).toBe(video.sha256)
 expect(video.credits.some(c=>c.name==='Created with WanGP')).toBe(true)
 for(const coach of ['original','lin','rafael'] as const)expect(courseVideo('story-method','de',coach)).toBeUndefined()
 expect(courseVideo('story-method','en','lin')).toBeUndefined()
})
it('uses the edited timeline for all 21 captions and keeps answers after the exercise',()=>{
 const video=courseVideo('story-method','en','rafael')!
 const narration=courseNarration('story-method','en','rafael')!
 expect(video.cues).toHaveLength(narration.cues.length)
 expect(video.duration).toBeGreaterThan(narration.duration)
 expect(video.cues[16].start).toBeGreaterThan(narration.cues[16].start)
 for(const [i,cue] of video.cues.entries()){
  expect(cue.end).toBeGreaterThan(cue.start)
  if(i)expect(cue.start).toBeGreaterThanOrEqual(video.cues[i-1].end)
 }
 expect(video.cues.at(-1)!.end).toBe(video.duration)
 for(const captions of Object.values(storyMedia.subtitles)){
  const gated=videoCaptions(video.cues,captions,video.cues[16].start)
  expect(gated).toContain(captions[15].replaceAll('&','&amp;'))
  expect(gated).not.toContain(captions[17])
 }
})

it('bundles the eight approved French visual courses for every coach with complete subtitles and a safe practice boundary',()=>{
 const videos=courseVideos.filter(v=>v.presentation==='illustrated')
 expect(videos).toHaveLength(8)
 for(const v of videos){
  const bytes=readFileSync(`public${v.src}`)
  expect(createHash('sha256').update(bytes).digest('hex')).toBe(v.sha256)
  expect(bytes.length).toBe(v.bytes)
  expect(v.src).toMatch(/^\/course-media\/video\/.*\.mp4$/)
  for(const coach of ['original','lin','rafael',null] as const)expect(courseVideo(v.course,'fr',coach)).toBe(v)
  const n=courseNarration(v.course,'fr','rafael')!
  expect(v.cues).toHaveLength(n.cues.length)
  expect(Object.keys(v.captions!)).toHaveLength(11)
  for(const lines of Object.values(v.captions!))expect(lines).toHaveLength(v.cues.length)
  expect(v.recallBoundary).toBeGreaterThan(v.cues.at(-2)!.start)
  expect(v.recallBoundary).toBeLessThan(v.cues.at(-1)!.start)
  expect(v.credits.some(c=>c.name.includes('MultiTalk'))).toBe(false)
 }
})
