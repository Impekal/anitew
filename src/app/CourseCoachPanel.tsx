import { useEffect, useState } from 'react'
import type { Platform } from '../core/index.ts'
import { COACH_IDS, COACH_SETTINGS_KEY, DEFAULT_COACHES, coachFor, coachPreferences, type CoachPreferences } from '../core/courses/coaches.ts'
import type { CourseId } from '../core/courses/progress.ts'
import type { ReadingCourse } from '../i18n/courses.ts'
import type { CourseLanguage } from '../i18n/courseUi.ts'
import { courseCoachCopy } from '../i18n/courseCoaches.ts'

export function CourseCoachPanel({ platform, locale, courses, selected }: { platform: Platform; locale: CourseLanguage; courses: ReadingCourse[]; selected: CourseId | null }) {
  const t = courseCoachCopy[locale]
  const [preferences, setPreferences] = useState(() => coachPreferences(undefined))
  const [ready, setReady] = useState(false)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<'saved' | 'failed' | 'loadFailed' | null>(null)
  useEffect(() => {
    let active = true
    void (async () => {
      try {
        const stored = await platform.settings.read(COACH_SETTINGS_KEY)
        let value = stored
        // A same-origin prototype may have left the earlier preference format.
        // Never read across origins or erase the old value on migration.
        if (stored === undefined) {
          try { value = JSON.parse(localStorage.getItem('anitew-coach-preferences-v1') ?? 'null') } catch { /* No usable legacy value. */ }
        }
        const resolved = coachPreferences(value)
        if (active) setPreferences(resolved)
        if (stored === undefined && value != null) await platform.settings.write(COACH_SETTINGS_KEY, resolved)
      } catch {
        if (active) setStatus('loadFailed')
      } finally { if (active) setReady(true) }
    })()
    return () => { active = false }
  }, [platform])
  async function save(next: CoachPreferences) {
    setPreferences(next); setSaving(true); setStatus(null)
    try { await platform.settings.write(COACH_SETTINGS_KEY, next); setStatus('saved') }
    catch { setStatus('failed') }
    finally { setSaving(false) }
  }
  const options = COACH_IDS.map(id => <option key={id} value={id}>{t.names[id]}</option>)
  const chosen = selected ? coachFor(selected, preferences) : null
  return <section className="course-coaches" aria-label={t.title}>
    {chosen && ready && <figure className="course-coach-current">
      <img src={`/coaches/${chosen}.webp`} width="80" height="96" alt={`${t.names[chosen]} · ${t.portrait}`} />
      <figcaption>{t.names[chosen]}<small>{t.portrait}</small></figcaption>
    </figure>}
    <details>
      <summary>{t.title}</summary>
      <p className="hint">{t.note}</p>
      <div className="course-coach-gallery">{COACH_IDS.map(id => <figure key={id}>
        <img src={`/coaches/${id}.webp`} width="120" height="144" loading="lazy" alt={`${t.names[id]} · ${t.portrait}`} />
        <figcaption>{t.names[id]}</figcaption>
      </figure>)}</div>
      <fieldset disabled={!ready || saving}>
        <legend className="course-sr-only">{t.mode}</legend>
        <label htmlFor="course-coach-mode">{t.mode}</label>
        <select id="course-coach-mode" value={preferences.mode} onChange={event => void save(coachPreferences({...preferences, mode:event.target.value}))}>
          <option value="default">{t.standard}</option><option value="global">{t.global}</option><option value="custom">{t.custom}</option>
        </select>
        {preferences.mode === 'global' && <><label htmlFor="course-coach-all">{t.all}</label><select id="course-coach-all" value={preferences.global} onChange={event => void save(coachPreferences({...preferences,global:event.target.value}))}>{options}</select></>}
        {preferences.mode === 'custom' && courses.map(course => <div key={course.id}>
          <label htmlFor={`course-coach-${course.id}`}>{course.title}</label>
          <select id={`course-coach-${course.id}`} value={preferences.courses[course.id] ?? 'default'} onChange={event => {
            const changed = {...preferences.courses}
            if (event.target.value === 'default') delete changed[course.id]
            else Object.assign(changed, {[course.id]:event.target.value})
            void save(coachPreferences({...preferences,courses:changed}))
          }}><option value="default">{t.inherit}: {t.names[DEFAULT_COACHES[course.id]]}</option>{options}</select>
        </div>)}
      </fieldset>
    </details>
    <p role="status">{status ? t[status] : ''}</p>
    {status === 'failed' && <button type="button" disabled={saving} onClick={() => void save(preferences)}>{t.retry}</button>}
  </section>
}
