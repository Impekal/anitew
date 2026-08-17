import { describe, expect, it } from 'vitest'

import {
  gradeRecall,
  normalizeWord,
  splitEntries,
  withinOneEdit,
} from '../../src/core/session/grading.ts'

describe('normalizeWord', () => {
  it('macht Groß- und Kleinschreibung und Satzzeichen egal', () => {
    expect(normalizeWord('  Anker! ')).toBe('anker')
    expect(normalizeWord('Leucht-Turm')).toBe('leuchtturm')
  })

  it('faltet Umlaute und Akzente', () => {
    expect(normalizeWord('Bäcker')).toBe(normalizeWord('backer'))
    expect(normalizeWord('café')).toBe(normalizeWord('cafe'))
    expect(normalizeWord('Straße')).toBe('strasse')
  })

  it('lässt andere Schriften unangetastet', () => {
    expect(normalizeWord('灯台')).toBe('灯台')
  })
})

describe('splitEntries', () => {
  it('zerlegt Zeilen, Kommas und Leerzeichen', () => {
    expect(splitEntries('Anker\nBesen, Krone;  Segel')).toEqual([
      'Anker',
      'Besen',
      'Krone',
      'Segel',
    ])
  })

  it('verschluckt Leerzeilen', () => {
    expect(splitEntries('  \n\n Anker \n\n ')).toEqual(['Anker'])
    expect(splitEntries('')).toEqual([])
  })
})

describe('withinOneEdit', () => {
  it('erkennt einen vertippten Buchstaben', () => {
    expect(withinOneEdit('leuchtturm', 'leuchttarm')).toBe(true)
  })

  it('erkennt einen fehlenden und einen zu viel', () => {
    expect(withinOneEdit('leuchtturm', 'leuchttrm')).toBe(true)
    expect(withinOneEdit('leuchtturm', 'leuchtturms')).toBe(true)
  })

  it('erkennt zwei vertauschte Nachbarn', () => {
    expect(withinOneEdit('blume', 'bulme')).toBe(true)
  })

  it('lässt zwei getrennte Fehler nicht durch', () => {
    expect(withinOneEdit('leuchtturm', 'lauchtterm')).toBe(false)
    // Zwei vertauschte Stellen, aber weit auseinander — nicht eine Änderung.
    expect(withinOneEdit('abcdef', 'bacdfe')).toBe(false)
  })

  it('lässt zwei fehlende Zeichen nicht durch', () => {
    expect(withinOneEdit('leuchtturm', 'leuchtur')).toBe(false)
  })
})

describe('gradeRecall', () => {
  const targets = ['Anker', 'Leuchtturm', 'Bäcker', 'Segel']

  it('zählt genaue Treffer', () => {
    const result = gradeRecall(['Anker', 'Segel'], targets)
    expect(result.correct).toEqual(['Anker', 'Segel'])
    expect(result.missed).toEqual(['Leuchtturm', 'Bäcker'])
    expect(result.extra).toEqual([])
  })

  it('ist bei Schreibweise und Tippfehlern großzügig', () => {
    // Gemessen wird das Gedächtnis, nicht die Rechtschreibung (R-1).
    const result = gradeRecall(['anker', 'leuchttrum', 'Baecker'], targets)
    expect(result.correct).toEqual(['Anker', 'Leuchtturm', 'Bäcker'])
  })

  it('lässt bei kurzen Wörtern keinen Tippfehler durch', () => {
    // Bei „Segel“/„Segeln“ wäre es einer — bei „Igel“/„Egel“ ein anderes Wort.
    const result = gradeRecall(['Egel'], ['Igel'])
    expect(result.correct).toEqual([])
    expect(result.extra).toEqual(['Egel'])
  })

  it('zählt dasselbe Wort nicht zweimal', () => {
    const result = gradeRecall(['Anker', 'anker', 'ANKER'], targets)
    expect(result.correct).toEqual(['Anker'])
    expect(result.extra).toEqual(['anker', 'ANKER'])
  })

  it('sammelt Eingaben, die zu nichts passen', () => {
    const result = gradeRecall(['Anker', 'Elefant'], targets)
    expect(result.correct).toEqual(['Anker'])
    expect(result.extra).toEqual(['Elefant'])
  })

  it('kommt mit gar keiner Eingabe zurecht', () => {
    const result = gradeRecall([], targets)
    expect(result.correct).toEqual([])
    expect(result.missed).toEqual(targets)
  })

  it('erfindet keine Treffer, wenn jemand alles Mögliche eintippt', () => {
    // Eine Bewertung, die bei genug Rateversuchen irgendwann trifft, würde
    // die Zahl schönen — und wäre damit genau die erfundene Zahl aus R-1.
    const noise = ['aaa', 'bbb', 'ccc', 'ddd', 'eee', 'fff']
    expect(gradeRecall(noise, targets).correct).toEqual([])
  })
})
