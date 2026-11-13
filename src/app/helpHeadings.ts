/**
 * Nur die drei Beschriftungen, die das Menü braucht (Nutzerwunsch 04.09.).
 *
 * Dieselbe Trennung wie bei „Geistig aktiv bleiben": Die Überschriften stehen
 * im Menü und im Seitenkopf, werden also im Kaltstart gebraucht — die
 * Hilfetexte und die Fragen und Antworten dagegen erst beim Öffnen der Seite
 * (`i18n/helpCopy.ts`, verzögert geladen). Drei kurze Wörter hier kosten
 * nichts; die vollen Texte hätten das Kaltstart-Budget gesprengt (P4).
 */
const HELP: Record<string, string> = {
  de: 'Hilfe',
  en: 'Help',
  fr: 'Aide',
  es: 'Ayuda',
  it: 'Aiuto',
  pt: 'Ajuda',
}

const FAQ: Record<string, string> = {
  de: 'Fragen & Antworten',
  en: 'Questions & answers',
  fr: 'Questions & réponses',
  es: 'Preguntas y respuestas',
  it: 'Domande e risposte',
  pt: 'Perguntas e respostas',
}

/** Die Überschrift der dritten Menügruppe, in der beide Seiten stehen. */
const UNDERSTAND: Record<string, string> = {
  de: 'Verstehen',
  en: 'Understanding',
  fr: 'Comprendre',
  es: 'Entender',
  it: 'Capire',
  pt: 'Compreender',
}

function pick(table: Record<string, string>, language: string): string {
  return table[(language || 'en').slice(0, 2).toLowerCase()] ?? (table.en as string)
}

export function helpHeading(language: string): string {
  return pick(HELP, language)
}

export function faqHeading(language: string): string {
  return pick(FAQ, language)
}

export function understandLabel(language: string): string {
  return pick(UNDERSTAND, language)
}
