import { useEffect, useRef, useState } from 'react'
import type { Language, Platform } from '../core/index.ts'
import { COURSE_PROGRESS_KEY, courseProgress, type CourseId } from '../core/courses/progress.ts'
import { readingCourses, type ReadingCourse } from '../i18n/courses.ts'
import './courses.css'

export function CoursesPanelImpl({ language, platform }: { language: Language; platform: Platform }) {
  const de = language === 'de'
  const courses = readingCourses[de ? 'de' : 'en']
  const [selected, select] = useState<CourseId | null>(null)
  const [completed, setCompleted] = useState<CourseId[]>([])
  const [loaded, setLoaded] = useState(false)
  const [notice, setNotice] = useState('')
  useEffect(() => {
    let active = true
    void platform.settings.read(COURSE_PROGRESS_KEY).then(value => {
      if (active) setCompleted(courseProgress(value))
    }).catch(() => {
      if (active) setNotice(de ? 'Gespeicherter Fortschritt ist nicht verfügbar.' : 'Saved progress is unavailable.')
    }).finally(() => { if (active) setLoaded(true) })
    return () => { active = false }
  }, [platform, de])
  async function save(id: CourseId) {
    // Preserve other courses completed in another tab since this view loaded.
    const stored = courseProgress(await platform.settings.read(COURSE_PROGRESS_KEY))
    const next = courseProgress([...stored, ...completed, id])
    await platform.settings.write(COURSE_PROGRESS_KEY, next)
    setCompleted(next)
  }
  const course = courses.find(item => item.id === selected)
  return <section className="courses" lang={de ? 'de' : 'en'} dir="ltr">
    <p className="hint">{de ? 'Lesen, selbst abrufen, vergleichen. Die Übungen funktionieren ohne Netz. Weitere Methoden und Coach-Videos folgen.' : 'Read, recall and compare. These exercises work offline. More methods and coach videos are being developed.'}</p>
    {language !== 'de' && language !== 'en' && <p className="hint">These reading courses are currently available in English and German.</p>}
    <p role="status">{notice}</p>
    {!course ? <>
      <p>{de ? `${completed.length} von ${courses.length} Übungen durchgeführt` : `${completed.length} of ${courses.length} exercises practised`}</p>
      <p className="hint">{de ? 'Der Abschluss dokumentiert eine Übung, keine gemessene Gedächtnisleistung.' : 'Completion records practice, not measured memory performance.'}</p>
      <div className="course-list">{courses.map(item => <article key={item.id}>
        <h3>{item.title}</h3><p>{item.purpose}</p>
        {completed.includes(item.id) && <p>{de ? 'Übung durchgeführt' : 'Exercise practised'}</p>}
        <button type="button" disabled={!loaded} onClick={() => select(item.id)}>{de ? 'Kurs öffnen' : 'Open course'}<span className="course-sr-only">: {item.title}</span></button>
      </article>)}</div>
    </> : <ReadingLesson key={`${course.id}-${de}`} course={course} de={de} onBack={() => select(null)} onComplete={() => save(course.id)} />}
  </section>
}

