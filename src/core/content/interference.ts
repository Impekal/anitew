/**
 * Laufzeit-Schutz gegen unbeabsichtigte Interferenz (Backlog C6).
 *
 * Kuratierte Listen sind die erste Verteidigung. Diese zweite Schicht ist
 * absichtlich konservativ: Sie fängt nur Schreibformen ab, die sich beim
 * freien Abruf leicht gegenseitig anstoßen können. Sie ist **nicht** für das
 * Zwillingsmodul gedacht — dort ist genau diese Nähe die Aufgabe.
 */

/** Für den Vergleich: klein, ohne Akzente, nur Buchstaben/Ziffern. */
export function interferenceKey(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('und')
    .replace(/[^\p{L}\p{N}]/gu, '')
}

/**
 * Sind zwei Lernwörter so ähnlich geschrieben, dass sie nicht gemeinsam in
 * einen freien Wortvorrat gehören?
 *
 * Die Schwelle ist bewusst eng: fünf gleiche Anfangszeichen bei Wörtern ab
 * sechs Zeichen oder genau eine Einfüge-/Lösch-/Ersetzungsabweichung. C6 soll
 * Fast-Dubletten wie `Insel/Pinsel` abfangen, nicht normale Ähnlichkeiten wie
 * `Schlitten/Schlüssel` oder bloße Reime als vermeintlichen Fehler behandeln.
 */
export function interferes(a: string, b: string): boolean {
  const left = interferenceKey(a)
  const right = interferenceKey(b)
  if (left === '' || right === '') return false
  if (left === right) return true
  if (Math.min(left.length, right.length) < 5) return false
  if (Math.min(left.length, right.length) >= 6 && left.slice(0, 5) === right.slice(0, 5)) {
    return true
  }
  return editDistanceAtMostOne(left, right)
}

/**
 * Behält die erste vorkommende Form und verwirft spätere Konflikte.
 * Reihenfolge bleibt stabil: Der Session-Seed mischt danach wie bisher.
 */
export function withoutInterference(items: readonly string[]): string[] {
  const accepted: string[] = []
  for (const item of items) {
    if (!accepted.some((other) => interferes(item, other))) accepted.push(item)
  }
  return accepted
}

function editDistanceAtMostOne(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false
  if (a === b) return true

  let i = 0
  let j = 0
  let edits = 0
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i += 1
      j += 1
      continue
    }
    edits += 1
    if (edits > 1) return false
    if (a.length > b.length) i += 1
    else if (b.length > a.length) j += 1
    else {
      i += 1
      j += 1
    }
  }
  if (i < a.length || j < b.length) edits += 1
  return edits <= 1
}
