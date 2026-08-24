export interface LocalPhotoCopy {
  readonly pick: string
  readonly replace: string
  readonly remove: string
  readonly note: string
  readonly alt: string
  readonly invalid: string
  readonly tooLarge: string
}

const de: LocalPhotoCopy = {
  pick: 'Foto als Vorlage',
  replace: 'Anderes Foto',
  remove: 'Foto entfernen',
  note: 'Das Foto bleibt nur für diese Ansicht auf diesem Gerät. ANITEW speichert, synchronisiert oder sendet es nicht.',
  alt: 'Ausgewähltes Foto als lokale Vorlage',
  invalid: 'Bitte wähle eine Bilddatei.',
  tooLarge: 'Das Foto ist zu groß. Wähle ein Bild bis 15 MB.',
}

const en: LocalPhotoCopy = {
  pick: 'Use photo as reference',
  replace: 'Choose another photo',
  remove: 'Remove photo',
  note: 'The photo stays only in this view on this device. ANITEW does not save, sync or send it.',
  alt: 'Selected photo as a local reference',
  invalid: 'Please choose an image file.',
  tooLarge: 'The photo is too large. Choose an image up to 15 MB.',
}

/**
 * The app currently has complete interface dictionaries for German and
 * English. Unsupported UI locales already fall back to English, so this
 * small I1 copy layer follows the same rule.
 */
export function localPhotoCopyForCurrentUi(): LocalPhotoCopy {
  return document.documentElement.lang === 'de' ? de : en
}
