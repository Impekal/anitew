import { describe, expect, it } from 'vitest'

import {
  BRAIN_TIPS,
  BRAIN_TIP_IDS,
  type BrainTip,
  tipOfDay,
} from '../../src/core/brainCare.ts'
import { EVIDENCE_STANDINGS } from '../../src/core/science.ts'
import { brainCareCopyFor } from '../../src/i18n/brainCareCopy.ts'

/**
 * „Geistig aktiv bleiben" — geprüft wie die Wissenschaftsseite (F6, R-1/R-2).
 *
 * Der Gerätewunsch vom 31.08. war ein Bereich mit praktischen Tipps fürs
 * Gehirn: Ernährung, Schlaf, das Gehirn beanspruchen statt alles der KI zu
 * überlassen. Die Frage dazu lautete: „explizit gegen Demenz oder zum
 * Vorbeugen?"
 *
 * **Die Antwort steht in diesen Regeln.** Ein Bereich mit Alltagstipps ist
 * genau die Stelle, an der eine Gedächtnis-App zur Gesundheitsverheißung
 * abrutscht — und dieselbe App hat auf ihrer Wissenschaftsseite stehen, dass
 * Gehirnjogging nicht allgemein klüger macht. Ein Tipp darf hier also alles
 * sein, nur nicht ein Versprechen: Jeder trägt seinen Belegstand mit, jeder
 * Belegstand außer „nicht gemessen" braucht eine Arbeit, und keiner darf
 * behaupten, er verhindere eine Krankheit.
 */

describe('Geistig aktiv bleiben', () => {
  it('kennt jeden Tipp genau einmal', () => {
    expect(BRAIN_TIPS.map((tip: BrainTip) => tip.id)).toEqual([...BRAIN_TIP_IDS])
  })

  it('gibt jedem Tipp einen Belegstand aus derselben Skala wie die Wissenschaftsseite', () => {
    for (const tip of BRAIN_TIPS) {
      expect(EVIDENCE_STANDINGS, `${tip.id}`).toContain(tip.standing)
    }
  })

  it('belegt jeden Tipp, der etwas über die Studienlage sagt', () => {
    for (const tip of BRAIN_TIPS) {
      if (tip.standing === 'unmeasured') continue
      expect(tip.sources.length, `${tip.id} ohne Quelle`).toBeGreaterThan(0)
    }
  })

  it('nennt Autor, Jahr, Titel und Ort jeder Quelle — keine halben Angaben', () => {
    for (const tip of BRAIN_TIPS) {
      for (const source of tip.sources) {
        expect(source.authors.length, `${tip.id}`).toBeGreaterThan(3)
        expect(source.year).toBeGreaterThan(1880)
        expect(source.year).toBeLessThan(2027)
        expect(source.title.length, `${tip.id}`).toBeGreaterThan(10)
        expect(source.where.length, `${tip.id}`).toBeGreaterThan(3)
      }
    }
  })

  it('verspricht nirgends Schutz vor einer Krankheit (R-1)', () => {
    /*
     * Die härteste Regel dieser Datei, und der Grund, warum der Bereich
     * „Geistig aktiv bleiben" heißt und nicht „Demenzvorsorge". Geprüft wird
     * der ausgelieferte Text, nicht die Absicht: Wer je „schützt vor
     * Demenz" schreibt, bekommt einen roten Test.
     */
    const verboten = [
      /sch[üu]tzt vor/i,
      /verhindert/i,
      /beugt .* vor/i,
      /prevents?\b/i,
      /protects? (you )?(from|against)/i,
      /cures?\b/i,
    ]
    const texte = ['de', 'en', 'fr', 'es', 'it', 'pt'].flatMap((language) => {
      const copy = brainCareCopyFor(language)
      return BRAIN_TIP_IDS.flatMap((id) => [
        copy.tips[id]?.title ?? '',
        copy.tips[id]?.body ?? '',
        copy.tips[id]?.daily ?? '',
      ])
    })
    for (const text of texte) {
      for (const muster of verboten) {
        expect(muster.test(text), `„${text}" verspricht zu viel`).toBe(false)
      }
    }
  })

  it('sagt in jeder Sprache, wo das Wissen aufhört', () => {
    for (const language of ['de', 'en', 'fr', 'es', 'it', 'pt']) {
      expect(brainCareCopyFor(language).honest.length, language).toBeGreaterThan(40)
      // Jeder Tipp hat in jeder Sprache Text — sonst staende dort eine Luecke.
      for (const id of BRAIN_TIP_IDS) {
        expect(brainCareCopyFor(language).tips[id]?.body.length ?? 0, `${language}/${id}`).toBeGreaterThan(40)
      }
    }
  })

  it('gibt an einem Tag immer denselben Tipp — und über die Woche verschiedene', () => {
    // Sonst wäre „einmal am Tag" eine Lüge: Wer die App dreimal öffnet,
    // bekäme dreimal etwas anderes und würde den Zähler nicht verstehen.
    expect(tipOfDay('2026-09-01')).toBe(tipOfDay('2026-09-01'))

    const woche = new Set(
      ['2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04', '2026-09-05'].map(tipOfDay),
    )
    expect(woche.size).toBeGreaterThan(2)
  })
})
