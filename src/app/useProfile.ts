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
   * Speichert best effort und übernimmt die Antwort immer für diese laufende
   * App-Sitzung. Ob sie einen Neustart überlebt, wird separat durch P7 geprüft
   * und bei fehlender Persistenz global sichtbar gesagt.
   *
   * Das ist absichtlich ein Promise: Auf einem normalen Gerät wartet ein
   * sofortiger Reload nach „Direkt starten“ damit weiterhin auf den
   * IndexedDB-Schreibversuch. Im privaten Modus darf derselbe fehlende
   * Speicher ANITEW aber nicht im Onboarding festhalten.
   */
  save: (profile: OnboardingProfile) => Promise<void>
}

/**
 * Das Ankommens-Profil im Speicher.
 *
 * Das `ready`-Tor ist hier kein Komfort, sondern die Bedingung: Ohne es
 * zeigte die App jedem wiederkehrenden Nutzer für einen Wimpernschlag das
 * Ankommen — der Speicher ist asynchron, der erste Render nicht. Wer schon
 * geantwortet hat (und sei es mit „nichts“), wird nie wieder gefragt, solange
 * der Speicher verfügbar ist.
 *
 * Fehlt IndexedDB vollständig oder scheitert ein Schreibvorgang, bleibt das
 * Profil für diese Sitzung trotzdem im React-State. Das ist kein behaupteter
 * Dauererfolg: `useStoragePersists` prüft Schreiben + Rücklesen unabhängig und
 * zeigt in genau diesem Fall die globale Warnung, dass beim Schließen nichts
 * erhalten bleibt. So bleibt ANITEW auch im privaten Modus benutzbar, ohne
 * stillen Datenverlust vorzutäuschen.
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
      // Persistenz zuerst versuchen, damit ein normaler erfolgreicher Pfad
      // die Dauerhaftigkeit vor dem sichtbaren Umschalten erreicht. Scheitert
      // sie, ist der in-memory Fallback trotzdem nötig: P7 verspricht bewusst,
      // dass Training auch ohne Datenbank weiterläuft und sagt dann separat,
      // dass beim Schließen nichts erhalten bleibt.
      await platform.settings.write(SETTING_KEY, next).catch(() => undefined)
      setProfile(next)
    },
    [platform],
  )

  return { profile, ready, save }
}
