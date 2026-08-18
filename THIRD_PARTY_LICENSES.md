# Fremde Bestandteile und ihre Lizenzen

Backlog R1: ab dem ersten Paket geführt, nicht erst vor dem Store-Eintrag.

Entscheidend ist die Trennung zwischen **was ausgeliefert wird** und **was nur
baut**. Nur das Ausgelieferte landet auf dem Gerät des Nutzers und ist damit
lizenzrechtlich relevant für die Verbreitung; Werkzeuge, die auf dem
Buildrechner laufen, sind es nicht.

Stand: 2026-08-18. Diese Datei wird mit jeder neuen Abhängigkeit
fortgeschrieben.

---

## Was ausgeliefert wird

Alles, was im gebauten Stand (`dist/`) landet und damit im Browser des Nutzers
läuft.

| Paket | Lizenz | Wofür |
|---|---|---|
| react | MIT | Oberfläche |
| react-dom | MIT | Oberfläche |
| scheduler | MIT | von react-dom mitgebracht |
| loose-envify, js-tokens | MIT | von react mitgebracht |
| dexie | Apache-2.0 | IndexedDB auf dem Gerät (D-003) |
| ts-fsrs | MIT | der Wiederholungsalgorithmus (D-004) — von Open Spaced Repetition, **ohne eigene Abhängigkeiten**, läuft vollständig auf dem Gerät |
| workbox-* | MIT | Service Worker, von vite-plugin-pwa erzeugt |

Alles davon ist permissiv lizenziert. **Kein Copyleft im ausgelieferten
Stand** — das ist Bedingung, weil ANITEW später als geschlossene Store-App
verpackt werden soll (Backlog Q).

## Was nur baut

Läuft auf dem Entwicklungs- oder Buildrechner und wird nicht mit ausgeliefert.

| Paket | Lizenz | Wofür |
|---|---|---|
| vite, @vitejs/plugin-react | MIT | Build |
| vite-plugin-pwa | MIT | Manifest und Service Worker |
| typescript | Apache-2.0 | Typen |
| vitest | MIT | Kern-Tests |
| @playwright/test | Apache-2.0 | E2E-Tests |
| wrangler | MIT (Apache-2.0 in Teilen) | Veröffentlichen bei Cloudflare |
| @types/* | MIT | nur Typdeklarationen |

### Zwei Fälle, die eine Anmerkung verdienen

**sharp / libvips — LGPL-3.0-or-later.** Kommt über
`wrangler → miniflare → sharp` herein, also über das Werkzeug zum
Veröffentlichen. Es läuft ausschließlich auf dem Buildrechner und ist in
`dist/` nicht enthalten. Damit entsteht keine Verpflichtung für die
ausgelieferte App. Sollte wrangler je durch etwas anderes ersetzt werden, fällt
dieser Eintrag ersatzlos weg.

**caniuse-lite — CC-BY-4.0.** Browser-Kompatibilitätsdaten, von der
Build-Werkzeugkette benutzt. Datensammlung, kein Code im Ergebnis.

## Eigene Bestandteile

| Was | Herkunft | Anmerkung |
|---|---|---|
| `public/icons/icon.svg`, `icon-192.png`, `icon-512.png` | in diesem Projekt entstanden, erzeugt von `scripts/generate-icons.mjs` | vorläufig bis zur Markenrecherche (Backlog R3) |
| **Töne** | keine Dateien — alles entsteht zur Laufzeit aus Sinusschwingungen (`platform/web/sound.ts`) | nichts zu lizenzieren. Der Grund war ursprünglich Gewicht und Offline-Betrieb; die Lizenzfreiheit ist der Nebengewinn |
| **Gesichter** | gezeichnet aus dem Namen, kein Bildmaterial (`app/Face.tsx`, D-005) | umgeht neben dem Urheberrecht auch die Persönlichkeitsrechte, die ein „lizenzfreies“ Foto eines echten Menschen nicht abdeckt |
| **Wortlisten** (`core/content/words.ts`) | für dieses Projekt zusammengestellt, je Sprache eigen und nicht übersetzt (L6) | einzelne Wörter sind keine schutzfähigen Werke; die **Auswahl und Anordnung** einer Liste kann es sein, deshalb ist sie hier eigene Arbeit und nicht aus einer fremden Sammlung übernommen |
| **Namenslisten** (`core/content/names.ts`) | ebenso; Vornamen, keine realen Personen | ein Vorname ist niemandes Eigentum. Zusammengestellt nach Unterscheidbarkeit, nicht nach Häufigkeitsstatistiken Dritter |
| **Missionsbausteine, Palastgegenstände, Quarantänewörter** | für dieses Projekt geschrieben | dieselbe Überlegung wie bei den Wortlisten |
| **Quellen auf der Wissenschaftsseite** (`core/science.ts`) | Angaben zu veröffentlichten Arbeiten: Autor, Jahr, Titel, Journal | bibliografische Angaben sind Tatsachen und frei; **zitiert wird kein Text** aus diesen Arbeiten, und es wird auch keine PDF mitgeliefert oder verlinkt |

## Was noch kommt und hier landen wird

- ~~**FSRS** (D-004) — Lizenz vor dem Einbau prüfen und hier eintragen.~~
  Erledigt 2026-08-17: `ts-fsrs` 5.4.1, MIT, keine eigenen Abhängigkeiten.
  Geprüft **vor** dem Einbau, wie in D-004 festgelegt.
- **CC0-Icon-Satz** für Objekte und Orte (D-005, Backlog D15) — Quelle und
  Lizenz namentlich dokumentieren, nicht pauschal „CC0 aus dem Netz“.
- **Schriften**, falls je eine eigene dazukommt. Bisher ausschließlich
  Systemschriften — nichts zu lizenzieren, nichts nachzuladen.

Nicht vorgesehen und ausdrücklich nicht vorhanden: Fotos oder Gesichter
Dritter. Gesichter erzeugt ANITEW selbst (D-005) — das umgeht neben dem
Urheberrecht auch die Persönlichkeitsrechte, die ein „lizenzfreies“ Foto eines
echten Menschen nicht mit abdeckt.
