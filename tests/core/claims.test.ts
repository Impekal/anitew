import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { NAVIGATION_DENYLIST } from '../../scripts/navigation-denylist.ts'

/**
 * Die Sperrliste als Test (Backlog F7, R-2, R5).
 *
 * F7 verlangt, dass Marketing- und Store-Texte an F1–F6 gebunden sind. Die
 * Bindung selbst ist eine Tabelle in `docs/STORE.md` und braucht einen
 * Menschen. **Was keinen Menschen braucht, ist die Untergrenze:** Ein
 * Heilversprechen oder ein „wissenschaftlich bewiesen“ darf gar nicht erst
 * durch die Prüfung kommen, in keiner Sprache und auf keiner Fläche.
 *
 * Geprüft werden genau die Flächen, auf denen ANITEW über sich selbst spricht,
 * *bevor* jemand die App benutzt — dort ist die Versuchung am größten, und
 * dort schaut später niemand mehr hin: die Beschreibung in `index.html`, die
 * im Manifest (die in den Play-Store-Eintrag wandert), die Store-Texte selbst
 * und alle Texte in der App.
 *
 * Warum kein einfaches „verbotene Wörter“: „klüger“ und „smarter“ *stehen* in
 * der App — in dem Satz, dass Gehirnjogging genau das nicht macht. Eine
 * Sperrliste, die den Widerspruch nicht vom Versprechen unterscheidet, würde
 * ausgerechnet die ehrlichste Stelle verbieten. Gesperrt ist deshalb nur, was
 * sich nicht ehrlich verwenden lässt.
 */

const ROOT = fileURLToPath(new URL('../../', import.meta.url))

/** Die Flächen, auf denen ANITEW über sich selbst spricht. */
const SURFACES = [
  'index.html',
  'vite.config.ts',
  'docs/STORE.md',
  'src/i18n/de.ts',
  'src/i18n/en.ts',
  /*
   * Die Tipps von „Geistig aktiv bleiben" liegen in einer eigenen Datei,
   * damit sie nicht im Kaltstart haengen (P4). Sie stehen trotzdem in der
   * App — also gilt die Sperrliste dort genauso. Ohne diese Zeile waere das
   * Auslagern ein Weg an der Regel vorbei.
   */
  'src/i18n/brainCareCopy.ts',
]

/**
 * Ausdrücke, die in keinem Text vorkommen dürfen.
 *
 * Drei Sorten: Heilversprechen (R5), Behauptungen über Beweislage, die es
 * nicht gibt, und Zahlen ohne Messung (R-1).
 */
const FORBIDDEN: readonly RegExp[] = [
  /\bDemenz\b/i,
  /\bdementia\b/i,
  /\bAlzheimer\b/i,
  /\bheilt\b|\bHeilung\b/i,
  /\bcures?\b/i,
  /\bTherapie\b|\btherapeutisch/i,
  /\btherapy\b|\btherapeutic\b/i,
  /\bgarantiert\b/i,
  /\bguaranteed\b/i,
  /wissenschaftlich (bewiesen|erwiesen)/i,
  /scientifically proven/i,
  /\bklinisch/i,
  /\bclinically\b/i,
  /doppelt so (viel|gut|schnell)/i,
  /twice as (much|good|fast)/i,
]

function textOf(file: string): string {
  return readFileSync(join(ROOT, file), 'utf8')
}

/**
 * Der Text einer Fläche, ohne die Sperrliste selbst.
 *
 * `docs/STORE.md` **muss** die verbotenen Ausdrücke nennen — sonst wüsste
 * beim Texten niemand, welche gemeint sind. Eine Regel, die sich nicht
 * aussprechen darf, ist keine Regel, sondern eine Falle. Geprüft wird
 * deshalb alles davor: die Texte, die tatsächlich veröffentlicht werden.
 */
function marketingTextOf(file: string): string {
  const text = textOf(file)
  const list = text.indexOf('## Sperrliste')
  return list === -1 ? text : text.slice(0, list)
}

