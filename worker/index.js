const APP_ORIGIN = 'https://anitew.impekaltech.workers.dev'
const CLIENT_ID = '360791045103-jvbjtv7mdatp4f5svtcfj7uabjm7jdok.apps.googleusercontent.com'
const REDIRECT_URI = `${APP_ORIGIN}/oauth/google/callback`
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token'
const REVOKE_ENDPOINT = 'https://oauth2.googleapis.com/revoke'
const CREDENTIAL_COOKIE = 'anitew_google_oauth'
const STATE_COOKIE = 'anitew_google_oauth_state'
const PUSH_STATE_KEY = 'push-state-v1'

/**
 * Absolute Obergrenze einer Google-Sitzung (D-049). PRIVACY verspricht
 * „läuft nach spätestens 180 Tagen ab“ — deshalb wird der Ablauf beim
 * ersten Login mit versiegelt und bei jedem Refresh nur **übernommen**,
 * nie verlängert. Ein rollierendes Fenster wäre eine stille Falschaussage.
 */
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 180

/**
 * Übergangsfrist für Sitzungen aus der Zeit vor D-049 (R3-02, Runde 3).
 *
 * Solche Cookies tragen keinen Anmeldezeitpunkt, und er lässt sich auch
 * nicht rekonstruieren — raten wäre eine erfundene Zahl. Ihnen erneut volle
 * 180 Tage zu geben, machte PRIVACYs „höchstens 180 Tage ab Anmeldung“ zur
 * Falschaussage; sie sofort abzumelden, wäre ein grundloser Datenverlust
 * für bestehende Nutzer. Sie laufen deshalb 30 Tage nach der ersten
 * Begegnung mit dieser Fassung ab — kürzer als jede Restlaufzeit, die sie
 * unter der alten Regel noch gehabt hätten, und in PRIVACY §9/§11 als
 * Übergangsregel benannt.
 */
const LEGACY_SESSION_GRACE_MS = 1000 * 60 * 60 * 24 * 30

/**
 * Die Schreib-Endpunkte unter /push/* sind ohne Konto erreichbar — der
 * CSRF-Schutz (sameOriginRequest) hält Browser fremder Seiten fern, aber
 * kein Skript mit frei gesetzten Headern. Damit der Worker nicht als
 * Relais für beliebige HTTPS-Adressen taugt (F-03, Runde 2), akzeptiert er
 * nur die echten Web-Push-Dienste der Browser. Wer einen Browser mit
 * anderem Pushdienst mitbringt, bekommt eine ehrliche Ablehnung statt
 * einer stillen — die Liste ist bewusst erweiterbar.
 */
const PUSH_ENDPOINT_HOSTS = [
  'fcm.googleapis.com', // Chrome, Chromium-Familie (FCM)
  'updates.push.services.mozilla.com', // Firefox
  'web.push.apple.com', // Safari / iOS
]
const PUSH_ENDPOINT_SUFFIXES = [
  '.push.apple.com', // Apples regionale Varianten
  '.notify.windows.com', // Edge (WNS)
]

/**
 * Wie weit ein Termin in der Zukunft liegen darf. Die App plant nie weiter
 * als bis morgen; 60 Tage sind großzügig für Uhren, die falsch gehen — und
 * eng genug, dass niemand Jahre im Voraus Speicher belegt.
 */
const SCHEDULE_HORIZON_MS = 60 * 86_400_000

/**
 * Wie lange eine Zustellnotiz auf ihre Abholung warten darf (F-05, Runde 2).
 * Die Tagesnotiz ist nach einem Tag vom nächsten Termin überholt; die
 * Messnotiz gehört zu einem 45-Minuten-Fenster. Danach wird gelöscht statt
 * veraltet zugestellt — und PRIVACY kann eine echte Höchstfrist nennen.
 */
const PENDING_TTL_MS = { daily: 24 * 3_600_000, benchmark: 60 * 60_000 }
const PENDING_MAX = 8

