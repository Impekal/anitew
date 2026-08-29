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

/**
 * A hard reload does not restore App.tsx's transient `pageId`: ANITEW starts
 * deliberately on the daily home screen again. The browser, however, keeps
 * the current History entry and therefore also its `{ page }` payload.
 *
 * Leaving that payload behind creates a phantom Core child. If the person
 * opens another Core page after the reload, Back lands on the stale entry and
 * the Forward-restoration logic below legitimately interprets it as a child
 * page, reopening the old screen instead of returning home.
 *
 * Keep history and the actually rendered screen in agreement as soon as this
 * document starts. Other state fields are preserved; only ANITEW's transient
 * page marker is removed. Same-document Back/Forward is unaffected because
 * this module runs once per document, before a person can open a Core child.
 */
function normalizeReloadedPageState(): void {
  const state = window.history.state
  if (state === null || typeof state !== 'object' || Array.isArray(state)) return

  const record = state as Record<string, unknown>
  if (typeof record.page !== 'string') return

  const next = { ...record }
  delete next.page
  window.history.replaceState(Object.keys(next).length === 0 ? null : next, '')
}

normalizeReloadedPageState()

// Remember the parent while entering a Core child. A native iOS/browser back
// gesture has no click on `.page-back`, so arming at entry is the reliable
// signal for both paths.
//
// The visible page-back button needs one extra rule. App.tsx used to clear its
// transient page state immediately and only then call `history.back()`. That
// creates a short but real false-home window: the page is already gone while
// the browser is still on the child history entry. A very fast next Core tap
// can land in that window and then be erased by the late popstate. Intercept
// only the normal child-history case here, let the browser move first, and let
// App.tsx's existing popstate listener close the page atomically with that
// transition. If no child marker exists, React keeps its fallback close path.
document.addEventListener(
  'click',
  (event) => {
    const target = event.target
    if (!(target instanceof Element)) return

    if (target.closest('.drawer-item') !== null) {
      coreReturnArmed = true
      return
    }

    if (target.closest('.page-back') === null) return
    coreReturnArmed = true

    const state = window.history.state as { page?: unknown } | null
    if (typeof state?.page !== 'string') return

    event.preventDefault()
    event.stopPropagation()
    window.history.back()
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
