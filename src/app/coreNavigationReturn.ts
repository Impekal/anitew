/**
 * Core is one navigation level.
 *
 * Pages such as Backup, Reminder or Sync are opened from the Core drawer.
 * Returning from one of those pages therefore belongs back in Core instead
 * of skipping the parent and dropping the user on the daily home screen.
 *
 * App.tsx owns the history entry itself. This bridge deliberately does not
 * create another history layer; it restores the visual parent drawer after
 * React handled Back, and restores the stored child page when Browser Forward
 * returns to an entry carrying `{ page }`.
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

function drawerItemFor(page: string): HTMLButtonElement | null {
  const glyphs = document.querySelectorAll<HTMLElement>('.menu-glyph-wrap[data-icon-kind]')
  for (const glyph of glyphs) {
    if (glyph.dataset.iconKind === page) return glyph.closest<HTMLButtonElement>('.drawer-item')
  }
  return null
}

function openCore(): void {
  const openCore = document.querySelector<HTMLButtonElement>('button.hamburger')
  if (openCore !== null && openCore.getAttribute('aria-expanded') !== 'true') openCore.click()
}

window.addEventListener('popstate', (event) => {
  const state = event.state as { page?: unknown } | null
  const targetPage = typeof state?.page === 'string' ? state.page : undefined

  /*
   * Forward is the inverse of Back: React's own popstate handler currently
   * clears its page state for every traversal. If the browser has just moved
   * onto one of ANITEW's `{ page }` entries, restore exactly that child.
   *
   * Calling the real drawer button is intentional: it keeps one navigation
   * path instead of duplicating React state logic here. `openPage()` normally
   * calls pushState; during this one synthetic restoration that would create
   * a duplicate history entry. Temporarily map that single push to
   * replaceState, so Forward reuses the entry the browser already selected.
   */
  if (targetPage !== undefined) {
    coreReturnArmed = false
    window.requestAnimationFrame(() => {
      openCore()
      window.requestAnimationFrame(() => {
        const item = drawerItemFor(targetPage)
        if (item === null) return

        const originalPushState = window.history.pushState.bind(window.history)
        window.history.pushState = ((data: unknown, unused: string, url?: string | URL | null) => {
          window.history.replaceState(data, unused, url)
        }) as History['pushState']
        try {
          item.click()
        } finally {
          window.history.pushState = originalPushState
        }
      })
    })
    return
  }

  const shouldReturnToCore = coreReturnArmed || document.querySelector('.app.page') !== null
  coreReturnArmed = false
  if (!shouldReturnToCore) return

  // React's popstate handler closes the page in the same event turn. Wait for
  // that commit before opening Core again. Two frames also cover Safari/PWA,
  // where resuming a standalone window may defer the paint by one frame.
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(openCore)
  })
})
