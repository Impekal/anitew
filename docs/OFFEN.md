# Was noch offen ist — und wer es tun muss

**Stand: 2026-08-19** (nach dem großen Ausbau: acht Trainingsmodule plus
Eigene Inhalte, vier gelehrte Techniken, adaptive Schwierigkeit,
Fähigkeitsbaum, Coach mit eigenem Schlüssel)

Dieses Dokument ist die ehrliche Bestandsaufnahme nach dem großen Durchgang:
Alles, was **ohne dich** machbar war, ist gemacht und liegt live unter
`https://anitew.impekaltech.workers.dev`. Was bleibt, teilt sich in drei
Gruppen — und nur die erste steht dir wirklich im Weg.

---

## 1. Braucht **dich** — Konto, Geld oder ein echtes Gerät

Das kann kein Code erledigen. Reihenfolge wie im Gespräch: Geld zuletzt.

| Was | Warum nur du | Aufwand |
|---|---|---|
| **Gerätedurchgang** (P8) | Nur dein echtes iPhone/iPad bestätigt zwei Dinge, die der Buildrechner nicht kann: **Ton beim ersten Tippen** und **„Zum Home-Bildschirm“ + Flugmodus**. Anleitung: `docs/DEVICES.md` | 20 Min, kostenlos |
| **Endgültiges Icon & Screenshots** (A9, Q7) | Design-Entscheidung und Handarbeit. Das vorläufige Zeichen (fünf Punkte) steht; Store-Texte sind fertig in `docs/STORE.md` | — |
| **Domain** (optional) | Kauf auf deinen Namen, deine Karte. Erst nach Zufriedenheit | ~10–20 €/Jahr |
| **Google Play** (Q1–Q4) | Entwicklerkonto ($25 einmalig), dein Signierschlüssel, Play-Console-Formulare. Ich baue Bubblewrap-Konfig und `assetlinks.json` vor; du gibst mir den Fingerprint | $25 einmalig |
| **iOS App Store** (Q6) | Apple-Konto ($99/Jahr) **und** die Entscheidung, welchen eigenständigen Mehrwert die App über die Web-Version hinaus bietet (Apple lehnt reine Verpackungen ab) | $99/Jahr |
| **Spendenweg** (K9) | Ko-fi/PayPal/GitHub-Sponsors-Konto auf deinen Namen | — |

**Für den reinen Test brauchst du nichts davon** außer 20 Minuten mit deinen
Geräten. Die App ist schon online.

---

## 2. Braucht eine **Produktentscheidung** — Großbaustellen, keine Aufräumarbeit

Diese baue ich bewusst **nicht** stillschweigend: Sie sind je eine eigene
Phase mit Entscheidungen, die dir gehören.

| Was | Die offene Frage |
|---|---|
| **KI mit eigenem Schlüssel** (M, Milestone M6) | **Erster Ausbau fertig 2026-08-19 (D-031):** Der Coach spricht aus den eigenen Zahlen (ohne Netz) und beantwortet freie Fragen mit eigenem Anthropic-Schlüssel. Offen: weitere Anbieter (erst wenn jemand sie braucht) und KI-Extraktion aus eigenem Material (I3, mit Freigabe pro Vorgang, I6) |
| **Eigene Inhalte** (I, Milestone M6) | **Erster Ausbau fertig 2026-08-19 (D-032):** Text einfügen → Karten-Vorschau → eigenes Trainingsmodul samt FSRS-Wiedersehen, ohne KI, alles lokal. Offen: Foto/Diktat (I1), Termin-Items „das Treffen ist morgen um 9“ (I5), KI-Extraktion (I3) |
| **Cloud-Abgleich** (N7/N8/N10, Milestone M7) | **Entschieden 2026-08-18: wird gebaut** — Google-Anmeldung mit Ablage im eigenen Google-Drive-App-Ordner (OAuth/PKCE, kein eigener Server, R-3 bleibt). Reihenfolge ebenfalls entschieden: erst Optik + Kennenlernen, dann der Abgleich. Live gehen kann er erst mit deinem Google-Cloud-OAuth-Client und der Domain (Gruppe 1) |
| **Fotorealistische Porträts** (D16), **CC0-Icon-Satz** (D15) | Asset- und Lizenzentscheidung. Heute erzeugt die App Gesichter selbst (D-005) — bewusst, und es funktioniert |
| **Französische Oberfläche** (fr.ts) | Die Prosa braucht eine muttersprachliche Durchsicht, bevor sie öffentlich geht. **Französisch als Trainingssprache** ist dagegen fertig und geprüft (L6/L7) |

---

## 3. Kleiner Restausbau — machbar, aber nicht nötig

Diese könnte ich noch bauen; sie verbessern nichts Grundlegendes und blockieren
nichts. Ich habe sie bewusst zurückgestellt, damit der Schwerpunkt auf dem
Wesentlichen blieb:

- **H2/H6** — die Referenzmission „Hotel“ um eine Ortsangabe zu einem
  Gegenstand erweitern und Schwierigkeitsstufen einziehen. Braucht ein
  fünftes Tatsachen-Format.
- **C6** — Interferenzprüfung zur Laufzeit. Die Wortlisten sind schon danach
  gebaut; der Laufzeit-Filter wäre eine Feinheit.
- **O7** — nie zwei anstrengende Blöcke hintereinander. Braucht erst eine
  saubere Definition von „anstrengend“.
- **O15** — das Ergebnis als kleines Netz statt als Liste. Rein visuell.
- **E4** — Verlauf des Profils über die Zeit. Braucht gespeicherte
  Momentaufnahmen; das Profil wird heute live gerechnet.
- **weitere Trainingssprachen** (ES, IT, PT, NL, TR, AR, ZH, JA) — jede ist
  jetzt reine Listenarbeit, seit Französisch den Weg gezeigt hat. AR bräuchte
  zusätzlich die RTL-Layoutprüfung (L3), CJK die Eingabe bei freiem Abruf (L4).

---

## Was fertig ist

Damit klar ist, wogegen sich „offen“ abhebt: Kern, Engine, **neun
Trainingsmodule** (Wörter, Gesichter, Zahlen, Missionen, Palast, Rückwärts,
Unterscheiden, Bilder, Eigene Inhalte), **vier gelehrte Merktechniken**
(Major, Loci, Geschichte, Verknüpfung), adaptive Schwierigkeit, die
Messung, das Gedächtnisprofil mit allen neun Achsen und begründeter
Tagesplanung, das Ankommen, die Serie, das Wiedersehen, der
Fähigkeitsbaum, der Coach (offline und mit eigenem Schlüssel), die
Wissenschaftsseite, Sicherung, Löschen, Erinnerungen, drei
Trainingssprachen — und die ganze Qualitätsreihe: Barrierefreiheit,
Fehlertoleranz, Uhr- und Reisefestigkeit, Performance mit Größenbudget,
Layout über sieben Geräte, 404 Kerntests und rund 230 Browserläufe.

Die Meilensteine M0, M1, M3 sind abgeschlossen, M2 im Kern, M4 weit, M5
begonnen (Französisch). Offen sind die Phasen, die Entscheidungen oder
Ausgaben verlangen — Gruppe 1 und 2 oben.
