import { useState } from 'react'
import { createMemoryNode } from '../../core/memory/MemoryStore.ts'
import type { MemoryDimension, MemoryItemKind } from '../../core/memory/MemoryTypes.ts'

type Props = { onSaved: () => void; onCancel: () => void }

const kinds: { value: MemoryItemKind; label: string }[] = [
  { value: 'fact', label: 'Fact' },
  { value: 'person', label: 'Person' },
  { value: 'place', label: 'Place' },
  { value: 'number', label: 'Number' },
  { value: 'word', label: 'Word' },
  { value: 'event', label: 'Event' },
]

const dimensions: { value: MemoryDimension; label: string }[] = [
  { value: 'associative', label: 'Association' },
  { value: 'names', label: 'Names' },
  { value: 'numbers', label: 'Numbers' },
  { value: 'spatial', label: 'Spatial' },
  { value: 'language', label: 'Language' },
]

export function RememberSomething({ onSaved, onCancel }: Props) {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [kind, setKind] = useState<MemoryItemKind>('fact')
  const [dimension, setDimension] = useState<MemoryDimension>('associative')

  function save() {
    if (!title.trim()) return
    createMemoryNode({ kind, title, summary, tags: [], dimensions: [dimension] })
    onSaved()
  }

  return (
    <section className="remember-screen" aria-labelledby="remember-title">
      <button className="v2-back" type="button" onClick={onCancel}>← Memory</button>
      <p className="eyebrow">PUT IT IN YOUR MEMORY</p>
      <h1 id="remember-title">Remember something.</h1>
      <p className="v2-lead">Give ANITEW something from your real life. We will turn it into future recall practice.</p>

      <label>What should you remember?
        <input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Daniel works at the museum" />
      </label>

      <label>Useful context
        <textarea value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Madrid · photographer · met Tuesday" rows={4} />
      </label>

      <div className="choice-row">
        {kinds.map((item) => <button key={item.value} type="button" className={kind === item.value ? 'selected' : ''} onClick={() => setKind(item.value)}>{item.label}</button>)}
      </div>
      <div className="choice-row">
        {dimensions.map((item) => <button key={item.value} type="button" className={dimension === item.value ? 'selected' : ''} onClick={() => setDimension(item.value)}>{item.label}</button>)}
      </div>

      <button className="mission-start" type="button" disabled={!title.trim()} onClick={save}>
        <strong>CREATE MEMORY</strong><span>Start the first recall later.</span>
      </button>
    </section>
  )
}
