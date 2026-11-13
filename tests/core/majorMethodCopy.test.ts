/**
 * Die Verfahrenslektion muss die vier Fragen beantworten, die gestellt wurden
 * (Gerätemeldung 01.09., zweite Runde).
 *
 * Wörtlich gemeldet:
 *
 *   „Les leçons doivent être simples et claire/clairement expliqué. C'est quoi
 *    le Major Système? Ça consiste à quoi exactement? Ça aide à faire quoi?
 *    Comment on l'applique etc etc. Dans un language facile et compréhensible.“
 *
 * PR #106 hatte eine Verfahrenslektion nachgeliefert: drei Schritte, ein Satz
 * zum Anpacken. Sie sagt, **wie** es geht — Ziffer, Laut, Wort, Bild. Sie sagt
 * nicht, **was** das Ganze ist und **wozu** es hilft. Wer nicht weiß, wofür er
 * etwas lernt, lernt es nicht.
 *
 * ── Was dieser Test bewusst NICHT prüft ───────────────────────────────────
 *
 * Den Wortlaut. Ob ein Satz verständlich ist, entscheidet kein Test, sondern
 * ein Mensch, der ihn liest — das steht als USER ACTION im PR. Prüfbar ist,
 * dass die Auskunft **existiert** und in jeder Sprache eine eigene ist und
 * nicht die deutsche, die jemand stehen ließ.
 */

import { describe, expect, it } from 'vitest'

import { TRANSLATED_LANGUAGES } from '../../src/i18n/index.ts'
import { lessonCopyFor } from '../../src/i18n/lessonCopy.ts'

describe('Verfahrenslektion des Major-Systems', () => {
  it('sagt in jeder Sprache, was das Major-System ist und wozu es hilft', async () => {
    for (const tag of TRANSLATED_LANGUAGES) {
      const method = lessonCopyFor(tag).method

      expect(method.what, `${tag}: keine Auskunft, was das Major-System ist`).toBeTruthy()
      expect(method.helps, `${tag}: keine Auskunft, wozu es hilft`).toBeTruthy()
    }
  })

  it('übersetzt sie wirklich, statt die deutsche Fassung stehen zu lassen', async () => {
    const deutsch = lessonCopyFor('de').method

    for (const tag of TRANSLATED_LANGUAGES) {
      if (tag === 'de') continue
      const method = lessonCopyFor(tag).method
      expect(method.what, `${tag}: „was" steht noch auf Deutsch`).not.toBe(deutsch.what)
      expect(method.helps, `${tag}: „wozu" steht noch auf Deutsch`).not.toBe(deutsch.helps)
    }
  })

  it('bleibt bei einer Lektion, die man in einem Atemzug liest', async () => {
    const method = lessonCopyFor('de').method
    // Drei Schritte bleiben drei Schritte — dieselbe Form wie Palast,
    // Geschichte und Verknüpfung. Eine vierte Zeile wäre eine Seite.
    expect(method.steps).toHaveLength(3)
  })
})
