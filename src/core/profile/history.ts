/**
 * Verlauf des Gedächtnisprofils (E4).
 *
 * Das Live-Profil bleibt die Wahrheit. Diese Datei speichert keine Bewertung,
 * sondern nur gelegentliche Momentaufnahmen derselben Rohzählungen
 * (`chances`, `lost`) je Kalendertag. Dadurch kann die Oberfläche später den
 * Verlauf zeigen, ohne eine zweite Metrik oder einen erfundenen Score
 * einzuführen.
 */

import type { DayKey } from '../time.ts'
import { DIMENSIONS, type DimensionId } from './dimensions.ts'
import type { DimensionCounts } from './profile.ts'

export const PROFILE_HISTORY_LIMIT = 180

export interface ProfileSnapshot {
  day: DayKey
  counts: Partial<Record<DimensionId, DimensionCounts>>
}

/** Nur endliche, nichtnegative Ganzzahlen können echte Zählungen sein. */
function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && Number.isFinite(value)
}

function isDayKey(value: unknown): value is DayKey {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

export function isProfileSnapshot(value: unknown): value is ProfileSnapshot {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
  const candidate = value as Record<string, unknown>
  if (!isDayKey(candidate['day'])) return false
  const rawCounts = candidate['counts']
  if (typeof rawCounts !== 'object' || rawCounts === null || Array.isArray(rawCounts)) return false
  const counts = rawCounts as Record<string, unknown>

  for (const [id, raw] of Object.entries(counts)) {
    if (!(DIMENSIONS as readonly string[]).includes(id)) return false
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return false
    const entry = raw as Record<string, unknown>
    if (!isCount(entry['chances']) || !isCount(entry['lost'])) return false
    if (entry['lost'] > entry['chances']) return false
  }
  return true
}

export function readProfileHistory(value: unknown): readonly ProfileSnapshot[] {
  if (!Array.isArray(value)) return []
  return value.filter(isProfileSnapshot).sort((a, b) => a.day.localeCompare(b.day))
}

/**
 * Schreibt höchstens eine Momentaufnahme je Tag. Kommt am selben Tag später
 * mehr Training dazu, ersetzt die neuere Rohzählung die frühere. So wird aus
 * zehn App-Öffnungen kein künstlicher Verlauf.
 */
export function recordProfileSnapshot(
  history: readonly ProfileSnapshot[],
  day: DayKey,
  counts: Partial<Record<DimensionId, DimensionCounts>>,
  limit = PROFILE_HISTORY_LIMIT,
): readonly ProfileSnapshot[] {
  if (limit <= 0) return []

  const cleanCounts: Partial<Record<DimensionId, DimensionCounts>> = {}
  for (const id of DIMENSIONS) {
    const entry = counts[id]
    if (entry === undefined) continue
    const chances = Math.max(0, Math.floor(entry.chances))
    const lost = Math.min(chances, Math.max(0, Math.floor(entry.lost)))
    cleanCounts[id] = { chances, lost }
  }

  const next = [
    ...history.filter((snapshot) => snapshot.day !== day && isProfileSnapshot(snapshot)),
    { day, counts: cleanCounts },
  ].sort((a, b) => a.day.localeCompare(b.day))

  return next.slice(-limit)
}