/**
 * Wie oft eine Zustellung wiederholt wird, bevor sie aufgegeben wird
 * (R3-01, Runde 3). Vorher warf der Alarm bei jedem Pushdienst-Fehler, und
 * die Wiederholung lag allein bei Cloudflare: Sind dessen Versuche
 * erschöpft, hätte niemand mehr aufgeräumt — die zugesagte Höchstfrist der
 * Zustellnotiz wäre damit nicht mehr garantiert gewesen. ANITEW steuert die
 * Wiederholungen deshalb selbst, mit wachsendem Abstand (1, 2, 4, 8 min)
 * statt eines 250-ms-Dauerfeuers auf einen längst überfälligen Termin.
 */
const PUSH_MAX_ATTEMPTS = 5
const PUSH_RETRY_BASE_MS = 60_000
const encoder = new TextEncoder()
const decoder = new TextDecoder()

function cookiesOf(request) {
  const header = request.headers.get('cookie') ?? ''
  const result = new Map()
  for (const item of header.split(';')) {
    const at = item.indexOf('=')
    if (at < 0) continue
    const key = item.slice(0, at).trim()
    const value = item.slice(at + 1).trim()
    if (key !== '') result.set(key, value)
  }
  return result
}

function base64Url(bytes) {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/u, '')
}

function fromBase64Url(value) {
  const padded = value.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - (value.length % 4)) % 4)
  const binary = atob(padded)
  return Uint8Array.from(binary, (char) => char.charCodeAt(0))
}

async function credentialKey(secret) {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    encoder.encode(`ANITEW Google OAuth cookie v1\n${secret}`),
  )
  return crypto.subtle.importKey('raw', digest, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt'])
}

export async function seal(value, secret) {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await credentialKey(secret)
  const encrypted = new Uint8Array(
    await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(JSON.stringify(value))),
  )
  const packed = new Uint8Array(iv.length + encrypted.length)
  packed.set(iv)
  packed.set(encrypted, iv.length)
  return base64Url(packed)
}

export async function unseal(value, secret) {
  try {
    const packed = fromBase64Url(value)
    if (packed.length <= 12) return undefined
    const iv = packed.slice(0, 12)
    const encrypted = packed.slice(12)
    const key = await credentialKey(secret)
    const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted)
    return JSON.parse(decoder.decode(plaintext))
  } catch {
    return undefined
  }
}

function credentialCookie(value, maxAge) {
  return `${CREDENTIAL_COOKIE}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`
}

function clearCredentialCookie() {
  return `${CREDENTIAL_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`
}

function clearStateCookie() {
  return `${STATE_COOKIE}=; Path=/; Max-Age=0; Secure; SameSite=Lax`
}

function appRedirect(status, detail, extraCookies = []) {
  const destination = new URL('/', APP_ORIGIN)
  destination.searchParams.set('googleOAuth', status)
  if (detail) destination.searchParams.set('detail', detail)
  const headers = new Headers({
    location: destination.toString(),
    'cache-control': 'no-store',
    'referrer-policy': 'no-referrer',
  })
  headers.append('set-cookie', clearStateCookie())
  for (const cookie of extraCookies) headers.append('set-cookie', cookie)
  return new Response(null, { status: 302, headers })
}

async function exchangeCode(code, secret) {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: secret,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok || typeof body.access_token !== 'string' || body.access_token === '') {
    const detail = typeof body.error === 'string' ? body.error : `token_http_${response.status}`
    throw new Error(detail)
  }
  return body
}

async function refreshAccessToken(refreshToken, secret) {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: secret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok || typeof body.access_token !== 'string' || body.access_token === '') {
    return undefined
  }
  return body
}

