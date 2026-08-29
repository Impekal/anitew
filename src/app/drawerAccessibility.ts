const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function visibleFocusable(drawer: HTMLElement): HTMLElement[] {
  return [...drawer.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (element) => !element.hidden && element.getClientRects().length > 0,
  )
}

/**
 * Ergänzt dem React-Drawer die Semantik und Fokusregeln eines modalen
 * Dialogs, ohne das visuelle Layout anzufassen.
 *
 * Wichtig: Der Drawer lebt derzeit innerhalb von `#root` und nicht in einem
 * echten Body-Portal. Frühere Audit-Fassungen setzten deshalb die Geschwister
 * entlang dieses Baums auf `inert`. Chromium retargetete daraufhin reale
 * Pointer-Treffer im Drawer auf `#root` — sichtbare Menüeinträge waren nicht
 * mehr anklickbar. `aria-modal`, der vollflächige Veil und der Fokus-Trap
 * liefern hier die richtige Modalität, ohne einen Vorfahren des Overlays in
 * die Hit-Test-Sperre zu ziehen. Falls der Drawer später in ein echtes Portal
 * wandert, kann `#root` dort gefahrlos inert gesetzt werden.
 */
export function installDrawerAccessibility(): () => void {
  let activeDrawer: HTMLElement | undefined
  let activeVeil: HTMLElement | undefined
  let opener: HTMLElement | null = null
  let keydown: ((event: KeyboardEvent) => void) | undefined

  const restore = () => {
    if (activeDrawer !== undefined && keydown !== undefined) {
      activeDrawer.removeEventListener('keydown', keydown)
    }
    activeDrawer = undefined
    activeVeil = undefined
    keydown = undefined

    const target = opener
    opener = null
    if (target?.isConnected) queueMicrotask(() => target.focus())
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

    keydown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        drawer.querySelector<HTMLButtonElement>('.drawer-close')?.click()
        return
      }
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
