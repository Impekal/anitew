import { useEffect, useRef, useState } from 'react'

import {
  type NodeSuggestion,
  type Platform,
  type RememberSuggestions,
  memoryNodeId,
  suggestMemories,
} from '../core/index.ts'
import { loadMemoryGraph, saveMemoryGraph } from '../data/memoryStore.ts'
import { applyRememberedSuggestions } from '../core/index.ts'
import { createWebArchitect } from '../platform/web/architect.ts'
import { scheduleDriveSync } from './driveSync.ts'
import {
  inferMemoryDeadlineInput,
  memoryDeadlineCopyForCurrentUi,
  parseMemoryDeadline,
} from './memoryDeadline.ts'
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
import './memoryDeadline.css'

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
  initialDraft,
  initialSuggestions,
}: {
  platform: Platform
  dictionary: Dictionary
  onSaved: (created: { nodeIds: readonly string[]; edgeIds: readonly string[] }) => void
  /**
   * Flüchtige Übergabe aus „Eigene Inhalte“ (I3). Sie füllt nur ein leeres
   * Feld und wird nie selbst gespeichert. Sobald der Mensch hier editiert,
   * gewinnt seine Eingabe — spätere Prop-Änderungen überschreiben nichts.
   */
  initialDraft?: string
  /**
   * Bereits gewaschene Vorschläge, z. B. aus der ausdrücklich ausgelösten
   * Fotoanalyse. Auch sie landen nur in der Vorschau; dieser Prop ist **kein**
   * Schreibzugriff. Abwählen, Editieren und Bestätigen bleiben unverändert.
   */
  initialSuggestions?: RememberSuggestions
}) {
  const texts = dictionary.memory
  const deadlineTexts = memoryDeadlineCopyForCurrentUi()

  const [draft, setDraft] = useState('')
  const [suggestions, setSuggestions] = useState<RememberSuggestions | undefined>(undefined)
  const [dropped, setDropped] = useState<ReadonlySet<string>>(new Set())
  const [saved, setSaved] = useState(false)
  // F-10 (Runde 2): Ein fehlgeschlagenes Speichern wird gesagt, nicht verschluckt.
  const [saveFailed, setSaveFailed] = useState(false)
  const [deadlineInput, setDeadlineInput] = useState('')
  const [deadlineInferred, setDeadlineInferred] = useState(false)
  const [deadlineError, setDeadlineError] = useState<string | undefined>()
  const appliedInitialDraft = useRef<string | undefined>(undefined)
  const appliedInitialSuggestions = useRef<RememberSuggestions | undefined>(undefined)

  // Der KI-Weg (D-037) ist ein Angebot, kein Pflichtpfad (M2): Er erscheint
  // nur, wenn beim gewählten Coach-Anbieter ein eigener Schlüssel liegt.
  const [aiProvider, setAiProvider] = useState<CoachProvider | undefined>(undefined)
  const [aiBusy, setAiBusy] = useState(false)
  const [aiFailure, setAiFailure] = useState<CoachFailure | undefined>(undefined)
  const [fromAi, setFromAi] = useState(false)

  useEffect(() => {
    if (
      initialDraft === undefined ||
      initialDraft.trim() === '' ||
      appliedInitialDraft.current === initialDraft
    ) {
      return
    }
    appliedInitialDraft.current = initialDraft
    setDraft((current) => (current.trim() === '' ? initialDraft : current))
  }, [initialDraft])

  useEffect(() => {
    if (initialSuggestions === undefined || appliedInitialSuggestions.current === initialSuggestions) {
      return
    }
    appliedInitialSuggestions.current = initialSuggestions
    setSuggestions(initialSuggestions)
    setDropped(new Set())
    setSaved(false)
    setFromAi(true)
    setAiFailure(undefined)
  }, [initialSuggestions])

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

  const inferDeadline = () => {
    if (deadlineInput !== '') return
    const inferred = inferMemoryDeadlineInput(draft, platform.clock.now())
    if (inferred === undefined) return
    setDeadlineInput(inferred)
    setDeadlineInferred(true)
    setDeadlineError(undefined)
  }

  const propose = () => {
    inferDeadline()
    const next = suggestMemories({ text: draft })
    setSuggestions(next)
    setDropped(new Set())
    setSaved(false)
    setFromAi(false)
    setAiFailure(undefined)
  }

  const proposeWithAi = () => {
    inferDeadline()
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

  const editNode = (id: string, label: string) => {
    if (suggestions === undefined) return
    const source = suggestions.nodes.find((node) => node.id === id)
    if (source === undefined) return
    const clean = label.replace(/\s+/gu, ' ').slice(0, 80)
    const nextId = memoryNodeId(source.type, clean)
    setSuggestions({
      nodes: suggestions.nodes.map((node) =>
        node.id === id ? { ...node, id: nextId, label: clean } : node,
      ),
      edges: suggestions.edges.map((edge) => ({
        ...edge,
        from: edge.from === id ? nextId : edge.from,
        to: edge.to === id ? nextId : edge.to,
      })),
    })
    if (dropped.has(id)) {
      const next = new Set(dropped)
      next.delete(id)
      next.add(nextId)
      setDropped(next)
    }
  }

  const removeEdge = (from: string, to: string) => {
    if (suggestions === undefined) return
    setSuggestions({
      ...suggestions,
      edges: suggestions.edges.filter((edge) => edge.from !== from || edge.to !== to),
    })
  }

  const confirm = () => {
    if (suggestions === undefined) return
    const confirmed: RememberSuggestions = {
      nodes: suggestions.nodes.filter(
        (node) => !dropped.has(node.id) && node.label.trim().length >= 2,
      ),
      edges: suggestions.edges,
    }
    if (confirmed.nodes.length === 0) return

    const now = platform.clock.now()
    const deadline = deadlineInput === '' ? undefined : parseMemoryDeadline(deadlineInput)
    if (deadlineInput !== '' && deadline === undefined) {
      setDeadlineError(deadlineTexts.invalid)
      return
    }
    if (deadline !== undefined && deadline.at <= now) {
      setDeadlineError(deadlineTexts.past)
      return
    }
    setDeadlineError(undefined)

    void (async () => {
      const graph = await loadMemoryGraph()
      const next = applyRememberedSuggestions(graph, confirmed, now, deadline)
      const existing = new Set(graph.nodes.map((node) => node.id))
      const newNodeIds = next.nodes.filter((node) => !existing.has(node.id)).map((node) => node.id)
      const existingEdges = new Set(graph.edges.map((edge) => edge.id))
      const newEdgeIds = next.edges.filter((edge) => !existingEdges.has(edge.id)).map((edge) => edge.id)
      const newConnections = next.edges.length - graph.edges.length
      await saveMemoryGraph(next)
      setDraft('')
      setDeadlineInput('')
      setDeadlineInferred(false)
      setSuggestions(undefined)
      setFromAi(false)
      setSaveFailed(false)
      setSaved(true)
      // Der Ton der Klangsprache fürs Aufheben — leise, kein Jubel (G-1).
      platform.sound.play('remember')
      if (newConnections > 0) platform.sound.play('connection')
      scheduleDriveSync(platform)
      onSaved({ nodeIds: newNodeIds, edgeIds: newEdgeIds })
    })().catch(() => {
      /*
       * F-10 (Runde 2): Lehnt IndexedDB den Schreibvorgang ab (z. B. volle
       * Quota), bleiben Eingabe und Vorschläge stehen — und der Grund steht
       * sichtbar da, statt dass „Bestätigen“ scheinbar nichts tut.
       */
      setSaved(false)
      setSaveFailed(true)
    })
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
          if (deadlineInferred) {
            setDeadlineInput('')
            setDeadlineInferred(false)
          }
          setSaved(false)
        }}
      />

      <label className="memory-deadline-field">
        <span>{deadlineTexts.label}</span>
        <input
          type="datetime-local"
          className="remember-deadline-input"
          value={deadlineInput}
          onChange={(event) => {
            setDeadlineInput(event.target.value)
            setDeadlineInferred(false)
            setDeadlineError(undefined)
            setSaved(false)
          }}
        />
      </label>
      <p className="hint memory-deadline-hint">{deadlineTexts.hint}</p>
      {deadlineInferred && (
        <p className="hint memory-deadline-inferred" role="status">
          {deadlineTexts.inferred}
        </p>
      )}
      {deadlineError !== undefined && (
        <p className="memory-deadline-error" role="status" aria-live="polite">
          {deadlineError}
        </p>
      )}

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
          <div className="remember-nodes" aria-label={texts.suggestionsNodes}>
            {suggestions.nodes.map((node, index) => (
              <div
                key={`${node.type}:${index}`}
                className={kept(node) ? 'remember-node' : 'remember-node remember-node-off'}
                onClick={() => toggle(node.id)}
              >
                <button
                  type="button"
                  className="remember-node-toggle"
                  aria-pressed={kept(node)}
                  aria-label={kept(node) ? texts.exclude.replace('{label}', node.label) : texts.include.replace('{label}', node.label)}
                  onClick={(event) => {
                    event.stopPropagation()
                    toggle(node.id)
                  }}
                >
                  <span aria-hidden="true">{kept(node) ? '●' : '○'}</span>
                </button>
                <label>
                  <small>{texts.types[node.type]}</small>
                  <input
                    value={node.label}
                    disabled={!kept(node)}
                    onChange={(event) => editNode(node.id, event.target.value)}
                    aria-label={texts.editLabel.replace('{label}', node.label)}
                    onClick={(event) => event.stopPropagation()}
                  />
                </label>
              </div>
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
                      <span>{labelOf(edge.from)} → {labelOf(edge.to)}</span>
                      <button type="button" className="quiet" onClick={() => removeEdge(edge.from, edge.to)} aria-label={texts.removeConnection}>{texts.removeConnection}</button>
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

      {saved && <p className="remember-saved" role="status" aria-live="polite">{texts.saved}</p>}
      {saveFailed && (
        <p className="coach-failure remember-failure" role="alert">
          {texts.saveFailed}
        </p>
      )}
    </section>
  )
}
