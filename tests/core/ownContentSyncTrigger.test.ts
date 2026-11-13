/**
 * Wer eigene Inhalte schreibt, stößt den Abgleich an (D-038).
 *
 * Vier Bildschirme tun das seit jeher: „Das merke ich mir“, „Mein Gedächtnis“,
 * die Menschen-Szene und das Ende einer Einheit. Zwei taten es nicht — der
 * Palast-Bildschirm und der für eigene Paare — und genau dort entsteht der
 * Inhalt, den ein zweites Gerät am dringendsten braucht. Ohne den Anstoß
 * wandert ein neu angelegter Palast erst beim nächsten App-Start hoch.
 *
 * Ein Wächter über den Quelltext und nicht über das Verhalten: Der Anstoß ist
 * eine Verdrahtung, kein Rechenschritt. Was er prüft, ist trotzdem echt — die
 * Liste unten kommt aus den Schreibfunktionen selbst, nicht aus einer
 * gepflegten Aufzählung.
 */

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

const APP = join(import.meta.dirname, '..', '..', 'src', 'app')

/** Die Funktionen, die eigene Inhalte auf die Platte schreiben. */
const SCHREIBT = /\b(createOwnPalace|saveOwnPalace|removeOwnPalace|addOwnFacts|removeOwnFact)\b/u

describe('Anstoß des Abgleichs nach eigener Eingabe', () => {
  it('lässt keinen Bildschirm eigene Inhalte schreiben, ohne den Abgleich anzustoßen', () => {
    const ohneAnstoss: string[] = []

    for (const name of readdirSync(APP)) {
      if (!name.endsWith('.tsx') && !name.endsWith('.ts')) continue
      const quelle = readFileSync(join(APP, name), 'utf8')
      if (!SCHREIBT.test(quelle)) continue
      if (!quelle.includes('scheduleDriveSync')) ohneAnstoss.push(name)
    }

    expect(ohneAnstoss).toEqual([])
  })
})
