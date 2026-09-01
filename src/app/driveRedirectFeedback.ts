import { driveCopyForCurrentUi } from '../i18n/driveCopy.ts'
import { createWebPlatform } from '../platform/web/index.ts'
import {
  SYNC_ACCOUNT_NAME_SETTING,
  SYNC_ACCOUNT_SETTING,
  SYNC_ON_SETTING,
} from './driveSync.ts'
import { takeDriveRedirectNotice } from './driveRedirectNotice.ts'

const platform = createWebPlatform()

/* Dieselbe Quelle wie der Drive-Bildschirm — sechs Sprachen, keine Insel. */
function copy(): { connected: string; failed: string } {
  const texts = driveCopyForCurrentUi()
  return { connected: texts.redirectConnected, failed: texts.redirectFailed }
}

let applying = false
async function applyFeedback(): Promise<void> {
  if (applying) return
  const card = document.querySelector<HTMLElement>('.first-run-drive-card')
  if (card === null) return
  const button = card.querySelector<HTMLButtonElement>('.first-run-drive-connect')
  const status = card.querySelector<HTMLElement>('.first-run-drive-status')
  if (button === null || status === null) return

  applying = true
  try {
    const notice = takeDriveRedirectNotice()
    if (notice?.kind === 'error') {
      status.dataset.error = 'true'
      status.textContent = `${copy().failed} · ${notice.detail}`
      return
    }

    const [on, account, accountName] = await Promise.all([
      platform.settings.read<boolean>(SYNC_ON_SETTING).catch(() => undefined),
      platform.settings.read<string>(SYNC_ACCOUNT_SETTING).catch(() => undefined),
      platform.settings.read<string>(SYNC_ACCOUNT_NAME_SETTING).catch(() => undefined),
    ])
    if (on !== true) return

    delete status.dataset.error
    button.disabled = true
    button.setAttribute('aria-label', button.textContent ?? copy().connected)
    button.textContent = '✓'
    const identity = accountName ?? account
    status.textContent = `${copy().connected}${identity === undefined ? '' : ` · ${identity}`}`
  } finally {
    applying = false
  }
}

void applyFeedback()
const observer = new MutationObserver(() => void applyFeedback())
observer.observe(document.body, { childList: true, subtree: true, characterData: true })

window.addEventListener(
  'pagehide',
  () => observer.disconnect(),
  { once: true },
)