describe('was ANITEW über sich selbst sagt', () => {
  it.each(SURFACES)('hält %s frei von gesperrten Versprechen', (file) => {
    const text = marketingTextOf(file)
    for (const pattern of FORBIDDEN) {
      expect(pattern.test(text), `${file} enthält ${pattern}`).toBe(false)
    }
  })

  it('setzt Hervorhebungen paarweise', () => {
    /*
     * Zwei Sterne machen fett (`app/Emphasis.tsx`). Ein einzelner Stern bleibt
     * als Stern stehen und sieht aus wie ein Tippfehler — genau das stand
     * schon einmal auf dem Bildschirm, in zwei Texten, die niemand mehr
     * gelesen hat.
     */
    for (const file of ['src/i18n/de.ts', 'src/i18n/en.ts']) {
      const text = textOf(file)
      for (const line of text.split('\n')) {
        // Kommentare bleiben draußen — `/**` ist ein Kommentaranfang und
        // keine halbe Hervorhebung.
        const start = line.trimStart()
        if (start.startsWith('*') || start.startsWith('//') || start.startsWith('/*')) continue
        if (!line.includes("'")) continue
        const stars = line.split('**').length - 1
        expect(stars % 2, `ungerade Hervorhebung: ${line.trim()}`).toBe(0)
      }
    }
  })

  it('nennt die Sperrliste auch im Dokument, nicht nur im Test', () => {
    // Sonst steht die Regel an einer Stelle, an der sie beim Texten niemand
    // liest — und ein Test, den man erst beim Fehlschlag entdeckt, ist eine
    // schlechte Anleitung.
    const store = textOf('docs/STORE.md')
    expect(store).toContain('Sperrliste')
    expect(store).toContain('R5')
  })

  it('führt jede Aussage der Store-Texte auf ihre Deckung zurück (F7)', () => {
    const store = textOf('docs/STORE.md')
    for (const reference of ['F2a', 'F2b', 'F3', 'F4', 'science.everyday', 'D-002']) {
      expect(store, `Deckungstabelle ohne ${reference}`).toContain(reference)
    }
  })

  it('sagt auf der ersten Fläche, was die App ist — mit dem Werbespruch', () => {
    /*
     * Die Beschreibung in `index.html` und im Manifest ist das Erste, was ein
     * Mensch sieht, und das Einzige, was eine Suchmaschine sieht. Sie muss
     * denselben Satz tragen wie die App selbst; zwei verschiedene
     * Selbstbeschreibungen sind der Anfang davon, dass eine davon nicht mehr
     * stimmt.
     */
    const tagline = 'Gedächtnis ist Technik, kein Talent.'
    expect(textOf('index.html')).toContain(tagline)
    expect(textOf('vite.config.ts')).toContain(tagline)
    expect(textOf('src/i18n/de.ts')).toContain(tagline)
  })
})

