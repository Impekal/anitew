import { expect, test, type Page } from '@playwright/test'

import { openPage, startButton, visit } from './helpers.ts'

interface PushMockOptions {
  permission: NotificationPermission
  ios?: boolean
  standalone?: boolean
}

async function withWebPush(page: Page, options: PushMockOptions) {
  await page.addInitScript((input) => {
    let current = input.permission
    const subscription = {
      endpoint: 'https://push.example.invalid/anitew-device',
      toJSON: () => ({ endpoint: 'https://push.example.invalid/anitew-device' }),
      unsubscribe: async () => true,
    }
    const pushManager = {
      getSubscription: async () => subscription,
      subscribe: async () => subscription,
    }
    const registration = { pushManager }

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
        ready: Promise.resolve(registration),
        getRegistration: async () => registration,
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
  }, options)
}

async function openReminders(page: Page) {
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await openPage(page, 'Erinnerung')
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
  // Keine Trainings-, Profil- oder Gedächtnisdaten gehören in diesen Request.
  expect(JSON.stringify(scheduled)).not.toMatch(/profile|memory|training|answer|email/i)
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
  await page.reload()
  await openPage(page, 'Erinnerung')
  await expect(page.locator('.reminder input[type="time"]')).toHaveValue('07:15')

  await page.getByRole('button', { name: 'Keine Erinnerung' }).click()
  await expect(page.locator('.reminder').getByText('Aus.', { exact: true })).toBeVisible()
  await expect.poll(() => permanentCancel).toBe(true)
})

test('fragt nicht beim ersten Start nach Benachrichtigungen', async ({ page }) => {
  await withWebPush(page, { permission: 'default' })
  await visit(page)
  await expect(startButton(page)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Benachrichtigungen erlauben' })).toBeHidden()
})
