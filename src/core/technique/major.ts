/**
 * Das Major-System (Backlog D5).
 *
 * D5 ist der Satz, an dem sich ANITEW von jeder Brain-Game-App unterscheidet:
 * **Merktechniken werden beigebracht, nicht nur abgefragt.** Eine App, die
 * einen dreimal täglich Ziffern raten lässt, macht einen nicht besser — sie
 * misst nur, wie gut man ohnehin schon ist.
 *
 * Das Major-System ist die erste Technik, und das aus einem Grund: Man spürt
 * sie in der ersten Sitzung. Jede Ziffer bekommt einen Konsonanten, die Vokale
 * bleiben frei — aus einer Ziffernfolge wird damit ein Wort und aus dem Wort
 * ein Bild. „4719“ sind vier Ziffern, „R–K–T–P“ ist fast schon eine Rakete.
 *
 * ── Was die App tut und was sie bewusst **nicht** tut ─────────────────────
 *
 * Sie bringt die **Zuordnung** bei, eine Ziffer nach der anderen, mit dem
 * Bild, an dem man sie behält. Das Wort zur Zahl liefert sie **nicht**.
 *
 * Das ist keine Sparsamkeit. Ein selbst gebildetes Bild sitzt besser als ein
 * vorgesetztes — das ist einer der am besten belegten Effekte der
 * Gedächtnisforschung, und eine mitgelieferte Wortliste würde genau ihn
 * abschalten. Wer „Rakete“ vorgesetzt bekommt, hat ein Wort gelesen; wer es
 * selbst findet, hat es gebaut.
 *
 * Nebenbei erspart es der App eine Liste von hundert Wörtern je Sprache, die
 * nie ganz passen würde. Aber das ist der zweite Grund, nicht der erste.
 *
 * ── Warum diese Zuordnung und keine eigene ────────────────────────────────
 *
 * Das Major-System ist über zweihundert Jahre alt und in dieser Form
 * verbreitet. Eine eigene Zuordnung wäre vielleicht eingängiger und wäre in
 * dem Moment wertlos, in dem jemand ein Buch darüber aufschlägt oder die
 * Technik anderswo weiterlernt.
 */

/** Die Konsonanten je Ziffer. Vokale zählen nicht — sie sind der Mörtel. */
export interface MajorPair {
  digit: number
  /** Die Buchstaben, kurz genug für die Anzeige unter einer Ziffer. */
  letters: string
}

/**
 * Der Schlüssel des Bildes, an dem die Ziffer hängt, steht **nicht** hier:
 * „Das kleine n hat zwei Abstriche“ ist Text und gehört nach `i18n/`. Der Kern
 * kennt die Zuordnung, nicht ihre Erklärung — sonst ließe sie sich nicht
 * übersetzen (D-007).
 */
const PAIRS: readonly MajorPair[] = [
  { digit: 0, letters: 's · z' },
  { digit: 1, letters: 't · d' },
  { digit: 2, letters: 'n' },
  { digit: 3, letters: 'm' },
  { digit: 4, letters: 'r' },
  { digit: 5, letters: 'l' },
  { digit: 6, letters: 'sch · ch · j' },
  { digit: 7, letters: 'k · g' },
  { digit: 8, letters: 'f · w' },
  { digit: 9, letters: 'p · b' },
]

export const MAJOR_PAIRS = PAIRS

/**
 * In welcher Reihenfolge gelehrt wird.
 *
 * Nicht 0 bis 9, sondern **die sichtbaren zuerst**: 1, 2, 3 hängen an der Zahl
 * der Abstriche, 4 und 5 an einem Wort und einer Zahl, 9 und 8 an der Form.
 * Die 0 und die 6 stehen hinten, weil ihre Brücke die schwächste ist — wer
 * dort anfängt, hält die Technik für willkürlich und hört auf.
 */
export const TEACH_ORDER: readonly number[] = [1, 2, 3, 4, 5, 9, 7, 8, 0, 6]

export function lettersFor(digit: number): string {
  return PAIRS[digit]?.letters ?? ''
}

/**
 * Welche Ziffer als Nächstes drankommt — oder `undefined`, wenn alle sitzen.
 *
 * Unbekannte Einträge in `taught` stören nicht: Entscheidend ist, was noch
 * fehlt, und nicht, was jemand einmal in die Einstellungen geschrieben hat.
 */
export function nextToTeach(taught: readonly number[]): number | undefined {
  const known = new Set(taught)
  return TEACH_ORDER.find((digit) => !known.has(digit))
}

/** Wie weit die Technik sitzt — für die Anzeige, nicht für eine Bewertung. */
export function taughtProgress(taught: readonly number[]): { known: number; total: number } {
  const known = new Set(taught)
  return {
    known: TEACH_ORDER.filter((digit) => known.has(digit)).length,
    total: TEACH_ORDER.length,
  }
}

export interface MajorPart {
  digit: string
  /** Die Konsonanten — nur, wenn diese Ziffer schon gelehrt wurde. */
  letters?: string
}

/**
 * Zerlegt eine Zahl in ihre Ziffern und hängt an, was schon gelernt ist.
 *
 * Ziffern, die noch nicht drankamen, bleiben **ohne** Buchstaben. Alle zehn
 * auf einmal hinzuschreiben wäre der bequemere Weg und der schlechtere: Wer
 * eine Tabelle vorgesetzt bekommt, die er nicht kann, liest sie ab, statt sie
 * zu lernen — und übt dann Ablesen.
 */
export function majorParts(value: string, taught: readonly number[]): readonly MajorPart[] {
  const known = new Set(taught)
  return [...value].map((character) => {
    const digit = Number(character)
    return Number.isInteger(digit) && known.has(digit)
      ? { digit: character, letters: lettersFor(digit) }
      : { digit: character }
  })
}

/** Trägt die Technik zu dieser Zahl schon etwas bei? */
export function helpsWith(value: string, taught: readonly number[]): boolean {
  return majorParts(value, taught).some((part) => part.letters !== undefined)
}
