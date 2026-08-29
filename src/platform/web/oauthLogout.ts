const LOGOUT_PENDING_KEY = 'anitew.google-oauth.logout-pending.v1'
const LOGOUT_TIMEOUT_MS = 5_000

/**
 * Eine lokale Marke ist nötig, weil das eigentliche OAuth-Cookie HttpOnly ist:
 * wenn der Nutzer offline auf „Google-Konto trennen“ tippt, kann JavaScript
 * den Cookie weder sehen noch selbst löschen. `sync.on=false` trennt den
 * Datenabgleich sofort; diese Marke sorgt nur dafür, dass der Browser-Cookie
 * beim nächsten erreichbaren Worker ebenfalls wirklich verschwindet.
 */
export function googleLogoutPending(): boolean {
  try {
    return window.localStorage.getItem(LOGOUT_PENDING_KEY) === '1'
  } catch {
    return false
  }
}

function markGoogleLogoutPending(): void {
  try {
    window.localStorage.setItem(LOGOUT_PENDING_KEY, '1')
  } catch {
    // Geblockter Komfortspeicher darf das lokale Trennen nie verhindern.
  }
}

function clearGoogleLogoutPending(): void {
  try {
    window.localStorage.removeItem(LOGOUT_PENDING_KEY)
  } catch {
    // Der Worker hat die Sitzung bereits gelöscht. Mehr ist hier nicht nötig.
  }
}

/**
 * Beendet die sichere Browser-OAuth-Sitzung. `false` bedeutet nicht, dass
 * Drive weiter synchronisiert: die aufrufende UI schaltet `sync.on` vorher
 * dauerhaft aus. Es bedeutet nur, dass der Worker gerade nicht bestätigt hat,
 * den HttpOnly-Cookie gelöscht zu haben. Dann bleibt die Retry-Marke stehen.
 *
 * Die fünf Sekunden sind zugleich eine Race-Grenze: Während dieses kleinen
 * Fensters bleibt der Trennknopf im aufrufenden Panel beschäftigt; danach ist
 * entweder der Cookie bestätigt weg oder ein späterer Retry vorgemerkt. So
 * kann ein schneller erneuter Login nicht von einer verspäteten Logout-Antwort
 * wieder abgemeldet werden.
 */
export async function disconnectGoogleAuthorization(): Promise<boolean> {
  markGoogleLogoutPending()
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), LOGOUT_TIMEOUT_MS)
  let response: Response
  try {
    response = await fetch('/oauth/google/logout', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'x-anitew-request': '1' },
      signal: controller.signal,
    })
  } catch {
    return false
  } finally {
    window.clearTimeout(timeout)
  }
  if (!response.ok) return false
  clearGoogleLogoutPending()
  return true
}

/** Räumt einen offline liegengebliebenen Logout beim nächsten Netzfenster nach. */
export async function retryPendingGoogleLogout(): Promise<boolean> {
  if (!googleLogoutPending()) return true
  return disconnectGoogleAuthorization()
}
