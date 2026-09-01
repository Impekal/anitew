import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

/**
 * Keine Zwei-Sprachen-Inseln (Gerätebild 01.09.).
 *
 * Auf dem Bild steht die App auf Französisch — und der Drive-Bildschirm
 * antwortet auf Englisch: „Your data stays under your control …“, während die
 * Fehlerzeile darunter französisch ist. Zwei Sprachen auf einem Bildschirm.
 *
 * Die Ursache ist ein wiederkehrendes Muster: `startsWith('de') ? DE : EN`.
 * Es stammt aus der Zeit, als die App zwei Sprachen sprach. Seit sie sechs
 * spricht, ist jede solche Verzweigung eine Insel: Alles außer Deutsch fällt
 * auf Englisch zurück, auch wenn daneben ein vollständiges Wörterbuch liegt.
 *
 * `firstRunLayerCopy.ts` trägt den Fund vom 30.08. schon im Kopf — dort wurde
 * eine dieser Inseln beseitigt. Ohne Wächter blieben die anderen stehen und
 * wurden erst durch ein Foto vom Telefon wieder sichtbar. Deshalb steht die
 * Regel jetzt hier: Sprache wird über `…CopyFor(language)` oder das
 * Wörterbuch gewählt, nie über eine Ja/Nein-Frage nach dem Deutschen.
 */

const ROOT = new URL('../../src/', import.meta.url).pathname
/*
 * Zwei Schreibweisen derselben Insel.
 *
 * Der Waechter vom 01.09. kannte nur `startsWith('de')` und meldete danach
 * „das Muster ist aus dem Quelltext heraus". Das stimmte nur zur Haelfte:
 * Fuenf weitere Stellen fragten `document.documentElement.lang === 'de'` und
 * blieben unentdeckt, bis der naechste Geraetebefund kam. Ein Waechter, der
 * eine Schreibweise kennt und die andere nicht, ist kein Waechter.
 */
/*
 * Zwei Schreibweisen derselben Insel.
 *
 * Dieser Wächter kannte zuerst nur `startsWith('de')`, und im Commit dazu
 * stand, das Muster sei „aus dem Quelltext heraus". Das stimmte zur Hälfte:
 * Fünf weitere Stellen fragten `document.documentElement.lang === 'de'` und
 * blieben unentdeckt, bis der nächste Gerätebefund kam. Ein Wächter, der eine
 * Schreibweise kennt und die andere nicht, ist keiner.
 */
const MUSTER = /startsWith\((['"])de\1\)|lang\s*[!=]==\s*(['"])de\2/u

function quellen(verzeichnis: string): string[] {
  const gefunden: string[] = []
  for (const eintrag of readdirSync(verzeichnis)) {
    const pfad = join(verzeichnis, eintrag)
    if (statSync(pfad).isDirectory()) gefunden.push(...quellen(pfad))
    else if (/\.tsx?$/u.test(eintrag)) gefunden.push(pfad)
  }
  return gefunden
}

/**
 * Kommentare zählen nicht — mehrere Dateien **beschreiben** das Muster, um zu
 * erklären, warum es weg ist. Die Zeilenzahl bleibt erhalten, damit ein Fund
 * auf die richtige Zeile zeigt.
 */
function ohneKommentare(quelle: string): string {
  return quelle
    .replace(/\/\*[\s\S]*?\*\//gu, (block) => '\n'.repeat((block.match(/\n/gu) ?? []).length))
    .replace(/^\s*\/\/.*$/gmu, '')
}

describe('Sprache kommt aus dem Wörterbuch, nicht aus einer Ja/Nein-Frage', () => {
  it('kein Bildschirm entscheidet zwischen Deutsch und Englisch', () => {
    const inseln: string[] = []

    for (const pfad of quellen(ROOT)) {
      const zeilen = ohneKommentare(readFileSync(pfad, 'utf8')).split('\n')
      for (const [nummer, zeile] of zeilen.entries()) {
        if (MUSTER.test(zeile)) inseln.push(`${pfad.slice(ROOT.length)}:${nummer + 1}`)
      }
    }

    expect(inseln.join('\n'), 'diese Stellen kennen nur Deutsch und Englisch').toBe('')
  })
})
