/**
 * Was zählt als erinnert?
 *
 * Der Abruf ist frei (Backlog C5/D6): Der Nutzer tippt, woran er sich
 * erinnert — keine Auswahl, keine Hinweise. Wiedererkennen fühlt sich leichter
 * an und trainiert weniger.
 *
 * Damit steht die Bewertung vor einer Entscheidung, und sie fällt hier
 * bewusst **großzügig** aus:
 *
 * - Groß- und Kleinschreibung, Leerzeichen und Satzzeichen sind egal.
 * - Akzente und Umlaute werden gefaltet: „Bäcker“ = „Baecker“ = „backer“.
 *   Wer auf einer fremden Tastatur tippt, soll nicht am Umlaut scheitern.
 * - Ab fünf Zeichen ist ein Tippfehler erlaubt (eine Einfügung, eine
 *   Auslassung, eine Vertauschung).
 *
 * Der Grund ist nicht Nachsicht, sondern Messgenauigkeit: Gemessen werden soll
 * das Gedächtnis, nicht die Rechtschreibung und nicht die Tastatur. Ein
 * strenger Vergleich würde die Zahl kleiner machen, aber nicht richtiger — und
 * eine falsche Zahl ist nach Regel R-1 schlimmer als eine milde.
 *
 * Bei kurzen Wörtern (unter fünf Zeichen) gilt die Toleranz nicht: Dort ist
 * ein Buchstabe Unterschied oft ein anderes Wort.
 */

export interface RecallResult {
  /** Gesuchte Wörter, die erinnert wurden — in der Reihenfolge der Vorlage. */
  correct: string[]
  /** Gesuchte Wörter, die fehlten. */
  missed: string[]
  /** Eingaben, die zu keinem gesuchten Wort passten. */
  extra: string[]
}

/** Für den Vergleich: klein, ohne Satzzeichen, ohne Akzente, Umlaute gefaltet. */
export function normalizeWord(word: string): string {
  return word
    .trim()
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    // Kombinierende Zeichen entfernen — aus „é“ wird „e“, aus „ä“ wird „a“.
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N}]/gu, '')
}

/** Zerlegt die Eingabe in einzelne Wörter — Zeilen, Kommas oder Leerzeichen. */
export function splitEntries(text: string): string[] {
  return text
    .split(/[\s,;]+/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
}

/**
 * Vergleicht die Eingaben mit den gesuchten Wörtern.
 * Jede Eingabe zählt für höchstens ein gesuchtes Wort, und jedes gesuchte Wort
 * kann nur einmal getroffen werden — zehnmal dasselbe Wort ist ein Treffer.
 */
export function gradeRecall(entries: readonly string[], targets: readonly string[]): RecallResult {
  const normalizedTargets = targets.map((target) => ({
    original: target,
    normal: normalizeWord(target),
    hit: false,
  }))
  const extra: string[] = []

  for (const entry of entries) {
    const normal = normalizeWord(entry)
    if (normal === '') continue

    const exact = normalizedTargets.find((target) => !target.hit && target.normal === normal)
    if (exact !== undefined) {
      exact.hit = true
      continue
    }
    const close = normalizedTargets.find(
      (target) => !target.hit && target.normal.length >= 5 && withinOneEdit(target.normal, normal),
    )
    if (close !== undefined) {
      close.hit = true
      continue
    }
    extra.push(entry.trim())
  }

  return {
    correct: normalizedTargets.filter((target) => target.hit).map((target) => target.original),
    missed: normalizedTargets.filter((target) => !target.hit).map((target) => target.original),
    extra,
  }
}

/**
 * Unterscheiden sich zwei Wörter um höchstens eine Änderung?
 *
 * Kein volles Levenshtein: Der Fall „höchstens eins“ lässt sich in einem
 * Durchlauf entscheiden und ist damit auch bei langen Listen umsonst zu haben.
 */
export function withinOneEdit(a: string, b: string): boolean {
  if (a === b) return true
  const difference = a.length - b.length
  if (difference > 1 || difference < -1) return false

  // Vertauschung zweier Nachbarn („Blmue“ statt „Blume“) ist der häufigste
  // Tippfehler überhaupt und zählt als eine Änderung.
  if (difference === 0) {
    let mismatches = 0
    let first = -1
    let second = -1
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        mismatches++
        if (mismatches === 1) first = i
        else if (mismatches === 2) second = i
        else return false
      }
    }
    if (mismatches <= 1) return true
    // Nur benachbarte Stellen sind eine Vertauschung; zwei Fehler an weit
    // auseinanderliegenden Stellen bleiben zwei Fehler.
    return second === first + 1 && a[first] === b[second] && a[second] === b[first]
  }

  const longer = difference === 1 ? a : b
  const shorter = difference === 1 ? b : a
  let i = 0
  let j = 0
  let skipped = false
  while (i < longer.length && j < shorter.length) {
    if (longer[i] === shorter[j]) {
      i++
      j++
      continue
    }
    if (skipped) return false
    skipped = true
    i++
  }
  return true
}

/**
 * Bewertung für den **gestützten** Abruf (Backlog D9).
 *
 * Beim Gesicht steht die Frage schon da; gesucht ist genau eine Antwort. Die
 * Zuordnung ist deshalb Position für Position und nicht wie beim freien Abruf
 * „irgendeine Eingabe passt zu irgendeinem Ziel“.
 *
 * Die Milde ist dieselbe wie dort, und aus demselben Grund: Gemessen wird das
 * Gedächtnis, nicht die Rechtschreibung. Wer „Rosalinde“ statt „Rosalind“
 * tippt, hat sich den Namen gemerkt.
 *
 * `answers` darf kürzer sein als `targets` — was fehlt, gilt als nicht
 * erinnert. Das ist der Normalfall, wenn die Zeit ausläuft, und keine
 * Ausnahme, die eine Sonderbehandlung bräuchte.
 */
export function gradePrompted(
  answers: readonly string[],
  targets: readonly string[],
): RecallResult {
  const correct: string[] = []
  const missed: string[] = []

  targets.forEach((target, index) => {
    const answer = answers[index] ?? ''
    const normalAnswer = normalizeWord(answer)
    const normalTarget = normalizeWord(target)
    const hit =
      normalAnswer !== '' &&
      (normalAnswer === normalTarget ||
        (normalTarget.length >= 5 && withinOneEdit(normalTarget, normalAnswer)))
    if (hit) correct.push(target)
    else missed.push(target)
  })

  return { correct, missed, extra: [] }
}
