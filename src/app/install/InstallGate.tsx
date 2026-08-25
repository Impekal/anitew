import { useEffect, useMemo, useState } from 'react'

import './installGate.css'

type InstallDevice = 'iphone' | 'android' | 'mac' | 'windows'

type InstallPromptChoice = { outcome: 'accepted' | 'dismissed' }

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<InstallPromptChoice>
}

let deferredPrompt: BeforeInstallPromptEvent | undefined

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault()
  deferredPrompt = event as BeforeInstallPromptEvent
})

const DEVICE_LABELS: Record<InstallDevice, string> = {
  iphone: 'iPhone / iPad',
  android: 'Android',
  mac: 'Mac',
  windows: 'Windows / anderes Gerät',
}

const STEPS: Record<InstallDevice, readonly string[]> = {
  iphone: [
    'Öffne ANITEW in Safari.',
    'Tippe auf „Teilen“ und dann auf „Zum Home-Bildschirm“.',
    'Bestätige mit „Hinzufügen“ und öffne anschließend das neue ANITEW-Symbol.',
  ],
  android: [
    'Öffne das Browsermenü (meist ⋮ oben rechts).',
    'Wähle „App installieren“ oder „Zum Startbildschirm hinzufügen“.',
    'Bestätige und öffne ANITEW anschließend über das neue App-Symbol.',
  ],
  mac: [
    'In Chrome/Edge: nutze das Installationssymbol in der Adressleiste oder „App installieren“.',
    'In Safari: wähle „Ablage“ → „Zum Dock hinzufügen“.',
    'Öffne ANITEW danach über Dock, Programme oder Launchpad.',
  ],
  windows: [
    'Nutze das Installationssymbol in der Adressleiste oder das Browsermenü.',
    'Wähle „ANITEW installieren“ bzw. „App installieren“.',
    'Öffne ANITEW anschließend über das neue App-Symbol.',
  ],
}

function detectDevice(): InstallDevice {
  const ua = navigator.userAgent.toLowerCase()
  const ipad = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
  if (/iphone|ipad|ipod/.test(ua) || ipad) return 'iphone'
  if (ua.includes('android')) return 'android'
  if (ua.includes('mac')) return 'mac'
  return 'windows'
}

function writeBrowserContinuation(): void {
  try {
    window.sessionStorage.setItem('anitew.install-gate.continue.v1', '1')
  } catch {
    // Die bewusste Fortsetzung darf nicht an geblocktem sessionStorage scheitern.
  }
}

export function InstallGate({ onContinue }: { onContinue: () => void }) {
  const [device, setDevice] = useState<InstallDevice>(() => detectDevice())
  const [showSteps, setShowSteps] = useState(false)
  const [installed, setInstalled] = useState(false)
  const steps = useMemo(() => STEPS[device], [device])

  useEffect(() => {
    const onInstalled = () => {
      deferredPrompt = undefined
      setInstalled(true)
      setShowSteps(true)
    }
    window.addEventListener('appinstalled', onInstalled)
    return () => window.removeEventListener('appinstalled', onInstalled)
  }, [])

  const install = async () => {
    if (device !== 'iphone' && deferredPrompt !== undefined) {
      const prompt = deferredPrompt
      deferredPrompt = undefined
      await prompt.prompt()
      const choice = await prompt.userChoice
      if (choice.outcome === 'accepted') {
        setInstalled(true)
        setShowSteps(true)
        return
      }
    }
    setShowSteps(true)
  }

  const continueInBrowser = () => {
    writeBrowserContinuation()
    onContinue()
  }

  return (
    <main className="install-gate" aria-labelledby="install-gate-title">
      <section className="install-gate-card">
        <p className="install-gate-kicker">ANITEW · EINMAL EINRICHTEN</p>
        <h1 id="install-gate-title">ANITEW als App installieren</h1>
        <p className="install-gate-time">Meist weniger als eine Minute.</p>
        <p className="install-gate-lead">
          ANITEW ist für den App-Modus gebaut: eigener Start vom Home-Bildschirm, zuverlässiger
          Offline-Zugriff und weniger Browser-Reibung. Auf iPhone und iPad funktionieren
          geschlossene System-Push-Erinnerungen nur als installierte Web-App.
        </p>

        <label className="install-gate-device">
          <span>Dein Gerät</span>
          <select
            value={device}
            onChange={(event) => {
              setDevice(event.target.value as InstallDevice)
              setShowSteps(false)
              setInstalled(false)
            }}
          >
            {(Object.keys(DEVICE_LABELS) as InstallDevice[]).map((id) => (
              <option key={id} value={id}>
                {DEVICE_LABELS[id]}
              </option>
            ))}
          </select>
        </label>

        {showSteps && (
          <div className="install-gate-steps" role="status">
            <h2>{installed ? 'Installation gestartet' : `Installation auf ${DEVICE_LABELS[device]}`}</h2>
            {installed && (
              <p>
                Öffne ANITEW anschließend über das neue App-Symbol. Dort erscheint diese
                Installationsseite nicht mehr.
              </p>
            )}
            <ol>
              {steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        )}

        <div className="install-gate-actions">
          <button type="button" className="install-gate-primary" onClick={() => void install()}>
            App installieren
          </button>
          <button type="button" className="install-gate-secondary" onClick={continueInBrowser}>
            Nicht installieren, im Browser fortfahren
          </button>
        </div>

        <p className="install-gate-browser-note">
          Die Browser-Version wird erst mit dem zweiten Button freigegeben. In einer neuen
          Browser-Sitzung erinnert ANITEW erneut an die Installation; die installierte App sieht
          diese Seite nie.
        </p>

        <nav className="install-gate-legal" aria-label="Rechtliches">
          <a href="/impressum.html">Impressum</a>
          <span aria-hidden="true">·</span>
          <a href="/datenschutz.html">Datenschutz</a>
        </nav>
      </section>
    </main>
  )
}
