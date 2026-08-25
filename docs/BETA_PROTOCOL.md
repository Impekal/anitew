# ANITEW Beta-Protokoll

**Stand: 2026-08-25**

Ziel: Produktreife mit echten Menschen erhöhen, ohne Trackingdienst und ohne laufende Kosten.

## Phase A — 20 bis 30 Personen, 14 Tage

Teilnehmende nutzen ANITEW wie im Alltag. Es gibt keine Pflicht, täglich zu trainieren; gerade die freiwillige Rückkehr ist ein Produktsignal.

### Start

1. ANITEW installieren.
2. Onboarding ohne zusätzliche Erklärung durchlaufen.
3. Erste normale Einheit durchführen.
4. Optional eine eigene Erinnerung anlegen.

Der Beobachter erklärt Funktionen erst, wenn die Person ausdrücklich nicht weiterkommt. Sonst würde nicht das Produkt, sondern die Erklärung getestet.

### Nach 1, 7 und 14 Tagen

Kurz erfassen:

- War verständlich, was ANITEW jeden Tag von dir möchte?
- Was war verwirrend oder zu langsam?
- Welche Funktion hast du freiwillig wieder benutzt?
- Gab es einen Moment, in dem ANITEW sichtbar beim Erinnern geholfen hat?
- Was würdest du entfernen?
- Würdest du ANITEW weiter benutzen? Warum oder warum nicht?

Am Ende kann die Person unter **Sicherung → Support & Beta → Beta-Bericht speichern** freiwillig den aggregierten Bericht exportieren. Der Bericht enthält keine Erinnerungstexte oder Antwortinhalte und wird von ANITEW nie automatisch hochgeladen.

## Kernmetriken

Aus den freiwilligen Berichten lassen sich ohne Nutzerkonto berechnen:

- Activation: mindestens eine abgeschlossene Session.
- D1/D7/D14/D30: `returnOffsets` enthält 1, 7, 14 bzw. 30.
- aktive Trainingstage.
- Sessions pro aktivem Trainingstag.
- beantwortete Items und aggregierte Recall-Rate.
- abgeschlossene Benchmarks.
- Anzahl persönlicher Memory-Knoten und Verbindungen.
- Nutzung der Trainingsmodule über aggregierte Antwortzahlen.

**Wichtig:** D7/D30 nur für Personen auswerten, die seit ihrem ersten Trainingstag überhaupt mindestens 7 bzw. 30 Tage beobachtbar sind. Ein drei Tage alter Datensatz ist kein D7-Abbruch.

## Entscheidungsregeln nach 14 Tagen

Nicht auf neue Features reagieren, bevor wiederkehrende Probleme gruppiert sind.

Priorität 1:
- Datenverlust, Start-/Update-/Installationsprobleme, OAuth/Push, Abstürze.

Priorität 2:
- Nutzer verstehen den täglichen Hauptweg nicht oder brechen ihn wiederholt ab.

Priorität 3:
- wiederkehrende Reibung in bestehenden Funktionen.

Priorität 4:
- neue Feature-Wünsche.

Ein Einzelwunsch erzeugt keine Roadmap. Ein Muster oder ein klarer Sicherheits-/Datenverlustfall schon.

## Phase B — 100 Personen

Erst nach Abschluss der 20–30-Personen-Beta. Gleiche Metriken, gleiche Datenschutzregeln. Ziel ist nicht maximale Anmeldung, sondern belastbare Rückkehr und störungsfreie Nutzung.
