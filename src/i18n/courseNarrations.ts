import type { CourseId } from '../core/courses/progress.ts'
import type { CoachId } from '../core/courses/coaches.ts'
import type { SpokenLanguage } from '../core/courses/media.ts'
import type { DownloadAsset } from '../app/courseDownloads.ts'
export interface CourseNarration extends DownloadAsset {
 course:CourseId;coach:CoachId;language:SpokenLanguage;duration:number;
 cues:ReadonlyArray<{start:number;end:number;text:string;section?:string}>
}
// Generated recordings are registered only after their content checks.
export const courseNarrations:CourseNarration[]=[
  {
    "course": "active-recall",
    "coach": "rafael",
    "language": "de",
    "duration": 101.17999999999998,
    "cues": [
      {
        "section": "title",
        "text": "Aktives Abrufen",
        "start": 0.0,
        "end": 1.44
      },
      {
        "section": "purpose",
        "text": "Du versuchst, eine Information ohne Vorlage wiederzugeben. Dabei erkennst du, was du selbst abrufen kannst und wo du noch nacharbeiten musst. Das hilft bei Fakten, Begriffen und Zusammenhängen.",
        "start": 1.74,
        "end": 13.66
      },
      {
        "section": "limit",
        "text": "Dass dir eine gelesene Antwort bekannt vorkommt, heißt nicht, dass du sie selbst abrufen kannst. Ein misslungener Versuch ist kein Endurteil: Prüfe die richtige Antwort, kläre sie und versuche es erneut. Häufiges Raten ohne Rückmeldung kann Fehler festigen.",
        "start": 13.96,
        "end": 29.880000000000003
      },
      {
        "section": "step-0",
        "text": "Wähle eine kleine, verstandene Information.",
        "start": 30.180000000000003,
        "end": 32.980000000000004
      },
      {
        "section": "step-1",
        "text": "Stelle eine klare Frage, die sich aus dem Material beantworten lässt.",
        "start": 33.28,
        "end": 37.36
      },
      {
        "section": "step-2",
        "text": "Lege die Vorlage weg und antworte, bevor du nachsiehst.",
        "start": 37.66,
        "end": 41.18
      },
      {
        "section": "step-3",
        "text": "Vergleiche deine Antwort mit dem Original. Korrigiere fehlende oder falsche Teile.",
        "start": 41.48,
        "end": 47.08
      },
      {
        "section": "step-4",
        "text": "Verdecke die richtige Antwort und versuche den Abruf noch einmal.",
        "start": 47.379999999999995,
        "end": 51.22
      },
      {
        "section": "step-5",
        "text": "Prüfe später erneut. Nur sofort wiederholen kann sich leicht anfühlen, ohne dauerhaftes Behalten zu zeigen.",
        "start": 51.519999999999996,
        "end": 58.0
      },
      {
        "section": "example",
        "text": "Frage: Warum kühlt verdunstendes Wasser eine Oberfläche?\nAntwort: Zum Verdunsten wird Energie benötigt. Diese Energie wird der Oberfläche und ihrer Umgebung als Wärme entzogen.",
        "start": 58.3,
        "end": 69.82
      },
      {
        "section": "explanation",
        "text": "Lies und verstehe zunächst die Antwort. Decke sie dann ab und beantworte die Frage selbst. „Wasser kühlt“ allein erklärt den Zusammenhang noch nicht; entscheidend sind Energiebedarf und Wärmeentzug.",
        "start": 70.11999999999999,
        "end": 82.03999999999999
      },
      {
        "section": "recall",
        "text": "Warum kann verdunstendes Wasser eine Oberfläche kühlen? Erkläre den Zusammenhang ohne Vorlage.",
        "start": 82.33999999999999,
        "end": 88.01999999999998
      },
      {
        "section": "transfer",
        "text": "Formuliere zu deinem eigenen Material eine konkrete Frage. Antworte zunächst ohne Vorlage, vergleiche danach und versuche es später erneut. Die App nutzt Abrufversuche auch in ihren Trainingseinheiten.",
        "start": 88.31999999999998,
        "end": 100.87999999999998
      }
    ],
    "src": "/course-media/library/atta-active-recall-de-42e68f21072f.m4a",
    "bytes": 1249722,
    "sha256": "42e68f21072fb239cd92c3ada1863ca5514acf9d8c0239f18ca3322bfb369b07"
  },
  {
    "course": "interleaved-practice",
    "coach": "rafael",
    "language": "de",
    "duration": 104.12,
    "cues": [
      {
        "section": "title",
        "text": "Passende Vorgehensweisen unterscheiden",
        "start": 0.0,
        "end": 2.48
      },
      {
        "section": "purpose",
        "text": "Beim gezielten Mischen wechselst du zwischen ähnlichen Aufgabentypen und entscheidest selbst, welches Vorgehen passt. So übst du auch die Auswahl einer Methode.",
        "start": 2.78,
        "end": 12.379999999999999
      },
      {
        "section": "limit",
        "text": "Lerne neue Vorgehensweisen zuerst an klaren Beispielen. Wahlloses Themenwechseln oder Multitasking ist nicht dasselbe. Ob das Mischen hilft, hängt auch vom Material und deinem Vorwissen ab.",
        "start": 12.68,
        "end": 24.439999999999998
      },
      {
        "section": "step-0",
        "text": "Verstehe die einzelnen Vorgehensweisen zunächst getrennt.",
        "start": 24.740000000000002,
        "end": 28.020000000000003
      },
      {
        "section": "step-1",
        "text": "Mische anschließend wenige verwandte Aufgabentypen.",
        "start": 28.32,
        "end": 31.44
      },
      {
        "section": "step-2",
        "text": "Bestimme vor dem Rechnen oder Antworten, welcher Typ vorliegt und warum.",
        "start": 31.740000000000002,
        "end": 35.58
      },
      {
        "section": "step-3",
        "text": "Löse die Aufgabe und prüfe Auswahl und Ergebnis getrennt.",
        "start": 35.88,
        "end": 39.72
      },
      {
        "section": "step-4",
        "text": "Arbeite Fehler gezielt nach und kehre danach zur gemischten Übung zurück.",
        "start": 40.02,
        "end": 44.1
      },
      {
        "section": "example",
        "text": "Rechteck: Fläche = Länge × Breite. Dreieck: Fläche = Grundseite × zugehörige Höhe ÷ 2. Beispiel: Ein Rechteck mit 4 cm Länge und 3 cm Breite hat 12 cm². Ein Dreieck mit 4 cm Grundseite und 3 cm zugehöriger Höhe hat 6 cm².",
        "start": 44.400000000000006,
        "end": 66.18
      },
      {
        "section": "explanation",
        "text": "Gleiche Zahlen verlangen nicht automatisch dieselbe Rechnung. Die Figur entscheidet: Beim Dreieck gehört der Faktor ein Halb dazu. In gemischten Aufgaben muss die Aufgabenart erkannt werden, bevor die Regel angewandt wird.",
        "start": 66.48,
        "end": 79.76
      },
      {
        "section": "recall",
        "text": "Aufgabe A: Dreieck mit Grundseite 6 cm und zugehöriger Höhe 4 cm. Aufgabe B: Rechteck mit Länge 6 cm und Breite 4 cm. Nenne jeweils die passende Regel und die Fläche.",
        "start": 80.06,
        "end": 94.32000000000001
      },
      {
        "section": "transfer",
        "text": "Wähle zwei oder drei bereits eingeführte, verwandte Aufgabentypen aus deinem Lernstoff. Mische sie und begründe vor jeder Lösung deine Auswahl des Vorgehens.",
        "start": 94.62,
        "end": 103.82000000000001
      }
    ],
    "src": "/course-media/library/atta-interleaved-practice-de-a66b2602747e.m4a",
    "bytes": 1279338,
    "sha256": "a66b2602747e167999c9e46783d69ee82c72f8063bf3793b049bade02aa72745"
  },
  {
    "course": "keyword-method",
    "coach": "rafael",
    "language": "de",
    "duration": 86.67999999999999,
    "cues": [
      {
        "section": "title",
        "text": "Neue Vokabeln mit Schlüsselwörtern verbinden",
        "start": 0.0,
        "end": 2.56
      },
      {
        "section": "purpose",
        "text": "Ein ähnlich klingendes bekanntes Wort kann als Brücke zu einer fremdsprachigen Bedeutung dienen. Du verknüpfst das Schlüsselwort bildlich mit der Bedeutung und prüfst danach die echte Vokabel.",
        "start": 2.86,
        "end": 13.34
      },
      {
        "section": "limit",
        "text": "Ein ähnlicher Klang ist keine korrekte Aussprache. Nicht für jedes Wort gibt es eine gute Brücke. Die Methode ersetzt weder Ausspracheprüfung noch Schreibweise und Verwendung im Satz.",
        "start": 13.64,
        "end": 24.28
      },
      {
        "section": "step-0",
        "text": "Prüfe Bedeutung und korrekte Aussprache der neuen Vokabel.",
        "start": 24.580000000000002,
        "end": 27.94
      },
      {
        "section": "step-1",
        "text": "Suche ein bekanntes Wort mit ähnlichem Klang.",
        "start": 28.240000000000002,
        "end": 30.980000000000004
      },
      {
        "section": "step-2",
        "text": "Verbinde dieses Schlüsselwort und die Bedeutung durch eine klare Vorstellung.",
        "start": 31.28,
        "end": 35.28
      },
      {
        "section": "step-3",
        "text": "Rufe die Bedeutung aus der Vokabel ab und danach die Vokabel aus der Bedeutung.",
        "start": 35.58,
        "end": 40.14
      },
      {
        "section": "step-4",
        "text": "Prüfe das Original: Aussprache, Schreibweise und ein passender Beispielsatz.",
        "start": 40.44,
        "end": 45.959999999999994
      },
      {
        "section": "example",
        "text": "Englisch: bell = Glocke. Beispielsatz: The bell rings. = Die Glocke läutet.",
        "start": 46.26,
        "end": 54.68
      },
      {
        "section": "explanation",
        "text": "Als deutsche Klangbrücke kann „bellen“ dienen: Du stellst dir eine Glocke vor, die wie ein Hund bellt. „Bellen“ ist die Eselsbrücke, nicht die englische Aussprache von bell.",
        "start": 54.98,
        "end": 65.14
      },
      {
        "section": "recall",
        "text": "Welche englische Vokabel bedeutet Glocke? Schreibe die Vokabel, ihre Bedeutung und den Beispielsatz aus dem Gedächtnis.",
        "start": 65.44,
        "end": 72.64
      },
      {
        "section": "transfer",
        "text": "Teste die Technik an einer Vokabel, die du wirklich brauchst. Prüfe auch die Gegenrichtung: Kannst du aus der Bedeutung die fremdsprachige Form abrufen? Verwirrt dich das Schlüsselwort, ändere die Brücke oder nutze direktes Abrufen.",
        "start": 72.94,
        "end": 86.38
      }
    ],
    "src": "/course-media/library/atta-keyword-method-de-ebff2f1cf0cb.m4a",
    "bytes": 1057852,
    "sha256": "ebff2f1cf0cb96745bace30bbd7deef75fef8b02a0ee01b0c97d0cb8d94a00af"
  },
  {
    "course": "long-words",
    "coach": "rafael",
    "language": "de",
    "duration": 85.02008333333332,
    "cues": [
      {
        "section": "title",
        "text": "Lange Wörter sicher behalten",
        "start": 0.0,
        "end": 2.08
      },
      {
        "section": "purpose",
        "text": "Du zerlegst ein langes Wort in verständliche Bausteine, setzt sie wieder zusammen und übst Bedeutung, Aussprache und Schreibweise.",
        "start": 2.38,
        "end": 9.74
      },
      {
        "section": "limit",
        "text": "Bedeutungsbausteine sind nicht immer Sprechsilben. Nicht jedes Fachwort lässt sich sofort sinnvoll zerlegen. Kläre unbekannte Teile und die korrekte Aussprache, bevor du sie übst.",
        "start": 10.040000000000001,
        "end": 20.200000000000003
      },
      {
        "section": "step-0",
        "text": "Kläre die Bedeutung des ganzen Wortes.",
        "start": 20.500000000000004,
        "end": 23.060000000000002
      },
      {
        "section": "step-1",
        "text": "Suche bekannte Bausteine und erkläre ihre Bedeutung.",
        "start": 23.360000000000003,
        "end": 26.960000000000004
      },
      {
        "section": "step-2",
        "text": "Achte auf Verbindungselemente wie das s in Versicherungsbeitrag.",
        "start": 27.260000000000005,
        "end": 31.100000000000005
      },
      {
        "section": "step-3",
        "text": "Sprich die Teile langsam und dann das ganze Wort flüssig. Sprechsilben können anders verlaufen als die Bedeutungsgrenzen.",
        "start": 31.400000000000006,
        "end": 38.44004166666667
      },
      {
        "section": "step-4",
        "text": "Verdecke die Vorlage, schreibe das ganze Wort und erkläre es.",
        "start": 38.74004166666667,
        "end": 42.90004166666667
      },
      {
        "section": "step-5",
        "text": "Vergleiche Schreibweise und Bedeutung. Übe unsichere Stellen und setze danach wieder das ganze Wort zusammen.",
        "start": 43.200041666666664,
        "end": 49.760041666666666
      },
      {
        "section": "example",
        "text": "Krankenversicherungsbeitrag",
        "start": 50.06004166666666,
        "end": 51.980041666666665
      },
      {
        "section": "explanation",
        "text": "Kranken | versicherung | s | beitrag. Gemeint ist der Beitrag zur Krankenversicherung. Das s verbindet Wortteile; es ist hier kein eigenes Bedeutungswort. Diese Aufteilung zeigt Bausteine, keine Silbentrennung.",
        "start": 52.28004166666666,
        "end": 66.52004166666666
      },
      {
        "section": "recall",
        "text": "Schreibe das vollständige Wort aus dem Gedächtnis. Erkläre anschließend mündlich seine Bedeutung und sprich es flüssig aus.",
        "start": 66.82004166666665,
        "end": 73.94008333333332
      },
      {
        "section": "transfer",
        "text": "Wähle ein langes Wort aus deinem Alltag. Suche sinnvolle Bausteine und prüfe danach das vollständige Wort. Für andere Sprachen gelten deren Wortbildungs- und Ausspracheregeln.",
        "start": 74.24008333333332,
        "end": 84.72008333333332
      }
    ],
    "src": "/course-media/library/atta-long-words-de-9da9ce38ab74.m4a",
    "bytes": 1040824,
    "sha256": "9da9ce38ab74d2146bbafadc4d0894692c44c02aaccaf79b9a9906a3e08b3b2d"
  },
  {
    "course": "meaningful-groups",
    "coach": "rafael",
    "language": "de",
    "duration": 103.0500833333333,
    "cues": [
      {
        "section": "title",
        "text": "Sinnvolle Einheiten bilden",
        "start": 0.0,
        "end": 1.76
      },
      {
        "section": "purpose",
        "text": "Du ordnest einzelne Informationen in verständliche Gruppen. Eine passende Struktur kann dir helfen, Inhalte zu überblicken und beim Abruf systematisch nach ihnen zu suchen.",
        "start": 2.06,
        "end": 12.46
      },
      {
        "section": "limit",
        "text": "Gruppieren allein garantiert keinen vollständigen Abruf. Die Gruppen müssen für dich sinnvoll sein; fremde Fachbegriffe werden nicht durch eine Überschrift verständlich. Wenn die ursprüngliche Reihenfolge zählt, musst du sie zusätzlich üben.",
        "start": 12.760000000000002,
        "end": 26.790083333333335
      },
      {
        "section": "step-0",
        "text": "Kläre, was du behalten möchtest: Inhalte, Reihenfolge oder beides.",
        "start": 27.090083333333336,
        "end": 32.45008333333334
      },
      {
        "section": "step-1",
        "text": "Suche Gemeinsamkeiten oder Beziehungen zwischen den Informationen.",
        "start": 32.750083333333336,
        "end": 37.070083333333336
      },
      {
        "section": "step-2",
        "text": "Bilde wenige übersichtliche Gruppen und gib jeder eine aussagekräftige Überschrift.",
        "start": 37.37008333333333,
        "end": 42.330083333333334
      },
      {
        "section": "step-3",
        "text": "Erkläre, warum die einzelnen Teile zu ihrer Gruppe gehören.",
        "start": 42.63008333333333,
        "end": 46.95008333333333
      },
      {
        "section": "step-4",
        "text": "Verdecke die Vorlage. Rufe zuerst die Gruppen und dann ihre Inhalte ab.",
        "start": 47.25008333333333,
        "end": 51.730083333333326
      },
      {
        "section": "step-5",
        "text": "Vergleiche mit dem Original, ergänze fehlende Teile und versuche es später erneut.",
        "start": 52.03008333333332,
        "end": 57.47008333333332
      },
      {
        "section": "example",
        "text": "Apfel · Hammer · Hemd · Birne · Säge · Jacke · Banane · Zange · Hose",
        "start": 57.77008333333332,
        "end": 63.290083333333314
      },
      {
        "section": "explanation",
        "text": "Eine mögliche Ordnung: Obst (Apfel, Birne, Banane), Werkzeug (Hammer, Säge, Zange), Kleidung (Hemd, Jacke, Hose). Die drei Überschriften geben dir Suchhilfen. In dieser Übung zählen alle neun Begriffe; ihre ursprüngliche Reihenfolge ist nicht das Lernziel.",
        "start": 63.59008333333331,
        "end": 82.15008333333331
      },
      {
        "section": "recall",
        "text": "Nenne ohne Vorlage die drei Gruppen und möglichst alle neun Begriffe. Die Reihenfolge innerhalb einer Gruppe ist frei.",
        "start": 82.45008333333331,
        "end": 89.89008333333331
      },
      {
        "section": "transfer",
        "text": "Gliedere einen eigenen Abschnitt nach Gedanken oder eine Liste nach sinnvollen Kategorien. Erfinde keine Gruppen nur für eine bestimmte Anzahl. Prüfe immer auch den vollständigen Inhalt, nicht nur die Überschriften.",
        "start": 90.1900833333333,
        "end": 102.75008333333331
      }
    ],
    "src": "/course-media/library/atta-meaningful-groups-de-840fee9d9b5d.m4a",
    "bytes": 1257484,
    "sha256": "840fee9d9b5d6b9dbe599250ca4b1b8a64f3d553c896f920e135272fc7bfa235"
  },
  {
    "course": "method-of-loci",
    "coach": "rafael",
    "language": "de",
    "duration": 86.74000000000001,
    "cues": [
      {
        "section": "title",
        "text": "Orte als Gedächtnisstützen nutzen",
        "start": 0.0,
        "end": 2.24
      },
      {
        "section": "purpose",
        "text": "Bei der Loci-Methode legst du vorgestellte Inhalte an feste Orte eines vertrauten Weges. Beim gedanklichen Abgehen helfen die Orte, die Inhalte wiederzufinden.",
        "start": 2.54,
        "end": 11.34
      },
      {
        "section": "limit",
        "text": "Lerne zuerst einen stabilen Weg. Zu viele ähnliche Bilder am selben Ort können sich verwechseln. Die Orte unterstützen Struktur und Reihenfolge, nicht automatisch exakte Formulierungen.",
        "start": 11.64,
        "end": 22.759999999999998
      },
      {
        "section": "step-0",
        "text": "Wähle einen vertrauten Weg mit klar unterscheidbaren Stationen.",
        "start": 23.060000000000002,
        "end": 26.660000000000004
      },
      {
        "section": "step-1",
        "text": "Lege eine feste Reihenfolge fest und gehe sie einmal ohne Lerninhalt durch.",
        "start": 26.96,
        "end": 31.92
      },
      {
        "section": "step-2",
        "text": "Verbinde pro Station einen Begriff durch ein deutliches vorgestelltes Ereignis mit dem Ort.",
        "start": 32.22,
        "end": 37.26
      },
      {
        "section": "step-3",
        "text": "Gehe die Stationen ohne Vorlage ab und nenne die Begriffe.",
        "start": 37.56,
        "end": 41.88
      },
      {
        "section": "step-4",
        "text": "Vergleiche den Abruf. Verbessere verwechselbare Orte oder schwache Bilder.",
        "start": 42.18,
        "end": 46.66
      },
      {
        "section": "example",
        "text": "Beispielweg: Haustür → Schuhregal → Küchentisch. Begriffe: Brot → Seife → Kerze.",
        "start": 46.96,
        "end": 54.74
      },
      {
        "section": "explanation",
        "text": "An der Haustür klemmt ein riesiges Brot. Das Schuhregal quillt vor Seifenschaum über. Auf dem Küchentisch steht eine leuchtende Kerze. Der Weg dient hier nur als Beispiel; für eigenes Lernen eignet sich ein tatsächlich vertrauter Weg.",
        "start": 55.04,
        "end": 69.2
      },
      {
        "section": "recall",
        "text": "Gehe die drei Stationen gedanklich ab. Schreibe zu jeder Station den zugehörigen Begriff.",
        "start": 69.5,
        "end": 75.18
      },
      {
        "section": "transfer",
        "text": "Lege im bestehenden Gedächtnispalast der App deinen vertrauten Weg an oder nutze einen vorhandenen. Beginne mit wenigen Stationen und prüfe, ob du jeden Ort sicher unterscheiden kannst.",
        "start": 75.48,
        "end": 86.44
      }
    ],
    "src": "/course-media/library/atta-method-of-loci-de-df564534b58e.m4a",
    "bytes": 1073359,
    "sha256": "df564534b58ebafe5dab30d2a1dea62c1c44507cb91b19d6a3f3a5ff1a528cfc"
  },
  {
    "course": "number-images",
    "coach": "rafael",
    "language": "de",
    "duration": 86.75999999999999,
    "cues": [
      {
        "section": "title",
        "text": "Zahlen in Bilder übersetzen",
        "start": 0.0,
        "end": 1.84
      },
      {
        "section": "purpose",
        "text": "Das Major-System ordnet Ziffern Konsonantenlaute zu. Daraus bildest du ein Wort und stellst dir ein Bild vor. Dieses Bild soll sich wieder in die Zahl zurückübersetzen lassen.",
        "start": 2.14,
        "end": 12.22
      },
      {
        "section": "limit",
        "text": "Du musst die Zuordnungen zuerst lernen. Ein Bild ohne verlässliche Rückübersetzung hilft beim Zahlenabruf nicht. Dieser Einstieg übt nur zwei Ziffern; die vorhandenen Major-Lektionen vermitteln weitere Zuordnungen.",
        "start": 12.520000000000001,
        "end": 25.0
      },
      {
        "section": "step-0",
        "text": "Lerne zunächst wenige feste Ziffer-Laut-Paare.",
        "start": 25.300000000000004,
        "end": 28.580000000000005
      },
      {
        "section": "step-1",
        "text": "Lies die Laute in der Reihenfolge der Ziffern.",
        "start": 28.880000000000003,
        "end": 31.520000000000003
      },
      {
        "section": "step-2",
        "text": "Ergänze passende Vokale zu einem bildhaften Wort.",
        "start": 31.820000000000004,
        "end": 35.34
      },
      {
        "section": "step-3",
        "text": "Prüfe die Konsonantenlaute: Enthält das Wort zusätzliche zählende Laute?",
        "start": 35.64,
        "end": 40.6
      },
      {
        "section": "step-4",
        "text": "Rufe aus dem Bild das Wort und aus dessen Lauten wieder die Zahl ab.",
        "start": 40.9,
        "end": 45.14
      },
      {
        "section": "example",
        "text": "1 → t/d; 2 → n. Die Zahl 12 kann zum Bild einer Tanne werden: t + n.",
        "start": 45.44,
        "end": 53.3
      },
      {
        "section": "explanation",
        "text": "Die Vokale zählen hier nicht. Das doppelt geschriebene n in Tanne ist ein Konsonantenlaut. Beim Rückweg erhältst du t → 1 und n → 2, also 12. Entscheidend ist der Klang, nicht die Anzahl geschriebener Buchstaben.",
        "start": 53.599999999999994,
        "end": 69.38
      },
      {
        "section": "recall",
        "text": "Welche Zahl steckt im Bild Tanne? Erkläre den Rückweg über die beiden Konsonantenlaute.",
        "start": 69.67999999999999,
        "end": 74.8
      },
      {
        "section": "transfer",
        "text": "Übe die weiteren festen Zuordnungen in den bestehenden Major-Lektionen. Füge erst dann längere Zahlenfolgen hinzu. Prüfe bei jedem eigenen Bild den Rückweg zur exakten Zahl.",
        "start": 75.1,
        "end": 86.46
      }
    ],
    "src": "/course-media/library/atta-number-images-de-f8b1ae79c1b1.m4a",
    "bytes": 1061412,
    "sha256": "f8b1ae79c1b1691ed874aec4659734b6faa7f2b66f31ef0dddba0fb6938dd0a6"
  },
  {
    "course": "self-explanation",
    "coach": "rafael",
    "language": "de",
    "duration": 112.80000000000001,
    "cues": [
      {
        "section": "title",
        "text": "Zusammenhänge selbst erklären",
        "start": 0.0,
        "end": 2.0
      },
      {
        "section": "purpose",
        "text": "Du erklärst mit eigenen Worten, warum ein Schritt sinnvoll ist oder wie zwei Aussagen zusammenhängen. So kannst du Verständnislücken entdecken, die beim bloßen Lesen unauffällig bleiben.",
        "start": 2.3,
        "end": 13.02
      },
      {
        "section": "limit",
        "text": "Eine flüssige Erklärung kann trotzdem falsch sein. Prüfe sie an einer zuverlässigen Vorlage und kennzeichne Unsicherheit. Die Methode ergänzt das Üben; sie ersetzt weder Fachwissen noch eine Prüfung deiner Erklärung.",
        "start": 13.32,
        "end": 26.12
      },
      {
        "section": "step-0",
        "text": "Wähle einen überschaubaren Zusammenhang, den du verstehen möchtest.",
        "start": 26.42,
        "end": 29.94
      },
      {
        "section": "step-1",
        "text": "Frage: Warum folgt dieser Schritt? Was bleibt gleich? Was würde sich bei anderen Bedingungen ändern?",
        "start": 30.240000000000002,
        "end": 37.68
      },
      {
        "section": "step-2",
        "text": "Formuliere deine Erklärung ohne die Vorlage zu kopieren.",
        "start": 37.980000000000004,
        "end": 41.580000000000005
      },
      {
        "section": "step-3",
        "text": "Vergleiche sie mit der Begründung im Original. Trenne gesicherte Aussagen von Vermutungen.",
        "start": 41.88,
        "end": 47.480000000000004
      },
      {
        "section": "step-4",
        "text": "Korrigiere Lücken und wende die Erklärung auf ein ähnliches Beispiel an.",
        "start": 47.78,
        "end": 52.260000000000005
      },
      {
        "section": "step-5",
        "text": "Erkläre den Zusammenhang später noch einmal ohne Vorlage.",
        "start": 52.56,
        "end": 56.160000000000004
      },
      {
        "section": "example",
        "text": "Drei Viertel sind gleich viel wie sechs Achtel: 3/4 = 6/8. Wenn jedes der vier gleich großen Teile noch einmal halbiert wird, entstehen acht gleich große Teile. Die drei ausgewählten Viertel bestehen dann aus sechs Achteln. Die ausgewählte Menge bleibt gleich.",
        "start": 56.46,
        "end": 74.32
      },
      {
        "section": "explanation",
        "text": "„Oben und unten mal zwei“ beschreibt eine Rechenregel. Die Erklärung mit den halbierten Teilen begründet, warum sich der Wert nicht ändert. Zum Übertragen kannst du überlegen, weshalb 2/3 und 4/6 denselben Anteil beschreiben.",
        "start": 74.62,
        "end": 88.46000000000001
      },
      {
        "section": "recall",
        "text": "Erkläre ohne Vorlage, warum 3/4 und 6/8 gleich viel sind. Übertrage die Begründung anschließend auf 2/3 und 4/6.",
        "start": 88.76,
        "end": 97.96000000000001
      },
      {
        "section": "transfer",
        "text": "Nimm einen Schritt aus deinem Lernstoff und erkläre, warum er gilt. Suche ein ähnliches Beispiel und prüfe deine Erklärung daran. Wenn du die Begründung nicht verlässlich prüfen kannst, halte die offene Frage fest, statt Sicherheit vorzutäuschen.",
        "start": 98.26,
        "end": 112.5
      }
    ],
    "src": "/course-media/library/atta-self-explanation-de-b213bacf4acc.m4a",
    "bytes": 1395060,
    "sha256": "b213bacf4accb648b413cb2411a2d23dc44719bca12c13d87653f7670d9563cc"
  },
  {
    "course": "spaced-practice",
    "coach": "rafael",
    "language": "de",
    "duration": 115.43999999999998,
    "cues": [
      {
        "section": "title",
        "text": "Verteiltes Wiederholen",
        "start": 0.0,
        "end": 1.52
      },
      {
        "section": "purpose",
        "text": "Du verteilst Abrufversuche auf mehrere Zeitpunkte. Damit prüfst du das Behalten nach einer Pause, statt eine Antwort nur unmittelbar nach dem Lesen zu wiederholen.",
        "start": 1.82,
        "end": 11.18
      },
      {
        "section": "limit",
        "text": "Es gibt keinen festen Abstand, der für alle Inhalte und Menschen passt. Schwierigkeit, Vorwissen und gewünschte Behaltedauer spielen eine Rolle. Diese kurze Übung erklärt das Vorgehen; langfristiges Behalten zeigt sich erst bei späteren Abrufen.",
        "start": 11.48,
        "end": 26.12
      },
      {
        "section": "step-0",
        "text": "Lerne eine überschaubare Information und prüfe sie einmal ohne Vorlage.",
        "start": 26.42,
        "end": 30.900000000000002
      },
      {
        "section": "step-1",
        "text": "Plane einen späteren Abruf mit zeitlichem Abstand.",
        "start": 31.200000000000003,
        "end": 34.480000000000004
      },
      {
        "section": "step-2",
        "text": "Versuche zuerst selbst zu antworten, bevor du die Lösung öffnest.",
        "start": 34.78,
        "end": 38.7
      },
      {
        "section": "step-3",
        "text": "Bei einem Fehler: Bedeutung klären, korrigieren und wieder abrufen. Wähle den nächsten Abstand kürzer, wenn der Abruf zu schwer war.",
        "start": 39.0,
        "end": 48.28
      },
      {
        "section": "step-4",
        "text": "Wenn der Abruf zuverlässig gelingt, kann der nächste Abstand länger werden.",
        "start": 48.58,
        "end": 52.739999999999995
      },
      {
        "section": "step-5",
        "text": "Für gespeicherte Trainingsinhalte nutzt ANITEW bereits ein Wiederholungssystem. Folge den fälligen Wiedersehen statt parallel einen zweiten Plan zu führen.",
        "start": 53.03999999999999,
        "end": 62.57999999999999
      },
      {
        "section": "example",
        "text": "Mira lernt einen neuen Begriff. Sie erklärt ihn ohne Vorlage. Nach einer Pause versucht sie es erneut und bemerkt eine Lücke. Sie vergleicht mit der richtigen Erklärung, korrigiert die Lücke und setzt den nächsten Abruf früher an. Erst nach zuverlässigen Abrufen vergrößert sie den Abstand.",
        "start": 62.87999999999999,
        "end": 79.6
      },
      {
        "section": "explanation",
        "text": "Die Pause und der eigene Abruf sind entscheidend. Zehnmal direkt hintereinander zu lesen ersetzt keinen späteren Abruf. Miras Fehler zeigt ihr, wo sie nacharbeiten und den Abstand anpassen sollte.",
        "start": 79.89999999999999,
        "end": 91.25999999999999
      },
      {
        "section": "recall",
        "text": "Beschreibe Miras Vorgehen: Was tut sie vor dem Nachsehen? Wie reagiert sie auf die Lücke? Wann kann der Abstand größer werden?",
        "start": 91.55999999999999,
        "end": 99.96
      },
      {
        "section": "transfer",
        "text": "Nutze die fälligen Wiedersehen für deine gespeicherten Trainingsinhalte. Für Material außerhalb der App plane einen späteren Selbsttest; passe den Abstand an den tatsächlichen Abruf an. Ein abgeschlossener Lesekurs legt noch keine neuen Wiederholungskarten an.",
        "start": 100.25999999999999,
        "end": 115.13999999999999
      }
    ],
    "src": "/course-media/library/atta-spaced-practice-de-623db8ade4f5.m4a",
    "bytes": 1437721,
    "sha256": "623db8ade4f5ff12a14f3e5eaacc85ce8b319b58499579193a16a4bdbc5040dd"
  },
  {
    "course": "story-method",
    "coach": "rafael",
    "language": "de",
    "duration": 93.86008333333331,
    "cues": [
      {
        "start": 0.0,
        "end": 1.78,
        "text": "Willkommen bei ANITEW."
      },
      {
        "start": 2.08,
        "end": 4.640000000000001,
        "text": "Ich bin ein KI-generierter Lerncoach."
      },
      {
        "start": 4.9399999999999995,
        "end": 7.02,
        "text": "Heute geht es um die Geschichten-Methode."
      },
      {
        "start": 7.319999999999999,
        "end": 14.380041666666667,
        "text": "Die Geschichten-Methode ist eine Merktechnik: Du verknüpfst einzelne Informationen zu einer zusammenhängenden Geschichte."
      },
      {
        "start": 14.680041666666666,
        "end": 21.640083333333333,
        "text": "Sie kann dir helfen, eine Reihenfolge zu behalten, etwa bei einer Einkaufsliste oder den Stichpunkten eines Vortrags."
      },
      {
        "start": 21.940083333333334,
        "end": 24.180083333333336,
        "text": "Sie ersetzt nicht das Verstehen des Inhalts."
      },
      {
        "start": 24.480083333333333,
        "end": 30.960083333333333,
        "text": "In diesem Kurs lernst du zuerst das Prinzip, siehst ein Beispiel und probierst die Methode anschließend selbst aus."
      },
      {
        "start": 31.260083333333334,
        "end": 35.260083333333334,
        "text": "Dein Ziel: drei Begriffe in der richtigen Reihenfolge erinnern."
      },
      {
        "start": 35.56008333333333,
        "end": 39.40008333333333,
        "text": "Unser Beispiel ist: Schlüssel, Zitrone, Fahrrad."
      },
      {
        "start": 39.70008333333333,
        "end": 44.18008333333333,
        "text": "Zuerst stellst du dir vor, wie ein riesiger Schlüssel eine Zitrone aufdrückt."
      },
      {
        "start": 44.48008333333333,
        "end": 48.96008333333333,
        "text": "Der Zitronensaft spritzt auf ein Fahrrad und setzt seine Räder in Bewegung."
      },
      {
        "start": 49.260083333333334,
        "end": 55.180083333333336,
        "text": "So verbindet eine Handlung den ersten Begriff mit dem zweiten, und eine weitere den zweiten mit dem dritten."
      },
      {
        "start": 55.48008333333333,
        "end": 58.60008333333333,
        "text": "Die ungewöhnliche Geschichte ist nur eine Merkhilfe."
      },
      {
        "start": 58.900083333333335,
        "end": 62.74008333333333,
        "text": "Entscheidend ist, dass du dir die Handlung selbst deutlich vorstellst."
      },
      {
        "start": 63.040083333333335,
        "end": 64.88008333333333,
        "text": "Jetzt verschwinden die Bilder."
      },
      {
        "start": 65.18008333333333,
        "end": 69.50008333333332,
        "text": "Pausiere hier und nenne die drei Begriffe in der richtigen Reihenfolge."
      },
      {
        "start": 69.80008333333333,
        "end": 72.52008333333333,
        "text": "Wenn du bereit bist, blende die Lösung ein."
      },
      {
        "start": 72.82008333333333,
        "end": 76.18008333333333,
        "text": "Es waren: Schlüssel, Zitrone, Fahrrad."
      },
      {
        "start": 76.48008333333333,
        "end": 81.92008333333332,
        "text": "Fehlt dir ein Begriff, schau dir die passende Verbindung noch einmal an und versuche es erneut."
      },
      {
        "start": 82.22008333333332,
        "end": 88.38008333333332,
        "text": "Zum Schluss: Erfinde eine eigene Geschichte mit drei anderen Begriffen und rufe sie ohne Vorlage ab."
      },
      {
        "start": 88.68008333333331,
        "end": 93.56008333333331,
        "text": "Du kannst den gesamten Kurs auch lesen und alle Übungen in deinem eigenen Tempo machen."
      }
    ],
    "src": "/course-media/library/atta-story-de-bdc66ff18ee4.m4a",
    "bytes": 1118418,
    "sha256": "bdc66ff18ee47b5a492da62d90e1492319c1c57d96883eb73b184637bc865f83"
  },
  {
    "course": "text-meaning",
    "coach": "rafael",
    "language": "de",
    "duration": 100.5400833333333,
    "cues": [
      {
        "section": "title",
        "text": "Lange Texte inhaltlich behalten",
        "start": 0.0,
        "end": 2.32
      },
      {
        "section": "purpose",
        "text": "Du lernst, die Aussagen und Zusammenhänge eines Textes ohne Vorlage wiederzugeben. Das hilft bei Sachtexten, Vorträgen und Prüfungsvorbereitung.",
        "start": 2.6199999999999997,
        "end": 11.26
      },
      {
        "section": "limit",
        "text": "Eine Zusammenfassung enthält nicht jedes Detail. Wenn genaue Zahlen oder Formulierungen wichtig sind, übe sie zusätzlich. Beginne mit einem kurzen Abschnitt; verlängere ihn erst, wenn du ihn erklären kannst.",
        "start": 11.56,
        "end": 24.36
      },
      {
        "section": "step-0",
        "text": "Lies einen Abschnitt und kläre unbekannte Begriffe.",
        "start": 24.66,
        "end": 27.94
      },
      {
        "section": "step-1",
        "text": "Teile ihn nach Gedanken auf. Gib jedem Gedanken eine kurze Überschrift.",
        "start": 28.240000000000002,
        "end": 32.96
      },
      {
        "section": "step-2",
        "text": "Formuliere eine Frage pro Abschnitt: Was passiert? Warum? Welche Folge hat es?",
        "start": 33.26,
        "end": 38.62
      },
      {
        "section": "step-3",
        "text": "Decke die Vorlage ab und beantworte die Fragen in eigenen Worten.",
        "start": 38.919999999999995,
        "end": 42.519999999999996
      },
      {
        "section": "step-4",
        "text": "Vergleiche mit dem Original: Welche Aussage fehlt, welche Verbindung ist falsch? Korrigiere gezielt.",
        "start": 42.81999999999999,
        "end": 49.54004166666666
      },
      {
        "section": "step-5",
        "text": "Rufe den Inhalt später erneut ab. Passe den Abstand daran an, wie sicher der Abruf gelingt.",
        "start": 49.84004166666666,
        "end": 56.40004166666666
      },
      {
        "section": "example",
        "text": "Eine Stadt pflanzt Bäume an einer viel befahrenen Straße. Ihre Kronen spenden Schatten. Wasser verdunstet über die Blätter und trägt zur Kühlung bei. Damit die Bäume bei Trockenheit gesund bleiben, brauchen sie ausreichend Wasser und Platz für ihre Wurzeln.",
        "start": 56.70004166666666,
        "end": 71.74004166666666
      },
      {
        "section": "explanation",
        "text": "Drei Sinnabschnitte: Maßnahme (Bäume pflanzen), Wirkung (Schatten und Verdunstung), Voraussetzung (Wasser und Wurzelraum). Die Gliederung hält den Zusammenhang fest.",
        "start": 72.04004166666665,
        "end": 82.92004166666665
      },
      {
        "section": "recall",
        "text": "Erkläre ohne Vorlage: Welche Maßnahme wird beschrieben, wie wirkt sie und was braucht sie?",
        "start": 83.22004166666665,
        "end": 89.2200833333333
      },
      {
        "section": "transfer",
        "text": "Nimm einen eigenen kurzen Sachtext. Erstelle drei Leitfragen, lege den Text weg und beantworte sie. Steigere später die Länge, nicht nur die Anzahl der Wiederholungen.",
        "start": 89.5200833333333,
        "end": 100.2400833333333
      }
    ],
    "src": "/course-media/library/atta-text-meaning-de-6288fe833bcd.m4a",
    "bytes": 1229983,
    "sha256": "6288fe833bcdc0b12cf167819a1bb7cc64156cab7d11034b7496ca1545f142b1"
  },
  {
    "course": "text-verbatim",
    "coach": "rafael",
    "language": "de",
    "duration": 85.25999999999998,
    "cues": [
      {
        "section": "title",
        "text": "Texte wortgetreu lernen",
        "start": 0.0,
        "end": 2.0
      },
      {
        "section": "purpose",
        "text": "Du übst den genauen Wortlaut, etwa für ein Gedicht, eine Definition oder einen kurzen Vortrag. Dabei zählen auch kleine Wörter und die Reihenfolge.",
        "start": 2.3,
        "end": 11.66
      },
      {
        "section": "limit",
        "text": "Wortgetreuer Abruf beweist nicht, dass du den Inhalt verstanden hast. Kläre zuerst die Bedeutung. Ein Merkbilder-Weg kann die Reihenfolge stützen, ersetzt aber nicht das Üben des Wortlauts.",
        "start": 11.96,
        "end": 23.0
      },
      {
        "section": "step-0",
        "text": "Verstehe den Text und wähle eine kurze Sinneinheit.",
        "start": 23.3,
        "end": 26.26
      },
      {
        "section": "step-1",
        "text": "Lies sie aufmerksam und sprich sie einmal deutlich.",
        "start": 26.560000000000002,
        "end": 29.44
      },
      {
        "section": "step-2",
        "text": "Verdecke die Vorlage und sage oder schreibe sie aus dem Gedächtnis.",
        "start": 29.740000000000002,
        "end": 33.5
      },
      {
        "section": "step-3",
        "text": "Vergleiche Wort für Wort. Korrigiere Auslassungen, Vertauschungen und hinzugefügte Wörter.",
        "start": 33.8,
        "end": 40.199999999999996
      },
      {
        "section": "step-4",
        "text": "Übe die nächste Einheit und danach den Übergang zwischen beiden. Beginne gelegentlich in der Mitte.",
        "start": 40.49999999999999,
        "end": 46.57999999999999
      },
      {
        "section": "step-5",
        "text": "Wiederhole später ohne Vorlage. Verlängere den Abschnitt erst, wenn der aktuelle sicher gelingt.",
        "start": 46.87999999999999,
        "end": 52.47999999999999
      },
      {
        "section": "example",
        "text": "Am Morgen öffne ich das Fenster. Frische Luft strömt ins Zimmer. Danach beginne ich meinen Tag.",
        "start": 52.77999999999999,
        "end": 59.25999999999999
      },
      {
        "section": "explanation",
        "text": "Drei kurze Sätze bilden drei Übungseinheiten. Übe zuerst Satz eins, dann Satz zwei und schließlich ihren Übergang. Starte einen späteren Versuch auch mit „Frische Luft …“.",
        "start": 59.55999999999999,
        "end": 70.99999999999999
      },
      {
        "section": "recall",
        "text": "Schreibe die drei Sätze möglichst genau aus dem Gedächtnis.",
        "start": 71.29999999999998,
        "end": 74.65999999999998
      },
      {
        "section": "transfer",
        "text": "Nutze eine eigene kurze Passage, die du wortgetreu brauchst. Prüfe den Wortlaut selbst am Original; eine bloß ähnliche Formulierung erfüllt dieses Lernziel nicht.",
        "start": 74.95999999999998,
        "end": 84.95999999999998
      }
    ],
    "src": "/course-media/library/atta-text-verbatim-de-6154e31da6ce.m4a",
    "bytes": 1050064,
    "sha256": "6154e31da6ce7892f5bd10151365d0db6dbfd7a7bbe7cf17867f51caa2ca2d3a"
  },
  {
    "course": "active-recall",
    "coach": "lin",
    "language": "de",
    "duration": 101.98004166666664,
    "cues": [
      {
        "section": "title",
        "text": "Aktives Abrufen",
        "start": 0.0,
        "end": 1.52
      },
      {
        "section": "purpose",
        "text": "Du versuchst, eine Information ohne Vorlage wiederzugeben. Dabei erkennst du, was du selbst abrufen kannst und wo du noch nacharbeiten musst. Das hilft bei Fakten, Begriffen und Zusammenhängen.",
        "start": 1.82,
        "end": 13.74
      },
      {
        "section": "limit",
        "text": "Dass dir eine gelesene Antwort bekannt vorkommt, heißt nicht, dass du sie selbst abrufen kannst. Ein misslungener Versuch ist kein Endurteil: Prüfe die richtige Antwort, kläre sie und versuche es erneut. Häufiges Raten ohne Rückmeldung kann Fehler festigen.",
        "start": 14.040000000000001,
        "end": 28.68
      },
      {
        "section": "step-0",
        "text": "Wähle eine kleine, verstandene Information.",
        "start": 28.98,
        "end": 32.260041666666666
      },
      {
        "section": "step-1",
        "text": "Stelle eine klare Frage, die sich aus dem Material beantworten lässt.",
        "start": 32.56004166666666,
        "end": 36.64004166666666
      },
      {
        "section": "step-2",
        "text": "Lege die Vorlage weg und antworte, bevor du nachsiehst.",
        "start": 36.94004166666666,
        "end": 40.70004166666666
      },
      {
        "section": "step-3",
        "text": "Vergleiche deine Antwort mit dem Original. Korrigiere fehlende oder falsche Teile.",
        "start": 41.000041666666654,
        "end": 46.12004166666665
      },
      {
        "section": "step-4",
        "text": "Verdecke die richtige Antwort und versuche den Abruf noch einmal.",
        "start": 46.42004166666665,
        "end": 50.66004166666665
      },
      {
        "section": "step-5",
        "text": "Prüfe später erneut. Nur sofort wiederholen kann sich leicht anfühlen, ohne dauerhaftes Behalten zu zeigen.",
        "start": 50.96004166666665,
        "end": 58.00004166666665
      },
      {
        "section": "example",
        "text": "Frage: Warum kühlt verdunstendes Wasser eine Oberfläche?\nAntwort: Zum Verdunsten wird Energie benötigt. Diese Energie wird der Oberfläche und ihrer Umgebung als Wärme entzogen.",
        "start": 58.300041666666644,
        "end": 69.82004166666664
      },
      {
        "section": "explanation",
        "text": "Lies und verstehe zunächst die Antwort. Decke sie dann ab und beantworte die Frage selbst. „Wasser kühlt“ allein erklärt den Zusammenhang noch nicht; entscheidend sind Energiebedarf und Wärmeentzug.",
        "start": 70.12004166666664,
        "end": 82.04004166666664
      },
      {
        "section": "recall",
        "text": "Warum kann verdunstendes Wasser eine Oberfläche kühlen? Erkläre den Zusammenhang ohne Vorlage.",
        "start": 82.34004166666664,
        "end": 88.90004166666664
      },
      {
        "section": "transfer",
        "text": "Formuliere zu deinem eigenen Material eine konkrete Frage. Antworte zunächst ohne Vorlage, vergleiche danach und versuche es später erneut. Die App nutzt Abrufversuche auch in ihren Trainingseinheiten.",
        "start": 89.20004166666664,
        "end": 101.68004166666664
      }
    ],
    "src": "/course-media/library/lin-active-recall-de-a3afe0988269.m4a",
    "bytes": 1227713,
    "sha256": "a3afe0988269b390bd584e44fe3e49c351fe6878baf83763bac50c3b3f1bb30e"
  },
  {
    "course": "interleaved-practice",
    "coach": "lin",
    "language": "de",
    "duration": 104.52004166666667,
    "cues": [
      {
        "section": "title",
        "text": "Passende Vorgehensweisen unterscheiden",
        "start": 0.0,
        "end": 2.32
      },
      {
        "section": "purpose",
        "text": "Beim gezielten Mischen wechselst du zwischen ähnlichen Aufgabentypen und entscheidest selbst, welches Vorgehen passt. So übst du auch die Auswahl einer Methode.",
        "start": 2.6199999999999997,
        "end": 12.379999999999999
      },
      {
        "section": "limit",
        "text": "Lerne neue Vorgehensweisen zuerst an klaren Beispielen. Wahlloses Themenwechseln oder Multitasking ist nicht dasselbe. Ob das Mischen hilft, hängt auch vom Material und deinem Vorwissen ab.",
        "start": 12.68,
        "end": 24.04
      },
      {
        "section": "step-0",
        "text": "Verstehe die einzelnen Vorgehensweisen zunächst getrennt.",
        "start": 24.34,
        "end": 27.620041666666665
      },
      {
        "section": "step-1",
        "text": "Mische anschließend wenige verwandte Aufgabentypen.",
        "start": 27.920041666666666,
        "end": 31.280041666666666
      },
      {
        "section": "step-2",
        "text": "Bestimme vor dem Rechnen oder Antworten, welcher Typ vorliegt und warum.",
        "start": 31.580041666666666,
        "end": 36.38004166666666
      },
      {
        "section": "step-3",
        "text": "Löse die Aufgabe und prüfe Auswahl und Ergebnis getrennt.",
        "start": 36.68004166666667,
        "end": 40.36004166666667
      },
      {
        "section": "step-4",
        "text": "Arbeite Fehler gezielt nach und kehre danach zur gemischten Übung zurück.",
        "start": 40.660041666666665,
        "end": 45.620041666666665
      },
      {
        "section": "example",
        "text": "Rechteck: Fläche = Länge × Breite. Dreieck: Fläche = Grundseite × zugehörige Höhe ÷ 2. Beispiel: Ein Rechteck mit 4 cm Länge und 3 cm Breite hat 12 cm². Ein Dreieck mit 4 cm Grundseite und 3 cm zugehöriger Höhe hat 6 cm².",
        "start": 45.92004166666666,
        "end": 65.38004166666667
      },
      {
        "section": "explanation",
        "text": "Gleiche Zahlen verlangen nicht automatisch dieselbe Rechnung. Die Figur entscheidet: Beim Dreieck gehört der Faktor ein Halb dazu. In gemischten Aufgaben muss die Aufgabenart erkannt werden, bevor die Regel angewandt wird.",
        "start": 65.68004166666667,
        "end": 78.80004166666667
      },
      {
        "section": "recall",
        "text": "Aufgabe A: Dreieck mit Grundseite 6 cm und zugehöriger Höhe 4 cm. Aufgabe B: Rechteck mit Länge 6 cm und Breite 4 cm. Nenne jeweils die passende Regel und die Fläche.",
        "start": 79.10004166666667,
        "end": 94.24004166666667
      },
      {
        "section": "transfer",
        "text": "Wähle zwei oder drei bereits eingeführte, verwandte Aufgabentypen aus deinem Lernstoff. Mische sie und begründe vor jeder Lösung deine Auswahl des Vorgehens.",
        "start": 94.54004166666667,
        "end": 104.22004166666667
      }
    ],
    "src": "/course-media/library/lin-interleaved-practice-de-382dbed3f15c.m4a",
    "bytes": 1260762,
    "sha256": "382dbed3f15ccc426b6591cfbfe138eae3fe4efbf1a5936da9333e0cec4dd30e"
  },
  {
    "course": "keyword-method",
    "coach": "lin",
    "language": "de",
    "duration": 91.56004166666668,
    "cues": [
      {
        "section": "title",
        "text": "Neue Vokabeln mit Schlüsselwörtern verbinden",
        "start": 0.0,
        "end": 2.8
      },
      {
        "section": "purpose",
        "text": "Ein ähnlich klingendes bekanntes Wort kann als Brücke zu einer fremdsprachigen Bedeutung dienen. Du verknüpfst das Schlüsselwort bildlich mit der Bedeutung und prüfst danach die echte Vokabel.",
        "start": 3.0999999999999996,
        "end": 14.139999999999999
      },
      {
        "section": "limit",
        "text": "Ein ähnlicher Klang ist keine korrekte Aussprache. Nicht für jedes Wort gibt es eine gute Brücke. Die Methode ersetzt weder Ausspracheprüfung noch Schreibweise und Verwendung im Satz.",
        "start": 14.44,
        "end": 25.64
      },
      {
        "section": "step-0",
        "text": "Prüfe Bedeutung und korrekte Aussprache der neuen Vokabel.",
        "start": 25.939999999999998,
        "end": 30.099999999999998
      },
      {
        "section": "step-1",
        "text": "Suche ein bekanntes Wort mit ähnlichem Klang.",
        "start": 30.4,
        "end": 33.700041666666664
      },
      {
        "section": "step-2",
        "text": "Verbinde dieses Schlüsselwort und die Bedeutung durch eine klare Vorstellung.",
        "start": 34.00004166666667,
        "end": 38.24004166666667
      },
      {
        "section": "step-3",
        "text": "Rufe die Bedeutung aus der Vokabel ab und danach die Vokabel aus der Bedeutung.",
        "start": 38.54004166666667,
        "end": 44.14004166666667
      },
      {
        "section": "step-4",
        "text": "Prüfe das Original: Aussprache, Schreibweise und ein passender Beispielsatz.",
        "start": 44.440041666666666,
        "end": 50.200041666666664
      },
      {
        "section": "example",
        "text": "Englisch: bell = Glocke. Beispielsatz: The bell rings. = Die Glocke läutet.",
        "start": 50.50004166666667,
        "end": 58.92004166666667
      },
      {
        "section": "explanation",
        "text": "Als deutsche Klangbrücke kann „bellen“ dienen: Du stellst dir eine Glocke vor, die wie ein Hund bellt. „Bellen“ ist die Eselsbrücke, nicht die englische Aussprache von bell.",
        "start": 59.22004166666667,
        "end": 70.66004166666667
      },
      {
        "section": "recall",
        "text": "Welche englische Vokabel bedeutet Glocke? Schreibe die Vokabel, ihre Bedeutung und den Beispielsatz aus dem Gedächtnis.",
        "start": 70.96004166666667,
        "end": 78.72004166666667
      },
      {
        "section": "transfer",
        "text": "Teste die Technik an einer Vokabel, die du wirklich brauchst. Prüfe auch die Gegenrichtung: Kannst du aus der Bedeutung die fremdsprachige Form abrufen? Verwirrt dich das Schlüsselwort, ändere die Brücke oder nutze direktes Abrufen.",
        "start": 79.02004166666667,
        "end": 91.26004166666667
      }
    ],
    "src": "/course-media/library/lin-keyword-method-de-c72cc72e50dc.m4a",
    "bytes": 1051577,
    "sha256": "c72cc72e50dc1b05beb57084d7f369c7ebb01e9ed75a68765cf0770d36e896dd"
  },
  {
    "course": "long-words",
    "coach": "lin",
    "language": "de",
    "duration": 89.02004166666666,
    "cues": [
      {
        "section": "title",
        "text": "Lange Wörter sicher behalten",
        "start": 0.0,
        "end": 2.24
      },
      {
        "section": "purpose",
        "text": "Du zerlegst ein langes Wort in verständliche Bausteine, setzt sie wieder zusammen und übst Bedeutung, Aussprache und Schreibweise.",
        "start": 2.54,
        "end": 9.820041666666667
      },
      {
        "section": "limit",
        "text": "Bedeutungsbausteine sind nicht immer Sprechsilben. Nicht jedes Fachwort lässt sich sofort sinnvoll zerlegen. Kläre unbekannte Teile und die korrekte Aussprache, bevor du sie übst.",
        "start": 10.120041666666667,
        "end": 20.520041666666668
      },
      {
        "section": "step-0",
        "text": "Kläre die Bedeutung des ganzen Wortes.",
        "start": 20.82004166666667,
        "end": 23.30004166666667
      },
      {
        "section": "step-1",
        "text": "Suche bekannte Bausteine und erkläre ihre Bedeutung.",
        "start": 23.60004166666667,
        "end": 27.52004166666667
      },
      {
        "section": "step-2",
        "text": "Achte auf Verbindungselemente wie das s in Versicherungsbeitrag.",
        "start": 27.820041666666672,
        "end": 31.980041666666672
      },
      {
        "section": "step-3",
        "text": "Sprich die Teile langsam und dann das ganze Wort flüssig. Sprechsilben können anders verlaufen als die Bedeutungsgrenzen.",
        "start": 32.28004166666667,
        "end": 39.88004166666667
      },
      {
        "section": "step-4",
        "text": "Verdecke die Vorlage, schreibe das ganze Wort und erkläre es.",
        "start": 40.18004166666667,
        "end": 44.340041666666664
      },
      {
        "section": "step-5",
        "text": "Vergleiche Schreibweise und Bedeutung. Übe unsichere Stellen und setze danach wieder das ganze Wort zusammen.",
        "start": 44.64004166666666,
        "end": 52.24004166666666
      },
      {
        "section": "example",
        "text": "Krankenversicherungsbeitrag",
        "start": 52.54004166666666,
        "end": 54.46004166666666
      },
      {
        "section": "explanation",
        "text": "Kranken | versicherung | s | beitrag. Gemeint ist der Beitrag zur Krankenversicherung. Das s verbindet Wortteile; es ist hier kein eigenes Bedeutungswort. Diese Aufteilung zeigt Bausteine, keine Silbentrennung.",
        "start": 54.76004166666666,
        "end": 69.24004166666666
      },
      {
        "section": "recall",
        "text": "Schreibe das vollständige Wort aus dem Gedächtnis. Erkläre anschließend mündlich seine Bedeutung und sprich es flüssig aus.",
        "start": 69.54004166666665,
        "end": 77.30004166666666
      },
      {
        "section": "transfer",
        "text": "Wähle ein langes Wort aus deinem Alltag. Suche sinnvolle Bausteine und prüfe danach das vollständige Wort. Für andere Sprachen gelten deren Wortbildungs- und Ausspracheregeln.",
        "start": 77.60004166666666,
        "end": 88.72004166666666
      }
    ],
    "src": "/course-media/library/lin-long-words-de-c14ecd0b2828.m4a",
    "bytes": 1050751,
    "sha256": "c14ecd0b28281309c049eb5f5162ee70ae19a410f8001278352df2cf630c3a77"
  },
  {
    "course": "meaningful-groups",
    "coach": "lin",
    "language": "de",
    "duration": 105.01999999999997,
    "cues": [
      {
        "section": "title",
        "text": "Sinnvolle Einheiten bilden",
        "start": 0.0,
        "end": 2.24
      },
      {
        "section": "purpose",
        "text": "Du ordnest einzelne Informationen in verständliche Gruppen. Eine passende Struktur kann dir helfen, Inhalte zu überblicken und beim Abruf systematisch nach ihnen zu suchen.",
        "start": 2.54,
        "end": 13.739999999999998
      },
      {
        "section": "limit",
        "text": "Gruppieren allein garantiert keinen vollständigen Abruf. Die Gruppen müssen für dich sinnvoll sein; fremde Fachbegriffe werden nicht durch eine Überschrift verständlich. Wenn die ursprüngliche Reihenfolge zählt, musst du sie zusätzlich üben.",
        "start": 14.04,
        "end": 27.96
      },
      {
        "section": "step-0",
        "text": "Kläre, was du behalten möchtest: Inhalte, Reihenfolge oder beides.",
        "start": 28.26,
        "end": 33.620000000000005
      },
      {
        "section": "step-1",
        "text": "Suche Gemeinsamkeiten oder Beziehungen zwischen den Informationen.",
        "start": 33.92,
        "end": 38.400000000000006
      },
      {
        "section": "step-2",
        "text": "Bilde wenige übersichtliche Gruppen und gib jeder eine aussagekräftige Überschrift.",
        "start": 38.7,
        "end": 43.580000000000005
      },
      {
        "section": "step-3",
        "text": "Erkläre, warum die einzelnen Teile zu ihrer Gruppe gehören.",
        "start": 43.88,
        "end": 47.56
      },
      {
        "section": "step-4",
        "text": "Verdecke die Vorlage. Rufe zuerst die Gruppen und dann ihre Inhalte ab.",
        "start": 47.86,
        "end": 52.98
      },
      {
        "section": "step-5",
        "text": "Vergleiche mit dem Original, ergänze fehlende Teile und versuche es später erneut.",
        "start": 53.279999999999994,
        "end": 59.11999999999999
      },
      {
        "section": "example",
        "text": "Apfel · Hammer · Hemd · Birne · Säge · Jacke · Banane · Zange · Hose",
        "start": 59.41999999999999,
        "end": 65.49999999999999
      },
      {
        "section": "explanation",
        "text": "Eine mögliche Ordnung: Obst (Apfel, Birne, Banane), Werkzeug (Hammer, Säge, Zange), Kleidung (Hemd, Jacke, Hose). Die drei Überschriften geben dir Suchhilfen. In dieser Übung zählen alle neun Begriffe; ihre ursprüngliche Reihenfolge ist nicht das Lernziel.",
        "start": 65.79999999999998,
        "end": 83.95999999999998
      },
      {
        "section": "recall",
        "text": "Nenne ohne Vorlage die drei Gruppen und möglichst alle neun Begriffe. Die Reihenfolge innerhalb einer Gruppe ist frei.",
        "start": 84.25999999999998,
        "end": 91.77999999999997
      },
      {
        "section": "transfer",
        "text": "Gliedere einen eigenen Abschnitt nach Gedanken oder eine Liste nach sinnvollen Kategorien. Erfinde keine Gruppen nur für eine bestimmte Anzahl. Prüfe immer auch den vollständigen Inhalt, nicht nur die Überschriften.",
        "start": 92.07999999999997,
        "end": 104.71999999999997
      }
    ],
    "src": "/course-media/library/lin-meaningful-groups-de-682236911faf.m4a",
    "bytes": 1228285,
    "sha256": "682236911faf7aa5f2e60c9557fac80c8e0cbf558c3325e29449c0fb07eec5cb"
  },
  {
    "course": "method-of-loci",
    "coach": "lin",
    "language": "de",
    "duration": 89.78004166666666,
    "cues": [
      {
        "section": "title",
        "text": "Orte als Gedächtnisstützen nutzen",
        "start": 0.0,
        "end": 2.24
      },
      {
        "section": "purpose",
        "text": "Bei der Loci-Methode legst du vorgestellte Inhalte an feste Orte eines vertrauten Weges. Beim gedanklichen Abgehen helfen die Orte, die Inhalte wiederzufinden.",
        "start": 2.54,
        "end": 12.46
      },
      {
        "section": "limit",
        "text": "Lerne zuerst einen stabilen Weg. Zu viele ähnliche Bilder am selben Ort können sich verwechseln. Die Orte unterstützen Struktur und Reihenfolge, nicht automatisch exakte Formulierungen.",
        "start": 12.760000000000002,
        "end": 24.28
      },
      {
        "section": "step-0",
        "text": "Wähle einen vertrauten Weg mit klar unterscheidbaren Stationen.",
        "start": 24.580000000000002,
        "end": 28.660000000000004
      },
      {
        "section": "step-1",
        "text": "Lege eine feste Reihenfolge fest und gehe sie einmal ohne Lerninhalt durch.",
        "start": 28.96,
        "end": 34.40004166666667
      },
      {
        "section": "step-2",
        "text": "Verbinde pro Station einen Begriff durch ein deutliches vorgestelltes Ereignis mit dem Ort.",
        "start": 34.700041666666664,
        "end": 39.980041666666665
      },
      {
        "section": "step-3",
        "text": "Gehe die Stationen ohne Vorlage ab und nenne die Begriffe.",
        "start": 40.28004166666666,
        "end": 44.120041666666665
      },
      {
        "section": "step-4",
        "text": "Vergleiche den Abruf. Verbessere verwechselbare Orte oder schwache Bilder.",
        "start": 44.42004166666666,
        "end": 49.94004166666666
      },
      {
        "section": "example",
        "text": "Beispielweg: Haustür → Schuhregal → Küchentisch. Begriffe: Brot → Seife → Kerze.",
        "start": 50.24004166666666,
        "end": 58.18004166666666
      },
      {
        "section": "explanation",
        "text": "An der Haustür klemmt ein riesiges Brot. Das Schuhregal quillt vor Seifenschaum über. Auf dem Küchentisch steht eine leuchtende Kerze. Der Weg dient hier nur als Beispiel; für eigenes Lernen eignet sich ein tatsächlich vertrauter Weg.",
        "start": 58.480041666666665,
        "end": 72.16004166666667
      },
      {
        "section": "recall",
        "text": "Gehe die drei Stationen gedanklich ab. Schreibe zu jeder Station den zugehörigen Begriff.",
        "start": 72.46004166666667,
        "end": 77.82004166666667
      },
      {
        "section": "transfer",
        "text": "Lege im bestehenden Gedächtnispalast der App deinen vertrauten Weg an oder nutze einen vorhandenen. Beginne mit wenigen Stationen und prüfe, ob du jeden Ort sicher unterscheiden kannst.",
        "start": 78.12004166666667,
        "end": 89.48004166666666
      }
    ],
    "src": "/course-media/library/lin-method-of-loci-de-4221a71f6ff3.m4a",
    "bytes": 1068733,
    "sha256": "4221a71f6ff350659cb7a3e1c27f77655aa40736bee2166e915876036f3e5462"
  },
  {
    "course": "number-images",
    "coach": "lin",
    "language": "de",
    "duration": 88.6,
    "cues": [
      {
        "section": "title",
        "text": "Zahlen in Bilder übersetzen",
        "start": 0.0,
        "end": 2.48
      },
      {
        "section": "purpose",
        "text": "Das Major-System ordnet Ziffern Konsonantenlaute zu. Daraus bildest du ein Wort und stellst dir ein Bild vor. Dieses Bild soll sich wieder in die Zahl zurückübersetzen lassen.",
        "start": 2.78,
        "end": 13.1
      },
      {
        "section": "limit",
        "text": "Du musst die Zuordnungen zuerst lernen. Ein Bild ohne verlässliche Rückübersetzung hilft beim Zahlenabruf nicht. Dieser Einstieg übt nur zwei Ziffern; die vorhandenen Major-Lektionen vermitteln weitere Zuordnungen.",
        "start": 13.4,
        "end": 26.6
      },
      {
        "section": "step-0",
        "text": "Lerne zunächst wenige feste Ziffer-Laut-Paare.",
        "start": 26.9,
        "end": 30.419999999999998
      },
      {
        "section": "step-1",
        "text": "Lies die Laute in der Reihenfolge der Ziffern.",
        "start": 30.72,
        "end": 33.6
      },
      {
        "section": "step-2",
        "text": "Ergänze passende Vokale zu einem bildhaften Wort.",
        "start": 33.9,
        "end": 37.26
      },
      {
        "section": "step-3",
        "text": "Prüfe die Konsonantenlaute: Enthält das Wort zusätzliche zählende Laute?",
        "start": 37.559999999999995,
        "end": 42.919999999999995
      },
      {
        "section": "step-4",
        "text": "Rufe aus dem Bild das Wort und aus dessen Lauten wieder die Zahl ab.",
        "start": 43.22,
        "end": 47.22
      },
      {
        "section": "example",
        "text": "1 → t/d; 2 → n. Die Zahl 12 kann zum Bild einer Tanne werden: t + n.",
        "start": 47.519999999999996,
        "end": 55.22
      },
      {
        "section": "explanation",
        "text": "Die Vokale zählen hier nicht. Das doppelt geschriebene n in Tanne ist ein Konsonantenlaut. Beim Rückweg erhältst du t → 1 und n → 2, also 12. Entscheidend ist der Klang, nicht die Anzahl geschriebener Buchstaben.",
        "start": 55.519999999999996,
        "end": 69.69999999999999
      },
      {
        "section": "recall",
        "text": "Welche Zahl steckt im Bild Tanne? Erkläre den Rückweg über die beiden Konsonantenlaute.",
        "start": 70.0,
        "end": 76.0
      },
      {
        "section": "transfer",
        "text": "Übe die weiteren festen Zuordnungen in den bestehenden Major-Lektionen. Füge erst dann längere Zahlenfolgen hinzu. Prüfe bei jedem eigenen Bild den Rückweg zur exakten Zahl.",
        "start": 76.3,
        "end": 88.3
      }
    ],
    "src": "/course-media/library/lin-number-images-de-0284ec4074b6.m4a",
    "bytes": 1045034,
    "sha256": "0284ec4074b619d06da67a57578531a545926b67a90f77ce502980227a883269"
  },
  {
    "course": "self-explanation",
    "coach": "lin",
    "language": "de",
    "duration": 113.67999999999999,
    "cues": [
      {
        "section": "title",
        "text": "Zusammenhänge selbst erklären",
        "start": 0.0,
        "end": 2.0
      },
      {
        "section": "purpose",
        "text": "Du erklärst mit eigenen Worten, warum ein Schritt sinnvoll ist oder wie zwei Aussagen zusammenhängen. So kannst du Verständnislücken entdecken, die beim bloßen Lesen unauffällig bleiben.",
        "start": 2.3,
        "end": 12.620000000000001
      },
      {
        "section": "limit",
        "text": "Eine flüssige Erklärung kann trotzdem falsch sein. Prüfe sie an einer zuverlässigen Vorlage und kennzeichne Unsicherheit. Die Methode ergänzt das Üben; sie ersetzt weder Fachwissen noch eine Prüfung deiner Erklärung.",
        "start": 12.920000000000002,
        "end": 26.12
      },
      {
        "section": "step-0",
        "text": "Wähle einen überschaubaren Zusammenhang, den du verstehen möchtest.",
        "start": 26.42,
        "end": 30.580000000000002
      },
      {
        "section": "step-1",
        "text": "Frage: Warum folgt dieser Schritt? Was bleibt gleich? Was würde sich bei anderen Bedingungen ändern?",
        "start": 30.880000000000003,
        "end": 37.92
      },
      {
        "section": "step-2",
        "text": "Formuliere deine Erklärung ohne die Vorlage zu kopieren.",
        "start": 38.22,
        "end": 42.14
      },
      {
        "section": "step-3",
        "text": "Vergleiche sie mit der Begründung im Original. Trenne gesicherte Aussagen von Vermutungen.",
        "start": 42.44,
        "end": 48.519999999999996
      },
      {
        "section": "step-4",
        "text": "Korrigiere Lücken und wende die Erklärung auf ein ähnliches Beispiel an.",
        "start": 48.82,
        "end": 53.46
      },
      {
        "section": "step-5",
        "text": "Erkläre den Zusammenhang später noch einmal ohne Vorlage.",
        "start": 53.76,
        "end": 57.28
      },
      {
        "section": "example",
        "text": "Drei Viertel sind gleich viel wie sechs Achtel: 3/4 = 6/8. Wenn jedes der vier gleich großen Teile noch einmal halbiert wird, entstehen acht gleich große Teile. Die drei ausgewählten Viertel bestehen dann aus sechs Achteln. Die ausgewählte Menge bleibt gleich.",
        "start": 57.58,
        "end": 74.08
      },
      {
        "section": "explanation",
        "text": "„Oben und unten mal zwei“ beschreibt eine Rechenregel. Die Erklärung mit den halbierten Teilen begründet, warum sich der Wert nicht ändert. Zum Übertragen kannst du überlegen, weshalb 2/3 und 4/6 denselben Anteil beschreiben.",
        "start": 74.38,
        "end": 88.46
      },
      {
        "section": "recall",
        "text": "Erkläre ohne Vorlage, warum 3/4 und 6/8 gleich viel sind. Übertrage die Begründung anschließend auf 2/3 und 4/6.",
        "start": 88.75999999999999,
        "end": 98.52
      },
      {
        "section": "transfer",
        "text": "Nimm einen Schritt aus deinem Lernstoff und erkläre, warum er gilt. Suche ein ähnliches Beispiel und prüfe deine Erklärung daran. Wenn du die Begründung nicht verlässlich prüfen kannst, halte die offene Frage fest, statt Sicherheit vorzutäuschen.",
        "start": 98.82,
        "end": 113.38
      }
    ],
    "src": "/course-media/library/lin-self-explanation-de-db02b5c93fc7.m4a",
    "bytes": 1350102,
    "sha256": "db02b5c93fc7865133829805a555ea6a4e420a0f6aa9aca71f2108dee9a1c93d"
  },
  {
    "course": "spaced-practice",
    "coach": "lin",
    "language": "de",
    "duration": 116.07999999999998,
    "cues": [
      {
        "section": "title",
        "text": "Verteiltes Wiederholen",
        "start": 0.0,
        "end": 1.6
      },
      {
        "section": "purpose",
        "text": "Du verteilst Abrufversuche auf mehrere Zeitpunkte. Damit prüfst du das Behalten nach einer Pause, statt eine Antwort nur unmittelbar nach dem Lesen zu wiederholen.",
        "start": 1.9000000000000001,
        "end": 11.34
      },
      {
        "section": "limit",
        "text": "Es gibt keinen festen Abstand, der für alle Inhalte und Menschen passt. Schwierigkeit, Vorwissen und gewünschte Behaltedauer spielen eine Rolle. Diese kurze Übung erklärt das Vorgehen; langfristiges Behalten zeigt sich erst bei späteren Abrufen.",
        "start": 11.64,
        "end": 26.520000000000003
      },
      {
        "section": "step-0",
        "text": "Lerne eine überschaubare Information und prüfe sie einmal ohne Vorlage.",
        "start": 26.820000000000004,
        "end": 31.860000000000003
      },
      {
        "section": "step-1",
        "text": "Plane einen späteren Abruf mit zeitlichem Abstand.",
        "start": 32.160000000000004,
        "end": 35.760000000000005
      },
      {
        "section": "step-2",
        "text": "Versuche zuerst selbst zu antworten, bevor du die Lösung öffnest.",
        "start": 36.06,
        "end": 39.900000000000006
      },
      {
        "section": "step-3",
        "text": "Bei einem Fehler: Bedeutung klären, korrigieren und wieder abrufen. Wähle den nächsten Abstand kürzer, wenn der Abruf zu schwer war.",
        "start": 40.2,
        "end": 49.32
      },
      {
        "section": "step-4",
        "text": "Wenn der Abruf zuverlässig gelingt, kann der nächste Abstand länger werden.",
        "start": 49.62,
        "end": 53.86
      },
      {
        "section": "step-5",
        "text": "Für gespeicherte Trainingsinhalte nutzt ANITEW bereits ein Wiederholungssystem. Folge den fälligen Wiedersehen statt parallel einen zweiten Plan zu führen.",
        "start": 54.16,
        "end": 63.94
      },
      {
        "section": "example",
        "text": "Mira lernt einen neuen Begriff. Sie erklärt ihn ohne Vorlage. Nach einer Pause versucht sie es erneut und bemerkt eine Lücke. Sie vergleicht mit der richtigen Erklärung, korrigiert die Lücke und setzt den nächsten Abruf früher an. Erst nach zuverlässigen Abrufen vergrößert sie den Abstand.",
        "start": 64.24,
        "end": 81.11999999999999
      },
      {
        "section": "explanation",
        "text": "Die Pause und der eigene Abruf sind entscheidend. Zehnmal direkt hintereinander zu lesen ersetzt keinen späteren Abruf. Miras Fehler zeigt ihr, wo sie nacharbeiten und den Abstand anpassen sollte.",
        "start": 81.41999999999999,
        "end": 92.38
      },
      {
        "section": "recall",
        "text": "Beschreibe Miras Vorgehen: Was tut sie vor dem Nachsehen? Wie reagiert sie auf die Lücke? Wann kann der Abstand größer werden?",
        "start": 92.67999999999999,
        "end": 100.91999999999999
      },
      {
        "section": "transfer",
        "text": "Nutze die fälligen Wiedersehen für deine gespeicherten Trainingsinhalte. Für Material außerhalb der App plane einen späteren Selbsttest; passe den Abstand an den tatsächlichen Abruf an. Ein abgeschlossener Lesekurs legt noch keine neuen Wiederholungskarten an.",
        "start": 101.21999999999998,
        "end": 115.77999999999999
      }
    ],
    "src": "/course-media/library/lin-spaced-practice-de-371229af12a0.m4a",
    "bytes": 1397659,
    "sha256": "371229af12a0cdec564b60944b59bfeb7002aac0a3ac168f7c987ef6f84359fa"
  },
  {
    "course": "story-method",
    "coach": "lin",
    "language": "de",
    "duration": 100.74004166666668,
    "cues": [
      {
        "start": 0.0,
        "end": 2.42,
        "text": "Willkommen bei ANITEW."
      },
      {
        "start": 2.7199999999999998,
        "end": 5.6,
        "text": "Ich bin ein KI-generierter Lerncoach."
      },
      {
        "start": 5.8999999999999995,
        "end": 8.059999999999999,
        "text": "Heute geht es um die Geschichten-Methode."
      },
      {
        "start": 8.36,
        "end": 15.899999999999999,
        "text": "Die Geschichten-Methode ist eine Merktechnik: Du verknüpfst einzelne Informationen zu einer zusammenhängenden Geschichte."
      },
      {
        "start": 16.2,
        "end": 23.56,
        "text": "Sie kann dir helfen, eine Reihenfolge zu behalten, etwa bei einer Einkaufsliste oder den Stichpunkten eines Vortrags."
      },
      {
        "start": 23.86,
        "end": 26.9,
        "text": "Sie ersetzt nicht das Verstehen des Inhalts."
      },
      {
        "start": 27.2,
        "end": 33.92,
        "text": "In diesem Kurs lernst du zuerst das Prinzip, siehst ein Beispiel und probierst die Methode anschließend selbst aus."
      },
      {
        "start": 34.22,
        "end": 38.379999999999995,
        "text": "Dein Ziel: drei Begriffe in der richtigen Reihenfolge erinnern."
      },
      {
        "start": 38.68,
        "end": 43.24,
        "text": "Unser Beispiel ist: Schlüssel, Zitrone, Fahrrad."
      },
      {
        "start": 43.54,
        "end": 48.339999999999996,
        "text": "Zuerst stellst du dir vor, wie ein riesiger Schlüssel eine Zitrone aufdrückt."
      },
      {
        "start": 48.64,
        "end": 53.04,
        "text": "Der Zitronensaft spritzt auf ein Fahrrad und setzt seine Räder in Bewegung."
      },
      {
        "start": 53.34,
        "end": 59.74,
        "text": "So verbindet eine Handlung den ersten Begriff mit dem zweiten, und eine weitere den zweiten mit dem dritten."
      },
      {
        "start": 60.040000000000006,
        "end": 63.480000000000004,
        "text": "Die ungewöhnliche Geschichte ist nur eine Merkhilfe."
      },
      {
        "start": 63.78000000000001,
        "end": 68.02000000000001,
        "text": "Entscheidend ist, dass du dir die Handlung selbst deutlich vorstellst."
      },
      {
        "start": 68.32000000000001,
        "end": 70.16000000000001,
        "text": "Jetzt verschwinden die Bilder."
      },
      {
        "start": 70.46000000000001,
        "end": 74.62,
        "text": "Pausiere hier und nenne die drei Begriffe in der richtigen Reihenfolge."
      },
      {
        "start": 74.92,
        "end": 77.88,
        "text": "Wenn du bereit bist, blende die Lösung ein."
      },
      {
        "start": 78.18,
        "end": 81.78,
        "text": "Es waren: Schlüssel, Zitrone, Fahrrad."
      },
      {
        "start": 82.08000000000001,
        "end": 88.00000000000001,
        "text": "Fehlt dir ein Begriff, schau dir die passende Verbindung noch einmal an und versuche es erneut."
      },
      {
        "start": 88.30000000000001,
        "end": 95.18004166666668,
        "text": "Zum Schluss: Erfinde eine eigene Geschichte mit drei anderen Begriffen und rufe sie ohne Vorlage ab."
      },
      {
        "start": 95.48004166666668,
        "end": 100.44004166666667,
        "text": "Du kannst den gesamten Kurs auch lesen und alle Übungen in deinem eigenen Tempo machen."
      }
    ],
    "src": "/course-media/library/lin-story-de-9d35336d9561.m4a",
    "bytes": 1139721,
    "sha256": "9d35336d956192e3be7c86adb0ead201d254ef1a97b95580d633a6f03a0cf754"
  },
  {
    "course": "text-meaning",
    "coach": "lin",
    "language": "de",
    "duration": 102.73337499999997,
    "cues": [
      {
        "section": "title",
        "text": "Lange Texte inhaltlich behalten",
        "start": 0.0,
        "end": 2.32
      },
      {
        "section": "purpose",
        "text": "Du lernst, die Aussagen und Zusammenhänge eines Textes ohne Vorlage wiederzugeben. Das hilft bei Sachtexten, Vorträgen und Prüfungsvorbereitung.",
        "start": 2.6199999999999997,
        "end": 10.78
      },
      {
        "section": "limit",
        "text": "Eine Zusammenfassung enthält nicht jedes Detail. Wenn genaue Zahlen oder Formulierungen wichtig sind, übe sie zusätzlich. Beginne mit einem kurzen Abschnitt; verlängere ihn erst, wenn du ihn erklären kannst.",
        "start": 11.08,
        "end": 23.35333333333333
      },
      {
        "section": "step-0",
        "text": "Lies einen Abschnitt und kläre unbekannte Begriffe.",
        "start": 23.653333333333332,
        "end": 27.57333333333333
      },
      {
        "section": "step-1",
        "text": "Teile ihn nach Gedanken auf. Gib jedem Gedanken eine kurze Überschrift.",
        "start": 27.87333333333333,
        "end": 32.67333333333333
      },
      {
        "section": "step-2",
        "text": "Formuliere eine Frage pro Abschnitt: Was passiert? Warum? Welche Folge hat es?",
        "start": 32.97333333333333,
        "end": 39.29333333333333
      },
      {
        "section": "step-3",
        "text": "Decke die Vorlage ab und beantworte die Fragen in eigenen Worten.",
        "start": 39.59333333333333,
        "end": 43.91333333333333
      },
      {
        "section": "step-4",
        "text": "Vergleiche mit dem Original: Welche Aussage fehlt, welche Verbindung ist falsch? Korrigiere gezielt.",
        "start": 44.213333333333324,
        "end": 50.773333333333326
      },
      {
        "section": "step-5",
        "text": "Rufe den Inhalt später erneut ab. Passe den Abstand daran an, wie sicher der Abruf gelingt.",
        "start": 51.07333333333332,
        "end": 56.43333333333332
      },
      {
        "section": "example",
        "text": "Eine Stadt pflanzt Bäume an einer viel befahrenen Straße. Ihre Kronen spenden Schatten. Wasser verdunstet über die Blätter und trägt zur Kühlung bei. Damit die Bäume bei Trockenheit gesund bleiben, brauchen sie ausreichend Wasser und Platz für ihre Wurzeln.",
        "start": 56.73333333333332,
        "end": 72.09337499999998
      },
      {
        "section": "explanation",
        "text": "Drei Sinnabschnitte: Maßnahme (Bäume pflanzen), Wirkung (Schatten und Verdunstung), Voraussetzung (Wasser und Wurzelraum). Die Gliederung hält den Zusammenhang fest.",
        "start": 72.39337499999998,
        "end": 83.75337499999998
      },
      {
        "section": "recall",
        "text": "Erkläre ohne Vorlage: Welche Maßnahme wird beschrieben, wie wirkt sie und was braucht sie?",
        "start": 84.05337499999997,
        "end": 91.25337499999998
      },
      {
        "section": "transfer",
        "text": "Nimm einen eigenen kurzen Sachtext. Erstelle drei Leitfragen, lege den Text weg und beantworte sie. Steigere später die Länge, nicht nur die Anzahl der Wiederholungen.",
        "start": 91.55337499999997,
        "end": 102.43337499999997
      }
    ],
    "src": "/course-media/library/lin-text-meaning-de-265be4f1312c.m4a",
    "bytes": 1204337,
    "sha256": "265be4f1312cbc18ffc30255e7383c61fe8eb78b03dc7ec839c61275e7511af1"
  },
  {
    "course": "text-verbatim",
    "coach": "lin",
    "language": "de",
    "duration": 87.82004166666664,
    "cues": [
      {
        "section": "title",
        "text": "Texte wortgetreu lernen",
        "start": 0.0,
        "end": 2.0
      },
      {
        "section": "purpose",
        "text": "Du übst den genauen Wortlaut, etwa für ein Gedicht, eine Definition oder einen kurzen Vortrag. Dabei zählen auch kleine Wörter und die Reihenfolge.",
        "start": 2.3,
        "end": 10.46
      },
      {
        "section": "limit",
        "text": "Wortgetreuer Abruf beweist nicht, dass du den Inhalt verstanden hast. Kläre zuerst die Bedeutung. Ein Merkbilder-Weg kann die Reihenfolge stützen, ersetzt aber nicht das Üben des Wortlauts.",
        "start": 10.760000000000002,
        "end": 22.28
      },
      {
        "section": "step-0",
        "text": "Verstehe den Text und wähle eine kurze Sinneinheit.",
        "start": 22.580000000000002,
        "end": 26.26
      },
      {
        "section": "step-1",
        "text": "Lies sie aufmerksam und sprich sie einmal deutlich.",
        "start": 26.560000000000002,
        "end": 30.000000000000004
      },
      {
        "section": "step-2",
        "text": "Verdecke die Vorlage und sage oder schreibe sie aus dem Gedächtnis.",
        "start": 30.300000000000004,
        "end": 34.7
      },
      {
        "section": "step-3",
        "text": "Vergleiche Wort für Wort. Korrigiere Auslassungen, Vertauschungen und hinzugefügte Wörter.",
        "start": 35.0,
        "end": 41.08
      },
      {
        "section": "step-4",
        "text": "Übe die nächste Einheit und danach den Übergang zwischen beiden. Beginne gelegentlich in der Mitte.",
        "start": 41.379999999999995,
        "end": 47.459999999999994
      },
      {
        "section": "step-5",
        "text": "Wiederhole später ohne Vorlage. Verlängere den Abschnitt erst, wenn der aktuelle sicher gelingt.",
        "start": 47.75999999999999,
        "end": 54.64004166666666
      },
      {
        "section": "example",
        "text": "Am Morgen öffne ich das Fenster. Frische Luft strömt ins Zimmer. Danach beginne ich meinen Tag.",
        "start": 54.94004166666666,
        "end": 61.34004166666666
      },
      {
        "section": "explanation",
        "text": "Drei kurze Sätze bilden drei Übungseinheiten. Übe zuerst Satz eins, dann Satz zwei und schließlich ihren Übergang. Starte einen späteren Versuch auch mit „Frische Luft …“.",
        "start": 61.640041666666654,
        "end": 72.92004166666665
      },
      {
        "section": "recall",
        "text": "Schreibe die drei Sätze möglichst genau aus dem Gedächtnis.",
        "start": 73.22004166666665,
        "end": 76.82004166666664
      },
      {
        "section": "transfer",
        "text": "Nutze eine eigene kurze Passage, die du wortgetreu brauchst. Prüfe den Wortlaut selbst am Original; eine bloß ähnliche Formulierung erfüllt dieses Lernziel nicht.",
        "start": 77.12004166666664,
        "end": 87.52004166666664
      }
    ],
    "src": "/course-media/library/lin-text-verbatim-de-a3c20bd63dd7.m4a",
    "bytes": 1039815,
    "sha256": "a3c20bd63dd70b220ce0a3d87e1b9319851da0a5633f1860309abd0a8df98eb2"
  }
]
export function courseNarration(course:CourseId,language:SpokenLanguage,coach:CoachId|null){
 return courseNarrations.find(pack=>pack.course===course&&pack.language===language&&pack.coach===coach)
}
