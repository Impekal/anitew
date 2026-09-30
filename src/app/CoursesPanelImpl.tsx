import { useEffect, useRef, useState } from 'react'
import type { Language, Platform } from '../core/index.ts'
import { COURSE_PROGRESS_KEY, courseProgress, type CourseId } from '../core/courses/progress.ts'
import { readingCourses, type ReadingCourse } from '../i18n/courses.ts'
import { courseLanguage, courseCopy, courseStages, type CourseLanguage } from '../i18n/courseUi.ts'
import { CourseCoachPanel } from './CourseCoachPanel.tsx'
import { StoryCourseMedia, type NarratedLesson } from './StoryCourseMedia.tsx'
import { COURSE_STAGES_KEY, availableCourseStage, courseStages as savedStages, type CourseStage, type CourseStages } from '../core/courses/stages.ts'
import { courseStageUi } from '../i18n/courseStageUi.ts'
import { advancedExample } from '../i18n/courseAdvanced.ts'
import { CourseIllustration } from './CourseIllustration.tsx'
import { VerbatimComparison } from './VerbatimComparison.tsx'
import type { CoachId } from '../core/courses/coaches.ts'
import './courses.css'

export function CoursesPanelImpl({ language, platform }: { language: Language; platform: Platform }) {
  const locale = courseLanguage(language)
  const copy = (german: string, english: Parameters<typeof courseCopy>[2]) => courseCopy(locale, german, english)
  const courses = readingCourses[locale]
  const [coach,setCoach]=useState<CoachId|null>(null)
  const [selected, select] = useState<CourseId | null>(null)
  const [studyStage, setStudyStage] = useState<CourseStage>(1)
  const [stages, setStages] = useState<CourseStages>({})
  const [completed, setCompleted] = useState<CourseId[]>([])
  const [loaded, setLoaded] = useState(false)
  const [notice, setNotice] = useState('')
  useEffect(() => {
    let active = true
    void Promise.all([platform.settings.read(COURSE_PROGRESS_KEY), platform.settings.read(COURSE_STAGES_KEY)]).then(([value, storedStages]) => {
      if (active) { setCompleted(courseProgress(value)); setStages(savedStages(storedStages, value)) }
    }).catch(() => {
      if (active) setNotice(copy('Gespeicherter Fortschritt ist nicht verfügbar.', 'Saved progress is unavailable.'))
    }).finally(() => { if (active) setLoaded(true) })
    return () => { active = false }
  }, [platform, locale])
  async function save(id: CourseId, level: CourseStage) {
    // Preserve other courses completed in another tab since this view loaded.
    const stored = courseProgress(await platform.settings.read(COURSE_PROGRESS_KEY))
    if (level > 1) {
      const previous = savedStages(await platform.settings.read(COURSE_STAGES_KEY), stored)
      if (level > availableCourseStage(id, stored, previous)) throw new Error('Previous course stage is incomplete')
      const nextStages: CourseStages = {...previous, [id]: Math.max(previous[id] ?? 1, level) as 2 | 3}
      await platform.settings.write(COURSE_STAGES_KEY, nextStages)
      setStages(nextStages)
      return
    }
    const next = courseProgress([...stored, ...completed, id])
    await platform.settings.write(COURSE_PROGRESS_KEY, next)
    setCompleted(next)
  }
  const baseCourse = courses.find(item => item.id === selected)
  const stageCopy = courseStageUi[locale]
  const course = baseCourse && (studyStage === 2 ? {...baseCourse, ...advancedExample(locale, baseCourse.id), allowOwn:false} : studyStage === 3 ? {...baseCourse, allowOwn:true, ownCriteria:[...stageCopy.criteria]} : baseCourse)
  return <section className="courses" lang={locale} dir="ltr">
    <p className="hint">{copy('Lesen, selbst abrufen, vergleichen. Die Übungen funktionieren ohne Netz. Die bisherigen Trainingslektionen bleiben verfügbar. Coach-Videos sind noch in Arbeit.', 'Read, recall and compare. These exercises work offline. The existing training lessons remain available. Coach videos are still being developed.')}</p>
    {language !== 'de' && language !== 'en' && language !== 'fr' && <p className="hint">These reading courses are currently available in English, German and French.</p>}
    <p role="status">{notice}</p>
    <CourseCoachPanel platform={platform} locale={locale} courses={courses} selected={selected} onChange={setCoach} />
    {!course ? <>
      <p>{locale === 'fr' ? `${completed.length} exercices effectués sur ${courses.length}` : locale === 'de' ? `${completed.length} von ${courses.length} Übungen durchgeführt` : `${completed.length} of ${courses.length} exercises practised`}</p>
      <p className="hint">{copy('Der Abschluss dokumentiert eine Übung, keine gemessene Gedächtnisleistung.', 'Completion records practice, not measured memory performance.')}</p>
      <div className="course-list">{courses.map(item => <article key={item.id}>
        <h3>{item.title}</h3><p>{item.purpose}</p>
        {completed.includes(item.id) && <p>{copy('Übung durchgeführt', 'Exercise practised')}</p>}
        <button type="button" disabled={!loaded} onClick={() => {select(item.id);setStudyStage(1)}}>{copy('Kurs öffnen', 'Open course')}<span className="course-sr-only">: {item.title}</span></button>
      </article>)}</div>
    </> : <>
      <label htmlFor="course-stage">{stageCopy.label}</label>
      <select id="course-stage" value={studyStage} onChange={event=>setStudyStage(Number(event.target.value) as CourseStage)}>
        {([1,2,3] as const).map(level=><option key={level} value={level} disabled={level>availableCourseStage(course.id,completed,stages)}>{stageCopy.names[level-1]}</option>)}
      </select>
      <p className="hint">{stageCopy.hint} {availableCourseStage(course.id,completed,stages)<3 ? stageCopy.locked : ''}</p>
      <ReadingLesson coach={coach} personal={studyStage===3} mediaAvailable={studyStage===1} platform={platform} language={language} key={`${course.id}-${locale}-${studyStage}`} course={course} locale={locale} onBack={() => select(null)} onComplete={() => save(course.id, studyStage)} />
    </>}
  </section>
}

