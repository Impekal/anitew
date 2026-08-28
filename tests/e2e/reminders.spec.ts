import { expect, test, type Page } from '@playwright/test'

import { openPage, startButton, visit } from './helpers.ts'

const PUSH_PUBLIC_KEY = 'BAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0-P0A'

interface PushMockOptions {
  permission: NotificationPermission
  ios?: boolean
  standalone?: boolean
  staleSubscriptionKey?: boolean
}

async function withWebPush(page: Page, options: PushMockOptions) {
  await page.route('**/push/vapid-public', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ publicKey: PUSH_PUBLIC_KEY }),
    }),
  )

  await page.addInitScript((input) => {
    let current = input.permission
    ;(window as any).__anitewUnsubscribeCount = 0
    ;(window as any).__anitewSubscribeCount = 0

    const decodeKey = (value: string) => {
      const padded = value.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - (value.length % 4)) % 4)
      const binary = atob(padded)
      return Uint8Array.from(binary, (char) => char.charCodeAt(0)).buffer
    }
    const currentKey = decodeKey(input.publicKey)
    const staleKey = new Uint8Array(currentKey.byteLength).fill(9).buffer
    const subscription: any = {
      endpoint: 'https://push.example.invalid/anitew-device',
      options: {
        userVisibleOnly: true,
        applicationServerKey: input.staleSubscriptionKey ? staleKey : currentKey,
      },
      toJSON: () => ({ endpoint: 'https://push.example.invalid/anitew-device' }),
      unsubscribe: async () => {
        ;(window as any).__anitewUnsubscribeCount++
        return true
      },
    }
    const pushManager = {
      getSubscription: async () => subscription,
      subscribe: async (subscribeOptions: PushSubscriptionOptionsInit) => {
        ;(window as any).__anitewSubscribeCount++
        subscription.options = subscribeOptions
        return subscription
      },
    }
    const registration = {
      pushManager,
      update: async () => undefined,
    }

    class FakeNotification {
      static get permission(): NotificationPermission {
        return current
      }
      static async requestPermission(): Promise<NotificationPermission> {
        current = 'granted'
        return current
      }
      constructor(_title: string, _options?: NotificationOptions) {}
    }

    Object.defineProperty(window, 'Notification', { configurable: true, value: FakeNotification })
    Object.defineProperty(window, 'PushManager', { configurable: true, value: class PushManager {} })
    Object.defineProperty(window, 'isSecureContext', { configurable: true, value: true })
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: {
        controller: null,
        ready: Promise.resolve(registration),
        getRegistration: async () => registration,
        register: async () => registration,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
      },
    })
    if (input.ios) {
      Object.defineProperty(navigator, 'userAgent', {
        configurable: true,
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
      })
    }
    if (input.standalone !== undefined) {
      const original = window.matchMedia.bind(window)
      window.matchMedia = (query: string) =>
        query === '(display-mode: standalone)'
          ? ({ matches: input.standalone } as MediaQueryList)
          : original(query)
      Object.defineProperty(navigator, 'standalone', {
        configurable: true,
        value: input.standalone,
      })
    }
  }, { ...options, publicKey: PUSH_PUBLIC_KEY })
}

async function openReminders(page: Page) {
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await openPage(page, 'Erinnerung')
}

async function storedDailyTime(page: Page): Promise<unknown> {
  return page.evaluate(async () => {
    const open = indexedDB.open('anitew')
    const database: IDBDatabase = await new Promise((resolve, reject) => {
      open.onsuccess = () => resolve(open.result)
      open.onerror = () => reject(open.error)
    })
    return new Promise<unknown>((resolve, reject) => {
      const request = database.transaction('settings').objectStore('settings').get('reminders.daily')
      request.onsuccess = () => resolve((request.result as { value?: unknown } | undefined)?.value)
      request.onerror = () => reject(request.error)
    })
  })
}

test('fragt erst auf der Erinnerungsseite nach Benachrichtigungen', async ({ page }) => {
  await withWebPush(page, { permission: 'default' })
  await openReminders(page)
  await expect(page.getByRole('button', { name: 'Benachrichtigungen erlauben' })).toBeVisible()
  await expect(page.locator('.reminder input[type="time"]')).toHaveCount(0)
})

test('verspricht geschlossenes Push nur, wenn Web Push auf diesem Startmodus wirklich nutzbar ist', async ({ page }) => {
  await withWebPush(page, { permission: 'granted' })
  await openReminders(page)
  await expect(page.getByText(/Systemmitteilung an, auch wenn ANITEW geschlossen ist/)).toBeVisible()
})

test('verspricht einem normalen iPhone-Safari-Tab kein geschlossenes Push', async ({ page }) => {
  await withWebPush(page, { permission: 'granted', ios: true, standalone: false })
  await openReminders(page)
  await expect(page.locator('.reminder strong')).toHaveText('solange es offen ist')
  await expect(page.getByText(/Home-Screen-App/)).toBeVisible()
})

test('plant die Tageserinnerung anonym mit Fälligkeit und Zeitzone', async ({ page }) => {
  await withWebPush(page, { permission: 'granted' })
  let scheduled: Record<string, any> | undefined
  await page.route('**/push/schedule', async (route) => {
    scheduled = route.request().postDataJSON() as Record<string, any>
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })
  })
  await page.route('**/push/cancel', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }),
  )

  await openReminders(page)
  const time = page.locator('.reminder input[type="time"]')
  await time.fill('07:15')
  await page.getByRole('button', { name: 'Erinnerung merken' }).click()
  await expect(page.locator('.reminder').getByText('Gemerkt.', { exact: true })).toBeVisible()

  await expect.poll(() => scheduled?.reminder?.id).toBe('daily')
  expect(scheduled?.endpoint).toBe('https://push.example.invalid/anitew-device')
  expect(scheduled?.reminder?.title).toBe('ANITEW')
  expect(scheduled?.reminder?.recurrence?.localTime).toBe('07:15')
  expect(typeof scheduled?.reminder?.recurrence?.timeZone).toBe('string')
  expect(JSON.stringify(scheduled)).not.toMatch(/profile|memory|training|answer|email/i)
})

