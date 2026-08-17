/**
 * Welche Sprache spricht die App?
 *
 * D-007: Beim ersten Start übernimmt ANITEW die Systemsprache des Geräts,
 * sofern wir sie haben — sonst Englisch. Eine eigene Wahl des Nutzers hat
 * immer Vorrang und wird nie stillschweigend überschrieben.
 *
 * Die Regel steht hier im Kern und nicht in der Oberfläche, weil sie eine
 * Entscheidung ist und keine Darstellung: Sie ist prüfbar, ohne dass ein
 * Browser mit einer bestimmten Spracheinstellung gestartet werden muss.
 */

/** Die Sprachen aus Backlog L2. Übersetzt sind bisher nur `de` und `en`. */
export const SUPPORTED_LANGUAGES = [
  'de',
  'en',
  'fr',
  'es',
  'it',
  'pt',
  'nl',
  'tr',
  'ar',
  'zh',
  'ja',
] as const

export type Language = (typeof SUPPORTED_LANGUAGES)[number]

/** Wenn wir die Systemsprache nicht anbieten, ist Englisch die breiteste Wahl. */
export const FALLBACK_LANGUAGE: Language = 'en'

/** Sprachen, die von rechts nach links gesetzt werden (Backlog L3). */
const RIGHT_TO_LEFT: ReadonlySet<string> = new Set(['ar'])

export function isRightToLeft(language: Language): boolean {
  return RIGHT_TO_LEFT.has(language)
}

export function isSupported(tag: string): tag is Language {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(tag)
}

/**
 * Findet zu einem BCP-47-Etikett die passende unterstützte Sprache.
 * `de-AT` → `de`, `zh-Hant-TW` → `zh`, `pt-BR` → `pt`. Unbekanntes → undefined.
 */
export function matchLanguage(tag: string): Language | undefined {
  const base = tag.trim().toLowerCase().split(/[-_]/)[0]
  if (base === undefined || base === '') return undefined
  return isSupported(base) ? base : undefined
}

/**
 * Die Sprache, in der die App laufen soll.
 *
 * @param chosen  Was der Nutzer selbst eingestellt hat, falls überhaupt.
 * @param system  Die Sprachwünsche des Geräts, in absteigender Vorliebe
 *                (im Browser `navigator.languages`).
 */
export function resolveLanguage(
  chosen: string | undefined,
  system: readonly string[] = [],
): Language {
  if (chosen !== undefined) {
    const explicit = matchLanguage(chosen)
    // Eine ausdrückliche Wahl, die wir nicht anbieten, ist ein Fehler in den
    // gespeicherten Daten — dann lieber das System fragen als stumm scheitern.
    if (explicit !== undefined) return explicit
  }
  for (const tag of system) {
    const match = matchLanguage(tag)
    if (match !== undefined) return match
  }
  return FALLBACK_LANGUAGE
}
