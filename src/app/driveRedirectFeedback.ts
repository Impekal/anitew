import { createWebPlatform } from '../platform/web/index.ts'
import {
  SYNC_ACCOUNT_NAME_SETTING,
  SYNC_ACCOUNT_SETTING,
  SYNC_ON_SETTING,
} from './driveSync.ts'
import { DRIVE_REDIRECT_NOTICE, type DriveRedirectNotice } from './driveRedirectReturn.ts'

const platform = createWebPlatform()
let notice: DriveRedirectNotice | undefined

try {
  const raw = window.sessionStorage.getItem(DRIVE_REDIRECT_NOTICE)
  if (raw !== null) notice = JSON.parse(raw) as DriveRedirectNotice
  window.sessionStorage.removeItem(DRIVE_REDIRECT_NOTICE)
} catch {
  // Nur Rückmeldung; die eigentliche OAuth-Sitzung liegt nicht hier.
}

function copy() {
  const de = document.documentElement.lang.toLowerCase().startsWith('de')
  return de
    ? {
        connected: 'Angemeldet. Daten im eigenen Google Drive gespeichert',
        failed: 'Google-Anmeldung konnte nicht abgeschlossen werden.',
      }
    : {
        connected: 'Signed in. Data saved in your own Google Drive',
        failed: 'Google sign-in could not be completed.',
      }
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
    if (notice?.kind === 'error') {
      status.dataset.error = 'true'
      status.textContent = `${copy().failed} · ${notice.detail}`
      notice = undefined
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
    button.textContent = '✓'
    const identity = accountName ?? account
    status.textContent = `${copy().connected}${identity === undefined ? '' : ` · ${identity}`}`
    notice = undefined
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
