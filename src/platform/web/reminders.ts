import type { Reminder, ReminderAbility, ReminderPermission, Reminders } from '../../core/index.ts'

let pushFailed = false

function notificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window && window.isSecureContext
}

function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false
  return /iPad|iPhone|iPod/u.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

function standalone(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
}

function webPushSupported(): boolean {
  if (!notificationSupported() || pushFailed) return false
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false
  // Apple exposes Web Push for iOS/iPadOS web apps only after installation on
  // the Home Screen. A Safari tab must therefore never promise closed-app push.
  return !isIOS() || standalone()
}

function permission(): ReminderPermission {
  if (!notificationSupported()) return 'denied'
  const state = Notification.permission
  return state === 'default' ? 'unasked' : state
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - (value.length % 4)) % 4)
  const binary = atob(padded)
  return Uint8Array.from(binary, (char) => char.charCodeAt(0))
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

async function ensureSubscription(): Promise<PushSubscription> {
  const registration = await navigator.serviceWorker.ready
  const existing = await registration.pushManager.getSubscription()
  if (existing !== null) return existing

  const response = await fetch('/push/vapid-public', { cache: 'no-store' })
  if (!response.ok) throw new Error(`push_key_http_${response.status}`)
  const body = (await response.json()) as { publicKey?: unknown }
  if (typeof body.publicKey !== 'string' || body.publicKey === '') throw new Error('push_key_missing')

  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: fromBase64Url(body.publicKey),
  })
}

function recurrenceOf(reminder: Reminder): { localTime: string; timeZone: string } | undefined {
  if (reminder.id !== 'daily') return undefined
  const date = new Date(reminder.at)
  const localTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  return { localTime, timeZone }
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

/**
 * Erinnerungen im Web.
 *
 * Standard-Web-Push ist der starke Pfad: Auf unterstützten Browsern und in
 * installierten iOS/iPadOS-PWAs weckt der Push-Service den Service Worker auch
 * nach dem Schließen. Der Worker speichert dafür nur die technische
 * Push-Adresse und die generische Fälligkeit — keine Trainingsinhalte.
 *
 * Wo Web Push nicht verfügbar ist, bleibt der alte ehrliche In-Page-Timer als
 * Fallback. `ability()` sagt vor der Einstellung, welcher Pfad gilt.
 */
export function createWebReminders(): Reminders {
  const timers = new Map<string, ReturnType<typeof setTimeout>>()

  const localSchedule = (reminder: Reminder): boolean => {
    const running = timers.get(reminder.id)
    if (running !== undefined) clearTimeout(running)
    const delay = reminder.at - Date.now()
    if (delay <= 0) return false
    const timer = setTimeout(() => {
      timers.delete(reminder.id)
      try {
        new Notification(reminder.title, { body: reminder.body, tag: reminder.id })
      } catch {
        // Manche Browser erlauben Notifications nur im Service Worker.
      }
    }, delay)
    timers.set(reminder.id, timer)
    return true
  }

  return {
    ability(): ReminderAbility {
      if (!notificationSupported() || permission() === 'denied') return 'none'
      return webPushSupported() ? 'scheduled' : 'whileOpen'
    },

    permission,

    async ask(): Promise<ReminderPermission> {
      if (!notificationSupported()) return 'denied'
      if (Notification.permission === 'default') {
        await Notification.requestPermission().catch(() => 'denied' as const)
      }
      const answer = permission()
      if (answer === 'granted' && webPushSupported()) {
        await ensureSubscription().catch(() => {
          pushFailed = true
        })
      }
      return answer
    },

    async schedule(reminder: Reminder): Promise<boolean> {
      if (!notificationSupported() || Notification.permission !== 'granted') return false

      if (webPushSupported()) {
        try {
          const subscription = await ensureSubscription()
          const response = await post('/push/schedule', {
            endpoint: subscription.endpoint,
            reminder: {
              ...reminder,
              recurrence: recurrenceOf(reminder),
            },
          })
          if (!response.ok) throw new Error(`push_schedule_http_${response.status}`)
          return true
        } catch {
          pushFailed = true
        }
      }

      return localSchedule(reminder)
    },

    async cancel(id: string, permanent = false): Promise<void> {
      const running = timers.get(id)
      if (running !== undefined) clearTimeout(running)
      timers.delete(id)

      if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
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
      } catch {
        // „Keine Erinnerung“ ist ein harter Nutzerwunsch. Selbst wenn ANITEWs
        // Worker gerade nicht erreichbar ist, invalidiert unsubscribe() die
        // alte Push-Adresse beim Browser-Pushdienst. Der serverseitige Rest
        // bekommt beim nächsten Zustellversuch 404/410 und löscht sich selbst.
        if (permanent) {
          await subscription.unsubscribe().catch(() => undefined)
          pushFailed = true
        }
      }
    },
  }
}
