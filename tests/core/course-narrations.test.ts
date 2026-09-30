import {it,expect} from 'vitest'
import {readFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {courseNarrations,courseNarration} from '../../src/i18n/courseNarrations.ts'
import {storyMedia} from '../../src/i18n/storyMedia.ts'
import {courseLibraryMedia} from '../../src/i18n/courseLibraryMedia.ts'
it('retains every German course and registers only reviewed language and coach combinations',()=>{
 const languages=[...new Set(courseNarrations.map(pack=>pack.language))]
 expect(languages).toContain('de')
 const courses=['story-method',...Object.keys(courseLibraryMedia)]
 const expected=[...courses.flatMap(course=>['rafael','lin'].map(coach=>`${course}:${coach}:de`)), 'story-method:rafael:en','story-method:original:en','story-method:rafael:fr']
 expect(courseNarrations.map(pack=>`${pack.course}:${pack.coach}:${pack.language}`).sort()).toEqual(expected.sort())
 const manifest=JSON.parse(readFileSync('public/course-media/coach-narration-manifest.json','utf8')) as {src:string;sha256:string;bytes:number}[]
 expect(manifest.map(({src,sha256,bytes})=>({src,sha256,bytes}))).toEqual(courseNarrations.map(({src,sha256,bytes})=>({src,sha256,bytes})))
})
it('keeps distinct verified local voices and the same lesson cues',()=>{
 expect(courseNarration('story-method','de','rafael')).toBeDefined()
 expect(courseNarration('story-method','de','lin')).toBeDefined()
 expect(courseNarration('story-method','de','original')).toBeUndefined()
 expect(courseNarration('story-method','en','original')?.synthesis).toBe('qwen-openvoice')
 expect(courseNarration('story-method','fr','rafael')?.synthesis).toBe('kyutai-openvoice')
 expect(courseNarration('story-method','en','rafael')?.synthesis).toBe('qwen-own-name')
 expect(courseNarration('story-method','fr','lin')).toBeUndefined()
 expect(courseNarration('story-method','de',null)).toBeUndefined()
 expect(new Set(courseNarrations.map(p=>p.sha256)).size).toBe(courseNarrations.length)
 for(const pack of courseNarrations){
  expect(pack.src).toMatch(/^\/course-media\/library\/[a-z0-9-]+\.m4a$/)
  const audio=readFileSync(`public${pack.src}`)
  expect(audio.length).toBe(pack.bytes)
  expect(createHash('sha256').update(audio).digest('hex')).toBe(pack.sha256)
  const source=pack.course==='story-method'?storyMedia.packs[pack.language]:courseLibraryMedia[pack.course][pack.language]
  expect(pack.cues.map(c=>c.text)).toEqual(source.cues.map(c=>c.text))
  for(const [i,cue] of pack.cues.entries()){
   expect(cue.end).toBeGreaterThan(cue.start)
   if(i)expect(cue.start).toBeGreaterThanOrEqual(pack.cues[i-1].end)
  }
  expect(pack.duration).toBeGreaterThanOrEqual(pack.cues.at(-1)!.end)
  if(pack.course==='story-method')expect(pack.cues[17].start).toBeGreaterThan(pack.cues[16].end)
  else expect(pack.cues.findIndex(cue=>cue.section==='transfer')).toBeGreaterThan(pack.cues.findIndex(cue=>cue.section==='example'))
 }
})
