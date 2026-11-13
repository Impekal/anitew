/**
 * Typen für den Seitenerzeuger der Rechtstexte.
 *
 * `privacy-page.mjs` ist absichtlich reines ESM ohne Bauschritt — es läuft vor
 * `vite build` und darf keine Übersetzung brauchen. Damit die Tests es
 * trotzdem **aufrufen** statt es zu lesen, steht seine Schnittstelle hier.
 */

export declare const LEGAL_LANGUAGES: readonly string[]

export declare function inline(text: string): string

export declare function render(markdown: string): string

export declare function legalPath(kind: 'imprint' | 'privacy', language: string): string

export declare function page(
  body: string,
  title?: string,
  language?: string,
  kind?: 'imprint' | 'privacy',
): string
