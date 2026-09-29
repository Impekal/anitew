import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'

import { faceFor } from '../../src/core/content/faces.ts'
import { beardFits, namePool } from '../../src/core/content/names.ts'
import { gradePrompted } from '../../src/core/session/grading.ts'

describe('lokale Portraitfotos', () => {
  const names = [...new Set(['de', 'en', 'fr', 'es'].flatMap(language => namePool(language as 'de')))]
  it('ordnet jedem vorhandenen Namen ein eigenes stabiles Foto zu', () => {
    const faces = names.map(faceFor)
    expect(faces.every(Boolean)).toBe(true)
    expect(new Set(faces.map(face => face?.src)).size).toBe(names.length)
    for (const name of names) expect(faceFor(name)).toEqual(faceFor(name))
  })
  it('behandelt fremde Namen sicher, ohne fremde Bilder oder Antwort im Ersatzbild', () => {
    for (const name of ['unknown', '__proto__', 'constructor', 'https://example.com/a.jpg']) {
      expect(faceFor(name)).toBeUndefined()
    }
  })
  it('liefert vorhandene, verschiedene WebP-Dateien mit Quellen und Lizenzen', () => {
    const manifest = JSON.parse(readFileSync('public/portraits/manifest.json', 'utf8'))
    expect(manifest).toHaveLength(names.length)
    const hashes = new Set<string>()
    let bytes = 0
    for (const name of names) {
      const face = faceFor(name)!
      expect(face.src).toMatch(/^\/portraits\/pexels-\d+\.webp$/)
      const file = readFileSync(`public${face.src}`)
      expect(file.subarray(8, 12).toString()).toBe('WEBP')
      const hash = createHash('sha256').update(file).digest('hex')
      hashes.add(hash)
      bytes += file.length
      const credit = manifest.find((entry: { name: string }) => entry.name === name)
      expect(credit.sha256).toBe(hash)
      expect(credit.source).toMatch(/^https:\/\/www\.pexels\.com\/photo\//)
      expect(credit.photographer.length).toBeGreaterThan(1)
      expect(credit.license).toBe('Pexels License')
    }
    expect(hashes.size).toBe(names.length)
    expect(bytes).toBeLessThan(3 * 1024 * 1024)
  })
})

describe('der Namensvorrat (L6)', () => {
  it('mischt beide Sorten, statt sie hintereinander zu legen', () => {
    /*
     * Vorher lagen sie abwechselnd in einer Liste — das sah aus wie Absicht,
     * war aber nur die Reihenfolge beim Aufschreiben, und im englischen Pool
     * stimmte sie ab „Ximena“ schon nicht mehr. Jetzt kommt die Abwechslung
     * aus der Struktur, und dieser Test hält sie fest: In keinem Ausschnitt
     * von vier Namen stehen vier Namen derselben Sorte.
     */
    for (const language of ['de', 'en'] as const) {
      const pool = namePool(language)
      for (let i = 0; i + 4 <= pool.length; i++) {
        const window = pool.slice(i, i + 4).map(beardFits)
        expect(new Set(window).size, `${language} ab ${i}`).toBe(2)
      }
    }
  })

  it('kennt einen unbekannten Namen nicht und lässt ihm den Bart', () => {
    // Die harmlosere Richtung: Ein Bart, der nicht passt, ist ein schiefes
    // Bild; eine Regel, die stillschweigend alle abschaltet, wäre ein
    // verschwundenes Merkmal.
    expect(beardFits('Zzyzx')).toBe(true)
  })
})

describe('der gestützte Abruf (D9)', () => {
  const targets = ['Rosalind', 'Anton', 'Dilara']

  it('ordnet Position für Position zu', () => {
    const result = gradePrompted(['Rosalind', '', 'Dilara'], targets)
    expect(result.correct).toEqual(['Rosalind', 'Dilara'])
    expect(result.missed).toEqual(['Anton'])
  })

  it('verzeiht einen Tippfehler bei langen Namen', () => {
    expect(gradePrompted(['Rosalinde', 'Anton', 'Dilara'], targets).correct).toHaveLength(3)
  })

  it('zählt eine Antwort nicht für die falsche Stelle', () => {
    // Vertauschte Antworten sind zwei Fehler, keine zwei Treffer — beim
    // gestützten Abruf ist die Zuordnung die halbe Aufgabe.
    const result = gradePrompted(['Anton', 'Rosalind', 'Dilara'], targets)
    expect(result.correct).toEqual(['Dilara'])
  })

  it('nimmt zu kurze Antwortlisten hin', () => {
    // Der Normalfall, wenn die Zeit ausläuft.
    expect(gradePrompted(['Rosalind'], targets).missed).toEqual(['Anton', 'Dilara'])
  })
})
