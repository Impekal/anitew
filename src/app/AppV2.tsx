import { useState, type CSSProperties } from 'react'

import { App as LegacyApp } from './App.tsx'
import { TodayExperience } from './today/TodayExperience.tsx'
import { APP_TABS, type AppTab } from './shell/navigation.ts'

type Props = {
  initialNodeCount?: number
  initialDueCount?: number
  initialStreak?: number
}

export function AppV2({ initialNodeCount = 0, initialDueCount = 0, initialStreak = 0 }: Props) {
  const [tab, setTab] = useState<AppTab>('today')
  const [missionOpen, setMissionOpen] = useState(false)

  if (missionOpen) return <LegacyApp />

  return (
    <div className="anitew-v2-shell">
      <div className="anitew-v2-atmosphere" aria-hidden="true" />
      {tab === 'today' && (
        <TodayExperience dueCount={initialDueCount} nodeCount={initialNodeCount} streak={initialStreak} onBegin={() => setMissionOpen(true)} onRemember={() => setTab('memory')} />
      )}
      {tab === 'memory' && (
        <main className="v2-page">
          <p className="eyebrow">MEMORY CONSTELLATION</p>
          <h1>Your memory, connected.</h1>
          <p className="v2-lead">Everything you choose to remember can become a connection — a person, place, fact, number or story.</p>
          <div className="constellation-preview" aria-hidden="true">
            <span className="constellation-core">YOU</span>
            {Array.from({ length: 12 }, (_, index) => <i key={index} style={{ '--i': index } as CSSProperties} />)}
          </div>
          <button className="remember-cta" type="button" onClick={() => setTab('today')}>
            <span aria-hidden="true">＋</span>
            <span><strong>Remember something</strong><small>Real-life information becomes training material.</small></span>
          </button>
        </main>
      )}
      {tab === 'progress' && (
        <main className="v2-page">
          <p className="eyebrow">PROGRESS</p>
          <h1>Measure what matters.</h1>
          <p className="v2-lead">Training scores show how you performed. Benchmarks stay separate so ANITEW never invents improvement.</p>
          <div className="progress-card"><strong>Memory profile</strong><span>Building from your sessions</span></div>
          <div className="progress-card"><strong>Personal forgetting curve</strong><span>Learning your recall intervals</span></div>
          <div className="progress-card"><strong>Transfer benchmarks</strong><span>Measured independently from games</span></div>
        </main>
      )}
      {tab === 'you' && (
        <main className="v2-page">
          <p className="eyebrow">YOU</p>
          <h1>Your memory system.</h1>
          <p className="v2-lead">Your account, memory data, language and sync settings belong here — not in the training flow.</p>
          <div className="profile-card"><span className="profile-orb">◎</span><div><strong>Personal profile</strong><small>Google account connection will live here.</small></div></div>
          <div className="profile-card"><span className="profile-orb">↗</span><div><strong>Private sync</strong><small>Google Drive synchronization as infrastructure, not a daily task.</small></div></div>
        </main>
      )}
      <nav className="v2-nav" aria-label="ANITEW">
        {APP_TABS.map((item) => (
          <button key={item} type="button" className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>
            <span aria-hidden="true">{item === 'today' ? '◉' : item === 'memory' ? '✦' : item === 'progress' ? '◇' : '◎'}</span>
            <small>{item}</small>
          </button>
        ))}
      </nav>
    </div>
  )
}
