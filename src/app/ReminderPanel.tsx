import { useState } from 'react'

import { type Platform, type TimeOfDay, isTimeOfDay } from '../core/index.ts'
import { clearDailyTime, saveDailyTime } from '../data/reminders.ts'
import type { Dictionary } from '../i18n/index.ts'

import { Emphasis } from './Emphasis.tsx'

/**
 * Erinnerungen einstellen (Backlog B8 · D-022).
 *
 * Die Reihenfolge ist die Aussage: **Erst steht da, was dieses Gerät kann,
 * dann kommt die Einstellung.** Umgekehrt hätte der Nutzer eine Uhrzeit
 * gewählt und läse hinterher im Kleingedruckten, dass sie nicht gilt.
 *
 * Das Recht wird auch erst hier erfragt und nicht beim ersten Start. Wer eine
 * App öffnet und sofort nach Benachrichtigungen gefragt wird, lehnt ab — und
 * eine Ablehnung lässt sich von hier aus nie wieder zurücknehmen.
 */
export function ReminderPanel({
  platform,
  dictionary,
  daily,
  suggested,
  onChange,
}: {
  platform: Platform
  dictionary: Dictionary
  daily: TimeOfDay | undefined
  /**
   * Die Tageszeit aus dem Ankommen als Vorbelegung des Uhrzeitfelds — mehr
   * nicht. Eingeschaltet wird die Erinnerung weiterhin nur von Hand (D-015).
   */
  suggested?: TimeOfDay
  onChange: () => void
}) {
  const t = dictionary.reminder
  const [permission, setPermission] = useState(platform.reminders.permission())
  const [time, setTime] = useState<string>(daily ?? suggested ?? '19:30')
  const [said, setSaid] = useState<'saved' | 'cleared' | undefined>(undefined)

  const [loaded, setLoaded] = useState(daily)
  if (daily !== loaded) {
    setLoaded(daily)
    if (daily !== undefined) setTime(daily)
  }

  const ability = platform.reminders.ability()

  return (
    <div className="reminder">
      <p className="hint">{t.note}</p>

      {/* Was dieses Gerät kann — zuerst, und ohne Beschönigung. */}
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
                void saveDailyTime(time)
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
