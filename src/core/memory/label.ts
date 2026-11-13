/**
 * Der Name eines Erinnerungspunkts, wie er im Band steht (Gerätebild 03.09.).
 *
 * ── Der Befund ────────────────────────────────────────────────────────────
 *
 * Auf dem Telefon stand oben links ein Punkt, dessen Name nur noch „.…" war.
 * Der erste Verdacht — der Kasten schneidet am Rand ab — war falsch:
 * Nachgerechnet aus demselben Bild lag der Punkt bei x = 11,45 von 100, und
 * dort schneidet nichts. Es war das Kürzen selbst:
 *
 *     "A       Bcdef"  ->  "A…"          ein sichtbares Zeichen
 *     "   Vic Sanou"   ->  "   Vic S…"   drei davon sind Leerraum
 *
 * Eine Reihe von Leerzeichen frisst das ganze Budget. Führender Leerraum
 * schiebt den lesbaren Teil aus der Mitte, obwohl der Punkt mittig sitzt.
 * Und Zeichen, die gar nichts malen — Nullbreiten- und Steuerzeichen, wie sie
 * beim Einfügen aus anderen Programmen mitkommen —, zählen mit und kürzen
 * einen Namen weg, ohne dass man sähe, warum.
 *
 * Die Reihenfolge ist deshalb: **erst putzen, dann messen, dann kürzen.**
 * Vorher wurde an ungeputztem Text gemessen, und das Ergebnis war eine
 * richtige Rechnung über den falschen Gegenstand.
 *
 * Der Kern kennt kein SVG (D-010) — hier steht nur Zeichenkettenarbeit. Wie
 * breit ein Zeichen wird, entscheidet das Band eine Ebene höher.
 */

/**
 * Was nichts malt und trotzdem zählt: Steuerzeichen, Nullbreiten-Leerzeichen,
 * die Richtungsmarken und die Byte-Order-Mark.
 */
const UNSICHTBAR = /[\p{Cc}\p{Cf}​-‍⁠﻿]/gu

/**
 * So viele lesbare Zeichen muss ein gekürzter Name mindestens behalten.
 *
 * Ein einzelner Buchstabe mit Pünktchen ist kein Name, sondern ein Rest. Wo
 * nicht einmal das übrig bleibt, bleibt der Punkt lieber ohne Beschriftung:
 * Der ganze Name steht einen Fingertipp entfernt in „Mein Gedächtnis".
 */
const MINDESTENS_LESBAR = 2

/** Putzen: unsichtbare Zeichen raus, Leerraum zu je einem Leerzeichen, Ränder ab. */
export function cleanLabel(label: string): string {
  return label.replace(UNSICHTBAR, '').replace(/\s+/gu, ' ').trim()
}

/**
 * Der Name, gekürzt auf höchstens `maxZeichen` Zeichen — Auslassungspunkte
 * eingerechnet.
 *
 * Gibt eine leere Zeichenkette zurück, wenn nichts Lesbares bleibt. Das Band
 * zeichnet dann keinen Namen, statt ein nacktes „…" hinzustellen.
 */
export function bandLabel(label: string, maxZeichen: number): string {
  const sauber = cleanLabel(label)
  if (sauber === '') return ''
  if (sauber.length <= maxZeichen) return sauber

  /*
   * Nach dem Putzen kann nur noch ein einzelnes Leerzeichen am Schnitt
   * stehen; `trimEnd` nimmt es weg und macht aus „Vic …" ein „Vic…".
   */
  const kopf = sauber.slice(0, Math.max(1, maxZeichen - 1)).trimEnd()
  return kopf.length >= MINDESTENS_LESBAR ? `${kopf}…` : ''
}
