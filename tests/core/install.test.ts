import { describe, expect, it } from 'vitest'

import { installAdvice } from '../../src/core/index.ts'

/**
 * Der Weg auf den Startbildschirm (Backlog Q5).
 *
 * Die Regel beruht auf Gerätemerkmalen, und genau deshalb steht sie im Kern:
 * Eine Entscheidung, die man sonst nur auf einem echten iPhone prüfen könnte,
 * lässt sich hier mit einer Zeichenkette prüfen (D-010).
 */

const IPHONE =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'
const IPAD =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15 Mobile'
const MAC =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15'
const ANDROID =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36'

describe('was zur Installation zu sagen ist', () => {
  it('schweigt, sobald die App vom Startbildschirm läuft', () => {
    // Dann ist die Gefahr vorbei, und ein Hinweis wäre nur noch Möbel (G-2).
    for (const agent of [IPHONE, IPAD, ANDROID, MAC]) {
      expect(installAdvice(agent, true)).toEqual({ kind: 'none' })
    }
  })

  it('warnt auf iPhone und iPad im Browser', () => {
    /*
     * Der Grund ist kein Komfort: Safari räumt den Speicher einer Seite auf,
     * die sieben Tage lang nicht benutzt wurde. Für eine App aus Terminen
     * über Wochen ist das der Totalverlust (D-004, N2).
     */
    expect(installAdvice(IPHONE, false)).toEqual({ kind: 'ios' })
    // Das iPad meldet sich seit iPadOS 13 als „Macintosh“ und ist nur noch
    // daran zu erkennen, dass es Berührungen kennt.
    expect(installAdvice(IPAD, false)).toEqual({ kind: 'ios' })
  })

  it('warnt anderswo nicht', () => {
    /*
     * Auf Android und am Schreibtisch bleibt der Speicher auch im Tab. Dort
     * wäre der Hinweis eine Aufforderung ohne Anlass — und die schließt K7
     * aus. Der Browser lädt ohnehin selbst zur Installation ein.
     */
    expect(installAdvice(ANDROID, false)).toEqual({ kind: 'browser' })
    // Und ein echter Mac ist kein iPad: Safari dort räumt eine benutzte Seite
    // nicht nach sieben Tagen weg.
    expect(installAdvice(MAC, false)).toEqual({ kind: 'browser' })
  })
})
