import { describe, expect, it } from 'vitest'

import { NAVIGATION_DENYLIST } from '../../scripts/navigation-denylist.ts'

/**
 * Der PWA-Navigations-Fallback und die Rechtstexte.
 *
 * Dieser Test ersetzt einen, den es nicht geben kann: Der Fehler vom
 * 30.08. — „Impressum antippen bringt mich auf den Startbildschirm zurück" —
 * ist in `vite preview` **nicht** reproduzierbar. Cloudflare Static Assets
 * leitet `/impressum.html` per 307 auf `/impressum` um; `vite preview` liefert
 * die Datei direkt aus. Ein Durchlauf im Browser gegen die Testumgebung war
 * deshalb grün, während der Weg auf dem Telefon kaputt war.
 *
 * Nachgemessen wurde er gegen `wrangler dev --local`, also gegen das echte
 * Asset-Verhalten. Was dabei herauskam, lässt sich hier ohne Server prüfen:
 * Die Sperrliste muss **beide** Schreibweisen kennen. Trifft sie die
 * umgeleitete Adresse nicht, fängt der Service Worker die Navigation ab und
 * liefert die App-Shell.
 */
const treffer = (pfad: string): boolean =>
  NAVIGATION_DENYLIST.some((muster) => muster.test(pfad))

describe('Navigations-Sperrliste des Service Workers', () => {
  it.each([
    '/impressum.html',
    // Die Form, auf die Cloudflare umleitet. Genau sie fehlte.
    '/impressum',
    '/datenschutz.html',
    '/datenschutz',
  ])('%s wird nicht von der App-Shell beantwortet', (pfad) => {
    expect(treffer(pfad)).toBe(true)
  })

  it.each([
    '/oauth/google/start',
    '/push/subscribe',
  ])('%s bleibt ein Worker-Endpunkt', (pfad) => {
    expect(treffer(pfad)).toBe(true)
  })

  /*
   * Die Gegenrichtung ist genauso wichtig. Eine zu weit gefasste Sperrliste
   * nähme der App ihren eigenen Fallback: Ein Neuladen auf einer Unterseite
   * käme dann nicht mehr bei der App an, sondern beim Netz — und offline gar
   * nicht mehr.
   */
  it.each([
    '/',
    '/index.html',
    '/settings',
    '/impressum-archiv',
    '/datenschutzbeauftragter',
  ])('%s wird weiterhin von der App beantwortet', (pfad) => {
    expect(treffer(pfad)).toBe(false)
  })
})