function ReadingLesson({ coach, course, locale, onBack, onComplete, platform, language, personal, mediaAvailable }: { coach:CoachId|null; personal:boolean; mediaAvailable:boolean; platform: Platform; language: Language; course: ReadingCourse; locale: CourseLanguage; onBack: () => void; onComplete: () => Promise<void> }) {
  const copy = (german: string, english: Parameters<typeof courseCopy>[2]) => courseCopy(locale, german, english)
  const [stage, setStage] = useState<'learn' | 'recall' | 'compare' | 'done'>('learn')
  const [answer, setAnswer] = useState('')
  const [narrated,setNarrated] = useState<NarratedLesson>()
  const [listening,setListening]=useState(false)
  const [checked, setChecked] = useState<number[]>([])
  const [own, setOwn] = useState('')
  const [usingOwn, setUsingOwn] = useState(personal)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const heading = useRef<HTMLHeadingElement>(null)
  const source = usingOwn ? own : narrated?.example ?? course.example
  const criteria = usingOwn ? course.ownCriteria ?? course.criteria : narrated ? [...courseStageUi[locale].criteria] : course.criteria
  useEffect(() => { heading.current?.focus() }, [stage])
  async function finish() {
    setSaving(true); setError('')
    try { await onComplete(); setStage('done') }
    catch { setError(copy('Fortschritt konnte nicht gespeichert werden. Deine Antwort bleibt hier; versuche es erneut.', 'Progress could not be saved. Your answer is still here; please retry.')) }
    finally { setSaving(false) }
  }
  return <article className="course-lesson">
    <button type="button" onClick={onBack}>{copy('Zur Kursübersicht', 'Back to courses')}</button>
    <h3 ref={heading} tabIndex={-1}>{course.title} · {courseStages[locale][stage]}</h3>
    {mediaAvailable && !usingOwn && (stage === 'learn' || stage === 'compare') && <StoryCourseMedia coach={coach} onMaterial={stage==='learn'?setNarrated:undefined} onPresentation={setListening} courseId={course.id} courseTitle={course.title} key={stage} platform={platform} language={language} solution={stage === 'compare'} onRecall={material => {setNarrated(material);setAnswer('');setChecked([]);setStage('recall')}} />}
    {stage === 'learn' && !listening && <>
      <h4>{copy('Was ist das und wozu dient es?', 'What is it for?')}</h4><p lang={narrated?.textLanguage ?? locale} dir="auto">{narrated?.purpose ?? course.purpose}</p>
      <h4>{copy('Grenzen und Voraussetzungen', 'Limits and prerequisites')}</h4><p lang={narrated?.textLanguage ?? locale} dir="auto">{narrated?.limit ?? course.limit}</p>
      <h4>{copy('So gehst du vor', 'How to practise')}</h4><ol lang={narrated?.textLanguage ?? locale} dir="auto">{(narrated?.steps ?? course.steps).map(step => <li key={step}>{step}</li>)}</ol>
      {!personal && <><h4>{copy('Durchgearbeitetes Beispiel', 'Worked example')}</h4><blockquote lang={narrated?.language ?? locale}>{narrated?.example ?? course.example}</blockquote><p lang={narrated?.textLanguage ?? locale} dir="auto">{narrated?.explanation ?? course.explanation}</p>{mediaAvailable && <CourseIllustration id={course.id} locale={narrated?.language==='de'||narrated?.language==='fr'||narrated?.language==='en'?narrated.language:locale} />}</>}
      {course.allowOwn !== false && <details open={personal || undefined}><summary>{copy('Mit eigenem Material üben', 'Practise with your own material')}</summary>
        <p>{personal ? courseStageUi[locale].own : course.transfer}</p><label htmlFor="course-own">{copy('Eigener Text oder eigenes Wort (nur für diesen Versuch)', 'Your text or word (for this attempt only)')}</label>
        <textarea id="course-own" maxLength={6000} value={own} onChange={event => setOwn(event.target.value)} />
        <p className="hint">{copy('Dein Material und deine Antwort werden weder gespeichert noch versendet. Beim Verlassen dieses Kurses gehen sie verloren.', 'Your material and answer are neither saved nor sent. They are discarded when you leave this course.')}</p>
        {!personal && <label><input type="checkbox" checked={usingOwn} onChange={event => setUsingOwn(event.target.checked)} /> {copy('Eigenes Material statt Beispiel verwenden', 'Use my material instead of the example')}</label>}
      </details>}
      <button type="button" className="primary" disabled={usingOwn && !own.trim()} onClick={() => {setAnswer('');setChecked([]);setStage('recall')}}>{copy('Vorlage ausblenden und üben', 'Hide source and practise')}</button>
    </>}
    {(stage === 'recall' || stage === 'compare') && <>
      <p lang={usingOwn?locale:narrated?.textLanguage ?? locale} dir="auto">{usingOwn ? (copy('Rufe dein Material passend zum Lernziel ohne Vorlage ab.', 'Recall your material without looking, following the course goal.')) : narrated?.prompt ?? course.prompt}</p>
      <label htmlFor="course-answer">{copy('Deine Antwort', 'Your answer')}</label>
      <textarea id="course-answer" value={answer} maxLength={10000} onChange={event => setAnswer(event.target.value)} />
      {stage === 'recall' && <><button type="button" disabled={!answer.trim()} onClick={() => setStage('compare')}>{copy('Mit der Vorlage vergleichen', 'Compare with the source')}</button><button type="button" onClick={() => setStage('learn')}>{copy('Noch einmal ansehen', 'Study again')}</button></>}
    </>}
    {stage === 'compare' && <>
      {course.id==='text-verbatim' && <VerbatimComparison source={source} answer={answer} locale={locale} />}
      <h4>{copy('Original', 'Original')}</h4><blockquote lang={narrated?.language ?? locale}>{source}</blockquote>
      <p>{copy('Vergleiche selbst. Markiere die Punkte erst, nachdem du sie geprüft und Fehler korrigiert hast. Dies ist keine automatische Bewertung.', 'Compare for yourself. Check each item after reviewing it and correcting mistakes. This is not an automatic score.')}</p>
      {criteria.map((criterion,index) => <label className="course-check" key={criterion}><input type="checkbox" checked={checked.includes(index)} onChange={event => setChecked(event.target.checked ? [...checked,index] : checked.filter(x => x !== index))} />{criterion}</label>)}
      <button type="button" onClick={() => {setAnswer('');setChecked([]);setStage('recall')}}>{copy('Erneut ohne Vorlage abrufen', 'Recall again without looking')}</button>
      <button type="button" className="primary" disabled={saving || checked.length !== criteria.length} onClick={() => void finish()}>{copy('Übung abschließen', 'Complete exercise')}</button>
      <p role="status">{error}</p>
    </>}
    {stage === 'done' && <><p role="status">{copy('Übung durchgeführt und gespeichert.', 'Exercise practised and saved.')}</p><p>{course.transfer}</p><p>{copy('Versuche den Abruf später erneut. Wenn er schwerfällt, kürze den Abschnitt oder kläre die unsicheren Stellen.', 'Try recalling it again later. If it is difficult, shorten the passage or clarify uncertain parts.')}</p><button type="button" onClick={() => setStage('learn')}>{copy('Noch einmal üben', 'Practise again')}</button></>}
  </article>
}
