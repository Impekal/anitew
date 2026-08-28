const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

interface InertSnapshot {
  element: HTMLElement
  inert: boolean
}

function visibleFocusable(drawer: HTMLElement): HTMLElement[] {
  return [...drawer.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (element) => !element.hidden && element.getClientRects().length > 0,
  )
}

/**
 * Ergänzt dem React-Drawer die Semantik und Fokusregeln eines modalen
 * Dialogs, ohne das visuelle Layout anzufassen. Der Helfer bleibt absichtlich
 * DOM-seitig: Der Drawer ist ein kurzlebiges Portal-artiges Overlay und kann
 * so unabhängig von den vielen App-Zuständen abgesichert werden.
 */
export function installDrawerAccessibility(): () => void {
  let activeDrawer: HTMLElement | undefined
  let activeVeil: HTMLElement | undefined
  let opener: HTMLElement | null = null
  let inertSnapshots: InertSnapshot[] = []
  let keydown: ((event: KeyboardEvent) => void) | undefined

  const restore = () => {
    if (activeDrawer !== undefined && keydown !== undefined) {
      activeDrawer.removeEventListener('keydown', keydown)
    }
    for (const snapshot of inertSnapshots) snapshot.element.inert = snapshot.inert
    inertSnapshots = []
    activeDrawer = undefined
    activeVeil = undefined
    keydown = undefined

    const target = opener
    opener = null
    if (target?.isConnected) queueMicrotask(() => target.focus())
  }

  const inertOutside = (veil: HTMLElement) => {
    let branch: HTMLElement = veil
    while (branch.parentElement !== null) {
      const parent = branch.parentElement
      for (const sibling of [...parent.children]) {
        if (!(sibling instanceof HTMLElement) || sibling === branch) continue
        inertSnapshots.push({ element: sibling, inert: sibling.inert })
        sibling.inert = true
      }
      if (parent === document.body) break
      branch = parent
    }
  }

  const enhance = (drawer: HTMLElement, veil: HTMLElement) => {
    activeDrawer = drawer
    activeVeil = veil
    opener = document.activeElement instanceof HTMLElement ? document.activeElement : null

    veil.setAttribute('role', 'dialog')
    veil.setAttribute('aria-modal', 'true')
    const label = drawer.getAttribute('aria-label')
    if (label !== null) veil.setAttribute('aria-label', label)

    const hamburger = document.querySelector<HTMLElement>('.hamburger')
    hamburger?.setAttribute('aria-haspopup', 'dialog')

    inertOutside(veil)

    keydown = (event) => {
      if (event.key !== 'Tab') return
      const focusable = visibleFocusable(drawer)
      if (focusable.length === 0) {
        event.preventDefault()
        drawer.focus()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (first === undefined || last === undefined) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    drawer.addEventListener('keydown', keydown)

    queueMicrotask(() => {
      const close = drawer.querySelector<HTMLElement>('.drawer-close')
      if (close?.isConnected) close.focus()
      else {
        drawer.tabIndex = -1
        drawer.focus()
      }
    })
  }

  const sync = () => {
    const drawer = document.querySelector<HTMLElement>('.drawer')

    const hamburger = document.querySelector<HTMLElement>('.hamburger')
    if (hamburger !== null && hamburger.getAttribute('aria-haspopup') !== 'dialog') {
      hamburger.setAttribute('aria-haspopup', 'dialog')
    }

    if (drawer === null) {
      if (activeDrawer !== undefined) restore()
      return
    }

    const veil = drawer.closest<HTMLElement>('.drawer-veil')
    if (veil === null) {
      if (activeDrawer !== undefined) restore()
      return
    }

    if (drawer !== activeDrawer || veil !== activeVeil) {
      if (activeDrawer !== undefined) restore()
      enhance(drawer, veil)
      return
    }

    const label = drawer.getAttribute('aria-label')
    if (label !== null && veil.getAttribute('aria-label') !== label) {
      veil.setAttribute('aria-label', label)
    }
  }

  const observer = new MutationObserver(sync)
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['aria-label', 'aria-haspopup'],
  })
  sync()

  return () => {
    observer.disconnect()
    restore()
  }
}
