/**
 * Deterministischer Zufall.
 *
 * Nichts in ANITEW darf `Math.random()` benutzen. Der Grund ist nicht
 * Pedanterie, sondern Prüfbarkeit: Eine Session, ein Gesicht (D-005), eine
 * Mission oder ein Benchmark-Durchgang (D-006) müssen sich aus ihrem Seed
 * exakt wiederherstellen lassen — sonst ist ein Fehlerbericht wertlos und der
 * Simulator aus Backlog C9 kann nichts beweisen.
 *
 * Verfahren: mulberry32. Klein, schnell, gut genug für Inhalte und Auswahl.
 * Ausdrücklich **nicht** für Kryptografie geeignet — dafür wird nichts hiervon
 * verwendet.
 */

export interface Rng {
  /** Gleichverteilt in [0, 1). */
  next(): number
  /** Ganzzahl in [0, maxExclusive). */
  int(maxExclusive: number): number
  /** Ganzzahl in [min, maxExclusive). */
  between(min: number, maxExclusive: number): number
  /** Ein Element. Wirft bei leerer Liste — das ist immer ein Aufruferfehler. */
  pick<T>(items: readonly T[]): T
  /** Neue, gemischte Liste. Die Eingabe bleibt unangetastet. */
  shuffle<T>(items: readonly T[]): T[]
  /** `count` verschiedene Elemente, ohne Zurücklegen. */
  sample<T>(items: readonly T[], count: number): T[]
}

/**
 * Verwandelt einen Text in einen Seed (FNV-1a, 32 Bit).
 * Damit lässt sich aus einer Item-Kennung oder einem Datum ein stabiler
 * Zufallsstrom ableiten: gleiche Kennung, gleiches Ergebnis — auf jedem Gerät.
 */
export function seedFrom(text: string): number {
  let hash = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i)
    // hash * 16777619, in 32 Bit, ohne die Ungenauigkeit von Gleitkomma
    hash = (hash + ((hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24))) >>> 0
  }
  return hash >>> 0
}

export function createRng(seed: number | string): Rng {
  let state = (typeof seed === 'string' ? seedFrom(seed) : Math.trunc(seed)) >>> 0
  // Seed 0 führt bei mulberry32 zu einem auffällig schwachen Anfang.
  if (state === 0) state = 0x9e3779b9

  const next = (): number => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  const int = (maxExclusive: number): number => {
    if (!Number.isFinite(maxExclusive) || maxExclusive < 1) {
      throw new RangeError(`int() braucht eine Obergrenze >= 1, bekam ${maxExclusive}`)
    }
    return Math.floor(next() * Math.trunc(maxExclusive))
  }

  const rng: Rng = {
    next,
    int,
    between(min, maxExclusive) {
      const span = Math.trunc(maxExclusive) - Math.trunc(min)
      if (span < 1) {
        throw new RangeError(`between() braucht min < maxExclusive, bekam ${min}..${maxExclusive}`)
      }
      return Math.trunc(min) + int(span)
    },
    pick(items) {
      if (items.length === 0) throw new RangeError('pick() auf einer leeren Liste')
      return items[int(items.length)] as (typeof items)[number]
    },
    shuffle(items) {
      // Fisher-Yates, rückwärts
      const out = items.slice()
      for (let i = out.length - 1; i > 0; i--) {
        const j = int(i + 1)
        const a = out[i] as (typeof out)[number]
        const b = out[j] as (typeof out)[number]
        out[i] = b
        out[j] = a
      }
      return out
    },
    sample(items, count) {
      if (count < 0) throw new RangeError(`sample() braucht count >= 0, bekam ${count}`)
      if (count > items.length) {
        throw new RangeError(`sample(${count}) aus nur ${items.length} Elementen`)
      }
      return rng.shuffle(items).slice(0, count)
    },
  }

  return rng
}
