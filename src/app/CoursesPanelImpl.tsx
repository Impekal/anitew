import { useEffect, useRef, useState } from 'react'
import type { Language, Platform } from '../core/index.ts'
import { COURSE_PROGRESS_KEY, courseProgress, type CourseId } from '../core/courses/progress.ts'
import { readingCourses, type ReadingCourse } from '../i18n/courses.ts'
import { courseLanguage, courseCopy, courseStages, type CourseLanguage } from '../i18n/courseUi.ts'
import { CourseCoachPanel } from './CourseCoachPanel.tsx'
import { StoryCourseMedia } from './StoryCourseMedia.tsx'
import './courses.css'

export function CoursesPanelImpl({ language, platform }: { language: Language; platform: Platform }) {
  const locale = courseLanguage(language)
  const copy = (german: string, english: Parameters<typeof courseCopy>[2]) => courseCopy(locale, german, english)
  const courses = readingCourses[locale]
  const [selected, select] = useState<CourseId | null>(null)
  const [completed, setCompleted] = useState<CourseId[]>([])
  const [loaded, setLoaded] = useState(false)
  const [notice, setNotice] = useState('')
  useEffect(() => {
    let active = true
    void platform.settings.read(COURSE_PROGRESS_KEY).then(value => {
      if (active) setCompleted(courseProgress(value))
    }).catch(() => {
      if (active) setNotice(copy('Gespeicherter Fortschritt ist nicht verfügbar.', 'Saved progress is unavailable.'))
    }).finally(() => { if (active) setLoaded(true) })
    return () => { active = false }
  }, [platform, locale])
  async function save(id: CourseId) {
    // Preserve other courses completed in another tab since this view loaded.
    const stored = courseProgress(await platform.settings.read(COURSE_PROGRESS_KEY))
    const next = courseProgress([...stored, ...completed, id])
    await platform.settings.write(COURSE_PROGRESS_KEY, next)
    setCompleted(next)
  }
  const course = courses.find(item => item.id === selected)
  return <section className="courses" lang={locale} dir="ltr">
    <p className="hint">{copy('Lesen, selbst abrufen, vergleichen. Die Übungen funktionieren ohne Netz. Die bisherigen Trainingslektionen bleiben verfügbar. Coach-Videos sind noch in Arbeit.', 'Read, recall and compare. These exercises work offline. The existing training lessons remain available. Coach videos are still being developed.')}</p>
    {language !== 'de' && language !== 'en' && language !== 'fr' && <p className="hint">These reading courses are currently available in English, German and French.</p>}
    <p role="status">{notice}</p>
    <CourseCoachPanel platform={platform} locale={locale} courses={courses} selected={selected} />
    {!course ? <>
      <p>{locale === 'fr' ? `${completed.length} exercices effectués sur ${courses.length}` : locale === 'de' ? `${completed.length} von ${courses.length} Übungen durchgeführt` : `${completed.length} of ${courses.length} exercises practised`}</p>
      <p className="hint">{copy('Der Abschluss dokumentiert eine Übung, keine gemessene Gedächtnisleistung.', 'Completion records practice, not measured memory performance.')}</p>
      <div className="course-list">{courses.map(item => <article key={item.id}>
        <h3>{item.title}</h3><p>{item.purpose}</p>
        {completed.includes(item.id) && <p>{copy('Übung durchgeführt', 'Exercise practised')}</p>}
        <button type="button" disabled={!loaded} onClick={() => select(item.id)}>{copy('Kurs öffnen', 'Open course')}<span className="course-sr-only">: {item.title}</span></button>
      </article>)}</div>
    </> : <ReadingLesson platform={platform} language={language} key={`${course.id}-${locale}`} course={course} locale={locale} onBack={() => select(null)} onComplete={() => save(course.id)} />}
  </section>
}

