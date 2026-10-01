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

Historischer Stand von D-005: Gesichter wurden zunächst erzeugt. Seit V4.2
verwendet das Personentraining die nachfolgend dokumentierten Portraitfotos.

## Portrait photographs

The files in `public/portraits/*.webp` are by their credited photographers,
under the [Pexels License](https://www.pexels.com/license/), not the code license.
See `docs/PORTRAITS.md` and `public/portraits/manifest.json` for per-file sources,
credits, modifications and restrictions.

## AI course coaches

`public/coaches/original.webp`, `lin.webp` and `rafael.webp` are
AI-generated portraits created for ANITEW, not photographs of real coaches.
They are labelled as AI coaches in the course interface; their display names are Noah, Lin and Atta.
They are separate from the licensed photographs used in person training.
No third-party photo licence or CC0 claim is made for these generated assets.
`public/coaches/manifest.json` records source filenames, provenance, checksums
and the lossless WebP conversion. Decoded pixels match the source PNG files.

## Synthetic course narration

The three generated audio files in `public/course-media/story/` and the 33
files in `public/course-media/library/` use Piper
voices Thorsten, Joe and Tom. Model/dataset provenance, licence references,
pronunciation handling and review limitations are documented in
[STORY_MEDIA.md](docs/STORY_MEDIA.md). Only generated narration is bundled;
voice models, synthesis programs and the user's private recording are excluded.

## Subtitle drafting

Additional subtitle drafts were produced locally with Qwen3-4B-Instruct-2507
(Apache 2.0 model) and revised for the course content. Neither the model nor
its runtime is distributed. See [STORY_MEDIA.md](docs/STORY_MEDIA.md) for
provenance and the outstanding final language review.


## Speaking video research (not distributed)

The rejected local SadTalker/LivePortrait motion experiments are not bundled.
No video manifest or approved speaking clips are currently distributed.
Licences and provenance must be recorded for the eventual replacement clips.

## Lin and Atta course narration

The new synthetic German voices were generated locally with
[Qwen3-TTS VoiceDesign](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign)
and explicitly approved by the user. New lesson narration uses those generated
references with [Qwen3-TTS Base](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base).
Both models are Apache-2.0. The local runtime is
[MLX Audio](https://github.com/Blaizzy/mlx-audio) (MIT). No model weights, private
user recording or third-party speaker recording is distributed. The accepted
ANITEW name excerpt remains the existing Piper v14 reference. Per-file hashes
and provenance are recorded in `public/course-media/coach-narration-manifest.json`.

## Revised English and French course narration (2026-10-01)

The revised English course recordings for Atta and Noah use the user-approved
synthetic Atta performance (Qwen3-TTS, Apache-2.0). Noah uses full-utterance
OpenVoice V2 tone conversion (MIT) toward the existing synthetic Piper Joe
voice (CC0 dataset). The full greeting stays in each coach's own voice.

Atta's revised French narration uses Kyutai TTS 1.6B en_fr (CC-BY-4.0), the Fabien
voice reference (CC0), and OpenVoice V2 (MIT) conversion toward CML-TTS French
speaker 1406 (CC-BY-4.0). CML-TTS: Frederico S. Oliveira et al.,
https://openslr.org/146/. Voice source:
https://huggingface.co/kyutai/tts-voices/blob/main/README.md, file
`cml-tts/fr/1406_1028_000009-0003_enhanced.wav`.
The generated recording is adapted by ANITEW (tempo and synthetic tone-color
conversion); attribution and licence links are shown in the player.
CC-BY-4.0: https://creativecommons.org/licenses/by/4.0/.
Model: https://huggingface.co/kyutai/tts-1.6b-en_fr.
Converter: https://github.com/myshell-ai/OpenVoice.
The app bundles only narration, not model weights or reference speaker recordings.

Short reference recordings were explicitly accepted by the user. Full narration
has separate automatic content checks; this is not a full human listening review.

Lin’s English and French course recordings use the same source performances
converted to the separately approved synthetic Lin voice (Qwen3-TTS VoiceDesign,
Apache-2.0). They do not use Piper Joe or CML-TTS 1406 as the target voice.
The French source remains Kyutai Fabien (CC0), with Kyutai TTS (CC-BY-4.0)
and OpenVoice V2 (MIT). ANITEW adapted the pace, phrasing and synthetic timbre.
Short Lin references were accepted on 2026-10-01; full-course listening remains
separate. Per-file checksums, source links and spoken clarifications are in
`public/course-media/coach-narration-manifest.json`. No rejected new Noah
French recording is distributed.