describe('die Datenschutzerklärung (R4)', () => {
  it('sagt, was gespeichert wird — und was nicht passiert', () => {
    const privacy = textOf('docs/PRIVACY.md')
    for (const promise of [
      'kein Konto',
      'keine Werbung',
      'keine Tracker',
      'IndexedDB',
      'Sicherung',
    ]) {
      expect(privacy.toLowerCase(), `ohne „${promise}“`).toContain(promise.toLowerCase())
    }
  })

  it('verschweigt das Unbequeme nicht', () => {
    /*
     * Zwei Stellen, an denen eine Datenschutzerklärung üblicherweise
     * schweigt: dass beim Ausliefern der App Serverdaten anfallen, und was
     * sich ändern würde, wenn geplante Funktionen kommen. Beides steht drin
     * — und ein Test hält es fest, damit es beim nächsten Umschreiben nicht
     * herausfällt.
     */
    const privacy = textOf('docs/PRIVACY.md')
    expect(privacy).toContain('IP-Adresse')
    expect(privacy).toContain('Klartext')
    /*
     * Seit D-031/D-033 sind die zwei Übertragungen keine Pläne mehr,
     * sondern Wirklichkeit — die Erklärung muss beide benennen, samt
     * Empfänger und der Zusage, dass nichts davon Voreinstellung ist.
     */
    expect(privacy).toMatch(/Drive-Abgleich/)
    /*
     * Alle wählbaren Coach-Anbieter müssen benannt sein — abgelesen aus dem
     * Code statt hier abgeschrieben: Als OpenAI dazukam, hat eine
     * hartkodierte Fünferliste den sechsten Anbieter monatelang übersehen.
     */
    const coachSource = textOf('src/platform/web/coach.ts')
    const providersBlock = /COACH_PROVIDERS = \[([^\]]*)\]/u.exec(coachSource)?.[1] ?? ''
    const providerIds = [...providersBlock.matchAll(/'([a-z]+)'/gu)].map((match) => match[1])
    expect(providerIds.length).toBeGreaterThanOrEqual(6)
    const providerNames: Record<string, string> = {
      gemini: 'Gemini',
      anthropic: 'Anthropic',
      openai: 'OpenAI',
      groq: 'Groq',
      openrouter: 'OpenRouter',
      mistral: 'Mistral',
    }
    for (const id of providerIds) {
      const name = providerNames[id as string]
      expect(name, `unbekannter Anbieter ${id} — Namenszuordnung ergänzen`).toBeDefined()
      expect(privacy, `ohne ${name}`).toContain(name as string)
    }
    // Die Fotoanalyse nennt ihre drei Empfänger ausdrücklich.
    expect(privacy).toMatch(/Fotoanalyse[^.]*Gemini, Anthropic oder OpenAI/u)
    expect(privacy).toMatch(/aus,\s*bis du sie anfasst/)
    /*
     * Web Push ist die dritte Übertragung: Die Erklärung muss die
     * Push-Adresse, den Speicherort (Durable Object) und die konkrete
     * Cookie-Laufzeit der Google-Sitzung nennen — der Worker existiert,
     * also darf kein Text mehr „keinen Server“ behaupten.
     */
    expect(privacy).toContain('Push-Adresse')
    expect(privacy).toContain('Durable Object')
    expect(privacy).toContain('180 Tage')
    expect(privacy).not.toMatch(/keinen Server/u)
  })

  it('hält auch hier die Sperrliste ein (R5)', () => {
    // Dieselbe Prüfung wie für die Marketingflächen: Ein Heilversprechen in
    // einer Datenschutzerklärung wäre besonders absurd — und genau deshalb
    // fällt es dort niemandem auf.
    const privacy = textOf('docs/PRIVACY.md')
    for (const pattern of FORBIDDEN) {
      expect(pattern.test(privacy), `PRIVACY.md enthält ${pattern}`).toBe(false)
    }
  })
})

describe('die Store-Texte bleiben ehrlich', () => {
  it('behauptet keinen serverlosen Betrieb mehr', () => {
    const store = textOf('docs/STORE.md')
    expect(store).not.toMatch(/ohne Server/u)
    expect(store).not.toMatch(/no server/u)
  })
})

describe('die Splash-Signatur', () => {
  it('bleibt bewusst englisch — nur im Splash, nie im Wörterbuch', () => {
    /*
     * „MEMORIZE · RECALL · RETAIN · MASTER“ ist Marke, keine Kopie: Sie
     * steht fest englisch in index.html und darf von keinem
     * Übersetzungsdurchgang „vervollständigt“ werden.
     */
    const signature = 'MEMORIZE · RECALL · RETAIN · MASTER'
    expect(textOf('index.html')).toContain(signature)
    expect(textOf('src/i18n/de.ts')).not.toContain(signature)
    expect(textOf('src/i18n/en.ts')).not.toContain(signature)
  })
})

describe('die Installationsanleitung (Q5)', () => {
  it('nennt den Grund vor dem Weg', () => {
    /*
     * Ein „Installiere die App!“ ohne Grund wäre die Aufforderung, die K7
     * ausschließt. Der Grund ist eine Tatsache über iOS und keine Werbung —
     * und er steht in der Anleitung vor den Schritten.
     */
    const install = textOf('docs/INSTALL.md')
    const reason = install.indexOf('sieben Tagen')
    const steps = install.indexOf('Zum Home-Bildschirm')
    expect(reason).toBeGreaterThan(-1)
    expect(steps).toBeGreaterThan(reason)
  })

  it('nennt die Sicherung als den zweiten Weg', () => {
    // Wer nicht installieren will, soll nicht ohne Ausweg dastehen.
    expect(textOf('docs/INSTALL.md')).toMatch(/Sicherung ist der zweite Weg/)
  })

  it('verspricht durch die Installation nichts, was sie nicht tut', () => {
    const install = textOf('docs/INSTALL.md')
    expect(install).toMatch(/Sie legt kein Konto an/)
    // Seit dem OAuth-/Push-Worker wäre „Es gibt keinen Server“ eine
    // Falschaussage. Die ehrliche Fassung ist jetzt festgeschrieben.
    expect(install).toMatch(/keine Trainingsdaten/)
    expect(install).toMatch(/ohne Nutzerdatenbank/)
    expect(install).not.toMatch(/Es gibt keinen Server/)
    for (const pattern of FORBIDDEN) {
      expect(pattern.test(install), `INSTALL.md enthält ${pattern}`).toBe(false)
    }
  })
})

