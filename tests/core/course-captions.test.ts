import { expect,it } from 'vitest'
import { videoCaptions, playbackCaptions } from '../../src/core/courses/captions.ts'
it('creates valid local fullscreen captions and preserves timing across minute boundaries',()=>{
 const text=videoCaptions([{start:59.9996,end:61.005},{start:3600,end:3601}],['3 < 4 & 5\n\nNext','نص عربي'])
 expect(text).toContain('00:01:00.000 --> 00:01:01.005')
 expect(text).toContain('3 &lt; 4 &amp; 5\nNext')
 expect(text).toContain('01:00:00.000 --> 01:00:01.000\nنص عربي')
 expect(text).toMatch(/^WEBVTT\n\n/)
})


it('omits unreleased answers and clips a cue that crosses the recall boundary',()=>{
 const cues=[{start:0,end:2},{start:2,end:5},{start:5,end:8}]
 const lines=['Introduction','Recall without looking','The answer is lemon']
 const locked=videoCaptions(cues,lines,4)
 expect(locked).toContain('00:00:02.000 --> 00:00:04.000')
 expect(locked).not.toContain('The answer is lemon')
 expect(locked).not.toContain('00:00:05.000')
 expect(videoCaptions(cues,lines)).toContain('The answer is lemon')
})

import { storyMedia } from '../../src/i18n/storyMedia.ts'
import { courseNarrations } from '../../src/i18n/courseNarrations.ts'
it('keeps all eleven story caption tracks within each actual narration and hides the answer until release',()=>{
 const narrations=courseNarrations.filter(n=>n.course==='story-method')
 expect(narrations.length).toBeGreaterThan(0)
 for(const pack of narrations){
  for(const captions of Object.values(storyMedia.subtitles)){
   expect(captions).toHaveLength(pack.cues.length)
   expect(captions.every(line=>line.trim().length>0)).toBe(true)
   let previous=0
   for(const cue of pack.cues){
    expect(cue.start).toBeGreaterThanOrEqual(previous)
    expect(cue.end).toBeGreaterThan(cue.start)
    expect(cue.end).toBeLessThanOrEqual(pack.duration+.001)
    previous=cue.end
   }
   const locked=videoCaptions(pack.cues,captions,pack.cues[16]!.start)
   expect(locked).not.toContain(captions[17])
   expect(videoCaptions(pack.cues,captions)).toContain(captions[17])
  }
 }
})

import { libraryCaptions } from '../../src/i18n/courseCaptions.ts'
import { courseLibraryMedia } from '../../src/i18n/courseLibraryMedia.ts'
import { courseVideo } from '../../src/i18n/courseVideos.ts'
it('retains the narrated recall actions when English examples have German or French captions',()=>{
 const expectations={
  de:{'long-words':['Schreibe','Bedeutung','mündlich','flüssig'],'keyword-method':['französische','Brot','Schreibe','Beispielsatz'],'number-images':['tin','Zahl','Rückweg','Konsonantenlaute']},
  fr:{'long-words':['Écris','sens','voix haute','fluidité'],'keyword-method':['français','Écris','sens','phrase'],'number-images':['tin','nombre','retour','consonnes']},
 }
 for(const target of ['de','fr'] as const){
  for(const course of ['long-words','keyword-method','number-images'] as const){
   const i=courseLibraryMedia[course].en.cues.findIndex(c=>c.section==='recall')
   const audio=libraryCaptions(course,'en',target)![i]!
   const video=courseVideo(course,'en','rafael')!.captions![target]![i]!
   for(const word of expectations[target][course]){
    expect(audio).toContain(word)
    expect(video).toContain(word)
   }
  }
 }
})
it('keeps the long-word spelling instruction tied to the spoken language example',()=>{
 for(const spoken of ['de','en','fr'] as const){
  const index=courseLibraryMedia['long-words'][spoken].cues.findIndex(c=>c.section==='step-2')
  for(const target of ['de','en','fr'] as const){
   const line=libraryCaptions('long-words',spoken,target)![index]!
   if(spoken==='de')expect(line).toContain('Versicherungsbeitrag')
   else expect(line).not.toContain('Versicherungsbeitrag')
   expect(line.length).toBeGreaterThan(20)
  }
 }
})

it('uses complete localized video captions without changing audio or leaking the solution',()=>{
 const audio=['Long words','Try it yourself','Solution']
 const montage=['Welcome to ANITEW. Long words','Try it yourself','Solution']
 const french=['Bienvenue sur ANITEW. Mots longs','À vous','Solution']
 expect(playbackCaptions(audio,montage)).toEqual(montage)
 expect(playbackCaptions(audio,french)).toEqual(french)
 expect(playbackCaptions(audio)).toBe(audio)
 expect(audio[0]).toBe('Long words')
 const cues=[{start:0,end:5},{start:5,end:8},{start:8,end:11}]
 const locked=videoCaptions(cues,playbackCaptions(audio,montage),8)
 expect(locked).toContain('Welcome to ANITEW. Long words')
 expect(locked).not.toContain('Solution')
 expect(videoCaptions(cues,playbackCaptions(audio,montage))).toContain('Solution')
})
it('falls back as a whole for incomplete or blank montage subtitle tracks',()=>{
 const audio=['Title','Practice','Solution']
 for(const invalid of [[],['Only title'],['Title','','Solution'],['Title',' ','Solution'],['Title','Practice','Solution','Extra']]){
  expect(playbackCaptions(audio,invalid)).toBe(audio)
 }
})
