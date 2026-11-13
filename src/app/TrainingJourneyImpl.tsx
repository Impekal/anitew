import { LEVEL_THRESHOLDS, trainingLevel } from '../core/progress/levels.ts'
import type { Language } from '../core/index.ts'
import { journeyCopyFor } from '../i18n/journeyCopy.ts'
import './trainingJourney.css'

export function TrainingJourneyImpl({ days, today, returns, language, courses }: {
  days: readonly string[]; today: string; returns: number; language: Language; courses?: readonly string[]
}) {
  const state = trainingLevel(days, today, returns, courses)
  const t = journeyCopyFor(language)
  return (
    <section className="training-journey" aria-label={t.heading}>
      <div className="journey-level" aria-hidden="true">{state.level}</div>
      <div className="journey-content">
        <p className="journey-eyebrow">{t.heading}</p>
        <h2>{t.level} {state.level} · {t.names[Math.min(state.level - 1, t.names.length - 1)]}</h2>
        <p className="journey-xp">{state.xp} AP · {state.next === undefined ? t.complete : t.next.replace('{xp}', String(state.remaining)).replace('{level}', String(state.level + 1))}</p>
        <progress value={state.progress} max={1} aria-label={t.progress} />
        <details>
          <summary>{t.path}</summary>
          <p className="hint">{t.rules}</p>
          <ol className="journey-path">
            {LEVEL_THRESHOLDS.map((xp, index) => (
              <li key={xp} className={state.xp >= xp ? 'journey-reached' : ''} aria-current={state.level === index + 1 ? 'step' : undefined}>
                <span aria-hidden="true">{state.xp >= xp ? '✓' : '○'}</span> {t.level} {index + 1} · {t.names[index]} <small>{xp} AP</small>
              </li>
            ))}
          </ol>
          <p className="hint">{t.note}</p>
        </details>
        <details className="journey-help">
          <summary>{t.help}</summary>
          <h3>{t.pointsQuestion}</h3>
          <p>{t.pointsAnswer}</p>
          <h3>{t.earnQuestion}</h3>
          <p>{t.rules}</p>
          <h3>{t.meaningQuestion}</h3>
          <p>{t.note}</p>
        </details>
      </div>
    </section>
  )
}
