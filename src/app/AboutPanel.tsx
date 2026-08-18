import { useState } from 'react'

import {
  AGE_BANDS,
  type AgeBand,
  DAY_PARTS,
  type DayPart,
  GOALS,
  type Goal,
  type OnboardingProfile,
  TRAINING_MODES,
  type TrainingMode,
  sanitizeName,
} from '../core/index.ts'
import type { Dictionary } from '../i18n/index.ts'

/**
 * „Über dich“ — die Antworten aus dem Ankommen, jederzeit änderbar (und
 * jederzeit leerbar: die leere Auswahl ist überall die erste Option, kein
 * verstecktes Sonderkommando). Jede Änderung wird sofort gespeichert; ein
 * eigener Speichern-Knopf wäre nur ein zweiter Ort, an dem etwas schiefgehen
 * kann.
 */
export function AboutPanel({
  dictionary,
  profile,
  onSave,
}: {
  dictionary: Dictionary
  profile: OnboardingProfile
  onSave: (profile: OnboardingProfile) => void
}) {
  const texts = dictionary.onboarding
  // Der Name wird erst beim Verlassen des Felds übernommen — sonst würde
  // jede getippte Taste sofort gespeichert und mitten im Wort bereinigt.
  const [name, setName] = useState(profile.name ?? '')

  const commitName = () => {
    const cleaned = sanitizeName(name)
    setName(cleaned ?? '')
    onSave({ ...profile, name: cleaned })
  }

  /** Auswahl übernehmen — die leere Option löscht die Antwort. */
  const pick = <Key extends keyof OnboardingProfile>(
    key: Key,
    value: OnboardingProfile[Key] | undefined,
  ) => {
    onSave({ ...profile, [key]: value })
  }

  return (
    <div className="about">
      <p className="hint">{texts.editNote}</p>

      <label className="about-field">
        <span>{texts.nameQuestion}</span>
        <input
          className="about-name"
          type="text"
          value={name}
          placeholder={texts.namePlaceholder}
          autoComplete="off"
          onChange={(event) => setName(event.target.value)}
          onBlur={commitName}
          onKeyDown={(event) => {
            if (event.key === 'Enter') commitName()
          }}
        />
      </label>

      <label className="about-field">
        <span>{texts.goalQuestion}</span>
        <select
          value={profile.goal ?? ''}
          onChange={(event) =>
            pick('goal', event.target.value === '' ? undefined : (event.target.value as Goal))
          }
        >
          <option value="">{texts.unanswered}</option>
          {GOALS.map((goal) => (
            <option key={goal} value={goal}>
              {texts.goals[goal]}
            </option>
          ))}
        </select>
      </label>

      <label className="about-field">
        <span>{texts.timeQuestion}</span>
        <select
          value={profile.mode ?? ''}
          onChange={(event) =>
            pick(
              'mode',
              event.target.value === '' ? undefined : (event.target.value as TrainingMode),
            )
          }
        >
          <option value="">{texts.unanswered}</option>
          {TRAINING_MODES.map((mode) => (
            <option key={mode} value={mode}>
              {dictionary.start.modes[mode]}
            </option>
          ))}
        </select>
      </label>

      <label className="about-field">
        <span>{texts.dayQuestion}</span>
        <select
          value={profile.dayPart ?? ''}
          onChange={(event) =>
            pick('dayPart', event.target.value === '' ? undefined : (event.target.value as DayPart))
          }
        >
          <option value="">{texts.unanswered}</option>
          {DAY_PARTS.map((dayPart) => (
            <option key={dayPart} value={dayPart}>
              {texts.dayParts[dayPart]}
            </option>
          ))}
        </select>
      </label>

      <label className="about-field">
        <span>{texts.ageQuestion}</span>
        <select
          value={profile.ageBand ?? ''}
          onChange={(event) =>
            pick('ageBand', event.target.value === '' ? undefined : (event.target.value as AgeBand))
          }
        >
          <option value="">{texts.unanswered}</option>
          {AGE_BANDS.map((ageBand) => (
            <option key={ageBand} value={ageBand}>
              {texts.ageBands[ageBand]}
            </option>
          ))}
        </select>
      </label>
      <p className="hint">{texts.ageNote}</p>
    </div>
  )
}
