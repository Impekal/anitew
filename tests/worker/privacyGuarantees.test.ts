import { afterEach, describe, expect, it, vi } from 'vitest'

// @ts-expect-error — der Worker ist bewusst schlichtes JavaScript ohne Typen.
import workerModule, { PushReminder, seal } from '../../worker/index.js'

/**
 * R3-07 (Runde 3): Jede Zusage aus `docs/PRIVACY.md`, die der Worker halten
 * muss, wird hier **am Verhalten** geprüft — nicht daran, ob im Quelltext
 * eine Konstante mit dem passenden Namen steht.
 *
 * Die Wächter in `tests/core/claims.test.ts` bleiben daneben bestehen: Sie
 * fangen den Fall ab, dass Text und Code auseinanderlaufen. Beweisen, dass
 * die Zusage eingehalten wird, können nur diese Läufe hier.
 *
 * Geprüfte Sätze:
 *  §7  „längstens aber 24 Stunden (bei der Messerinnerung 60 Minuten)"
 *  §7  „Bleibt weder ein Termin noch eine Notiz übrig, wird der gesamte
 *       serverseitige Eintrag gelöscht."
 *  §7  „Nicht gespeichert werden dafür: Trainingsantworten, …"
 *  §9  „Laufzeit ab Anmeldung fest höchstens 180 Tage … nicht verlängert"
 *  §9  Übergangsregel für Alt-Sitzungen: höchstens 30 Tage
 */

const SECRET = 'test-google-client-secret'
const ORIGIN = 'https://anitew.impekaltech.workers.dev'
const ENDPOINT = 'https://fcm.googleapis.com/fcm/send/geraet-1'

function toBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/u, '')
}

const vapidKeys = await (async () => {
  const pair = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, [
    'sign',
    'verify',
  ])
  const raw = new Uint8Array(await crypto.subtle.exportKey('raw', pair.publicKey))
  const jwk = (await crypto.subtle.exportKey('jwk', pair.privateKey)) as { d?: string }
  return { publicKey: toBase64Url(raw), privateKey: jwk.d as string }
})()

const pushEnv = {
  VAPID_PUBLIC_KEY: vapidKeys.publicKey,
  VAPID_PRIVATE_KEY: vapidKeys.privateKey,
  VAPID_SUBJECT: 'mailto:push@example.com',
}

interface Stored {
  endpoint: string
  reminders: Record<string, { id: string; at: number }>
  pending: { deliveryId: string; expiresAt?: number; title: string; body: string }[]
}

