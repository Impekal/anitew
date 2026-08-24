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
let coreReturnArmed = false

// Remember the parent while entering a Core child, not only when the visible
// back button is used. A native iOS/browser back gesture has no click on
// `.page-back`, so arming at entry is the reliable signal for both paths.
document.addEventListener(
  'click',
  (event) => {
    const target = event.target
    if (!(target instanceof Element)) return
    if (target.closest('.drawer-item') !== null || target.closest('.page-back') !== null) {
      coreReturnArmed = true
    }
  },
  true,
)

window.addEventListener('popstate', () => {
  const shouldReturnToCore = coreReturnArmed || document.querySelector('.app.page') !== null
  coreReturnArmed = false
  if (!shouldReturnToCore) return

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