async function handleCallback(request, env) {
  if (!env.GOOGLE_CLIENT_SECRET) return appRedirect('error', 'oauth_server_not_configured')

  const url = new URL(request.url)
  const state = url.searchParams.get('state')
  const expectedState = cookiesOf(request).get(STATE_COOKIE)
  if (!state || !expectedState || state !== expectedState) {
    return appRedirect('error', 'state_mismatch')
  }

  const oauthError = url.searchParams.get('error')
  if (oauthError) return appRedirect('error', oauthError)
  const code = url.searchParams.get('code')
  if (!code) return appRedirect('error', 'authorization_code_missing')

  try {
    const token = await exchangeCode(code, env.GOOGLE_CLIENT_SECRET)
    const expiresIn = typeof token.expires_in === 'number' ? token.expires_in : 3600
    const credential = {
      accessToken: token.access_token,
      expiresAt: Date.now() + Math.max(60, expiresIn - 60) * 1000,
      refreshToken: typeof token.refresh_token === 'string' ? token.refresh_token : undefined,
      // Der absolute Sitzungsablauf entsteht genau einmal: beim Login.
      sessionExpiresAt: Date.now() + SESSION_MAX_AGE_MS,
    }
    const sealed = await seal(credential, env.GOOGLE_CLIENT_SECRET)
    const maxAge = credential.refreshToken
      ? Math.floor(SESSION_MAX_AGE_MS / 1000)
      : Math.max(60, expiresIn)
    return appRedirect('complete', undefined, [credentialCookie(sealed, maxAge)])
  } catch (error) {
    return appRedirect('error', error instanceof Error ? error.message : 'token_exchange_failed')
  }
}

function sameOriginRequest(request) {
  if (request.method !== 'POST') return false
  if (request.headers.get('x-anitew-request') !== '1') return false
  const origin = request.headers.get('origin')
  return origin === null || origin === new URL(request.url).origin
}

function json(body, status = 200, cookie) {
  const headers = new Headers({
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'referrer-policy': 'no-referrer',
  })
  if (cookie) headers.append('set-cookie', cookie)
  return new Response(JSON.stringify(body), { status, headers })
}

async function handleAccessToken(request, env) {
  if (!sameOriginRequest(request)) return json({ error: 'forbidden' }, 403)
  if (!env.GOOGLE_CLIENT_SECRET) return json({ error: 'oauth_server_not_configured' }, 503)

  const sealed = cookiesOf(request).get(CREDENTIAL_COOKIE)
  if (!sealed) return json({ error: 'not_signed_in' }, 401)
  const credential = await unseal(sealed, env.GOOGLE_CLIENT_SECRET)
  if (!credential || typeof credential.accessToken !== 'string') {
    return json({ error: 'invalid_session' }, 401, clearCredentialCookie())
  }

  /*
   * Altbestand ohne absoluten Ablauf bekommt die kurze Übergangsfrist, nicht
   * ein frisches 180-Tage-Fenster (R3-02).
   */
  const legacy = typeof credential.sessionExpiresAt !== 'number'
  const sessionExpiresAt = legacy
    ? Date.now() + LEGACY_SESSION_GRACE_MS
    : credential.sessionExpiresAt
  if (sessionExpiresAt <= Date.now()) {
    return json({ error: 'session_expired' }, 401, clearCredentialCookie())
  }

  if (typeof credential.expiresAt === 'number' && credential.expiresAt > Date.now() + 30_000) {
    /*
     * R4-01 (Runde 4): Die Frist muss **hier** festgeschrieben werden, nicht
     * erst beim nächsten Refresh. Vorher berechnete dieser Pfad zwar die
     * 30 Tage, gab aber kein neues Cookie zurück — war Googles Access-Token
     * noch gültig, blieb die Alt-Sitzung ohne Ablauf gespeichert. Wer erst
     * nach vier Wochen wiederkam, bekam die Frist erst dann versiegelt und
     * lebte damit deutlich länger als die in PRIVACY §9 zugesagten 30 Tage.
     */
    if (!legacy) return json({ access_token: credential.accessToken })

    const sealedNow = await seal(
      { ...credential, sessionExpiresAt },
      env.GOOGLE_CLIENT_SECRET,
    )
    const remainingNow = Math.max(60, Math.floor((sessionExpiresAt - Date.now()) / 1000))
    return json(
      { access_token: credential.accessToken },
      200,
      credentialCookie(sealedNow, remainingNow),
    )
  }

  if (typeof credential.refreshToken !== 'string' || credential.refreshToken === '') {
    return json({ error: 'session_expired' }, 401, clearCredentialCookie())
  }

  const refreshed = await refreshAccessToken(credential.refreshToken, env.GOOGLE_CLIENT_SECRET)
  if (!refreshed) return json({ error: 'refresh_failed' }, 401, clearCredentialCookie())

  const expiresIn = typeof refreshed.expires_in === 'number' ? refreshed.expires_in : 3600
  const next = {
    accessToken: refreshed.access_token,
    expiresAt: Date.now() + Math.max(60, expiresIn - 60) * 1000,
    refreshToken: credential.refreshToken,
    sessionExpiresAt,
  }
  const nextSealed = await seal(next, env.GOOGLE_CLIENT_SECRET)
  // Das Cookie lebt nur noch die **Rest**laufzeit — kein rollierendes Fenster.
  const remaining = Math.max(60, Math.floor((sessionExpiresAt - Date.now()) / 1000))
  return json({ access_token: next.accessToken }, 200, credentialCookie(nextSealed, remaining))
}

