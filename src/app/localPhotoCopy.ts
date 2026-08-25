export interface LocalPhotoCopy {
  readonly pick: string
  readonly replace: string
  readonly remove: string
  readonly note: string
  readonly alt: string
  readonly invalid: string
  readonly tooLarge: string
  readonly analyze: string
  readonly analyzing: string
  readonly analyzeNote: string
  readonly noKey: string
  readonly unsupportedProvider: string
  readonly unsupportedImage: string
  readonly empty: string
  readonly ready: string
}

const de: LocalPhotoCopy = {
  pick: 'Foto als Vorlage',
  replace: 'Anderes Foto',
  remove: 'Foto entfernen',
  note: 'Das Foto bleibt nur für diese Ansicht auf diesem Gerät. ANITEW speichert oder synchronisiert es nicht.',
  alt: 'Ausgewähltes Foto als lokale Vorlage',
  invalid: 'Bitte wähle eine Bilddatei.',
  tooLarge: 'Das Foto ist zu groß. Wähle ein Bild bis 15 MB.',
  analyze: 'Foto auswerten',
  analyzing: 'Foto wird ausgewertet …',
  analyzeNote:
    'Nur wenn du „Foto auswerten“ drückst, sendet ANITEW eine verkleinerte Kopie ohne Dateimetadaten direkt an deinen gewählten KI-Anbieter. Erst deine spätere Bestätigung speichert Erinnerungen.',
  noKey: 'Für die Foto-Auswertung fehlt ein eigener KI-Schlüssel. Du kannst das Foto weiterhin lokal als Vorlage nutzen.',
  unsupportedProvider:
    'Der aktuell gewählte KI-Anbieter ist für Foto-Auswertung nicht freigeschaltet. Wähle Gemini, Anthropic oder OpenAI — oder nutze das Foto lokal als Vorlage.',
  unsupportedImage: 'Dieses Bild kann auf diesem Gerät nicht sicher für die Auswertung vorbereitet werden.',
  empty: 'Im Foto wurden keine sicheren, merkenswerten Informationen gefunden.',
  ready: 'Vorschläge aus dem Foto sind bereit. Prüfe sie unten und bestätige nur, was wirklich stimmt.',
}

const en: LocalPhotoCopy = {
  pick: 'Use photo as reference',
  replace: 'Choose another photo',
  remove: 'Remove photo',
  note: 'The photo stays only in this view on this device. ANITEW does not save or sync it.',
  alt: 'Selected photo as a local reference',
  invalid: 'Please choose an image file.',
  tooLarge: 'The photo is too large. Choose an image up to 15 MB.',
  analyze: 'Analyze photo',
  analyzing: 'Analyzing photo …',
  analyzeNote:
    'Only when you press “Analyze photo” does ANITEW send a reduced copy without file metadata directly to your selected AI provider. Nothing becomes a memory until you confirm it afterwards.',
  noKey: 'Photo analysis needs your own AI key. You can still use the photo locally as a reference.',
  unsupportedProvider:
    'The selected AI provider is not enabled for photo analysis. Choose Gemini, Anthropic or OpenAI — or keep using the photo locally as a reference.',
  unsupportedImage: 'This image cannot be prepared safely for analysis on this device.',
  empty: 'No reliable, memorable information was found in the photo.',
  ready: 'Suggestions from the photo are ready. Review them below and confirm only what is correct.',
}

/**
 * The app currently has complete interface dictionaries for German and
 * English. Unsupported UI locales already fall back to English, so this
 * small I1 copy layer follows the same rule.
 */
export function localPhotoCopyForCurrentUi(): LocalPhotoCopy {
  return document.documentElement.lang === 'de' ? de : en
}
