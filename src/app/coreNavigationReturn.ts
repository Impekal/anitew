/**
 * Core is one navigation level.
 *
 * Pages such as Backup, Reminder or Sync are opened from the Core drawer.
 * Returning from one of those pages therefore belongs back in Core instead
 * of skipping the parent and dropping the user on the daily home screen.
 *
 * App.tsx owns the history entry itself. This bridge deliberately does not
 * create another history layer; it only restores the visual parent drawer
 * after React has handled the popstate and removed the page.
 */
window.addEventListener('popstate', () => {
  const wasCorePage = document.querySelector('.app.page') !== null
  if (!wasCorePage) return

  // React's popstate handler closes the page in the same event turn. Wait for
  // that commit before opening Core again. Two frames also cover Safari/PWA,
  // where resuming a standalone window may defer the paint by one frame.
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      const openCore = document.querySelector<HTMLButtonElement>('button.hamburger')
      if (openCore !== null && openCore.getAttribute('aria-expanded') !== 'true') {
        openCore.click()
      }
    })
  })
})
