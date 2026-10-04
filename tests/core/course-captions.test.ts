import { expect,it } from 'vitest'
import { videoCaptions } from '../../src/core/courses/captions.ts'
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
