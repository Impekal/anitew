import { useEffect, useState, type CSSProperties } from 'react'
import { App as LegacyApp } from './App.tsx'
import { TodayExperience } from './today/TodayExperience.tsx'
import { RememberSomething } from './memory/RememberSomething.tsx'
import { APP_TABS, type AppTab } from './shell/navigation.ts'
import { loadMemoryNodes } from '../core/memory/MemoryStore.ts'

type Props = { initialDueCount?: number; initialStreak?: number }

export function AppV2({ initialDueCount = 0, initialStreak = 0 }: Props) {
  const [tab, setTab] = useState<AppTab>('today')
  const [missionOpen, setMissionOpen] = useState(false)
  const [rememberOpen, setRememberOpen] = useState(false)
  const [nodeCount, setNodeCount] = useState(0)

  const refreshMemory = () => setNodeCount(loadMemoryNodes().length)
  useEffect(() => refreshMemory(), [])

  if (missionOpen) return <LegacyApp />
  if (rememberOpen) return <RememberSomething onCancel={() => setRememberOpen(false)} onSaved={() => { setRememberOpen(false); refreshMemory(); setTab('memory') }} />

  return (
    <div className="anitew-v2-shell">
      <div className="anitew-v2-atmosphere" aria-hidden="true" />
      {tab === 'today' && <TodayExperience dueCount={initialDueCount} nodeCount={nodeCount} streak={initialStreak} onBegin={() => setMissionOpen(true)} onRemember={() => setRememberOpen(true)} />}
      {tab === 'memory' && (
        <main className="v2-page">
          <p className="eyebrow">MEMORY CONSTELLATION</p>
          <h1>{nodeCount === 0 ? 'Your memory starts here.' : `${nodeCount} memories. One constellation.`}</h1>
          <p className="v2-lead">Information you deliberately remember becomes part of a personal network that ANITEW can bring back to you at the right moment.</p>
          <div className="constellation-preview" aria-hidden="true"><span className="constellation-core">YOU</span>{Array.from({ length: Math.max(6, Math.min(24, nodeCount + 6)) }, (_, index) => <i key={index} style={{ '--i': index } as CSSProperties} />)}</div>
          <button className="remember-cta" type="button" onClick={() => setRememberOpen(true)}><span aria-hidden="true">＋</span><span><strong>Remember something</strong><small>Turn real-life information into future recall practice.</small></span></button>
        </main>
      )}
      {tab === 'progress' && <main className="v2-page"><p className="eyebrow">PROGRESS</p><h1>Measure what matters.</h1><p className="v2-lead">Training scores show performance. Independent benchmarks tell us whether your memory is actually changing.</p><div className="progress-card"><strong>Memory profile</strong><span>Built from your recall history</span></div><div className="progress-card"><strong>Forgetting curve</strong><span>Learning your personal intervals</span></div><div className="progress-card"><strong>Transfer benchmarks</strong><span>Kept separate from game scores</span></div></main>}
      {tab === 'you' && <main className="v2-page"><p className="eyebrow">YOU</p><h1>Your memory system.</h1><p className="v2-lead">Account, privacy, language and synchronization belong here — outside the training flow.</p><div className="profile-card"><span className="profile-orb">◎</span><div><strong>Personal profile</strong><small>Google account connection will live here.</small></div></div><div className="profile-card"><span className="profile-orb">↗</span><div><strong>Private sync</strong><small>Google Drive synchronization is infrastructure, not a daily task.</small></div></div></main>}
      <nav className="v2-nav" aria-label="ANITEW">{APP_TABS.map((item) => <button key={item} type="button" className={tab === item ? 'active' : ''} onClick={() => setTab(item)}><span aria-hidden="true">{item === 'today' ? '◉' : item === 'memory' ? '✦' : item === 'progress' ? '◇' : '◎'}</span><small>{item}</small></button>)}</nav>
    </div>
  )
}
