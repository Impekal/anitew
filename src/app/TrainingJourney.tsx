import { LEVEL_THRESHOLDS, trainingLevel } from '../core/progress/levels.ts'
import type { Dictionary } from '../i18n/index.ts'

export function TrainingJourney({ days, today, returns, dictionary, courses }: {
  days: readonly string[]; today: string; returns: number; dictionary: Dictionary; courses?: readonly string[]
}) {
  const state = trainingLevel(days, today, returns, courses)
  const t = dictionary.journey
  return (
    <section className="training-journey" aria-label={t.heading}>
      <div className="journey-level" aria-hidden="true">{state.level}</div>
      <div className="journey-content">
        <p className="journey-eyebrow">{t.heading}</p>
        <h2>{t.level} {state.level} · {t.names[Math.min(state.level - 1, t.names.length - 1)]}</h2>
        <p className="journey-xp">{state.xp} XP · {state.next === undefined ? t.complete : t.next.replace('{xp}', String(state.remaining)).replace('{level}', String(state.level + 1))}</p>
        <progress value={state.progress} max={1} aria-label={t.progress} />
        <details>
          <summary>{t.path}</summary>
          <p className="hint">{t.rules}</p>
          <ol className="journey-path">
            {LEVEL_THRESHOLDS.map((xp, index) => (
              <li key={xp} className={state.xp >= xp ? 'journey-reached' : ''} aria-current={state.level === index + 1 ? 'step' : undefined}>
                <span aria-hidden="true">{state.xp >= xp ? '✓' : '○'}</span> {t.level} {index + 1} · {t.names[index]} <small>{xp} XP</small>
              </li>
            ))}
          </ol>
          <p className="hint">{t.note}</p>
        </details>
      </div>
    </section>
  )
}
