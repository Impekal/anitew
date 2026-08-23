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

/**
 * Voll-Reset ist selten. Deshalb bleibt selbst das Abmelden vom Pushdienst aus
 * dem Kaltstart: erst wenn wirklich zurückgesetzt wird, laden wir den Transport.
 */
export async function clearWebPushRegistration(): Promise<void> {
  const push = await import('./pushReminders.ts')
  await push.clearWebPushRegistration()
}

/**
 * Erinnerungen im Web.
 *
 * Die kleine Fähigkeitsprüfung bleibt im Startbundle. VAPID-Decoding,
 * Subscription und Servertransport werden erst nach einer echten
 * Erinnerungsaktion geladen. So kostet Web Push keinen normalen ANITEW-Start.
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
        try {
          const push = await import('./pushReminders.ts')
          await push.ensureWebPushSubscription()
        } catch {
          pushFailed = true
        }
      }
      return answer
    },

    async schedule(reminder: Reminder): Promise<boolean> {
      if (!notificationSupported() || Notification.permission !== 'granted') return false

      if (webPushSupported()) {
        try {
          const push = await import('./pushReminders.ts')
          await push.scheduleWebPush(reminder)
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
      try {
        const push = await import('./pushReminders.ts')
        await push.cancelWebPush(id, permanent)
      } catch {
        // Bei einem permanenten Aus wurde das Browser-Abo im Transport bereits
        // widerrufen; ab jetzt darf ability() keinen sicheren Push mehr zusagen.
        if (permanent) pushFailed = true
      }
    },
  }
}
