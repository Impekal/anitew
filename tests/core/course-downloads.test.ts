import { afterEach,expect,it,vi } from 'vitest'
import { webcrypto } from 'node:crypto'
import { COURSE_AUDIO_CACHE,downloadAudio,downloaded,removeDownload } from '../../src/app/courseDownloads.ts'
afterEach(()=>vi.unstubAllGlobals())
it('resumes an interrupted download, verifies it, then removes both complete and partial copies',async()=>{
 const stores=new Map<string,Map<string,Response>>()
 vi.stubGlobal('crypto',webcrypto)
 vi.stubGlobal('caches',{open:async(name:string)=>{
  if(!stores.has(name))stores.set(name,new Map())
  const data=stores.get(name)!
  return {match:async(url:string)=>data.get(url)?.clone(),put:async(url:string,response:Response)=>{data.set(url,response.clone())},delete:async(url:string)=>data.delete(url)}
 }})
 const content=new TextEncoder().encode('complete local media bytes')
 const hash=Array.from(new Uint8Array(await webcrypto.subtle.digest('SHA-256',content)),v=>v.toString(16).padStart(2,'0')).join('')
 const asset={src:'/course-media/library/test.m4a',bytes:content.length,sha256:hash}
 const abort=new AbortController()
 const fetchMock=vi.fn(async(_url:string,options:RequestInit)=>{
  if(!options.headers || !('Range' in options.headers))return new Response(new ReadableStream({start(controller){controller.enqueue(content.slice(0,8));options.signal!.addEventListener('abort',()=>controller.error(options.signal!.reason),{once:true})}}))
  expect(options.headers).toEqual({Range:'bytes=8-'})
  return new Response(content.slice(8),{status:206,headers:{'Content-Range':`bytes 8-${content.length-1}/${content.length}`}})
 })
 vi.stubGlobal('fetch',fetchMock)
 await expect(downloadAudio(asset,abort.signal,bytes=>{if(bytes===8)abort.abort()})).rejects.toBeDefined()
 expect(await downloaded(asset)).toBe(false)
 await downloadAudio(asset,new AbortController().signal,()=>undefined)
 expect(fetchMock).toHaveBeenCalledTimes(2)
 expect(await downloaded(asset)).toBe(true)
 expect(await stores.get(COURSE_AUDIO_CACHE)!.get(asset.src)!.text()).toBe('complete local media bytes')
 await removeDownload(asset)
 expect(await downloaded(asset)).toBe(false)
 for(const store of stores.values())expect(store.has(asset.src)).toBe(false)
})
it('never labels corrupted media as downloaded',async()=>{
 const put=vi.fn(),remove=vi.fn()
 vi.stubGlobal('crypto',webcrypto)
 vi.stubGlobal('caches',{open:async()=>({match:async()=>undefined,put,delete:remove})})
 vi.stubGlobal('fetch',async()=>new Response('wrong'))
 await expect(downloadAudio({src:'/test',bytes:5,sha256:'invalid'},new AbortController().signal,()=>undefined)).rejects.toThrow('checksum')
 expect(put).not.toHaveBeenCalled()
})
