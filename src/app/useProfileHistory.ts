import { useEffect, useMemo, useState } from 'react'

import {
  type DayKey,
  type DimensionCounts,
  type DimensionId,
  type Platform,
  type ProfileSnapshot,
  readProfileHistory,
  recordProfileSnapshot,
} from '../core/index.ts'

export interface ProfileHistoryState {
  history: readonly ProfileSnapshot[]
  ready: boolean
}

/**
 * Eine tägliche Momentaufnahme des bereits vorhandenen Gedächtnisprofils.
 *
 * Einstellungen sind hier absichtlich der Speicherort: Sie sind Teil von
 * ANITEWs Sicherung und Drive-Abgleich, ohne dass für E4 eine neue Tabelle
 * oder ein zweiter Sync-Pfad entsteht. Gespeichert werden nur Rohzählungen;
 * die Interpretation bleibt im Kern `profileOf`.
 */
export function useProfileHistory(
  platform: Platform,
  training: string,
  day: DayKey,
  counts: Partial<Record<DimensionId, DimensionCounts>>,
): ProfileHistoryState {
  const key = useMemo(() => `profile.history.${training}`, [training])
  const [history, setHistory] = useState<readonly ProfileSnapshot[]>([])
  const [loadedKey, setLoadedKey] = useState<string | undefined>()

  useEffect(() => {
    let cancelled = false
    setLoadedKey(undefined)
    setHistory([])
    void platform.settings
      .read<unknown>(key)
      .then((stored) => {
        if (cancelled) return
        setHistory(readProfileHistory(stored))
        setLoadedKey(key)
      })
      .catch(() => {
        if (cancelled) return
        setHistory([])
        setLoadedKey(key)
      })
    return () => {
      cancelled = true
    }
  }, [key, platform])

  useEffect(() => {
    if (loadedKey !== key) return
    if (!Object.values(counts).some((entry) => entry !== undefined && entry.chances > 0)) return

    const next = recordProfileSnapshot(history, day, counts)
    if (JSON.stringify(next) === JSON.stringify(history)) return
    setHistory(next)
    void platform.settings.write(key, next).catch(() => undefined)
  }, [counts, day, history, key, loadedKey, platform])

  return { history, ready: loadedKey === key }
}
