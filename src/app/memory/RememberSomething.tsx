import { useState } from 'react'
import { createMemoryNode } from '../../core/memory/MemoryStore.ts'
import { architectMemory } from '../../core/memory/MemoryArchitect.ts'
import type { MemoryDimension, MemoryItemKind } from '../../core/memory/MemoryTypes.ts'

type Props = { onSaved: () => void; onCancel: () => void }

const kinds: { value: MemoryItemKind; label: string }[] = [
  { value: 'fact', label: 'Fact' }, { value: 'person', label: 'Person' }, { value: 'place', label: 'Place' },
  { value: 'number', label: 'Number' }, { value: 'word', label: 'Word' }, { value: 'event', label: 'Event' },
]
const dimensions: { value: MemoryDimension; label: string }[] = [
  { value: 'associative', label: 'Association' }, { value: 'names', label: 'Names' }, { value: 'numbers', label: 'Numbers' },
  { value: 'spatial', label: 'Spatial' }, { value: 'language', label: 'Language' },
]

export function RememberSomething({ onSaved, onCancel }: Props) {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [kind, setKind] = useState<MemoryItemKind>('fact')
  const [dimension, setDimension] = useState<MemoryDimension>('associative')
  const [smart, setSmart] = useState(true)

  function preview() {
    const draft = architectMemory([title, summary].filter(Boolean).join(' — '))
    setKind(draft.kind)
    setDimension(draft.dimensions[0] ?? 'associative')
    if (!summary.trim()) setSummary(draft.summary)
  }

  function save() {
    if (!title.trim()) return
    if (smart) {
      const draft = architectMemory([title, summary].filter(Boolean).join(' — '))
      createMemoryNode(draft)
    } else {
      createMemoryNode({ kind, title, summary, tags: [], dimensions: [dimension] })
    }
    onSaved()
  }

  return (
    <section className="remember-screen" aria-labelledby="remember-title">
      <button className="v2-back" type="button" onClick={onCancel}>← Memory</button>
      <p className="eyebrow">PUT IT IN YOUR MEMORY</p>
      <h1 id="remember-title">Remember something.</h1>
      <p className="v2-lead">Tell ANITEW naturally. It will identify the memory type and the cognitive dimensions that can be trained.</p>
      <label>What should you remember?
        <input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} onBlur={preview} placeholder="Sarah is an architect from Ghana and lives in Berlin" />
      </label>
      <label>Useful context
        <textarea value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Anything else that makes the memory meaningful" rows={4} />
      </label>
      <label className="smart-toggle"><input type="checkbox" checked={smart} onChange={(event) => setSmart(event.target.checked)} /><span><strong>ANITEW Memory Architect</strong><small>Automatically classify and prepare this memory for training.</small></span></label>
      {!smart && <><div className="choice-row">{kinds.map((item) => <button key={item.value} type="button" className={kind === item.value ? 'selected' : ''} onClick={() => setKind(item.value)}>{item.label}</button>)}</div><div className="choice-row">{dimensions.map((item) => <button key={item.value} type="button" className={dimension === item.value ? 'selected' : ''} onClick={() => setDimension(item.value)}>{item.label}</button>)}</div></>}
      <button className="mission-start" type="button" disabled={!title.trim()} onClick={save}><strong>CREATE MEMORY</strong><span>ANITEW will bring it back through retrieval practice.</span></button>
    </section>
  )
}
