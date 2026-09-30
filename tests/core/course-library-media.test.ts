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
 expect(libraryCaptions('long-words','en','ja')).toBeUndefined()
})
