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

/** Complete interface dictionaries currently exist for DE/EN; same fallback rule as I1. */
export function memoryDeadlineCopyForCurrentUi(): MemoryDeadlineCopy {
  return document.documentElement.lang === 'de' ? de : en
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
  const locale = document.documentElement.lang === 'de' ? 'de' : 'en'
  const pattern =
    locale === 'de'
      ? /\bmorgen\s+(?:um\s+)?([01]?\d|2[0-3])(?:[:.]([0-5]\d))?(?:\s*uhr)?\b/iu
      : /\btomorrow\s+(?:at\s+)?([01]?\d|2[0-3])(?::([0-5]\d))?(?:\s*(?:am|pm))?\b/iu
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
