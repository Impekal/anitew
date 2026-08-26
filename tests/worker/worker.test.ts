import { afterEach, describe, expect, it, vi } from 'vitest'

// @ts-expect-error — der Worker ist bewusst schlichtes JavaScript ohne Typen.
import workerModule, { PushReminder } from '../../worker/index.js'

/**
 * Der Cloudflare-Worker ist die sicherheitskritischste Datei des Projekts:
 * Er hält das Google-Client-Secret, versiegelt die OAuth-Sitzung und plant
 * echte Web-Pushes. Diese Tests rufen den exportierten fetch-Handler und das
 * Durable Object direkt auf — mit gestubbtem `env` und gestubbtem globalem
 * `fetch`. Kein Test spricht mit Google oder einem Pushdienst.
 */

const SECRET = 'test-google-client-secret'

function toBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/u, '')
}

/*
  Ein ECHTES P-256-Schlüsselpaar: Node validiert JWK-EC-Koordinaten, ein
  fabrizierter Punkt fällt beim Import durch. Der Worker bekommt genau die
  Form, die `configure-push.mjs` produziert: Public als unkomprimierter
  Punkt (65 Bytes, base64url), Private als JWK-`d`.
*/
const vapidKeys = await (async () => {
  const pair = await crypto.subtle.generateKey(
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['sign', 'verify'],
  )
  const raw = new Uint8Array(await crypto.subtle.exportKey('raw', pair.publicKey))
  const jwk = (await crypto.subtle.exportKey('jwk', pair.privateKey)) as { d?: string }
  return { publicKey: toBase64Url(raw), privateKey: jwk.d as string }
})()
const VAPID_PUBLIC = vapidKeys.publicKey

interface StubEnv {
  GOOGLE_CLIENT_SECRET?: string
  VAPID_PUBLIC_KEY?: string
  VAPID_PRIVATE_KEY?: string
  VAPID_SUBJECT?: string
  ASSETS: { fetch: (request: Request) => Promise<Response> }
  PUSH_REMINDERS: {
    idFromName: (name: string) => string
    get: (id: string) => { fetch: (url: string, init?: RequestInit) => Promise<Response> }
  }
}

function stubEnv(overrides: Partial<StubEnv> = {}): StubEnv {
  return {
    GOOGLE_CLIENT_SECRET: SECRET,
    ASSETS: { fetch: async () => new Response('asset', { status: 200 }) },
    PUSH_REMINDERS: {
      idFromName: (name: string) => name,
      get: () => ({ fetch: async () => Response.json({ ok: true }) }),
    },
    ...overrides,
  }
}

const ORIGIN = 'https://anitew.impekaltech.workers.dev'

