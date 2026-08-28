import { describe, expect, it } from 'vitest'

import { isPortableSettingKey } from '../../src/core/backupSettings.ts'

describe('portable Sicherungseinstellungen', () => {
  it('hält sämtliche KI-Schlüssel auf dem Gerät', () => {
    expect(isPortableSettingKey('coach.key')).toBe(false)
    expect(isPortableSettingKey('coach.key.gemini')).toBe(false)
    expect(isPortableSettingKey('coach.key.openai')).toBe(false)
  })

  it('hält den gesamten technischen Google-Drive-Zustand auf dem Gerät', () => {
    expect(isPortableSettingKey('sync.on')).toBe(false)
    expect(isPortableSettingKey('sync.lastAt')).toBe(false)
    expect(isPortableSettingKey('sync.account')).toBe(false)
    expect(isPortableSettingKey('sync.accountName')).toBe(false)
    expect(isPortableSettingKey('sync.clientId')).toBe(false)
  })

  it('lässt echte Nutzerpräferenzen und Lernzustand in die Sicherung', () => {
    expect(isPortableSettingKey('coach.provider')).toBe(true)
    expect(isPortableSettingKey('language')).toBe(true)
    expect(isPortableSettingKey('sound')).toBe(true)
    expect(isPortableSettingKey('memory.graph')).toBe(true)
    expect(isPortableSettingKey('technique.major.taught')).toBe(true)
  })
})
