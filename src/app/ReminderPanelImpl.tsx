import { useRef, useState } from 'react'

import {
  DAILY_REMINDER_ID,
  type Platform,
  type TimeOfDay,
  isTimeOfDay,
} from '../core/index.ts'
import { clearDailyTime, saveDailyTime } from '../data/reminders.ts'
import type { Dictionary } from '../i18n/index.ts'

import { Emphasis } from './Emphasis.tsx'

export function ReminderPanelImpl({
  platform,
  dictionary,
  daily,
  suggested,
  onChange,
}: {
  platform: Platform
  dictionary: Dictionary
  daily: TimeOfDay | undefined
  suggested?: TimeOfDay
  onChange: () => void
}) {
  const t = dictionary.reminder
  const [permission, setPermission] = useState(platform.reminders.permission())
  const initialTime = daily ?? suggested ?? '19:30'
  const [time, setTime] = useState<string>(initialTime)
  /*
   * `input[type=time]` kann seinen DOM-Wert schon geändert haben, während ein
   * unmittelbar folgender Klick noch den React-State aus dem vorherigen Render
   * sieht. Die Ref wird im Eingabe-Event synchron gesetzt und ist deshalb die
   * verlässliche Quelle für „Erinnerung merken“ — auch bei sehr schnellem Tap
   * oder automatisierten Browsern.
   */
  const latestTime = useRef<string>(initialTime)
  const [said, setSaid] = useState<'saved' | 'cleared' | undefined>(undefined)

  const [loaded, setLoaded] = useState(daily)
  if (daily !== loaded) {
    setLoaded(daily)
    if (daily !== undefined) {
      latestTime.current = daily
      setTime(daily)
    }
  }

  const ability = platform.reminders.ability()

  return (
    <div className="reminder">
      <p className="hint">{t.note}</p>
      <p className="hint">
        <Emphasis
          text={
            permission === 'denied'
              ? t.denied
              : ability === 'scheduled'
                ? t.scheduled
                : ability === 'whileOpen'
                  ? t.whileOpen
                  : t.none
          }
        />
      </p>

      {permission === 'unasked' && (
        <div className="note-actions">
          <button
            type="button"
            className="quiet"
            onClick={() => {
              void platform.reminders
                .ask()
                .then(setPermission)
                .catch(() => undefined)
            }}
          >
            {t.ask}
          </button>
        </div>
      )}

      {permission === 'granted' && (
        <>
          <label className="own-field">
            <span>{t.time}</span>
            <input
              type="time"
              value={time}
              onChange={(event) => {
                const next = event.target.value
                latestTime.current = next
                setTime(next)
                setSaid(undefined)
              }}
            />
          </label>

          <div className="note-actions">
            <button
              type="button"
              className="quiet"
              disabled={!isTimeOfDay(time)}
              onClick={() => {
                const chosen = latestTime.current
                if (!isTimeOfDay(chosen)) return
                void saveDailyTime(chosen)
                  .then((ok) => setSaid(ok ? 'saved' : undefined))
                  .catch(() => undefined)
                  .finally(onChange)
              }}
            >
              {t.save}
            </button>
            {daily !== undefined && (
              <button
                type="button"
                className="quiet"
                onClick={() => {
                  void clearDailyTime()
                    .then(() => platform.reminders.cancel(DAILY_REMINDER_ID, true))
                    .catch(() => undefined)
                    .finally(onChange)
                  setSaid('cleared')
                }}
              >
                {t.off}
              </button>
            )}
          </div>

          {said !== undefined && <p className="hint">{said === 'saved' ? t.saved : t.cleared}</p>}
        </>
      )}
    </div>
  )
}