describe('Datenschutz-Aussagen sind an den Code gebunden (Runde 2, ergänzt in Runde 3)', () => {
  /*
   * Diese Wächter prüfen, dass Text und Code nicht auseinanderlaufen — mehr
   * können sie nicht. Dass die Zusagen tatsächlich **eingehalten** werden,
   * beweisen die Verhaltenstests in `tests/worker/privacyGuarantees.test.ts`
   * (R3-07, Runde 3): Sie spielen die Sätze aus §7 und §9 als echte Abläufe
   * durch. Genau diese Arbeitsteilung hat Runde 3 nötig gemacht — ein
   * Treffer auf `PENDING_TTL_MS` bewies eben nicht, dass die Frist hält.
   */
  const privacy = textOf('docs/PRIVACY.md')
  const worker = textOf('worker/index.js')

  it('Sicherung ohne Schlüssel: Versprechen und Filter existieren beide', async () => {
    const { portableSetting } = await import('../../src/core/backup.ts')
    // Der Filter im Code …
    expect(portableSetting('coach.key')).toBe(false)
    expect(portableSetting('coach.key.gemini')).toBe(false)
    expect(portableSetting('coach.key.openai')).toBe(false)
    expect(portableSetting('sync.account')).toBe(false)
    expect(portableSetting('sync.accountName')).toBe(false)
    expect(portableSetting('language')).toBe(true)
    expect(portableSetting('memory.graph')).toBe(true)
    // … und das Versprechen im Text.
    expect(privacy).toMatch(/Nicht in der Sicherung enthalten/u)
    expect(privacy).toMatch(/KI-API-Schlüssel/u)
  })

  it('180-Tage-Sitzung: absolute Grenze im Worker, ehrlicher Satz im Text', () => {
    // Der Worker versiegelt einen absoluten Ablauf und verlängert ihn nie.
    expect(worker).toMatch(/SESSION_MAX_AGE_MS = 1000 \* 60 \* 60 \* 24 \* 180/u)
    expect(worker).toMatch(/sessionExpiresAt/u)
    // Und PRIVACY behauptet keine rollierende Laufzeit mehr.
    expect(privacy).toMatch(/wird\s+durch Nutzung \*\*nicht\*\* verlängert/u)
    expect(privacy).toMatch(/180 Tage/u)
  })

  it('Zustellnotizen: Ablauffristen im Worker decken die Fristen im Text', () => {
    expect(worker).toMatch(/PENDING_TTL_MS = \{ daily: 24 \* 3_600_000, benchmark: 60 \* 60_000 \}/u)
    expect(privacy).toMatch(/längstens (aber )?24 Stunden/u)
    expect(privacy).toMatch(/60 Minuten/u)
  })

  it('Push-Relais: Der Worker nimmt nur echte Pushdienste als Ziel an', () => {
    expect(worker).toMatch(/fcm\.googleapis\.com/u)
    expect(worker).toMatch(/updates\.push\.services\.mozilla\.com/u)
    expect(worker).toMatch(/web\.push\.apple\.com/u)
    expect(worker).toMatch(/\.notify\.windows\.com/u)
    expect(worker).toMatch(/allowedPushHost/u)
  })
})

