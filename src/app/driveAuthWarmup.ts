/*
 * First-run Google Drive has a special browser constraint: GIS opens its
 * consent window as a popup, and strict mobile browsers only allow that while
 * a real user gesture is still active. Loading GIS after the click can lose
 * that gesture. We therefore warm the SDK as soon as the optional Drive card
 * actually exists in the onboarding DOM — not at general app startup.
 */

let warming = false
let ready = false

function warmWhenDriveIsVisible(): void {
  if (ready || warming) return
  if (document.querySelector('.first-run-drive-card') === null) return

  warming = true
  void import('../platform/web/drive.ts')
    .then(({ preloadDriveAuth }) => preloadDriveAuth())
    .then(() => {
      ready = true
    })
    .catch(() => {
      // Offline/privacy blocking is reported by the actual connection attempt.
      // Keep retry possible if the DOM changes or the card is revisited.
      warming = false
    })
}

warmWhenDriveIsVisible()

const observer = new MutationObserver(warmWhenDriveIsVisible)
observer.observe(document.body, { childList: true, subtree: true })

window.addEventListener(
  'pagehide',
  () => observer.disconnect(),
  { once: true },
)