function post(path: string, body: unknown, headers: Record<string, string> = {}): Request {
  return new Request(`${ORIGIN}${path}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-anitew-request': '1',
      origin: ORIGIN,
      ...headers,
    },
    body: JSON.stringify(body),
  })
}

const realFetch = globalThis.fetch

afterEach(() => {
  globalThis.fetch = realFetch
  vi.restoreAllMocks()
})

describe('der OAuth-Callback', () => {
  it('weist einen fremden state ab, bevor irgendein Code getauscht wird', async () => {
    const outbound = vi.fn()
    globalThis.fetch = outbound as typeof fetch
    const request = new Request(
      `${ORIGIN}/oauth/google/callback?state=angreifer&code=egal`,
      { headers: { cookie: 'anitew_google_oauth_state=echt' } },
    )
    const response: Response = await workerModule.fetch(request, stubEnv())
    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toContain('googleOAuth=error')
    expect(response.headers.get('location')).toContain('state_mismatch')
    // Kein Netzaufruf: Der Code eines Angreifers wird nie eingetauscht.
    expect(outbound).not.toHaveBeenCalled()
  })

  it('tauscht bei gültigem state den Code und versiegelt die Sitzung als HttpOnly-Cookie', async () => {
    globalThis.fetch = (async () =>
      Response.json({
        access_token: 'zugriff',
        refresh_token: 'erneuerung',
        expires_in: 3600,
      })) as typeof fetch

    const request = new Request(`${ORIGIN}/oauth/google/callback?state=s1&code=c1`, {
      headers: { cookie: 'anitew_google_oauth_state=s1' },
    })
    const response: Response = await workerModule.fetch(request, stubEnv())
    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toContain('googleOAuth=complete')

    const cookies = response.headers.getSetCookie()
    const credential = cookies.find((cookie) => cookie.startsWith('anitew_google_oauth='))
    expect(credential).toBeDefined()
    expect(credential).toContain('HttpOnly')
    expect(credential).toContain('Secure')
    expect(credential).toContain('SameSite=Lax')
    expect(credential).toContain(`Max-Age=${60 * 60 * 24 * 180}`)
    // Die Tokens stehen niemals im Klartext im Cookie oder in der Antwort.
    expect(credential).not.toContain('zugriff')
    expect(credential).not.toContain('erneuerung')
  })

  it('reicht Googles Fehlercode weiter, ohne selbst Details zu erfinden', async () => {
    const request = new Request(
      `${ORIGIN}/oauth/google/callback?state=s1&error=access_denied`,
      { headers: { cookie: 'anitew_google_oauth_state=s1' } },
    )
    const response: Response = await workerModule.fetch(request, stubEnv())
    expect(response.headers.get('location')).toContain('detail=access_denied')
  })

  it('meldet fehlende Serverkonfiguration ehrlich', async () => {
    const request = new Request(`${ORIGIN}/oauth/google/callback?state=s1&code=c1`, {
      headers: { cookie: 'anitew_google_oauth_state=s1' },
    })
    const response: Response = await workerModule.fetch(
      request,
      stubEnv({ GOOGLE_CLIENT_SECRET: undefined }),
    )
    expect(response.headers.get('location')).toContain('oauth_server_not_configured')
  })
})

describe('der Access-Token-Endpunkt', () => {
  async function signIn(env: StubEnv): Promise<string> {
    globalThis.fetch = (async () =>
      Response.json({
        access_token: 'zugriff',
        refresh_token: 'erneuerung',
        expires_in: 3600,
      })) as typeof fetch
    const request = new Request(`${ORIGIN}/oauth/google/callback?state=s1&code=c1`, {
      headers: { cookie: 'anitew_google_oauth_state=s1' },
    })
    const response: Response = await workerModule.fetch(request, env)
    const cookie = response.headers
      .getSetCookie()
      .find((entry) => entry.startsWith('anitew_google_oauth='))
    expect(cookie).toBeDefined()
    return (cookie as string).split(';')[0] as string
  }

  it('verweigert ohne den eigenen Anfrage-Header und bei fremdem Origin', async () => {
    const env = stubEnv()
    const noHeader = await workerModule.fetch(
      new Request(`${ORIGIN}/oauth/google/access-token`, { method: 'POST' }),
      env,
    )
    expect(noHeader.status).toBe(403)

    const foreign = await workerModule.fetch(
      post('/oauth/google/access-token', {}, { origin: 'https://angreifer.example' }),
      env,
    )
    expect(foreign.status).toBe(403)
  })

  it('gibt ohne Sitzung 401 — und mit frischer Sitzung das Access-Token zurück', async () => {
    const env = stubEnv()
    const anonymous = await workerModule.fetch(post('/oauth/google/access-token', {}), env)
    expect(anonymous.status).toBe(401)

    const cookie = await signIn(env)
    const request = new Request(`${ORIGIN}/oauth/google/access-token`, {
      method: 'POST',
      headers: { 'x-anitew-request': '1', origin: ORIGIN, cookie },
    })
    const response: Response = await workerModule.fetch(request, env)
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ access_token: 'zugriff' })
  })

  it('verlängert die Sitzung beim Refresh nicht — nach 180 Tagen ab Anmeldung ist Schluss (F-04)', async () => {
    vi.useFakeTimers()
    try {
      const signedInAt = Date.UTC(2026, 0, 1, 12, 0)
      vi.setSystemTime(signedInAt)
      const env = stubEnv()
      const cookie = await signIn(env)

      // 100 Tage später: Access-Token längst abgelaufen, Google-Refresh klappt.
      vi.setSystemTime(signedInAt + 100 * 86_400_000)
      globalThis.fetch = (async () =>
        Response.json({ access_token: 'frisch', expires_in: 3600 })) as typeof fetch
      const refreshed: Response = await workerModule.fetch(
        new Request(`${ORIGIN}/oauth/google/access-token`, {
          method: 'POST',
          headers: { 'x-anitew-request': '1', origin: ORIGIN, cookie },
        }),
        env,
      )
      expect(refreshed.status).toBe(200)
      const renewed = refreshed.headers
        .getSetCookie()
        .find((entry) => entry.startsWith('anitew_google_oauth=')) as string
      // Das Cookie trägt nur noch die RESTlaufzeit (~80 Tage), kein neues
      // 180-Tage-Fenster — sonst wäre PRIVACYs „spätestens 180 Tage“ falsch.
      const maxAge = Number(/Max-Age=(\d+)/u.exec(renewed)?.[1])
      expect(maxAge).toBeLessThanOrEqual(80 * 86_400)
      expect(maxAge).toBeGreaterThan(79 * 86_400)

      // 181 Tage nach der Anmeldung: Sitzung vorbei, Cookie wird gelöscht.
      vi.setSystemTime(signedInAt + 181 * 86_400_000)
      const expired: Response = await workerModule.fetch(
        new Request(`${ORIGIN}/oauth/google/access-token`, {
          method: 'POST',
          headers: { 'x-anitew-request': '1', origin: ORIGIN, cookie: renewed.split(';')[0] as string },
        }),
        env,
      )
      expect(expired.status).toBe(401)
      expect(((await expired.json()) as { error: string }).error).toBe('session_expired')
      expect(expired.headers.getSetCookie()[0]).toContain('Max-Age=0')
    } finally {
      vi.useRealTimers()
    }
  })

  it('löscht eine unlesbare Sitzung, statt sie endlos zurückzugeben', async () => {
    const env = stubEnv()
    const request = new Request(`${ORIGIN}/oauth/google/access-token`, {
      method: 'POST',
      headers: {
        'x-anitew-request': '1',
        origin: ORIGIN,
        cookie: 'anitew_google_oauth=kaputt',
      },
    })
    const response: Response = await workerModule.fetch(request, env)
    expect(response.status).toBe(401)
    const cleared = response.headers.getSetCookie()[0]
    expect(cleared).toContain('anitew_google_oauth=;')
    expect(cleared).toContain('Max-Age=0')
  })
})

describe('der Logout', () => {
  it('widerruft best effort bei Google und löscht das Cookie immer', async () => {
    const env = stubEnv()
    globalThis.fetch = (async () =>
      Response.json({
        access_token: 'zugriff',
        refresh_token: 'erneuerung',
        expires_in: 3600,
      })) as typeof fetch
    const callback: Response = await workerModule.fetch(
      new Request(`${ORIGIN}/oauth/google/callback?state=s1&code=c1`, {
        headers: { cookie: 'anitew_google_oauth_state=s1' },
      }),
      env,
    )
    const cookie = (callback.headers
      .getSetCookie()
      .find((entry) => entry.startsWith('anitew_google_oauth=')) as string).split(';')[0] as string

    const revoked: string[] = []
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      revoked.push(String(input))
      expect(String(init?.body)).toContain('erneuerung')
      return new Response('', { status: 200 })
    }) as typeof fetch

    const response = await workerModule.fetch(
      new Request(`${ORIGIN}/oauth/google/logout`, {
        method: 'POST',
        headers: { 'x-anitew-request': '1', origin: ORIGIN, cookie },
      }),
      env,
    )
    expect(response.status).toBe(200)
    expect(revoked[0]).toContain('revoke')
    const cleared = response.headers.getSetCookie()[0]
    expect(cleared).toContain('Max-Age=0')
  })
})

describe('die Push-Endpunkte', () => {
  const pushEnv = () =>
    stubEnv({
      VAPID_PUBLIC_KEY: VAPID_PUBLIC,
      VAPID_PRIVATE_KEY: vapidKeys.privateKey,
      VAPID_SUBJECT: 'mailto:push@example.com',
    })

  it('nennt den öffentlichen Schlüssel nur bei vollständiger Konfiguration', async () => {
    const ready = await workerModule.fetch(
      new Request(`${ORIGIN}/push/vapid-public`),
      pushEnv(),
    )
    expect(ready.status).toBe(200)
    expect(await ready.json()).toEqual({ publicKey: VAPID_PUBLIC })

    const missing = await workerModule.fetch(
      new Request(`${ORIGIN}/push/vapid-public`),
      stubEnv({ VAPID_PUBLIC_KEY: VAPID_PUBLIC }),
    )
    expect(missing.status).toBe(503)
    expect(await missing.json()).toEqual({ error: 'push_not_configured' })
  })

  it('wehrt kaputte Endpunkte und fremde Erinnerungsformen an der Kante ab', async () => {
    const env = pushEnv()
    const badEndpoint = await workerModule.fetch(
      post('/push/schedule', { endpoint: 'http://unsicher.example/x', reminder: {} }),
      env,
    )
    expect(badEndpoint.status).toBe(400)

    const badReminder = await workerModule.fetch(
      post('/push/schedule', {
        endpoint: 'https://fcm.googleapis.com/fcm/send/abc',
        reminder: { id: 'fremd', at: Date.now(), title: 'x', body: 'y' },
      }),
      env,
    )
    expect(badReminder.status).toBe(400)

    const badZone = await workerModule.fetch(
      post('/push/schedule', {
        endpoint: 'https://fcm.googleapis.com/fcm/send/abc',
        reminder: {
          id: 'daily',
          at: Date.now() + 1000,
          title: 'x',
          body: 'y',
          recurrence: { localTime: '19:30', timeZone: 'Mars/Olympus' },
        },
      }),
      env,
    )
    expect(badZone.status).toBe(400)
  })

  it('lehnt beliebige HTTPS-Adressen als Relaisziel ab — auch mit gefälschten Same-Origin-Headern (F-03)', async () => {
    /*
      Der CSRF-Schutz hält nur fremde Browser fern; ein Skript setzt Origin
      und x-anitew-request beliebig. Die Verteidigung ist die Host-Liste der
      echten Pushdienste: Für ein fremdes Ziel darf nicht einmal ein Durable
      Object angesprochen werden.
    */
    const stub = vi.fn(async () => Response.json({ ok: true }))
    const env = stubEnv({
      VAPID_PUBLIC_KEY: VAPID_PUBLIC,
      VAPID_PRIVATE_KEY: vapidKeys.privateKey,
      VAPID_SUBJECT: 'mailto:push@example.com',
      PUSH_REMINDERS: { idFromName: (name: string) => name, get: () => ({ fetch: stub }) },
    })
    const forged = await workerModule.fetch(
      post('/push/schedule', {
        endpoint: 'https://angreifer.example/relay-ziel',
        reminder: {
          id: 'daily',
          at: Date.now() + 1000,
          title: 'x',
          body: 'y',
          recurrence: { localTime: '19:30', timeZone: 'Europe/Berlin' },
        },
      }),
      env,
    )
    expect(forged.status).toBe(400)
    expect(await forged.json()).toEqual({ error: 'invalid_endpoint' })
    expect(stub).not.toHaveBeenCalled()

    // Die echten Pushdienste der Browser gehen weiterhin durch.
    for (const allowed of [
      'https://web.push.apple.com/QOX0abc-geraet',
      'https://updates.push.services.mozilla.com/wpush/v2/geraet',
      'https://sg2p.notify.windows.com/w/geraet',
      'https://fcm.googleapis.com/fcm/send/geraet',
    ]) {
      const response = await workerModule.fetch(
        post('/push/cancel', { endpoint: allowed, id: 'daily' }),
        env,
      )
      expect(response.status).toBe(200)
    }
  })

  it('deckelt den Planungshorizont, statt Termine in ferner Zukunft zu speichern (F-03)', async () => {
    const far = await workerModule.fetch(
      post('/push/schedule', {
        endpoint: 'https://fcm.googleapis.com/fcm/send/abc',
        reminder: { id: 'benchmark', at: Date.now() + 90 * 86_400_000, title: 'x', body: 'y' },
      }),
      pushEnv(),
    )
    expect(far.status).toBe(400)
  })

  it('meldet 503 statt stillem Erfolg, wenn Push nicht konfiguriert ist', async () => {
    const response = await workerModule.fetch(
      post('/push/schedule', {
        endpoint: 'https://fcm.googleapis.com/fcm/send/abc',
        reminder: { id: 'benchmark', at: Date.now() + 1000, title: 'x', body: 'y' },
      }),
      stubEnv(),
    )
    expect(response.status).toBe(503)
    expect(await response.json()).toEqual({ error: 'push_not_configured' })
  })
})

interface StoredState {
  endpoint: string
  reminders: Record<string, { id: string; at: number; title: string; body: string; recurrence?: { localTime: string; timeZone: string } }>
  pending: { deliveryId: string; title: string; body: string; tag: string; expiresAt?: number }[]
}

function durableHarness() {
  const storage = new Map<string, unknown>()
  let alarmAt: number | undefined
  const state = {
    storage: {
      get: async (key: string) => storage.get(key),
      put: async (key: string, value: unknown) => void storage.set(key, value),
      deleteAll: async () => void storage.clear(),
      setAlarm: async (at: number) => void (alarmAt = at),
      deleteAlarm: async () => void (alarmAt = undefined),
    },
  }
  return {
    state,
    stored: () => storage.get('push-state-v1') as StoredState | undefined,
    alarmAt: () => alarmAt,
  }
}

describe('das PushReminder-Durable-Object', () => {
  const ENDPOINT = 'https://fcm.googleapis.com/fcm/send/geraet-1'
  const env = {
    VAPID_PUBLIC_KEY: VAPID_PUBLIC,
    VAPID_PRIVATE_KEY: vapidKeys.privateKey,
    VAPID_SUBJECT: 'mailto:push@example.com',
  }

  function call(target: InstanceType<typeof PushReminder>, path: string, body: unknown) {
    return target.fetch(
      new Request(`https://push.internal${path}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      }),
    )
  }

  it('plant, stellt den Alarm auf den frühesten Termin und räumt beim Unsubscribe alles', async () => {
    const harness = durableHarness()
    const target = new PushReminder(harness.state, env)

    const later = Date.now() + 60 * 60 * 1000
    const sooner = Date.now() + 10 * 60 * 1000
    await call(target, '/schedule', {
      endpoint: ENDPOINT,
      reminder: { id: 'daily', at: later, title: 'T', body: 'B', recurrence: { localTime: '19:30', timeZone: 'Europe/Berlin' } },
    })
    await call(target, '/schedule', {
      endpoint: ENDPOINT,
      reminder: { id: 'benchmark', at: sooner, title: 'M', body: 'B' },
    })
    expect(harness.alarmAt()).toBe(sooner)

    const response = await call(target, '/unsubscribe', { endpoint: ENDPOINT })
    expect(response.status).toBe(200)
    expect(harness.stored()).toBeUndefined()
    expect(harness.alarmAt()).toBeUndefined()
  })

  it('rollt die Tageserinnerung beim „heute nicht“-Cancel auf den nächsten Tag statt sie zu löschen', async () => {
    const harness = durableHarness()
    const target = new PushReminder(harness.state, env)
    const at = Date.now() + 5 * 60 * 1000
    await call(target, '/schedule', {
      endpoint: ENDPOINT,
      reminder: { id: 'daily', at, title: 'T', body: 'B', recurrence: { localTime: '19:30', timeZone: 'Europe/Berlin' } },
    })

    await call(target, '/cancel', { endpoint: ENDPOINT, id: 'daily' })
    const rolled = harness.stored()?.reminders['daily']
    expect(rolled).toBeDefined()
    expect((rolled as { at: number }).at).toBeGreaterThan(at)

    // Ausdrücklich dauerhaft: weg ist weg.
    await call(target, '/cancel', { endpoint: ENDPOINT, id: 'daily', permanent: true })
    expect(harness.stored()?.reminders['daily']).toBeUndefined()
    expect(harness.alarmAt()).toBeUndefined()
  })

  it('legt beim Alarm die fällige Notiz bereit, sendet einen leeren Push und plant die Wiederkehr', async () => {
    const harness = durableHarness()
    const target = new PushReminder(harness.state, env)
    const at = Date.now() - 1000
    await call(target, '/schedule', {
      endpoint: ENDPOINT,
      reminder: { id: 'daily', at, title: 'Zeit zu trainieren', body: 'Fünf Minuten.', recurrence: { localTime: '19:30', timeZone: 'Europe/Berlin' } },
    })

    const pushes: { url: string; hasBody: boolean; auth: string }[] = []
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      pushes.push({
        url: String(input),
        hasBody: init?.body !== undefined && init?.body !== null,
        auth: String((init?.headers as Record<string, string>)?.['authorization'] ?? ''),
      })
      return new Response('', { status: 201 })
    }) as typeof fetch

    await target.alarm()

    expect(pushes).toHaveLength(1)
    expect(pushes[0]?.url).toBe(ENDPOINT)
    // Der Push trägt bewusst keinen Inhalt — kein Erinnerungstext verlässt
    // ANITEW über den Pushdienst; der Text liegt nur im Durable Object.
    expect(pushes[0]?.hasBody).toBe(false)
    expect(pushes[0]?.auth).toMatch(/^vapid t=.+, k=.+$/u)

    const stored = harness.stored() as StoredState
    expect(stored.pending).toHaveLength(1)
    expect(stored.pending[0]?.title).toBe('Zeit zu trainieren')
    // Die Tageserinnerung ist auf die nächste lokale 19:30 weitergerollt.
    expect(stored.reminders['daily']?.at).toBeGreaterThan(Date.now())
    expect(harness.alarmAt()).toBe(stored.reminders['daily']?.at)

    // Der Service Worker holt die Notiz genau einmal ab.
    const pending = await call(target, '/pending', { endpoint: ENDPOINT })
    expect(pending.status).toBe(200)
    const notice = (await pending.json()) as { title: string }
    expect(notice.title).toBe('Zeit zu trainieren')
    const empty = await call(target, '/pending', { endpoint: ENDPOINT })
    expect(empty.status).toBe(404)
  })

  it('räumt sich selbst auf, wenn der Pushdienst die Adresse für tot erklärt (410)', async () => {
    const harness = durableHarness()
    const target = new PushReminder(harness.state, env)
    await call(target, '/schedule', {
      endpoint: ENDPOINT,
      reminder: { id: 'benchmark', at: Date.now() - 1000, title: 'M', body: 'B' },
    })

    globalThis.fetch = (async () => new Response('', { status: 410 })) as typeof fetch
    await target.alarm()

    expect(harness.stored()).toBeUndefined()
    expect(harness.alarmAt()).toBeUndefined()
  })

  it('wirft bei einem Pushdienst-Fehler, damit die Alarm-Wiederholung greift — ohne den Termin zu verlieren', async () => {
    const harness = durableHarness()
    const target = new PushReminder(harness.state, env)
    const at = Date.now() - 1000
    await call(target, '/schedule', {
      endpoint: ENDPOINT,
      reminder: { id: 'benchmark', at, title: 'M', body: 'B' },
    })

    globalThis.fetch = (async () => new Response('', { status: 500 })) as typeof fetch
    await expect(target.alarm()).rejects.toThrow('push_http_500')
    expect(harness.stored()?.reminders['benchmark']?.at).toBe(at)
  })

  it('rechnet die nächste lokale Uhrzeit über eine Sommerzeit-Umstellung hinweg richtig', async () => {
    // Der Cancel-Roll rechnet bewusst ab max(jetzt, Termin) — für einen
    // deterministischen Sommerzeit-Fall wird die Systemzeit eingefroren.
    vi.useFakeTimers()
    try {
      // Europa/Berlin: 2026-03-29 ist der Umstellungstag (02:00 → 03:00).
      // Geplant am 28.03. um 19:30 Ortszeit; das Weiterrollen (Cancel ohne
      // permanent) muss auf den 29.03. 19:30 **Ortszeit** landen — das sind
      // wegen der verlorenen Stunde 23 Echtzeit-Stunden später.
      const before = Date.UTC(2026, 2, 28, 18, 30) // 19:30 MEZ (+01:00)
      vi.setSystemTime(before - 60_000)
      const harness = durableHarness()
      const target = new PushReminder(harness.state, env)
      await call(target, '/schedule', {
        endpoint: ENDPOINT,
        reminder: {
          id: 'daily',
          at: before,
          title: 'T',
          body: 'B',
          recurrence: { localTime: '19:30', timeZone: 'Europe/Berlin' },
        },
      })
      await call(target, '/cancel', { endpoint: ENDPOINT, id: 'daily' })
      const rolled = harness.stored()?.reminders['daily'] as { at: number }
      expect(rolled.at).toBe(Date.UTC(2026, 2, 29, 17, 30)) // 19:30 MESZ (+02:00)
    } finally {
      vi.useRealTimers()
    }
  })

  it('fällt in der Sommerzeit-Lücke nicht aus: 02:30 wird zur ersten Zeit nach dem Sprung (F-11)', async () => {
    vi.useFakeTimers()
    try {
      // Europa/Berlin, 29.03.2026: 02:00 → 03:00 — eine 02:30 gibt es nicht.
      const before = Date.UTC(2026, 2, 28, 1, 30) // 28.03. 02:30 MEZ (+01:00)
      vi.setSystemTime(before - 60_000)
      const harness = durableHarness()
      const target = new PushReminder(harness.state, env)
      await call(target, '/schedule', {
        endpoint: ENDPOINT,
        reminder: {
          id: 'daily',
          at: before,
          title: 'T',
          body: 'B',
          recurrence: { localTime: '02:30', timeZone: 'Europe/Berlin' },
        },
      })
      await call(target, '/cancel', { endpoint: ENDPOINT, id: 'daily' })
      const rolled = harness.stored()?.reminders['daily'] as { at: number }
      // Erste existierende Zeit nach der Lücke: 03:00 MESZ — NICHT erst der 30.03.
      expect(rolled.at).toBe(Date.UTC(2026, 2, 29, 1, 0))
    } finally {
      vi.useRealTimers()
    }
  })

  it('stellt am Herbst-Doppel genau einen Termin, keine zwei (F-11)', async () => {
    vi.useFakeTimers()
    try {
      // Europa/Berlin, 25.10.2026: 03:00 → 02:00 — 02:30 existiert zweimal.
      const before = Date.UTC(2026, 9, 24, 0, 30) // 24.10. 02:30 MESZ (+02:00)
      vi.setSystemTime(before - 60_000)
      const harness = durableHarness()
      const target = new PushReminder(harness.state, env)
      await call(target, '/schedule', {
        endpoint: ENDPOINT,
        reminder: {
          id: 'daily',
          at: before,
          title: 'T',
          body: 'B',
          recurrence: { localTime: '02:30', timeZone: 'Europe/Berlin' },
        },
      })
      await call(target, '/cancel', { endpoint: ENDPOINT, id: 'daily' })
      const rolled = harness.stored()?.reminders['daily'] as { at: number }
      // Einer der beiden 02:30-Momente — deterministisch genau einer.
      expect([Date.UTC(2026, 9, 25, 0, 30), Date.UTC(2026, 9, 25, 1, 30)]).toContain(rolled.at)
      expect(harness.alarmAt()).toBe(rolled.at)
    } finally {
      vi.useRealTimers()
    }
  })

  it('liefert eine abgelaufene Zustellnotiz nicht mehr aus und räumt den Eintrag ganz weg (F-05)', async () => {
    vi.useFakeTimers()
    try {
      vi.setSystemTime(Date.UTC(2026, 7, 26, 12, 0))
      const harness = durableHarness()
      const target = new PushReminder(harness.state, env)
      await call(target, '/schedule', {
        endpoint: ENDPOINT,
        reminder: { id: 'benchmark', at: Date.now() - 1000, title: 'Messung wartet', body: 'B' },
      })

      globalThis.fetch = (async () => new Response('', { status: 201 })) as typeof fetch
      await target.alarm()

      // Die Notiz liegt mit Ablaufdatum bereit; der Aufräum-Alarm steht darauf —
      // vorher verschwand der Alarm mit der letzten Einmal-Erinnerung, und die
      // Notiz hätte für immer im Speicher gelegen.
      const stored = harness.stored() as StoredState
      expect(stored.pending).toHaveLength(1)
      expect(stored.pending[0]?.expiresAt).toBe(Date.now() + 60 * 60_000)
      expect(harness.alarmAt()).toBe(stored.pending[0]?.expiresAt)

      // 61 Minuten später ist das Messfenster lange vorbei: nichts mehr
      // zustellen, alles löschen — genau das, was PRIVACY jetzt verspricht.
      vi.setSystemTime(Date.now() + 61 * 60_000)
      const pending = await call(target, '/pending', { endpoint: ENDPOINT })
      expect(pending.status).toBe(404)
      expect(harness.stored()).toBeUndefined()
      expect(harness.alarmAt()).toBeUndefined()
    } finally {
      vi.useRealTimers()
    }
  })
})
