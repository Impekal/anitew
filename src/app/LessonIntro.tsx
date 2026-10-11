import { useEffect, useRef } from 'react'

/** Local opening; the A sound finishes before lesson narration starts. */
export function LessonIntro({onDone}:{onDone:()=>void}) {
  const done=useRef(onDone)
  done.current=onDone
  const started=useRef(Date.now())
  const finishTimer=useRef<number>()
  const finish=()=>{
    if(finishTimer.current!==undefined)return
    finishTimer.current=window.setTimeout(()=>done.current(),Math.max(0,1300-(Date.now()-started.current)))
  }
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches
  useEffect(()=>{
    // A missing/blocked media decoder must not prevent opening the lesson.
    const timer=window.setTimeout(()=>finish(),reduced?1300:3000)
    return()=>{window.clearTimeout(timer);window.clearTimeout(finishTimer.current)}
  },[reduced])
  return reduced
    ? <div data-lesson-intro="true" aria-label="ANITEW" style={{aspectRatio:'16 / 9',display:'grid',placeItems:'center',background:'#0d1513'}}><img src="/icons/icon-192.png" alt="ANITEW" width="112" height="112" /></div>
    : <video data-lesson-intro="true" src="/course-media/lesson-intro.mp4" aria-label="ANITEW" autoPlay muted playsInline onEnded={finish} onError={finish} />
}
