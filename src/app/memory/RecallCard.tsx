import { useMemo, useState } from 'react'
import type { MemoryNode } from '../../core/memory/MemoryTypes.ts'
import { buildRecallPrompts, scoreRecall } from '../../core/memory/RecallEngine.ts'

type Props = { node: MemoryNode; onComplete: (score: number) => void }

export function RecallCard({ node, onComplete }: Props) {
  const prompt = useMemo(() => buildRecallPrompts(node)[0], [node])
  const [response, setResponse] = useState('')
  const [revealed, setRevealed] = useState(false)
  const score = scoreRecall(prompt.answer, response)

  return (
    <section className="recall-card" aria-labelledby="recall-question">
      <p className="eyebrow">RETRIEVAL PRACTICE</p>
      <h2 id="recall-question">{prompt.question}</h2>
      {!revealed ? (
        <>
          <textarea autoFocus value={response} onChange={(event) => setResponse(event.target.value)} placeholder="Recall it before you look." rows={4} />
          <div className="recall-actions">
            <button type="button" onClick={() => setRevealed(true)}>Reveal</button>
            <button type="button" disabled={!response.trim()} onClick={() => onComplete(score)}>I remembered it</button>
          </div>
        </>
      ) : (
        <div className="recall-answer">
          <span>The memory</span>
          <strong>{prompt.answer}</strong>
          <button type="button" onClick={() => onComplete(score)}>Continue</button>
        </div>
      )}
    </section>
  )
}
