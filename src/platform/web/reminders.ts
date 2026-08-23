import type { ReminderAbility, ReminderPermission, Reminders } from '../../core/index.ts'

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
 * Im Kaltstart bleiben nur zwei synchrone Wahrheiten: darf dieses Gerät Push
 * versprechen und welche Berechtigung liegt vor. Alles, was tatsächlich etwas
 * tut — Permission-Dialog, Timer, Subscription, HTTP — lädt erst beim Fingertipp.
 */
export function createWebReminders(): Reminders {
  return {
    ability(): ReminderAbility {
      if (!notificationSupported() || permission() === 'denied') return 'none'
      return webPushSupported() ? 'scheduled' : 'whileOpen'
    },

    permission,

    async ask(): Promise<ReminderPermission> {
      if (!notificationSupported()) return 'denied'
      const actions = await import('./reminderActions.ts')
      const result = await actions.askReminderPermission(webPushSupported())
      if (result.pushFailed) pushFailed = true
      return result.permission
    },

    async schedule(reminder): Promise<boolean> {
      if (!notificationSupported() || Notification.permission !== 'granted') return false
      const actions = await import('./reminderActions.ts')
      const result = await actions.scheduleReminder(reminder, webPushSupported())
      if (result.pushFailed) pushFailed = true
      return result.ok
    },

    async cancel(id: string, permanent = false): Promise<void> {
      const actions = await import('./reminderActions.ts')
      const result = await actions.cancelReminder(id, permanent)
      if (result.pushFailed) pushFailed = true
    },
  }
}
