import { useEffect, useRef, useState } from 'react'
import type { Language, Platform } from '../core/index.ts'
import { MEDIA_SETTINGS_KEY, MEDIA_SPEEDS, cueAt, mediaPreferences, spokenLanguage, type MediaPreferences } from '../core/courses/media.ts'
import { storyMedia } from '../i18n/storyMedia.ts'
import { courseMediaUi } from '../i18n/courseMediaUi.ts'
import { libraryCaptions } from '../i18n/courseCaptions.ts'
import { courseLibraryMedia } from '../i18n/courseLibraryMedia.ts'
import { CourseIllustration } from './CourseIllustration.tsx'
import { CourseDownload } from './CourseDownload.tsx'
import type { CourseId } from '../core/courses/progress.ts'
import { courseLanguage } from '../i18n/courseUi.ts'

export interface NarratedLesson { example:string;prompt:string;language:Language;purpose:string;limit:string;steps:string[];explanation:string }

export function StoryCourseMedia({language,platform,solution=false,onRecall,courseId,courseTitle,onMaterial,onPresentation}:{onMaterial?:(material:NarratedLesson|undefined)=>void;onPresentation:(enabled:boolean)=>void;language:Language;platform:Platform;solution?:boolean;onRecall:(material?:NarratedLesson)=>void;courseId:CourseId;courseTitle:string}) {
  const locale=courseLanguage(language)
  const t={...courseMediaUi[locale],title:courseTitle}
  const [preferences,setPreferences]=useState(()=>mediaPreferences(null))
  const [ready,setReady]=useState(false)
  const [saving,setSaving]=useState(false)
  const [enabled,setEnabled]=useState(false)
  const [time,setTime]=useState(0)
  const [error,setError]=useState('')
  const audio=useRef<HTMLAudioElement>(null)
  const spoken=spokenLanguage(language,preferences.audio)
  const library=courseId==='story-method'?undefined:courseLibraryMedia[courseId]
  const pack=library?library[spoken]:storyMedia.packs[spoken]
  const translated=courseId!=='story-method'?libraryCaptions(courseId,spoken,language):undefined
  const subtitleLanguage=library?(translated?language:spoken):language
  const captions=library?translated??library[spoken].cues.map(cue=>cue.text):storyMedia.subtitles[language]
  const exampleIndex=library?library[spoken].cues.findIndex(cue=>cue.section==='example'):8
  const stopIndex=library?library[spoken].cues.findIndex(cue=>cue.section==='transfer'):16
  const gate=pack.cues[library?exampleIndex:17].start
  const recallBoundary=pack.cues[stopIndex].start
  const cue=cueAt(pack.cues,time)
  const safeCue=!solution && cue>=stopIndex ? -1 : cue
  useEffect(()=>{
    let active=true
    void platform.settings.read(MEDIA_SETTINGS_KEY).then(value=>{if(active){const saved=mediaPreferences(value);setPreferences(saved);setEnabled(saved.view==='listen')}}).catch(()=>{if(active)setError(t.saveFailed)}).finally(()=>{if(active)setReady(true)})
    return()=>{active=false}
  },[platform,t.saveFailed])
  useEffect(()=>{
    const element=audio.current
    return()=>{element?.pause()}
  },[enabled,spoken])
  async function save(next:MediaPreferences) {
    audio.current?.pause();setTime(0);setPreferences(next);setSaving(true);setError('')
    try {await platform.settings.write(MEDIA_SETTINGS_KEY,next)} catch {setError(t.saveFailed)} finally {setSaving(false)}
  }
  function material():NarratedLesson|undefined {
    if(!library)return undefined
    const cues=library[spoken].cues
    const text=(section:string)=>captions[cues.findIndex(cue=>cue.section===section)]??''
    return {example:library[spoken].cues[exampleIndex].text,prompt:text('recall'),language:spoken,purpose:text('purpose'),limit:text('limit'),steps:cues.flatMap((cue,index)=>cue.section.startsWith('step-')?[captions[index]]:[]),explanation:text('explanation')}
  }
  useEffect(()=>{
    onPresentation(enabled)
    if(enabled)onMaterial?.(material())
    return()=>onPresentation(false)
  },[enabled,spoken,courseId,onMaterial,onPresentation])
  function recall() { audio.current?.pause();onRecall(material()) }
  function sync() {
    const element=audio.current
    if(!element)return
    if(!solution && element.currentTime>=recallBoundary){element.pause();recall();return}
    setTime(element.currentTime)
  }
  function seek(index:number){if(audio.current){audio.current.currentTime=pack.cues[index].start;setTime(pack.cues[index].start)}}
  return <section className="course-media" aria-label={t.title}>
    <h4>{t.title}</h4><p className="hint">{t.note}</p>
    <p className="hint">{locale==='de'?'Tonspur':locale==='fr'?'Piste audio':'Audio'}: {Math.floor(Math.ceil(pack.duration/preferences.speed)/60)}:{String(Math.ceil(pack.duration/preferences.speed)%60).padStart(2,'0')} · {locale==='de'?'Übungszeit zusätzlich':locale==='fr'?'temps de pratique en plus':'plus practice time'}</p>
    <button type="button" aria-pressed={enabled} disabled={!ready} onClick={()=>{audio.current?.pause();setTime(0);setEnabled(!enabled);void save({...preferences,view:enabled?'read':'listen'})}}>{enabled?t.read:t.listen}</button>
    {enabled && <>
      <fieldset disabled={saving}><legend className="course-sr-only">{t.title}</legend>
        <label htmlFor="course-audio-language">{t.audio}</label>
        <select id="course-audio-language" value={preferences.audio} onChange={e=>void save(mediaPreferences({...preferences,audio:e.target.value}))}>
          <option value="auto">{t.auto}</option><option value="de">Deutsch</option><option value="en">English</option><option value="fr">Français</option>
        </select>
        <label htmlFor="course-speed">{t.speed}</label>
        <select id="course-speed" value={preferences.speed} onChange={e=>{
          const speed=Number(e.target.value);setPreferences({...preferences,speed});if(audio.current)audio.current.playbackRate=speed
          setSaving(true);void platform.settings.write(MEDIA_SETTINGS_KEY,{...preferences,speed}).catch(()=>setError(t.saveFailed)).finally(()=>setSaving(false))
        }}>{MEDIA_SPEEDS.map(speed=><option key={speed} value={speed}>{speed}×</option>)}</select>
      </fieldset>
      <p className="hint">{t.captions}: {subtitleLanguage.toUpperCase()} · {t.draft}</p>
      {library && <CourseDownload key={pack.src} asset={library[spoken]} locale={locale} />}
      {library && language!==subtitleLanguage && <p className="hint">The translated subtitles for this audio track are being prepared. Its original spoken text is shown here.</p>}
      <audio key={spoken} ref={audio} controls crossOrigin="anonymous" preload="none" src={pack.src} aria-label={t.title} onError={()=>setError(t.failed)} onTimeUpdate={sync} onSeeking={sync} onSeeked={sync} onPlay={sync} onLoadedMetadata={()=>{
        if(audio.current){audio.current.playbackRate=preferences.speed;audio.current.preservesPitch=true;if(solution){audio.current.currentTime=gate;setTime(gate)}}
      }}/>
      <div className="course-media-chapters">
        <button type="button" onClick={()=>seek(0)}>{t.intro}</button>
        <button type="button" onClick={()=>seek(exampleIndex)}>{t.example}</button>
        {!solution && <button type="button" onClick={()=>{recall()}}>{t.exercise}</button>}
      </div>
      {!library && safeCue>=8 && safeCue<=13 && <svg className={`story-illustration story-step-${safeCue}`} viewBox="0 0 330 115" aria-hidden="true">
        <g className="story-key" fill="none" stroke="currentColor" strokeWidth="6"><circle cx="35" cy="48" r="18"/><path d="M53 48h40v13m-14-13v13"/></g>
        <path d="M110 54h24m-8-7 8 7-8 7" fill="none" stroke="currentColor" strokeWidth="3"/>
        <ellipse cx="163" cy="53" rx="23" ry="30" fill="#d1b951" stroke="currentColor" strokeWidth="2" transform="rotate(25 163 53)"/>
        <g className="story-juice" fill="#d1b951"><circle cx="191" cy="44" r="3"/><circle cx="201" cy="51" r="3"/><circle cx="211" cy="60" r="3"/></g>
        <g fill="none" stroke="currentColor" strokeWidth="3"><circle cx="247" cy="76" r="21"/><circle cx="303" cy="76" r="21"/><path d="m247 76 16-31 18 31h-34l37-25 19 25m-19-25-4-14h12m-35 8h17"/></g>
      </svg>}
      {library && safeCue>=exampleIndex && safeCue<stopIndex && <CourseIllustration id={courseId} locale={spoken} />}
      <p className="course-caption" lang={subtitleLanguage} dir={subtitleLanguage==='ar'?'rtl':'ltr'}>{safeCue>=0?captions[safeCue]:''}</p>
      <details><summary>{t.transcript}</summary><div lang={subtitleLanguage} dir={subtitleLanguage==='ar'?'rtl':'ltr'}>{captions.map((line,index)=><p key={index}>{line}</p>)}</div></details>
      <details><summary>{t.credits}</summary><p>Piper · Deutsch: Thorsten (CC0-Datensatz) · English: Joe (CC0 dataset) · Français: Tom (AGPLv3 model/dataset). Synthetic audio; models are not included.</p>
        <ul><li><a href="https://github.com/thorstenMueller/Thorsten-Voice">Thorsten Voice</a></li><li><a href="https://huggingface.co/rhasspy/piper-voices/blob/main/en/en_US/joe/medium/MODEL_CARD">Joe model card</a></li><li><a href="https://huggingface.co/rhasspy/piper-voices/blob/main/fr/fr_FR/tom/medium/MODEL_CARD">Tom model card</a></li></ul>
      </details>
    </>}
    <p role="status">{error}</p>
  </section>
}
