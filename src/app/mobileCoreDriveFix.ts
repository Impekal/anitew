import '../anitew-mobile-core.css'
import './experienceRefinement.ts'

/**
 * Google Identity opens its account chooser from a user gesture. On mobile
 * browsers that gesture can be lost if the first tap still has to download
 * GIS before requestAccessToken() is called. Prepare the external script while
 * the Drive control is already visible; the actual tap then only opens Google.
 *
 * No Drive UI means no Google request: existing local-only users keep the
 * same local-first network behaviour.
 */
const prepared = new WeakSet<HTMLButtonElement>()

function prepareDriveButtons(): void {
  document
    .querySelectorAll<HTMLButtonElement>('.first-run-drive-connect, .sync-run')
    .forEach((button) => {
      if (prepared.has(button)) return
      prepared.add(button)

      const wasDisabled = button.disabled
      button.disabled = true
      button.setAttribute('aria-busy', 'true')
      button.dataset.googleAuth = 'preparing'

      void import('../platform/web/drive.ts')
        .then(({ prepareDriveAuth }) => prepareDriveAuth())
        .then(() => {
          button.dataset.googleAuth = 'ready'
          button.removeAttribute('aria-busy')
          if (!wasDisabled) button.disabled = false
        })
        .catch(() => {
          // A network failure is not sticky. Re-enable the control so a later
          // tap can retry; the normal Drive error copy remains authoritative.
          button.dataset.googleAuth = 'retry'
          button.removeAttribute('aria-busy')
          if (!wasDisabled) button.disabled = false
        })
    })
}

prepareDriveButtons()
const root = document.getElementById('root') ?? document.body
const driveObserver = new MutationObserver(prepareDriveButtons)
driveObserver.observe(root, { childList: true, subtree: true })

window.addEventListener('pagehide', () => driveObserver.disconnect(), { once: true })
