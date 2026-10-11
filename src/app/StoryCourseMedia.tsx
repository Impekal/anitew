import { LessonIntro } from './LessonIntro.tsx'
import { courseNarration } from '../i18n/courseNarrations.ts'
import { courseCoachCopy } from '../i18n/courseCoaches.ts'
import { videoCaptions, playbackCaptions } from '../core/courses/captions.ts'
import type { CoachId } from '../core/courses/coaches.ts'
import { courseVideo,courseVideoCopy } from '../i18n/courseVideos.ts'
import { useEffect, useRef, useState } from 'react'
import type { Language, Platform } from '../core/index.ts'
import { MEDIA_SETTINGS_KEY, MEDIA_SPEEDS, cueAt, mediaPreferences, spokenLanguage, type MediaPreferences } from '../core/courses/media.ts'
import { storyMedia } from '../i18n/storyMedia.ts'
import { courseMediaUi } from '../i18n/courseMediaUi.ts'
import { literalRecallHint } from '../i18n/courseRecallLanguage.ts'
import { libraryCaptions } from '../i18n/courseCaptions.ts'
import { courseLibraryMedia } from '../i18n/courseLibraryMedia.ts'
import { CourseIllustration, CourseStepIllustration } from './CourseIllustration.tsx'
import { CourseDownload } from './CourseDownload.tsx'
import type { CourseId } from '../core/courses/progress.ts'
import { courseLanguage } from '../i18n/courseUi.ts'

export interface NarratedLesson { example:string;prompt:string;language:Language;textLanguage:Language;purpose:string;limit:string;steps:string[];explanation:string }