function ReadingLesson({ course, de, onBack, onComplete }: { course: ReadingCourse; de: boolean; onBack: () => void; onComplete: () => Promise<void> }) {
  const [stage, setStage] = useState<'learn' | 'recall' | 'compare' | 'done'>('learn')
  const [answer, setAnswer] = useState('')
  const [checked, setChecked] = useState<number[]>([])
  const [own, setOwn] = useState('')
  const [usingOwn, setUsingOwn] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const heading = useRef<HTMLHeadingElement>(null)
  const source = usingOwn ? own : course.example
  const criteria = usingOwn && course.id === 'text-meaning' ? (de
    ? ['Die wesentlichen Aussagen sind enthalten.', 'Die Beziehungen zwischen den Aussagen stimmen.', 'Fehlende oder falsche Aussagen wurden mit dem Original abgeglichen.']
    : ['The main ideas are included.', 'The relationships between ideas are correct.', 'Missing or mistaken ideas were checked against the source.']) : course.criteria
  useEffect(() => { heading.current?.focus() }, [stage])
  async function finish() {
    setSaving(true); setError('')
    try { await onComplete(); setStage('done') }
    catch { setError(de ? 'Fortschritt konnte nicht gespeichert werden. Deine Antwort bleibt hier; versuche es erneut.' : 'Progress could not be saved. Your answer is still here; please retry.') }
    finally { setSaving(false) }
  }
  return <article className="course-lesson">
    <button type="button" onClick={onBack}>{de ? 'Zur Kursübersicht' : 'Back to courses'}</button>
    <h3 ref={heading} tabIndex={-1}>{course.title} · {de ? ({learn:'Erklärung',recall:'Selbst abrufen',compare:'Vergleichen',done:'Weiterüben'}[stage]) : ({learn:'Learn',recall:'Recall',compare:'Compare',done:'Keep practising'}[stage])}</h3>
    {stage === 'learn' && <>
      <h4>{de ? 'Was ist das und wozu dient es?' : 'What is it for?'}</h4><p>{course.purpose}</p>
      <h4>{de ? 'Grenzen und Voraussetzungen' : 'Limits and prerequisites'}</h4><p>{course.limit}</p>
      <h4>{de ? 'So gehst du vor' : 'How to practise'}</h4><ol>{course.steps.map(step => <li key={step}>{step}</li>)}</ol>
      <h4>{de ? 'Durchgearbeitetes Beispiel' : 'Worked example'}</h4><blockquote>{course.example}</blockquote><p>{course.explanation}</p>
      <details><summary>{de ? 'Mit eigenem Material üben' : 'Practise with your own material'}</summary>
        <p>{course.transfer}</p><label htmlFor="course-own">{de ? 'Eigener Text oder eigenes Wort (nur für diesen Versuch)' : 'Your text or word (for this attempt only)'}</label>
        <textarea id="course-own" maxLength={6000} value={own} onChange={event => setOwn(event.target.value)} />
        <p className="hint">{de ? 'Dein Material und deine Antwort werden weder gespeichert noch versendet. Beim Verlassen dieses Kurses gehen sie verloren.' : 'Your material and answer are neither saved nor sent. They are discarded when you leave this course.'}</p>
        <label><input type="checkbox" checked={usingOwn} onChange={event => setUsingOwn(event.target.checked)} /> {de ? 'Eigenes Material statt Beispiel verwenden' : 'Use my material instead of the example'}</label>
      </details>
      <button type="button" className="primary" disabled={usingOwn && !own.trim()} onClick={() => {setAnswer('');setChecked([]);setStage('recall')}}>{de ? 'Vorlage ausblenden und üben' : 'Hide source and practise'}</button>
    </>}
    {(stage === 'recall' || stage === 'compare') && <>
      <p>{usingOwn ? (de ? 'Rufe dein Material passend zum Lernziel ohne Vorlage ab.' : 'Recall your material without looking, following the course goal.') : course.prompt}</p>
      <label htmlFor="course-answer">{de ? 'Deine Antwort' : 'Your answer'}</label>
      <textarea id="course-answer" value={answer} maxLength={10000} onChange={event => setAnswer(event.target.value)} />
      {stage === 'recall' && <><button type="button" disabled={!answer.trim()} onClick={() => setStage('compare')}>{de ? 'Mit der Vorlage vergleichen' : 'Compare with the source'}</button><button type="button" onClick={() => setStage('learn')}>{de ? 'Noch einmal ansehen' : 'Study again'}</button></>}
    </>}
    {stage === 'compare' && <>
      <h4>{de ? 'Original' : 'Original'}</h4><blockquote>{source}</blockquote>
      <p>{de ? 'Vergleiche selbst. Markiere die Punkte erst, nachdem du sie geprüft und Fehler korrigiert hast. Dies ist keine automatische Bewertung.' : 'Compare for yourself. Check each item after reviewing it and correcting mistakes. This is not an automatic score.'}</p>
      {criteria.map((criterion,index) => <label className="course-check" key={criterion}><input type="checkbox" checked={checked.includes(index)} onChange={event => setChecked(event.target.checked ? [...checked,index] : checked.filter(x => x !== index))} />{criterion}</label>)}
      <button type="button" onClick={() => {setAnswer('');setChecked([]);setStage('recall')}}>{de ? 'Erneut ohne Vorlage abrufen' : 'Recall again without looking'}</button>
      <button type="button" className="primary" disabled={saving || checked.length !== criteria.length} onClick={() => void finish()}>{de ? 'Übung abschließen' : 'Complete exercise'}</button>
      <p role="status">{error}</p>
    </>}
    {stage === 'done' && <><p role="status">{de ? 'Übung durchgeführt und gespeichert.' : 'Exercise practised and saved.'}</p><p>{course.transfer}</p><p>{de ? 'Versuche den Abruf später erneut. Wenn er schwerfällt, kürze den Abschnitt oder kläre die unsicheren Stellen.' : 'Try recalling it again later. If it is difficult, shorten the passage or clarify uncertain parts.'}</p><button type="button" onClick={() => setStage('learn')}>{de ? 'Noch einmal üben' : 'Practise again'}</button></>}
  </article>
}
