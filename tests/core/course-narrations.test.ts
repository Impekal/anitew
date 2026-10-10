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
 const expected=courses.flatMap(course=>[`${course}:rafael:de`,`${course}:lin:de`,`${course}:rafael:en`,`${course}:original:en`,`${course}:rafael:fr`,`${course}:lin:en`,`${course}:lin:fr`])
 expect(courseNarrations.map(pack=>`${pack.course}:${pack.coach}:${pack.language}`).sort()).toEqual(expected.sort())
 const manifest=JSON.parse(readFileSync('public/course-media/coach-narration-manifest.json','utf8')) as {src:string;sha256:string;bytes:number}[]
 expect(manifest.map(({src,sha256,bytes})=>({src,sha256,bytes}))).toEqual(courseNarrations.map(({src,sha256,bytes})=>({src,sha256,bytes})))
})
it('keeps distinct verified local voices and the same lesson cues',()=>{
 expect(courseNarration('story-method','de','rafael')).toBeDefined()
 expect(courseNarration('story-method','de','lin')).toBeDefined()
 expect(courseNarration('story-method','de','original')).toBeUndefined()
 expect(courseNarration('story-method','en','original')?.synthesis).toBe('qwen-openvoice')
 expect(courseNarration('story-method','fr','rafael')?.synthesis).toBe('qwen-french-shared')
 expect(courseNarration('story-method','en','rafael')?.synthesis).toBe('qwen-own-name')
 expect(courseNarration('story-method','fr','lin')).toBe(courseNarration('story-method','fr','rafael'))
 expect(courseNarration('story-method','fr','original')).toBe(courseNarration('story-method','fr','rafael'))
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

it('uses the approved shared French voice for every French course',()=>{
 const french=courseNarrations.filter(p=>p.coach==='rafael'&&p.language==='fr')
 expect(french).toHaveLength(12)
 expect(french.every(p=>p.synthesis==='qwen-french-shared')).toBe(true)
 const story=french.find(p=>p.course==='story-method')!
 expect(story.synthesis).toBe('qwen-french-shared')
 expect(story.cues[3].spokenText).toContain('mémorisation. Elle relie')
 expect(story.cues[4].spokenText).toContain('un ordre. Par exemple')
 expect(story.cues[7].spokenText).toContain('Ton objectif est de retrouver')
})

it('shares upgraded French narration across coach choices without changing other languages',()=>{
 for(const course of courseNarrations.filter(p=>p.language==='fr'&&p.coach==='rafael').map(p=>p.course)){
  const shared=courseNarration(course,'fr','rafael')
  for(const coach of ['original','lin',null] as const)expect(courseNarration(course,'fr',coach)).toBe(shared)
  expect(shared?.synthesis).toBe('qwen-french-shared')
 }
 expect(courseNarration('story-method','en','lin')).not.toBe(courseNarration('story-method','en','rafael'))
})

it('keeps German brand-name passages in the selected synthetic coach voice',()=>{
 const named=courseNarrations.filter(p=>p.language==='de'&&p.cues.some(c=>c.text.includes('ANITEW')))
 expect(named).toHaveLength(4)
 const manifest=JSON.parse(readFileSync('public/course-media/coach-narration-manifest.json','utf8')) as {src:string;nameSplice?:boolean}[]
 for(const pack of named){
  expect(pack.synthesis).toBe('qwen-own-name')
  expect(manifest.find(entry=>entry.src===pack.src)?.nameSplice).toBe(false)
 }
})