async function handleLogout(request, env) {
  if (!sameOriginRequest(request)) return json({ error: 'forbidden' }, 403)
  if (env.GOOGLE_CLIENT_SECRET) {
    const sealed = cookiesOf(request).get(CREDENTIAL_COOKIE)
    if (sealed) {
      const credential = await unseal(sealed, env.GOOGLE_CLIENT_SECRET)
      const token = credential?.refreshToken ?? credential?.accessToken
      if (typeof token === 'string' && token !== '') {
        await fetch(REVOKE_ENDPOINT, {
          method: 'POST',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ token }),
        }).catch(() => undefined)
      }
    }
  }
  return json({ ok: true }, 200, clearCredentialCookie())
}

function pushConfigured(env) {
  return Boolean(env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY && env.VAPID_SUBJECT)
}

function allowedPushHost(hostname) {
  return (
    PUSH_ENDPOINT_HOSTS.includes(hostname) ||
    PUSH_ENDPOINT_SUFFIXES.some((suffix) => hostname.endsWith(suffix))
  )
}

function validEndpoint(value) {
  if (typeof value !== 'string' || value.length < 12 || value.length > 4096) return false
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && allowedPushHost(url.hostname)
  } catch {
    return false
  }
}

function validReminder(value) {
  if (!value || (value.id !== 'daily' && value.id !== 'benchmark')) return false
  if (!Number.isFinite(value.at) || value.at <= 0) return false
  if (value.at > Date.now() + SCHEDULE_HORIZON_MS) return false
  if (typeof value.title !== 'string' || value.title.length < 1 || value.title.length > 100) return false
  if (typeof value.body !== 'string' || value.body.length > 300) return false
  if (value.recurrence === undefined) return value.id !== 'daily'
  if (value.id !== 'daily') return false
  if (!/^([01]\d|2[0-3]):[0-5]\d$/u.test(value.recurrence.localTime ?? '')) return false
  if (typeof value.recurrence.timeZone !== 'string' || value.recurrence.timeZone.length > 100) return false
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value.recurrence.timeZone }).format(0)
    return true
  } catch {
    return false
  }
}

/**
 * Reduziert eine Erinnerung auf genau die Felder, die PRIVACY §7 nennt
 * (R3-07, Runde 3).
 *
 * `validReminder` prüft die bekannten Felder — es warf bisher aber nichts
 * weg: Was ein Aufrufer sonst noch mitschickte, landete unverändert im
 * Durable Object. Damit war „speichert serverseitig nur …" eine Zusage, die
 * von der Höflichkeit des Aufrufers abhing. Gefunden von einem
 * Verhaltenstest, der den Satz aus der Datenschutzerklärung nachstellt.
 */
