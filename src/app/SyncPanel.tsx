import { useEffect, useState } from 'react'

import { SyncError, type Platform, type SyncReport } from '../core/index.ts'
import { DriveError } from '../platform/web/drive.ts'
import type { Dictionary } from '../i18n/index.ts'

import { SYNC_AT_SETTING, SYNC_ON_SETTING, resolveClientId, runDriveSync } from './driveSync.ts'

type SyncFailureText = 'denied' | 'offline' | 'drive' | 'remote-invalid'

/**
 * Der Abgleich (N7/N8/N10 · D-033).
 *
 * Die Seite erklärt **vor** dem ersten Fingertipp, wohin die Daten gehen
 * (R-3, D-015): eigener Drive, eigener App-Ordner, kein Server dazwischen.
 * Ohne eingerichtete Client-Kennung sagt sie genau das — und nichts sieht
 * kaputt aus, denn Sicherung und Training hängen nicht daran.
 */
export function SyncPanel({ platform, dictionary }: { platform: Platform; dictionary: Dictionary }) {
  const texts = dictionary.sync

  const [clientId, setClientId] = useState<string | undefined>(undefined)
  const [checked, setChecked] = useState(false)
  const [auto, setAuto] = useState(false)
  const [lastAt, setLastAt] = useState<number | undefined>(undefined)
  const [busy, setBusy] = useState(false)
  const [report, setReport] = useState<SyncReport | undefined>(undefined)
  const [failure, setFailure] = useState<SyncFailureText | undefined>(undefined)

  useEffect(() => {
    void resolveClientId(platform.settings).then((id) => {
      setClientId(id)
      setChecked(true)
    })
    void platform.settings
      .read<boolean>(SYNC_ON_SETTING)
      .then((on) => setAuto(on === true))
      .catch(() => undefined)
    void platform.settings
      .read<number>(SYNC_AT_SETTING)
      .then(setLastAt)
      .catch(() => undefined)
  }, [platform])

  const sync = () => {
    if (clientId === undefined || busy) return
    setBusy(true)
    setFailure(undefined)
    setReport(undefined)
    const now = platform.clock.now()
    void runDriveSync(clientId, false, now)
      .then((result) => {
        setReport(result)
        setAuto(true)
        setLastAt(now)
        void platform.settings.write(SYNC_ON_SETTING, true).catch(() => undefined)
        void platform.settings.write(SYNC_AT_SETTING, now).catch(() => undefined)
      })
      .catch((error: unknown) => {
        if (error instanceof SyncError) setFailure(error.reason)
        else if (error instanceof DriveError) setFailure(error.reason)
        else setFailure('drive')
      })
      .finally(() => setBusy(false))
  }

  const stop = () => {
    setAuto(false)
    void platform.settings.write(SYNC_ON_SETTING, false).catch(() => undefined)
  }

  if (!checked) return null

  if (clientId === undefined) {
    return (
      <div className="sync">
        <p className="hint">{texts.intro}</p>
        <p className="sync-note">{texts.notConfigured}</p>
      </div>
    )
  }

  return (
    <div className="sync">
      <p className="hint">{texts.intro}</p>
      <p className="hint">{texts.how}</p>

      <button type="button" className="quiet sync-run" onClick={sync} disabled={busy}>
        {busy ? texts.running : auto ? texts.again : texts.start}
      </button>

      {report !== undefined && (
        <p className="sync-report">
          {!report.hadRemote
            ? texts.firstTime
            : report.pulled > 0
              ? texts.pulledSome.replace('{n}', String(report.pulled))
              : texts.pulledNone}
        </p>
      )}
      {failure !== undefined && <p className="sync-failure">{texts.errors[failure]}</p>}

      {lastAt !== undefined && (
        <p className="sync-note">
          {texts.lastAt} {new Date(lastAt).toLocaleString()}
        </p>
      )}
      {auto && (
        <>
          <p className="sync-note">{texts.autoNote}</p>
          <button type="button" className="quiet sync-stop" onClick={stop}>
            {texts.stop}
          </button>
        </>
      )}
    </div>
  )
}
