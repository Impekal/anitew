import { describe, expect, it } from 'vitest'

import {
  isRightToLeft,
  matchLanguage,
  resolveLanguage,
} from '../../src/core/language.ts'

describe('matchLanguage', () => {
  it('erkennt regionale Varianten', () => {
    expect(matchLanguage('de-AT')).toBe('de')
    expect(matchLanguage('pt-BR')).toBe('pt')
    expect(matchLanguage('zh-Hant-TW')).toBe('zh')
    expect(matchLanguage('EN_US')).toBe('en')
  })

  it('lässt Unbekanntes unbekannt', () => {
    expect(matchLanguage('sv')).toBeUndefined()
    expect(matchLanguage('')).toBeUndefined()
    expect(matchLanguage('   ')).toBeUndefined()
  })
})

describe('resolveLanguage', () => {
  it('übernimmt beim ersten Start die Systemsprache (D-007)', () => {
    expect(resolveLanguage(undefined, ['de-DE', 'en-US'])).toBe('de')
    expect(resolveLanguage(undefined, ['ja-JP'])).toBe('ja')
  })

  it('nimmt die erste Systemsprache, die wir anbieten', () => {
    expect(resolveLanguage(undefined, ['sv-SE', 'da-DK', 'nl-NL'])).toBe('nl')
  })

  it('fällt auf Englisch zurück, wenn wir keine davon sprechen', () => {
    expect(resolveLanguage(undefined, ['sv-SE'])).toBe('en')
    expect(resolveLanguage(undefined, [])).toBe('en')
  })

  it('gibt der eigenen Wahl Vorrang vor dem System', () => {
    expect(resolveLanguage('tr', ['de-DE'])).toBe('tr')
  })

  it('fragt bei einer unbrauchbaren gespeicherten Wahl wieder das System', () => {
    // Etwa nach einem Datenfehler oder einer entfernten Sprache — stumm auf
    // Englisch zu springen wäre für einen deutschen Nutzer schlicht falsch.
    expect(resolveLanguage('klingon', ['de-DE'])).toBe('de')
  })
})

describe('isRightToLeft', () => {
  it('kennt Arabisch', () => {
    expect(isRightToLeft('ar')).toBe(true)
    expect(isRightToLeft('de')).toBe(false)
    expect(isRightToLeft('ja')).toBe(false)
  })
})
