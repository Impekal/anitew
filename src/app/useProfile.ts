import { useCallback, useEffect, useState } from 'react'

import {
  type OnboardingProfile,
  type Platform,
  isOnboardingProfile,
} from '../core/index.ts'

const SETTING_KEY = 'profile.onboarding'

export interface ProfileState {
  /** `undefined` = noch nie gefragt. Ein leeres Objekt = gefragt, übersprungen. */
  profile: OnboardingProfile | undefined
  /** Erst wenn der Speicher gelesen ist, darf das Ankommen entscheiden. */
  ready: boolean
  save: (profile: OnboardingProfile) => void
}

/**
 * Das Ankommens-Profil im Speicher.
 *
 * Das `ready`-Tor ist hier kein Komfort, sondern die Bedingung: Ohne es
 * zeigte die App jedem wiederkehrenden Nutzer für einen Wimpernschlag das
 * Ankommen — der Speicher ist asynchron, der erste Render nicht. Wer schon
 * geantwortet hat (und sei es mit „nichts“), wird nie wieder gefragt.
 */
export function useProfile(platform: Platform): ProfileState {
  const [profile, setProfile] = useState<OnboardingProfile | undefined>(undefined)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const stored = await platform.settings.read<unknown>(SETTING_KEY).catch(() => undefined)
      if (cancelled) return
      // Nur Wohlgeformtes übernehmen — Kaputtes zählt als „nie gefragt“ und
      // wird beim nächsten Speichern ersetzt statt die App zu verwirren.
      if (isOnboardingProfile(stored)) setProfile(stored)
      setReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [platform])

  const save = useCallback(
    (next: OnboardingProfile) => {
      setProfile(next)
      void platform.settings.write(SETTING_KEY, next).catch(() => undefined)
    },
    [platform],
  )

  return { profile, ready, save }
}
