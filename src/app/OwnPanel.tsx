import { useCallback, useEffect, useRef, useState } from 'react'

import { type OwnFact, factPrompt, parseOwnText } from '../core/index.ts'
import { addOwnFacts, loadOwnFacts, loadOwnPool, removeOwnFact } from '../data/own.ts'
import type { Dictionary } from '../i18n/index.ts'
import { dictateLocally } from '../platform/web/localDictation.ts'
import { localDictationCopyForCurrentUi } from './localDictationCopy.ts'
import { localPhotoCopyForCurrentUi } from './localPhotoCopy.ts'
import './ownPhoto.css'

const MAX_LOCAL_PHOTO_BYTES = 15 * 1024 * 1024

interface LocalPhoto {
  readonly name: string
  readonly url: string
}

/**
 * Eigene Inhalte (Backlog I · D-032).
 *
 * Einfügen, ansehen, übernehmen: Die Vorschau zeigt live, welche Zeilen
 * Karten würden — und welche nicht, sichtbar statt verschluckt. Übernommen
 * wird erst auf Fingertipp (I4), gespeichert nur auf diesem Gerät (I6).
 * Jede Karte sagt dazu, wo sie steht: schon im Wiederholungsplan oder noch
 * auf dem Weg in die nächste Einheit.
 *
 * Ein Foto ist absichtlich nur eine lokale Arbeitsvorlage: Es lebt als
 * Objekt-URL im Arbeitsspeicher dieser Ansicht, nicht in IndexedDB. Damit
 * kann der Mensch Text daraus tippen oder lokal diktieren, ohne dass ANITEW
 * das Bild speichert, synchronisiert oder an einen Dienst sendet. Echte
 * Foto-Extraktion gehört in den bestätigungspflichtigen MEMORY MODE (I3),
 * nicht als stiller OCR-Fallback hier hinein.
 */
