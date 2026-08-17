# Fremde Bestandteile und ihre Lizenzen

Backlog R1: ab dem ersten Paket geführt, nicht erst vor dem Store-Eintrag.

Entscheidend ist die Trennung zwischen **was ausgeliefert wird** und **was nur
baut**. Nur das Ausgelieferte landet auf dem Gerät des Nutzers und ist damit
lizenzrechtlich relevant für die Verbreitung; Werkzeuge, die auf dem
Buildrechner laufen, sind es nicht.

Stand: 2026-08-17 (M0). Diese Datei wird mit jeder neuen Abhängigkeit
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

## Was noch kommt und hier landen wird

- **FSRS** (D-004) — Lizenz vor dem Einbau prüfen und hier eintragen.
- **CC0-Icon-Satz** für Objekte und Orte (D-005, Backlog D15) — Quelle und
  Lizenz namentlich dokumentieren, nicht pauschal „CC0 aus dem Netz“.
- **Schriften**, falls je eine eigene dazukommt. Bisher ausschließlich
  Systemschriften — nichts zu lizenzieren, nichts nachzuladen.

Nicht vorgesehen und ausdrücklich nicht vorhanden: Fotos oder Gesichter
Dritter. Gesichter erzeugt ANITEW selbst (D-005) — das umgeht neben dem
Urheberrecht auch die Persönlichkeitsrechte, die ein „lizenzfreies“ Foto eines
echten Menschen nicht mit abdeckt.
