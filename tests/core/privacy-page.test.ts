import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

// @ts-expect-error — bewusst ein Skript ohne Typdeklaration: Der Wandler
// lebt bei den Build-Skripten, und eine .d.ts für drei Funktionen wäre
// mehr Zeremonie als Nutzen.
import { inline, page, render } from '../../scripts/privacy-page.mjs'

function assertRendered(markdown: string, html: string): void {
  const flat = html.replace(/<[^>]+>/g, '')
  for (const heading of markdown.match(/^## .+$/gm) ?? []) {
    const text = heading.replace(/^## /, '').replace(/\*\*/g, '')
    expect(flat, `Abschnitt fehlt: ${text}`).toContain(text.split('—')[0]?.trim() ?? text)
  }
  expect(html).not.toMatch(/\*\*/)
  expect(html).not.toMatch(/^\|/m)
  expect(html).not.toMatch(/^- /m)
}

describe('die öffentlichen Rechtstext-Seiten', () => {
  it('wandelt die Zeilenformen: fett, Code, Link', () => {
    expect(inline('**stark** und `wort` und [dahin](https://example.org)')).toBe(
      '<strong>stark</strong> und <code>wort</code> und <a href="https://example.org">dahin</a>',
    )
  })

  it('lässt kein HTML aus dem Text durch', () => {
    expect(inline('<script>böse()</script>')).not.toContain('<script>')
  })

  it('trägt die ganze PRIVACY.md und verlinkt Impressum und Datenschutz', () => {
    const markdown = readFileSync('docs/PRIVACY.md', 'utf8')
    const html = page(render(markdown)) as string
    assertRendered(markdown, html)
    expect(html).toContain('Drive-Abgleich')
    expect(html).toContain('Foto auswerten')
    expect(html).toContain('Verantwortlicher für den Datenschutz')
    expect(html).toContain('href="/impressum.html"')
    expect(html).toContain('href="/datenschutz.html"')
  })

  it('erzeugt ein eigenständiges Impressum mit korrektem Seitentitel', () => {
    const markdown = readFileSync('docs/IMPRESSUM.md', 'utf8')
    const html = page(render(markdown), 'Impressum') as string
    assertRendered(markdown, html)
    expect(html).toContain('<title>ANITEW · Impressum</title>')
    expect(html).toContain('§ 5 Digitale-Dienste-Gesetz')
    expect(html).toContain('href="/datenschutz.html"')
  })

  it('verhindert einen Release mit Impressums-Platzhaltern', () => {
    const legal = `${readFileSync('docs/IMPRESSUM.md', 'utf8')}\n${readFileSync('docs/PRIVACY.md', 'utf8')}`
    expect(legal).not.toMatch(/\[(?:VOLLSTÄNDIGER NAME|STRASSE UND HAUSNUMMER|PLZ UND ORT|E-MAIL-ADRESSE)/)
  })
})
