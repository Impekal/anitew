/**
 * Eigene Inhalte (Backlog I · D-032).
 *
 * Der Punkt, der aus einem Spiel einen Gedächtnistrainer macht: eigener
 * Stoff — Vokabeln, Namen, Fakten — wird zu Frage-Antwort-Paaren, und die
 * Paare gehen denselben Weg wie alles andere: einprägen, abrufen,
 * Wiedersehen nach Tagen (FSRS).
 *
 * **Halbautomatisch, ohne KI** (I4): Der Parser schlägt vor, der Mensch
 * bestätigt. Er versteht die Formen, die beim Abtippen und Einfügen
 * wirklich entstehen — „Frage – Antwort“, „Begriff: Bedeutung“,
 * Tabulator aus einer Tabelle — und rät nicht darüber hinaus: Eine Zeile
 * ohne erkennbare Trennung wird keine halbe Karte, sondern bleibt sichtbar
 * draußen.
 *
 * **Lokal** (I6): Hier steht nur die Form. Gespeichert wird anderswo, und
 * gesendet wird nichts.
 */

/**
 * Die Kennung eines Paars trägt beide Seiten, getrennt durch das
 * Trenneinheitszeichen U+001F. Das kann in keiner Seite vorkommen, weil
 * `cleanSide` Steuerzeichen entfernt — dieselbe Wäsche wie beim Namen im
 * Ankommen.
 */
export const OWN_SEPARATOR = '\u001f'

/** Länger wird eine Seite nicht — eine Karte ist eine Karte, kein Absatz. */
export const MAX_SIDE_LENGTH = 120

export interface OwnFact {
  readonly prompt: string
  readonly answer: string
}

/** Beide Seiten in eine Kennung — der Vorratseintrag des Moduls `facts`. */
export function encodeFact(fact: OwnFact): string {
  return `${fact.prompt}${OWN_SEPARATOR}${fact.answer}`
}

export function factPrompt(item: string): string {
  return item.split(OWN_SEPARATOR)[0] ?? item
}

export function factAnswer(item: string): string {
  return item.split(OWN_SEPARATOR)[1] ?? item
}

/**
 * Die Trennzeichen, in der Reihenfolge des Vertrauens. Tabulator zuerst —
 * wer aus einer Tabelle einfügt, hat schon getrennt. Die Striche vor dem
 * Doppelpunkt, denn „19:30 – Abfahrt“ soll an dem Strich brechen, nicht
 * in der Uhrzeit. Das Gleichheitszeichen zuletzt.
 */
const SEPARATORS = ['\t', ' – ', ' — ', ' - ', ':', '='] as const

function cleanSide(raw: string): string {
  return raw
    .replace(/[\u0000-\u001f\u007f]/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim()
    .slice(0, MAX_SIDE_LENGTH)
}

function splitLine(line: string): OwnFact | undefined {
  for (const separator of SEPARATORS) {
    const at = line.indexOf(separator)
    if (at <= 0) continue
    const prompt = cleanSide(line.slice(0, at))
    const answer = cleanSide(line.slice(at + separator.length))
    if (prompt === '' || answer === '') return undefined
    return { prompt, answer }
  }
  return undefined
}

export interface ParsedOwnText {
  /** Erkannte Paare, in der Reihenfolge des Textes, ohne Doppelte. */
  readonly facts: readonly OwnFact[]
  /** Zeilen, aus denen kein Paar wurde — sichtbar, nicht verschluckt. */
  readonly rejected: readonly string[]
}

/**
 * Aus eingefügtem Text werden Paar-Vorschläge. Eine Zeile, ein Paar;
 * doppelte Fragen behalten die erste Antwort (wer dieselbe Frage zweimal
 * einfügt, meint dieselbe Karte). Was nicht bricht, steht unter
 * `rejected` — die Oberfläche zeigt es, statt es zu verschlucken (K7
 * umgekehrt: auch das Nicht-Erkannte ist eine Auskunft).
 */
export function parseOwnText(text: string): ParsedOwnText {
  const facts: OwnFact[] = []
  const rejected: string[] = []
  const seen = new Set<string>()

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim()
    if (line === '') continue
    const fact = splitLine(line)
    if (fact === undefined) {
      rejected.push(cleanSide(line))
      continue
    }
    if (seen.has(fact.prompt)) continue
    seen.add(fact.prompt)
    facts.push(fact)
  }

  return { facts, rejected }
}
