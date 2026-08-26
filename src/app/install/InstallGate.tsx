import { useEffect, useMemo, useState } from 'react'

import './installGate.css'
import { type InstallDevice, installGateCopy } from './installGateCopy.ts'

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
  const copy = useMemo(installGateCopy, [])
  const [device, setDevice] = useState<InstallDevice>(() => detectDevice())
  const [showSteps, setShowSteps] = useState(false)
  const [installed, setInstalled] = useState(false)
  const steps = useMemo(() => copy.steps[device], [copy, device])

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
        <p className="install-gate-kicker">{copy.kicker}</p>
        <h1 id="install-gate-title">{copy.title}</h1>
        <p className="install-gate-time">{copy.time}</p>
        <p className="install-gate-lead">{copy.lead}</p>

        <label className="install-gate-device">
          <span>{copy.deviceLabel}</span>
          <select
            value={device}
            onChange={(event) => {
              setDevice(event.target.value as InstallDevice)
              setShowSteps(false)
              setInstalled(false)
            }}
          >
            {(Object.keys(copy.devices) as InstallDevice[]).map((id) => (
              <option key={id} value={id}>
                {copy.devices[id]}
              </option>
            ))}
          </select>
        </label>

        {showSteps && (
          <div className="install-gate-steps" role="status">
            <h2>{installed ? copy.startedHeading : copy.stepsHeadingFor(copy.devices[device])}</h2>
            {installed && <p>{copy.startedNote}</p>}
            <ol>
              {steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        )}

        <div className="install-gate-actions">
          <button type="button" className="install-gate-primary" onClick={() => void install()}>
            {copy.install}
          </button>
          <button type="button" className="install-gate-secondary" onClick={continueInBrowser}>
            {copy.continueInBrowser}
          </button>
        </div>

        <p className="install-gate-browser-note">{copy.browserNote}</p>

        <nav className="install-gate-legal" aria-label={copy.legalLabel}>
          <a href="/impressum.html">{copy.imprint}</a>
          <span aria-hidden="true">·</span>
          <a href="/datenschutz.html">{copy.privacy}</a>
        </nav>
      </section>
    </main>
  )
}