function ReadingLesson({ course, locale, onBack, onComplete, platform, language }: { platform: Platform; language: Language; course: ReadingCourse; locale: CourseLanguage; onBack: () => void; onComplete: () => Promise<void> }) {
  const copy = (german: string, english: Parameters<typeof courseCopy>[2]) => courseCopy(locale, german, english)
  const [stage, setStage] = useState<'learn' | 'recall' | 'compare' | 'done'>('learn')
  const [answer, setAnswer] = useState('')
  const [checked, setChecked] = useState<number[]>([])
  const [own, setOwn] = useState('')
  const [usingOwn, setUsingOwn] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const heading = useRef<HTMLHeadingElement>(null)
  const source = usingOwn ? own : course.example
  const criteria = usingOwn ? course.ownCriteria ?? course.criteria : course.criteria
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
    {course.id === 'story-method' && !usingOwn && (stage === 'learn' || stage === 'compare') && <StoryCourseMedia key={stage} platform={platform} language={language} solution={stage === 'compare'} onRecall={() => {setAnswer('');setChecked([]);setStage('recall')}} />}
    {stage === 'learn' && <>
      <h4>{copy('Was ist das und wozu dient es?', 'What is it for?')}</h4><p>{course.purpose}</p>
      <h4>{copy('Grenzen und Voraussetzungen', 'Limits and prerequisites')}</h4><p>{course.limit}</p>
      <h4>{copy('So gehst du vor', 'How to practise')}</h4><ol>{course.steps.map(step => <li key={step}>{step}</li>)}</ol>
      <h4>{copy('Durchgearbeitetes Beispiel', 'Worked example')}</h4><blockquote>{course.example}</blockquote><p>{course.explanation}</p>
      {course.allowOwn !== false && <details><summary>{copy('Mit eigenem Material üben', 'Practise with your own material')}</summary>
        <p>{course.transfer}</p><label htmlFor="course-own">{copy('Eigener Text oder eigenes Wort (nur für diesen Versuch)', 'Your text or word (for this attempt only)')}</label>
        <textarea id="course-own" maxLength={6000} value={own} onChange={event => setOwn(event.target.value)} />
        <p className="hint">{copy('Dein Material und deine Antwort werden weder gespeichert noch versendet. Beim Verlassen dieses Kurses gehen sie verloren.', 'Your material and answer are neither saved nor sent. They are discarded when you leave this course.')}</p>
        <label><input type="checkbox" checked={usingOwn} onChange={event => setUsingOwn(event.target.checked)} /> {copy('Eigenes Material statt Beispiel verwenden', 'Use my material instead of the example')}</label>
      </details>}
      <button type="button" className="primary" disabled={usingOwn && !own.trim()} onClick={() => {setAnswer('');setChecked([]);setStage('recall')}}>{copy('Vorlage ausblenden und üben', 'Hide source and practise')}</button>
    </>}
    {(stage === 'recall' || stage === 'compare') && <>
      <p>{usingOwn ? (copy('Rufe dein Material passend zum Lernziel ohne Vorlage ab.', 'Recall your material without looking, following the course goal.')) : course.prompt}</p>
      <label htmlFor="course-answer">{copy('Deine Antwort', 'Your answer')}</label>
      <textarea id="course-answer" value={answer} maxLength={10000} onChange={event => setAnswer(event.target.value)} />
      {stage === 'recall' && <><button type="button" disabled={!answer.trim()} onClick={() => setStage('compare')}>{copy('Mit der Vorlage vergleichen', 'Compare with the source')}</button><button type="button" onClick={() => setStage('learn')}>{copy('Noch einmal ansehen', 'Study again')}</button></>}
    </>}
    {stage === 'compare' && <>
      <h4>{copy('Original', 'Original')}</h4><blockquote>{source}</blockquote>
      <p>{copy('Vergleiche selbst. Markiere die Punkte erst, nachdem du sie geprüft und Fehler korrigiert hast. Dies ist keine automatische Bewertung.', 'Compare for yourself. Check each item after reviewing it and correcting mistakes. This is not an automatic score.')}</p>
      {criteria.map((criterion,index) => <label className="course-check" key={criterion}><input type="checkbox" checked={checked.includes(index)} onChange={event => setChecked(event.target.checked ? [...checked,index] : checked.filter(x => x !== index))} />{criterion}</label>)}
      <button type="button" onClick={() => {setAnswer('');setChecked([]);setStage('recall')}}>{copy('Erneut ohne Vorlage abrufen', 'Recall again without looking')}</button>
      <button type="button" className="primary" disabled={saving || checked.length !== criteria.length} onClick={() => void finish()}>{copy('Übung abschließen', 'Complete exercise')}</button>
      <p role="status">{error}</p>
    </>}
    {stage === 'done' && <><p role="status">{copy('Übung durchgeführt und gespeichert.', 'Exercise practised and saved.')}</p><p>{course.transfer}</p><p>{copy('Versuche den Abruf später erneut. Wenn er schwerfällt, kürze den Abschnitt oder kläre die unsicheren Stellen.', 'Try recalling it again later. If it is difficult, shorten the passage or clarify uncertain parts.')}</p><button type="button" onClick={() => setStage('learn')}>{copy('Noch einmal üben', 'Practise again')}</button></>}
  </article>
}
