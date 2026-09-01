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

const FR: LocalDictationCopy = {
  start: 'Dicter',
  listening: 'Parle maintenant …',
  unavailable: 'La dictée locale n’est pas disponible sur cet appareil.',
  failed: 'Rien reconnu. Réessaie.',
}

const ES: LocalDictationCopy = {
  start: 'Dictar',
  listening: 'Habla ahora …',
  unavailable: 'El dictado local no está disponible en este dispositivo.',
  failed: 'No se reconoció nada. Inténtalo otra vez.',
}

const IT: LocalDictationCopy = {
  start: 'Dettare',
  listening: 'Parla adesso …',
  unavailable: 'La dettatura locale non è disponibile su questo dispositivo.',
  failed: 'Non è stato riconosciuto nulla. Riprova.',
}

const PT: LocalDictationCopy = {
  start: 'Ditar',
  listening: 'Fala agora …',
  unavailable: 'O ditado local não está disponível neste aparelho.',
  failed: 'Não se reconheceu nada. Tenta outra vez.',
}

const COPY: Record<string, LocalDictationCopy> = { de: DE, en: EN, fr: FR, es: ES, it: IT, pt: PT }

/**
 * Der sichtbare Text folgt der Oberflächensprache, nicht der Trainingssprache;
 * `useLanguage` besitzt die maßgebliche Dokumentsprache.
 *
 * Hier stand `lang === 'de' ? DE : EN` mit der Begründung, nicht übersetzte
 * Oberflächensprachen fielen ohnehin auf das englische Wörterbuch zurück. Das
 * galt einmal — seit den sechs App-Sprachen fiel damit ein französisches Gerät
 * an genau dieser Stelle auf Englisch. Deutsch bleibt der Rückfall (D-007).
 */
export function localDictationCopyFor(language: string): LocalDictationCopy {
  return COPY[language.toLowerCase().slice(0, 2)] ?? DE
}

export function localDictationCopyForCurrentUi(): LocalDictationCopy {
  return localDictationCopyFor(document.documentElement.lang)
}
