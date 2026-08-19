import { useState } from 'react'

import {
  type NodeSuggestion,
  type Platform,
  type RememberSuggestions,
  suggestMemories,
} from '../core/index.ts'
import { loadMemoryGraph, saveMemoryGraph } from '../data/memoryStore.ts'
import { applyRememberedSuggestions } from '../core/index.ts'
import type { Dictionary } from '../i18n/index.ts'

/**
 * „Etwas merken“ (D-036).
 *
 * Der Weg steht im Auftrag: echte Information rein → Vorschläge raus →
 * **der Mensch bestätigt** → erst dann wird gespeichert. Abwählen ist ein
 * Fingertipp; eine abgewählte Erinnerung reißt ihre Verbindungen still
 * mit. Keine ungeprüfte automatische Übernahme — auch später nicht, wenn
 * ein KI-Architekt die Vorschläge macht: Er liefert dieselbe Form, und
 * diese Oberfläche bleibt die Entscheidung.
 */
export function RememberThisPanel({
  platform,
  dictionary,
  onSaved,
}: {
  platform: Platform
  dictionary: Dictionary
  onSaved: () => void
}) {
  const texts = dictionary.memory

  const [draft, setDraft] = useState('')
  const [suggestions, setSuggestions] = useState<RememberSuggestions | undefined>(undefined)
  const [dropped, setDropped] = useState<ReadonlySet<string>>(new Set())
  const [saved, setSaved] = useState(false)

  const propose = () => {
    const next = suggestMemories({ text: draft })
    setSuggestions(next)
    setDropped(new Set())
    setSaved(false)
  }

  const toggle = (id: string) => {
    const next = new Set(dropped)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setDropped(next)
  }

  const confirm = () => {
    if (suggestions === undefined) return
    const confirmed: RememberSuggestions = {
      nodes: suggestions.nodes.filter((node) => !dropped.has(node.id)),
      edges: suggestions.edges,
    }
    if (confirmed.nodes.length === 0) return
    void (async () => {
      const graph = await loadMemoryGraph()
      await saveMemoryGraph(
        applyRememberedSuggestions(graph, confirmed, platform.clock.now()),
      )
      setDraft('')
      setSuggestions(undefined)
      setSaved(true)
      onSaved()
    })().catch(() => undefined)
  }

  const kept = (node: NodeSuggestion) => !dropped.has(node.id)
  const labelOf = (id: string) =>
    suggestions?.nodes.find((node) => node.id === id)?.label ?? id

  return (
    <section className="remember" aria-label={texts.rememberHeading}>
      <h3 className="coach-source">{texts.rememberHeading}</h3>
      <p className="hint">{texts.rememberIntro}</p>

      <textarea
        className="remember-input"
        rows={3}
        placeholder={texts.rememberPlaceholder}
        value={draft}
        onChange={(event) => {
          setDraft(event.target.value)
          setSaved(false)
        }}
      />
      <button
        type="button"
        className="quiet remember-suggest"
        onClick={propose}
        disabled={draft.trim() === ''}
      >
        {texts.suggest}
      </button>

      {suggestions !== undefined && suggestions.nodes.length === 0 && (
        <p className="hint">{texts.nothingFound}</p>
      )}

      {suggestions !== undefined && suggestions.nodes.length > 0 && (
        <div className="remember-preview">
          <p className="hint">{texts.suggestionsNodes}</p>
          <div className="remember-nodes">
            {suggestions.nodes.map((node) => (
              <button
                key={node.id}
                type="button"
                className={kept(node) ? 'remember-node' : 'remember-node remember-node-off'}
                aria-pressed={kept(node)}
                onClick={() => toggle(node.id)}
              >
                <strong>{node.label}</strong>
                <small>{texts.types[node.type]}</small>
              </button>
            ))}
          </div>

          {suggestions.edges.length > 0 && (
            <>
              <p className="hint">{texts.suggestionsEdges}</p>
              <ul className="remember-edges">
                {suggestions.edges
                  .filter((edge) => !dropped.has(edge.from) && !dropped.has(edge.to))
                  .map((edge) => (
                    <li key={`${edge.from}→${edge.to}`}>
                      {labelOf(edge.from)} → {labelOf(edge.to)}
                    </li>
                  ))}
              </ul>
            </>
          )}

          <div className="remember-actions">
            <button
              type="button"
              className="quiet remember-confirm"
              onClick={confirm}
              disabled={suggestions.nodes.every((node) => dropped.has(node.id))}
            >
              {texts.confirm}
            </button>
            <button type="button" className="quiet" onClick={() => setSuggestions(undefined)}>
              {texts.cancel}
            </button>
          </div>
        </div>
      )}

      {saved && <p className="remember-saved">{texts.saved}</p>}
    </section>
  )
}
