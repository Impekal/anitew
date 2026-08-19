import { useMemo } from 'react'

type Props = {
  userName?: string
  dueCount?: number
  nodeCount?: number
  streak?: number
  onBegin: () => void
  onRemember: () => void
}

export function TodayExperience({
  userName,
  dueCount = 0,
  nodeCount = 0,
  streak = 0,
  onBegin,
  onRemember,
}: Props) {
  const greeting = useMemo(() => {
    if (!userName) return 'Welcome back.'
    return `Good to see you, ${userName}.`
  }, [userName])

  return (
    <main className="today-experience" aria-labelledby="today-title">
      <header className="today-header">
        <div>
          <p className="eyebrow">YOUR MEMORY SYSTEM</p>
          <h1 id="today-title">{greeting}</h1>
        </div>
        <div className="memory-orb" aria-label={`${nodeCount} memory connections`}>
          <span>{nodeCount.toLocaleString()}</span>
          <small>connections</small>
        </div>
      </header>

      <section className="mission-card" aria-labelledby="mission-title">
        <div className="mission-glow" aria-hidden="true" />
        <p className="eyebrow">TODAY'S MEMORY MISSION</p>
        <h2 id="mission-title">Strengthen what your brain is ready to forget.</h2>
        <p className="mission-meta">
          {dueCount > 0 ? `${dueCount} memories are ready for recall.` : 'A focused five-minute session.'}
        </p>
        <button className="mission-start" type="button" onClick={onBegin}>
          <strong>05:00</strong>
          <span>Begin mission</span>
        </button>
      </section>

      <section className="today-signals" aria-label="Memory signals">
        <div><span>Due</span><strong>{dueCount}</strong></div>
        <div><span>Streak</span><strong>{streak}</strong></div>
        <div><span>Connections</span><strong>{nodeCount}</strong></div>
      </section>

      <button className="remember-cta" type="button" onClick={onRemember}>
        <span aria-hidden="true">＋</span>
        <span><strong>Remember something</strong><small>Put something from your real life into your memory system.</small></span>
      </button>
    </main>
  )
}
