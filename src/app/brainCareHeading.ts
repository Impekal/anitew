/**
 * Nur die Überschrift von „Geistig aktiv bleiben".
 *
 * Sie steht im Menü und im Seitenkopf und wird deshalb im Kaltstart
 * gebraucht — die Tipps, ihre Quellen und die Erklärtexte dagegen erst beim
 * Öffnen der Seite (`i18n/brainCareCopy.ts`, verzögert). Sechs kurze Wörter
 * hier zu halten kostet nichts; zwei Kilobyte Tipps hätten das
 * Kaltstart-Budget gesprengt (P4).
 */
const HEADING: Record<string, string> = {
  de: 'Geistig aktiv bleiben',
  en: 'Staying mentally active',
  fr: 'Rester actif mentalement',
  es: 'Mantenerse mentalmente activo',
  it: 'Restare mentalmente attivi',
  pt: 'Manter-se mentalmente ativo',
}

export function brainCareHeading(language: string): string {
  return HEADING[(language || 'en').slice(0, 2).toLowerCase()] ?? HEADING.en as string
}
