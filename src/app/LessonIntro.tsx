import { useEffect, useRef } from 'react'

/** A silent, local opening; lesson audio and cue timing remain untouched. */
export function LessonIntro({onDone}:{onDone:()=>void}) {
  const done=useRef(onDone)
  done.current=onDone
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches
  useEffect(()=>{
    // A missing/blocked media decoder must not prevent opening the lesson.
    const timer=window.setTimeout(()=>done.current(),reduced?1000:3000)
    return()=>window.clearTimeout(timer)
  },[reduced])
  return reduced
    ? <div data-lesson-intro="true" aria-label="ANITEW" style={{aspectRatio:'16 / 9',display:'grid',placeItems:'center',background:'#0d1513'}}><img src="/icons/icon-192.png" alt="ANITEW" width="112" height="112" /></div>
    : <video data-lesson-intro="true" src="/course-media/lesson-intro.mp4" aria-label="ANITEW" autoPlay muted playsInline onEnded={()=>done.current()} onError={()=>done.current()} />
}
