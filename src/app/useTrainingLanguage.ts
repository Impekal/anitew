import { useCallback, useEffect, useState } from 'react'

import { type Language, type Platform, resolveTrainingLanguage } from '../core/index.ts'

const SETTING_KEY = 'training.language'

export interface TrainingLanguageState {
  training: Language
  chooseTraining: (language: Language) => void
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

  const chooseTraining = useCallback(
    (next: Language) => {
      setChosen(next)
      void platform.settings.write(SETTING_KEY, next).catch(() => undefined)
    },
    [platform],
  )

  return { training: resolveTrainingLanguage(chosen, ui), chooseTraining }
}
