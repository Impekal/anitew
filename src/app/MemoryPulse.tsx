import { useEffect, useState } from 'react'

import {
  type DayKey,
  type MemoryPulseSignal,
  type Platform,
  memoryPulse,
} from '../core/index.ts'
import { loadDue } from '../data/items.ts'
import { loadMemoryGraph } from '../data/memoryStore.ts'
import type { Dictionary } from '../i18n/index.ts'

export function MemoryPulse({
  platform,
  training,
  today,
  refreshKey,
  dictionary,
}: {
  platform: Platform
  training: string
  today: DayKey
  refreshKey: number
  dictionary: Dictionary
}) {
  const [signals, setSignals] = useState<readonly MemoryPulseSignal[]>([])
  useEffect(() => {
    void Promise.all([loadMemoryGraph(), loadDue(training)])
      .then(([graph, due]) =>
        setSignals(memoryPulse({ graph, due, today, now: platform.clock.now() })),
      )
      .catch(() => undefined)
  }, [platform, refreshKey, today, training])

  if (signals.length === 0) return null
  const t = dictionary.pulse
  const sentence = (signal: MemoryPulseSignal) => {
    switch (signal.kind) {
      case 'attention':
        return t.attention.replace('{count}', String(signal.count))
      case 'practiced':
        return t.practiced.replace('{count}', String(signal.count))
      case 'new':
        return t.newNodes.replace('{count}', String(signal.count))
      case 'stale':
        return t.stale.replace('{label}', signal.node.label)
      case 'quiet':
        return t.quiet
    }
  }
  return (
    <section className="memory-pulse" aria-labelledby="memory-pulse-heading">
      <div className="memory-pulse-mark" aria-hidden="true"><span /></div>
      <div>
        <p id="memory-pulse-heading" className="memory-pulse-label">{t.heading}</p>
        {signals.map((signal, index) => <p className="memory-pulse-line" key={`${signal.kind}:${index}`}>{sentence(signal)}</p>)}
      </div>
    </section>
  )
}