function durableHarness() {
  const storage = new Map<string, unknown>()
  let alarmAt: number | undefined
  return {
    state: {
      storage: {
        get: async (key: string) => storage.get(key),
        put: async (key: string, value: unknown) => void storage.set(key, value),
        deleteAll: async () => void storage.clear(),
        setAlarm: async (at: number) => void (alarmAt = at),
        deleteAlarm: async () => void (alarmAt = undefined),
      },
    },
    stored: () => storage.get('push-state-v1') as Stored | undefined,
    alarmAt: () => alarmAt,
  }
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

const realFetch = globalThis.fetch
afterEach(() => {
  globalThis.fetch = realFetch
  vi.useRealTimers()
})

describe('PRIVACY §7 — die Höchstfrist der Zustellnotiz wird eingehalten', () => {
  /**
   * Die Frist gilt „unabhängig davon, ob noch spätere Erinnerungen geplant
   * sind oder ob der Pushdienst gerade nicht erreichbar ist" — beide Fälle
   * werden hier durchgespielt, bis der Speicher wirklich leer ist.
   */
  for (const scenario of [
    { name: 'neben einer späteren Tageserinnerung', laterDaily: true, pushOk: true },
    { name: 'bei dauerhaft gestörtem Pushdienst', laterDaily: false, pushOk: false },
  ]) {
    it(`Messnotiz verschwindet spätestens nach 60 Minuten — ${scenario.name}`, async () => {
      vi.useFakeTimers()
      let now = Date.UTC(2026, 7, 26, 9, 0)
      vi.setSystemTime(now)
      const harness = durableHarness()
      const target = new PushReminder(harness.state, pushEnv)

      if (scenario.laterDaily) {
        await call(target, '/schedule', {
          endpoint: ENDPOINT,
          reminder: {
            id: 'daily',
            at: now + 10 * 3_600_000,
            title: 'T',
            body: 'B',
            recurrence: { localTime: '21:00', timeZone: 'Europe/Berlin' },
          },
        })
      }
      await call(target, '/schedule', {
        endpoint: ENDPOINT,
        reminder: { id: 'benchmark', at: now - 1_000, title: 'Messung wartet', body: 'B' },
      })

      globalThis.fetch = (async () =>
        new Response('', { status: scenario.pushOk ? 201 : 500 })) as typeof fetch

      // Der Worker bekommt so viele Alarme, wie er selbst anfordert — aber
      // die Uhr läuft dabei höchstens bis 60 Minuten + eine Minute weiter.
      const deadline = now + 61 * 60_000
      for (let tick = 0; tick < 40; tick++) {
        const next = harness.alarmAt()
        if (next === undefined) break
        now = Math.min(Math.max(next, now + 1_000), deadline)
        vi.setSystemTime(now)
        await target.alarm()
        if (now >= deadline) break
      }

      vi.setSystemTime(deadline)
      await target.alarm()

      const stored = harness.stored()
      const notes = stored?.pending ?? []
      expect(notes, 'nach 61 Minuten darf keine Messnotiz mehr liegen').toEqual([])
      if (!scenario.laterDaily) {
        // Ohne weiteren Termin ist der ganze Eintrag weg (§7, letzter Satz).
        expect(stored).toBeUndefined()
        expect(harness.alarmAt()).toBeUndefined()
      }
    })
  }

  it('speichert zur Zustellung nur Adresse, Zeit, Zone und den generischen Text', async () => {
    const harness = durableHarness()
    const target = new PushReminder(harness.state, pushEnv)
    await call(target, '/schedule', {
      endpoint: ENDPOINT,
      reminder: {
        id: 'daily',
        at: Date.now() + 3_600_000,
        title: 'Zeit für dein Gedächtnis',
        body: 'Fünf Minuten.',
        recurrence: { localTime: '19:30', timeZone: 'Europe/Berlin' },
        // Was ein Angreifer oder ein Fehler zusätzlich mitschicken könnte:
        trainingAnswers: ['Anker', 'Brücke'],
        email: 'mensch@example.com',
      },
    })
    const raw = JSON.stringify(harness.stored())
    expect(raw).not.toContain('Anker')
    expect(raw).not.toContain('mensch@example.com')
  })
})

describe('PRIVACY §9 — die Sitzungsfristen halten, was der Text sagt', () => {
  const env = {
    GOOGLE_CLIENT_SECRET: SECRET,
    ASSETS: { fetch: async () => new Response('asset') },
    PUSH_REMINDERS: { idFromName: (n: string) => n, get: () => ({ fetch: async () => Response.json({}) }) },
  }

  const ask = (cookie: string): Promise<Response> =>
    workerModule.fetch(
      new Request(`${ORIGIN}/oauth/google/access-token`, {
        method: 'POST',
        headers: { 'x-anitew-request': '1', origin: ORIGIN, cookie },
      }),
      env,
    ) as Promise<Response>

  const maxAgeOf = (response: Response): number => {
    const cookie = response.headers
      .getSetCookie()
      .find((entry) => entry.startsWith('anitew_google_oauth=')) as string
    return Number(/Max-Age=(\d+)/u.exec(cookie)?.[1])
  }
  const cookieOf = (response: Response): string =>
    (response.headers
      .getSetCookie()
      .find((entry) => entry.startsWith('anitew_google_oauth=')) as string).split(';')[0] as string

  it('eine neue Sitzung überlebt viele Refreshes nicht länger als 180 Tage', async () => {
    vi.useFakeTimers()
    const login = Date.UTC(2026, 0, 1)
    vi.setSystemTime(login)
    globalThis.fetch = (async () =>
      Response.json({ access_token: 'a', refresh_token: 'r', expires_in: 3600 })) as typeof fetch
    const callback: Response = (await workerModule.fetch(
      new Request(`${ORIGIN}/oauth/google/callback?state=s&code=c`, {
        headers: { cookie: 'anitew_google_oauth_state=s' },
      }),
      env,
    )) as Response
    let cookie = cookieOf(callback)

    // Alle zehn Tage einmal auffrischen — ein halbes Jahr lang.
    globalThis.fetch = (async () =>
      Response.json({ access_token: 'neu', expires_in: 3600 })) as typeof fetch
    for (let day = 10; day <= 170; day += 10) {
      vi.setSystemTime(login + day * 86_400_000)
      const response = await ask(cookie)
      expect(response.status, `Tag ${day}`).toBe(200)
      // Die Restlaufzeit schrumpft — sie wächst nie zurück auf 180 Tage.
      expect(maxAgeOf(response)).toBeLessThanOrEqual((180 - day + 1) * 86_400)
      cookie = cookieOf(response)
    }

    vi.setSystemTime(login + 181 * 86_400_000)
    const expired = await ask(cookie)
    expect(expired.status).toBe(401)
    expect(((await expired.json()) as { error: string }).error).toBe('session_expired')
  })

  it('eine Alt-Sitzung ohne Anmeldezeitpunkt endet nach höchstens 30 Tagen', async () => {
    vi.useFakeTimers()
    const start = Date.UTC(2026, 3, 1)
    vi.setSystemTime(start)
    const legacy = await seal(
      { accessToken: 'alt', expiresAt: start - 1_000, refreshToken: 'r' },
      SECRET,
    )
    globalThis.fetch = (async () =>
      Response.json({ access_token: 'neu', expires_in: 3600 })) as typeof fetch

    let cookie = `anitew_google_oauth=${legacy}`
    const first = await ask(cookie)
    expect(first.status).toBe(200)
    expect(maxAgeOf(first)).toBeLessThanOrEqual(30 * 86_400)
    cookie = cookieOf(first)

    vi.setSystemTime(start + 31 * 86_400_000)
    const expired = await ask(cookie)
    expect(expired.status).toBe(401)
    expect(expired.headers.getSetCookie()[0]).toContain('Max-Age=0')
  })
})
