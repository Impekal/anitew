export interface LocalDictationCopy {
  readonly start: string
  readonly listening: string
  readonly unavailable: string
  readonly failed: string
}

const DE: LocalDictationCopy = {
  start: 'Diktieren',
  listening: 'Sprich jetzt …',
  unavailable: 'Lokales Diktieren ist auf diesem Gerät nicht verfügbar.',
  failed: 'Nichts erkannt. Versuch es noch einmal.',
}

const EN: LocalDictationCopy = {
  start: 'Dictate',
  listening: 'Speak now …',
  unavailable: 'On-device dictation is not available on this device.',
  failed: 'Nothing recognised. Try again.',
}

/**
 * Visible copy follows the interface language, not the training language.
 * `useLanguage` owns the canonical document language. Untranslated interface
 * languages already fall back to the English dictionary, so they do the same
 * here instead of mixing an untranslated label into an English screen.
 */
export function localDictationCopyForCurrentUi(): LocalDictationCopy {
  return document.documentElement.lang === 'de' ? DE : EN
}