describe('die eigenen Seiten neben der App (Runde 3)', () => {
  /*
   * Impressum und Datenschutz sind echte Dateien, keine App-Ansichten. In
   * der installierten PWA beantwortete der Navigations-Fallback sie mit der
   * gecachten index.html — ein Tipp darauf sah aus, als starte ANITEW neu
   * (auf echtem iPhone gefunden). Der Wächter bindet die Ausnahme an die
   * Adressen, die der Fuß und das Installations-Gate wirklich verlinken.
   */
  /*
   * Hier stand ein Wächter, der den **Text** der Sperrliste aus
   * `vite.config.ts` gelesen und auf `impressum\.html` geprüft hat. Er war
   * grün — und der Weg war trotzdem kaputt. Ein Test, der eine Schreibweise
   * abschreibt statt eine Wirkung zu prüfen, schreibt den Fehler fest,
   * statt ihn zu finden: Cloudflare leitet `/impressum.html` auf
   * `/impressum` um, und genau diese Form fehlte.
   *
   * Deshalb wird jetzt die Liste selbst benutzt und gefragt, ob sie die
   * Adressen trifft, die tatsächlich vorkommen. Die Herleitung steht in
   * `scripts/navigation-denylist.ts`, die Fälle in
   * `tests/core/navigationDenylist.test.ts`.
   */
  const trifft = (pfad: string): boolean =>
    NAVIGATION_DENYLIST.some((muster) => muster.test(pfad))

  it('nimmt Impressum und Datenschutz vom PWA-Navigations-Fallback aus', () => {
    expect(trifft('/impressum.html')).toBe(true)
    expect(trifft('/datenschutz.html')).toBe(true)
    // Die Worker-Endpunkte bleiben ebenfalls ausgenommen.
    expect(trifft('/oauth/google/start')).toBe(true)
    expect(trifft('/push/subscribe')).toBe(true)
  })

  it('verlinkt genau die Adressen, die auch ausgenommen sind', () => {
    for (const source of ['src/main.tsx', 'src/app/install/InstallGate.tsx']) {
      const text = textOf(source)
      for (const href of text.matchAll(/href="(\/[a-z]+)\.html"/gu)) {
        const ohneEndung = href[1] as string
        expect(
          trifft(`${ohneEndung}.html`),
          `${source} verlinkt ${ohneEndung}.html, aber der Fallback fängt es ab`,
        ).toBe(true)
        /*
         * Und die Form, auf die Cloudflare umleitet. Ohne sie liefert der
         * Service Worker nach der Umleitung die App-Shell — der Nutzer landet
         * auf dem Startbildschirm, ohne Text. Genau das war die Meldung.
         */
        expect(
          trifft(ohneEndung),
          `${source} verlinkt ${ohneEndung}.html; die Umleitung auf ${ohneEndung} wird abgefangen`,
        ).toBe(true)
      }
    }
  })

  it('erzeugt beide Seiten aus den Dokumenten, mit Weg zurück in die App', () => {
    const generator = textOf('scripts/privacy-page.mjs')
    expect(generator).toMatch(/IMPRESSUM\.md/u)
    expect(generator).toMatch(/PRIVACY\.md/u)
    /*
     * Ziel muss `public/` sein, nicht `dist/`. Aus `dist/` geschrieben kämen
     * die Seiten nach dem Precache und wären offline nicht da — die Zusage in
     * `vite.config.ts` war genau deshalb einmal unwahr.
     */
    expect(generator).toMatch(/public\/datenschutz\.html/u)
    expect(generator).toMatch(/public\/impressum\.html/u)
    const build = JSON.parse(textOf('package.json')).scripts.build as string
    expect(
      build.indexOf('privacy-page.mjs') < build.indexOf('vite build'),
      'privacy-page.mjs muss vor `vite build` laufen, sonst fehlt der Precache',
    ).toBe(true)
    // Ohne Rücklink stünde man in der installierten App in einer Sackgasse.
    expect(generator).toMatch(/<a href="\/">ANITEW<\/a>/u)
  })
})

describe('jede Datenschutz-Zusage hat einen Verhaltenstest (R3-07)', () => {
  /*
   * Der Wächter über den Wächtern: Er hält fest, dass die Fristen aus
   * PRIVACY nicht nur im Text und im Quelltext stehen, sondern in
   * `tests/worker/privacyGuarantees.test.ts` als Ablauf durchgespielt
   * werden. Verschwindet dort ein Fall, fällt es hier auf.
   */
  const behaviour = textOf('tests/worker/privacyGuarantees.test.ts')

  it('prüft die Höchstfrist der Zustellnotiz am laufenden Durable Object', () => {
    expect(behaviour).toMatch(/60 Minuten/u)
    expect(behaviour).toMatch(/neben einer späteren Tageserinnerung/u)
    expect(behaviour).toMatch(/bei dauerhaft gestörtem Pushdienst/u)
  })

  it('prüft beide Sitzungsfristen am echten Endpunkt', () => {
    expect(behaviour).toMatch(/180 Tage/u)
    expect(behaviour).toMatch(/30 Tagen/u)
    expect(behaviour).toMatch(/session_expired/u)
  })

  it('prüft, dass nur die genannten Felder gespeichert werden', () => {
    expect(behaviour).toMatch(/nur Adresse, Zeit, Zone und den generischen Text/u)
  })
})