test('erneuert eine Push-Subscription, die noch an einem alten VAPID-Schlüssel hängt', async ({ page }) => {
  await withWebPush(page, { permission: 'granted', staleSubscriptionKey: true })
  await page.route('**/push/unsubscribe', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }),
  )
  await page.route('**/push/schedule', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }),
  )
  await page.route('**/push/cancel', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }),
  )

  await openReminders(page)
  await page.locator('.reminder input[type="time"]').fill('07:15')
  await page.getByRole('button', { name: 'Erinnerung merken' }).click()
  await expect(page.locator('.reminder').getByText('Gemerkt.', { exact: true })).toBeVisible()
  await expect.poll(() => page.evaluate(() => (window as any).__anitewUnsubscribeCount)).toBe(1)
  await expect.poll(() => page.evaluate(() => (window as any).__anitewSubscribeCount)).toBe(1)
})

test('meldet einen kaputten Closed-App-Push nicht mehr als erfolgreich gemerkt', async ({ page }) => {
  await withWebPush(page, { permission: 'granted', ios: true, standalone: true })
  await page.route('**/push/schedule', (route) =>
    route.fulfill({ status: 503, contentType: 'application/json', body: '{"error":"push_not_configured"}' }),
  )
  await page.route('**/push/cancel', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }),
  )

  await openReminders(page)
  await expect(page.getByText(/Systemmitteilung an, auch wenn ANITEW geschlossen ist/)).toBeVisible()
  await page.locator('.reminder input[type="time"]').fill('07:15')
  await page.getByRole('button', { name: 'Erinnerung merken' }).click()

  await expect(page.locator('.reminder').getByText('Gemerkt.', { exact: true })).toHaveCount(0)
  await expect(page.getByText(/solange es offen ist/).first()).toBeVisible()
})

test('merkt die Uhrzeit und schaltet den täglichen Servertermin ausdrücklich dauerhaft aus', async ({ page }) => {
  await withWebPush(page, { permission: 'granted' })
  let permanentCancel = false
  await page.route('**/push/schedule', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }),
  )
  await page.route('**/push/cancel', async (route) => {
    const body = route.request().postDataJSON() as { permanent?: boolean }
    if (body.permanent === true) permanentCancel = true
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })
  })

  await openReminders(page)
  await page.locator('.reminder input[type="time"]').fill('07:15')
  await page.getByRole('button', { name: 'Erinnerung merken' }).click()
  // „Gemerkt.“ ist jetzt nicht nur der Abschluss des IndexedDB-Writes,
  // sondern auch der bestätigten Plattform-Planung.
  await expect(page.locator('.reminder').getByText('Gemerkt.', { exact: true })).toBeVisible()
  await page.reload()
  await openPage(page, 'Erinnerung')
  await expect(page.locator('.reminder input[type="time"]')).toHaveValue('07:15')

  await page.getByRole('button', { name: 'Keine Erinnerung' }).click()
  await expect(page.locator('.reminder').getByText('Aus.', { exact: true })).toBeVisible()
  await expect.poll(() => permanentCancel).toBe(true)
  await expect.poll(() => storedDailyTime(page)).toBeUndefined()
})

test('bestätigt Aus erst nachdem der wirkliche Push-Widerruf abgeschlossen ist', async ({ page }) => {
  await withWebPush(page, { permission: 'granted' })
  let cancelStarted = false
  let releaseCancel!: () => void
  const heldCancel = new Promise<void>((resolve) => {
    releaseCancel = resolve
  })

  await page.route('**/push/schedule', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }),
  )
  await page.route('**/push/cancel', async (route) => {
    cancelStarted = true
    await heldCancel
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })
  })

  await openReminders(page)
  await page.locator('.reminder input[type="time"]').fill('07:15')
  await page.getByRole('button', { name: 'Erinnerung merken' }).click()
  await expect(page.locator('.reminder').getByText('Gemerkt.', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Keine Erinnerung' }).click()
  await expect.poll(() => cancelStarted).toBe(true)
  await expect(page.locator('.reminder').getByText('Aus.', { exact: true })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Keine Erinnerung' })).toBeDisabled()
  expect(await storedDailyTime(page)).toBe('07:15')

  releaseCancel()
  await expect(page.locator('.reminder').getByText('Aus.', { exact: true })).toBeVisible()
  await expect.poll(() => storedDailyTime(page)).toBeUndefined()
})

test('macht bei Serverausfall die alte Push-Adresse lokal ungültig', async ({ page }) => {
  await withWebPush(page, { permission: 'granted' })
  await page.route('**/push/schedule', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }),
  )
  await page.route('**/push/cancel', (route) => route.abort('failed'))

  await openReminders(page)
  await page.locator('.reminder input[type="time"]').fill('07:15')
  await page.getByRole('button', { name: 'Erinnerung merken' }).click()
  await expect(page.locator('.reminder').getByText('Gemerkt.', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Keine Erinnerung' }).click()
  await expect(page.locator('.reminder').getByText('Aus.', { exact: true })).toBeVisible()
  await expect.poll(() => page.evaluate(() => (window as any).__anitewUnsubscribeCount)).toBe(1)
})

test('fragt nicht beim ersten Start nach Benachrichtigungen', async ({ page }) => {
  await withWebPush(page, { permission: 'default' })
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Benachrichtigungen erlauben' })).toBeHidden()
})
