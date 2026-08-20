import { useEffect, useState } from 'react'

import {
  type DayKey,
  type DimensionCounts,
  type DimensionId,
  type Platform,
  type ProfileSnapshot,
  readProfileHistory,
  recordProfileSnapshot,
  resolveLanguage,
  resolveTrainingLanguage,
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
 *
 * Die Trainingssprache wird aus derselben gespeicherten Wahl aufgelöst wie im
 * App-Haken. Das ist wichtig: Deutsch und Englisch sind zwei verschiedene
 * Reihen. Ein Sprachwechsel darf nie wie ein Gedächtniseinbruch aussehen.
 */
export function useProfileHistory(
  platform: Platform,
  day: DayKey,
  counts: Partial<Record<DimensionId, DimensionCounts>>,
): ProfileHistoryState {
  const [history, setHistory] = useState<readonly ProfileSnapshot[]>([])
  const [key, setKey] = useState<string | undefined>()
  const [loadedKey, setLoadedKey] = useState<string | undefined>()

  useEffect(() => {
    let cancelled = false
    void platform.settings
      .read<string>('training.language')
      .catch(() => undefined)
      .then((chosen) => {
        if (cancelled) return
        const ui = resolveLanguage(document.documentElement.lang || undefined, navigator.languages)
        const training = resolveTrainingLanguage(chosen, ui)
        setKey(`profile.history.${training}`)
      })
    return () => {
      cancelled = true
    }
  }, [platform])

  useEffect(() => {
    if (key === undefined) return
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
    if (key === undefined || loadedKey !== key) return
    if (!Object.values(counts).some((entry) => entry !== undefined && entry.chances > 0)) return

    const next = recordProfileSnapshot(history, day, counts)
    if (JSON.stringify(next) === JSON.stringify(history)) return
    setHistory(next)
    void platform.settings.write(key, next).catch(() => undefined)
  }, [counts, day, history, key, loadedKey, platform])

  return { history, ready: key !== undefined && loadedKey === key }
}
