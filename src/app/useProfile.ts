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
  /**
   * Erst speichern, dann den sichtbaren Zustand umschalten.
   *
   * Das ist absichtlich ein Promise: Ein sofortiger Reload nach „Ohne Fragen
   * anfangen“ darf nicht zwischen React-State und IndexedDB-Schreibvorgang
   * fallen. Sonst ist der Startbildschirm schon sichtbar, obwohl „nie wieder
   * fragen“ noch gar nicht dauerhaft auf dem Gerät liegt.
   */
  save: (profile: OnboardingProfile) => Promise<void>
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
    async (next: OnboardingProfile) => {
      // Persistenz ist die Commit-Grenze des Onboardings. Auch wenn ein
      // Browser nicht dauerhaft speichern kann, warten wir auf den Versuch,
      // bevor die Oberfläche „fertig“ meldet; der Plattform-Layer darf dabei
      // wie bisher auf seinen flüchtigen Fallback zurückfallen.
      await platform.settings.write(SETTING_KEY, next).catch(() => undefined)
      setProfile(next)
    },
    [platform],
  )

  return { profile, ready, save }
}
