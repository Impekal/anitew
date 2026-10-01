import type { CourseId } from '../core/courses/progress.ts'
import type { CoachId } from '../core/courses/coaches.ts'
import type { SpokenLanguage } from '../core/courses/media.ts'
import type { DownloadAsset } from '../app/courseDownloads.ts'
export interface CourseNarration extends DownloadAsset {
 synthesis?:'qwen-own-name'|'qwen-openvoice'|'kyutai-openvoice';
 course:CourseId;coach:CoachId;language:SpokenLanguage;duration:number;
 cues:ReadonlyArray<{start:number;end:number;text:string;spokenText?:string;section?:string}>
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
  },
  {
    "course": "story-method",
    "coach": "rafael",
    "language": "en",
    "duration": 90.95004166666665,
    "cues": [
      {
        "start": 0.0,
        "end": 1.96,
        "text": "Welcome to ANITEW."
      },
      {
        "start": 2.51,
        "end": 5.31,
        "text": "I am an AI-generated learning coach."
      },
      {
        "start": 5.659999999999999,
        "end": 8.139999999999999,
        "text": "Today we will explore the story method."
      },
      {
        "start": 8.489999999999998,
        "end": 14.889999999999999,
        "text": "The story method is a memory technique: you connect separate pieces of information in a single story."
      },
      {
        "start": 15.239999999999998,
        "end": 20.599999999999998,
        "text": "It can help you remember a sequence, such as a shopping list or the main points of a talk."
      },
      {
        "start": 20.95,
        "end": 23.91,
        "text": "It does not replace understanding the material."
      },
      {
        "start": 24.26,
        "end": 30.18,
        "text": "In this course, you will first learn the idea, see an example, and then try the method yourself."
      },
      {
        "start": 30.53,
        "end": 34.21004166666667,
        "text": "Your goal is to recall three words in the correct order."
      },
      {
        "start": 34.56004166666667,
        "end": 38.56004166666667,
        "text": "Our example is: key, lemon, bicycle."
      },
      {
        "start": 38.91004166666667,
        "end": 42.51004166666667,
        "text": "First, imagine a giant key squeezing a lemon."
      },
      {
        "start": 42.860041666666675,
        "end": 47.180041666666675,
        "text": "The lemon juice splashes onto a bicycle and makes its wheels turn."
      },
      {
        "start": 47.530041666666676,
        "end": 53.13004166666668,
        "text": "One action connects the first word to the second, and another connects the second to the third."
      },
      {
        "start": 53.48004166666668,
        "end": 56.60004166666668,
        "text": "The unusual story is simply a memory aid."
      },
      {
        "start": 56.95004166666668,
        "end": 60.47004166666668,
        "text": "What matters is imagining the actions clearly for yourself."
      },
      {
        "start": 60.82004166666668,
        "end": 62.98004166666668,
        "text": "Now the pictures will disappear."
      },
      {
        "start": 63.33004166666668,
        "end": 66.93004166666668,
        "text": "Pause here and name the three words in the correct order."
      },
      {
        "start": 67.28004166666668,
        "end": 70.00004166666668,
        "text": "When you are ready, reveal the answer."
      },
      {
        "start": 70.35004166666667,
        "end": 74.19004166666667,
        "text": "The words were: key, lemon, bicycle."
      },
      {
        "start": 74.54004166666667,
        "end": 79.02004166666667,
        "text": "If you missed a word, look at its connection again and have another try."
      },
      {
        "start": 79.37004166666667,
        "end": 85.53004166666666,
        "text": "Finally, make up your own story with three different words and recall them without looking."
      },
      {
        "start": 85.88004166666666,
        "end": 90.60004166666666,
        "text": "You can also read the entire course and do every exercise at your own pace."
      }
    ],
    "src": "/course-media/library/atta-story-en-09771673ca2a.m4a",
    "bytes": 1032953,
    "sha256": "09771673ca2ab4eafc6d424170f8a9c1e8c8972ab4b7fa3f7b84d5557d53d69b",
    "synthesis": "qwen-own-name"
  },
  {
    "course": "story-method",
    "coach": "original",
    "language": "en",
    "duration": 90.83746031746028,
    "cues": [
      {
        "start": 0.0,
        "end": 1.96,
        "text": "Welcome to ANITEW."
      },
      {
        "start": 2.5100226757369613,
        "end": 5.308027210884354,
        "text": "I am an AI-generated learning coach."
      },
      {
        "start": 5.658004535147392,
        "end": 8.130929705215419,
        "text": "Today we will explore the story method."
      },
      {
        "start": 8.480907029478457,
        "end": 14.87800453514739,
        "text": "The story method is a memory technique: you connect separate pieces of information in a single story."
      },
      {
        "start": 15.227981859410429,
        "end": 20.58018140589569,
        "text": "It can help you remember a sequence, such as a shopping list or the main points of a talk."
      },
      {
        "start": 20.930158730158727,
        "end": 23.87909297052154,
        "text": "It does not replace understanding the material."
      },
      {
        "start": 24.229070294784577,
        "end": 30.138548752834463,
        "text": "In this course, you will first learn the idea, see an example, and then try the method yourself."
      },
      {
        "start": 30.4885260770975,
        "end": 34.15727891156462,
        "text": "Your goal is to recall three words in the correct order."
      },
      {
        "start": 34.507256235827654,
        "end": 38.50108843537414,
        "text": "Our example is: key, lemon, bicycle."
      },
      {
        "start": 38.85106575963718,
        "end": 42.45015873015872,
        "text": "First, imagine a giant key squeezing a lemon."
      },
      {
        "start": 42.800136054421756,
        "end": 47.119047619047606,
        "text": "The lemon juice splashes onto a bicycle and makes its wheels turn."
      },
      {
        "start": 47.46902494331064,
        "end": 53.06503401360543,
        "text": "One action connects the first word to the second, and another connects the second to the third."
      },
      {
        "start": 53.415011337868464,
        "end": 56.526485260770954,
        "text": "The unusual story is simply a memory aid."
      },
      {
        "start": 56.87646258503399,
        "end": 60.394285714285694,
        "text": "What matters is imagining the actions clearly for yourself."
      },
      {
        "start": 60.74426303854873,
        "end": 62.903718820861656,
        "text": "Now the pictures will disappear."
      },
      {
        "start": 63.25369614512469,
        "end": 66.85278911564623,
        "text": "Pause here and name the three words in the correct order."
      },
      {
        "start": 67.20276643990927,
        "end": 69.91950113378682,
        "text": "When you are ready, reveal the answer."
      },
      {
        "start": 70.26947845804986,
        "end": 74.10077097505666,
        "text": "The words were: key, lemon, bicycle."
      },
      {
        "start": 74.4507482993197,
        "end": 78.92058956916097,
        "text": "If you missed a word, look at its connection again and have another try."
      },
      {
        "start": 79.270566893424,
        "end": 85.42385487528341,
        "text": "Finally, make up your own story with three different words and recall them without looking."
      },
      {
        "start": 85.77383219954645,
        "end": 90.48748299319725,
        "text": "You can also read the entire course and do every exercise at your own pace."
      }
    ],
    "src": "/course-media/library/noah-story-en-557998b9fa71.m4a",
    "bytes": 1026059,
    "sha256": "557998b9fa7176b694cad727b3890d8d6717bcd59f3e26508842c9e872af071f",
    "synthesis": "qwen-openvoice"
  },
  {
    "course": "story-method",
    "coach": "rafael",
    "language": "fr",
    "duration": 82.93714285714283,
    "cues": [
      {
        "start": 0.0,
        "end": 1.8499773242630386,
        "text": "Bienvenue sur ANITEW."
      },
      {
        "start": 2.4,
        "end": 5.465034013605442,
        "text": "Je suis un coach pédagogique créé par intelligence artificielle."
      },
      {
        "start": 5.815011337868481,
        "end": 9.089024943310658,
        "text": "Aujourd'hui, nous allons découvrir la méthode des histoires."
      },
      {
        "start": 9.439002267573697,
        "end": 14.930521541950114,
        "text": "La méthode des histoires est une technique de mémorisation : elle relie plusieurs informations dans une même histoire."
      },
      {
        "start": 15.280498866213152,
        "end": 22.15360544217687,
        "text": "Elle peut aider à retenir un ordre, par exemple une liste de courses ou les points principaux d'un exposé."
      },
      {
        "start": 22.50358276643991,
        "end": 24.930068027210883,
        "text": "Elle ne remplace pas la compréhension du contenu."
      },
      {
        "start": 25.28004535147392,
        "end": 31.770022675736957,
        "text": "Dans ce cours, tu découvriras le principe, tu verras un exemple, puis tu essaieras la méthode toi-même."
      },
      {
        "start": 32.12,
        "end": 34.75546485260771,
        "text": "Ton objectif : retrouver trois mots dans le bon ordre."
      },
      {
        "start": 35.105442176870746,
        "end": 38.30979591836734,
        "text": "Voici notre exemple : clé, citron, vélo."
      },
      {
        "start": 38.65977324263038,
        "end": 42.514285714285705,
        "text": "Imagine d'abord une clé géante qui presse un citron."
      },
      {
        "start": 42.86426303854874,
        "end": 46.498185941043076,
        "text": "Le jus de citron éclabousse un vélo et fait tourner ses roues."
      },
      {
        "start": 46.84816326530611,
        "end": 51.77079365079364,
        "text": "Une action relie le premier mot au deuxième, puis une autre relie le deuxième au troisième."
      },
      {
        "start": 52.12077097505668,
        "end": 54.825895691609965,
        "text": "Cette histoire inhabituelle sert simplement d'aide-mémoire."
      },
      {
        "start": 55.175873015873,
        "end": 58.17124716553287,
        "text": "L'essentiel est de te représenter clairement les actions."
      },
      {
        "start": 58.521224489795905,
        "end": 60.51814058956915,
        "text": "Les images vont maintenant disparaître."
      },
      {
        "start": 60.86811791383219,
        "end": 63.5035827664399,
        "text": "Fais une pause et retrouve les trois mots dans le bon ordre."
      },
      {
        "start": 63.853560090702935,
        "end": 66.2219954648526,
        "text": "Quand tu es prêt, affiche la réponse."
      },
      {
        "start": 66.57197278911563,
        "end": 69.27709750566892,
        "text": "Les mots étaient : clé, citron, vélo."
      },
      {
        "start": 69.62707482993196,
        "end": 73.62090702947845,
        "text": "Si tu as oublié un mot, revois le lien correspondant et essaie à nouveau."
      },
      {
        "start": 73.97088435374148,
        "end": 79.10249433106574,
        "text": "Pour terminer, invente une histoire avec trois autres mots, puis retrouve-les sans regarder."
      },
      {
        "start": 79.45247165532878,
        "end": 82.5871655328798,
        "text": "Tu peux aussi lire tout le cours et faire chaque exercice à ton rythme."
      }
    ],
    "src": "/course-media/library/atta-story-fr-2bc2ae1550f1.m4a",
    "bytes": 855535,
    "sha256": "2bc2ae1550f19bb46cfb403f4681ce6387ac53f59495726ff6bdfc348ae84884",
    "synthesis": "kyutai-openvoice"
  },
  {
    "course": "active-recall",
    "coach": "rafael",
    "language": "en",
    "duration": 90.51,
    "cues": [
      {
        "section": "title",
        "text": "Active recall",
        "start": 0.0,
        "end": 1.2
      },
      {
        "section": "purpose",
        "text": "Try to retrieve information without looking at its source. This shows what you can bring to mind and what needs more work. Use it for facts, concepts and relationships.",
        "start": 1.75,
        "end": 12.07
      },
      {
        "section": "limit",
        "text": "Recognising an answer while reading it does not mean you can retrieve it yourself. A failed attempt is not a final verdict: check and understand the correct answer, then try again. Repeated guessing without feedback can reinforce errors.",
        "start": 12.42,
        "end": 26.259999999999998
      },
      {
        "section": "step-0",
        "text": "Choose a small piece of information you understand.",
        "start": 26.61,
        "end": 29.81
      },
      {
        "section": "step-1",
        "text": "Ask a clear question that the material answers.",
        "start": 30.16,
        "end": 33.52
      },
      {
        "section": "step-2",
        "text": "Put the source away and answer before checking.",
        "start": 33.870000000000005,
        "end": 36.67
      },
      {
        "section": "step-3",
        "text": "Compare with the original. Correct missing or mistaken parts.",
        "start": 37.02,
        "end": 41.42
      },
      {
        "section": "step-4",
        "text": "Hide the answer and try retrieving it again.",
        "start": 41.77,
        "end": 44.49
      },
      {
        "section": "step-5",
        "text": "Test yourself later as well. Immediate repetition may feel easy without showing lasting retention.",
        "start": 44.84,
        "end": 50.92
      },
      {
        "section": "example",
        "text": "Question: Why can evaporating water cool a surface?\nAnswer: Evaporation requires energy. That energy is taken from the surface and its surroundings as heat.",
        "start": 51.27,
        "end": 62.150000000000006
      },
      {
        "section": "explanation",
        "text": "Read and understand the answer first. Then hide it and answer the question yourself. “Water cools” alone does not explain the relationship: the energy requirement and heat transfer matter.",
        "start": 62.50000000000001,
        "end": 73.14000000000001
      },
      {
        "section": "recall",
        "text": "Why can evaporating water cool a surface? Explain without looking.",
        "start": 73.49000000000001,
        "end": 77.97000000000001
      },
      {
        "section": "transfer",
        "text": "Write a specific question about your own material. Answer without looking, compare afterwards, then try again later. ANITEW also uses retrieval attempts in its training sessions.",
        "start": 78.32000000000001,
        "end": 90.16000000000001
      }
    ],
    "src": "/course-media/library/atta-active-recall-en-40e068d14139.m4a",
    "bytes": 1081144,
    "sha256": "40e068d14139a166b72699303ebdf446598b5c264f980ad963f070323015e616",
    "synthesis": "qwen-own-name"
  },
  {
    "course": "interleaved-practice",
    "coach": "rafael",
    "language": "en",
    "duration": 94.96008333333332,
    "cues": [
      {
        "section": "title",
        "text": "Choose between related approaches",
        "start": 0.0,
        "end": 2.16
      },
      {
        "section": "purpose",
        "text": "Mix related types of tasks and choose the appropriate approach yourself. This practises selecting a method as well as applying it.",
        "start": 2.71,
        "end": 9.990041666666666
      },
      {
        "section": "limit",
        "text": "First learn new approaches through clear examples. Random topic switching or multitasking is different. Benefits depend on the material and your prior knowledge.",
        "start": 10.340041666666666,
        "end": 19.700041666666664
      },
      {
        "section": "step-0",
        "text": "Understand each approach separately first.",
        "start": 20.050041666666665,
        "end": 22.690041666666666
      },
      {
        "section": "step-1",
        "text": "Then mix a few related task types.",
        "start": 23.040041666666667,
        "end": 25.680041666666668
      },
      {
        "section": "step-2",
        "text": "Before answering, identify the type and explain your choice.",
        "start": 26.03004166666667,
        "end": 30.590041666666668
      },
      {
        "section": "step-3",
        "text": "Solve the task and check your choice and result separately.",
        "start": 30.94004166666667,
        "end": 34.62008333333333
      },
      {
        "section": "step-4",
        "text": "Work on errors specifically, then return to mixed practice.",
        "start": 34.970083333333335,
        "end": 39.21008333333334
      },
      {
        "section": "example",
        "text": "Rectangle: area = length × width. Triangle: area = base × corresponding height ÷ 2. A rectangle 4 cm long and 3 cm wide has an area of 12 cm². A triangle with base 4 cm and corresponding height 3 cm has an area of 6 cm².",
        "start": 39.56008333333334,
        "end": 60.60008333333334
      },
      {
        "section": "explanation",
        "text": "Identical numbers do not imply identical calculations. The shape determines the rule: the triangle needs the factor one half. Mixed tasks require recognising the type before applying a rule.",
        "start": 60.95008333333334,
        "end": 72.71008333333334
      },
      {
        "section": "recall",
        "text": "Task A: a triangle with base 6 cm and corresponding height 4 cm. Task B: a rectangle 6 cm long and 4 cm wide. Give the rule and area for each.",
        "start": 73.06008333333334,
        "end": 86.66008333333333
      },
      {
        "section": "transfer",
        "text": "Choose two or three related task types you have already studied. Mix them and explain which approach fits before solving each one.",
        "start": 87.01008333333333,
        "end": 94.61008333333332
      }
    ],
    "src": "/course-media/library/atta-interleaved-practice-en-59cda2e395b3.m4a",
    "bytes": 1166445,
    "sha256": "59cda2e395b39f1c431a1c8895fee2c7db5e91023baa86ce32c54bc444894d41",
    "synthesis": "qwen-own-name"
  },
  {
    "course": "keyword-method",
    "coach": "rafael",
    "language": "en",
    "duration": 84.96,
    "cues": [
      {
        "section": "title",
        "text": "Connect vocabulary through keywords",
        "start": 0.0,
        "end": 2.56
      },
      {
        "section": "purpose",
        "text": "A familiar word with a similar sound can provide a bridge to a foreign word’s meaning. Connect the keyword and the meaning in an image, then check the actual word.",
        "start": 3.1100000000000003,
        "end": 12.469999999999999
      },
      {
        "section": "limit",
        "text": "A similar sound is not the correct pronunciation. Some words offer no useful keyword. Check pronunciation, spelling and use in a sentence separately.",
        "start": 12.819999999999999,
        "end": 22.259999999999998
      },
      {
        "section": "step-0",
        "text": "Check the new word’s meaning and correct pronunciation.",
        "start": 22.61,
        "end": 26.369999999999997
      },
      {
        "section": "step-1",
        "text": "Find a familiar word with a similar sound.",
        "start": 26.72,
        "end": 29.599999999999998
      },
      {
        "section": "step-2",
        "text": "Imagine a clear connection between that keyword and the meaning.",
        "start": 29.95,
        "end": 33.23
      },
      {
        "section": "step-3",
        "text": "Retrieve the meaning from the word, then the word from its meaning.",
        "start": 33.58,
        "end": 37.82
      },
      {
        "section": "step-4",
        "text": "Check the original pronunciation, spelling and an example sentence.",
        "start": 38.17,
        "end": 42.49
      },
      {
        "section": "example",
        "text": "French: pain = bread. Example: Je mange du pain. = I eat bread.",
        "start": 42.84,
        "end": 50.68000000000001
      },
      {
        "section": "explanation",
        "text": "The English word “pan” can be a rough sound cue: imagine bread leaping out of a pan. French pain has a nasal vowel and is not pronounced like English pan or pain. The cue is a memory bridge, not a pronunciation model.",
        "start": 51.03000000000001,
        "end": 66.07000000000001
      },
      {
        "section": "recall",
        "text": "Which French word means bread? Write the word, its meaning and the example sentence from memory.",
        "start": 66.42,
        "end": 72.98
      },
      {
        "section": "transfer",
        "text": "Try a word you actually need. Test the reverse direction too: can you retrieve the foreign form from its meaning? If the keyword confuses you, change the bridge or use direct retrieval.",
        "start": 73.33,
        "end": 84.61
      }
    ],
    "src": "/course-media/library/atta-keyword-method-en-92226bc3950c.m4a",
    "bytes": 1010546,
    "sha256": "92226bc3950ca0125267c80bff903ab30594f89e37792dc9e015eba346adc198",
    "synthesis": "qwen-own-name"
  },
  {
    "course": "long-words",
    "coach": "rafael",
    "language": "en",
    "duration": 82.63,
    "cues": [
      {
        "section": "title",
        "text": "Remember long words",
        "start": 0.0,
        "end": 1.6
      },
      {
        "section": "purpose",
        "text": "Break a long word into meaningful parts, put them together again and practise its meaning, pronunciation and spelling.",
        "start": 2.1500000000000004,
        "end": 9.350000000000001
      },
      {
        "section": "limit",
        "text": "Meaningful parts are not always spoken syllables. Some technical terms are unfamiliar throughout. Check their meaning and pronunciation before practising.",
        "start": 9.700000000000001,
        "end": 19.3
      },
      {
        "section": "step-0",
        "text": "Clarify the meaning of the whole word.",
        "start": 19.650000000000002,
        "end": 22.05
      },
      {
        "section": "step-1",
        "text": "Identify familiar parts and explain what they contribute.",
        "start": 22.400000000000002,
        "end": 26.000000000000004
      },
      {
        "section": "step-2",
        "text": "Notice spelling changes and connecting elements.",
        "start": 26.350000000000005,
        "end": 29.550000000000004
      },
      {
        "section": "step-3",
        "text": "Say the parts slowly, then say the whole word fluently. Syllable boundaries may differ from meaning boundaries.",
        "start": 29.900000000000006,
        "end": 37.50000000000001
      },
      {
        "section": "step-4",
        "text": "Hide the example, write the whole word and explain it.",
        "start": 37.85000000000001,
        "end": 41.61000000000001
      },
      {
        "section": "step-5",
        "text": "Check spelling and meaning. Practise uncertain parts, then put the whole word together again.",
        "start": 41.96000000000001,
        "end": 48.28000000000001
      },
      {
        "section": "example",
        "text": "unpredictability",
        "start": 48.63000000000001,
        "end": 50.23000000000001
      },
      {
        "section": "explanation",
        "text": "un | predict | ability: the quality of being difficult or impossible to predict. The final e of “predictable” does not remain in “unpredictability”. These are useful meaning units, not a pronunciation guide.",
        "start": 50.58000000000001,
        "end": 65.74000000000001
      },
      {
        "section": "recall",
        "text": "Write the complete word from memory. Then explain its meaning aloud and say it fluently.",
        "start": 66.09,
        "end": 71.93
      },
      {
        "section": "transfer",
        "text": "Choose a long word relevant to your life. Find meaningful parts, then practise the whole word. Use the word formation and pronunciation rules of its language.",
        "start": 72.28,
        "end": 82.28
      }
    ],
    "src": "/course-media/library/atta-long-words-en-9da6ab5e71fe.m4a",
    "bytes": 960557,
    "sha256": "9da6ab5e71fe9233ec57eb54e6627a4958c1aed81229afce5388a3bb67905f1b",
    "synthesis": "qwen-own-name"
  },
  {
    "course": "meaningful-groups",
    "coach": "rafael",
    "language": "en",
    "duration": 93.86999999999999,
    "cues": [
      {
        "section": "title",
        "text": "Build meaningful groups",
        "start": 0.0,
        "end": 1.6
      },
      {
        "section": "purpose",
        "text": "Organise individual pieces of information into meaningful groups. A useful structure can help you see the material clearly and search for it systematically during recall.",
        "start": 2.1500000000000004,
        "end": 11.67
      },
      {
        "section": "limit",
        "text": "Grouping alone does not guarantee complete recall. The groups must make sense to you; a heading does not explain unfamiliar technical terms. If the original order matters, practise that separately.",
        "start": 12.02,
        "end": 23.619999999999997
      },
      {
        "section": "step-0",
        "text": "Clarify your goal: the content, its order, or both.",
        "start": 23.97,
        "end": 28.45
      },
      {
        "section": "step-1",
        "text": "Look for shared features or relationships.",
        "start": 28.8,
        "end": 31.6
      },
      {
        "section": "step-2",
        "text": "Create a few manageable groups with informative headings.",
        "start": 31.950000000000003,
        "end": 35.230000000000004
      },
      {
        "section": "step-3",
        "text": "Explain why each item belongs in its group.",
        "start": 35.580000000000005,
        "end": 38.540000000000006
      },
      {
        "section": "step-4",
        "text": "Hide the source. Recall the groups first, then their contents.",
        "start": 38.89000000000001,
        "end": 43.290000000000006
      },
      {
        "section": "step-5",
        "text": "Compare with the original, correct missing items and try again later.",
        "start": 43.64000000000001,
        "end": 48.52000000000001
      },
      {
        "section": "example",
        "text": "Apple · hammer · shirt · pear · saw · jacket · banana · pliers · trousers",
        "start": 48.87000000000001,
        "end": 56.71000000000001
      },
      {
        "section": "explanation",
        "text": "One possible structure: fruit (apple, pear, banana), tools (hammer, saw, pliers), clothing (shirt, jacket, trousers). The headings provide search cues. This exercise asks you to remember all nine items; their original order is not the learning goal.",
        "start": 57.06000000000001,
        "end": 75.46000000000001
      },
      {
        "section": "recall",
        "text": "Recall the three groups and as many of the nine items as possible without looking. The order within a group is up to you.",
        "start": 75.81,
        "end": 82.69
      },
      {
        "section": "transfer",
        "text": "Organise your own passage by ideas or a list by meaningful categories. Do not invent groups just to reach a particular number. Check the full content as well as the headings.",
        "start": 83.03999999999999,
        "end": 93.52
      }
    ],
    "src": "/course-media/library/atta-meaningful-groups-en-7297b86ca75a.m4a",
    "bytes": 1127582,
    "sha256": "7297b86ca75aa49eab1d867b315614cbc5cc9176679a043111b3fe596fbe99ff",
    "synthesis": "qwen-own-name"
  },
  {
    "course": "method-of-loci",
    "coach": "rafael",
    "language": "en",
    "duration": 79.92,
    "cues": [
      {
        "section": "title",
        "text": "Use places as memory cues",
        "start": 0.0,
        "end": 2.16
      },
      {
        "section": "purpose",
        "text": "In the method of loci, you place imagined content at fixed locations along a familiar route. Walking the route in your mind provides cues for retrieving it.",
        "start": 2.71,
        "end": 12.149999999999999
      },
      {
        "section": "limit",
        "text": "Learn a stable route first. Similar images at the same location can be confused. Locations support structure and order, not automatically exact wording.",
        "start": 12.499999999999998,
        "end": 21.939999999999998
      },
      {
        "section": "step-0",
        "text": "Choose a familiar route with clearly distinct locations.",
        "start": 22.29,
        "end": 25.57
      },
      {
        "section": "step-1",
        "text": "Fix their order and rehearse the route without learning material.",
        "start": 25.92,
        "end": 29.520000000000003
      },
      {
        "section": "step-2",
        "text": "Connect one item to each location through a vivid imagined event.",
        "start": 29.870000000000005,
        "end": 34.35000000000001
      },
      {
        "section": "step-3",
        "text": "Walk the route without looking and name the items.",
        "start": 34.70000000000001,
        "end": 37.66000000000001
      },
      {
        "section": "step-4",
        "text": "Compare your recall and improve confusing locations or weak images.",
        "start": 38.01000000000001,
        "end": 42.250000000000014
      },
      {
        "section": "example",
        "text": "Example route: front door → shoe rack → kitchen table. Items: bread → soap → candle.",
        "start": 42.600000000000016,
        "end": 50.600000000000016
      },
      {
        "section": "explanation",
        "text": "A giant loaf blocks the front door. The shoe rack overflows with soap foam. A candle glows on the kitchen table. This is only an example route; use a genuinely familiar route for your own learning.",
        "start": 50.95000000000002,
        "end": 63.83000000000002
      },
      {
        "section": "recall",
        "text": "Mentally visit the three locations. Write the item associated with each location.",
        "start": 64.18000000000002,
        "end": 69.70000000000002
      },
      {
        "section": "transfer",
        "text": "Use the app’s existing memory palace to create a familiar route or use an available one. Start with a few locations and check that you can clearly distinguish them.",
        "start": 70.05000000000001,
        "end": 79.57000000000001
      }
    ],
    "src": "/course-media/library/atta-method-of-loci-en-ffb92e2c77c5.m4a",
    "bytes": 957790,
    "sha256": "ffb92e2c77c5fa30f5579452e92d08934f5b15e537103532559eb6815165750f",
    "synthesis": "qwen-own-name"
  },
  {
    "course": "number-images",
    "coach": "rafael",
    "language": "en",
    "duration": 78.07999999999998,
    "cues": [
      {
        "section": "title",
        "text": "Turn numbers into images",
        "start": 0.0,
        "end": 2.0
      },
      {
        "section": "purpose",
        "text": "The Major System assigns consonant sounds to digits. Use them to form a word and imagine an image that can be decoded back into the number.",
        "start": 2.55,
        "end": 10.55
      },
      {
        "section": "limit",
        "text": "Learn the mappings first. An image that cannot be decoded reliably does not help exact number recall. This introduction uses two digits; the existing Major lessons teach further mappings.",
        "start": 10.9,
        "end": 22.740000000000002
      },
      {
        "section": "step-0",
        "text": "Learn a few fixed digit-to-sound pairs first.",
        "start": 23.090000000000003,
        "end": 25.970000000000002
      },
      {
        "section": "step-1",
        "text": "Read the sounds in the order of the digits.",
        "start": 26.320000000000004,
        "end": 28.880000000000003
      },
      {
        "section": "step-2",
        "text": "Add vowels to form a concrete word.",
        "start": 29.230000000000004,
        "end": 31.710000000000004
      },
      {
        "section": "step-3",
        "text": "Check whether the word contains additional consonant sounds that would encode extra digits.",
        "start": 32.06,
        "end": 37.34
      },
      {
        "section": "step-4",
        "text": "Retrieve the word from the image and decode its sounds back into the number.",
        "start": 37.690000000000005,
        "end": 41.690000000000005
      },
      {
        "section": "example",
        "text": "1 → t/d; 2 → n. The number 12 can become an image of a tin: t + n.",
        "start": 42.040000000000006,
        "end": 49.800000000000004
      },
      {
        "section": "explanation",
        "text": "The vowel does not count here. In the reverse direction, t gives 1 and n gives 2, recovering 12. The sound pattern matters, not merely the written letters.",
        "start": 50.150000000000006,
        "end": 61.67
      },
      {
        "section": "recall",
        "text": "Which number does the image of a tin encode? Explain the reverse path through the two consonant sounds.",
        "start": 62.02,
        "end": 67.78
      },
      {
        "section": "transfer",
        "text": "Practise further fixed mappings in the existing Major lessons before tackling longer numbers. Check that every image you create decodes to the exact intended number.",
        "start": 68.13,
        "end": 77.72999999999999
      }
    ],
    "src": "/course-media/library/atta-number-images-en-8dab2d766116.m4a",
    "bytes": 946815,
    "sha256": "8dab2d766116b8a8ee3266fe5d3a8064008127d6cc3568457853fc893b2bec1a",
    "synthesis": "qwen-own-name"
  },
  {
    "course": "self-explanation",
    "coach": "rafael",
    "language": "en",
    "duration": 96.67004166666666,
    "cues": [
      {
        "section": "title",
        "text": "Explain relationships yourself",
        "start": 0.0,
        "end": 1.84
      },
      {
        "section": "purpose",
        "text": "Explain in your own words why a step makes sense or how two statements relate. This can reveal gaps in understanding that are easy to miss while reading.",
        "start": 2.39,
        "end": 11.270000000000001
      },
      {
        "section": "limit",
        "text": "A fluent explanation can still be wrong. Check it against a reliable source and acknowledge uncertainty. This method supports practice; it does not replace subject knowledge or checking your explanation.",
        "start": 11.620000000000001,
        "end": 22.740000000000002
      },
      {
        "section": "step-0",
        "text": "Choose a manageable relationship you want to understand.",
        "start": 23.090000000000003,
        "end": 26.130000000000003
      },
      {
        "section": "step-1",
        "text": "Ask why the step follows, what stays the same and what would change under different conditions.",
        "start": 26.480000000000004,
        "end": 32.0
      },
      {
        "section": "step-2",
        "text": "Formulate an explanation without copying the source.",
        "start": 32.35,
        "end": 35.63
      },
      {
        "section": "step-3",
        "text": "Compare it with the original reasoning. Separate established facts from guesses.",
        "start": 35.980000000000004,
        "end": 41.18000000000001
      },
      {
        "section": "step-4",
        "text": "Correct gaps and apply your explanation to a similar example.",
        "start": 41.53000000000001,
        "end": 45.69000000000001
      },
      {
        "section": "step-5",
        "text": "Explain the relationship again later without looking.",
        "start": 46.04000000000001,
        "end": 49.320000000000014
      },
      {
        "section": "example",
        "text": "Three quarters equals six eighths: 3/4 = 6/8. Halving each of four equal parts creates eight equal parts. The three selected quarters now consist of six eighths. The selected amount stays the same.",
        "start": 49.670000000000016,
        "end": 62.79000000000001
      },
      {
        "section": "explanation",
        "text": "“Multiply the top and bottom by two” describes a rule. Halving the equal parts explains why the value does not change. To transfer the idea, consider why 2/3 and 4/6 describe the same proportion.",
        "start": 63.140000000000015,
        "end": 75.86000000000001
      },
      {
        "section": "recall",
        "text": "Explain without looking why 3/4 and 6/8 are equal. Then apply your reasoning to 2/3 and 4/6.",
        "start": 76.21000000000001,
        "end": 82.93004166666668
      },
      {
        "section": "transfer",
        "text": "Choose a step in your learning material and explain why it holds. Find a similar example and check your explanation with it. If you cannot verify the reasoning reliably, record the open question instead of pretending to be certain.",
        "start": 83.28004166666668,
        "end": 96.32004166666667
      }
    ],
    "src": "/course-media/library/atta-self-explanation-en-7394e28b3ecb.m4a",
    "bytes": 1183825,
    "sha256": "7394e28b3ecb26ce6163c892e6ad996701e254f19cc97f066458d51105dbea3f",
    "synthesis": "qwen-own-name"
  },
  {
    "course": "spaced-practice",
    "coach": "rafael",
    "language": "en",
    "duration": 106.58999999999999,
    "cues": [
      {
        "section": "title",
        "text": "Spaced practice",
        "start": 0.0,
        "end": 1.52
      },
      {
        "section": "purpose",
        "text": "Spread retrieval attempts over time. This tests retention after a delay rather than simply repeating an answer immediately after reading it.",
        "start": 2.0700000000000003,
        "end": 10.63
      },
      {
        "section": "limit",
        "text": "No single interval suits every person and topic. Difficulty, prior knowledge and the desired retention period matter. This short exercise explains the approach; lasting retention can only be checked with later attempts.",
        "start": 10.98,
        "end": 24.5
      },
      {
        "section": "step-0",
        "text": "Learn a manageable piece of information and retrieve it once without looking.",
        "start": 24.85,
        "end": 29.810000000000002
      },
      {
        "section": "step-1",
        "text": "Plan another retrieval attempt after a delay.",
        "start": 30.160000000000004,
        "end": 33.36000000000001
      },
      {
        "section": "step-2",
        "text": "Try answering before you reveal the solution.",
        "start": 33.71000000000001,
        "end": 36.510000000000005
      },
      {
        "section": "step-3",
        "text": "After an error, clarify the meaning, correct it and retrieve again. Shorten the next interval if retrieval was too difficult.",
        "start": 36.86000000000001,
        "end": 45.82000000000001
      },
      {
        "section": "step-4",
        "text": "As retrieval becomes reliable, the next interval can increase.",
        "start": 46.17000000000001,
        "end": 50.650000000000006
      },
      {
        "section": "step-5",
        "text": "ANITEW already schedules reviews for stored training items. Follow the due reviews instead of keeping a competing schedule.",
        "start": 51.00000000000001,
        "end": 57.800000000000004
      },
      {
        "section": "example",
        "text": "Mira learns a new concept and explains it without looking. After a break she tries again and finds a gap. She compares with the correct explanation, fixes the gap and schedules the next attempt sooner. Only after reliable retrieval does she increase the interval.",
        "start": 58.150000000000006,
        "end": 73.27000000000001
      },
      {
        "section": "explanation",
        "text": "The delay and the retrieval attempt matter. Reading ten times in a row cannot replace a later retrieval attempt. The error tells Mira what to revisit and helps her adjust the interval.",
        "start": 73.62,
        "end": 84.02000000000001
      },
      {
        "section": "recall",
        "text": "Describe Mira’s approach: what does she do before checking? How does she respond to the gap? When can she increase the interval?",
        "start": 84.37,
        "end": 93.17
      },
      {
        "section": "transfer",
        "text": "Use the due reviews for your stored training items. For material outside the app, plan a later self-test and adjust the interval to actual retrieval. Completing this reading course does not create new review cards.",
        "start": 93.52,
        "end": 106.24
      }
    ],
    "src": "/course-media/library/atta-spaced-practice-en-9746d25a3ac9.m4a",
    "bytes": 1299417,
    "sha256": "9746d25a3ac917786a4ff0d9b7bd24eb8c7089696de4a9ee3ddd679d509b1ed8",
    "synthesis": "qwen-own-name"
  },
  {
    "course": "text-meaning",
    "coach": "rafael",
    "language": "en",
    "duration": 88.11004166666666,
    "cues": [
      {
        "section": "title",
        "text": "Remember the meaning of long texts",
        "start": 0.0,
        "end": 2.0
      },
      {
        "section": "purpose",
        "text": "Learn to recall the ideas and relationships in a text without looking. Use this for factual reading, presentations and exam preparation.",
        "start": 2.55,
        "end": 11.350000000000001
      },
      {
        "section": "limit",
        "text": "A summary does not preserve every detail. Practise exact numbers or wording separately when needed. Start with a short passage and increase its length after you can explain it.",
        "start": 11.700000000000001,
        "end": 21.86
      },
      {
        "section": "step-0",
        "text": "Read a passage and clarify unfamiliar terms.",
        "start": 22.21,
        "end": 25.490000000000002
      },
      {
        "section": "step-1",
        "text": "Group it by ideas and give each group a short heading.",
        "start": 25.840000000000003,
        "end": 29.360000000000003
      },
      {
        "section": "step-2",
        "text": "Ask a question for each part: what happens, why, and with what result?",
        "start": 29.710000000000004,
        "end": 34.75000000000001
      },
      {
        "section": "step-3",
        "text": "Hide the source and answer in your own words.",
        "start": 35.10000000000001,
        "end": 38.220000000000006
      },
      {
        "section": "step-4",
        "text": "Compare with the original. Correct missing ideas and mistaken connections.",
        "start": 38.57000000000001,
        "end": 43.53000000000001
      },
      {
        "section": "step-5",
        "text": "Recall it again later. Adjust the interval to how reliably you remember.",
        "start": 43.88000000000001,
        "end": 49.16000000000001
      },
      {
        "section": "example",
        "text": "A town plants trees beside a busy road. Their crowns provide shade. Water evaporates through the leaves and contributes to cooling. To remain healthy during dry weather, the trees need enough water and room for their roots.",
        "start": 49.51000000000001,
        "end": 63.110000000000014
      },
      {
        "section": "explanation",
        "text": "Three groups: action (planting trees), effects (shade and evaporation), and requirements (water and root space). The outline preserves their relationship.",
        "start": 63.460000000000015,
        "end": 73.46000000000001
      },
      {
        "section": "recall",
        "text": "Without looking, explain the action, how it works and what it requires.",
        "start": 73.81,
        "end": 78.61004166666667
      },
      {
        "section": "transfer",
        "text": "Choose a short factual text of your own. Write three guiding questions, put the text away and answer them. Gradually increase the length.",
        "start": 78.96004166666667,
        "end": 87.76004166666667
      }
    ],
    "src": "/course-media/library/atta-text-meaning-en-1ac4b24baefd.m4a",
    "bytes": 1057255,
    "sha256": "1ac4b24baefd031bd3b1879037920fa97fa0e4c750ac151eb6bbdef6e8ca5db8",
    "synthesis": "qwen-own-name"
  },
  {
    "course": "text-verbatim",
    "coach": "rafael",
    "language": "en",
    "duration": 76.99004166666667,
    "cues": [
      {
        "section": "title",
        "text": "Learn a text word for word",
        "start": 0.0,
        "end": 2.32
      },
      {
        "section": "purpose",
        "text": "Practise exact wording for a poem, definition or short speech. Small words and their order matter too.",
        "start": 2.87,
        "end": 10.31
      },
      {
        "section": "limit",
        "text": "Exact recall does not prove understanding. Clarify the meaning first. Mental images may support the order of ideas but cannot replace practice of the actual wording.",
        "start": 10.66,
        "end": 21.22
      },
      {
        "section": "step-0",
        "text": "Understand the text and choose a short meaningful passage.",
        "start": 21.57,
        "end": 24.77
      },
      {
        "section": "step-1",
        "text": "Read it carefully and say it clearly once.",
        "start": 25.12,
        "end": 28.240000000000002
      },
      {
        "section": "step-2",
        "text": "Hide it and say or write it from memory.",
        "start": 28.590000000000003,
        "end": 31.230000000000004
      },
      {
        "section": "step-3",
        "text": "Compare word for word. Correct omissions, changes in order and added words.",
        "start": 31.580000000000005,
        "end": 37.50000000000001
      },
      {
        "section": "step-4",
        "text": "Practise the next passage, then the transition between them. Sometimes start in the middle.",
        "start": 37.85000000000001,
        "end": 43.21000000000001
      },
      {
        "section": "step-5",
        "text": "Recall it again later without looking. Extend the passage after the current part becomes reliable.",
        "start": 43.56000000000001,
        "end": 49.48000000000001
      },
      {
        "section": "example",
        "text": "In the morning I open the window. Fresh air flows into the room. Then I begin my day.",
        "start": 49.83000000000001,
        "end": 55.750000000000014
      },
      {
        "section": "explanation",
        "text": "The three sentences form three practice units. Learn the first, then the second and their transition. Start a later attempt at “Fresh air …” as well.",
        "start": 56.100000000000016,
        "end": 64.82000000000002
      },
      {
        "section": "recall",
        "text": "Write the three sentences as accurately as you can from memory.",
        "start": 65.17000000000002,
        "end": 68.85004166666668
      },
      {
        "section": "transfer",
        "text": "Choose a short passage whose wording matters to you. Compare it with its source yourself; a paraphrase does not meet this particular goal.",
        "start": 69.20004166666668,
        "end": 76.64004166666668
      }
    ],
    "src": "/course-media/library/atta-text-verbatim-en-c8f7054d2dae.m4a",
    "bytes": 916940,
    "sha256": "c8f7054d2dae91b0bf7b19cdc2aaa38672924b4660dad3fa59b5b2b4b0c12501",
    "synthesis": "qwen-own-name"
  },
  {
    "course": "active-recall",
    "coach": "original",
    "language": "en",
    "duration": 90.43138321995463,
    "cues": [
      {
        "section": "title",
        "text": "Active recall",
        "start": 0.0,
        "end": 1.195827664399093
      },
      {
        "section": "purpose",
        "text": "Try to retrieve information without looking at its source. This shows what you can bring to mind and what needs more work. Use it for facts, concepts and relationships.",
        "start": 1.7458503401360543,
        "end": 12.055510204081632
      },
      {
        "section": "limit",
        "text": "Recognising an answer while reading it does not mean you can retrieve it yourself. A failed attempt is not a final verdict: check and understand the correct answer, then try again. Repeated guessing without feedback can reinforce errors.",
        "start": 12.40548752834467,
        "end": 26.244580498866213
      },
      {
        "section": "step-0",
        "text": "Choose a small piece of information you understand.",
        "start": 26.59455782312925,
        "end": 29.787301587301585
      },
      {
        "section": "step-1",
        "text": "Ask a clear question that the material answers.",
        "start": 30.13727891156462,
        "end": 33.492562358276636
      },
      {
        "section": "step-2",
        "text": "Put the source away and answer before checking.",
        "start": 33.84253968253967,
        "end": 36.640544217687065
      },
      {
        "section": "step-3",
        "text": "Compare with the original. Correct missing or mistaken parts.",
        "start": 36.9905215419501,
        "end": 41.37909297052153
      },
      {
        "section": "step-4",
        "text": "Hide the answer and try retrieving it again.",
        "start": 41.72907029478457,
        "end": 44.44580498866212
      },
      {
        "section": "step-5",
        "text": "Test yourself later as well. Immediate repetition may feel easy without showing lasting retention.",
        "start": 44.795782312925155,
        "end": 50.867800453514725
      },
      {
        "section": "example",
        "text": "Question: Why can evaporating water cool a surface?\nAnswer: Evaporation requires energy. That energy is taken from the surface and its surroundings as heat.",
        "start": 51.21777777777776,
        "end": 62.09632653061223
      },
      {
        "section": "explanation",
        "text": "Read and understand the answer first. Then hide it and answer the question yourself. “Water cools” alone does not explain the relationship: the energy requirement and heat transfer matter.",
        "start": 62.44630385487527,
        "end": 73.08104308390021
      },
      {
        "section": "recall",
        "text": "Why can evaporating water cool a surface? Explain without looking.",
        "start": 73.43102040816325,
        "end": 77.90086167800452
      },
      {
        "section": "transfer",
        "text": "Write a specific question about your own material. Answer without looking, compare afterwards, then try again later. ANITEW also uses retrieval attempts in its training sessions.",
        "start": 78.25083900226755,
        "end": 90.08140589569159
      }
    ],
    "src": "/course-media/library/noah-active-recall-en-bcde9144226d.m4a",
    "bytes": 1064217,
    "sha256": "bcde9144226ddfb4109dc799101c7104aa37f052f562fa001d04b5636f5569e9",
    "synthesis": "qwen-openvoice"
  },
  {
    "course": "interleaved-practice",
    "coach": "original",
    "language": "en",
    "duration": 94.89954648526076,
    "cues": [
      {
        "section": "title",
        "text": "Choose between related approaches",
        "start": 0.0,
        "end": 2.159455782312925
      },
      {
        "section": "purpose",
        "text": "Mix related types of tasks and choose the appropriate approach yourself. This practises selecting a method as well as applying it.",
        "start": 2.7094784580498863,
        "end": 9.988934240362811
      },
      {
        "section": "limit",
        "text": "First learn new approaches through clear examples. Random topic switching or multitasking is different. Benefits depend on the material and your prior knowledge.",
        "start": 10.33891156462585,
        "end": 19.696553287981857
      },
      {
        "section": "step-0",
        "text": "Understand each approach separately first.",
        "start": 20.046530612244894,
        "end": 22.681995464852605
      },
      {
        "section": "step-1",
        "text": "Then mix a few related task types.",
        "start": 23.031972789115642,
        "end": 25.667437641723353
      },
      {
        "section": "step-2",
        "text": "Before answering, identify the type and explain your choice.",
        "start": 26.01741496598639,
        "end": 30.568526077097502
      },
      {
        "section": "step-3",
        "text": "Solve the task and check your choice and result separately.",
        "start": 30.91850340136054,
        "end": 34.58725623582766
      },
      {
        "section": "step-4",
        "text": "Work on errors specifically, then return to mixed practice.",
        "start": 34.9372335600907,
        "end": 39.1748752834467
      },
      {
        "section": "example",
        "text": "Rectangle: area = length × width. Triangle: area = base × corresponding height ÷ 2. A rectangle 4 cm long and 3 cm wide has an area of 12 cm². A triangle with base 4 cm and corresponding height 3 cm has an area of 6 cm².",
        "start": 39.52485260770974,
        "end": 60.56213151927437
      },
      {
        "section": "explanation",
        "text": "Identical numbers do not imply identical calculations. The shape determines the rule: the triangle needs the factor one half. Mixed tasks require recognising the type before applying a rule.",
        "start": 60.9121088435374,
        "end": 72.6614058956916
      },
      {
        "section": "recall",
        "text": "Task A: a triangle with base 6 cm and corresponding height 4 cm. Task B: a rectangle 6 cm long and 4 cm wide. Give the rule and area for each.",
        "start": 73.01138321995464,
        "end": 86.60666666666665
      },
      {
        "section": "transfer",
        "text": "Choose two or three related task types you have already studied. Mix them and explain which approach fits before solving each one.",
        "start": 86.95664399092969,
        "end": 94.54956916099772
      }
    ],
    "src": "/course-media/library/noah-interleaved-practice-en-c7dabb1ec36c.m4a",
    "bytes": 1152048,
    "sha256": "c7dabb1ec36c0e3280d4e7d0b7797cfbc624b8173e3cc78fd2fe8188f1c287ac",
    "synthesis": "qwen-openvoice"
  },
  {
    "course": "keyword-method",
    "coach": "original",
    "language": "en",
    "duration": 84.91496598639453,
    "cues": [
      {
        "section": "title",
        "text": "Connect vocabulary through keywords",
        "start": 0.0,
        "end": 2.5541950113378684
      },
      {
        "section": "purpose",
        "text": "A familiar word with a similar sound can provide a bridge to a foreign word’s meaning. Connect the keyword and the meaning in an image, then check the actual word.",
        "start": 3.1042176870748297,
        "end": 12.461859410430838
      },
      {
        "section": "limit",
        "text": "A similar sound is not the correct pronunciation. Some words offer no useful keyword. Check pronunciation, spelling and use in a sentence separately.",
        "start": 12.811836734693877,
        "end": 22.250748299319728
      },
      {
        "section": "step-0",
        "text": "Check the new word’s meaning and correct pronunciation.",
        "start": 22.600725623582765,
        "end": 26.350748299319726
      },
      {
        "section": "step-1",
        "text": "Find a familiar word with a similar sound.",
        "start": 26.700725623582763,
        "end": 29.579999999999995
      },
      {
        "section": "step-2",
        "text": "Imagine a clear connection between that keyword and the meaning.",
        "start": 29.92997732426303,
        "end": 33.203990929705206
      },
      {
        "section": "step-3",
        "text": "Retrieve the meaning from the word, then the word from its meaning.",
        "start": 33.55396825396824,
        "end": 37.79160997732425
      },
      {
        "section": "step-4",
        "text": "Check the original pronunciation, spelling and an example sentence.",
        "start": 38.141587301587286,
        "end": 42.460498866213136
      },
      {
        "section": "example",
        "text": "French: pain = bread. Example: Je mange du pain. = I eat bread.",
        "start": 42.81047619047617,
        "end": 50.647210884353726
      },
      {
        "section": "explanation",
        "text": "The English word “pan” can be a rough sound cue: imagine bread leaping out of a pan. French pain has a nasal vowel and is not pronounced like English pan or pain. The cue is a memory bridge, not a pronunciation model.",
        "start": 50.99718820861676,
        "end": 66.0321088435374
      },
      {
        "section": "recall",
        "text": "Which French word means bread? Write the word, its meaning and the example sentence from memory.",
        "start": 66.38208616780044,
        "end": 72.94172335600905
      },
      {
        "section": "transfer",
        "text": "Try a word you actually need. Test the reverse direction too: can you retrieve the foreign form from its meaning? If the keyword confuses you, change the bridge or use direct retrieval.",
        "start": 73.29170068027209,
        "end": 84.5649886621315
      }
    ],
    "src": "/course-media/library/noah-keyword-method-en-db1d76286a1e.m4a",
    "bytes": 985328,
    "sha256": "db1d76286a1eb89723c38fdfe235ec95ae71bdba04b1438dd483edada630fe98",
    "synthesis": "qwen-openvoice"
  },
  {
    "course": "long-words",
    "coach": "original",
    "language": "en",
    "duration": 82.54820861678003,
    "cues": [
      {
        "section": "title",
        "text": "Remember long words",
        "start": 0.0,
        "end": 1.5905668934240362
      },
      {
        "section": "purpose",
        "text": "Break a long word into meaningful parts, put them together again and practise its meaning, pronunciation and spelling.",
        "start": 2.1405895691609977,
        "end": 9.338775510204082
      },
      {
        "section": "limit",
        "text": "Meaningful parts are not always spoken syllables. Some technical terms are unfamiliar throughout. Check their meaning and pronunciation before practising.",
        "start": 9.68875283446712,
        "end": 19.27859410430839
      },
      {
        "section": "step-0",
        "text": "Clarify the meaning of the whole word.",
        "start": 19.628571428571426,
        "end": 22.020226757369613
      },
      {
        "section": "step-1",
        "text": "Identify familiar parts and explain what they contribute.",
        "start": 22.37020408163265,
        "end": 25.969297052154193
      },
      {
        "section": "step-2",
        "text": "Notice spelling changes and connecting elements.",
        "start": 26.31927437641723,
        "end": 29.512018140589564
      },
      {
        "section": "step-3",
        "text": "Say the parts slowly, then say the whole word fluently. Syllable boundaries may differ from meaning boundaries.",
        "start": 29.8619954648526,
        "end": 37.454920634920626
      },
      {
        "section": "step-4",
        "text": "Hide the example, write the whole word and explain it.",
        "start": 37.80489795918366,
        "end": 41.55492063492063
      },
      {
        "section": "step-5",
        "text": "Check spelling and meaning. Practise uncertain parts, then put the whole word together again.",
        "start": 41.904897959183664,
        "end": 48.22072562358276
      },
      {
        "section": "example",
        "text": "unpredictability",
        "start": 48.570702947845795,
        "end": 50.161269841269835
      },
      {
        "section": "explanation",
        "text": "un | predict | ability: the quality of being difficult or impossible to predict. The final e of “predictable” does not remain in “unpredictability”. These are useful meaning units, not a pronunciation guide.",
        "start": 50.51124716553287,
        "end": 65.66226757369614
      },
      {
        "section": "recall",
        "text": "Write the complete word from memory. Then explain its meaning aloud and say it fluently.",
        "start": 66.01224489795918,
        "end": 71.85206349206348
      },
      {
        "section": "transfer",
        "text": "Choose a long word relevant to your life. Find meaningful parts, then practise the whole word. Use the word formation and pronunciation rules of its language.",
        "start": 72.20204081632652,
        "end": 82.198231292517
      }
    ],
    "src": "/course-media/library/noah-long-words-en-1dc187f56f48.m4a",
    "bytes": 944915,
    "sha256": "1dc187f56f489d115bddc3bb6a6d15051d69a1ecc9b832fc26ab3309bc592398",
    "synthesis": "qwen-openvoice"
  },
  {
    "course": "meaningful-groups",
    "coach": "original",
    "language": "en",
    "duration": 93.77505668934238,
    "cues": [
      {
        "section": "title",
        "text": "Build meaningful groups",
        "start": 0.0,
        "end": 1.5905668934240362
      },
      {
        "section": "purpose",
        "text": "Organise individual pieces of information into meaningful groups. A useful structure can help you see the material clearly and search for it systematically during recall.",
        "start": 2.1405895691609977,
        "end": 11.649160997732427
      },
      {
        "section": "limit",
        "text": "Grouping alone does not guarantee complete recall. The groups must make sense to you; a heading does not explain unfamiliar technical terms. If the original order matters, practise that separately.",
        "start": 11.999138321995465,
        "end": 23.59750566893424
      },
      {
        "section": "step-0",
        "text": "Clarify your goal: the content, its order, or both.",
        "start": 23.947482993197276,
        "end": 28.417324263038545
      },
      {
        "section": "step-1",
        "text": "Look for shared features or relationships.",
        "start": 28.76730158730158,
        "end": 31.565306122448973
      },
      {
        "section": "step-2",
        "text": "Create a few manageable groups with informative headings.",
        "start": 31.91528344671201,
        "end": 35.18929705215419
      },
      {
        "section": "step-3",
        "text": "Explain why each item belongs in its group.",
        "start": 35.539274376417225,
        "end": 38.488208616780035
      },
      {
        "section": "step-4",
        "text": "Hide the source. Recall the groups first, then their contents.",
        "start": 38.83818594104307,
        "end": 43.2267573696145
      },
      {
        "section": "step-5",
        "text": "Compare with the original, correct missing items and try again later.",
        "start": 43.57673469387754,
        "end": 48.45292517006801
      },
      {
        "section": "example",
        "text": "Apple · hammer · shirt · pear · saw · jacket · banana · pliers · trousers",
        "start": 48.80290249433105,
        "end": 56.6396371882086
      },
      {
        "section": "explanation",
        "text": "One possible structure: fruit (apple, pear, banana), tools (hammer, saw, pliers), clothing (shirt, jacket, trousers). The headings provide search cues. This exercise asks you to remember all nine items; their original order is not the learning goal.",
        "start": 56.98961451247164,
        "end": 75.3798185941043
      },
      {
        "section": "recall",
        "text": "Recall the three groups and as many of the nine items as possible without looking. The order within a group is up to you.",
        "start": 75.72979591836733,
        "end": 82.60290249433105
      },
      {
        "section": "transfer",
        "text": "Organise your own passage by ideas or a list by meaningful categories. Do not invent groups just to reach a particular number. Check the full content as well as the headings.",
        "start": 82.95287981859408,
        "end": 93.42507936507934
      }
    ],
    "src": "/course-media/library/noah-meaningful-groups-en-1f8ba5a369a1.m4a",
    "bytes": 1098213,
    "sha256": "1f8ba5a369a1c609848e399362de9e97856897337a71128baa559756f40dfdf5",
    "synthesis": "qwen-openvoice"
  },
  {
    "course": "method-of-loci",
    "coach": "original",
    "language": "en",
    "duration": 79.86462585034012,
    "cues": [
      {
        "section": "title",
        "text": "Use places as memory cues",
        "start": 0.0,
        "end": 2.159455782312925
      },
      {
        "section": "purpose",
        "text": "In the method of loci, you place imagined content at fixed locations along a familiar route. Walking the route in your mind provides cues for retrieving it.",
        "start": 2.7094784580498863,
        "end": 12.148390022675738
      },
      {
        "section": "limit",
        "text": "Learn a stable route first. Similar images at the same location can be confused. Locations support structure and order, not automatically exact wording.",
        "start": 12.498367346938776,
        "end": 21.937278911564626
      },
      {
        "section": "step-0",
        "text": "Choose a familiar route with clearly distinct locations.",
        "start": 22.287256235827662,
        "end": 25.56126984126984
      },
      {
        "section": "step-1",
        "text": "Fix their order and rehearse the route without learning material.",
        "start": 25.911247165532878,
        "end": 29.51034013605442
      },
      {
        "section": "step-2",
        "text": "Connect one item to each location through a vivid imagined event.",
        "start": 29.860317460317457,
        "end": 34.33015873015873
      },
      {
        "section": "step-3",
        "text": "Walk the route without looking and name the items.",
        "start": 34.680136054421766,
        "end": 37.629070294784576
      },
      {
        "section": "step-4",
        "text": "Compare your recall and improve confusing locations or weak images.",
        "start": 37.97904761904761,
        "end": 42.21668934240362
      },
      {
        "section": "example",
        "text": "Example route: front door → shoe rack → kitchen table. Items: bread → soap → candle.",
        "start": 42.566666666666656,
        "end": 50.56594104308389
      },
      {
        "section": "explanation",
        "text": "A giant loaf blocks the front door. The shoe rack overflows with soap foam. A candle glows on the kitchen table. This is only an example route; use a genuinely familiar route for your own learning.",
        "start": 50.915918367346926,
        "end": 63.79138321995464
      },
      {
        "section": "recall",
        "text": "Mentally visit the three locations. Write the item associated with each location.",
        "start": 64.14136054421768,
        "end": 69.65609977324262
      },
      {
        "section": "transfer",
        "text": "Use the app’s existing memory palace to create a familiar route or use an available one. Start with a few locations and check that you can clearly distinguish them.",
        "start": 70.00607709750565,
        "end": 79.51464852607708
      }
    ],
    "src": "/course-media/library/noah-method-of-loci-en-0a9b0022651c.m4a",
    "bytes": 942723,
    "sha256": "0a9b0022651c25b2bcb581264ee532fe09fec41fe8996a8e473b30b0ee9a0306",
    "synthesis": "qwen-openvoice"
  },
  {
    "course": "number-images",
    "coach": "original",
    "language": "en",
    "duration": 78.0186394557823,
    "cues": [
      {
        "section": "title",
        "text": "Turn numbers into images",
        "start": 0.0,
        "end": 1.9969160997732427
      },
      {
        "section": "purpose",
        "text": "The Major System assigns consonant sounds to digits. Use them to form a word and imagine an image that can be decoded back into the number.",
        "start": 2.546938775510204,
        "end": 10.546213151927438
      },
      {
        "section": "limit",
        "text": "Learn the mappings first. An image that cannot be decoded reliably does not help exact number recall. This introduction uses two digits; the existing Major lessons teach further mappings.",
        "start": 10.896190476190476,
        "end": 22.72675736961451
      },
      {
        "section": "step-0",
        "text": "Learn a few fixed digit-to-sound pairs first.",
        "start": 23.076734693877547,
        "end": 25.95600907029478
      },
      {
        "section": "step-1",
        "text": "Read the sounds in the order of the digits.",
        "start": 26.305986394557817,
        "end": 28.860181405895684
      },
      {
        "section": "step-2",
        "text": "Add vowels to form a concrete word.",
        "start": 29.21015873015872,
        "end": 31.683083900226748
      },
      {
        "section": "step-3",
        "text": "Check whether the word contains additional consonant sounds that would encode extra digits.",
        "start": 32.033061224489785,
        "end": 37.30399092970521
      },
      {
        "section": "step-4",
        "text": "Retrieve the word from the image and decode its sounds back into the number.",
        "start": 37.653968253968245,
        "end": 41.64780045351473
      },
      {
        "section": "example",
        "text": "1 → t/d; 2 → n. The number 12 can become an image of a tin: t + n.",
        "start": 41.99777777777777,
        "end": 49.75324263038548
      },
      {
        "section": "explanation",
        "text": "The vowel does not count here. In the reverse direction, t gives 1 and n gives 2, recovering 12. The sound pattern matters, not merely the written letters.",
        "start": 50.103219954648516,
        "end": 61.62031746031745
      },
      {
        "section": "recall",
        "text": "Which number does the image of a tin encode? Explain the reverse path through the two consonant sounds.",
        "start": 61.97029478458049,
        "end": 67.72884353741496
      },
      {
        "section": "transfer",
        "text": "Practise further fixed mappings in the existing Major lessons before tackling longer numbers. Check that every image you create decodes to the exact intended number.",
        "start": 68.078820861678,
        "end": 77.66866213151927
      }
    ],
    "src": "/course-media/library/noah-number-images-en-4d160fcbb313.m4a",
    "bytes": 929277,
    "sha256": "4d160fcbb31367742ab6bf62b2cc5a17c2257d36c17d689dce3d45f94161e193",
    "synthesis": "qwen-openvoice"
  },
  {
    "course": "self-explanation",
    "coach": "original",
    "language": "en",
    "duration": 96.58467120181405,
    "cues": [
      {
        "section": "title",
        "text": "Explain relationships yourself",
        "start": 0.0,
        "end": 1.8343764172335602
      },
      {
        "section": "purpose",
        "text": "Explain in your own words why a step makes sense or how two statements relate. This can reveal gaps in understanding that are easy to miss while reading.",
        "start": 2.3843990929705217,
        "end": 11.254421768707484
      },
      {
        "section": "limit",
        "text": "A fluent explanation can still be wrong. Check it against a reliable source and acknowledge uncertainty. This method supports practice; it does not replace subject knowledge or checking your explanation.",
        "start": 11.604399092970523,
        "end": 22.71514739229025
      },
      {
        "section": "step-0",
        "text": "Choose a manageable relationship you want to understand.",
        "start": 23.065124716553285,
        "end": 26.09532879818594
      },
      {
        "section": "step-1",
        "text": "Ask why the step follows, what stays the same and what would change under different conditions.",
        "start": 26.445306122448976,
        "end": 31.96004535147392
      },
      {
        "section": "step-2",
        "text": "Formulate an explanation without copying the source.",
        "start": 32.31002267573696,
        "end": 35.58403628117914
      },
      {
        "section": "step-3",
        "text": "Compare it with the original reasoning. Separate established facts from guesses.",
        "start": 35.934013605442175,
        "end": 41.123673469387754
      },
      {
        "section": "step-4",
        "text": "Correct gaps and apply your explanation to a similar example.",
        "start": 41.47365079365079,
        "end": 45.63002267573696
      },
      {
        "section": "step-5",
        "text": "Explain the relationship again later without looking.",
        "start": 45.98,
        "end": 49.254013605442175
      },
      {
        "section": "example",
        "text": "Three quarters equals six eighths: 3/4 = 6/8. Halving each of four equal parts creates eight equal parts. The three selected quarters now consist of six eighths. The selected amount stays the same.",
        "start": 49.60399092970521,
        "end": 62.72326530612244
      },
      {
        "section": "explanation",
        "text": "“Multiply the top and bottom by two” describes a rule. Halving the equal parts explains why the value does not change. To transfer the idea, consider why 2/3 and 4/6 describe the same proportion.",
        "start": 63.07324263038548,
        "end": 75.78616780045351
      },
      {
        "section": "recall",
        "text": "Explain without looking why 3/4 and 6/8 are equal. Then apply your reasoning to 2/3 and 4/6.",
        "start": 76.13614512471655,
        "end": 82.84671201814058
      },
      {
        "section": "transfer",
        "text": "Choose a step in your learning material and explain why it holds. Find a similar example and check your explanation with it. If you cannot verify the reasoning reliably, record the open question instead of pretending to be certain.",
        "start": 83.19668934240362,
        "end": 96.23469387755101
      }
    ],
    "src": "/course-media/library/noah-self-explanation-en-6f3e59e4024c.m4a",
    "bytes": 1171429,
    "sha256": "6f3e59e4024c7ea78e85f87ca6ca9be8b83681cc7728b8f7f42313e2eaddd08b",
    "synthesis": "qwen-openvoice"
  },
  {
    "course": "spaced-practice",
    "coach": "original",
    "language": "en",
    "duration": 106.49959183673468,
    "cues": [
      {
        "section": "title",
        "text": "Spaced practice",
        "start": 0.0,
        "end": 1.509297052154195
      },
      {
        "section": "purpose",
        "text": "Spread retrieval attempts over time. This tests retention after a delay rather than simply repeating an answer immediately after reading it.",
        "start": 2.0593197278911566,
        "end": 10.615873015873017
      },
      {
        "section": "limit",
        "text": "No single interval suits every person and topic. Difficulty, prior knowledge and the desired retention period matter. This short exercise explains the approach; lasting retention can only be checked with later attempts.",
        "start": 10.965850340136056,
        "end": 24.47986394557823
      },
      {
        "section": "step-0",
        "text": "Learn a manageable piece of information and retrieve it once without looking.",
        "start": 24.829841269841268,
        "end": 29.787301587301585
      },
      {
        "section": "step-1",
        "text": "Plan another retrieval attempt after a delay.",
        "start": 30.13727891156462,
        "end": 33.330022675736956
      },
      {
        "section": "step-2",
        "text": "Try answering before you reveal the solution.",
        "start": 33.67999999999999,
        "end": 36.478004535147385
      },
      {
        "section": "step-3",
        "text": "After an error, clarify the meaning, correct it and retrieve again. Shorten the next interval if retrieval was too difficult.",
        "start": 36.82798185941042,
        "end": 45.77927437641722
      },
      {
        "section": "step-4",
        "text": "As retrieval becomes reliable, the next interval can increase.",
        "start": 46.12925170068026,
        "end": 50.599092970521525
      },
      {
        "section": "step-5",
        "text": "ANITEW already schedules reviews for stored training items. Follow the due reviews instead of keeping a competing schedule.",
        "start": 50.94907029478456,
        "end": 57.740907029478436
      },
      {
        "section": "example",
        "text": "Mira learns a new concept and explains it without looking. After a break she tries again and finds a gap. She compares with the correct explanation, fixes the gap and schedules the next attempt sooner. Only after reliable retrieval does she increase the interval.",
        "start": 58.09088435374147,
        "end": 73.20707482993195
      },
      {
        "section": "explanation",
        "text": "The delay and the retrieval attempt matter. Reading ten times in a row cannot replace a later retrieval attempt. The error tells Mira what to revisit and helps her adjust the interval.",
        "start": 73.55705215419499,
        "end": 83.94798185941042
      },
      {
        "section": "recall",
        "text": "Describe Mira’s approach: what does she do before checking? How does she respond to the gap? When can she increase the interval?",
        "start": 84.29795918367346,
        "end": 93.08671201814057
      },
      {
        "section": "transfer",
        "text": "Use the due reviews for your stored training items. For material outside the app, plan a later self-test and adjust the interval to actual retrieval. Completing this reading course does not create new review cards.",
        "start": 93.43668934240361,
        "end": 106.14961451247164
      }
    ],
    "src": "/course-media/library/noah-spaced-practice-en-e6e1ef4bf579.m4a",
    "bytes": 1279142,
    "sha256": "e6e1ef4bf57931154528792acbd82b6dd3eda06bd66119667a0320f859189256",
    "synthesis": "qwen-openvoice"
  },
  {
    "course": "text-meaning",
    "coach": "original",
    "language": "en",
    "duration": 88.03972789115645,
    "cues": [
      {
        "section": "title",
        "text": "Remember the meaning of long texts",
        "start": 0.0,
        "end": 1.9969160997732427
      },
      {
        "section": "purpose",
        "text": "Learn to recall the ideas and relationships in a text without looking. Use this for factual reading, presentations and exam preparation.",
        "start": 2.546938775510204,
        "end": 11.335691609977324
      },
      {
        "section": "limit",
        "text": "A summary does not preserve every detail. Practise exact numbers or wording separately when needed. Start with a short passage and increase its length after you can explain it.",
        "start": 11.685668934240363,
        "end": 21.84439909297052
      },
      {
        "section": "step-0",
        "text": "Read a passage and clarify unfamiliar terms.",
        "start": 22.194376417233556,
        "end": 25.468390022675734
      },
      {
        "section": "step-1",
        "text": "Group it by ideas and give each group a short heading.",
        "start": 25.81836734693877,
        "end": 29.336190476190474
      },
      {
        "section": "step-2",
        "text": "Ask a question for each part: what happens, why, and with what result?",
        "start": 29.68616780045351,
        "end": 34.72489795918367
      },
      {
        "section": "step-3",
        "text": "Hide the source and answer in your own words.",
        "start": 35.07487528344671,
        "end": 38.186349206349206
      },
      {
        "section": "step-4",
        "text": "Compare with the original. Correct missing ideas and mistaken connections.",
        "start": 38.53632653061224,
        "end": 43.49378684807256
      },
      {
        "section": "step-5",
        "text": "Recall it again later. Adjust the interval to how reliably you remember.",
        "start": 43.8437641723356,
        "end": 49.11469387755102
      },
      {
        "section": "example",
        "text": "A town plants trees beside a busy road. Their crowns provide shade. Water evaporates through the leaves and contributes to cooling. To remain healthy during dry weather, the trees need enough water and room for their roots.",
        "start": 49.464671201814056,
        "end": 63.05995464852607
      },
      {
        "section": "explanation",
        "text": "Three groups: action (planting trees), effects (shade and evaporation), and requirements (water and root space). The outline preserves their relationship.",
        "start": 63.40993197278911,
        "end": 73.40612244897959
      },
      {
        "section": "recall",
        "text": "Without looking, explain the action, how it works and what it requires.",
        "start": 73.75609977324262,
        "end": 78.55102040816325
      },
      {
        "section": "transfer",
        "text": "Choose a short factual text of your own. Write three guiding questions, put the text away and answer them. Gradually increase the length.",
        "start": 78.90099773242629,
        "end": 87.68975056689341
      }
    ],
    "src": "/course-media/library/noah-text-meaning-en-815db06251b2.m4a",
    "bytes": 1032031,
    "sha256": "815db06251b2b8a3537ba60af4ece76afc4ed77405860c5e7875b49ac0e9da4f",
    "synthesis": "qwen-openvoice"
  },
  {
    "course": "text-verbatim",
    "coach": "original",
    "language": "en",
    "duration": 76.88253968253966,
    "cues": [
      {
        "section": "title",
        "text": "Learn a text word for word",
        "start": 0.0,
        "end": 2.3103854875283445
      },
      {
        "section": "purpose",
        "text": "Practise exact wording for a poem, definition or short speech. Small words and their order matter too.",
        "start": 2.860408163265306,
        "end": 10.29079365079365
      },
      {
        "section": "limit",
        "text": "Exact recall does not prove understanding. Clarify the meaning first. Mental images may support the order of ideas but cannot replace practice of the actual wording.",
        "start": 10.64077097505669,
        "end": 21.19424036281179
      },
      {
        "section": "step-0",
        "text": "Understand the text and choose a short meaningful passage.",
        "start": 21.544217687074827,
        "end": 24.73696145124716
      },
      {
        "section": "step-1",
        "text": "Read it carefully and say it clearly once.",
        "start": 25.0869387755102,
        "end": 28.198412698412692
      },
      {
        "section": "step-2",
        "text": "Hide it and say or write it from memory.",
        "start": 28.54839002267573,
        "end": 31.183854875283437
      },
      {
        "section": "step-3",
        "text": "Compare word for word. Correct omissions, changes in order and added words.",
        "start": 31.533832199546474,
        "end": 37.44331065759636
      },
      {
        "section": "step-4",
        "text": "Practise the next passage, then the transition between them. Sometimes start in the middle.",
        "start": 37.7932879818594,
        "end": 43.14548752834466
      },
      {
        "section": "step-5",
        "text": "Recall it again later without looking. Extend the passage after the current part becomes reliable.",
        "start": 43.4954648526077,
        "end": 49.404943310657586
      },
      {
        "section": "example",
        "text": "In the morning I open the window. Fresh air flows into the room. Then I begin my day.",
        "start": 49.75492063492062,
        "end": 55.66439909297051
      },
      {
        "section": "explanation",
        "text": "The three sentences form three practice units. Learn the first, then the second and their transition. Start a later attempt at “Fresh air …” as well.",
        "start": 56.01437641723355,
        "end": 64.7334693877551
      },
      {
        "section": "recall",
        "text": "Write the three sentences as accurately as you can from memory.",
        "start": 65.08344671201813,
        "end": 68.75219954648524
      },
      {
        "section": "transfer",
        "text": "Choose a short passage whose wording matters to you. Compare it with its source yourself; a paraphrase does not meet this particular goal.",
        "start": 69.10217687074828,
        "end": 76.53256235827662
      }
    ],
    "src": "/course-media/library/noah-text-verbatim-en-8a2682b857e6.m4a",
    "bytes": 902942,
    "sha256": "8a2682b857e6f5c08cb054f106330f8ba230b7828b0c0b163d6cbf7a4e2437e0",
    "synthesis": "qwen-openvoice"
  },
  {
    "course": "active-recall",
    "coach": "rafael",
    "language": "fr",
    "duration": 94.34394557823124,
    "cues": [
      {
        "section": "title",
        "text": "Pratiquer le rappel actif",
        "start": 0.0,
        "end": 1.799546485260771
      },
      {
        "section": "purpose",
        "text": "Essaie de retrouver une information sans regarder sa source. Tu distingues ainsi ce que tu peux rappeler toi-même de ce qui demande encore du travail. Cette méthode s’applique aux faits, aux notions et aux relations.",
        "start": 2.3495691609977323,
        "end": 15.294693877551019,
        "spokenText": "Essaie de retrouver une information sans regarder sa source. Tu distingues ainsi deux choses : ce que tu peux rappeler toi-même, et ce qui demande encore du travail. Cette méthode s’applique aux faits, aux notions et aux relations."
      },
      {
        "section": "limit",
        "text": "Reconnaître une réponse en la lisant ne signifie pas savoir la retrouver. Un échec n’est pas un verdict : vérifie et comprends la bonne réponse, puis réessaie. Deviner plusieurs fois sans correction peut renforcer des erreurs.",
        "start": 15.644671201814058,
        "end": 28.369206349206348
      },
      {
        "section": "step-0",
        "text": "Choisis une petite quantité d’information que tu comprends.",
        "start": 28.719183673469384,
        "end": 31.586848072562354
      },
      {
        "section": "step-1",
        "text": "Pose une question précise à laquelle le contenu permet de répondre.",
        "start": 31.93682539682539,
        "end": 36.02353741496598
      },
      {
        "section": "step-2",
        "text": "Écarte la source et réponds avant de vérifier.",
        "start": 36.373514739229016,
        "end": 39.46176870748298
      },
      {
        "section": "step-3",
        "text": "Compare avec l’original. Corrige les éléments manquants ou erronés.",
        "start": 39.81174603174602,
        "end": 44.432517006802705
      },
      {
        "section": "step-4",
        "text": "Cache la réponse et essaie de la rappeler à nouveau.",
        "start": 44.78249433106574,
        "end": 47.71981859410429
      },
      {
        "section": "step-5",
        "text": "Teste-toi aussi plus tard. Répéter immédiatement peut sembler facile sans démontrer une mémorisation durable.",
        "start": 48.069795918367326,
        "end": 54.39723356009068
      },
      {
        "section": "example",
        "text": "Question : pourquoi l’eau qui s’évapore peut-elle refroidir une surface ?\nRéponse : l’évaporation demande de l’énergie. Cette énergie est prélevée sous forme de chaleur dans la surface et son environnement.",
        "start": 54.74721088435372,
        "end": 66.90285714285712
      },
      {
        "section": "explanation",
        "text": "Lis et comprends d’abord la réponse. Cache-la ensuite et réponds toi-même. « L’eau refroidit » ne suffit pas à expliquer le lien : le besoin d’énergie et le prélèvement de chaleur sont essentiels.",
        "start": 67.25283446712015,
        "end": 77.87596371882083,
        "spokenText": "Commence par lire et comprendre la réponse. Cache-la ensuite et réponds toi-même. « L’eau refroidit » ne suffit pas à expliquer le lien : le besoin d’énergie et le prélèvement de chaleur sont essentiels."
      },
      {
        "section": "recall",
        "text": "Pourquoi l’eau qui s’évapore peut-elle refroidir une surface ? Explique le lien sans regarder.",
        "start": 78.22594104308386,
        "end": 83.55492063492059
      },
      {
        "section": "transfer",
        "text": "Formule une question précise sur ton propre contenu. Réponds sans regarder, compare ensuite et réessaie plus tard. ANITEW utilise aussi le rappel dans ses séances d’entraînement.",
        "start": 83.90489795918363,
        "end": 93.9939682539682
      }
    ],
    "src": "/course-media/library/atta-active-recall-fr-fa8c58ddb568.m4a",
    "bytes": 1012238,
    "sha256": "fa8c58ddb568cfe8461f1ad04a295703ca7761e126f7b9559076ca05b3039855",
    "synthesis": "kyutai-openvoice"
  },
  {
    "course": "interleaved-practice",
    "coach": "rafael",
    "language": "fr",
    "duration": 101.94680272108842,
    "cues": [
      {
        "section": "title",
        "text": "Choisir entre des démarches proches",
        "start": 0.0,
        "end": 2.0085260770975055
      },
      {
        "section": "purpose",
        "text": "Mélange des types d’exercices proches et choisis toi-même la démarche adaptée. Tu travailles ainsi le choix de la méthode autant que son application.",
        "start": 2.558548752834467,
        "end": 11.173151927437642
      },
      {
        "section": "limit",
        "text": "Apprends d’abord chaque démarche avec des exemples clairs. Changer de sujet au hasard ou faire plusieurs choses à la fois est différent. L’intérêt du mélange dépend du contenu et de tes connaissances antérieures.",
        "start": 11.52312925170068,
        "end": 24.03868480725624
      },
      {
        "section": "step-0",
        "text": "Comprends d’abord chaque démarche séparément.",
        "start": 24.388662131519276,
        "end": 26.96607709750567
      },
      {
        "section": "step-1",
        "text": "Mélange ensuite quelques types d’exercices proches.",
        "start": 27.31605442176871,
        "end": 30.752607709750567
      },
      {
        "section": "step-2",
        "text": "Avant de répondre, identifie le type et explique ton choix.",
        "start": 31.102585034013604,
        "end": 34.539138321995466
      },
      {
        "section": "step-3",
        "text": "Résous l’exercice et vérifie séparément ton choix et ton résultat.",
        "start": 34.8891156462585,
        "end": 39.2544671201814
      },
      {
        "section": "step-4",
        "text": "Retravaille les erreurs, puis reviens aux exercices mélangés.",
        "start": 39.60444444444444,
        "end": 42.54176870748299
      },
      {
        "section": "example",
        "text": "Rectangle : aire = longueur × largeur. Triangle : aire = base × hauteur correspondante ÷ 2. Un rectangle de 4 cm sur 3 cm a une aire de 12 cm². Un triangle de base 4 cm et de hauteur correspondante 3 cm a une aire de 6 cm².",
        "start": 42.891746031746024,
        "end": 64.86943310657595,
        "spokenText": "Pour un rectangle, l’aire est égale à la longueur multipliée par la largeur. Pour un triangle, l’aire est égale à la base multipliée par la hauteur correspondante, puis divisée par deux. Un rectangle de quatre centimètres sur trois centimètres a une aire de douze centimètres carrés. Un triangle de base quatre centimètres et de hauteur correspondante trois centimètres a une aire de six centimètres carrés."
      },
      {
        "section": "explanation",
        "text": "Des nombres identiques n’impliquent pas le même calcul. La figure détermine la règle : le triangle demande le facteur un demi. Dans un mélange d’exercices, il faut identifier le type avant d’appliquer la règle.",
        "start": 65.21941043083899,
        "end": 79.62739229024942,
        "spokenText": "Des nombres identiques ne donnent pas forcément le même calcul. La figure détermine la règle. Pour le triangle, il faut diviser le produit par deux. Dans un mélange d’exercices, commence par identifier le type de figure avant d’appliquer la règle."
      },
      {
        "section": "recall",
        "text": "Exercice A : triangle de base 6 cm et de hauteur correspondante 4 cm. Exercice B : rectangle de longueur 6 cm et de largeur 4 cm. Donne la règle et l’aire de chaque figure.",
        "start": 79.97736961451245,
        "end": 94.69882086167799,
        "spokenText": "Exercice A. Un triangle de base six centimètres et de hauteur correspondante quatre centimètres. Exercice B. Un rectangle de longueur six centimètres et de largeur quatre centimètres. Donne la règle et l’aire de chaque figure."
      },
      {
        "section": "transfer",
        "text": "Choisis deux ou trois types d’exercices proches que tu connais déjà. Mélange-les et justifie ta démarche avant chaque résolution.",
        "start": 95.04879818594102,
        "end": 101.59682539682538
      }
    ],
    "src": "/course-media/library/atta-interleaved-practice-fr-7596ef23e316.m4a",
    "bytes": 1117637,
    "sha256": "7596ef23e3164b2836af42fe4505e95428a86d7917b2382f61c5646fe54ea222",
    "synthesis": "kyutai-openvoice"
  },
  {
    "course": "keyword-method",
    "coach": "rafael",
    "language": "fr",
    "duration": 79.4002267573696,
    "cues": [
      {
        "section": "title",
        "text": "Relier le vocabulaire à des mots-clés",
        "start": 0.0,
        "end": 2.2987755102040817
      },
      {
        "section": "purpose",
        "text": "Un mot connu dont le son est proche peut servir de pont vers le sens d’un mot étranger. Relie ce mot-clé et le sens dans une image, puis vérifie le mot à apprendre.",
        "start": 2.848798185941043,
        "end": 13.355827664399092,
        "spokenText": "Un mot connu dont le son est proche peut servir de pont vers le sens d’un mot étranger. Relie ce mot-clé et le sens dans une image. Puis vérifie le mot à apprendre."
      },
      {
        "section": "limit",
        "text": "Un son proche n’est pas une prononciation correcte. Certains mots ne se prêtent pas à cette technique. Vérifie séparément la prononciation, l’orthographe et l’emploi dans une phrase.",
        "start": 13.70580498866213,
        "end": 23.284036281179137
      },
      {
        "section": "step-0",
        "text": "Vérifie le sens et la prononciation correcte du nouveau mot.",
        "start": 23.634013605442174,
        "end": 27.151836734693873
      },
      {
        "section": "step-1",
        "text": "Cherche un mot connu au son proche.",
        "start": 27.50181405895691,
        "end": 29.87024943310657
      },
      {
        "section": "step-2",
        "text": "Imagine un lien clair entre ce mot-clé et le sens.",
        "start": 30.220226757369606,
        "end": 33.44780045351473
      },
      {
        "section": "step-3",
        "text": "Retrouve le sens à partir du mot, puis le mot à partir du sens.",
        "start": 33.79777777777777,
        "end": 37.454920634920626
      },
      {
        "section": "step-4",
        "text": "Vérifie la prononciation, l’orthographe et une phrase d’exemple.",
        "start": 37.80489795918366,
        "end": 41.032471655328784
      },
      {
        "section": "example",
        "text": "Anglais : bell = cloche. Exemple : The bell rings. = La cloche sonne.",
        "start": 41.38244897959182,
        "end": 47.860816326530596
      },
      {
        "section": "explanation",
        "text": "Le mot français « belle » peut servir d’indice sonore : imagine une très belle cloche qui sonne. « Belle » est l’aide-mémoire, pas une transcription de la prononciation anglaise de bell.",
        "start": 48.21079365079363,
        "end": 59.29832199546483
      },
      {
        "section": "recall",
        "text": "Quel mot anglais signifie cloche ? Écris le mot, son sens et la phrase d’exemple de mémoire.",
        "start": 59.64829931972787,
        "end": 65.83641723356007
      },
      {
        "section": "transfer",
        "text": "Essaie avec un mot dont tu as réellement besoin. Teste aussi le sens inverse : peux-tu retrouver la forme étrangère à partir du sens ? Si le mot-clé te perturbe, change de lien ou utilise le rappel direct.",
        "start": 66.1863945578231,
        "end": 79.05024943310656,
        "spokenText": "Fais un essai avec un mot dont tu as réellement besoin. Teste aussi le sens inverse : peux-tu retrouver la forme étrangère à partir du sens ? Si le mot-clé te perturbe, change de lien ou utilise le rappel direct."
      }
    ],
    "src": "/course-media/library/atta-keyword-method-fr-6d3604a8dd53.m4a",
    "bytes": 839728,
    "sha256": "6d3604a8dd537f7e5f4e1ab33ecbcc41ab8a42fdbaeb06eb1bfc14377bac8e36",
    "synthesis": "kyutai-openvoice"
  },
  {
    "course": "long-words",
    "coach": "rafael",
    "language": "fr",
    "duration": 82.93133786848071,
    "cues": [
      {
        "section": "title",
        "text": "Retenir les mots longs",
        "start": 0.0,
        "end": 1.5789569160997732
      },
      {
        "section": "purpose",
        "text": "Décompose un mot long en éléments compréhensibles, puis reconstitue-le. Travaille son sens, sa prononciation et son orthographe.",
        "start": 2.1289795918367345,
        "end": 8.816326530612244
      },
      {
        "section": "limit",
        "text": "Les éléments de sens ne correspondent pas toujours aux syllabes prononcées. Certains termes techniques sont entièrement nouveaux. Vérifie leur sens et leur prononciation avant de les travailler.",
        "start": 9.166303854875283,
        "end": 19.255374149659865
      },
      {
        "section": "step-0",
        "text": "Clarifie le sens du mot entier.",
        "start": 19.6053514739229,
        "end": 21.40489795918367
      },
      {
        "section": "step-1",
        "text": "Repère des éléments connus et explique leur rôle.",
        "start": 21.754875283446708,
        "end": 24.5528798185941
      },
      {
        "section": "step-2",
        "text": "Observe les changements d’orthographe et les éléments de liaison.",
        "start": 24.902857142857137,
        "end": 28.42068027210884
      },
      {
        "section": "step-3",
        "text": "Prononce les parties lentement, puis le mot entier avec fluidité. Les frontières syllabiques peuvent être différentes.",
        "start": 28.770657596371876,
        "end": 35.446394557823126
      },
      {
        "section": "step-4",
        "text": "Cache le modèle, écris le mot entier et explique-le.",
        "start": 35.79637188208616,
        "end": 39.023945578231285
      },
      {
        "section": "step-5",
        "text": "Vérifie l’orthographe et le sens. Travaille les parties incertaines, puis rassemble à nouveau le mot.",
        "start": 39.37392290249432,
        "end": 44.5635827664399
      },
      {
        "section": "example",
        "text": "incompréhensible",
        "start": 44.91356009070294,
        "end": 46.56217687074829,
        "spokenText": "Exemple : incompréhensible."
      },
      {
        "section": "explanation",
        "text": "in | compréhensible : ce qui ne peut pas être compris. Le préfixe in- apporte ici la négation. « Compréhensible » est lié au verbe comprendre. Ce découpage aide à saisir le sens ; il ne constitue pas une transcription de la prononciation.",
        "start": 46.912154195011325,
        "end": 65.03532879818593,
        "spokenText": "Le mot incompréhensible signifie : ce qui ne peut pas être compris. On sépare le préfixe in et le mot compréhensible. Le préfixe in apporte ici la négation. Compréhensible est lié au verbe comprendre. Ce découpage aide à saisir le sens. Il ne constitue pas une transcription de la prononciation."
      },
      {
        "section": "recall",
        "text": "Écris le mot entier de mémoire. Explique ensuite son sens à voix haute et prononce-le avec fluidité.",
        "start": 65.38530612244897,
        "end": 72.14231292517006
      },
      {
        "section": "transfer",
        "text": "Choisis un mot long utile dans ta vie. Repère ses éléments de sens, puis travaille le mot entier. Respecte les règles de formation et de prononciation de sa langue.",
        "start": 72.4922902494331,
        "end": 82.58136054421767
      }
    ],
    "src": "/course-media/library/atta-long-words-fr-149351df0c06.m4a",
    "bytes": 891201,
    "sha256": "149351df0c066b2839bf02809d0083d2fcb12300589a53ebf88425690e000533",
    "synthesis": "kyutai-openvoice"
  },
  {
    "course": "meaningful-groups",
    "coach": "rafael",
    "language": "fr",
    "duration": 92.88108843537414,
    "cues": [
      {
        "section": "title",
        "text": "Former des groupes cohérents",
        "start": 0.0,
        "end": 2.6586848072562357
      },
      {
        "section": "purpose",
        "text": "Organise des informations en groupes compréhensibles. Une structure utile peut t’aider à voir l’ensemble et à chercher les éléments méthodiquement lors du rappel.",
        "start": 3.208707482993197,
        "end": 12.04390022675737
      },
      {
        "section": "limit",
        "text": "Regrouper ne garantit pas un rappel complet. Les groupes doivent avoir un sens pour toi ; un titre ne suffit pas à expliquer des termes inconnus. Si l’ordre initial compte, travaille-le aussi.",
        "start": 12.393877551020408,
        "end": 21.6934693877551
      },
      {
        "section": "step-0",
        "text": "Précise ton objectif : le contenu, son ordre ou les deux.",
        "start": 22.043446712018138,
        "end": 25.770249433106574
      },
      {
        "section": "step-1",
        "text": "Cherche des caractéristiques communes ou des relations.",
        "start": 26.12022675736961,
        "end": 28.98789115646258
      },
      {
        "section": "step-2",
        "text": "Crée quelques groupes faciles à parcourir avec des titres informatifs.",
        "start": 29.337868480725618,
        "end": 32.77442176870748
      },
      {
        "section": "step-3",
        "text": "Explique pourquoi chaque élément appartient à son groupe.",
        "start": 33.12439909297051,
        "end": 36.421632653061216
      },
      {
        "section": "step-4",
        "text": "Cache la source. Rappelle d’abord les groupes, puis leur contenu.",
        "start": 36.77160997732425,
        "end": 41.322721088435365,
        "spokenText": "Cache la source. Ensuite, rappelle d’abord les groupes, puis leur contenu."
      },
      {
        "section": "step-5",
        "text": "Compare avec l’original, corrige les omissions et réessaie plus tard.",
        "start": 41.6726984126984,
        "end": 45.689750566893416
      },
      {
        "section": "example",
        "text": "Pomme · marteau · chemise · poire · scie · veste · banane · pince · pantalon",
        "start": 46.03972789115645,
        "end": 56.69768707482992,
        "spokenText": "Une pomme. Un marteau. Une chemise. Une poire. Une scie. Une veste. Une banane. Une pince. Un pantalon."
      },
      {
        "section": "explanation",
        "text": "Une organisation possible : fruits (pomme, poire, banane), outils (marteau, scie, pince), vêtements (chemise, veste, pantalon). Les titres servent d’indices. L’objectif est de retenir les neuf éléments, pas leur ordre initial.",
        "start": 57.04766439909296,
        "end": 70.84031746031745
      },
      {
        "section": "recall",
        "text": "Rappelle les trois groupes et autant des neuf éléments que possible, sans regarder. L’ordre dans chaque groupe est libre.",
        "start": 71.19029478458049,
        "end": 79.20117913832199,
        "spokenText": "Rappelle les trois groupes et autant des neuf éléments que possible. Fais-le sans regarder la liste. L’ordre dans chaque groupe est libre."
      },
      {
        "section": "transfer",
        "text": "Organise un passage par idées ou une liste par catégories utiles. N’invente pas des groupes pour atteindre un nombre fixé. Vérifie le contenu complet, pas seulement les titres.",
        "start": 79.55115646258503,
        "end": 92.5311111111111,
        "spokenText": "Organise un passage par idées ou une liste par catégories utiles. N’invente pas des groupes pour atteindre un nombre fixé. Vérifie tout le contenu. Ne te limite pas aux titres."
      }
    ],
    "src": "/course-media/library/atta-meaningful-groups-fr-8041cea94c49.m4a",
    "bytes": 983718,
    "sha256": "8041cea94c49138b5e58c8697deb713803f39be11317a756c3f17522dd026fdf",
    "synthesis": "kyutai-openvoice"
  },
  {
    "course": "method-of-loci",
    "coach": "rafael",
    "language": "fr",
    "duration": 82.79034013605441,
    "cues": [
      {
        "section": "title",
        "text": "Utiliser les lieux comme indices",
        "start": 0.0,
        "end": 2.507755102040816
      },
      {
        "section": "purpose",
        "text": "Avec la méthode des loci, tu places mentalement des contenus à des endroits fixes d’un trajet familier. Parcourir ce trajet dans ta tête fournit des indices pour les retrouver.",
        "start": 3.0577777777777775,
        "end": 11.533061224489796
      },
      {
        "section": "limit",
        "text": "Apprends d’abord un trajet stable. Des images semblables au même endroit peuvent se confondre. Les lieux soutiennent la structure et l’ordre, mais pas automatiquement la formulation exacte.",
        "start": 11.883038548752834,
        "end": 22.18108843537415
      },
      {
        "section": "step-0",
        "text": "Choisis un trajet familier avec des endroits clairement distincts.",
        "start": 22.531065759637187,
        "end": 26.3275283446712
      },
      {
        "section": "step-1",
        "text": "Fixe leur ordre et répète le trajet sans contenu à apprendre.",
        "start": 26.677505668934238,
        "end": 31.867165532879817,
        "spokenText": "Fixe leur ordre. Répète ensuite le trajet sans contenu à apprendre."
      },
      {
        "section": "step-2",
        "text": "Associe un élément à chaque endroit par un événement imaginé marquant.",
        "start": 32.21714285714285,
        "end": 36.73342403628118
      },
      {
        "section": "step-3",
        "text": "Parcours le trajet sans modèle et nomme les éléments.",
        "start": 37.083401360544215,
        "end": 40.38063492063492
      },
      {
        "section": "step-4",
        "text": "Compare ton rappel et améliore les lieux confus ou les images peu efficaces.",
        "start": 40.730612244897955,
        "end": 46.640090702947845,
        "spokenText": "Compare ton rappel. Améliore ensuite les lieux confus ou les images peu efficaces."
      },
      {
        "section": "example",
        "text": "Trajet d’exemple : porte d’entrée → meuble à chaussures → table de cuisine. Éléments : pain → savon → bougie.",
        "start": 46.99006802721088,
        "end": 54.10698412698412
      },
      {
        "section": "explanation",
        "text": "Un pain géant bloque la porte. Le meuble à chaussures déborde de mousse de savon. Une bougie brille sur la table de cuisine. Ce trajet est seulement un exemple ; choisis un trajet réellement familier pour ton propre apprentissage.",
        "start": 54.45696145124716,
        "end": 67.21632653061224
      },
      {
        "section": "recall",
        "text": "Visite mentalement les trois endroits. Écris l’élément associé à chacun.",
        "start": 67.56630385487527,
        "end": 72.68630385487528,
        "spokenText": "Visite mentalement les trois endroits. Puis écris l’élément associé à chacun."
      },
      {
        "section": "transfer",
        "text": "Dans le palais de mémoire existant de l’application, crée un trajet familier ou utilise un trajet proposé. Commence par quelques endroits et vérifie que tu les distingues clairement.",
        "start": 73.03628117913831,
        "end": 82.44036281179137
      }
    ],
    "src": "/course-media/library/atta-method-of-loci-fr-4c3a046dcc06.m4a",
    "bytes": 907392,
    "sha256": "4c3a046dcc0675f037ec26e470a41088afa4773fb5138354f5260e07a74f13fc",
    "synthesis": "kyutai-openvoice"
  },
  {
    "course": "number-images",
    "coach": "rafael",
    "language": "fr",
    "duration": 92.00866213151926,
    "cues": [
      {
        "section": "title",
        "text": "Transformer les nombres en images",
        "start": 0.0,
        "end": 2.507755102040816
      },
      {
        "section": "purpose",
        "text": "Le système majeur associe des sons consonantiques aux chiffres. Tu formes un mot et imagines une image que tu peux ensuite reconvertir en nombre.",
        "start": 3.0577777777777775,
        "end": 11.324081632653062
      },
      {
        "section": "limit",
        "text": "Apprends d’abord les correspondances. Une image qui ne permet pas de retrouver exactement le nombre n’aide pas au rappel précis. Cette introduction utilise deux chiffres ; les leçons existantes du système majeur présentent d’autres correspondances.",
        "start": 11.6740589569161,
        "end": 23.969024943310657
      },
      {
        "section": "step-0",
        "text": "Apprends d’abord quelques correspondances fixes entre chiffres et sons.",
        "start": 24.319002267573694,
        "end": 28.185124716553286
      },
      {
        "section": "step-1",
        "text": "Lis les sons dans l’ordre des chiffres.",
        "start": 28.535102040816323,
        "end": 31.402766439909293,
        "spokenText": "Lis les sons, dans l’ordre des chiffres."
      },
      {
        "section": "step-2",
        "text": "Ajoute des voyelles pour former un mot concret.",
        "start": 31.75274376417233,
        "end": 34.33015873015872
      },
      {
        "section": "step-3",
        "text": "Vérifie si le mot contient d’autres consonnes prononcées qui coderaient des chiffres supplémentaires.",
        "start": 34.68013605442176,
        "end": 39.62598639455781
      },
      {
        "section": "step-4",
        "text": "Retrouve le mot à partir de l’image, puis le nombre à partir de ses sons.",
        "start": 39.97596371882085,
        "end": 44.271655328798175
      },
      {
        "section": "example",
        "text": "1 → t/d ; 2 → n. Le nombre 12 peut devenir l’image d’une tonne de sable : t + n.",
        "start": 44.62163265306121,
        "end": 57.60158730158729,
        "spokenText": "Pour le chiffre un, utilise le premier son de tapis ou de dos. Pour le chiffre deux, utilise le premier son de nez. Pour douze, imagine une tonne de sable. Dans tonne, tu retrouves le son initial de tapis, puis celui de nez."
      },
      {
        "section": "explanation",
        "text": "La voyelle ne compte pas ici. Dans tonne, les deux lettres n représentent un seul son consonantique. Au retour, t donne 1 et n donne 2 : tu retrouves 12. Ce sont les sons qui comptent, pas simplement les lettres écrites.",
        "start": 57.951564625850324,
        "end": 74.42612244897958,
        "spokenText": "Dans cet exercice, les voyelles ne comptent pas. Le mot tonne s’écrit avec deux lettres identiques au milieu, mais elles représentent un seul son. Le premier son consonantique code un. Le second code deux. Tu retrouves douze. On compte les sons, pas le nombre de lettres."
      },
      {
        "section": "recall",
        "text": "Quel nombre code l’image d’une tonne de sable ? Explique le retour par les deux consonnes prononcées.",
        "start": 74.77609977324262,
        "end": 80.61591836734692
      },
      {
        "section": "transfer",
        "text": "Travaille les autres correspondances fixes dans les leçons existantes avant de mémoriser des nombres plus longs. Vérifie que chaque image te ramène exactement au nombre voulu.",
        "start": 80.96589569160996,
        "end": 91.65868480725622,
        "spokenText": "Travaille les autres correspondances fixes dans les leçons existantes avant de mémoriser des nombres plus longs. Assure-toi que chaque image te ramène exactement au nombre voulu."
      }
    ],
    "src": "/course-media/library/atta-number-images-fr-ebf0a0e02bbc.m4a",
    "bytes": 989067,
    "sha256": "ebf0a0e02bbc2323c6060fff5aa34d5a2f03932fe4fc792e9a38e33d7d4b2e10",
    "synthesis": "kyutai-openvoice"
  },
  {
    "course": "self-explanation",
    "coach": "rafael",
    "language": "fr",
    "duration": 102.94693877551018,
    "cues": [
      {
        "section": "title",
        "text": "Expliquer soi-même les relations",
        "start": 0.0,
        "end": 2.0085260770975055
      },
      {
        "section": "purpose",
        "text": "Explique avec tes propres mots pourquoi une étape a du sens ou comment deux affirmations sont liées. Tu peux ainsi découvrir des lacunes qui passent inaperçues à la lecture.",
        "start": 2.558548752834467,
        "end": 12.601179138321996
      },
      {
        "section": "limit",
        "text": "Une explication fluide peut être fausse. Vérifie-la dans une source fiable et reconnais les incertitudes. Cette méthode accompagne la pratique ; elle ne remplace ni les connaissances du sujet ni la vérification.",
        "start": 12.951156462585034,
        "end": 25.037142857142857
      },
      {
        "section": "step-0",
        "text": "Choisis une relation limitée que tu veux comprendre.",
        "start": 25.387120181405894,
        "end": 28.475374149659864
      },
      {
        "section": "step-1",
        "text": "Demande-toi pourquoi l’étape suit, ce qui reste identique et ce qui changerait dans d’autres conditions.",
        "start": 28.8253514739229,
        "end": 33.68993197278911
      },
      {
        "section": "step-2",
        "text": "Formule une explication sans copier la source.",
        "start": 34.03990929705215,
        "end": 38.02213151927437,
        "spokenText": "Maintenant, explique avec tes propres mots. Ne copie pas la source."
      },
      {
        "section": "step-3",
        "text": "Compare avec le raisonnement original. Distingue les faits établis des suppositions.",
        "start": 38.372108843537404,
        "end": 43.352789115646246
      },
      {
        "section": "step-4",
        "text": "Corrige les lacunes et applique ton explication à un exemple similaire.",
        "start": 43.70276643990928,
        "end": 48.857596371882074
      },
      {
        "section": "step-5",
        "text": "Explique de nouveau la relation plus tard, sans regarder.",
        "start": 49.20757369614511,
        "end": 52.21455782312924
      },
      {
        "section": "example",
        "text": "Trois quarts valent six huitièmes : 3/4 = 6/8. En coupant chacune des quatre parts égales en deux, on obtient huit parts égales. Les trois quarts sélectionnés deviennent six huitièmes. La quantité sélectionnée reste identique.",
        "start": 52.56453514739228,
        "end": 67.04217687074828
      },
      {
        "section": "explanation",
        "text": "« Multiplier le numérateur et le dénominateur par deux » décrit une règle. Couper les parts égales en deux explique pourquoi la valeur ne change pas. Pour transférer l’idée, cherche pourquoi 2/3 et 4/6 représentent la même proportion.",
        "start": 67.39215419501132,
        "end": 81.11514739229023
      },
      {
        "section": "recall",
        "text": "Explique sans modèle pourquoi 3/4 et 6/8 sont égaux. Applique ensuite ton raisonnement à 2/3 et 4/6.",
        "start": 81.46512471655326,
        "end": 89.80108843537413
      },
      {
        "section": "transfer",
        "text": "Choisis une étape de ton cours et explique pourquoi elle est valable. Trouve un exemple similaire pour vérifier ton raisonnement. Si tu ne peux pas vérifier de façon fiable, note la question ouverte plutôt que de prétendre être certain.",
        "start": 90.15106575963716,
        "end": 102.59696145124714
      }
    ],
    "src": "/course-media/library/atta-self-explanation-fr-6401fe1a41f6.m4a",
    "bytes": 1144403,
    "sha256": "6401fe1a41f6f700bcbcddc7c1ef20f481aa464b2cc77407f1efecf0f3d9c0cc",
    "synthesis": "kyutai-openvoice"
  },
  {
    "course": "spaced-practice",
    "coach": "rafael",
    "language": "fr",
    "duration": 112.4322902494331,
    "cues": [
      {
        "section": "title",
        "text": "Espacer les révisions",
        "start": 0.0,
        "end": 1.4396371882086167
      },
      {
        "section": "purpose",
        "text": "Répartis les tentatives de rappel dans le temps. Tu vérifies ainsi ce qui reste après une pause, plutôt que de répéter une réponse juste après l’avoir lue.",
        "start": 1.9896598639455783,
        "end": 15.538503401360543,
        "spokenText": "Répartis les tentatives de rappel dans le temps. Après une pause, essaie de retrouver la réponse. Tu vérifies ainsi ce que tu as retenu. Répéter immédiatement une réponse que tu viens de lire ne suffit pas."
      },
      {
        "section": "limit",
        "text": "Aucun intervalle ne convient à tous les contenus et à toutes les personnes. La difficulté, les connaissances antérieures et la durée de rétention souhaitée comptent. Cet exercice explique la démarche ; seuls des rappels ultérieurs permettent de vérifier la rétention dans le temps.",
        "start": 15.888480725623582,
        "end": 29.25156462585034
      },
      {
        "section": "step-0",
        "text": "Apprends une information limitée et essaie de la rappeler une fois sans modèle.",
        "start": 29.601541950113376,
        "end": 33.8972335600907
      },
      {
        "section": "step-1",
        "text": "Prévois une autre tentative après un délai.",
        "start": 34.247210884353734,
        "end": 36.615646258503396
      },
      {
        "section": "step-2",
        "text": "Essaie de répondre avant d’afficher la solution.",
        "start": 36.96562358276643,
        "end": 40.0538775510204
      },
      {
        "section": "step-3",
        "text": "Après une erreur, clarifie le sens, corrige et rappelle à nouveau. Raccourcis l’intervalle suivant si le rappel était trop difficile.",
        "start": 40.403854875283436,
        "end": 47.95034013605441
      },
      {
        "section": "step-4",
        "text": "Lorsque le rappel devient fiable, l’intervalle peut augmenter.",
        "start": 48.300317460317444,
        "end": 52.16643990929704
      },
      {
        "section": "step-5",
        "text": "ANITEW planifie déjà les révisions des éléments d’entraînement enregistrés. Suis les révisions dues plutôt que de créer un calendrier concurrent.",
        "start": 52.51641723356008,
        "end": 60.35315192743763
      },
      {
        "section": "example",
        "text": "Mira apprend une nouvelle notion et l’explique sans modèle. Après une pause, elle réessaie et découvre une lacune. Elle compare avec la bonne explication, corrige la lacune et prévoit le prochain essai plus tôt. Elle augmente l’intervalle seulement lorsque le rappel devient fiable.",
        "start": 60.703129251700666,
        "end": 76.1792290249433
      },
      {
        "section": "explanation",
        "text": "Le délai et la tentative de rappel comptent. Relire dix fois de suite ne remplace pas un rappel ultérieur. L’erreur indique à Mira ce qu’elle doit retravailler et l’aide à adapter l’intervalle.",
        "start": 76.52920634920633,
        "end": 90.14770975056688,
        "spokenText": "Le délai et la tentative de rappel comptent. Relire dix fois de suite ne remplace pas un rappel ultérieur. Grâce à son erreur, Mira sait ce qu’elle doit retravailler. Elle peut aussi adapter le délai avant son prochain essai."
      },
      {
        "section": "recall",
        "text": "Décris la démarche de Mira : que fait-elle avant de vérifier ? Comment réagit-elle à la lacune ? Quand peut-elle augmenter l’intervalle ?",
        "start": 90.49768707482991,
        "end": 99.14712018140588
      },
      {
        "section": "transfer",
        "text": "Utilise les révisions dues pour les éléments d’entraînement enregistrés. Pour un contenu extérieur à l’application, prévois un test ultérieur et adapte le délai au rappel réel. Terminer ce cours ne crée pas de nouvelles cartes de révision.",
        "start": 99.49709750566892,
        "end": 112.08231292517006,
        "spokenText": "Utilise les révisions dues pour les éléments d’entraînement enregistrés. Pour un contenu extérieur à l’application, prévois un test ultérieur et adapte le délai au rappel réel. Ce cours ne crée aucune nouvelle carte de révision quand tu le termines."
      }
    ],
    "src": "/course-media/library/atta-spaced-practice-fr-3c9902a34909.m4a",
    "bytes": 1231577,
    "sha256": "3c9902a34909cbad5d004711040e7bc34ef6c9e8471c3b96ac3a532aea75b20e",
    "synthesis": "kyutai-openvoice"
  },
  {
    "course": "text-meaning",
    "coach": "rafael",
    "language": "fr",
    "duration": 104.9554648526077,
    "cues": [
      {
        "section": "title",
        "text": "Retenir le sens d’un texte long",
        "start": 0.0,
        "end": 2.0085260770975055
      },
      {
        "section": "purpose",
        "text": "Apprends à restituer les idées et les liens d’un texte sans le regarder. Cette méthode convient aux textes documentaires, aux présentations et à la préparation d’un examen.",
        "start": 2.558548752834467,
        "end": 11.32408163265306
      },
      {
        "section": "limit",
        "text": "Un résumé ne conserve pas tous les détails. Travaille séparément les chiffres ou les formulations exactes lorsqu’ils sont importants. Commence par un court passage et allonge-le lorsque tu sais l’expliquer.",
        "start": 11.674058956916099,
        "end": 24.921043083900226,
        "spokenText": "Un résumé ne conserve pas tous les détails. Travaille séparément les chiffres ou les formulations exactes lorsqu’ils sont importants. Commence par un court passage. Allonge ce passage quand tu peux en expliquer le sens."
      },
      {
        "section": "step-0",
        "text": "Lis un passage et clarifie les termes inconnus.",
        "start": 25.271020408163263,
        "end": 29.740861678004535,
        "spokenText": "Commence par lire un passage. Clarifie les termes inconnus."
      },
      {
        "section": "step-1",
        "text": "Découpe-le en idées et donne un titre court à chacune.",
        "start": 30.090839002267572,
        "end": 34.35170068027211,
        "spokenText": "Repère les idées du passage. Donne un titre court à chacune."
      },
      {
        "section": "step-2",
        "text": "Pose une question par partie : que se passe-t-il, pourquoi et avec quelles conséquences ?",
        "start": 34.70167800453515,
        "end": 39.78684807256236
      },
      {
        "section": "step-3",
        "text": "Cache le texte et réponds avec tes propres mots.",
        "start": 40.136825396825394,
        "end": 42.505260770975056
      },
      {
        "section": "step-4",
        "text": "Compare avec l’original. Corrige les idées manquantes et les liens erronés.",
        "start": 42.85523809523809,
        "end": 51.5859410430839,
        "spokenText": "Compare ton rappel avec le texte original. Ajoute les idées manquantes. Corrige les erreurs dans les liens entre les idées."
      },
      {
        "section": "step-5",
        "text": "Essaie de nouveau plus tard. Adapte l’intervalle à la qualité de ton rappel.",
        "start": 51.935918367346936,
        "end": 57.125578231292515,
        "spokenText": "Plus tard, recommence le rappel. Adapte le délai selon la qualité de ta réponse."
      },
      {
        "section": "example",
        "text": "Une ville plante des arbres le long d’une route très fréquentée. Leur feuillage apporte de l’ombre. L’eau qui s’évapore par les feuilles contribue au refroidissement. Pour rester en bonne santé pendant les périodes sèches, les arbres ont besoin de suffisamment d’eau et d’espace pour leurs racines.",
        "start": 57.47555555555555,
        "end": 77.80462585034013,
        "spokenText": "Une ville plante des arbres le long d’une route très fréquentée. Leur feuillage apporte de l’ombre. Les feuilles rejettent de l’eau par évaporation. Cette évaporation contribue au refroidissement. Pendant les périodes sèches, les arbres ont besoin de suffisamment d’eau. Leurs racines ont aussi besoin d’espace pour rester en bonne santé."
      },
      {
        "section": "explanation",
        "text": "Trois parties : l’action (planter des arbres), les effets (ombre et évaporation) et les conditions (eau et espace pour les racines). Ce plan conserve les liens entre les idées.",
        "start": 78.15460317460317,
        "end": 90.17092970521541,
        "spokenText": "On distingue trois parties. Premièrement, l’action : planter des arbres. Deuxièmement, les effets : l’ombre et l’évaporation. Troisièmement, les conditions : de l’eau et de l’espace pour les racines. Ce plan conserve les liens entre les idées."
      },
      {
        "section": "recall",
        "text": "Sans regarder le texte, explique l’action décrite, ses effets et ses conditions.",
        "start": 90.52090702947845,
        "end": 95.60607709750566
      },
      {
        "section": "transfer",
        "text": "Choisis un court texte documentaire. Prépare trois questions, mets le texte de côté et réponds. Augmente progressivement la longueur du passage.",
        "start": 95.9560544217687,
        "end": 104.60548752834467
      }
    ],
    "src": "/course-media/library/atta-text-meaning-fr-46fad85d9e34.m4a",
    "bytes": 1159779,
    "sha256": "46fad85d9e3461059cf2eed161887ecd742e70680e4b528796eb34f6b0446455",
    "synthesis": "kyutai-openvoice"
  },
  {
    "course": "text-verbatim",
    "coach": "rafael",
    "language": "fr",
    "duration": 85.03274376417232,
    "cues": [
      {
        "section": "title",
        "text": "Apprendre un texte mot pour mot",
        "start": 0.0,
        "end": 1.8692063492063493
      },
      {
        "section": "purpose",
        "text": "Travaille la formulation exacte d’un poème, d’une définition ou d’un court discours. Les petits mots et leur ordre comptent aussi.",
        "start": 2.4192290249433106,
        "end": 10.604263038548753
      },
      {
        "section": "limit",
        "text": "Réciter exactement ne prouve pas que tu as compris. Clarifie d’abord le sens. Des images mentales peuvent soutenir l’ordre des idées, mais elles ne remplacent pas le travail sur les mots.",
        "start": 10.954240362811792,
        "end": 20.683401360544217
      },
      {
        "section": "step-0",
        "text": "Comprends le texte et choisis un court passage cohérent.",
        "start": 21.033378684807253,
        "end": 24.899501133786845
      },
      {
        "section": "step-1",
        "text": "Lis-le attentivement et prononce-le clairement une fois.",
        "start": 25.249478458049882,
        "end": 31.00802721088435,
        "spokenText": "Commence par lire le passage attentivement. Prononce le passage clairement une fois."
      },
      {
        "section": "step-2",
        "text": "Cache-le, puis récite-le ou écris-le de mémoire.",
        "start": 31.358004535147387,
        "end": 34.364988662131516
      },
      {
        "section": "step-3",
        "text": "Compare mot à mot. Corrige les omissions, les inversions et les ajouts.",
        "start": 34.71496598639455,
        "end": 39.97428571428571
      },
      {
        "section": "step-4",
        "text": "Travaille le passage suivant, puis la transition entre les deux. Commence parfois au milieu.",
        "start": 40.32426303854875,
        "end": 45.653242630385485
      },
      {
        "section": "step-5",
        "text": "Essaie de nouveau plus tard sans modèle. Allonge le passage lorsque le rappel devient fiable.",
        "start": 46.00321995464852,
        "end": 51.552789115646256
      },
      {
        "section": "example",
        "text": "Le matin, j’ouvre la fenêtre. L’air frais entre dans la pièce. Ensuite, je commence ma journée.",
        "start": 51.90276643990929,
        "end": 57.77741496598639
      },
      {
        "section": "explanation",
        "text": "Les trois phrases forment trois unités de travail. Apprends la première, puis la deuxième et leur transition. Lors d’un autre essai, commence aussi par « L’air frais… ».",
        "start": 58.127392290249425,
        "end": 68.28612244897958,
        "spokenText": "Les trois phrases forment trois unités de travail. Apprends la première, puis la deuxième et leur transition. Au prochain essai, commence aussi par les mots : l’air frais."
      },
      {
        "section": "recall",
        "text": "Écris les trois phrases de mémoire en respectant leur formulation aussi précisément que possible.",
        "start": 68.63609977324262,
        "end": 75.35827664399092
      },
      {
        "section": "transfer",
        "text": "Choisis un court passage dont la formulation compte pour toi. Vérifie les mots dans l’original : une reformulation ne répond pas à cet objectif précis.",
        "start": 75.70825396825396,
        "end": 84.68276643990929
      }
    ],
    "src": "/course-media/library/atta-text-verbatim-fr-334d7bb4e457.m4a",
    "bytes": 906622,
    "sha256": "334d7bb4e457633092f20675012327d298324e26264673c4f7722d344dab487e",
    "synthesis": "kyutai-openvoice"
  },
  {
    "course": "story-method",
    "coach": "lin",
    "language": "en",
    "duration": 90.83746031746028,
    "cues": [
      {
        "start": 0.0,
        "end": 1.96,
        "text": "Welcome to ANITEW."
      },
      {
        "start": 2.5100226757369613,
        "end": 5.308027210884354,
        "text": "I am an AI-generated learning coach."
      },
      {
        "start": 5.658004535147392,
        "end": 8.130929705215419,
        "text": "Today we will explore the story method."
      },
      {
        "start": 8.480907029478457,
        "end": 14.87800453514739,
        "text": "The story method is a memory technique: you connect separate pieces of information in a single story."
      },
      {
        "start": 15.227981859410429,
        "end": 20.58018140589569,
        "text": "It can help you remember a sequence, such as a shopping list or the main points of a talk."
      },
      {
        "start": 20.930158730158727,
        "end": 23.87909297052154,
        "text": "It does not replace understanding the material."
      },
      {
        "start": 24.229070294784577,
        "end": 30.138548752834463,
        "text": "In this course, you will first learn the idea, see an example, and then try the method yourself."
      },
      {
        "start": 30.4885260770975,
        "end": 34.15727891156462,
        "text": "Your goal is to recall three words in the correct order."
      },
      {
        "start": 34.507256235827654,
        "end": 38.50108843537414,
        "text": "Our example is: key, lemon, bicycle."
      },
      {
        "start": 38.85106575963718,
        "end": 42.45015873015872,
        "text": "First, imagine a giant key squeezing a lemon."
      },
      {
        "start": 42.800136054421756,
        "end": 47.119047619047606,
        "text": "The lemon juice splashes onto a bicycle and makes its wheels turn."
      },
      {
        "start": 47.46902494331064,
        "end": 53.06503401360543,
        "text": "One action connects the first word to the second, and another connects the second to the third."
      },
      {
        "start": 53.415011337868464,
        "end": 56.526485260770954,
        "text": "The unusual story is simply a memory aid."
      },
      {
        "start": 56.87646258503399,
        "end": 60.394285714285694,
        "text": "What matters is imagining the actions clearly for yourself."
      },
      {
        "start": 60.74426303854873,
        "end": 62.903718820861656,
        "text": "Now the pictures will disappear."
      },
      {
        "start": 63.25369614512469,
        "end": 66.85278911564623,
        "text": "Pause here and name the three words in the correct order."
      },
      {
        "start": 67.20276643990927,
        "end": 69.91950113378682,
        "text": "When you are ready, reveal the answer."
      },
      {
        "start": 70.26947845804986,
        "end": 74.10077097505666,
        "text": "The words were: key, lemon, bicycle."
      },
      {
        "start": 74.4507482993197,
        "end": 78.92058956916097,
        "text": "If you missed a word, look at its connection again and have another try."
      },
      {
        "start": 79.270566893424,
        "end": 85.42385487528341,
        "text": "Finally, make up your own story with three different words and recall them without looking."
      },
      {
        "start": 85.77383219954645,
        "end": 90.48748299319725,
        "text": "You can also read the entire course and do every exercise at your own pace."
      }
    ],
    "src": "/course-media/library/lin-story-method-en-69ad7b51b243.m4a",
    "bytes": 1009218,
    "sha256": "69ad7b51b2432d299c1358f09366342c59e32505486fd4816ba23487004b8171",
    "synthesis": "qwen-openvoice"
  },
  {
    "course": "active-recall",
    "coach": "lin",
    "language": "en",
    "duration": 90.43138321995463,
    "cues": [
      {
        "section": "title",
        "text": "Active recall",
        "start": 0.0,
        "end": 1.195827664399093
      },
      {
        "section": "purpose",
        "text": "Try to retrieve information without looking at its source. This shows what you can bring to mind and what needs more work. Use it for facts, concepts and relationships.",
        "start": 1.7458503401360543,
        "end": 12.055510204081632
      },
      {
        "section": "limit",
        "text": "Recognising an answer while reading it does not mean you can retrieve it yourself. A failed attempt is not a final verdict: check and understand the correct answer, then try again. Repeated guessing without feedback can reinforce errors.",
        "start": 12.40548752834467,
        "end": 26.244580498866213
      },
      {
        "section": "step-0",
        "text": "Choose a small piece of information you understand.",
        "start": 26.59455782312925,
        "end": 29.787301587301585
      },
      {
        "section": "step-1",
        "text": "Ask a clear question that the material answers.",
        "start": 30.13727891156462,
        "end": 33.492562358276636
      },
      {
        "section": "step-2",
        "text": "Put the source away and answer before checking.",
        "start": 33.84253968253967,
        "end": 36.640544217687065
      },
      {
        "section": "step-3",
        "text": "Compare with the original. Correct missing or mistaken parts.",
        "start": 36.9905215419501,
        "end": 41.37909297052153
      },
      {
        "section": "step-4",
        "text": "Hide the answer and try retrieving it again.",
        "start": 41.72907029478457,
        "end": 44.44580498866212
      },
      {
        "section": "step-5",
        "text": "Test yourself later as well. Immediate repetition may feel easy without showing lasting retention.",
        "start": 44.795782312925155,
        "end": 50.867800453514725
      },
      {
        "section": "example",
        "text": "Question: Why can evaporating water cool a surface?\nAnswer: Evaporation requires energy. That energy is taken from the surface and its surroundings as heat.",
        "start": 51.21777777777776,
        "end": 62.09632653061223
      },
      {
        "section": "explanation",
        "text": "Read and understand the answer first. Then hide it and answer the question yourself. “Water cools” alone does not explain the relationship: the energy requirement and heat transfer matter.",
        "start": 62.44630385487527,
        "end": 73.08104308390021
      },
      {
        "section": "recall",
        "text": "Why can evaporating water cool a surface? Explain without looking.",
        "start": 73.43102040816325,
        "end": 77.90086167800452
      },
      {
        "section": "transfer",
        "text": "Write a specific question about your own material. Answer without looking, compare afterwards, then try again later. ANITEW also uses retrieval attempts in its training sessions.",
        "start": 78.25083900226755,
        "end": 90.08140589569159
      }
    ],
    "src": "/course-media/library/lin-active-recall-en-554a9b4a17fd.m4a",
    "bytes": 1049643,
    "sha256": "554a9b4a17fd1700197e41ce0e56651098494a8aa35d2d496d9bd926fb13aa84",
    "synthesis": "qwen-openvoice"
  },
  {
    "course": "interleaved-practice",
    "coach": "lin",
    "language": "en",
    "duration": 94.89954648526076,
    "cues": [
      {
        "section": "title",
        "text": "Choose between related approaches",
        "start": 0.0,
        "end": 2.159455782312925
      },
      {
        "section": "purpose",
        "text": "Mix related types of tasks and choose the appropriate approach yourself. This practises selecting a method as well as applying it.",
        "start": 2.7094784580498863,
        "end": 9.988934240362811
      },
      {
        "section": "limit",
        "text": "First learn new approaches through clear examples. Random topic switching or multitasking is different. Benefits depend on the material and your prior knowledge.",
        "start": 10.33891156462585,
        "end": 19.696553287981857
      },
      {
        "section": "step-0",
        "text": "Understand each approach separately first.",
        "start": 20.046530612244894,
        "end": 22.681995464852605
      },
      {
        "section": "step-1",
        "text": "Then mix a few related task types.",
        "start": 23.031972789115642,
        "end": 25.667437641723353
      },
      {
        "section": "step-2",
        "text": "Before answering, identify the type and explain your choice.",
        "start": 26.01741496598639,
        "end": 30.568526077097502
      },
      {
        "section": "step-3",
        "text": "Solve the task and check your choice and result separately.",
        "start": 30.91850340136054,
        "end": 34.58725623582766
      },
      {
        "section": "step-4",
        "text": "Work on errors specifically, then return to mixed practice.",
        "start": 34.9372335600907,
        "end": 39.1748752834467
      },
      {
        "section": "example",
        "text": "Rectangle: area = length × width. Triangle: area = base × corresponding height ÷ 2. A rectangle 4 cm long and 3 cm wide has an area of 12 cm². A triangle with base 4 cm and corresponding height 3 cm has an area of 6 cm².",
        "start": 39.52485260770974,
        "end": 60.56213151927437
      },
      {
        "section": "explanation",
        "text": "Identical numbers do not imply identical calculations. The shape determines the rule: the triangle needs the factor one half. Mixed tasks require recognising the type before applying a rule.",
        "start": 60.9121088435374,
        "end": 72.6614058956916
      },
      {
        "section": "recall",
        "text": "Task A: a triangle with base 6 cm and corresponding height 4 cm. Task B: a rectangle 6 cm long and 4 cm wide. Give the rule and area for each.",
        "start": 73.01138321995464,
        "end": 86.60666666666665
      },
      {
        "section": "transfer",
        "text": "Choose two or three related task types you have already studied. Mix them and explain which approach fits before solving each one.",
        "start": 86.95664399092969,
        "end": 94.54956916099772
      }
    ],
    "src": "/course-media/library/lin-interleaved-practice-en-7e1de0edb027.m4a",
    "bytes": 1133641,
    "sha256": "7e1de0edb02780fa660b3d5f79cb7b28c6de63b3fcd2fdadbd84c4b3792d6033",
    "synthesis": "qwen-openvoice"
  },
  {
    "course": "keyword-method",
    "coach": "lin",
    "language": "en",
    "duration": 84.91496598639453,
    "cues": [
      {
        "section": "title",
        "text": "Connect vocabulary through keywords",
        "start": 0.0,
        "end": 2.5541950113378684
      },
      {
        "section": "purpose",
        "text": "A familiar word with a similar sound can provide a bridge to a foreign word’s meaning. Connect the keyword and the meaning in an image, then check the actual word.",
        "start": 3.1042176870748297,
        "end": 12.461859410430838
      },
      {
        "section": "limit",
        "text": "A similar sound is not the correct pronunciation. Some words offer no useful keyword. Check pronunciation, spelling and use in a sentence separately.",
        "start": 12.811836734693877,
        "end": 22.250748299319728
      },
      {
        "section": "step-0",
        "text": "Check the new word’s meaning and correct pronunciation.",
        "start": 22.600725623582765,
        "end": 26.350748299319726
      },
      {
        "section": "step-1",
        "text": "Find a familiar word with a similar sound.",
        "start": 26.700725623582763,
        "end": 29.579999999999995
      },
      {
        "section": "step-2",
        "text": "Imagine a clear connection between that keyword and the meaning.",
        "start": 29.92997732426303,
        "end": 33.203990929705206
      },
      {
        "section": "step-3",
        "text": "Retrieve the meaning from the word, then the word from its meaning.",
        "start": 33.55396825396824,
        "end": 37.79160997732425
      },
      {
        "section": "step-4",
        "text": "Check the original pronunciation, spelling and an example sentence.",
        "start": 38.141587301587286,
        "end": 42.460498866213136
      },
      {
        "section": "example",
        "text": "French: pain = bread. Example: Je mange du pain. = I eat bread.",
        "start": 42.81047619047617,
        "end": 50.647210884353726
      },
      {
        "section": "explanation",
        "text": "The English word “pan” can be a rough sound cue: imagine bread leaping out of a pan. French pain has a nasal vowel and is not pronounced like English pan or pain. The cue is a memory bridge, not a pronunciation model.",
        "start": 50.99718820861676,
        "end": 66.0321088435374
      },
      {
        "section": "recall",
        "text": "Which French word means bread? Write the word, its meaning and the example sentence from memory.",
        "start": 66.38208616780044,
        "end": 72.94172335600905
      },
      {
        "section": "transfer",
        "text": "Try a word you actually need. Test the reverse direction too: can you retrieve the foreign form from its meaning? If the keyword confuses you, change the bridge or use direct retrieval.",
        "start": 73.29170068027209,
        "end": 84.5649886621315
      }
    ],
    "src": "/course-media/library/lin-keyword-method-en-2a77dfa2609c.m4a",
    "bytes": 966685,
    "sha256": "2a77dfa2609c39a197a97475f0af20857c60752b204f50338dedffde24920cca",
    "synthesis": "qwen-openvoice"
  },
  {
    "course": "long-words",
    "coach": "lin",
    "language": "en",
    "duration": 82.54820861678003,
    "cues": [
      {
        "section": "title",
        "text": "Remember long words",
        "start": 0.0,
        "end": 1.5905668934240362
      },
      {
        "section": "purpose",
        "text": "Break a long word into meaningful parts, put them together again and practise its meaning, pronunciation and spelling.",
        "start": 2.1405895691609977,
        "end": 9.338775510204082
      },
      {
        "section": "limit",
        "text": "Meaningful parts are not always spoken syllables. Some technical terms are unfamiliar throughout. Check their meaning and pronunciation before practising.",
        "start": 9.68875283446712,
        "end": 19.27859410430839
      },
      {
        "section": "step-0",
        "text": "Clarify the meaning of the whole word.",
        "start": 19.628571428571426,
        "end": 22.020226757369613
      },
      {
        "section": "step-1",
        "text": "Identify familiar parts and explain what they contribute.",
        "start": 22.37020408163265,
        "end": 25.969297052154193
      },
      {
        "section": "step-2",
        "text": "Notice spelling changes and connecting elements.",
        "start": 26.31927437641723,
        "end": 29.512018140589564
      },
      {
        "section": "step-3",
        "text": "Say the parts slowly, then say the whole word fluently. Syllable boundaries may differ from meaning boundaries.",
        "start": 29.8619954648526,
        "end": 37.454920634920626
      },
      {
        "section": "step-4",
        "text": "Hide the example, write the whole word and explain it.",
        "start": 37.80489795918366,
        "end": 41.55492063492063
      },
      {
        "section": "step-5",
        "text": "Check spelling and meaning. Practise uncertain parts, then put the whole word together again.",
        "start": 41.904897959183664,
        "end": 48.22072562358276
      },
      {
        "section": "example",
        "text": "unpredictability",
        "start": 48.570702947845795,
        "end": 50.161269841269835
      },
      {
        "section": "explanation",
        "text": "un | predict | ability: the quality of being difficult or impossible to predict. The final e of “predictable” does not remain in “unpredictability”. These are useful meaning units, not a pronunciation guide.",
        "start": 50.51124716553287,
        "end": 65.66226757369614
      },
      {
        "section": "recall",
        "text": "Write the complete word from memory. Then explain its meaning aloud and say it fluently.",
        "start": 66.01224489795918,
        "end": 71.85206349206348
      },
      {
        "section": "transfer",
        "text": "Choose a long word relevant to your life. Find meaningful parts, then practise the whole word. Use the word formation and pronunciation rules of its language.",
        "start": 72.20204081632652,
        "end": 82.198231292517
      }
    ],
    "src": "/course-media/library/lin-long-words-en-b29a91de354e.m4a",
    "bytes": 928749,
    "sha256": "b29a91de354e0cb2f3e7c02e28746ed4bf8f24a92fa55a1b624a9702d55133c6",
    "synthesis": "qwen-openvoice"
  },
  {
    "course": "meaningful-groups",
    "coach": "lin",
    "language": "en",
    "duration": 93.77505668934238,
    "cues": [
      {
        "section": "title",
        "text": "Build meaningful groups",
        "start": 0.0,
        "end": 1.5905668934240362
      },
      {
        "section": "purpose",
        "text": "Organise individual pieces of information into meaningful groups. A useful structure can help you see the material clearly and search for it systematically during recall.",
        "start": 2.1405895691609977,
        "end": 11.649160997732427
      },
      {
        "section": "limit",
        "text": "Grouping alone does not guarantee complete recall. The groups must make sense to you; a heading does not explain unfamiliar technical terms. If the original order matters, practise that separately.",
        "start": 11.999138321995465,
        "end": 23.59750566893424
      },
      {
        "section": "step-0",
        "text": "Clarify your goal: the content, its order, or both.",
        "start": 23.947482993197276,
        "end": 28.417324263038545
      },
      {
        "section": "step-1",
        "text": "Look for shared features or relationships.",
        "start": 28.76730158730158,
        "end": 31.565306122448973
      },
      {
        "section": "step-2",
        "text": "Create a few manageable groups with informative headings.",
        "start": 31.91528344671201,
        "end": 35.18929705215419
      },
      {
        "section": "step-3",
        "text": "Explain why each item belongs in its group.",
        "start": 35.539274376417225,
        "end": 38.488208616780035
      },
      {
        "section": "step-4",
        "text": "Hide the source. Recall the groups first, then their contents.",
        "start": 38.83818594104307,
        "end": 43.2267573696145
      },
      {
        "section": "step-5",
        "text": "Compare with the original, correct missing items and try again later.",
        "start": 43.57673469387754,
        "end": 48.45292517006801
      },
      {
        "section": "example",
        "text": "Apple · hammer · shirt · pear · saw · jacket · banana · pliers · trousers",
        "start": 48.80290249433105,
        "end": 56.6396371882086
      },
      {
        "section": "explanation",
        "text": "One possible structure: fruit (apple, pear, banana), tools (hammer, saw, pliers), clothing (shirt, jacket, trousers). The headings provide search cues. This exercise asks you to remember all nine items; their original order is not the learning goal.",
        "start": 56.98961451247164,
        "end": 75.3798185941043
      },
      {
        "section": "recall",
        "text": "Recall the three groups and as many of the nine items as possible without looking. The order within a group is up to you.",
        "start": 75.72979591836733,
        "end": 82.60290249433105
      },
      {
        "section": "transfer",
        "text": "Organise your own passage by ideas or a list by meaningful categories. Do not invent groups just to reach a particular number. Check the full content as well as the headings.",
        "start": 82.95287981859408,
        "end": 93.42507936507934
      }
    ],
    "src": "/course-media/library/lin-meaningful-groups-en-88d951948653.m4a",
    "bytes": 1081063,
    "sha256": "88d951948653bdb887adca5a08f2797ae4100f0a8ea63763f53f9f2c6688e9ff",
    "synthesis": "qwen-openvoice"
  },
  {
    "course": "method-of-loci",
    "coach": "lin",
    "language": "en",
    "duration": 79.86462585034012,
    "cues": [
      {
        "section": "title",
        "text": "Use places as memory cues",
        "start": 0.0,
        "end": 2.159455782312925
      },
      {
        "section": "purpose",
        "text": "In the method of loci, you place imagined content at fixed locations along a familiar route. Walking the route in your mind provides cues for retrieving it.",
        "start": 2.7094784580498863,
        "end": 12.148390022675738
      },
      {
        "section": "limit",
        "text": "Learn a stable route first. Similar images at the same location can be confused. Locations support structure and order, not automatically exact wording.",
        "start": 12.498367346938776,
        "end": 21.937278911564626
      },
      {
        "section": "step-0",
        "text": "Choose a familiar route with clearly distinct locations.",
        "start": 22.287256235827662,
        "end": 25.56126984126984
      },
      {
        "section": "step-1",
        "text": "Fix their order and rehearse the route without learning material.",
        "start": 25.911247165532878,
        "end": 29.51034013605442
      },
      {
        "section": "step-2",
        "text": "Connect one item to each location through a vivid imagined event.",
        "start": 29.860317460317457,
        "end": 34.33015873015873
      },
      {
        "section": "step-3",
        "text": "Walk the route without looking and name the items.",
        "start": 34.680136054421766,
        "end": 37.629070294784576
      },
      {
        "section": "step-4",
        "text": "Compare your recall and improve confusing locations or weak images.",
        "start": 37.97904761904761,
        "end": 42.21668934240362
      },
      {
        "section": "example",
        "text": "Example route: front door → shoe rack → kitchen table. Items: bread → soap → candle.",
        "start": 42.566666666666656,
        "end": 50.56594104308389
      },
      {
        "section": "explanation",
        "text": "A giant loaf blocks the front door. The shoe rack overflows with soap foam. A candle glows on the kitchen table. This is only an example route; use a genuinely familiar route for your own learning.",
        "start": 50.915918367346926,
        "end": 63.79138321995464
      },
      {
        "section": "recall",
        "text": "Mentally visit the three locations. Write the item associated with each location.",
        "start": 64.14136054421768,
        "end": 69.65609977324262
      },
      {
        "section": "transfer",
        "text": "Use the app’s existing memory palace to create a familiar route or use an available one. Start with a few locations and check that you can clearly distinguish them.",
        "start": 70.00607709750565,
        "end": 79.51464852607708
      }
    ],
    "src": "/course-media/library/lin-method-of-loci-en-6cf01f4b09fc.m4a",
    "bytes": 921907,
    "sha256": "6cf01f4b09fc31899b386ce2018033b89537b3ba6c4a0962b0bb72ae6bbad9e0",
    "synthesis": "qwen-openvoice"
  },
  {
    "course": "number-images",
    "coach": "lin",
    "language": "en",
    "duration": 78.0186394557823,
    "cues": [
      {
        "section": "title",
        "text": "Turn numbers into images",
        "start": 0.0,
        "end": 1.9969160997732427
      },
      {
        "section": "purpose",
        "text": "The Major System assigns consonant sounds to digits. Use them to form a word and imagine an image that can be decoded back into the number.",
        "start": 2.546938775510204,
        "end": 10.546213151927438
      },
      {
        "section": "limit",
        "text": "Learn the mappings first. An image that cannot be decoded reliably does not help exact number recall. This introduction uses two digits; the existing Major lessons teach further mappings.",
        "start": 10.896190476190476,
        "end": 22.72675736961451
      },
      {
        "section": "step-0",
        "text": "Learn a few fixed digit-to-sound pairs first.",
        "start": 23.076734693877547,
        "end": 25.95600907029478
      },
      {
        "section": "step-1",
        "text": "Read the sounds in the order of the digits.",
        "start": 26.305986394557817,
        "end": 28.860181405895684
      },
      {
        "section": "step-2",
        "text": "Add vowels to form a concrete word.",
        "start": 29.21015873015872,
        "end": 31.683083900226748
      },
      {
        "section": "step-3",
        "text": "Check whether the word contains additional consonant sounds that would encode extra digits.",
        "start": 32.033061224489785,
        "end": 37.30399092970521
      },
      {
        "section": "step-4",
        "text": "Retrieve the word from the image and decode its sounds back into the number.",
        "start": 37.653968253968245,
        "end": 41.64780045351473
      },
      {
        "section": "example",
        "text": "1 → t/d; 2 → n. The number 12 can become an image of a tin: t + n.",
        "start": 41.99777777777777,
        "end": 49.75324263038548
      },
      {
        "section": "explanation",
        "text": "The vowel does not count here. In the reverse direction, t gives 1 and n gives 2, recovering 12. The sound pattern matters, not merely the written letters.",
        "start": 50.103219954648516,
        "end": 61.62031746031745
      },
      {
        "section": "recall",
        "text": "Which number does the image of a tin encode? Explain the reverse path through the two consonant sounds.",
        "start": 61.97029478458049,
        "end": 67.72884353741496
      },
      {
        "section": "transfer",
        "text": "Practise further fixed mappings in the existing Major lessons before tackling longer numbers. Check that every image you create decodes to the exact intended number.",
        "start": 68.078820861678,
        "end": 77.66866213151927
      }
    ],
    "src": "/course-media/library/lin-number-images-en-d3c8d1eae084.m4a",
    "bytes": 920142,
    "sha256": "d3c8d1eae08490dcd5efbe3d67c0ffb4b283b8b2c4ccd27284a64deb521bdec5",
    "synthesis": "qwen-openvoice"
  },
  {
    "course": "self-explanation",
    "coach": "lin",
    "language": "en",
    "duration": 96.58467120181405,
    "cues": [
      {
        "section": "title",
        "text": "Explain relationships yourself",
        "start": 0.0,
        "end": 1.8343764172335602
      },
      {
        "section": "purpose",
        "text": "Explain in your own words why a step makes sense or how two statements relate. This can reveal gaps in understanding that are easy to miss while reading.",
        "start": 2.3843990929705217,
        "end": 11.254421768707484
      },
      {
        "section": "limit",
        "text": "A fluent explanation can still be wrong. Check it against a reliable source and acknowledge uncertainty. This method supports practice; it does not replace subject knowledge or checking your explanation.",
        "start": 11.604399092970523,
        "end": 22.71514739229025
      },
      {
        "section": "step-0",
        "text": "Choose a manageable relationship you want to understand.",
        "start": 23.065124716553285,
        "end": 26.09532879818594
      },
      {
        "section": "step-1",
        "text": "Ask why the step follows, what stays the same and what would change under different conditions.",
        "start": 26.445306122448976,
        "end": 31.96004535147392
      },
      {
        "section": "step-2",
        "text": "Formulate an explanation without copying the source.",
        "start": 32.31002267573696,
        "end": 35.58403628117914
      },
      {
        "section": "step-3",
        "text": "Compare it with the original reasoning. Separate established facts from guesses.",
        "start": 35.934013605442175,
        "end": 41.123673469387754
      },
      {
        "section": "step-4",
        "text": "Correct gaps and apply your explanation to a similar example.",
        "start": 41.47365079365079,
        "end": 45.63002267573696
      },
      {
        "section": "step-5",
        "text": "Explain the relationship again later without looking.",
        "start": 45.98,
        "end": 49.254013605442175
      },
      {
        "section": "example",
        "text": "Three quarters equals six eighths: 3/4 = 6/8. Halving each of four equal parts creates eight equal parts. The three selected quarters now consist of six eighths. The selected amount stays the same.",
        "start": 49.60399092970521,
        "end": 62.72326530612244
      },
      {
        "section": "explanation",
        "text": "“Multiply the top and bottom by two” describes a rule. Halving the equal parts explains why the value does not change. To transfer the idea, consider why 2/3 and 4/6 describe the same proportion.",
        "start": 63.07324263038548,
        "end": 75.78616780045351
      },
      {
        "section": "recall",
        "text": "Explain without looking why 3/4 and 6/8 are equal. Then apply your reasoning to 2/3 and 4/6.",
        "start": 76.13614512471655,
        "end": 82.84671201814058
      },
      {
        "section": "transfer",
        "text": "Choose a step in your learning material and explain why it holds. Find a similar example and check your explanation with it. If you cannot verify the reasoning reliably, record the open question instead of pretending to be certain.",
        "start": 83.19668934240362,
        "end": 96.23469387755101
      }
    ],
    "src": "/course-media/library/lin-self-explanation-en-66cb885a457a.m4a",
    "bytes": 1153114,
    "sha256": "66cb885a457ad81c3f1149767fe15956b6591cde9e82f0973cd00c1edc0935b3",
    "synthesis": "qwen-openvoice"
  },
  {
    "course": "spaced-practice",
    "coach": "lin",
    "language": "en",
    "duration": 106.49959183673468,
    "cues": [
      {
        "section": "title",
        "text": "Spaced practice",
        "start": 0.0,
        "end": 1.509297052154195
      },
      {
        "section": "purpose",
        "text": "Spread retrieval attempts over time. This tests retention after a delay rather than simply repeating an answer immediately after reading it.",
        "start": 2.0593197278911566,
        "end": 10.615873015873017
      },
      {
        "section": "limit",
        "text": "No single interval suits every person and topic. Difficulty, prior knowledge and the desired retention period matter. This short exercise explains the approach; lasting retention can only be checked with later attempts.",
        "start": 10.965850340136056,
        "end": 24.47986394557823
      },
      {
        "section": "step-0",
        "text": "Learn a manageable piece of information and retrieve it once without looking.",
        "start": 24.829841269841268,
        "end": 29.787301587301585
      },
      {
        "section": "step-1",
        "text": "Plan another retrieval attempt after a delay.",
        "start": 30.13727891156462,
        "end": 33.330022675736956
      },
      {
        "section": "step-2",
        "text": "Try answering before you reveal the solution.",
        "start": 33.67999999999999,
        "end": 36.478004535147385
      },
      {
        "section": "step-3",
        "text": "After an error, clarify the meaning, correct it and retrieve again. Shorten the next interval if retrieval was too difficult.",
        "start": 36.82798185941042,
        "end": 45.77927437641722
      },
      {
        "section": "step-4",
        "text": "As retrieval becomes reliable, the next interval can increase.",
        "start": 46.12925170068026,
        "end": 50.599092970521525
      },
      {
        "section": "step-5",
        "text": "ANITEW already schedules reviews for stored training items. Follow the due reviews instead of keeping a competing schedule.",
        "start": 50.94907029478456,
        "end": 57.740907029478436
      },
      {
        "section": "example",
        "text": "Mira learns a new concept and explains it without looking. After a break she tries again and finds a gap. She compares with the correct explanation, fixes the gap and schedules the next attempt sooner. Only after reliable retrieval does she increase the interval.",
        "start": 58.09088435374147,
        "end": 73.20707482993195
      },
      {
        "section": "explanation",
        "text": "The delay and the retrieval attempt matter. Reading ten times in a row cannot replace a later retrieval attempt. The error tells Mira what to revisit and helps her adjust the interval.",
        "start": 73.55705215419499,
        "end": 83.94798185941042
      },
      {
        "section": "recall",
        "text": "Describe Mira’s approach: what does she do before checking? How does she respond to the gap? When can she increase the interval?",
        "start": 84.29795918367346,
        "end": 93.08671201814057
      },
      {
        "section": "transfer",
        "text": "Use the due reviews for your stored training items. For material outside the app, plan a later self-test and adjust the interval to actual retrieval. Completing this reading course does not create new review cards.",
        "start": 93.43668934240361,
        "end": 106.14961451247164
      }
    ],
    "src": "/course-media/library/lin-spaced-practice-en-6dedd16106ad.m4a",
    "bytes": 1264983,
    "sha256": "6dedd16106ad075aa2ebe219b88e695a3f853eccd6d7af7bcd1f488496267331",
    "synthesis": "qwen-openvoice"
  },
  {
    "course": "text-meaning",
    "coach": "lin",
    "language": "en",
    "duration": 88.03972789115645,
    "cues": [
      {
        "section": "title",
        "text": "Remember the meaning of long texts",
        "start": 0.0,
        "end": 1.9969160997732427
      },
      {
        "section": "purpose",
        "text": "Learn to recall the ideas and relationships in a text without looking. Use this for factual reading, presentations and exam preparation.",
        "start": 2.546938775510204,
        "end": 11.335691609977324
      },
      {
        "section": "limit",
        "text": "A summary does not preserve every detail. Practise exact numbers or wording separately when needed. Start with a short passage and increase its length after you can explain it.",
        "start": 11.685668934240363,
        "end": 21.84439909297052
      },
      {
        "section": "step-0",
        "text": "Read a passage and clarify unfamiliar terms.",
        "start": 22.194376417233556,
        "end": 25.468390022675734
      },
      {
        "section": "step-1",
        "text": "Group it by ideas and give each group a short heading.",
        "start": 25.81836734693877,
        "end": 29.336190476190474
      },
      {
        "section": "step-2",
        "text": "Ask a question for each part: what happens, why, and with what result?",
        "start": 29.68616780045351,
        "end": 34.72489795918367
      },
      {
        "section": "step-3",
        "text": "Hide the source and answer in your own words.",
        "start": 35.07487528344671,
        "end": 38.186349206349206
      },
      {
        "section": "step-4",
        "text": "Compare with the original. Correct missing ideas and mistaken connections.",
        "start": 38.53632653061224,
        "end": 43.49378684807256
      },
      {
        "section": "step-5",
        "text": "Recall it again later. Adjust the interval to how reliably you remember.",
        "start": 43.8437641723356,
        "end": 49.11469387755102
      },
      {
        "section": "example",
        "text": "A town plants trees beside a busy road. Their crowns provide shade. Water evaporates through the leaves and contributes to cooling. To remain healthy during dry weather, the trees need enough water and room for their roots.",
        "start": 49.464671201814056,
        "end": 63.05995464852607
      },
      {
        "section": "explanation",
        "text": "Three groups: action (planting trees), effects (shade and evaporation), and requirements (water and root space). The outline preserves their relationship.",
        "start": 63.40993197278911,
        "end": 73.40612244897959
      },
      {
        "section": "recall",
        "text": "Without looking, explain the action, how it works and what it requires.",
        "start": 73.75609977324262,
        "end": 78.55102040816325
      },
      {
        "section": "transfer",
        "text": "Choose a short factual text of your own. Write three guiding questions, put the text away and answer them. Gradually increase the length.",
        "start": 78.90099773242629,
        "end": 87.68975056689341
      }
    ],
    "src": "/course-media/library/lin-text-meaning-en-6f28a8684ba5.m4a",
    "bytes": 1015585,
    "sha256": "6f28a8684ba5984f337c09211c419c3941e79c1691d04245a64c552a01c38b3d",
    "synthesis": "qwen-openvoice"
  },
  {
    "course": "text-verbatim",
    "coach": "lin",
    "language": "en",
    "duration": 76.88253968253966,
    "cues": [
      {
        "section": "title",
        "text": "Learn a text word for word",
        "start": 0.0,
        "end": 2.3103854875283445
      },
      {
        "section": "purpose",
        "text": "Practise exact wording for a poem, definition or short speech. Small words and their order matter too.",
        "start": 2.860408163265306,
        "end": 10.29079365079365
      },
      {
        "section": "limit",
        "text": "Exact recall does not prove understanding. Clarify the meaning first. Mental images may support the order of ideas but cannot replace practice of the actual wording.",
        "start": 10.64077097505669,
        "end": 21.19424036281179
      },
      {
        "section": "step-0",
        "text": "Understand the text and choose a short meaningful passage.",
        "start": 21.544217687074827,
        "end": 24.73696145124716
      },
      {
        "section": "step-1",
        "text": "Read it carefully and say it clearly once.",
        "start": 25.0869387755102,
        "end": 28.198412698412692
      },
      {
        "section": "step-2",
        "text": "Hide it and say or write it from memory.",
        "start": 28.54839002267573,
        "end": 31.183854875283437
      },
      {
        "section": "step-3",
        "text": "Compare word for word. Correct omissions, changes in order and added words.",
        "start": 31.533832199546474,
        "end": 37.44331065759636
      },
      {
        "section": "step-4",
        "text": "Practise the next passage, then the transition between them. Sometimes start in the middle.",
        "start": 37.7932879818594,
        "end": 43.14548752834466
      },
      {
        "section": "step-5",
        "text": "Recall it again later without looking. Extend the passage after the current part becomes reliable.",
        "start": 43.4954648526077,
        "end": 49.404943310657586
      },
      {
        "section": "example",
        "text": "In the morning I open the window. Fresh air flows into the room. Then I begin my day.",
        "start": 49.75492063492062,
        "end": 55.66439909297051
      },
      {
        "section": "explanation",
        "text": "The three sentences form three practice units. Learn the first, then the second and their transition. Start a later attempt at “Fresh air …” as well.",
        "start": 56.01437641723355,
        "end": 64.7334693877551
      },
      {
        "section": "recall",
        "text": "Write the three sentences as accurately as you can from memory.",
        "start": 65.08344671201813,
        "end": 68.75219954648524
      },
      {
        "section": "transfer",
        "text": "Choose a short passage whose wording matters to you. Compare it with its source yourself; a paraphrase does not meet this particular goal.",
        "start": 69.10217687074828,
        "end": 76.53256235827662
      }
    ],
    "src": "/course-media/library/lin-text-verbatim-en-ca60f82e8c04.m4a",
    "bytes": 889663,
    "sha256": "ca60f82e8c04175a033d9852c0f8d3f02df1edb5cfc18306de93e8302ddcfcb5",
    "synthesis": "qwen-openvoice"
  },
  {
    "course": "story-method",
    "coach": "lin",
    "language": "fr",
    "duration": 82.93714285714283,
    "cues": [
      {
        "start": 0.0,
        "end": 1.8499773242630386,
        "text": "Bienvenue sur ANITEW."
      },
      {
        "start": 2.4,
        "end": 5.465034013605442,
        "text": "Je suis un coach pédagogique créé par intelligence artificielle."
      },
      {
        "start": 5.815011337868481,
        "end": 9.089024943310658,
        "text": "Aujourd'hui, nous allons découvrir la méthode des histoires."
      },
      {
        "start": 9.439002267573697,
        "end": 14.930521541950114,
        "text": "La méthode des histoires est une technique de mémorisation : elle relie plusieurs informations dans une même histoire."
      },
      {
        "start": 15.280498866213152,
        "end": 22.15360544217687,
        "text": "Elle peut aider à retenir un ordre, par exemple une liste de courses ou les points principaux d'un exposé."
      },
      {
        "start": 22.50358276643991,
        "end": 24.930068027210883,
        "text": "Elle ne remplace pas la compréhension du contenu."
      },
      {
        "start": 25.28004535147392,
        "end": 31.770022675736957,
        "text": "Dans ce cours, tu découvriras le principe, tu verras un exemple, puis tu essaieras la méthode toi-même."
      },
      {
        "start": 32.12,
        "end": 34.75546485260771,
        "text": "Ton objectif : retrouver trois mots dans le bon ordre."
      },
      {
        "start": 35.105442176870746,
        "end": 38.30979591836734,
        "text": "Voici notre exemple : clé, citron, vélo."
      },
      {
        "start": 38.65977324263038,
        "end": 42.514285714285705,
        "text": "Imagine d'abord une clé géante qui presse un citron."
      },
      {
        "start": 42.86426303854874,
        "end": 46.498185941043076,
        "text": "Le jus de citron éclabousse un vélo et fait tourner ses roues."
      },
      {
        "start": 46.84816326530611,
        "end": 51.77079365079364,
        "text": "Une action relie le premier mot au deuxième, puis une autre relie le deuxième au troisième."
      },
      {
        "start": 52.12077097505668,
        "end": 54.825895691609965,
        "text": "Cette histoire inhabituelle sert simplement d'aide-mémoire."
      },
      {
        "start": 55.175873015873,
        "end": 58.17124716553287,
        "text": "L'essentiel est de te représenter clairement les actions."
      },
      {
        "start": 58.521224489795905,
        "end": 60.51814058956915,
        "text": "Les images vont maintenant disparaître."
      },
      {
        "start": 60.86811791383219,
        "end": 63.5035827664399,
        "text": "Fais une pause et retrouve les trois mots dans le bon ordre."
      },
      {
        "start": 63.853560090702935,
        "end": 66.2219954648526,
        "text": "Quand tu es prêt, affiche la réponse."
      },
      {
        "start": 66.57197278911563,
        "end": 69.27709750566892,
        "text": "Les mots étaient : clé, citron, vélo."
      },
      {
        "start": 69.62707482993196,
        "end": 73.62090702947845,
        "text": "Si tu as oublié un mot, revois le lien correspondant et essaie à nouveau."
      },
      {
        "start": 73.97088435374148,
        "end": 79.10249433106574,
        "text": "Pour terminer, invente une histoire avec trois autres mots, puis retrouve-les sans regarder."
      },
      {
        "start": 79.45247165532878,
        "end": 82.5871655328798,
        "text": "Tu peux aussi lire tout le cours et faire chaque exercice à ton rythme."
      }
    ],
    "src": "/course-media/library/lin-story-method-fr-0265553f6e57.m4a",
    "bytes": 888025,
    "sha256": "0265553f6e572169fba5dc5f1fff49c0424bb482bce0400d7605a4f1536b0dd0",
    "synthesis": "kyutai-openvoice"
  },
  {
    "course": "active-recall",
    "coach": "lin",
    "language": "fr",
    "duration": 94.34394557823124,
    "cues": [
      {
        "section": "title",
        "text": "Pratiquer le rappel actif",
        "start": 0.0,
        "end": 1.799546485260771
      },
      {
        "section": "purpose",
        "text": "Essaie de retrouver une information sans regarder sa source. Tu distingues ainsi ce que tu peux rappeler toi-même de ce qui demande encore du travail. Cette méthode s’applique aux faits, aux notions et aux relations.",
        "start": 2.3495691609977323,
        "end": 15.294693877551019,
        "spokenText": "Essaie de retrouver une information sans regarder sa source. Tu distingues ainsi deux choses : ce que tu peux rappeler toi-même, et ce qui demande encore du travail. Cette méthode s’applique aux faits, aux notions et aux relations."
      },
      {
        "section": "limit",
        "text": "Reconnaître une réponse en la lisant ne signifie pas savoir la retrouver. Un échec n’est pas un verdict : vérifie et comprends la bonne réponse, puis réessaie. Deviner plusieurs fois sans correction peut renforcer des erreurs.",
        "start": 15.644671201814058,
        "end": 28.369206349206348
      },
      {
        "section": "step-0",
        "text": "Choisis une petite quantité d’information que tu comprends.",
        "start": 28.719183673469384,
        "end": 31.586848072562354
      },
      {
        "section": "step-1",
        "text": "Pose une question précise à laquelle le contenu permet de répondre.",
        "start": 31.93682539682539,
        "end": 36.02353741496598
      },
      {
        "section": "step-2",
        "text": "Écarte la source et réponds avant de vérifier.",
        "start": 36.373514739229016,
        "end": 39.46176870748298
      },
      {
        "section": "step-3",
        "text": "Compare avec l’original. Corrige les éléments manquants ou erronés.",
        "start": 39.81174603174602,
        "end": 44.432517006802705
      },
      {
        "section": "step-4",
        "text": "Cache la réponse et essaie de la rappeler à nouveau.",
        "start": 44.78249433106574,
        "end": 47.71981859410429
      },
      {
        "section": "step-5",
        "text": "Teste-toi aussi plus tard. Répéter immédiatement peut sembler facile sans démontrer une mémorisation durable.",
        "start": 48.069795918367326,
        "end": 54.39723356009068
      },
      {
        "section": "example",
        "text": "Question : pourquoi l’eau qui s’évapore peut-elle refroidir une surface ?\nRéponse : l’évaporation demande de l’énergie. Cette énergie est prélevée sous forme de chaleur dans la surface et son environnement.",
        "start": 54.74721088435372,
        "end": 66.90285714285712
      },
      {
        "section": "explanation",
        "text": "Lis et comprends d’abord la réponse. Cache-la ensuite et réponds toi-même. « L’eau refroidit » ne suffit pas à expliquer le lien : le besoin d’énergie et le prélèvement de chaleur sont essentiels.",
        "start": 67.25283446712015,
        "end": 77.87596371882083,
        "spokenText": "Commence par lire et comprendre la réponse. Cache-la ensuite et réponds toi-même. « L’eau refroidit » ne suffit pas à expliquer le lien : le besoin d’énergie et le prélèvement de chaleur sont essentiels."
      },
      {
        "section": "recall",
        "text": "Pourquoi l’eau qui s’évapore peut-elle refroidir une surface ? Explique le lien sans regarder.",
        "start": 78.22594104308386,
        "end": 83.55492063492059
      },
      {
        "section": "transfer",
        "text": "Formule une question précise sur ton propre contenu. Réponds sans regarder, compare ensuite et réessaie plus tard. ANITEW utilise aussi le rappel dans ses séances d’entraînement.",
        "start": 83.90489795918363,
        "end": 93.9939682539682
      }
    ],
    "src": "/course-media/library/lin-active-recall-fr-057cf3da4f11.m4a",
    "bytes": 1046102,
    "sha256": "057cf3da4f11364523e26c855e68c7c1dbebecdde15df39a0d09dc74b61fd2ce",
    "synthesis": "kyutai-openvoice"
  },
  {
    "course": "interleaved-practice",
    "coach": "lin",
    "language": "fr",
    "duration": 101.94680272108842,
    "cues": [
      {
        "section": "title",
        "text": "Choisir entre des démarches proches",
        "start": 0.0,
        "end": 2.0085260770975055
      },
      {
        "section": "purpose",
        "text": "Mélange des types d’exercices proches et choisis toi-même la démarche adaptée. Tu travailles ainsi le choix de la méthode autant que son application.",
        "start": 2.558548752834467,
        "end": 11.173151927437642
      },
      {
        "section": "limit",
        "text": "Apprends d’abord chaque démarche avec des exemples clairs. Changer de sujet au hasard ou faire plusieurs choses à la fois est différent. L’intérêt du mélange dépend du contenu et de tes connaissances antérieures.",
        "start": 11.52312925170068,
        "end": 24.03868480725624
      },
      {
        "section": "step-0",
        "text": "Comprends d’abord chaque démarche séparément.",
        "start": 24.388662131519276,
        "end": 26.96607709750567
      },
      {
        "section": "step-1",
        "text": "Mélange ensuite quelques types d’exercices proches.",
        "start": 27.31605442176871,
        "end": 30.752607709750567
      },
      {
        "section": "step-2",
        "text": "Avant de répondre, identifie le type et explique ton choix.",
        "start": 31.102585034013604,
        "end": 34.539138321995466
      },
      {
        "section": "step-3",
        "text": "Résous l’exercice et vérifie séparément ton choix et ton résultat.",
        "start": 34.8891156462585,
        "end": 39.2544671201814
      },
      {
        "section": "step-4",
        "text": "Retravaille les erreurs, puis reviens aux exercices mélangés.",
        "start": 39.60444444444444,
        "end": 42.54176870748299
      },
      {
        "section": "example",
        "text": "Rectangle : aire = longueur × largeur. Triangle : aire = base × hauteur correspondante ÷ 2. Un rectangle de 4 cm sur 3 cm a une aire de 12 cm². Un triangle de base 4 cm et de hauteur correspondante 3 cm a une aire de 6 cm².",
        "start": 42.891746031746024,
        "end": 64.86943310657595,
        "spokenText": "Pour un rectangle, l’aire est égale à la longueur multipliée par la largeur. Pour un triangle, l’aire est égale à la base multipliée par la hauteur correspondante, puis divisée par deux. Un rectangle de quatre centimètres sur trois centimètres a une aire de douze centimètres carrés. Un triangle de base quatre centimètres et de hauteur correspondante trois centimètres a une aire de six centimètres carrés."
      },
      {
        "section": "explanation",
        "text": "Des nombres identiques n’impliquent pas le même calcul. La figure détermine la règle : le triangle demande le facteur un demi. Dans un mélange d’exercices, il faut identifier le type avant d’appliquer la règle.",
        "start": 65.21941043083899,
        "end": 79.62739229024942,
        "spokenText": "Des nombres identiques ne donnent pas forcément le même calcul. La figure détermine la règle. Pour le triangle, il faut diviser le produit par deux. Dans un mélange d’exercices, commence par identifier le type de figure avant d’appliquer la règle."
      },
      {
        "section": "recall",
        "text": "Exercice A : triangle de base 6 cm et de hauteur correspondante 4 cm. Exercice B : rectangle de longueur 6 cm et de largeur 4 cm. Donne la règle et l’aire de chaque figure.",
        "start": 79.97736961451245,
        "end": 94.69882086167799,
        "spokenText": "Exercice A. Un triangle de base six centimètres et de hauteur correspondante quatre centimètres. Exercice B. Un rectangle de longueur six centimètres et de largeur quatre centimètres. Donne la règle et l’aire de chaque figure."
      },
      {
        "section": "transfer",
        "text": "Choisis deux ou trois types d’exercices proches que tu connais déjà. Mélange-les et justifie ta démarche avant chaque résolution.",
        "start": 95.04879818594102,
        "end": 101.59682539682538
      }
    ],
    "src": "/course-media/library/lin-interleaved-practice-fr-ec628c836179.m4a",
    "bytes": 1168747,
    "sha256": "ec628c8361793f5305d002b0e3b0c95a4ef6d8fc23f4500d691176cdd44d4d68",
    "synthesis": "kyutai-openvoice"
  },
  {
    "course": "keyword-method",
    "coach": "lin",
    "language": "fr",
    "duration": 79.4002267573696,
    "cues": [
      {
        "section": "title",
        "text": "Relier le vocabulaire à des mots-clés",
        "start": 0.0,
        "end": 2.2987755102040817
      },
      {
        "section": "purpose",
        "text": "Un mot connu dont le son est proche peut servir de pont vers le sens d’un mot étranger. Relie ce mot-clé et le sens dans une image, puis vérifie le mot à apprendre.",
        "start": 2.848798185941043,
        "end": 13.355827664399092,
        "spokenText": "Un mot connu dont le son est proche peut servir de pont vers le sens d’un mot étranger. Relie ce mot-clé et le sens dans une image. Puis vérifie le mot à apprendre."
      },
      {
        "section": "limit",
        "text": "Un son proche n’est pas une prononciation correcte. Certains mots ne se prêtent pas à cette technique. Vérifie séparément la prononciation, l’orthographe et l’emploi dans une phrase.",
        "start": 13.70580498866213,
        "end": 23.284036281179137
      },
      {
        "section": "step-0",
        "text": "Vérifie le sens et la prononciation correcte du nouveau mot.",
        "start": 23.634013605442174,
        "end": 27.151836734693873
      },
      {
        "section": "step-1",
        "text": "Cherche un mot connu au son proche.",
        "start": 27.50181405895691,
        "end": 29.87024943310657
      },
      {
        "section": "step-2",
        "text": "Imagine un lien clair entre ce mot-clé et le sens.",
        "start": 30.220226757369606,
        "end": 33.44780045351473
      },
      {
        "section": "step-3",
        "text": "Retrouve le sens à partir du mot, puis le mot à partir du sens.",
        "start": 33.79777777777777,
        "end": 37.454920634920626
      },
      {
        "section": "step-4",
        "text": "Vérifie la prononciation, l’orthographe et une phrase d’exemple.",
        "start": 37.80489795918366,
        "end": 41.032471655328784
      },
      {
        "section": "example",
        "text": "Anglais : bell = cloche. Exemple : The bell rings. = La cloche sonne.",
        "start": 41.38244897959182,
        "end": 47.860816326530596
      },
      {
        "section": "explanation",
        "text": "Le mot français « belle » peut servir d’indice sonore : imagine une très belle cloche qui sonne. « Belle » est l’aide-mémoire, pas une transcription de la prononciation anglaise de bell.",
        "start": 48.21079365079363,
        "end": 59.29832199546483
      },
      {
        "section": "recall",
        "text": "Quel mot anglais signifie cloche ? Écris le mot, son sens et la phrase d’exemple de mémoire.",
        "start": 59.64829931972787,
        "end": 65.83641723356007
      },
      {
        "section": "transfer",
        "text": "Essaie avec un mot dont tu as réellement besoin. Teste aussi le sens inverse : peux-tu retrouver la forme étrangère à partir du sens ? Si le mot-clé te perturbe, change de lien ou utilise le rappel direct.",
        "start": 66.1863945578231,
        "end": 79.05024943310656,
        "spokenText": "Fais un essai avec un mot dont tu as réellement besoin. Teste aussi le sens inverse : peux-tu retrouver la forme étrangère à partir du sens ? Si le mot-clé te perturbe, change de lien ou utilise le rappel direct."
      }
    ],
    "src": "/course-media/library/lin-keyword-method-fr-3d5406bca3ef.m4a",
    "bytes": 870667,
    "sha256": "3d5406bca3efd52768f8e25e20cb0ae77eb883d91c54850bdb3ce569ef07ccc1",
    "synthesis": "kyutai-openvoice"
  },
  {
    "course": "long-words",
    "coach": "lin",
    "language": "fr",
    "duration": 82.93133786848071,
    "cues": [
      {
        "section": "title",
        "text": "Retenir les mots longs",
        "start": 0.0,
        "end": 1.5789569160997732
      },
      {
        "section": "purpose",
        "text": "Décompose un mot long en éléments compréhensibles, puis reconstitue-le. Travaille son sens, sa prononciation et son orthographe.",
        "start": 2.1289795918367345,
        "end": 8.816326530612244
      },
      {
        "section": "limit",
        "text": "Les éléments de sens ne correspondent pas toujours aux syllabes prononcées. Certains termes techniques sont entièrement nouveaux. Vérifie leur sens et leur prononciation avant de les travailler.",
        "start": 9.166303854875283,
        "end": 19.255374149659865
      },
      {
        "section": "step-0",
        "text": "Clarifie le sens du mot entier.",
        "start": 19.6053514739229,
        "end": 21.40489795918367
      },
      {
        "section": "step-1",
        "text": "Repère des éléments connus et explique leur rôle.",
        "start": 21.754875283446708,
        "end": 24.5528798185941
      },
      {
        "section": "step-2",
        "text": "Observe les changements d’orthographe et les éléments de liaison.",
        "start": 24.902857142857137,
        "end": 28.42068027210884
      },
      {
        "section": "step-3",
        "text": "Prononce les parties lentement, puis le mot entier avec fluidité. Les frontières syllabiques peuvent être différentes.",
        "start": 28.770657596371876,
        "end": 35.446394557823126
      },
      {
        "section": "step-4",
        "text": "Cache le modèle, écris le mot entier et explique-le.",
        "start": 35.79637188208616,
        "end": 39.023945578231285
      },
      {
        "section": "step-5",
        "text": "Vérifie l’orthographe et le sens. Travaille les parties incertaines, puis rassemble à nouveau le mot.",
        "start": 39.37392290249432,
        "end": 44.5635827664399
      },
      {
        "section": "example",
        "text": "incompréhensible",
        "start": 44.91356009070294,
        "end": 46.56217687074829,
        "spokenText": "Exemple : incompréhensible."
      },
      {
        "section": "explanation",
        "text": "in | compréhensible : ce qui ne peut pas être compris. Le préfixe in- apporte ici la négation. « Compréhensible » est lié au verbe comprendre. Ce découpage aide à saisir le sens ; il ne constitue pas une transcription de la prononciation.",
        "start": 46.912154195011325,
        "end": 65.03532879818593,
        "spokenText": "Le mot incompréhensible signifie : ce qui ne peut pas être compris. On sépare le préfixe in et le mot compréhensible. Le préfixe in apporte ici la négation. Compréhensible est lié au verbe comprendre. Ce découpage aide à saisir le sens. Il ne constitue pas une transcription de la prononciation."
      },
      {
        "section": "recall",
        "text": "Écris le mot entier de mémoire. Explique ensuite son sens à voix haute et prononce-le avec fluidité.",
        "start": 65.38530612244897,
        "end": 72.14231292517006
      },
      {
        "section": "transfer",
        "text": "Choisis un mot long utile dans ta vie. Repère ses éléments de sens, puis travaille le mot entier. Respecte les règles de formation et de prononciation de sa langue.",
        "start": 72.4922902494331,
        "end": 82.58136054421767
      }
    ],
    "src": "/course-media/library/lin-long-words-fr-4333d1632092.m4a",
    "bytes": 916473,
    "sha256": "4333d1632092e79e0ff1f0e49f2178a3c937523a2da788ef5432fb31ca19873d",
    "synthesis": "kyutai-openvoice"
  },
  {
    "course": "meaningful-groups",
    "coach": "lin",
    "language": "fr",
    "duration": 92.88108843537414,
    "cues": [
      {
        "section": "title",
        "text": "Former des groupes cohérents",
        "start": 0.0,
        "end": 2.6586848072562357
      },
      {
        "section": "purpose",
        "text": "Organise des informations en groupes compréhensibles. Une structure utile peut t’aider à voir l’ensemble et à chercher les éléments méthodiquement lors du rappel.",
        "start": 3.208707482993197,
        "end": 12.04390022675737
      },
      {
        "section": "limit",
        "text": "Regrouper ne garantit pas un rappel complet. Les groupes doivent avoir un sens pour toi ; un titre ne suffit pas à expliquer des termes inconnus. Si l’ordre initial compte, travaille-le aussi.",
        "start": 12.393877551020408,
        "end": 21.6934693877551
      },
      {
        "section": "step-0",
        "text": "Précise ton objectif : le contenu, son ordre ou les deux.",
        "start": 22.043446712018138,
        "end": 25.770249433106574
      },
      {
        "section": "step-1",
        "text": "Cherche des caractéristiques communes ou des relations.",
        "start": 26.12022675736961,
        "end": 28.98789115646258
      },
      {
        "section": "step-2",
        "text": "Crée quelques groupes faciles à parcourir avec des titres informatifs.",
        "start": 29.337868480725618,
        "end": 32.77442176870748
      },
      {
        "section": "step-3",
        "text": "Explique pourquoi chaque élément appartient à son groupe.",
        "start": 33.12439909297051,
        "end": 36.421632653061216
      },
      {
        "section": "step-4",
        "text": "Cache la source. Rappelle d’abord les groupes, puis leur contenu.",
        "start": 36.77160997732425,
        "end": 41.322721088435365,
        "spokenText": "Cache la source. Ensuite, rappelle d’abord les groupes, puis leur contenu."
      },
      {
        "section": "step-5",
        "text": "Compare avec l’original, corrige les omissions et réessaie plus tard.",
        "start": 41.6726984126984,
        "end": 45.689750566893416
      },
      {
        "section": "example",
        "text": "Pomme · marteau · chemise · poire · scie · veste · banane · pince · pantalon",
        "start": 46.03972789115645,
        "end": 56.69768707482992,
        "spokenText": "Une pomme. Un marteau. Une chemise. Une poire. Une scie. Une veste. Une banane. Une pince. Un pantalon."
      },
      {
        "section": "explanation",
        "text": "Une organisation possible : fruits (pomme, poire, banane), outils (marteau, scie, pince), vêtements (chemise, veste, pantalon). Les titres servent d’indices. L’objectif est de retenir les neuf éléments, pas leur ordre initial.",
        "start": 57.04766439909296,
        "end": 70.84031746031745
      },
      {
        "section": "recall",
        "text": "Rappelle les trois groupes et autant des neuf éléments que possible, sans regarder. L’ordre dans chaque groupe est libre.",
        "start": 71.19029478458049,
        "end": 79.20117913832199,
        "spokenText": "Rappelle les trois groupes et autant des neuf éléments que possible. Fais-le sans regarder la liste. L’ordre dans chaque groupe est libre."
      },
      {
        "section": "transfer",
        "text": "Organise un passage par idées ou une liste par catégories utiles. N’invente pas des groupes pour atteindre un nombre fixé. Vérifie le contenu complet, pas seulement les titres.",
        "start": 79.55115646258503,
        "end": 92.5311111111111,
        "spokenText": "Organise un passage par idées ou une liste par catégories utiles. N’invente pas des groupes pour atteindre un nombre fixé. Vérifie tout le contenu. Ne te limite pas aux titres."
      }
    ],
    "src": "/course-media/library/lin-meaningful-groups-fr-490a1d285440.m4a",
    "bytes": 1013153,
    "sha256": "490a1d2854406d5c00566c7c70f2e0a1d64f6a7284ef339be15f82e8e0effd47",
    "synthesis": "kyutai-openvoice"
  },
  {
    "course": "method-of-loci",
    "coach": "lin",
    "language": "fr",
    "duration": 82.79034013605441,
    "cues": [
      {
        "section": "title",
        "text": "Utiliser les lieux comme indices",
        "start": 0.0,
        "end": 2.507755102040816
      },
      {
        "section": "purpose",
        "text": "Avec la méthode des loci, tu places mentalement des contenus à des endroits fixes d’un trajet familier. Parcourir ce trajet dans ta tête fournit des indices pour les retrouver.",
        "start": 3.0577777777777775,
        "end": 11.533061224489796
      },
      {
        "section": "limit",
        "text": "Apprends d’abord un trajet stable. Des images semblables au même endroit peuvent se confondre. Les lieux soutiennent la structure et l’ordre, mais pas automatiquement la formulation exacte.",
        "start": 11.883038548752834,
        "end": 22.18108843537415
      },
      {
        "section": "step-0",
        "text": "Choisis un trajet familier avec des endroits clairement distincts.",
        "start": 22.531065759637187,
        "end": 26.3275283446712
      },
      {
        "section": "step-1",
        "text": "Fixe leur ordre et répète le trajet sans contenu à apprendre.",
        "start": 26.677505668934238,
        "end": 31.867165532879817,
        "spokenText": "Fixe leur ordre. Répète ensuite le trajet sans contenu à apprendre."
      },
      {
        "section": "step-2",
        "text": "Associe un élément à chaque endroit par un événement imaginé marquant.",
        "start": 32.21714285714285,
        "end": 36.73342403628118
      },
      {
        "section": "step-3",
        "text": "Parcours le trajet sans modèle et nomme les éléments.",
        "start": 37.083401360544215,
        "end": 40.38063492063492
      },
      {
        "section": "step-4",
        "text": "Compare ton rappel et améliore les lieux confus ou les images peu efficaces.",
        "start": 40.730612244897955,
        "end": 46.640090702947845,
        "spokenText": "Compare ton rappel. Améliore ensuite les lieux confus ou les images peu efficaces."
      },
      {
        "section": "example",
        "text": "Trajet d’exemple : porte d’entrée → meuble à chaussures → table de cuisine. Éléments : pain → savon → bougie.",
        "start": 46.99006802721088,
        "end": 54.10698412698412
      },
      {
        "section": "explanation",
        "text": "Un pain géant bloque la porte. Le meuble à chaussures déborde de mousse de savon. Une bougie brille sur la table de cuisine. Ce trajet est seulement un exemple ; choisis un trajet réellement familier pour ton propre apprentissage.",
        "start": 54.45696145124716,
        "end": 67.21632653061224
      },
      {
        "section": "recall",
        "text": "Visite mentalement les trois endroits. Écris l’élément associé à chacun.",
        "start": 67.56630385487527,
        "end": 72.68630385487528,
        "spokenText": "Visite mentalement les trois endroits. Puis écris l’élément associé à chacun."
      },
      {
        "section": "transfer",
        "text": "Dans le palais de mémoire existant de l’application, crée un trajet familier ou utilise un trajet proposé. Commence par quelques endroits et vérifie que tu les distingues clairement.",
        "start": 73.03628117913831,
        "end": 82.44036281179137
      }
    ],
    "src": "/course-media/library/lin-method-of-loci-fr-f958a4570af4.m4a",
    "bytes": 932886,
    "sha256": "f958a4570af48dbc48aa9f2496550ca48f582cbe523f7fe20f081afef95f1f08",
    "synthesis": "kyutai-openvoice"
  },
  {
    "course": "number-images",
    "coach": "lin",
    "language": "fr",
    "duration": 92.00866213151926,
    "cues": [
      {
        "section": "title",
        "text": "Transformer les nombres en images",
        "start": 0.0,
        "end": 2.507755102040816
      },
      {
        "section": "purpose",
        "text": "Le système majeur associe des sons consonantiques aux chiffres. Tu formes un mot et imagines une image que tu peux ensuite reconvertir en nombre.",
        "start": 3.0577777777777775,
        "end": 11.324081632653062
      },
      {
        "section": "limit",
        "text": "Apprends d’abord les correspondances. Une image qui ne permet pas de retrouver exactement le nombre n’aide pas au rappel précis. Cette introduction utilise deux chiffres ; les leçons existantes du système majeur présentent d’autres correspondances.",
        "start": 11.6740589569161,
        "end": 23.969024943310657
      },
      {
        "section": "step-0",
        "text": "Apprends d’abord quelques correspondances fixes entre chiffres et sons.",
        "start": 24.319002267573694,
        "end": 28.185124716553286
      },
      {
        "section": "step-1",
        "text": "Lis les sons dans l’ordre des chiffres.",
        "start": 28.535102040816323,
        "end": 31.402766439909293,
        "spokenText": "Lis les sons, dans l’ordre des chiffres."
      },
      {
        "section": "step-2",
        "text": "Ajoute des voyelles pour former un mot concret.",
        "start": 31.75274376417233,
        "end": 34.33015873015872
      },
      {
        "section": "step-3",
        "text": "Vérifie si le mot contient d’autres consonnes prononcées qui coderaient des chiffres supplémentaires.",
        "start": 34.68013605442176,
        "end": 39.62598639455781
      },
      {
        "section": "step-4",
        "text": "Retrouve le mot à partir de l’image, puis le nombre à partir de ses sons.",
        "start": 39.97596371882085,
        "end": 44.271655328798175
      },
      {
        "section": "example",
        "text": "1 → t/d ; 2 → n. Le nombre 12 peut devenir l’image d’une tonne de sable : t + n.",
        "start": 44.62163265306121,
        "end": 57.60158730158729,
        "spokenText": "Pour le chiffre un, utilise le premier son de tapis ou de dos. Pour le chiffre deux, utilise le premier son de nez. Pour douze, imagine une tonne de sable. Dans tonne, tu retrouves le son initial de tapis, puis celui de nez."
      },
      {
        "section": "explanation",
        "text": "La voyelle ne compte pas ici. Dans tonne, les deux lettres n représentent un seul son consonantique. Au retour, t donne 1 et n donne 2 : tu retrouves 12. Ce sont les sons qui comptent, pas simplement les lettres écrites.",
        "start": 57.951564625850324,
        "end": 74.42612244897958,
        "spokenText": "Dans cet exercice, les voyelles ne comptent pas. Le mot tonne s’écrit avec deux lettres identiques au milieu, mais elles représentent un seul son. Le premier son consonantique code un. Le second code deux. Tu retrouves douze. On compte les sons, pas le nombre de lettres."
      },
      {
        "section": "recall",
        "text": "Quel nombre code l’image d’une tonne de sable ? Explique le retour par les deux consonnes prononcées.",
        "start": 74.77609977324262,
        "end": 80.61591836734692
      },
      {
        "section": "transfer",
        "text": "Travaille les autres correspondances fixes dans les leçons existantes avant de mémoriser des nombres plus longs. Vérifie que chaque image te ramène exactement au nombre voulu.",
        "start": 80.96589569160996,
        "end": 91.65868480725622,
        "spokenText": "Travaille les autres correspondances fixes dans les leçons existantes avant de mémoriser des nombres plus longs. Assure-toi que chaque image te ramène exactement au nombre voulu."
      }
    ],
    "src": "/course-media/library/lin-number-images-fr-38faeb852356.m4a",
    "bytes": 1026198,
    "sha256": "38faeb8523568a04a5e79da485da1e1ddcb9f205a36a7884691525d5b9cfc75f",
    "synthesis": "kyutai-openvoice"
  },
  {
    "course": "self-explanation",
    "coach": "lin",
    "language": "fr",
    "duration": 102.94693877551018,
    "cues": [
      {
        "section": "title",
        "text": "Expliquer soi-même les relations",
        "start": 0.0,
        "end": 2.0085260770975055
      },
      {
        "section": "purpose",
        "text": "Explique avec tes propres mots pourquoi une étape a du sens ou comment deux affirmations sont liées. Tu peux ainsi découvrir des lacunes qui passent inaperçues à la lecture.",
        "start": 2.558548752834467,
        "end": 12.601179138321996
      },
      {
        "section": "limit",
        "text": "Une explication fluide peut être fausse. Vérifie-la dans une source fiable et reconnais les incertitudes. Cette méthode accompagne la pratique ; elle ne remplace ni les connaissances du sujet ni la vérification.",
        "start": 12.951156462585034,
        "end": 25.037142857142857
      },
      {
        "section": "step-0",
        "text": "Choisis une relation limitée que tu veux comprendre.",
        "start": 25.387120181405894,
        "end": 28.475374149659864
      },
      {
        "section": "step-1",
        "text": "Demande-toi pourquoi l’étape suit, ce qui reste identique et ce qui changerait dans d’autres conditions.",
        "start": 28.8253514739229,
        "end": 33.68993197278911
      },
      {
        "section": "step-2",
        "text": "Formule une explication sans copier la source.",
        "start": 34.03990929705215,
        "end": 38.02213151927437,
        "spokenText": "Maintenant, explique avec tes propres mots. Ne copie pas la source."
      },
      {
        "section": "step-3",
        "text": "Compare avec le raisonnement original. Distingue les faits établis des suppositions.",
        "start": 38.372108843537404,
        "end": 43.352789115646246
      },
      {
        "section": "step-4",
        "text": "Corrige les lacunes et applique ton explication à un exemple similaire.",
        "start": 43.70276643990928,
        "end": 48.857596371882074
      },
      {
        "section": "step-5",
        "text": "Explique de nouveau la relation plus tard, sans regarder.",
        "start": 49.20757369614511,
        "end": 52.21455782312924
      },
      {
        "section": "example",
        "text": "Trois quarts valent six huitièmes : 3/4 = 6/8. En coupant chacune des quatre parts égales en deux, on obtient huit parts égales. Les trois quarts sélectionnés deviennent six huitièmes. La quantité sélectionnée reste identique.",
        "start": 52.56453514739228,
        "end": 67.04217687074828
      },
      {
        "section": "explanation",
        "text": "« Multiplier le numérateur et le dénominateur par deux » décrit une règle. Couper les parts égales en deux explique pourquoi la valeur ne change pas. Pour transférer l’idée, cherche pourquoi 2/3 et 4/6 représentent la même proportion.",
        "start": 67.39215419501132,
        "end": 81.11514739229023
      },
      {
        "section": "recall",
        "text": "Explique sans modèle pourquoi 3/4 et 6/8 sont égaux. Applique ensuite ton raisonnement à 2/3 et 4/6.",
        "start": 81.46512471655326,
        "end": 89.80108843537413
      },
      {
        "section": "transfer",
        "text": "Choisis une étape de ton cours et explique pourquoi elle est valable. Trouve un exemple similaire pour vérifier ton raisonnement. Si tu ne peux pas vérifier de façon fiable, note la question ouverte plutôt que de prétendre être certain.",
        "start": 90.15106575963716,
        "end": 102.59696145124714
      }
    ],
    "src": "/course-media/library/lin-self-explanation-fr-1969dacfaa28.m4a",
    "bytes": 1182895,
    "sha256": "1969dacfaa2833e8f00059d13fe4a30848862cb60418cf70a1e844f16fa11b2b",
    "synthesis": "kyutai-openvoice"
  },
  {
    "course": "spaced-practice",
    "coach": "lin",
    "language": "fr",
    "duration": 112.4322902494331,
    "cues": [
      {
        "section": "title",
        "text": "Espacer les révisions",
        "start": 0.0,
        "end": 1.4396371882086167
      },
      {
        "section": "purpose",
        "text": "Répartis les tentatives de rappel dans le temps. Tu vérifies ainsi ce qui reste après une pause, plutôt que de répéter une réponse juste après l’avoir lue.",
        "start": 1.9896598639455783,
        "end": 15.538503401360543,
        "spokenText": "Répartis les tentatives de rappel dans le temps. Après une pause, essaie de retrouver la réponse. Tu vérifies ainsi ce que tu as retenu. Répéter immédiatement une réponse que tu viens de lire ne suffit pas."
      },
      {
        "section": "limit",
        "text": "Aucun intervalle ne convient à tous les contenus et à toutes les personnes. La difficulté, les connaissances antérieures et la durée de rétention souhaitée comptent. Cet exercice explique la démarche ; seuls des rappels ultérieurs permettent de vérifier la rétention dans le temps.",
        "start": 15.888480725623582,
        "end": 29.25156462585034
      },
      {
        "section": "step-0",
        "text": "Apprends une information limitée et essaie de la rappeler une fois sans modèle.",
        "start": 29.601541950113376,
        "end": 33.8972335600907
      },
      {
        "section": "step-1",
        "text": "Prévois une autre tentative après un délai.",
        "start": 34.247210884353734,
        "end": 36.615646258503396
      },
      {
        "section": "step-2",
        "text": "Essaie de répondre avant d’afficher la solution.",
        "start": 36.96562358276643,
        "end": 40.0538775510204
      },
      {
        "section": "step-3",
        "text": "Après une erreur, clarifie le sens, corrige et rappelle à nouveau. Raccourcis l’intervalle suivant si le rappel était trop difficile.",
        "start": 40.403854875283436,
        "end": 47.95034013605441
      },
      {
        "section": "step-4",
        "text": "Lorsque le rappel devient fiable, l’intervalle peut augmenter.",
        "start": 48.300317460317444,
        "end": 52.16643990929704
      },
      {
        "section": "step-5",
        "text": "ANITEW planifie déjà les révisions des éléments d’entraînement enregistrés. Suis les révisions dues plutôt que de créer un calendrier concurrent.",
        "start": 52.51641723356008,
        "end": 60.35315192743763
      },
      {
        "section": "example",
        "text": "Mira apprend une nouvelle notion et l’explique sans modèle. Après une pause, elle réessaie et découvre une lacune. Elle compare avec la bonne explication, corrige la lacune et prévoit le prochain essai plus tôt. Elle augmente l’intervalle seulement lorsque le rappel devient fiable.",
        "start": 60.703129251700666,
        "end": 76.1792290249433
      },
      {
        "section": "explanation",
        "text": "Le délai et la tentative de rappel comptent. Relire dix fois de suite ne remplace pas un rappel ultérieur. L’erreur indique à Mira ce qu’elle doit retravailler et l’aide à adapter l’intervalle.",
        "start": 76.52920634920633,
        "end": 90.14770975056688,
        "spokenText": "Le délai et la tentative de rappel comptent. Relire dix fois de suite ne remplace pas un rappel ultérieur. Grâce à son erreur, Mira sait ce qu’elle doit retravailler. Elle peut aussi adapter le délai avant son prochain essai."
      },
      {
        "section": "recall",
        "text": "Décris la démarche de Mira : que fait-elle avant de vérifier ? Comment réagit-elle à la lacune ? Quand peut-elle augmenter l’intervalle ?",
        "start": 90.49768707482991,
        "end": 99.14712018140588
      },
      {
        "section": "transfer",
        "text": "Utilise les révisions dues pour les éléments d’entraînement enregistrés. Pour un contenu extérieur à l’application, prévois un test ultérieur et adapte le délai au rappel réel. Terminer ce cours ne crée pas de nouvelles cartes de révision.",
        "start": 99.49709750566892,
        "end": 112.08231292517006,
        "spokenText": "Utilise les révisions dues pour les éléments d’entraînement enregistrés. Pour un contenu extérieur à l’application, prévois un test ultérieur et adapte le délai au rappel réel. Ce cours ne crée aucune nouvelle carte de révision quand tu le termines."
      }
    ],
    "src": "/course-media/library/lin-spaced-practice-fr-bcbd79b8a6cb.m4a",
    "bytes": 1282923,
    "sha256": "bcbd79b8a6cb1df13cc0cb7f6e7670c74fba48bd62c8eba0f94b6bd6cc5acad3",
    "synthesis": "kyutai-openvoice"
  },
  {
    "course": "text-meaning",
    "coach": "lin",
    "language": "fr",
    "duration": 104.9554648526077,
    "cues": [
      {
        "section": "title",
        "text": "Retenir le sens d’un texte long",
        "start": 0.0,
        "end": 2.0085260770975055
      },
      {
        "section": "purpose",
        "text": "Apprends à restituer les idées et les liens d’un texte sans le regarder. Cette méthode convient aux textes documentaires, aux présentations et à la préparation d’un examen.",
        "start": 2.558548752834467,
        "end": 11.32408163265306
      },
      {
        "section": "limit",
        "text": "Un résumé ne conserve pas tous les détails. Travaille séparément les chiffres ou les formulations exactes lorsqu’ils sont importants. Commence par un court passage et allonge-le lorsque tu sais l’expliquer.",
        "start": 11.674058956916099,
        "end": 24.921043083900226,
        "spokenText": "Un résumé ne conserve pas tous les détails. Travaille séparément les chiffres ou les formulations exactes lorsqu’ils sont importants. Commence par un court passage. Allonge ce passage quand tu peux en expliquer le sens."
      },
      {
        "section": "step-0",
        "text": "Lis un passage et clarifie les termes inconnus.",
        "start": 25.271020408163263,
        "end": 29.740861678004535,
        "spokenText": "Commence par lire un passage. Clarifie les termes inconnus."
      },
      {
        "section": "step-1",
        "text": "Découpe-le en idées et donne un titre court à chacune.",
        "start": 30.090839002267572,
        "end": 34.35170068027211,
        "spokenText": "Repère les idées du passage. Donne un titre court à chacune."
      },
      {
        "section": "step-2",
        "text": "Pose une question par partie : que se passe-t-il, pourquoi et avec quelles conséquences ?",
        "start": 34.70167800453515,
        "end": 39.78684807256236
      },
      {
        "section": "step-3",
        "text": "Cache le texte et réponds avec tes propres mots.",
        "start": 40.136825396825394,
        "end": 42.505260770975056
      },
      {
        "section": "step-4",
        "text": "Compare avec l’original. Corrige les idées manquantes et les liens erronés.",
        "start": 42.85523809523809,
        "end": 51.5859410430839,
        "spokenText": "Compare ton rappel avec le texte original. Ajoute les idées manquantes. Corrige les erreurs dans les liens entre les idées."
      },
      {
        "section": "step-5",
        "text": "Essaie de nouveau plus tard. Adapte l’intervalle à la qualité de ton rappel.",
        "start": 51.935918367346936,
        "end": 57.125578231292515,
        "spokenText": "Plus tard, recommence le rappel. Adapte le délai selon la qualité de ta réponse."
      },
      {
        "section": "example",
        "text": "Une ville plante des arbres le long d’une route très fréquentée. Leur feuillage apporte de l’ombre. L’eau qui s’évapore par les feuilles contribue au refroidissement. Pour rester en bonne santé pendant les périodes sèches, les arbres ont besoin de suffisamment d’eau et d’espace pour leurs racines.",
        "start": 57.47555555555555,
        "end": 77.80462585034013,
        "spokenText": "Une ville plante des arbres le long d’une route très fréquentée. Leur feuillage apporte de l’ombre. Les feuilles rejettent de l’eau par évaporation. Cette évaporation contribue au refroidissement. Pendant les périodes sèches, les arbres ont besoin de suffisamment d’eau. Leurs racines ont aussi besoin d’espace pour rester en bonne santé."
      },
      {
        "section": "explanation",
        "text": "Trois parties : l’action (planter des arbres), les effets (ombre et évaporation) et les conditions (eau et espace pour les racines). Ce plan conserve les liens entre les idées.",
        "start": 78.15460317460317,
        "end": 90.17092970521541,
        "spokenText": "On distingue trois parties. Premièrement, l’action : planter des arbres. Deuxièmement, les effets : l’ombre et l’évaporation. Troisièmement, les conditions : de l’eau et de l’espace pour les racines. Ce plan conserve les liens entre les idées."
      },
      {
        "section": "recall",
        "text": "Sans regarder le texte, explique l’action décrite, ses effets et ses conditions.",
        "start": 90.52090702947845,
        "end": 95.60607709750566
      },
      {
        "section": "transfer",
        "text": "Choisis un court texte documentaire. Prépare trois questions, mets le texte de côté et réponds. Augmente progressivement la longueur du passage.",
        "start": 95.9560544217687,
        "end": 104.60548752834467
      }
    ],
    "src": "/course-media/library/lin-text-meaning-fr-da6c2a657e65.m4a",
    "bytes": 1193938,
    "sha256": "da6c2a657e656d36be6f89b7eb2782827a1af9f7302008598fe9a08dde826417",
    "synthesis": "kyutai-openvoice"
  },
  {
    "course": "text-verbatim",
    "coach": "lin",
    "language": "fr",
    "duration": 85.03274376417232,
    "cues": [
      {
        "section": "title",
        "text": "Apprendre un texte mot pour mot",
        "start": 0.0,
        "end": 1.8692063492063493
      },
      {
        "section": "purpose",
        "text": "Travaille la formulation exacte d’un poème, d’une définition ou d’un court discours. Les petits mots et leur ordre comptent aussi.",
        "start": 2.4192290249433106,
        "end": 10.604263038548753
      },
      {
        "section": "limit",
        "text": "Réciter exactement ne prouve pas que tu as compris. Clarifie d’abord le sens. Des images mentales peuvent soutenir l’ordre des idées, mais elles ne remplacent pas le travail sur les mots.",
        "start": 10.954240362811792,
        "end": 20.683401360544217
      },
      {
        "section": "step-0",
        "text": "Comprends le texte et choisis un court passage cohérent.",
        "start": 21.033378684807253,
        "end": 24.899501133786845
      },
      {
        "section": "step-1",
        "text": "Lis-le attentivement et prononce-le clairement une fois.",
        "start": 25.249478458049882,
        "end": 31.00802721088435,
        "spokenText": "Commence par lire le passage attentivement. Prononce le passage clairement une fois."
      },
      {
        "section": "step-2",
        "text": "Cache-le, puis récite-le ou écris-le de mémoire.",
        "start": 31.358004535147387,
        "end": 34.364988662131516
      },
      {
        "section": "step-3",
        "text": "Compare mot à mot. Corrige les omissions, les inversions et les ajouts.",
        "start": 34.71496598639455,
        "end": 39.97428571428571
      },
      {
        "section": "step-4",
        "text": "Travaille le passage suivant, puis la transition entre les deux. Commence parfois au milieu.",
        "start": 40.32426303854875,
        "end": 45.653242630385485
      },
      {
        "section": "step-5",
        "text": "Essaie de nouveau plus tard sans modèle. Allonge le passage lorsque le rappel devient fiable.",
        "start": 46.00321995464852,
        "end": 51.552789115646256
      },
      {
        "section": "example",
        "text": "Le matin, j’ouvre la fenêtre. L’air frais entre dans la pièce. Ensuite, je commence ma journée.",
        "start": 51.90276643990929,
        "end": 57.77741496598639
      },
      {
        "section": "explanation",
        "text": "Les trois phrases forment trois unités de travail. Apprends la première, puis la deuxième et leur transition. Lors d’un autre essai, commence aussi par « L’air frais… ».",
        "start": 58.127392290249425,
        "end": 68.28612244897958,
        "spokenText": "Les trois phrases forment trois unités de travail. Apprends la première, puis la deuxième et leur transition. Au prochain essai, commence aussi par les mots : l’air frais."
      },
      {
        "section": "recall",
        "text": "Écris les trois phrases de mémoire en respectant leur formulation aussi précisément que possible.",
        "start": 68.63609977324262,
        "end": 75.35827664399092
      },
      {
        "section": "transfer",
        "text": "Choisis un court passage dont la formulation compte pour toi. Vérifie les mots dans l’original : une reformulation ne répond pas à cet objectif précis.",
        "start": 75.70825396825396,
        "end": 84.68276643990929
      }
    ],
    "src": "/course-media/library/lin-text-verbatim-fr-95ada954b409.m4a",
    "bytes": 946570,
    "sha256": "95ada954b40945213786927671892fbb6638835936dfe478267d3ccd242e5e5e",
    "synthesis": "kyutai-openvoice"
  }
]
export function courseNarration(course:CourseId,language:SpokenLanguage,coach:CoachId|null){
 return courseNarrations.find(pack=>pack.course===course&&pack.language===language&&pack.coach===coach)
}
