import type { Reminder, ReminderPermission } from '../../core/index.ts'

import {
  cancelWebPush,
  ensureWebPushSubscription,
  scheduleWebPush,
} from './pushReminders.ts'

const timers = new Map<string, ReturnType<typeof setTimeout>>()

function permission(): ReminderPermission {
  if (typeof window === 'undefined' || !('Notification' in window) || !window.isSecureContext) {
    return 'denied'
  }
  const state = Notification.permission
  return state === 'default' ? 'unasked' : state
}

function localSchedule(reminder: Reminder): boolean {
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

export async function askReminderPermission(usePush: boolean): Promise<{
  permission: ReminderPermission
  pushFailed: boolean
}> {
  if (permission() === 'denied') return { permission: 'denied', pushFailed: false }
  if (Notification.permission === 'default') {
    await Notification.requestPermission().catch(() => 'denied' as const)
  }
  const answer = permission()
  if (answer === 'granted' && usePush) {
    try {
      await ensureWebPushSubscription()
    } catch {
      return { permission: answer, pushFailed: true }
    }
  }
  return { permission: answer, pushFailed: false }
}

export async function scheduleReminder(reminder: Reminder, usePush: boolean): Promise<{
  ok: boolean
  pushFailed: boolean
}> {
  if (permission() !== 'granted') return { ok: false, pushFailed: false }
  if (usePush) {
    try {
      await scheduleWebPush(reminder)
      return { ok: true, pushFailed: false }
    } catch {
      return { ok: localSchedule(reminder), pushFailed: true }
    }
  }
  return { ok: localSchedule(reminder), pushFailed: false }
}

export async function cancelReminder(id: string, permanent: boolean): Promise<{
  pushFailed: boolean
}> {
  const running = timers.get(id)
  if (running !== undefined) clearTimeout(running)
  timers.delete(id)

  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return { pushFailed: false }
  }
  try {
    await cancelWebPush(id, permanent)
    return { pushFailed: false }
  } catch {
    return { pushFailed: permanent }
  }
}
