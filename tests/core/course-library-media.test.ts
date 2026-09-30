import { expect,it } from 'vitest'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { courseLibraryMedia } from '../../src/i18n/courseLibraryMedia.ts'
import { COURSE_IDS } from '../../src/core/courses/progress.ts'
it('bundles every remaining course with three aligned, intact local narration tracks',()=>{
 expect(Object.keys(courseLibraryMedia).sort()).toEqual(COURSE_IDS.filter(id=>id!=='story-method').sort())
 for(const [id,packs] of Object.entries(courseLibraryMedia))for(const language of ['de','en','fr'] as const){
  const pack=packs[language]
  expect(pack.course).toBe(id)
  if(pack.cues.some(cue=>cue.text.includes('ANITEW')))expect('nameReference' in pack && pack.nameReference).toBe('approved-v14')
  expect(pack.cues.map(cue=>cue.section)).toEqual(packs.de.cues.map(cue=>cue.section))
  expect(pack.cues[1].section).toBe('purpose')
  expect(pack.cues[2].section).toBe('limit')
  expect(pack.cues.findIndex(cue=>cue.section==='example')).toBeGreaterThan(2)
  const audio=readFileSync(`public${pack.src}`)
  expect(audio.length).toBe(pack.bytes)
  expect(createHash('sha256').update(audio).digest('hex')).toBe(pack.sha256)
  expect(pack.duration).toBeGreaterThan(40)
 }
})

import { libraryCaptions } from '../../src/i18n/courseCaptions.ts'
it('keeps caption cues aligned and preserves the actual language-specific mnemonic',()=>{
 for(const id of COURSE_IDS.filter(id=>id!=='story-method'))for(const audio of ['de','en','fr'] as const)for(const target of ['de','en','fr'] as const){
  const lines=libraryCaptions(id,audio,target)!
  expect(lines).toHaveLength(courseLibraryMedia[id][audio].cues.length)
  expect(lines.every(line=>line.trim().length>0)).toBe(true)
 }
 expect(libraryCaptions('long-words','en','de')!.join(' ')).toContain('unpredictability')
 expect(libraryCaptions('keyword-method','en','de')!.join(' ')).toContain('Je mange du pain.')
 expect(libraryCaptions('number-images','de','fr')!.join(' ')).toContain('Tanne')
 expect(libraryCaptions('long-words','en','unknown')).toBeUndefined()
})

it('provides all caption languages without changing spelling targets, fractions or list items',()=>{
 for(const id of COURSE_IDS.filter(id=>id!=='story-method'))for(const spoken of ['de','en','fr'] as const)for(const language of ['de','en','fr','es','it','pt','nl','tr','ar','zh','ja']){
  const cues=courseLibraryMedia[id][spoken].cues
  const captions=libraryCaptions(id,spoken,language)!
  expect(captions).toHaveLength(cues.length)
  expect(captions.every(line=>line.trim().length>0)).toBe(true)
  const example=captions[cues.findIndex(cue=>cue.section==='example')]!
  if(id==='long-words')expect(example).toBe(cues.find(cue=>cue.section==='example')!.text)
  if(id==='self-explanation')expect(example.replaceAll(' ','')).toContain('3/4=6/8')
  if(id==='meaningful-groups')expect(example.split('·')).toHaveLength(9)
  if(id==='keyword-method')expect(example).toContain(spoken==='en'?'Je mange du pain.':'The bell rings.')
  if(id==='number-images')expect(example).toContain({de:'Tanne',en:'tin',fr:'tonne'}[spoken])
 }
})
