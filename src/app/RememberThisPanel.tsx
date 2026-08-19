import { useEffect, useState } from 'react'

import {
  type NodeSuggestion,
  type Platform,
  type RememberSuggestions,
  suggestMemories,
} from '../core/index.ts'
import { loadMemoryGraph, saveMemoryGraph } from '../data/memoryStore.ts'
import { applyRememberedSuggestions } from '../core/index.ts'
import { createWebArchitect } from '../platform/web/architect.ts'
import { scheduleDriveSync } from './driveSync.ts'
import {
  COACH_PROVIDERS,
  COACH_PROVIDER_NAMES,
  COACH_PROVIDER_SETTING,
  CoachError,
  type CoachFailure,
  type CoachProvider,
  LEGACY_COACH_KEY_SETTING,
  coachKeySettingFor,
} from '../platform/web/coach.ts'
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

  // Der KI-Weg (D-037) ist ein Angebot, kein Pflichtpfad (M2): Er erscheint
  // nur, wenn beim gewählten Coach-Anbieter ein eigener Schlüssel liegt.
  const [aiProvider, setAiProvider] = useState<CoachProvider | undefined>(undefined)
  const [aiBusy, setAiBusy] = useState(false)
  const [aiFailure, setAiFailure] = useState<CoachFailure | undefined>(undefined)
  const [fromAi, setFromAi] = useState(false)

  useEffect(() => {
    void (async () => {
      const stored = await platform.settings.read<CoachProvider>(COACH_PROVIDER_SETTING)
      const provider =
        stored !== undefined && COACH_PROVIDERS.includes(stored) ? stored : COACH_PROVIDERS[0]
      const key =
        (await platform.settings.read<string>(coachKeySettingFor(provider))) ??
        (provider === 'anthropic'
          ? await platform.settings.read<string>(LEGACY_COACH_KEY_SETTING)
          : undefined)
      setAiProvider(key !== undefined && key.trim() !== '' ? provider : undefined)
    })().catch(() => undefined)
  }, [platform])

  const propose = () => {
    const next = suggestMemories({ text: draft })
    setSuggestions(next)
    setDropped(new Set())
    setSaved(false)
    setFromAi(false)
    setAiFailure(undefined)
  }

  const proposeWithAi = () => {
    setAiBusy(true)
    setAiFailure(undefined)
    void (async () => {
      try {
        const next = await createWebArchitect(platform.coach).suggest(draft.trim())
        setSuggestions(next)
        setDropped(new Set())
        setSaved(false)
        setFromAi(true)
      } catch (error) {
        setAiFailure(error instanceof CoachError ? error.reason : 'failed')
      } finally {
        setAiBusy(false)
      }
    })()
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
      setFromAi(false)
      setSaved(true)
      // Der Ton der Klangsprache fürs Aufheben — leise, kein Jubel (G-1).
      platform.sound.play('remember')
      scheduleDriveSync(platform)
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
      <div className="remember-actions">
        <button
          type="button"
          className="quiet remember-suggest"
          onClick={propose}
          disabled={draft.trim() === '' || aiBusy}
        >
          {texts.suggest}
        </button>
        {aiProvider !== undefined && (
          <button
            type="button"
            className="quiet remember-ai"
            onClick={proposeWithAi}
            disabled={draft.trim() === '' || aiBusy}
          >
            {texts.aiSuggest}
          </button>
        )}
      </div>
      {aiProvider !== undefined && (
        <p className="hint remember-ainote">
          {texts.aiNote.replace('{provider}', COACH_PROVIDER_NAMES[aiProvider])}
        </p>
      )}
      {aiBusy && <p className="hint remember-aibusy">{texts.aiBusy}</p>}
      {aiFailure !== undefined && (
        <p className="coach-failure remember-failure">{dictionary.coach.errors[aiFailure]}</p>
      )}

      {suggestions !== undefined && suggestions.nodes.length === 0 && (
        <p className="hint">{texts.nothingFound}</p>
      )}

      {suggestions !== undefined && suggestions.nodes.length > 0 && (
        <div className="remember-preview">
          {fromAi && <p className="hint remember-aisource">{texts.aiSource}</p>}
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
