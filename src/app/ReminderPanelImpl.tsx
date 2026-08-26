import { useState } from 'react'

import {
  DAILY_REMINDER_ID,
  type Platform,
  type TimeOfDay,
  isTimeOfDay,
  nextDailyAt,
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
  const [time, setTime] = useState<string>(daily ?? suggested ?? '19:30')
  const [said, setSaid] = useState<'saved' | 'cleared' | 'failed' | undefined>(undefined)

  const [loaded, setLoaded] = useState(daily)
  if (daily !== loaded) {
    setLoaded(daily)
    if (daily !== undefined) setTime(daily)
  }

  const ability = platform.reminders.ability()

  return (
    <div className="reminder">
      {/* Bei echtem Web Push liegt die technische Push-Adresse samt Termin
          notwendigerweise beim Pushdienst/Worker. Der alte Satz „ohne Server,
          bleibt auf dem Gerät“ gilt nur für den lokalen while-open-Fallback
          und darf deshalb nicht neben einer Closed-App-Push-Zusage stehen. */}
      {ability !== 'scheduled' && <p className="hint">{t.note}</p>}
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
                setTime(event.target.value)
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
                if (!isTimeOfDay(time)) return
                setSaid(undefined)
                void (async () => {
                  const stored = await saveDailyTime(time)
                  if (!stored) return false

                  // Der Fingertipp plant den Termin selbst und wartet auf die
                  // Antwort der Plattform. Das verhindert den alten Zustand,
                  // in dem IndexedDB bereits „Gemerkt.“ meldete, während ein
                  // kaputter Pushpfad erst in einem separaten Effect scheiterte.
                  const now = platform.clock.now()
                  const at = nextDailyAt(time, now, platform.clock.offsetMinutes(now))
                  return platform.reminders.schedule({
                    id: DAILY_REMINDER_ID,
                    at,
                    title: t.dailyTitle,
                    body: t.dailyBody,
                  })
                })()
                  .then((scheduled) => setSaid(scheduled ? 'saved' : 'failed'))
                  .catch(() => setSaid('failed'))
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

          {said !== undefined && (
            <p className="hint" role="status" aria-live="polite">
              {said === 'saved' ? (
                t.saved
              ) : said === 'cleared' ? (
                t.cleared
              ) : (
                <Emphasis text={t.whileOpen} />
              )}
            </p>
          )}
        </>
      )}
    </div>
  )
}
