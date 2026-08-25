import { useEffect, useMemo, useState } from 'react'

import {
  MAX_PEOPLE_SCENARIO,
  applyRememberedSuggestions,
  peopleScenarioSuggestions,
} from '../core/index.ts'
import { loadMemoryGraph, saveMemoryGraph } from '../data/memoryStore.ts'
import { createWebPlatform } from '../platform/web/index.ts'
import { scheduleDriveSync } from './driveSync.ts'
import { peopleScenarioCopyForCurrentUi } from './peopleScenarioCopy.ts'
import { memoryDeadlineCopyForCurrentUi, parseMemoryDeadline } from './memoryDeadline.ts'
import './peopleScenario.css'
import './memoryDeadline.css'

interface PersonRow {
  readonly id: number
  readonly name: string
  readonly facts: string
}

function blankRow(id: number): PersonRow {
  return { id, name: '', facts: '' }
}

function splitFacts(value: string): string[] {
  return value
    .split(/[,;\n]/u)
    .map((part) => part.trim())
    .filter(Boolean)
}

/**
 * I2 · „Ich treffe neue Menschen“.
 *
 * Das ist kein zweiter Trainer. Die strukturierte Eingabe verhindert nur,
 * dass ein Freitext mit mehreren Namen fälschlich alles an die erste Person
 * hängt. Nach der Vorschau landet die Bestätigung im selben Memory Graph;
 * Training, Gegenfragen und FSRS kommen danach aus der bestehenden Engine.
 */
export function PeopleScenario() {
  const copy = peopleScenarioCopyForCurrentUi()
  const deadlineTexts = memoryDeadlineCopyForCurrentUi()
  const platform = useMemo(() => createWebPlatform(), [])
  const [open, setOpen] = useState(false)
  const [rows, setRows] = useState<readonly PersonRow[]>([blankRow(1), blankRow(2)])
  const [nextId, setNextId] = useState(3)
  const [preview, setPreview] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [deadlineInput, setDeadlineInput] = useState('')

  useEffect(() => {
    let active = true
    void platform.settings
      .read<boolean>('sound')
      .then((enabled) => {
        if (active && enabled !== undefined) platform.sound.setEnabled(enabled)
      })
      .catch(() => undefined)
    return () => {
      active = false
    }
  }, [platform])

  const suggestions = peopleScenarioSuggestions(
    rows.map((row) => ({ name: row.name, facts: splitFacts(row.facts) })),
  )
  const canPrepare = suggestions.edges.length > 0
  const nodeById = new Map(suggestions.nodes.map((node) => [node.id, node]))
  const people = suggestions.nodes.filter((node) => node.type === 'person')

  const changeRow = (id: number, patch: Partial<Pick<PersonRow, 'name' | 'facts'>>) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)))
    setPreview(false)
    setSaved(false)
    setError(undefined)
  }

  const addRow = () => {
    if (rows.length >= MAX_PEOPLE_SCENARIO) return
    setRows((current) => [...current, blankRow(nextId)])
    setNextId((value) => value + 1)
    setPreview(false)
  }

  const removeRow = (id: number) => {
    setRows((current) => current.filter((row) => row.id !== id))
    setPreview(false)
    setSaved(false)
    setError(undefined)
  }

  const prepare = () => {
    if (!canPrepare) {
      setError(copy.needsFacts)
      return
    }
    setError(undefined)
    setSaved(false)
    setPreview(true)
  }

  const confirm = () => {
    if (!preview || suggestions.edges.length === 0 || saved) return
    const now = platform.clock.now()
    const deadline = deadlineInput === '' ? undefined : parseMemoryDeadline(deadlineInput)
    if (deadlineInput !== '' && deadline === undefined) {
      setError(deadlineTexts.invalid)
      return
    }
    if (deadline !== undefined && deadline.at <= now) {
      setError(deadlineTexts.past)
      return
    }
    setError(undefined)

    void (async () => {
      const graph = await loadMemoryGraph()
      const next = applyRememberedSuggestions(graph, suggestions, now, deadline)
      const newConnections = next.edges.length - graph.edges.length
      await saveMemoryGraph(next)
      platform.sound.play('remember')
      if (newConnections > 0) platform.sound.play('connection')
      scheduleDriveSync(platform)
      setSaved(true)
    })().catch(() => undefined)
  }

  return (
    <section className="people-scenario" aria-label={copy.heading}>
      <button
        type="button"
        className="quiet people-scenario-toggle"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {copy.heading}
      </button>

      {open && (
        <div className="people-scenario-body">
          <p className="hint">{copy.intro}</p>
          <p className="hint">{copy.local}</p>

          <div className="people-scenario-rows">
            {rows.map((row, index) => (
              <div className="people-scenario-row" key={row.id}>
                <input
                  className="people-name"
                  value={row.name}
                  placeholder={copy.name}
                  aria-label={`${copy.name} ${index + 1}`}
                  onChange={(event) => changeRow(row.id, { name: event.target.value })}
                />
                <input
                  className="people-facts"
                  value={row.facts}
                  placeholder={copy.facts}
                  aria-label={`${copy.facts} ${index + 1}`}
                  onChange={(event) => changeRow(row.id, { facts: event.target.value })}
                />
                {rows.length > 1 && (
                  <button
                    type="button"
                    className="quiet people-remove"
                    aria-label={`${copy.remove} ${index + 1}`}
                    onClick={() => removeRow(row.id)}
                  >
                    {copy.remove}
                  </button>
                )}
              </div>
            ))}
          </div>

          <label className="memory-deadline-field people-deadline-field">
            <span>{deadlineTexts.label}</span>
            <input
              type="datetime-local"
              className="people-deadline-input"
              value={deadlineInput}
              onChange={(event) => {
                setDeadlineInput(event.target.value)
                setSaved(false)
                setError(undefined)
              }}
            />
          </label>
          <p className="hint memory-deadline-hint">{deadlineTexts.hint}</p>

          <div className="remember-actions">
            {rows.length < MAX_PEOPLE_SCENARIO && (
              <button type="button" className="quiet people-add" onClick={addRow}>
                {copy.add}
              </button>
            )}
            <button type="button" className="quiet people-prepare" onClick={prepare}>
              {copy.preview}
            </button>
          </div>

          {error !== undefined && (
            <p className="hint people-error" role="status" aria-live="polite">
              {error}
            </p>
          )}

          {preview && (
            <div className="people-preview">
              <ul>
                {people.map((person) => {
                  const facts = suggestions.edges
                    .filter((edge) => edge.from === person.id)
                    .map((edge) => nodeById.get(edge.to)?.label)
                    .filter((label): label is string => label !== undefined)
                  return (
                    <li key={person.id}>
                      <strong>{person.label}</strong>
                      <span>{facts.join(' · ')}</span>
                    </li>
                  )
                })}
              </ul>
              <button
                type="button"
                className="quiet people-confirm"
                disabled={saved}
                onClick={confirm}
              >
                {copy.confirm}
              </button>
            </div>
          )}

          {saved && (
            <p className="remember-saved people-saved" role="status" aria-live="polite">
              {copy.saved}
            </p>
          )}
        </div>
      )}
    </section>
  )
}
