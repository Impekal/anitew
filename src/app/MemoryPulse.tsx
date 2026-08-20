import { useEffect, useState } from 'react'

import {
  type DayKey,
  type MemoryAfterglow,
  type MemoryPulseSignal,
  type MemoryReencounter,
  type Platform,
  memoryAfterglow,
  memoryPulse,
  memoryReencounter,
} from '../core/index.ts'
import { loadDue } from '../data/items.ts'
import { loadMemoryGraph } from '../data/memoryStore.ts'
import type { Dictionary } from '../i18n/index.ts'

import './memory-reencounter.css'

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
  const [reencounter, setReencounter] = useState<MemoryReencounter | undefined>()
  const [afterglow, setAfterglow] = useState<MemoryAfterglow | undefined>()
  useEffect(() => {
    void Promise.all([loadMemoryGraph(), loadDue(training)])
      .then(([graph, due]) => {
        const now = platform.clock.now()
        const returning = memoryReencounter({ graph, due, today, now })
        const recalled = returning === undefined ? memoryAfterglow({ graph, now }) : undefined
        setReencounter(returning)
        setAfterglow(recalled)
        const next = memoryPulse({ graph, due, today, now })
        // Konkrete Ereignisse schlagen abstrakte Summen. RETURN wiederholt
        // „Aufmerksamkeit“ nicht; der Afterglow wiederholt „trainiert“ nicht.
        // Daneben bleibt höchstens eine andere belegbare Beobachtung.
        setSignals(
          returning !== undefined
            ? next.filter((signal) => signal.kind !== 'attention').slice(0, 1)
            : recalled !== undefined
              ? next.filter((signal) => signal.kind !== 'practiced').slice(0, 1)
              : next,
        )
      })
      .catch(() => undefined)
  }, [platform, refreshKey, today, training])

  if (signals.length === 0 && reencounter === undefined && afterglow === undefined) return null
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
  const live = reencounter !== undefined || afterglow !== undefined
  const anchor = reencounter?.worldAnchor ?? afterglow?.anchor
  return (
    <section
      className={
        !live
          ? 'memory-pulse'
          : `memory-pulse memory-reencounter ${reencounter !== undefined ? 'memory-reencounter-live' : 'memory-afterglow-live'}`
      }
      aria-labelledby="memory-pulse-heading"
    >
      {!live ? (
        <div className="memory-pulse-mark" aria-hidden="true"><span /></div>
      ) : (
        <div className="memory-return-glyph" aria-hidden="true">
          <svg viewBox="0 0 44 44" focusable="false">
            <line x1="10" y1="31" x2="33" y2="13" />
            <circle className="memory-return-anchor" cx="10" cy="31" r="3.5" />
            <circle className="memory-return-node" cx="33" cy="13" r="5" />
            <circle className="memory-return-wave" cx="33" cy="13" r="9" />
          </svg>
        </div>
      )}
      <div>
        <p id="memory-pulse-heading" className="memory-pulse-label">
          {reencounter !== undefined
            ? dictionary.session.phases.return
            : afterglow !== undefined
              ? dictionary.session.phases.retrieve
              : t.heading}
        </p>
        {reencounter !== undefined && (
          <>
            <p className="memory-pulse-line memory-return-name"><strong>{reencounter.node.label}</strong></p>
            <p className="hint memory-return-status">{dictionary.memory.dueSoon}</p>
          </>
        )}
        {afterglow !== undefined && (
          <>
            <p className="memory-pulse-line memory-return-name"><strong>{afterglow.anchor.label}</strong></p>
            <p className="hint memory-return-status">
              {t.practiced.replace('{count}', String(afterglow.recalled.length))}
            </p>
          </>
        )}
        {anchor !== undefined &&
          reencounter !== undefined &&
          anchor.id !== reencounter.node.id && (
            <p className="hint memory-return-context">
              {dictionary.memory.connected}: {anchor.label}
            </p>
          )}
        {signals.map((signal, index) => <p className="memory-pulse-line" key={`${signal.kind}:${index}`}>{sentence(signal)}</p>)}
      </div>
    </section>
  )
}
