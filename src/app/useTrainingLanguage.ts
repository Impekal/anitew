import { useCallback, useEffect, useState } from 'react'

import { persistThenApply } from './persistThenApply.ts'

import { type Language, type Platform, resolveTrainingLanguage } from '../core/index.ts'

const SETTING_KEY = 'training.language'

export interface TrainingLanguageState {
  training: Language
  chooseTraining: (language: Language) => void
  /** Ließ sich die zuletzt gewählte Trainingssprache nicht speichern? (R3-06) */
  saveFailed: boolean
}

/**
 * Worin trainiert wird (Backlog L7).
 *
 * Getrennt von `useLanguage`, und zwar bewusst als **eigener** Haken: Die
 * Oberflächensprache darf auf Englisch zurückfallen und sagt das; die
 * Trainingssprache darf das nicht, weil der Inhalt die Übung ist. Zwei
 * verschiedene Regeln in einem Haken zu führen hieße, sie irgendwann zu
 * verwechseln.
 *
 * Ohne eigene Wahl folgt sie der Oberfläche — wer die App auf Deutsch
 * bedient, trainiert auf Deutsch, bis er etwas anderes sagt.
 */
export function useTrainingLanguage(platform: Platform, ui: Language): TrainingLanguageState {
  const [chosen, setChosen] = useState<string | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const stored = await platform.settings.read<string>(SETTING_KEY).catch(() => undefined)
      if (!cancelled) setChosen(stored)
    })()
    return () => {
      cancelled = true
    }
  }, [platform])

  // R3-06: erst speichern, dann anzeigen — wie Sprache und Ton.
  const [saveFailed, setSaveFailed] = useState(false)
  const chooseTraining = useCallback(
    (next: Language) => {
      void persistThenApply(
        () => platform.settings.write(SETTING_KEY, next),
        () => {
          setSaveFailed(false)
          setChosen(next)
        },
        () => setSaveFailed(true),
      )
    },
    [platform],
  )

  return { training: resolveTrainingLanguage(chosen, ui), chooseTraining, saveFailed }
}
