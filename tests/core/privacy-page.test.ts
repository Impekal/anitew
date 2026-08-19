import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

// @ts-expect-error — bewusst ein Skript ohne Typdeklaration: Der Wandler
// lebt bei den Build-Skripten, und eine .d.ts für drei Funktionen wäre
// mehr Zeremonie als Nutzen.
import { inline, page, render } from '../../scripts/privacy-page.mjs'

/**
 * Die öffentliche Datenschutz-Seite (N10).
 *
 * Die Wahrheit liegt in `docs/PRIVACY.md`; die Seite wird daraus erzeugt.
 * Geprüft wird, dass der kleine Wandler genau das Markdown der Datei
 * wirklich trägt — und dass im Ergebnis keine rohen Markdown-Reste stehen,
 * die Googles Prüfern (und Menschen) entgegenblinken würden.
 */
describe('die Datenschutz-Seite', () => {
  it('wandelt die Zeilenformen: fett, Code, Link', () => {
    expect(inline('**stark** und `wort` und [dahin](https://example.org)')).toBe(
      '<strong>stark</strong> und <code>wort</code> und <a href="https://example.org">dahin</a>',
    )
  })

  it('lässt kein HTML aus dem Text durch', () => {
    expect(inline('<script>böse()</script>')).not.toContain('<script>')
  })

  it('trägt die ganze PRIVACY.md ohne rohe Markdown-Reste', () => {
    const markdown = readFileSync('docs/PRIVACY.md', 'utf8')
    const html = page(render(markdown)) as string

    // Jede Abschnittsüberschrift kommt an — verglichen ohne Auszeichnung,
    // denn „**nicht**“ wird im Ergebnis zu Recht ein <strong>.
    const flat = html.replace(/<[^>]+>/g, '')
    for (const heading of markdown.match(/^## .+$/gm) ?? []) {
      const text = heading.replace(/^## /, '').replace(/\*\*/g, '')
      expect(flat, `Abschnitt fehlt: ${text}`).toContain(text.split('—')[0]?.trim() ?? text)
    }
    // Und nichts bleibt unverdaut stehen.
    expect(html).not.toMatch(/\*\*/)
    expect(html).not.toMatch(/^\|/m)
    expect(html).not.toMatch(/^- /m)
    // Die zwei freiwilligen Übertragungen (D-031/D-033) stehen auch hier.
    expect(html).toContain('Drive-Abgleich')
    expect(html).toContain('Gemini')
  })
})