export function OwnPanel({ language, dictionary }: { language: string; dictionary: Dictionary }) {
  const texts = dictionary.own
  const dictationTexts = localDictationCopyForCurrentUi()
  const photoTexts = localPhotoCopyForCurrentUi()
  const photoInput = useRef<HTMLInputElement>(null)

  const [draft, setDraft] = useState('')
  const [stored, setStored] = useState<readonly OwnFact[]>([])
  const [fresh, setFresh] = useState<ReadonlySet<string>>(new Set())
  const [dictationState, setDictationState] = useState<
    'idle' | 'listening' | 'unavailable' | 'failed'
  >('idle')
  const [photo, setPhoto] = useState<LocalPhoto | null>(null)
  const [photoError, setPhotoError] = useState<string | undefined>()

  const reload = useCallback(() => {
    void loadOwnFacts(language)
      .then(setStored)
      .catch(() => undefined)
    void loadOwnPool(language)
      .then((pool) => setFresh(new Set(pool.map(factPrompt))))
      .catch(() => undefined)
  }, [language])

  useEffect(() => {
    reload()
  }, [reload])

  useEffect(
    () => () => {
      if (photo !== null) URL.revokeObjectURL(photo.url)
    },
    [photo],
  )

  const parsed = parseOwnText(draft)

  const save = () => {
    if (parsed.facts.length === 0) return
    void addOwnFacts(language, parsed.facts)
      .then(() => {
        setDraft('')
        reload()
      })
      .catch(() => undefined)
  }

  const remove = (prompt: string) => {
    void removeOwnFact(language, prompt)
      .then(reload)
      .catch(() => undefined)
  }

  const dictate = () => {
    if (dictationState === 'listening') return
    setDictationState('listening')
    void dictateLocally(language)
      .then((result) => {
        if (result.status === 'ok') {
          setDraft((current) => {
            const separator = current.trim() === '' ? '' : current.endsWith('\n') ? '' : '\n'
            return `${current}${separator}${result.text}`
          })
          setDictationState('idle')
          return
        }
        setDictationState(result.status)
      })
      .catch(() => setDictationState('failed'))
  }

  const choosePhoto = (file: File | undefined) => {
    if (file === undefined) return
    if (!file.type.startsWith('image/')) {
      setPhotoError(photoTexts.invalid)
      return
    }
    if (file.size > MAX_LOCAL_PHOTO_BYTES) {
      setPhotoError(photoTexts.tooLarge)
      return
    }
    setPhotoError(undefined)
    setPhoto({ name: file.name, url: URL.createObjectURL(file) })
  }

  const clearPhoto = () => {
    setPhoto(null)
    setPhotoError(undefined)
  }

  const dictationStatus =
    dictationState === 'listening'
      ? dictationTexts.listening
      : dictationState === 'unavailable'
        ? dictationTexts.unavailable
        : dictationState === 'failed'
          ? dictationTexts.failed
          : undefined

  return (
    <div className="own">
      <p className="hint">{texts.intro}</p>

      <textarea
        className="own-input"
        rows={5}
        placeholder={texts.placeholder}
        value={draft}
        onChange={(event) => {
          setDraft(event.target.value)
          if (dictationState !== 'listening') setDictationState('idle')
        }}
      />

      <div className="own-source-actions">
        <button
          type="button"
          className="quiet own-dictate"
          onClick={dictate}
          disabled={dictationState === 'listening'}
        >
          {dictationState === 'listening' ? dictationTexts.listening : dictationTexts.start}
        </button>
        <button
          type="button"
          className="quiet own-photo-pick"
          onClick={() => photoInput.current?.click()}
        >
          {photo === null ? photoTexts.pick : photoTexts.replace}
        </button>
        <input
          ref={photoInput}
          className="own-photo-input"
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0]
            event.target.value = ''
            choosePhoto(file)
          }}
        />
      </div>

      {dictationStatus !== undefined && dictationState !== 'listening' && (
        <p className="hint own-dictation-status" role="status" aria-live="polite">
          {dictationStatus}
        </p>
      )}

      {photoError !== undefined && (
        <p className="own-photo-error" role="status" aria-live="polite">
          {photoError}
        </p>
      )}

      {photo !== null && (
        <figure className="own-photo-preview">
          <img src={photo.url} alt={`${photoTexts.alt}: ${photo.name}`} />
          <figcaption className="own-photo-caption">
            <p className="own-photo-note">{photoTexts.note}</p>
            <button type="button" className="quiet own-photo-remove" onClick={clearPhoto}>
              {photoTexts.remove}
            </button>
          </figcaption>
        </figure>
      )}

      {parsed.facts.length > 0 && (
        <section aria-label={texts.preview}>
          <h3 className="coach-source">{texts.preview}</h3>
          <ul className="own-preview">
            {parsed.facts.map((fact) => (
              <li key={fact.prompt}>
                {fact.prompt} · {fact.answer}
              </li>
            ))}
          </ul>
          <button type="button" className="quiet own-save" onClick={save}>
            {texts.save}
          </button>
        </section>
      )}

      {parsed.rejected.length > 0 && (
        <section aria-label={texts.rejected}>
          <h3 className="coach-source">{texts.rejected}</h3>
          <ul className="own-rejected">
            {parsed.rejected.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      )}

      <section aria-label={texts.listHeading}>
        <h3 className="coach-source">{texts.listHeading}</h3>
        {stored.length === 0 && <p className="hint">{texts.empty}</p>}
        {stored.length > 0 && (
          <ul className="own-list">
            {stored.map((fact) => (
              <li key={fact.prompt} className="own-card">
                <span className="own-card-text">
                  {fact.prompt} · {fact.answer}
                  <span className="own-card-state">
                    {fresh.has(fact.prompt) ? texts.fresh : texts.scheduled}
                  </span>
                </span>
                <button type="button" className="quiet" onClick={() => remove(fact.prompt)}>
                  {texts.remove}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
