import { describe, expect, it } from 'vitest'

import {
  ENCODING_LESSONS,
  encodingModuleOf,
  nextEncodingLesson,
} from '../../src/core/technique/encodings.ts'

/**
 * Die Einpräge-Lektionen (D5 · D-013).
 *
 * Die Regeln: je Technik **eine** Lektion, nie ohne ihr Modul (Unterricht
 * ohne Anlass), feste Reihenfolge Geschichte→Verknüpfung — und „fehlt der
 * Wert, wird nicht gelehrt“ (dieselbe Vorsicht wie beim Palast).
 */
describe('die Einpräge-Lektionen', () => {
  const all = ['words', 'faces', 'numbers'] as const

  it('lehrt zuerst die Geschichte, dann die Verknüpfung', () => {
    expect(nextEncodingLesson({ storyTaught: false, linkTaught: false }, all)).toBe('story')
    expect(nextEncodingLesson({ storyTaught: true, linkTaught: false }, all)).toBe('link')
    expect(nextEncodingLesson({ storyTaught: true, linkTaught: true }, all)).toBeUndefined()
  })

  it('lehrt nie ohne das Modul, in dem die Technik sofort geübt wird', () => {
    // Heute keine Wörter → keine Geschichten-Lektion; die Verknüpfung darf.
    expect(nextEncodingLesson({ storyTaught: false, linkTaught: false }, ['faces'])).toBe('link')
    expect(nextEncodingLesson({ storyTaught: false, linkTaught: false }, ['numbers'])).toBeUndefined()
  })

  it('lehrt nicht, wenn der Lernstand unbekannt ist — wie beim Palast', () => {
    expect(nextEncodingLesson({}, all)).toBeUndefined()
    expect(nextEncodingLesson({ linkTaught: false }, all)).toBe('link')
  })

  it('nennt für jede Lektion ihr Anwendungsmodul', () => {
    for (const lesson of ENCODING_LESSONS) {
      expect(['words', 'faces']).toContain(encodingModuleOf(lesson))
    }
  })
})
