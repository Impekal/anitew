import { expect,it } from 'vitest'
import { videoCaptions } from '../../src/core/courses/captions.ts'
it('creates valid local fullscreen captions and preserves timing across minute boundaries',()=>{
 const text=videoCaptions([{start:59.9996,end:61.005},{start:3600,end:3601}],['3 < 4 & 5\n\nNext','نص عربي'])
 expect(text).toContain('00:01:00.000 --> 00:01:01.005')
 expect(text).toContain('3 &lt; 4 &amp; 5\nNext')
 expect(text).toContain('01:00:00.000 --> 01:00:01.000\nنص عربي')
 expect(text).toMatch(/^WEBVTT\n\n/)
})
