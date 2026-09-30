export const COURSE_AUDIO_CACHE = 'anitew-course-audio-v1'
const PARTIAL_CACHE = 'anitew-course-audio-partial-v1'
export interface DownloadAsset { src:string; bytes:number; sha256:string }
export async function downloaded(asset:DownloadAsset):Promise<boolean> {
 const cache=await caches.open(COURSE_AUDIO_CACHE)
 const response=await cache.match(asset.src)
 return response?.headers.get('X-ANITEW-SHA256')===asset.sha256
}
export async function removeDownload(asset:DownloadAsset){
 await (await caches.open(COURSE_AUDIO_CACHE)).delete(asset.src)
 await (await caches.open(PARTIAL_CACHE)).delete(asset.src)
}
export async function downloadAudio(asset:DownloadAsset,signal:AbortSignal,progress:(bytes:number)=>void){
 const partialCache=await caches.open(PARTIAL_CACHE)
 const previous=await partialCache.match(asset.src)
 let chunks:BlobPart[]=[]
 let received=0
 if(previous?.headers.get('X-ANITEW-SHA256')===asset.sha256){
  const blob=await previous.blob()
  if(blob.size<asset.bytes){chunks=[blob];received=blob.size}
 }
 progress(received)
 try {
  const response=await fetch(asset.src,{signal,headers:received?{Range:`bytes=${received}-`}:{}})
  if(!response.ok||!response.body)throw new Error('Download unavailable')
  if(response.status===200){chunks=[];received=0}
  else if(response.status!==206||!response.headers.get('Content-Range')?.startsWith(`bytes ${received}-`))throw new Error('Invalid resumed response')
  const reader=response.body.getReader()
  for(;;){
   const {done,value}=await reader.read()
   if(done)break
   chunks.push(new Uint8Array(value).buffer);received+=value.byteLength;progress(received)
   if(received>asset.bytes)throw new Error('Unexpected download length')
  }
  signal.throwIfAborted()
  const blob=new Blob(chunks,{type:'audio/mp4'})
  if(blob.size!==asset.bytes)throw new Error('Incomplete audio')
  const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await blob.arrayBuffer())),v=>v.toString(16).padStart(2,'0')).join('')
  if(digest!==asset.sha256){await partialCache.delete(asset.src);chunks=[];throw new Error('Audio checksum mismatch')}
  signal.throwIfAborted()
  await (await caches.open(COURSE_AUDIO_CACHE)).put(asset.src,new Response(blob,{headers:{'Content-Type':'audio/mp4','Content-Length':String(blob.size),'Accept-Ranges':'bytes','X-ANITEW-SHA256':asset.sha256,'X-ANITEW-Offline':'verified'}}))
  await partialCache.delete(asset.src)
 }catch(error){
  if(chunks.length && received<asset.bytes)await partialCache.put(asset.src,new Response(new Blob(chunks),{headers:{'X-ANITEW-SHA256':asset.sha256}})).catch(()=>undefined)
  throw error
 }
}
