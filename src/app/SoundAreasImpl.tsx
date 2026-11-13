import '../anitew-sound-areas.css'

import type { SoundCategory } from '../core/sound/categories.ts'
import type { Dictionary } from '../i18n/index.ts'

import type { useSoundSetting } from './useSoundSetting.ts'

/**
 * Die drei Ton-Bereiche einzeln (Gerätewunsch 31.08.: „Töne nach individuellen
 * Bereichen aktivierbar oder alle auf einmal").
 *
 * Der Inhalt steht in einer eigenen, verzögert geladenen Datei: Er ist nur
 * sichtbar, wenn jemand die Einstellungen öffnet und den Ton anhat — im
 * Kaltstart hätte er nichts zu suchen (P4). Das ist keine gekürzte Funktion,
 * nur eine verschobene Ladezeit.
 */
export function SoundAreas({
  dictionary,
  sound,
}: {
  dictionary: Dictionary
  sound: ReturnType<typeof useSoundSetting>
}) {
  const areas: readonly (readonly [SoundCategory, string, string])[] = [
    ['feedback', dictionary.sound.feedback, dictionary.sound.feedbackNote],
    ['arrival', dictionary.sound.arrival, dictionary.sound.arrivalNote],
    ['focus', dictionary.sound.focus, dictionary.sound.focusNote],
  ]

  return (
    <div className="sound-areas">
      <p className="sound-areas-label">{dictionary.sound.heading}</p>
      {areas.map(([area, label, note]) => (
        <button
          key={area}
          type="button"
          className={`quiet sound-area sound-area-${area}`}
          onClick={() => sound.toggleCategory(area)}
          aria-pressed={sound.categories[area]}
        >
          <span aria-hidden="true">{sound.categories[area] ? '♪' : '·'}</span>
          <span className="sound-area-text">
            <span className="sound-area-name">{label}</span>
            <span className="hint">{note}</span>
          </span>
        </button>
      ))}
      {/*
        Die ehrliche Zeile (R-1): Der Klang ist angenehm gemeint, aber die App
        misst keinen Konzentrationseffekt und verspricht keinen.
      */}
      <p className="hint">{dictionary.sound.honest}</p>
    </div>
  )
}
