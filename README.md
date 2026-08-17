# ANITEW

Eine Gedächtnis-App, die mit **5 Minuten täglich** auskommt: kein weiteres
Brain-Training-Spiel, sondern Abruftraining plus zeitlich verteiltes
Wiederholen — die beiden am besten belegten Lernmechanismen — mit einer
persönlichen Vergessenskurve, einem gemessenen Gedächtnisprofil und einer
Engine, die jeden Tag entscheidet, was gerade nötig ist.

> Train your memory. Measure your progress. Remember more.

**Local-first, offline, ohne Konto.** PWA zuerst, so gebaut, dass daraus später
ohne Neubau eine Android-App (TWA) und eine iOS-App werden kann.

## Hier anfangen

Der Code ist die kleinere Hälfte. Die Überlegungen sind aufgeschrieben, und
sie sind der schnellere Weg hinein:

| Datei | Inhalt |
|---|---|
| [`PROJECT_STATE.md`](PROJECT_STATE.md) | Das laufende Gedächtnis: was gebaut wurde, warum so, und was dabei schiefging — von hinten lesen |
| [`docs/BACKLOG.md`](docs/BACKLOG.md) | Die Aufgabenliste mit Status, Aufwand und Begründung. Am Ende: Meilensteine und der aktuelle Stand |
| [`docs/DECISIONS.md`](docs/DECISIONS.md) | Die bindenden Entscheidungen mit ihren Gründen — und mit dem, was sie ausschließen |
| [`THIRD_PARTY_LICENSES.md`](THIRD_PARTY_LICENSES.md) | Jede Abhängigkeit, getrennt nach „wird ausgeliefert“ und „baut nur“ |

**Stand:** Meilenstein M0 ist fertig — das Fundament trägt, das Training kommt
mit M1.

## Entwicklung

```bash
npm install
npm run dev          # Entwicklungsserver
npm run typecheck    # App und Kern getrennt prüfen (siehe unten)
npm test             # Kern-Tests, in Node, ohne Browser
npm run build        # Typprüfung + Produktionsbau → dist/
npm run test:e2e     # die gebaute App im Browser — vorher `npm run build`
```

### Die eine Regel, die man kennen muss

`src/core/` ist reines TypeScript **ohne Browser**: kein `window`, kein
`document`, kein `fetch`. Durchgesetzt wird das von `tsconfig.core.json`, das
den Kern ein zweites Mal übersetzt — ohne die DOM-Bibliothek. Wer dagegen
verstößt, bekommt einen Übersetzungsfehler, nicht einen Kommentar im Review.

Der Grund steht in [`docs/DECISIONS.md`](docs/DECISIONS.md) unter D-010: Der
Kern muss ohne Browser testbar sein, und die App muss sich später als
Android-TWA und als native iOS-App verpacken lassen, ohne neu geschrieben zu
werden. Alles Plattformabhängige gehört hinter die Schnittstellen in
`src/core/ports.ts` und wird in `src/platform/` umgesetzt.
