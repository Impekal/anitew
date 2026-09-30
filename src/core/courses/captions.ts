/** A local text track lets captions follow native fullscreen video too. */
export function videoCaptions(cues:readonly {start:number;end:number}[],captions:readonly string[]):string {
 const stamp=(seconds:number)=>{
  const ms=Math.round(seconds*1000)
  return `${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}.${String(ms%1000).padStart(3,'0')}`
 }
 const escape=(text:string)=>text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replace(/\n\s*\n/g,'\n')
 return 'WEBVTT\n\n'+cues.map((cue,index)=>`${index+1}\n${stamp(cue.start)} --> ${stamp(cue.end)}\n${escape(captions[index]??'')}\n`).join('\n')
}
