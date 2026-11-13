import type { DayKey } from '../core/index.ts'

export interface MemoryDeadlineCopy {
  readonly label: string
  readonly hint: string
  readonly inferred: string
  readonly invalid: string
  readonly past: string
  readonly detailLabel: string
  readonly planBefore: string
}

const de: MemoryDeadlineCopy = {
  label: 'Brauche ich bis',
  hint: 'Optional. ANITEW legt zusätzliche Wiederholungen davor — nie am Zieltag oder danach.',
  inferred: 'Aus deinem Text vorgeschlagen. Bitte prüfe den Zeitpunkt vor dem Bestätigen.',
  invalid: 'Bitte wähle einen gültigen Zeitpunkt.',
  past: 'Der Zeitpunkt muss in der Zukunft liegen.',
  detailLabel: 'Gebraucht bis',
  planBefore: 'Wiederholungen nur vor diesem Termin',
}

const en: MemoryDeadlineCopy = {
  label: 'I need this by',
  hint: 'Optional. ANITEW places extra reviews before it — never on the target day or afterwards.',
  inferred: 'Suggested from your text. Please check the time before confirming.',
  invalid: 'Please choose a valid date and time.',
  past: 'The time must be in the future.',
  detailLabel: 'Needed by',
  planBefore: 'Reviews only before this deadline',
}

export interface ParsedMemoryDeadline {
  readonly at: number
  readonly day: DayKey
}

const fr: MemoryDeadlineCopy = {
  label: 'J’en ai besoin pour le',
  hint: 'Facultatif. ANITEW place des révisions supplémentaires avant cette date — jamais le jour même ni après.',
  inferred: 'Proposé d’après ton texte. Vérifie l’heure avant de confirmer.',
  invalid: 'Choisis une date et une heure valides.',
  past: 'Le moment doit être dans le futur.',
  detailLabel: 'Nécessaire pour le',
  planBefore: 'Révisions uniquement avant cette échéance',
}

const es: MemoryDeadlineCopy = {
  label: 'Lo necesito para el',
  hint: 'Opcional. ANITEW coloca repasos adicionales antes de esa fecha, nunca el mismo día ni después.',
  inferred: 'Propuesto a partir de tu texto. Comprueba la hora antes de confirmar.',
  invalid: 'Elige una fecha y una hora válidas.',
  past: 'El momento debe estar en el futuro.',
  detailLabel: 'Necesario para el',
  planBefore: 'Repasos solo antes de esta fecha límite',
}

const it: MemoryDeadlineCopy = {
  label: 'Mi serve entro il',
  hint: 'Facoltativo. ANITEW colloca ripassi aggiuntivi prima di quella data — mai il giorno stesso né dopo.',
  inferred: 'Proposto dal tuo testo. Controlla l’ora prima di confermare.',
  invalid: 'Scegli una data e un’ora valide.',
  past: 'Il momento deve essere nel futuro.',
  detailLabel: 'Necessario entro il',
  planBefore: 'Ripassi solo prima di questa scadenza',
}

const pt: MemoryDeadlineCopy = {
  label: 'Preciso disto até',
  hint: 'Facultativo. A ANITEW coloca revisões adicionais antes dessa data — nunca no próprio dia nem depois.',
  inferred: 'Proposto a partir do teu texto. Verifica a hora antes de confirmar.',
  invalid: 'Escolhe uma data e uma hora válidas.',
  past: 'O momento tem de estar no futuro.',
  detailLabel: 'Necessário até',
  planBefore: 'Revisões só antes deste prazo',
}

const COPY: Record<string, MemoryDeadlineCopy> = { de, en, fr, es, it, pt }

/**
 * Hier stand `lang === 'de' ? de : en` mit dem Kommentar „complete interface
 * dictionaries currently exist for DE/EN". Das galt einmal; seit den sechs
 * App-Sprachen sah ein französisches Gerät hier Englisch. Deutsch bleibt der
 * Rückfall (D-007).
 */
export function memoryDeadlineCopyFor(language: string): MemoryDeadlineCopy {
  return COPY[language.toLowerCase().slice(0, 2)] ?? de
}

export function memoryDeadlineCopyForCurrentUi(): MemoryDeadlineCopy {
  return memoryDeadlineCopyFor(document.documentElement.lang)
}

/** `datetime-local` is deliberately interpreted in the device's current local timezone (P6). */
export function parseMemoryDeadline(value: string): ParsedMemoryDeadline | undefined {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/u.test(value)) return undefined
  const at = new Date(value).getTime()
  if (!Number.isFinite(at)) return undefined
  return { at, day: value.slice(0, 10) as DayKey }
}

function localDateTimeValue(date: Date): string {
  const year = date.getFullYear().toString().padStart(4, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hour = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')
  return `${year}-${month}-${day}T${hour}:${minute}`
}

function tomorrowAt(now: number, hour: number, minute: number): string {
  const date = new Date(now)
  date.setDate(date.getDate() + 1)
  date.setHours(hour, minute, 0, 0)
  return localDateTimeValue(date)
}

/**
 * Conservative local inference for the concrete I5 use case. We do not parse
 * arbitrary dates or infer a time that the person did not say. Ambiguous text
 * therefore leaves the field empty and lets the person choose manually.
 */
export function inferMemoryDeadlineInput(text: string, now: number): string | undefined {
  /*
   * Nur wo ein Muster wirklich existiert.
   *
   * Vorher galt: alles außer Deutsch wird nach dem englischen Muster gelesen.
   * Für eine französische Oberfläche hieß das, ein englischer Satz würde
   * erkannt und ein französischer nicht — eine Regel, die niemand erwartet.
   *
   * Für fr/es/it/pt gibt es hier **absichtlich** kein Muster: Diese Funktion
   * rät bewusst nicht (siehe oben). Wo nichts erkannt wird, bleibt das Feld
   * leer und der Mensch wählt selbst — das ist der ehrlichere Ausgang als eine
   * geratene Uhrzeit. Kommen später Muster dazu, gehören sie hierher.
   */
  const patterns: Record<string, RegExp> = {
    de: /\bmorgen\s+(?:um\s+)?([01]?\d|2[0-3])(?:[:.]([0-5]\d))?(?:\s*uhr)?\b/iu,
    en: /\btomorrow\s+(?:at\s+)?([01]?\d|2[0-3])(?::([0-5]\d))?(?:\s*(?:am|pm))?\b/iu,
  }
  const locale = document.documentElement.lang.toLowerCase().slice(0, 2)
  const pattern = patterns[locale]
  if (pattern === undefined) return undefined
  const match = pattern.exec(text)
  if (match === null) return undefined

  let hour = Number(match[1])
  const minute = Number(match[2] ?? 0)
  if (locale === 'en') {
    const suffix = match[0].match(/\b(am|pm)\b/iu)?.[1]?.toLocaleLowerCase()
    if (suffix === 'pm' && hour < 12) hour += 12
    if (suffix === 'am' && hour === 12) hour = 0
  }
  return tomorrowAt(now, hour, minute)
}
