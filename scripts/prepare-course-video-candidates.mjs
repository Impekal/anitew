// Local review packets only. Does not copy media into public/ or change the catalog.
import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises'
import {resolve,join,relative} from 'node:path'
import {createHash} from 'node:crypto'
import assert from 'node:assert/strict'
import {courseNarration} from '../src/i18n/courseNarrations.ts'
import {courseVideo} from '../src/i18n/courseVideos.ts'
import {videoCaptions} from '../src/core/courses/captions.ts'
const [input,output]=process.argv.slice(2)
assert(input&&output,'Supply preview root and separate packet directory')
const root=resolve(input),dest=resolve(output),entries=[]
const json=async p=>JSON.parse(await readFile(p,'utf8'))
for(const name of await readdir(root)){
 if(!/^atta-.*-(de|en|fr)-video$/.test(name))continue
 const folder=join(root,name,'coach-candidate');let files
 try{files=await readdir(folder)}catch(e){if(e.code==='ENOENT')continue;throw e}
 const t=await json(join(folder,'timeline.json')),p=await json(join(folder,'provenance.json'))
 const n=courseNarration(p.course,p.language,'rafael');assert(n)
 assert.equal(courseVideo(p.course,p.language,'rafael'),undefined)
 assert.equal(n.sha256,p.audioSHA256)
 const page=await readFile(join(folder,'index.html'),'utf8')
 const filename=/<video[^>]* src="([^"]+)"/.exec(page)?.[1];assert(filename&&files.includes(filename))
 const bytes=await readFile(join(folder,filename)),sha256=createHash('sha256').update(bytes).digest('hex')
 assert.equal(sha256,t.videoSHA256??(await json(join(folder,'review.json'))).videoSHA256)
 const start=page.indexOf('const data=');assert(start>=0)
 const text=page.slice(start+11),data=JSON.parse(text.slice(0,text.indexOf(',video=document')))
 assert.equal(data.timeline.cues.length,n.cues.length);assert.equal(data.timeline.duration,t.duration)
 let end=0;for(const c of t.cues){assert(c.start>=end-.00001&&c.end>c.start);end=c.end}
 assert(Math.abs(end-t.duration)<.001)
 const stop=p.course==='story-method'?16:n.cues.findIndex(c=>c.section==='transfer');assert(stop>=0)
 const gate=t.cues[stop].start,dir=join(dest,`${p.course}-${p.language}`);await mkdir(dir,{recursive:true})
 assert.equal(Object.keys(data.captions).length,11)
 const tracks=[]
 for(const [locale,captions] of Object.entries(data.captions)){
  assert.equal(captions.length,t.cues.length)
  const gated=videoCaptions(t.cues,captions,gate),full=videoCaptions(t.cues,captions)
  const ids=[...gated.matchAll(/(?:^|\n)(\d+)\n\d{2}:\d{2}:\d{2}\.\d{3} -->/g)].map(m=>Number(m[1]))
  assert.deepEqual(ids,Array.from({length:stop},(_,i)=>i+1))
  const before=`${locale}-before-exercise.vtt`,after=`${locale}-with-solution.vtt`
  await writeFile(join(dir,before),gated);await writeFile(join(dir,after),full)
  tracks.push({language:locale,beforeExercise:before,withSolution:after})
 }
 const proposedCatalogEntry={course:p.course,coach:'rafael',language:p.language,mime:'video/mp4',src:`/course-media/video/atta-${p.course}-${p.language}-${sha256.slice(0,12)}.mp4`,bytes:bytes.length,sha256,duration:t.duration,cues:t.cues.map(({start,end})=>({start,end})),credits:p.credits,captions:data.captions}
 const packet={status:'prepared-for-review',userApproved:false,catalogChanged:false,sourceVideo:relative(dest,join(folder,filename)),proposedCatalogEntry,tracks,captions:data.captions,recallBoundary:gate,remainingIntegrationWork:['Review complete montage','Copy approved media and register catalog entry','Run offline app playback checks']}
 await writeFile(join(dir,'packet.json'),JSON.stringify(packet,null,2)+'\n')
 entries.push({course:p.course,language:p.language,packet:relative(dest,join(dir,'packet.json')),sha256})
}
assert(entries.length>0)
await writeFile(join(dest,'index.json'),JSON.stringify({status:'prepared-for-review',catalogChanged:false,candidates:entries.length,subtitleFiles:entries.length*22,entries},null,2)+'\n')
console.log(`${entries.length} candidate packets, ${entries.length*22} subtitle files; app catalog unchanged.`)
