import { useMemo, useState } from 'react'
import type { MemoryNode } from '../../core/memory/MemoryTypes.ts'
import { composeMemoryMission } from '../../core/memory/MemoryMission.ts'
import { scoreRecall } from '../../core/memory/RecallEngine.ts'
import { scheduleNextRecall, type RecallOutcome } from '../../core/memory/MemoryScheduler.ts'
import { saveMemoryNode } from '../../core/memory/MemoryStore.ts'
import { RecallCard } from './RecallCard.tsx'

type Props = { nodes: MemoryNode[]; onExit: () => void; onChanged: () => void }

function outcomeFromScore(score: number): RecallOutcome {
  if (score < 0.35) return 'forgot'
  if (score < 0.7) return 'hard'
  if (score < 0.95) return 'good'
  return 'easy'
}

export function MemoryMissionView({ nodes, onExit, onChanged }: Props) {
  const mission = useMemo(() => composeMemoryMission(nodes), [nodes])
  const [step, setStep] = useState(0)
  const [scoreTotal, setScoreTotal] = useState(0)

  if (!mission) {
    return <main className="v2-page"><p className="eyebrow">MEMORY MISSION</p><h1>Nothing is due yet.</h1><p className="v2-lead">Add something worth remembering and ANITEW will bring it back at the right time.</p><button className="mission-start" onClick={onExit}>Return to memory</button></main>
  }

  const current = mission.steps[step]
  if (!current) {
    const percentage = Math.round((scoreTotal / mission.steps.length) * 100)
    return <main className="v2-page mission-complete"><p className="eyebrow">MISSION COMPLETE</p><h1>{percentage}% recalled.</h1><p className="v2-lead">Your answers now shape when these memories return.</p><div className="progress-card"><strong>{mission.steps.length} memories trained</strong><span>Recall has been scheduled adaptively.</span></div><button className="mission-start" onClick={onExit}>Return to today</button></main>
  }

  const node = nodes.find((item) => item.id === current.memoryId)
  if (!node) return null

  function complete(score: number) {
    const outcome = outcomeFromScore(score)
    saveMemoryNode(scheduleNextRecall(node, outcome))
    setScoreTotal((value) => value + score)
    setStep((value) => value + 1)
    onChanged()
  }

  return <main className="mission-page"><button className="v2-back" onClick={onExit}>← Exit mission</button><header><p className="eyebrow">{mission.title.toUpperCase()}</p><span>{step + 1} / {mission.steps.length}</span></header><div className="mission-progress"><i style={{ width: `${((step + 1) / mission.steps.length) * 100}%` }} /></div><RecallCard node={node} onComplete={complete} /></main>
}
