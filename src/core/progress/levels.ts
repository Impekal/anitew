/** Game progress derived from recorded activity; never a memory assessment. */
export const LEVEL_THRESHOLDS = [0, 20, 50, 100, 200, 400, 700, 1100, 1600, 2300] as const

export function trainingLevel(days: readonly string[], today: string, returns: number) {
  const trainedDays = new Set(days.filter(day => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || day > today) return false
    const date = new Date(`${day}T00:00:00Z`)
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === day
  })).size
  const reviewed = Number.isFinite(returns) ? Math.max(0, Math.floor(returns)) : 0
  const xp = trainedDays * 10 + reviewed * 2
  let index = 0
  while (index + 1 < LEVEL_THRESHOLDS.length && xp >= LEVEL_THRESHOLDS[index + 1]!) index++
  const floor = LEVEL_THRESHOLDS[index]!
  const next = LEVEL_THRESHOLDS[index + 1]
  return { level: index + 1, xp, trainedDays, reviewed, next,
    progress: next === undefined ? 1 : (xp - floor) / (next - floor),
    remaining: next === undefined ? 0 : next - xp }
}
