/**
 * Das Uhrzeitfeld sagt, wie es bedient wird (Gerätemeldung 01.09.).
 *
 * Wörtlich gemeldet:
 *
 *   „heure: on peut pas mettre ‚:‘ pour separer l'heure, seuls les chiffres
 *    pour ecrire sur le clavier et aucune indice. Corriger“
 *
 * Gemessen: Das Feld ist ein natives `input type="time"`. Dass dort nur
 * Ziffern ankommen und der Doppelpunkt fest steht, ist dessen richtiges
 * Verhalten — der Fehler ist, dass es **nirgends steht**. Beschriftet ist nur
 * „Uhrzeit“. Wer „830“ tippt und auf den Doppelpunkt wartet, bleibt bei einer
 * halben Eingabe stehen, und der Merken-Knopf ist dann stumm abgeschaltet:
 * kein Hinweis, keine Begründung, nichts passiert.
 *
 * Geprüft wird hier, dass die Auskunft **existiert** und in jeder Sprache
 * eine eigene ist. Ob der Satz gut ist, entscheidet ein Mensch — das steht
 * als USER ACTION im PR.
 */

import { describe, expect, it } from 'vitest'

import { TRANSLATED_LANGUAGES, dictionaryFor, ensureDictionary } from '../../src/i18n/index.ts'

describe('Hinweis am Uhrzeitfeld', () => {
  it('sagt in jeder Sprache, wie die Uhrzeit einzugeben ist', async () => {
    for (const tag of TRANSLATED_LANGUAGES) {
      await ensureDictionary(tag)
      expect(
        dictionaryFor(tag).reminder.timeHint,
        `${tag}: kein Hinweis am Uhrzeitfeld`,
      ).toBeTruthy()
    }
  })

  it('übersetzt ihn wirklich, statt die deutsche Fassung stehen zu lassen', async () => {
    await ensureDictionary('de')
    const deutsch = dictionaryFor('de').reminder.timeHint

    for (const tag of TRANSLATED_LANGUAGES) {
      if (tag === 'de') continue
      await ensureDictionary(tag)
      expect(dictionaryFor(tag).reminder.timeHint, `${tag}: steht noch auf Deutsch`).not.toBe(
        deutsch,
      )
    }
  })
})
