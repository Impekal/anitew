const APP_ORIGIN = 'https://anitew.impekaltech.workers.dev'
const CLIENT_ID = '360791045103-jvbjtv7mdatp4f5svtcfj7uabjm7jdok.apps.googleusercontent.com'
const REDIRECT_URI = `${APP_ORIGIN}/oauth/google/callback`
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token'
const REVOKE_ENDPOINT = 'https://oauth2.googleapis.com/revoke'
const CREDENTIAL_COOKIE = 'anitew_google_oauth'
const STATE_COOKIE = 'anitew_google_oauth_state'
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

async function seal(value, secret) {
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

async function unseal(value, secret) {
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
    }
    const sealed = await seal(credential, env.GOOGLE_CLIENT_SECRET)
    const maxAge = credential.refreshToken ? 60 * 60 * 24 * 180 : Math.max(60, expiresIn)
    return appRedirect('complete', undefined, [credentialCookie(sealed, maxAge)])
  } catch (error) {
    return appRedirect('error', error instanceof Error ? error.message : 'token_exchange_failed')
  }
}

function sameOriginRequest(request) {
  if (request.method !== 'POST') return false
  if (request.headers.get('x-anitew-request') !== '1') return false
  const origin = request.headers.get('origin')
  return origin === null || origin === APP_ORIGIN
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

  if (typeof credential.expiresAt === 'number' && credential.expiresAt > Date.now() + 30_000) {
    return json({ access_token: credential.accessToken })
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
  }
  const nextSealed = await seal(next, env.GOOGLE_CLIENT_SECRET)
  return json(
    { access_token: next.accessToken },
    200,
    credentialCookie(nextSealed, 60 * 60 * 24 * 180),
  )
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

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname === '/oauth/google/callback' && request.method === 'GET') {
      return handleCallback(request, env)
    }
    if (url.pathname === '/oauth/google/access-token') return handleAccessToken(request, env)
    if (url.pathname === '/oauth/google/logout') return handleLogout(request, env)
    return env.ASSETS.fetch(request)
  },
}
