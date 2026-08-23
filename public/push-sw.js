/* ANITEW Web Push — imported into the generated Workbox service worker. */
self.addEventListener('push', (event) => {
  event.waitUntil(
    (async () => {
      let notice = {
        title: 'ANITEW',
        body: 'Zeit für dein Gedächtnis.',
        tag: 'anitew-reminder',
      }

      try {
        const subscription = await self.registration.pushManager.getSubscription()
        if (subscription !== null) {
          const response = await fetch('/push/pending', {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              'x-anitew-request': '1',
            },
            body: JSON.stringify({ endpoint: subscription.endpoint }),
          })
          if (response.ok) {
            const pending = await response.json()
            if (typeof pending?.title === 'string' && typeof pending?.body === 'string') {
              notice = {
                title: pending.title,
                body: pending.body,
                tag: typeof pending.tag === 'string' ? pending.tag : notice.tag,
              }
            }
          }
        }
      } catch {
        // Ein Push ohne abrufbaren Text soll trotzdem sichtbar bleiben.
      }

      await self.registration.showNotification(notice.title, {
        body: notice.body,
        tag: notice.tag,
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        data: { url: '/' },
      })
    })(),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    (async () => {
      const target = new URL(event.notification.data?.url ?? '/', self.location.origin).href
      const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      for (const client of windows) {
        if (new URL(client.url).origin === self.location.origin) {
          await client.focus()
          if ('navigate' in client) await client.navigate(target)
          return
        }
      }
      await self.clients.openWindow(target)
    })(),
  )
})
