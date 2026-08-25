import type { Reminder } from '../../core/index.ts'

function fromBase64Url(value: string): ArrayBuffer {
  const padded = value.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - (value.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index)
  return bytes.buffer
}

function sameKey(left: ArrayBuffer | null, right: ArrayBuffer): boolean {
  if (left === null || left.byteLength !== right.byteLength) return false
  const a = new Uint8Array(left)
  const b = new Uint8Array(right)
  for (let index = 0; index < a.length; index++) {
    if (a[index] !== b[index]) return false
  }
  return true
}

async function post(path: string, body: unknown): Promise<Response> {
  return fetch(path, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-anitew-request': '1',
    },
    body: JSON.stringify(body),
  })
}

async function applicationServerKey(): Promise<ArrayBuffer> {
  const response = await fetch('/push/vapid-public', { cache: 'no-store' })
  if (!response.ok) throw new Error(`push_key_http_${response.status}`)
  const body = (await response.json()) as { publicKey?: unknown }
  if (typeof body.publicKey !== 'string' || body.publicKey === '') throw new Error('push_key_missing')
  return fromBase64Url(body.publicKey)
}

export async function ensureWebPushSubscription(): Promise<PushSubscription> {
  const registration = await navigator.serviceWorker.ready
  const key = await applicationServerKey()
  const existing = await registration.pushManager.getSubscription()

  // Eine Subscription ist an genau den VAPID-Schlüssel gebunden, mit dem sie
  // angelegt wurde. Falls Production einmal ohne vollständige Push-Secrets lief
  // oder ein Schlüssel bewusst gewechselt wurde, darf ANITEW eine alte iPhone-
  // Subscription nicht blind weiterverwenden: Der Server könnte sie sonst nie
  // gültig signiert erreichen.
  if (existing !== null && sameKey(existing.options.applicationServerKey, key)) return existing

  if (existing !== null) {
    // Serverseitigen Alarmzustand der alten Adresse best-effort entfernen. Das
    // lokale unsubscribe ist die eigentliche Grenze; ein gerade nicht
    // erreichbarer Worker darf die Reparatur nicht verhindern.
    await post('/push/unsubscribe', { endpoint: existing.endpoint }).catch(() => undefined)
    await existing.unsubscribe().catch(() => false)
  }

  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: key,
  })
}

function recurrenceOf(reminder: Reminder): { localTime: string; timeZone: string } | undefined {
  if (reminder.id !== 'daily') return undefined
  const date = new Date(reminder.at)
  const localTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  return { localTime, timeZone }
}

export async function scheduleWebPush(reminder: Reminder): Promise<void> {
  const subscription = await ensureWebPushSubscription()
  const response = await post('/push/schedule', {
    endpoint: subscription.endpoint,
    reminder: {
      ...reminder,
      recurrence: recurrenceOf(reminder),
    },
  })
  if (!response.ok) throw new Error(`push_schedule_http_${response.status}`)
}

export async function cancelWebPush(id: string, permanent: boolean): Promise<void> {
  const registration = await navigator.serviceWorker.getRegistration().catch(() => undefined)
  const subscription = await registration?.pushManager.getSubscription().catch(() => null)
  if (subscription === null || subscription === undefined) return

  try {
    const response = await post('/push/cancel', {
      endpoint: subscription.endpoint,
      id,
      permanent,
    })
    if (!response.ok) throw new Error(`push_cancel_http_${response.status}`)
  } catch (error) {
    if (permanent) await subscription.unsubscribe().catch(() => undefined)
    throw error
  }
}

/**
 * Entfernt ANITEWs Push-Adresse vollständig. Der Voll-Reset ruft das bewusst
 * vor dem Löschen der lokalen Daten auf. Selbst wenn der Worker gerade nicht
 * erreichbar ist, macht `unsubscribe()` die bisherige Push-Adresse ungültig.
 */
export async function clearWebPushRegistration(): Promise<void> {
  if (!('serviceWorker' in navigator)) return
  const registration = await navigator.serviceWorker.getRegistration()
  if (registration === undefined) return
  const subscription = await registration.pushManager?.getSubscription().catch(() => null)
  if (subscription === null || subscription === undefined) return
  await post('/push/unsubscribe', { endpoint: subscription.endpoint }).catch(() => undefined)
  await subscription.unsubscribe().catch(() => undefined)
}