function normalizeReminder(reminder) {
  const normalized = {
    id: reminder.id,
    at: reminder.at,
    title: reminder.title,
    body: reminder.body,
  }
  if (reminder.recurrence !== undefined) {
    normalized.recurrence = {
      localTime: reminder.recurrence.localTime,
      timeZone: reminder.recurrence.timeZone,
    }
  }
  return normalized
}

async function pushStub(env, endpoint) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(endpoint))
  const id = env.PUSH_REMINDERS.idFromName(base64Url(new Uint8Array(digest)))
  return env.PUSH_REMINDERS.get(id)
}

async function readJson(request) {
  try {
    return await request.json()
  } catch {
    return undefined
  }
}

async function relayPush(request, env, action) {
  if (!sameOriginRequest(request)) return json({ error: 'forbidden' }, 403)
  const body = await readJson(request)
  if (!validEndpoint(body?.endpoint)) return json({ error: 'invalid_endpoint' }, 400)
  if (action === 'schedule' && !validReminder(body?.reminder)) {
    return json({ error: 'invalid_reminder' }, 400)
  }
  if (action === 'schedule' && !pushConfigured(env)) return json({ error: 'push_not_configured' }, 503)
  if (action === 'cancel' && body?.id !== 'daily' && body?.id !== 'benchmark') {
    return json({ error: 'invalid_reminder_id' }, 400)
  }

  const stub = await pushStub(env, body.endpoint)
  return stub.fetch(`https://push.internal/${action}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function vapidCoordinates(publicKey) {
  const bytes = fromBase64Url(publicKey)
  if (bytes.length !== 65 || bytes[0] !== 4) throw new Error('invalid_vapid_public_key')
  return { x: base64Url(bytes.slice(1, 33)), y: base64Url(bytes.slice(33, 65)) }
}

async function vapidToken(endpoint, env) {
  const { x, y } = vapidCoordinates(env.VAPID_PUBLIC_KEY)
  const key = await crypto.subtle.importKey(
    'jwk',
    {
      kty: 'EC',
      crv: 'P-256',
      x,
      y,
      d: env.VAPID_PRIVATE_KEY,
      ext: true,
    },
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign'],
  )
  const header = base64Url(encoder.encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })))
  const payload = base64Url(
    encoder.encode(
      JSON.stringify({
        aud: new URL(endpoint).origin,
        exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60,
        sub: env.VAPID_SUBJECT,
      }),
    ),
  )
  const signingInput = `${header}.${payload}`
  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    key,
    encoder.encode(signingInput),
  )
  return `${signingInput}.${base64Url(new Uint8Array(signature))}`
}

async function sendEmptyPush(endpoint, env) {
  const token = await vapidToken(endpoint, env)
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      authorization: `vapid t=${token}, k=${env.VAPID_PUBLIC_KEY}`,
      ttl: '3600',
      urgency: 'normal',
    },
  })
}

function zonedParts(at, timeZone) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(at))
  const value = (type) => Number(parts.find((part) => part.type === type)?.value)
  return { year: value('year'), month: value('month'), day: value('day'), hour: value('hour'), minute: value('minute') }
}

function sameLocalMinute(parts, wanted) {
  return parts.year === wanted.year && parts.month === wanted.month && parts.day === wanted.day && parts.hour === wanted.hour && parts.minute === wanted.minute
}

function localToInstant(wanted, timeZone) {
  const desired = Date.UTC(wanted.year, wanted.month - 1, wanted.day, wanted.hour, wanted.minute)
  let guess = desired
  for (let attempt = 0; attempt < 5; attempt++) {
    const seen = zonedParts(guess, timeZone)
    const observed = Date.UTC(seen.year, seen.month - 1, seen.day, seen.hour, seen.minute)
    const delta = desired - observed
    if (Math.abs(delta) < 60_000) break
    guess += delta
  }
  return sameLocalMinute(zonedParts(guess, timeZone), wanted) ? guess : undefined
}

/**
 * Sommerzeit-Lücke (F-11, Runde 2): Springt die Uhr über die gewünschte
 * Minute hinweg (z. B. 02:30 am Umstellungssonntag), gibt es diese lokale
 * Zeit an dem Tag nicht. Die Erinnerung fällt dann **nicht** aus, sondern
 * kommt zur ersten existierenden Minute nach der Lücke — Lücken sind bis
 * zu einer Stunde groß (selten 30 Minuten), drei Stunden Suchraum reichen.
 */
function firstInstantAfterGap(wanted, timeZone) {
  const base = Date.UTC(wanted.year, wanted.month - 1, wanted.day, wanted.hour, wanted.minute)
  // Minutenweise (R3-05): In Fünf-Minuten-Schritten lieferte etwa 02:31 nicht
  // die erste existierende Minute nach der Lücke, sondern erst 03:00.
  for (let addMinutes = 1; addMinutes <= 180; addMinutes += 1) {
    const shifted = new Date(base + addMinutes * 60_000)
    const candidate = localToInstant(
      {
        year: shifted.getUTCFullYear(),
        month: shifted.getUTCMonth() + 1,
        day: shifted.getUTCDate(),
        hour: shifted.getUTCHours(),
        minute: shifted.getUTCMinutes(),
      },
      timeZone,
    )
    if (candidate !== undefined) return candidate
  }
  return undefined
}

function nextLocalOccurrence(localTime, timeZone, after) {
  const [hour, minute] = localTime.split(':').map(Number)
  const here = zonedParts(after, timeZone)
  const base = Date.UTC(here.year, here.month - 1, here.day)
  for (let add = 0; add < 4; add++) {
    const date = new Date(base + add * 86_400_000)
    const wanted = {
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      day: date.getUTCDate(),
      hour,
      minute,
    }
    const candidate = localToInstant(wanted, timeZone) ?? firstInstantAfterGap(wanted, timeZone)
    if (candidate !== undefined && candidate > after) return candidate
  }
  throw new Error('next_local_occurrence_missing')
}

function emptyPushState(endpoint = '') {
  return { endpoint, reminders: {}, pending: [], attempts: {} }
}

/**
 * Wirft abgelaufene Zustellnotizen weg (F-05, Runde 2). Notizen ohne
 * Ablaufdatum stammen aus einer älteren Fassung und gelten als abgelaufen —
 * lieber eine alte Notiz zu wenig als eine veraltete „Messung wartet“
 * lange nach ihrem Fenster.
 */
function prunePending(value, now) {
  value.pending = value.pending.filter(
    (notice) => typeof notice.expiresAt === 'number' && notice.expiresAt > now,
  )
}

export class PushReminder {
  constructor(state, env) {
    this.state = state
    this.env = env
  }

  async load() {
    return (await this.state.storage.get(PUSH_STATE_KEY)) ?? emptyPushState()
  }

  async save(value) {
    await this.state.storage.put(PUSH_STATE_KEY, value)
  }

  /**
   * Der nächste Alarm zeigt auf den **frühesten** Zeitpunkt, an dem etwas zu
   * tun ist: den nächsten Termin ODER den nächsten Notiz-Ablauf (R3-01).
   *
   * Vorher gewann der Termin, sobald es einen gab (`next?.at ?? …`) — eine
   * Messnotiz mit 60-Minuten-Frist konnte damit neben einer erst am Abend
   * fälligen Tageserinnerung stundenlang liegen bleiben. Die Frist in
   * PRIVACY war dann eine Zusage, die der Code nicht hielt.
   */
  async rearm(value) {
    const times = [
      ...Object.values(value.reminders).map((reminder) => reminder.at),
      ...value.pending.map((notice) => notice.expiresAt),
    ].filter((at) => typeof at === 'number' && Number.isFinite(at))

    if (times.length === 0) {
      // Nichts geplant, nichts wartend: Der Eintrag verschwindet vollständig.
      await this.state.storage.deleteAlarm()
      await this.state.storage.deleteAll()
      return
    }
    await this.state.storage.setAlarm(Math.max(Date.now() + 250, Math.min(...times)))
  }

  /**
   * Ein Pushdienst antwortet nicht (5xx, Netzfehler). Der Termin bleibt
   * erhalten, der nächste Versuch bekommt wachsenden Abstand — und der
   * Aufräumzeitpunkt der wartenden Notiz wird dabei nie überschritten.
   * Nach `PUSH_MAX_ATTEMPTS` wird diese eine Zustellung aufgegeben: Die
   * Tageserinnerung rollt weiter, eine einmalige verschwindet. Aufgeräumt
   * wird in jedem Fall.
   */
  /**
   * Diese eine Zustellung ist erledigt — zugestellt, aufgegeben oder ihr
   * Fenster ist vorbei. Die Tageserinnerung rollt auf ihren nächsten
   * Termin, eine einmalige verschwindet.
   */
  async retireDelivery(value, due, now) {
    const attempts = { ...(value.attempts ?? {}) }
    delete attempts[due.id]
    value.attempts = attempts
    if (due.id === 'daily' && due.recurrence) {
      due.at = nextLocalOccurrence(due.recurrence.localTime, due.recurrence.timeZone, now + 1_000)
      value.reminders.daily = due
    } else {
      delete value.reminders[due.id]
    }
    await this.save(value)
    await this.rearm(value)
  }

  async retryLater(value, due, now) {
    const attempts = { ...(value.attempts ?? {}) }
    const count = (attempts[due.id] ?? 0) + 1

    if (count >= PUSH_MAX_ATTEMPTS) {
      await this.retireDelivery(value, due, now)
      return
    }

    attempts[due.id] = count
    value.attempts = attempts
    await this.save(value)

    const backoff = now + PUSH_RETRY_BASE_MS * 2 ** (count - 1)
    const expiries = value.pending
      .map((notice) => notice.expiresAt)
      .filter((at) => typeof at === 'number' && Number.isFinite(at))
    // Der Aufräumtermin der Notiz ist eine Obergrenze, keine Verhandlungsmasse.
    const at = expiries.length === 0 ? backoff : Math.min(backoff, Math.min(...expiries))
    await this.state.storage.setAlarm(Math.max(now + 1_000, at))
  }

  async fetch(request) {
    if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)
    const url = new URL(request.url)
    const body = await readJson(request)
    if (!validEndpoint(body?.endpoint)) return json({ error: 'invalid_endpoint' }, 400)
    const value = await this.load()
    value.endpoint = body.endpoint

    if (url.pathname === '/schedule') {
      if (!validReminder(body.reminder)) return json({ error: 'invalid_reminder' }, 400)
      // Nur die in PRIVACY §7 genannten Felder werden gespeichert (R3-07).
      value.reminders[body.reminder.id] = normalizeReminder(body.reminder)
      await this.save(value)
      await this.rearm(value)
      return json({ ok: true })
    }

    if (url.pathname === '/cancel') {
      const reminder = value.reminders[body.id]
      if (body.id === 'daily' && body.permanent !== true && reminder?.recurrence) {
        reminder.at = nextLocalOccurrence(
          reminder.recurrence.localTime,
          reminder.recurrence.timeZone,
          Math.max(Date.now(), reminder.at) + 1_000,
        )
        value.reminders.daily = reminder
      } else {
        delete value.reminders[body.id]
      }
      await this.save(value)
      await this.rearm(value)
      return json({ ok: true })
    }

    if (url.pathname === '/pending') {
      // Veraltetes wird gelöscht statt zugestellt (F-05, Runde 2).
      prunePending(value, Date.now())
      const pending = value.pending.shift()
      await this.save(value)
      // rearm räumt einen leeren Zustand vollständig weg (R3-01).
      await this.rearm(value)
      return pending === undefined ? json({ error: 'nothing_pending' }, 404) : json(pending)
    }

    if (url.pathname === '/unsubscribe') {
      await this.state.storage.deleteAlarm()
      await this.state.storage.deleteAll()
      return json({ ok: true })
    }

    return json({ error: 'not_found' }, 404)
  }

  async alarm() {
    const value = await this.load()
    if (!validEndpoint(value.endpoint)) {
      await this.state.storage.deleteAll()
      return
    }

    const now = Date.now()
    prunePending(value, now)
    const due = Object.values(value.reminders)
      .filter((reminder) => reminder.at <= now + 1_000)
      .sort((a, b) => a.at - b.at)[0]
    if (due === undefined) {
      // Abgelaufene Notizen sind oben schon weg; rearm löscht einen leeren
      // Eintrag vollständig und setzt sonst den nächsten Zeitpunkt (R3-01).
      await this.save(value)
      await this.rearm(value)
      return
    }

    /*
     * R4-02 (Runde 4): Die Frist hängt an der **ursprünglichen Fälligkeit**,
     * nicht am Zeitpunkt dieses Alarms.
     *
     * Vorher wurde `now + TTL` gerechnet. Lief ein Wiederholungsalarm stark
     * verspätet, war die alte Notiz oben schon weggeräumt — und dieselbe
     * Zustellung entstand mit einer **frischen** Stunde neu. Aus der
     * zugesagten Höchstfrist wurde damit eine Frist je Versuch. Da
     * `deliveryId` ohnehin aus `due.at` gebildet wird, ist derselbe Anker
     * schon da; er bleibt über alle Wiederholungen hinweg gleich.
     */
    const deliveryId = `${due.id}:${due.at}`
    const expiresAt = due.at + (PENDING_TTL_MS[due.id] ?? 3_600_000)

    if (expiresAt <= now) {
      /*
       * Das Fenster dieser Zustellung ist vorbei. Verspätet zuzustellen wäre
       * genau das, was PRIVACY §7 ausschließt — also wird nicht gepusht,
       * keine Notiz neu angelegt und die Zustellung zurückgezogen.
       */
      await this.retireDelivery(value, due, now)
      return
    }

    if (!value.pending.some((notice) => notice.deliveryId === deliveryId)) {
      value.pending.push({
        deliveryId,
        title: due.title,
        body: due.body,
        tag: `anitew-${due.id}`,
        expiresAt,
      })
      // Eine harte Obergrenze gegen unbegrenztes Wachstum: Älteste zuerst raus.
      while (value.pending.length > PENDING_MAX) value.pending.shift()
      await this.save(value)
    }

    /*
     * Ein Netzfehler ist derselbe Fall wie eine 5xx-Antwort: Der Termin
     * bleibt, der nächste Versuch bekommt Abstand (R3-01).
     */
    let response
    try {
      response = await sendEmptyPush(value.endpoint, this.env)
    } catch {
      response = undefined
    }

    if (response !== undefined && (response.status === 404 || response.status === 410)) {
      await this.state.storage.deleteAlarm()
      await this.state.storage.deleteAll()
      return
    }
    if (response === undefined || !response.ok) {
      await this.retryLater(value, due, now)
      return
    }

    // Zugestellt: Zähler zurück auf null, Zustellung zurückziehen.
    await this.retireDelivery(value, due, now)
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname === '/oauth/google/callback' && request.method === 'GET') {
      return handleCallback(request, env)
    }
    if (url.pathname === '/oauth/google/access-token') return handleAccessToken(request, env)
    if (url.pathname === '/oauth/google/logout') return handleLogout(request, env)

    if (url.pathname === '/push/vapid-public' && request.method === 'GET') {
      return pushConfigured(env)
        ? json({ publicKey: env.VAPID_PUBLIC_KEY })
        : json({ error: 'push_not_configured' }, 503)
    }
    if (url.pathname === '/push/schedule') return relayPush(request, env, 'schedule')
    if (url.pathname === '/push/cancel') return relayPush(request, env, 'cancel')
    if (url.pathname === '/push/pending') return relayPush(request, env, 'pending')
    if (url.pathname === '/push/unsubscribe') return relayPush(request, env, 'unsubscribe')

    return env.ASSETS.fetch(request)
  },
}