export function StoryCourseMedia({coach,language,platform,solution=false,onRecall,courseId,courseTitle,onMaterial,onPresentation}:{coach:CoachId|null;onMaterial?:(material:NarratedLesson|undefined)=>void;onPresentation:(enabled:boolean)=>void;language:Language;platform:Platform;solution?:boolean;onRecall:(material?:NarratedLesson)=>void;courseId:CourseId;courseTitle:string}) {
  const locale=courseLanguage(language)
  const t={...courseMediaUi[locale],title:courseTitle}
  const [preferences,setPreferences]=useState(()=>mediaPreferences(null))
  const [ready,setReady]=useState(false)
  const [saving,setSaving]=useState(false)
  const [enabled,setEnabled]=useState(false)
  const [time,setTime]=useState(0)
  const [showIntro,setShowIntro]=useState(false)
  const introDone=useRef(false)
  const [error,setError]=useState('')
  const [captionSource,setCaptionSource]=useState('')
  const player=useRef<HTMLMediaElement|null>(null)
  const spoken=spokenLanguage(language,preferences.audio)
  const videoAsset=courseVideo(courseId,spoken,coach)
  const playingVideo=!!videoAsset&&preferences.video===true
  const MediaElement=playingVideo?'video':'audio'
  const vt=courseVideoCopy[locale]
  const library=courseId==='story-method'?undefined:courseLibraryMedia[courseId]
  const narration=courseNarration(courseId,spoken,coach)
  const pack=narration??(library?library[spoken]:storyMedia.packs[spoken])
  const playbackCues=playingVideo?videoAsset!.cues:pack.cues
  const playbackDuration=playingVideo?videoAsset!.duration:pack.duration
  const downloadAsset=playingVideo?videoAsset:narration??library?.[spoken]
  const voiceName=courseCoachCopy[locale].names[(playingVideo?videoAsset?.coach:undefined)??narration?.coach??'original']
  const mediaSrc=playingVideo?videoAsset!.src:pack.src
  const translated=courseId!=='story-method'?libraryCaptions(courseId,spoken,language):undefined
  const subtitleLanguage=library?(translated?language:spoken):language
  const baseCaptions=library?translated??library[spoken].cues.map(cue=>cue.text):storyMedia.subtitles[language]
  const audioCaptions=subtitleLanguage===spoken&&narration?baseCaptions.map((text,index)=>narration.cues[index]?.spokenText??text):baseCaptions
  const captions=playbackCaptions(audioCaptions,playingVideo?videoAsset?.captions?.[subtitleLanguage]:undefined)
  const exampleIndex=library?library[spoken].cues.findIndex(cue=>cue.section==='example'):8
  const stopIndex=library?library[spoken].cues.findIndex(cue=>cue.section==='transfer'):16
  const recallIndex=library?library[spoken].cues.findIndex(cue=>cue.section==='recall'):16
  const instructionIndices=library?library[spoken].cues.flatMap((cue,index)=>cue.section.startsWith('step-')?[index]:[]):[]
  const gate=playbackCues[library?exampleIndex:17].start
  const recallBoundary=playingVideo&&videoAsset?.recallBoundary!==undefined?videoAsset.recallBoundary:playbackCues[stopIndex].start
  const vtt=enabled&&playingVideo?videoCaptions(playbackCues,captions,solution?Infinity:recallBoundary):''
  useEffect(()=>{
    if(!vtt){setCaptionSource('');return}
    const url=URL.createObjectURL(new Blob([vtt],{type:'text/vtt'}));setCaptionSource(url)
    return()=>URL.revokeObjectURL(url)
  },[vtt])
  const cue=cueAt(playbackCues,time)
  const safeCue=!solution && cue>=stopIndex ? -1 : cue
  useEffect(()=>{
    let active=true
    void platform.settings.read(MEDIA_SETTINGS_KEY).then(value=>{if(active){const saved=mediaPreferences(value);setPreferences(saved);setEnabled(saved.view==='listen')}}).catch(()=>{if(active)setError(t.saveFailed)}).finally(()=>{if(active)setReady(true)})
    return()=>{active=false}
  },[platform,t.saveFailed])
  useEffect(()=>{
    const element=player.current
    return()=>{element?.pause()}
  },[enabled,mediaSrc])
  useEffect(()=>{setTime(0);introDone.current=false;setShowIntro(false)},[mediaSrc])
  useEffect(()=>{if(!enabled)setShowIntro(false)},[enabled])
  async function save(next:MediaPreferences) {
    player.current?.pause();setShowIntro(false);setTime(0);setPreferences(next);setSaving(true);setError('')
    try {await platform.settings.write(MEDIA_SETTINGS_KEY,next)} catch {setError(t.saveFailed)} finally {setSaving(false)}
  }
  function material():NarratedLesson|undefined {
    if(!library)return undefined
    const cues=library[spoken].cues
    const text=(section:string)=>audioCaptions[cues.findIndex(cue=>cue.section===section)]??''
    return {example:library[spoken].cues[exampleIndex].text,prompt:text('recall')+((courseId==='text-verbatim'||courseId==='long-words')&&language!==spoken?' '+literalRecallHint[language]:''),language:spoken,textLanguage:subtitleLanguage,purpose:text('purpose'),limit:text('limit'),steps:cues.flatMap((cue,index)=>cue.section.startsWith('step-')?[audioCaptions[index]]:[]),explanation:text('explanation')}
  }
  useEffect(()=>{
    onPresentation(enabled)
    if(enabled)onMaterial?.(material())
    return()=>onPresentation(false)
  },[enabled,spoken,language,courseId,onMaterial,onPresentation])
  function recall() { setShowIntro(false);player.current?.pause();onRecall(material()) }
  function startPlayback() {
    if(playingVideo&&courseId!=='story-method'&&!solution&&!introDone.current&&(player.current?.currentTime??0)<.1){
      introDone.current=true;player.current?.pause();platform.sound.play('start');setShowIntro(true);return
    }
    sync()
  }
  function finishIntro(){setShowIntro(false);if(enabled)void player.current?.play().catch(()=>setError(vt.failed))}
  function sync() {
    const element=player.current
    if(!element)return
    if(!solution && element.currentTime>=recallBoundary){element.pause();recall();return}
    setTime(element.currentTime)
  }
  // Native media clocks may round a fractional cue boundary slightly backwards.
  // Seek inside the cue so a chapter does not display the preceding silent gap.
  function seek(index:number){setShowIntro(false);if(player.current){const target=Math.min(playbackCues[index].start+.01,playbackCues[index].end);player.current.currentTime=target;setTime(target)}}
  return <section className="course-media" aria-label={t.title}>
    <h4>{t.title}</h4><p className="hint">{playingVideo?(videoAsset?.presentation==='illustrated'?vt.illustratedNote:vt.note):t.note}</p>
    <p className="hint">{playingVideo?(locale==='de'?'Videodauer':locale==='fr'?'Durée vidéo':'Video duration'):(locale==='de'?'Tonspur':locale==='fr'?'Piste audio':'Audio')}: {Math.floor(Math.ceil(playbackDuration/preferences.speed)/60)}:{String(Math.ceil(playbackDuration/preferences.speed)%60).padStart(2,'0')} · {locale==='de'?'Übungszeit zusätzlich':locale==='fr'?'temps de pratique en plus':'plus practice time'}</p>
    <button type="button" aria-pressed={enabled} disabled={!ready} onClick={()=>{player.current?.pause();setTime(0);setEnabled(!enabled);void save({...preferences,view:enabled?'read':'listen'})}}>{enabled?t.read:t.listen}</button>
    {enabled && <>
      <fieldset disabled={saving}><legend className="course-sr-only">{t.title}</legend>
        <label htmlFor="course-audio-language">{t.audio}</label>
        <select id="course-audio-language" value={preferences.audio} onChange={e=>void save(mediaPreferences({...preferences,audio:e.target.value}))}>
          <option value="auto">{t.auto}</option><option value="de">Deutsch</option><option value="en">English</option><option value="fr">Français</option>
        </select>
        <label htmlFor="course-speed">{t.speed}</label>
        <select id="course-speed" value={preferences.speed} onChange={e=>{
          const speed=Number(e.target.value);setPreferences({...preferences,speed});if(player.current)player.current.playbackRate=speed
          setSaving(true);void platform.settings.write(MEDIA_SETTINGS_KEY,{...preferences,speed}).catch(()=>setError(t.saveFailed)).finally(()=>setSaving(false))
        }}>{MEDIA_SPEEDS.map(speed=><option key={speed} value={speed}>{speed}×</option>)}</select>
      </fieldset>
      <p className="hint">{locale==='de'?'Kursstimme':locale==='fr'?'Voix du cours':'Course voice'}: {voiceName}. {coach&&coach!=='original'&&!narration&&(locale==='de'?`Die Aufnahme mit ${courseCoachCopy.de.names[coach]} ist für diesen Kurs und diese Sprache noch in Arbeit.`:locale==='fr'?`L’enregistrement avec ${courseCoachCopy.fr.names[coach]} pour ce cours et cette langue est en préparation.`:`The recording with ${courseCoachCopy.en.names[coach]} for this course and language is in preparation.`)}</p>
      <p className="hint">{t.captions}: {subtitleLanguage.toUpperCase()} · {t.draft}</p>
      {videoAsset && <><label htmlFor="course-format">{vt.format}</label><select id="course-format" disabled={saving} value={playingVideo?'video':'audio'} onChange={e=>void save({...preferences,video:e.target.value==='video'?true:undefined})}><option value="audio">{vt.audio}</option><option value="video">{vt.video}</option></select></>}
      {downloadAsset && <CourseDownload key={`download-${downloadAsset.src}`} asset={downloadAsset} locale={locale} />}
      {library && language!==subtitleLanguage && <p className="hint">The translated subtitles for this audio track are being prepared. Its original spoken text is shown here.</p>}
      <div className={`course-playback${playingVideo?' has-video':''}`}><div className="course-screen">
      {showIntro && <LessonIntro onDone={finishIntro} />}
      <MediaElement style={showIntro?{display:'none'}:undefined} {...(playingVideo&&coach&&videoAsset?.presentation!=='illustrated'?{poster:`/coaches/${coach}.webp`}:{})} key={`player-${mediaSrc}`} ref={element=>{player.current=element}} controls playsInline crossOrigin="anonymous" preload="none" src={mediaSrc} aria-label={t.title} onError={()=>setError(playingVideo?vt.failed:t.failed)} onTimeUpdate={sync} onSeeking={sync} onSeeked={sync} onPlay={startPlayback} onLoadedMetadata={()=>{
        if(player.current instanceof HTMLVideoElement && player.current.videoWidth>0 && player.current.videoHeight>0){player.current.style.aspectRatio=`${player.current.videoWidth} / ${player.current.videoHeight}`}
        if(player.current){player.current.playbackRate=preferences.speed;player.current.preservesPitch=true;if(solution){player.current.currentTime=gate+.01;setTime(gate+.01)}}
      }}>{playingVideo&&captionSource&&<track key={captionSource} kind="captions" src={captionSource} srcLang={subtitleLanguage} label={subtitleLanguage.toUpperCase()} default />}</MediaElement>
      <div className="course-media-chapters">
        <button type="button" onClick={()=>seek(0)}>{t.intro}</button>
        <button type="button" onClick={()=>seek(exampleIndex)}>{t.example}</button>
        {!solution && <button type="button" onClick={()=>{recall()}}>{t.exercise}</button>}
      </div>
      </div><div className="course-visuals">
      {!playingVideo && !library && ((safeCue>=0&&safeCue<=2) || (solution&&safeCue>=19)) && <figure className="course-coach-presence" style={{margin:'0 auto 16px',textAlign:'center'}}>
        <img src={`/coaches/${coach??'rafael'}.webp`} width="200" height="240" style={{maxWidth:'100%',objectFit:'contain',borderRadius:16}} alt={`${courseCoachCopy[locale].names[coach??'rafael']} · ${courseCoachCopy[locale].portrait}`} />
        <figcaption>{courseCoachCopy[locale].names[coach??'rafael']} · {courseCoachCopy[locale].portrait}</figcaption>
      </figure>}
      {!playingVideo && !library && safeCue>=8 && safeCue<=13 && <svg className={`story-illustration story-step-${safeCue}`} viewBox="0 0 330 115" aria-hidden="true">
        <g className="story-key" fill="none" stroke="currentColor" strokeWidth="6"><circle cx="35" cy="48" r="18"/><path d="M53 48h40v13m-14-13v13"/></g>
        <path d="M110 54h24m-8-7 8 7-8 7" fill="none" stroke="currentColor" strokeWidth="3"/>
        <ellipse cx="163" cy="53" rx="23" ry="30" fill="#d1b951" stroke="currentColor" strokeWidth="2" transform="rotate(25 163 53)"/>
        <g className="story-juice" fill="#d1b951"><circle cx="191" cy="44" r="3"/><circle cx="201" cy="51" r="3"/><circle cx="211" cy="60" r="3"/></g>
        <g fill="none" stroke="currentColor" strokeWidth="3"><circle cx="247" cy="76" r="21"/><circle cx="303" cy="76" r="21"/><path d="m247 76 16-31 18 31h-34l37-25 19 25m-19-25-4-14h12m-35 8h17"/></g>
      </svg>}
      {!playingVideo && library && instructionIndices.includes(safeCue) && <CourseStepIllustration steps={instructionIndices.map(index=>captions[index])} current={instructionIndices.indexOf(safeCue)} locale={locale} language={subtitleLanguage} />}
      {!playingVideo && library && safeCue>=exampleIndex && safeCue<recallIndex && <CourseIllustration id={courseId} locale={spoken} />}
      <p className="course-caption" lang={subtitleLanguage} dir="auto">{!showIntro&&safeCue>=0?captions[safeCue]:''}</p>
      </div></div>
      <details><summary>{t.transcript}</summary><div lang={subtitleLanguage} dir={subtitleLanguage==='ar'?'rtl':'ltr'}>{captions.map((line,index)=><p key={index} dir="auto">{line}</p>)}</div></details>
      <details><summary>{t.credits}</summary>{narration?.synthesis==='kyutai-cml-native'?<p>{voiceName} · KI / AI · <a href="https://huggingface.co/kyutai/tts-1.6b-en_fr">Kyutai TTS · CC BY 4.0</a> · <a href="https://openslr.org/146/">CML-TTS FR 1406 · Oliveira et al. · CC BY 4.0</a>. Adaptation: ANITEW · <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.</p>:narration?.synthesis==='kyutai-native'?<p>{voiceName} · KI / AI · <a href="https://huggingface.co/kyutai/tts-1.6b-en_fr">Kyutai TTS · CC BY 4.0</a> · <a href="https://huggingface.co/kyutai/tts-voices/blob/main/README.md">Fabien · CC0</a>. ANITEW: <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.</p>:narration?.synthesis==='kyutai-openvoice'?<p>{voiceName} · KI / AI · <a href="https://huggingface.co/kyutai/tts-1.6b-en_fr">Kyutai TTS · CC BY 4.0</a>. Fabien (CC0) → {narration.coach==='lin'?<a href="https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign">Lin · Qwen VoiceDesign · Apache 2.0</a>:<><a href="https://huggingface.co/kyutai/tts-voices/blob/main/README.md">CML-TTS FR 1406 · CC BY 4.0</a>. <a href="https://openslr.org/146/">CML-TTS: Oliveira et al.</a></>} · <a href="https://github.com/myshell-ai/OpenVoice">OpenVoice V2 · MIT</a>. Adaptation: ANITEW · <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.</p>:narration?.synthesis?<p>{voiceName} · KI / AI · <a href="https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base">Qwen3-TTS · Apache 2.0</a>{narration.synthesis==='qwen-french-shared'&&<> · <a href="https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign">ANITEW · Qwen VoiceDesign · Apache 2.0</a></>}{narration.synthesis==='qwen-openvoice'&&<> · <a href="https://github.com/myshell-ai/OpenVoice">OpenVoice V2 · MIT</a> · {narration.coach==='lin'?<a href="https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign">Lin · Qwen VoiceDesign · Apache 2.0</a>:<a href="https://huggingface.co/rhasspy/piper-voices/blob/main/en/en_US/joe/medium/MODEL_CARD">Piper Joe · CC0</a>}</>}.</p>:narration?<p>Qwen3-TTS · Apache 2.0 · {voiceName} · {locale==='de'?'KI-Stimme, lokal erzeugt.':'Locally generated AI voice.'} <a href="https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base">Qwen3-TTS</a> · ANITEW: Thorsten (CC0), <a href="https://github.com/thorstenMueller/Thorsten-Voice">Namensreferenz / name reference</a>.</p>:<><p>Piper · Deutsch: Thorsten (CC0-Datensatz) · English: Joe (CC0 dataset) · Français: Tom (AGPLv3 model/dataset). Synthetic audio; models are not included.</p>
        <ul><li><a href="https://github.com/thorstenMueller/Thorsten-Voice">Thorsten Voice</a></li><li><a href="https://huggingface.co/rhasspy/piper-voices/blob/main/en/en_US/joe/medium/MODEL_CARD">Joe model card</a></li><li><a href="https://huggingface.co/rhasspy/piper-voices/blob/main/fr/fr_FR/tom/medium/MODEL_CARD">Tom model card</a></li></ul></>}
        {playingVideo && videoAsset && <ul>{videoAsset.credits.map(credit=><li key={credit.url}><a href={credit.url}>{credit.name} · {credit.license}</a></li>)}</ul>}
      </details>
    </>}
    <p role="status">{error}</p>
  </section>
}
