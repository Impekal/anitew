import type { CourseId } from '../core/courses/progress.ts'
export interface ReadingCourse { id: CourseId; title: string; purpose: string; limit: string; steps: string[]; example: string; explanation: string; prompt: string; criteria: string[]; transfer: string; ownCriteria?: string[]; allowOwn?: boolean }
export const readingCourses: Record<'de' | 'en', ReadingCourse[]> = {
  "de": [
    {
      "id": "text-meaning",
      "title": "Lange Texte inhaltlich behalten",
      "purpose": "Du lernst, die Aussagen und Zusammenhänge eines Textes ohne Vorlage wiederzugeben. Das hilft bei Sachtexten, Vorträgen und Prüfungsvorbereitung.",
      "limit": "Eine Zusammenfassung enthält nicht jedes Detail. Wenn genaue Zahlen oder Formulierungen wichtig sind, übe sie zusätzlich. Beginne mit einem kurzen Abschnitt; verlängere ihn erst, wenn du ihn erklären kannst.",
      "steps": [
        "Lies einen Abschnitt und kläre unbekannte Begriffe.",
        "Teile ihn nach Gedanken auf. Gib jedem Gedanken eine kurze Überschrift.",
        "Formuliere eine Frage pro Abschnitt: Was passiert? Warum? Welche Folge hat es?",
        "Decke die Vorlage ab und beantworte die Fragen in eigenen Worten.",
        "Vergleiche mit dem Original: Welche Aussage fehlt, welche Verbindung ist falsch? Korrigiere gezielt.",
        "Rufe den Inhalt später erneut ab. Passe den Abstand daran an, wie sicher der Abruf gelingt."
      ],
      "example": "Eine Stadt pflanzt Bäume an einer viel befahrenen Straße. Ihre Kronen spenden Schatten. Wasser verdunstet über die Blätter und trägt zur Kühlung bei. Damit die Bäume bei Trockenheit gesund bleiben, brauchen sie ausreichend Wasser und Platz für ihre Wurzeln.",
      "explanation": "Drei Sinnabschnitte: Maßnahme (Bäume pflanzen), Wirkung (Schatten und Verdunstung), Voraussetzung (Wasser und Wurzelraum). Die Gliederung hält den Zusammenhang fest.",
      "prompt": "Erkläre ohne Vorlage: Welche Maßnahme wird beschrieben, wie wirkt sie und was braucht sie?",
      "criteria": [
        "Bäume werden an der Straße gepflanzt.",
        "Schatten und Verdunstung tragen zur Kühlung bei.",
        "Wasser und Wurzelraum werden als Bedingungen genannt."
      ],
      "transfer": "Nimm einen eigenen kurzen Sachtext. Erstelle drei Leitfragen, lege den Text weg und beantworte sie. Steigere später die Länge, nicht nur die Anzahl der Wiederholungen."
    },
    {
      "id": "text-verbatim",
      "title": "Texte wortgetreu lernen",
      "purpose": "Du übst den genauen Wortlaut, etwa für ein Gedicht, eine Definition oder einen kurzen Vortrag. Dabei zählen auch kleine Wörter und die Reihenfolge.",
      "limit": "Wortgetreuer Abruf beweist nicht, dass du den Inhalt verstanden hast. Kläre zuerst die Bedeutung. Ein Merkbilder-Weg kann die Reihenfolge stützen, ersetzt aber nicht das Üben des Wortlauts.",
      "steps": [
        "Verstehe den Text und wähle eine kurze Sinneinheit.",
        "Lies sie aufmerksam und sprich sie einmal deutlich.",
        "Verdecke die Vorlage und sage oder schreibe sie aus dem Gedächtnis.",
        "Vergleiche Wort für Wort. Korrigiere Auslassungen, Vertauschungen und hinzugefügte Wörter.",
        "Übe die nächste Einheit und danach den Übergang zwischen beiden. Beginne gelegentlich in der Mitte.",
        "Wiederhole später ohne Vorlage. Verlängere den Abschnitt erst, wenn der aktuelle sicher gelingt."
      ],
      "example": "Am Morgen öffne ich das Fenster. Frische Luft strömt ins Zimmer. Danach beginne ich meinen Tag.",
      "explanation": "Drei kurze Sätze bilden drei Übungseinheiten. Übe zuerst Satz eins, dann Satz zwei und schließlich ihren Übergang. Starte einen späteren Versuch auch mit „Frische Luft …“.",
      "prompt": "Schreibe die drei Sätze möglichst genau aus dem Gedächtnis.",
      "criteria": [
        "Alle Wörter sind vorhanden und in der richtigen Reihenfolge.",
        "Die Übergänge zwischen den Sätzen gelingen ohne Vorlage.",
        "Ich kann erklären, was der Text bedeutet."
      ],
      "transfer": "Nutze eine eigene kurze Passage, die du wortgetreu brauchst. Prüfe den Wortlaut selbst am Original; eine bloß ähnliche Formulierung erfüllt dieses Lernziel nicht."
    },
    {
      "id": "long-words",
      "title": "Lange Wörter sicher behalten",
      "purpose": "Du zerlegst ein langes Wort in verständliche Bausteine, setzt sie wieder zusammen und übst Bedeutung, Aussprache und Schreibweise.",
      "limit": "Bedeutungsbausteine sind nicht immer Sprechsilben. Nicht jedes Fachwort lässt sich sofort sinnvoll zerlegen. Kläre unbekannte Teile und die korrekte Aussprache, bevor du sie übst.",
      "steps": [
        "Kläre die Bedeutung des ganzen Wortes.",
        "Suche bekannte Bausteine und erkläre ihre Bedeutung.",
        "Achte auf Verbindungselemente wie das s in Versicherungsbeitrag.",
        "Sprich die Teile langsam und dann das ganze Wort flüssig. Sprechsilben können anders verlaufen als die Bedeutungsgrenzen.",
        "Verdecke die Vorlage, schreibe das ganze Wort und erkläre es.",
        "Vergleiche Schreibweise und Bedeutung. Übe unsichere Stellen und setze danach wieder das ganze Wort zusammen."
      ],
      "example": "Krankenversicherungsbeitrag",
      "explanation": "Kranken | versicherung | s | beitrag. Gemeint ist der Beitrag zur Krankenversicherung. Das s verbindet Wortteile; es ist hier kein eigenes Bedeutungswort. Diese Aufteilung zeigt Bausteine, keine Silbentrennung.",
      "prompt": "Schreibe das vollständige Wort aus dem Gedächtnis. Erkläre anschließend mündlich seine Bedeutung und sprich es flüssig aus.",
      "criteria": [
        "Das vollständige Wort ist richtig geschrieben.",
        "Ich kann seine Bedeutung erklären.",
        "Ich habe das ganze Wort laut ausgesprochen; bei Unsicherheit prüfe ich eine verlässliche Aussprachequelle."
      ],
      "transfer": "Wähle ein langes Wort aus deinem Alltag. Suche sinnvolle Bausteine und prüfe danach das vollständige Wort. Für andere Sprachen gelten deren Wortbildungs- und Ausspracheregeln."
    },
    {
      "id": "active-recall",
      "title": "Aktives Abrufen",
      "purpose": "Du versuchst, eine Information ohne Vorlage wiederzugeben. Dabei erkennst du, was du selbst abrufen kannst und wo du noch nacharbeiten musst. Das hilft bei Fakten, Begriffen und Zusammenhängen.",
      "limit": "Dass dir eine gelesene Antwort bekannt vorkommt, heißt nicht, dass du sie selbst abrufen kannst. Ein misslungener Versuch ist kein Endurteil: Prüfe die richtige Antwort, kläre sie und versuche es erneut. Häufiges Raten ohne Rückmeldung kann Fehler festigen.",
      "steps": [
        "Wähle eine kleine, verstandene Information.",
        "Stelle eine klare Frage, die sich aus dem Material beantworten lässt.",
        "Lege die Vorlage weg und antworte, bevor du nachsiehst.",
        "Vergleiche deine Antwort mit dem Original. Korrigiere fehlende oder falsche Teile.",
        "Verdecke die richtige Antwort und versuche den Abruf noch einmal.",
        "Prüfe später erneut. Nur sofort wiederholen kann sich leicht anfühlen, ohne dauerhaftes Behalten zu zeigen."
      ],
      "example": "Frage: Warum kühlt verdunstendes Wasser eine Oberfläche?\nAntwort: Zum Verdunsten wird Energie benötigt. Diese Energie wird der Oberfläche und ihrer Umgebung als Wärme entzogen.",
      "explanation": "Lies und verstehe zunächst die Antwort. Decke sie dann ab und beantworte die Frage selbst. „Wasser kühlt“ allein erklärt den Zusammenhang noch nicht; entscheidend sind Energiebedarf und Wärmeentzug.",
      "prompt": "Warum kann verdunstendes Wasser eine Oberfläche kühlen? Erkläre den Zusammenhang ohne Vorlage.",
      "criteria": [
        "Meine Antwort nennt, dass Verdunsten Energie benötigt.",
        "Meine Antwort erklärt den Wärmeentzug an Oberfläche und Umgebung.",
        "Ich habe meine Erklärung mit der Vorlage verglichen und Fehler korrigiert."
      ],
      "ownCriteria": [
        "Ich habe eine klare Frage zu meinem Material gestellt.",
        "Ich habe die Antwort ohne Vorlage versucht.",
        "Ich habe fehlende oder falsche Teile am Original geprüft und korrigiert."
      ],
      "transfer": "Formuliere zu deinem eigenen Material eine konkrete Frage. Antworte zunächst ohne Vorlage, vergleiche danach und versuche es später erneut. Die App nutzt Abrufversuche auch in ihren Trainingseinheiten."
    },
    {
      "id": "spaced-practice",
      "title": "Verteiltes Wiederholen",
      "purpose": "Du verteilst Abrufversuche auf mehrere Zeitpunkte. Damit prüfst du das Behalten nach einer Pause, statt eine Antwort nur unmittelbar nach dem Lesen zu wiederholen.",
      "limit": "Es gibt keinen festen Abstand, der für alle Inhalte und Menschen passt. Schwierigkeit, Vorwissen und gewünschte Behaltedauer spielen eine Rolle. Diese kurze Übung erklärt das Vorgehen; langfristiges Behalten zeigt sich erst bei späteren Abrufen.",
      "steps": [
        "Lerne eine überschaubare Information und prüfe sie einmal ohne Vorlage.",
        "Plane einen späteren Abruf mit zeitlichem Abstand.",
        "Versuche zuerst selbst zu antworten, bevor du die Lösung öffnest.",
        "Bei einem Fehler: Bedeutung klären, korrigieren und wieder abrufen. Wähle den nächsten Abstand kürzer, wenn der Abruf zu schwer war.",
        "Wenn der Abruf zuverlässig gelingt, kann der nächste Abstand länger werden.",
        "Für gespeicherte Trainingsinhalte nutzt ANITEW bereits ein Wiederholungssystem. Folge den fälligen Wiedersehen statt parallel einen zweiten Plan zu führen."
      ],
      "example": "Mira lernt einen neuen Begriff. Sie erklärt ihn ohne Vorlage. Nach einer Pause versucht sie es erneut und bemerkt eine Lücke. Sie vergleicht mit der richtigen Erklärung, korrigiert die Lücke und setzt den nächsten Abruf früher an. Erst nach zuverlässigen Abrufen vergrößert sie den Abstand.",
      "explanation": "Die Pause und der eigene Abruf sind entscheidend. Zehnmal direkt hintereinander zu lesen ersetzt keinen späteren Abruf. Miras Fehler zeigt ihr, wo sie nacharbeiten und den Abstand anpassen sollte.",
      "prompt": "Beschreibe Miras Vorgehen: Was tut sie vor dem Nachsehen? Wie reagiert sie auf die Lücke? Wann kann der Abstand größer werden?",
      "criteria": [
        "Ich nenne den eigenen Abruf vor dem Nachsehen.",
        "Ich nenne Vergleich, Korrektur und einen kürzeren nächsten Abstand nach einem schwierigen Abruf.",
        "Ich vergrößere Abstände erst bei zuverlässigem Abruf; ich behaupte keinen für alle gültigen Zeitplan."
      ],
      "allowOwn": false,
      "transfer": "Nutze die fälligen Wiedersehen für deine gespeicherten Trainingsinhalte. Für Material außerhalb der App plane einen späteren Selbsttest; passe den Abstand an den tatsächlichen Abruf an. Ein abgeschlossener Lesekurs legt noch keine neuen Wiederholungskarten an."
    },
    {
      "id": "meaningful-groups",
      "title": "Sinnvolle Einheiten bilden",
      "purpose": "Du ordnest einzelne Informationen in verständliche Gruppen. Eine passende Struktur kann dir helfen, Inhalte zu überblicken und beim Abruf systematisch nach ihnen zu suchen.",
      "limit": "Gruppieren allein garantiert keinen vollständigen Abruf. Die Gruppen müssen für dich sinnvoll sein; fremde Fachbegriffe werden nicht durch eine Überschrift verständlich. Wenn die ursprüngliche Reihenfolge zählt, musst du sie zusätzlich üben.",
      "steps": [
        "Kläre, was du behalten möchtest: Inhalte, Reihenfolge oder beides.",
        "Suche Gemeinsamkeiten oder Beziehungen zwischen den Informationen.",
        "Bilde wenige übersichtliche Gruppen und gib jeder eine aussagekräftige Überschrift.",
        "Erkläre, warum die einzelnen Teile zu ihrer Gruppe gehören.",
        "Verdecke die Vorlage. Rufe zuerst die Gruppen und dann ihre Inhalte ab.",
        "Vergleiche mit dem Original, ergänze fehlende Teile und versuche es später erneut."
      ],
      "example": "Apfel · Hammer · Hemd · Birne · Säge · Jacke · Banane · Zange · Hose",
      "explanation": "Eine mögliche Ordnung: Obst (Apfel, Birne, Banane), Werkzeug (Hammer, Säge, Zange), Kleidung (Hemd, Jacke, Hose). Die drei Überschriften geben dir Suchhilfen. In dieser Übung zählen alle neun Begriffe; ihre ursprüngliche Reihenfolge ist nicht das Lernziel.",
      "prompt": "Nenne ohne Vorlage die drei Gruppen und möglichst alle neun Begriffe. Die Reihenfolge innerhalb einer Gruppe ist frei.",
      "criteria": [
        "Ich habe die drei Gruppen Obst, Werkzeug und Kleidung genannt.",
        "Ich habe alle neun Begriffe mit der Vorlage abgeglichen und fehlende oder zusätzliche Begriffe korrigiert.",
        "Ich kann begründen, weshalb die Begriffe in ihre Gruppen passen."
      ],
      "ownCriteria": [
        "Meine Gruppen haben nachvollziehbare Überschriften.",
        "Ich habe die Inhalte ohne Vorlage abgerufen und mit dem Original abgeglichen.",
        "Ich habe geprüft, ob eine notwendige Reihenfolge oder Beziehung beim Gruppieren erhalten bleibt."
      ],
      "transfer": "Gliedere einen eigenen Abschnitt nach Gedanken oder eine Liste nach sinnvollen Kategorien. Erfinde keine Gruppen nur für eine bestimmte Anzahl. Prüfe immer auch den vollständigen Inhalt, nicht nur die Überschriften."
    },
    {
      "id": "self-explanation",
      "title": "Zusammenhänge selbst erklären",
      "purpose": "Du erklärst mit eigenen Worten, warum ein Schritt sinnvoll ist oder wie zwei Aussagen zusammenhängen. So kannst du Verständnislücken entdecken, die beim bloßen Lesen unauffällig bleiben.",
      "limit": "Eine flüssige Erklärung kann trotzdem falsch sein. Prüfe sie an einer zuverlässigen Vorlage und kennzeichne Unsicherheit. Die Methode ergänzt das Üben; sie ersetzt weder Fachwissen noch eine Prüfung deiner Erklärung.",
      "steps": [
        "Wähle einen überschaubaren Zusammenhang, den du verstehen möchtest.",
        "Frage: Warum folgt dieser Schritt? Was bleibt gleich? Was würde sich bei anderen Bedingungen ändern?",
        "Formuliere deine Erklärung ohne die Vorlage zu kopieren.",
        "Vergleiche sie mit der Begründung im Original. Trenne gesicherte Aussagen von Vermutungen.",
        "Korrigiere Lücken und wende die Erklärung auf ein ähnliches Beispiel an.",
        "Erkläre den Zusammenhang später noch einmal ohne Vorlage."
      ],
      "example": "Drei Viertel sind gleich viel wie sechs Achtel: 3/4 = 6/8. Wenn jedes der vier gleich großen Teile noch einmal halbiert wird, entstehen acht gleich große Teile. Die drei ausgewählten Viertel bestehen dann aus sechs Achteln. Die ausgewählte Menge bleibt gleich.",
      "explanation": "„Oben und unten mal zwei“ beschreibt eine Rechenregel. Die Erklärung mit den halbierten Teilen begründet, warum sich der Wert nicht ändert. Zum Übertragen kannst du überlegen, weshalb 2/3 und 4/6 denselben Anteil beschreiben.",
      "prompt": "Erkläre ohne Vorlage, warum 3/4 und 6/8 gleich viel sind. Übertrage die Begründung anschließend auf 2/3 und 4/6.",
      "criteria": [
        "Ich erkläre, dass jedes gleich große Teil noch einmal halbiert wird.",
        "Ich erkläre, weshalb die ausgewählte Menge unverändert bleibt.",
        "Ich habe die Begründung auf 2/3 und 4/6 übertragen und mit dem beschriebenen Prinzip verglichen."
      ],
      "ownCriteria": [
        "Ich habe eine Warum- oder Wie-Frage zu meinem Material beantwortet.",
        "Ich habe meine Erklärung an der Vorlage geprüft und Vermutungen nicht als gesicherte Fakten behandelt.",
        "Ich habe die Erklärung auf ein ähnliches Beispiel angewandt oder eine Grenze ihrer Anwendung benannt."
      ],
      "transfer": "Nimm einen Schritt aus deinem Lernstoff und erkläre, warum er gilt. Suche ein ähnliches Beispiel und prüfe deine Erklärung daran. Wenn du die Begründung nicht verlässlich prüfen kannst, halte die offene Frage fest, statt Sicherheit vorzutäuschen."
    },
    {
      "id": "story-method",
      "title": "Begriffe durch Geschichten verbinden",
      "purpose": "Du verbindest Begriffe durch eine vorgestellte Handlung. Die Verbindung kann helfen, eine kurze Liste in ihrer Reihenfolge abzurufen.",
      "limit": "Eine einprägsame Geschichte enthält nicht automatisch den Wortlaut eines Textes. Prüfe, ob du aus deinen Bildern wieder die gemeinten Begriffe ableiten kannst.",
      "steps": [
        "Wähle wenige konkrete Begriffe.",
        "Verbinde sie in der gewünschten Reihenfolge durch eine Handlung.",
        "Stelle dir die Handlung vor; jedes Bild soll zum nächsten führen.",
        "Verdecke die Liste und gehe die Geschichte gedanklich durch.",
        "Nenne die Begriffe, vergleiche die Reihenfolge und verbessere unklare Verbindungen."
      ],
      "example": "Schlüssel → Zitrone → Fahrrad",
      "explanation": "Ein riesiger Schlüssel drückt eine Zitrone aus. Ihr Saft setzt die Räder eines Fahrrads in Bewegung. Beide Übergänge sind Handlungen; drei unverbundene Bilder hätten diese Verbindung nicht.",
      "prompt": "Nenne die drei Begriffe in der richtigen Reihenfolge und beschreibe die verbindenden Handlungen.",
      "criteria": [
        "Ich habe Schlüssel, Zitrone und Fahrrad in dieser Reihenfolge genannt.",
        "Ich habe die Handlung vom Schlüssel zur Zitrone und von der Zitrone zum Fahrrad erklärt.",
        "Ich habe meinen Abruf an der Vorlage geprüft."
      ],
      "transfer": "Probiere eine eigene kurze Liste. Wenn ein Begriff fehlt, verbessere den Übergang zu ihm. Die vorhandene Geschichten-Lektion im Training bleibt zusätzlich verfügbar.",
      "ownCriteria": [
        "Ich habe meine Begriffe in der benötigten Reihenfolge abgerufen.",
        "Meine Geschichte verbindet aufeinanderfolgende Begriffe durch klare Handlungen.",
        "Ich habe fehlende Begriffe mit der ursprünglichen Liste abgeglichen."
      ]
    },
    {
      "id": "method-of-loci",
      "title": "Orte als Gedächtnisstützen nutzen",
      "purpose": "Bei der Loci-Methode legst du vorgestellte Inhalte an feste Orte eines vertrauten Weges. Beim gedanklichen Abgehen helfen die Orte, die Inhalte wiederzufinden.",
      "limit": "Lerne zuerst einen stabilen Weg. Zu viele ähnliche Bilder am selben Ort können sich verwechseln. Die Orte unterstützen Struktur und Reihenfolge, nicht automatisch exakte Formulierungen.",
      "steps": [
        "Wähle einen vertrauten Weg mit klar unterscheidbaren Stationen.",
        "Lege eine feste Reihenfolge fest und gehe sie einmal ohne Lerninhalt durch.",
        "Verbinde pro Station einen Begriff durch ein deutliches vorgestelltes Ereignis mit dem Ort.",
        "Gehe die Stationen ohne Vorlage ab und nenne die Begriffe.",
        "Vergleiche den Abruf. Verbessere verwechselbare Orte oder schwache Bilder."
      ],
      "example": "Beispielweg: Haustür → Schuhregal → Küchentisch. Begriffe: Brot → Seife → Kerze.",
      "explanation": "An der Haustür klemmt ein riesiges Brot. Das Schuhregal quillt vor Seifenschaum über. Auf dem Küchentisch steht eine leuchtende Kerze. Der Weg dient hier nur als Beispiel; für eigenes Lernen eignet sich ein tatsächlich vertrauter Weg.",
      "prompt": "Gehe die drei Stationen gedanklich ab. Schreibe zu jeder Station den zugehörigen Begriff.",
      "criteria": [
        "Ich ordne Brot der Haustür, Seife dem Schuhregal und Kerze dem Küchentisch zu.",
        "Ich habe die Stationen in der festgelegten Reihenfolge abgerufen.",
        "Ich habe die Zuordnungen mit der Vorlage verglichen."
      ],
      "transfer": "Lege im bestehenden Gedächtnispalast der App deinen vertrauten Weg an oder nutze einen vorhandenen. Beginne mit wenigen Stationen und prüfe, ob du jeden Ort sicher unterscheiden kannst.",
      "allowOwn": false
    },
    {
      "id": "keyword-method",
      "title": "Neue Vokabeln mit Schlüsselwörtern verbinden",
      "purpose": "Ein ähnlich klingendes bekanntes Wort kann als Brücke zu einer fremdsprachigen Bedeutung dienen. Du verknüpfst das Schlüsselwort bildlich mit der Bedeutung und prüfst danach die echte Vokabel.",
      "limit": "Ein ähnlicher Klang ist keine korrekte Aussprache. Nicht für jedes Wort gibt es eine gute Brücke. Die Methode ersetzt weder Ausspracheprüfung noch Schreibweise und Verwendung im Satz.",
      "steps": [
        "Prüfe Bedeutung und korrekte Aussprache der neuen Vokabel.",
        "Suche ein bekanntes Wort mit ähnlichem Klang.",
        "Verbinde dieses Schlüsselwort und die Bedeutung durch eine klare Vorstellung.",
        "Rufe die Bedeutung aus der Vokabel ab und danach die Vokabel aus der Bedeutung.",
        "Prüfe das Original: Aussprache, Schreibweise und ein passender Beispielsatz."
      ],
      "example": "Englisch: bell = Glocke. Beispielsatz: The bell rings. = Die Glocke läutet.",
      "explanation": "Als deutsche Klangbrücke kann „bellen“ dienen: Du stellst dir eine Glocke vor, die wie ein Hund bellt. „Bellen“ ist die Eselsbrücke, nicht die englische Aussprache von bell.",
      "prompt": "Welche englische Vokabel bedeutet Glocke? Schreibe die Vokabel, ihre Bedeutung und den Beispielsatz aus dem Gedächtnis.",
      "criteria": [
        "Ich habe bell und Glocke richtig zugeordnet.",
        "Ich habe „The bell rings.“ mit der Vorlage verglichen.",
        "Ich unterscheide die Klangbrücke von der echten Aussprache und prüfe diese bei Unsicherheit an einer verlässlichen Quelle."
      ],
      "transfer": "Teste die Technik an einer Vokabel, die du wirklich brauchst. Prüfe auch die Gegenrichtung: Kannst du aus der Bedeutung die fremdsprachige Form abrufen? Verwirrt dich das Schlüsselwort, ändere die Brücke oder nutze direktes Abrufen.",
      "allowOwn": false
    },
    {
      "id": "number-images",
      "title": "Zahlen in Bilder übersetzen",
      "purpose": "Das Major-System ordnet Ziffern Konsonantenlaute zu. Daraus bildest du ein Wort und stellst dir ein Bild vor. Dieses Bild soll sich wieder in die Zahl zurückübersetzen lassen.",
      "limit": "Du musst die Zuordnungen zuerst lernen. Ein Bild ohne verlässliche Rückübersetzung hilft beim Zahlenabruf nicht. Dieser Einstieg übt nur zwei Ziffern; die vorhandenen Major-Lektionen vermitteln weitere Zuordnungen.",
      "steps": [
        "Lerne zunächst wenige feste Ziffer-Laut-Paare.",
        "Lies die Laute in der Reihenfolge der Ziffern.",
        "Ergänze passende Vokale zu einem bildhaften Wort.",
        "Prüfe die Konsonantenlaute: Enthält das Wort zusätzliche zählende Laute?",
        "Rufe aus dem Bild das Wort und aus dessen Lauten wieder die Zahl ab."
      ],
      "example": "1 → t/d; 2 → n. Die Zahl 12 kann zum Bild einer Tanne werden: t + n.",
      "explanation": "Die Vokale zählen hier nicht. Das doppelt geschriebene n in Tanne ist ein Konsonantenlaut. Beim Rückweg erhältst du t → 1 und n → 2, also 12. Entscheidend ist der Klang, nicht die Anzahl geschriebener Buchstaben.",
      "prompt": "Welche Zahl steckt im Bild Tanne? Erkläre den Rückweg über die beiden Konsonantenlaute.",
      "criteria": [
        "Ich habe 12 als Zahl genannt.",
        "Ich habe t der 1 und n der 2 zugeordnet.",
        "Ich habe erklärt, warum Vokale und das doppelt geschriebene n hier keine weitere Ziffer ergeben."
      ],
      "transfer": "Übe die weiteren festen Zuordnungen in den bestehenden Major-Lektionen. Füge erst dann längere Zahlenfolgen hinzu. Prüfe bei jedem eigenen Bild den Rückweg zur exakten Zahl.",
      "allowOwn": false
    },
    {
      "id": "interleaved-practice",
      "title": "Passende Vorgehensweisen unterscheiden",
      "purpose": "Beim gezielten Mischen wechselst du zwischen ähnlichen Aufgabentypen und entscheidest selbst, welches Vorgehen passt. So übst du auch die Auswahl einer Methode.",
      "limit": "Lerne neue Vorgehensweisen zuerst an klaren Beispielen. Wahlloses Themenwechseln oder Multitasking ist nicht dasselbe. Ob das Mischen hilft, hängt auch vom Material und deinem Vorwissen ab.",
      "steps": [
        "Verstehe die einzelnen Vorgehensweisen zunächst getrennt.",
        "Mische anschließend wenige verwandte Aufgabentypen.",
        "Bestimme vor dem Rechnen oder Antworten, welcher Typ vorliegt und warum.",
        "Löse die Aufgabe und prüfe Auswahl und Ergebnis getrennt.",
        "Arbeite Fehler gezielt nach und kehre danach zur gemischten Übung zurück."
      ],
      "example": "Rechteck: Fläche = Länge × Breite. Dreieck: Fläche = Grundseite × zugehörige Höhe ÷ 2. Beispiel: Ein Rechteck mit 4 cm Länge und 3 cm Breite hat 12 cm². Ein Dreieck mit 4 cm Grundseite und 3 cm zugehöriger Höhe hat 6 cm².",
      "explanation": "Gleiche Zahlen verlangen nicht automatisch dieselbe Rechnung. Die Figur entscheidet: Beim Dreieck gehört der Faktor ein Halb dazu. In gemischten Aufgaben muss die Aufgabenart erkannt werden, bevor die Regel angewandt wird.",
      "prompt": "Aufgabe A: Dreieck mit Grundseite 6 cm und zugehöriger Höhe 4 cm. Aufgabe B: Rechteck mit Länge 6 cm und Breite 4 cm. Nenne jeweils die passende Regel und die Fläche.",
      "criteria": [
        "A: Ich habe die Dreiecksregel gewählt und 12 cm² erhalten.",
        "B: Ich habe die Rechtecksregel gewählt und 24 cm² erhalten.",
        "Ich begründe die unterschiedliche Rechnung mit der Aufgabenart, nicht mit der Reihenfolge der Aufgaben."
      ],
      "transfer": "Wähle zwei oder drei bereits eingeführte, verwandte Aufgabentypen aus deinem Lernstoff. Mische sie und begründe vor jeder Lösung deine Auswahl des Vorgehens.",
      "allowOwn": false
    }
  ],
  "en": [
    {
      "id": "text-meaning",
      "title": "Remember the meaning of long texts",
      "purpose": "Learn to recall the ideas and relationships in a text without looking. Use this for factual reading, presentations and exam preparation.",
      "limit": "A summary does not preserve every detail. Practise exact numbers or wording separately when needed. Start with a short passage and increase its length after you can explain it.",
      "steps": [
        "Read a passage and clarify unfamiliar terms.",
        "Group it by ideas and give each group a short heading.",
        "Ask a question for each part: what happens, why, and with what result?",
        "Hide the source and answer in your own words.",
        "Compare with the original. Correct missing ideas and mistaken connections.",
        "Recall it again later. Adjust the interval to how reliably you remember."
      ],
      "example": "A town plants trees beside a busy road. Their crowns provide shade. Water evaporates through the leaves and contributes to cooling. To remain healthy during dry weather, the trees need enough water and room for their roots.",
      "explanation": "Three groups: action (planting trees), effects (shade and evaporation), and requirements (water and root space). The outline preserves their relationship.",
      "prompt": "Without looking, explain the action, how it works and what it requires.",
      "criteria": [
        "Trees are planted beside the road.",
        "Shade and evaporation contribute to cooling.",
        "Water and root space are identified as requirements."
      ],
      "transfer": "Choose a short factual text of your own. Write three guiding questions, put the text away and answer them. Gradually increase the length."
    },
    {
      "id": "text-verbatim",
      "title": "Learn a text word for word",
      "purpose": "Practise exact wording for a poem, definition or short speech. Small words and their order matter too.",
      "limit": "Exact recall does not prove understanding. Clarify the meaning first. Mental images may support the order of ideas but cannot replace practice of the actual wording.",
      "steps": [
        "Understand the text and choose a short meaningful passage.",
        "Read it carefully and say it clearly once.",
        "Hide it and say or write it from memory.",
        "Compare word for word. Correct omissions, changes in order and added words.",
        "Practise the next passage, then the transition between them. Sometimes start in the middle.",
        "Recall it again later without looking. Extend the passage after the current part becomes reliable."
      ],
      "example": "In the morning I open the window. Fresh air flows into the room. Then I begin my day.",
      "explanation": "The three sentences form three practice units. Learn the first, then the second and their transition. Start a later attempt at “Fresh air …” as well.",
      "prompt": "Write the three sentences as accurately as you can from memory.",
      "criteria": [
        "All words are present in the correct order.",
        "I can move between sentences without looking.",
        "I can explain what the text means."
      ],
      "transfer": "Choose a short passage whose wording matters to you. Compare it with its source yourself; a paraphrase does not meet this particular goal."
    },
    {
      "id": "long-words",
      "title": "Remember long words",
      "purpose": "Break a long word into meaningful parts, put them together again and practise its meaning, pronunciation and spelling.",
      "limit": "Meaningful parts are not always spoken syllables. Some technical terms are unfamiliar throughout. Check their meaning and pronunciation before practising.",
      "steps": [
        "Clarify the meaning of the whole word.",
        "Identify familiar parts and explain what they contribute.",
        "Notice spelling changes and connecting elements.",
        "Say the parts slowly, then say the whole word fluently. Syllable boundaries may differ from meaning boundaries.",
        "Hide the example, write the whole word and explain it.",
        "Check spelling and meaning. Practise uncertain parts, then put the whole word together again."
      ],
      "example": "unpredictability",
      "explanation": "un | predict | ability: the quality of being difficult or impossible to predict. The final e of “predictable” does not remain in “unpredictability”. These are useful meaning units, not a pronunciation guide.",
      "prompt": "Write the complete word from memory. Then explain its meaning aloud and say it fluently.",
      "criteria": [
        "The whole word is spelled correctly.",
        "I can explain its meaning.",
        "I said the whole word aloud; if unsure, I check a reliable pronunciation source."
      ],
      "transfer": "Choose a long word relevant to your life. Find meaningful parts, then practise the whole word. Use the word formation and pronunciation rules of its language."
    },
    {
      "id": "active-recall",
      "title": "Active recall",
      "purpose": "Try to retrieve information without looking at its source. This shows what you can bring to mind and what needs more work. Use it for facts, concepts and relationships.",
      "limit": "Recognising an answer while reading it does not mean you can retrieve it yourself. A failed attempt is not a final verdict: check and understand the correct answer, then try again. Repeated guessing without feedback can reinforce errors.",
      "steps": [
        "Choose a small piece of information you understand.",
        "Ask a clear question that the material answers.",
        "Put the source away and answer before checking.",
        "Compare with the original. Correct missing or mistaken parts.",
        "Hide the answer and try retrieving it again.",
        "Test yourself later as well. Immediate repetition may feel easy without showing lasting retention."
      ],
      "example": "Question: Why can evaporating water cool a surface?\nAnswer: Evaporation requires energy. That energy is taken from the surface and its surroundings as heat.",
      "explanation": "Read and understand the answer first. Then hide it and answer the question yourself. “Water cools” alone does not explain the relationship: the energy requirement and heat transfer matter.",
      "prompt": "Why can evaporating water cool a surface? Explain without looking.",
      "criteria": [
        "My answer states that evaporation requires energy.",
        "My answer explains that heat is taken from the surface and surroundings.",
        "I compared my explanation with the source and corrected mistakes."
      ],
      "ownCriteria": [
        "I asked a clear question about my material.",
        "I attempted an answer without looking.",
        "I checked and corrected missing or mistaken parts against the source."
      ],
      "transfer": "Write a specific question about your own material. Answer without looking, compare afterwards, then try again later. ANITEW also uses retrieval attempts in its training sessions."
    },
    {
      "id": "spaced-practice",
      "title": "Spaced practice",
      "purpose": "Spread retrieval attempts over time. This tests retention after a delay rather than simply repeating an answer immediately after reading it.",
      "limit": "No single interval suits every person and topic. Difficulty, prior knowledge and the desired retention period matter. This short exercise explains the approach; lasting retention can only be checked with later attempts.",
      "steps": [
        "Learn a manageable piece of information and retrieve it once without looking.",
        "Plan another retrieval attempt after a delay.",
        "Try answering before you reveal the solution.",
        "After an error, clarify the meaning, correct it and retrieve again. Shorten the next interval if retrieval was too difficult.",
        "As retrieval becomes reliable, the next interval can increase.",
        "ANITEW already schedules reviews for stored training items. Follow the due reviews instead of keeping a competing schedule."
      ],
      "example": "Mira learns a new concept and explains it without looking. After a break she tries again and finds a gap. She compares with the correct explanation, fixes the gap and schedules the next attempt sooner. Only after reliable retrieval does she increase the interval.",
      "explanation": "The delay and the retrieval attempt matter. Reading ten times in a row cannot replace a later retrieval attempt. The error tells Mira what to revisit and helps her adjust the interval.",
      "prompt": "Describe Mira’s approach: what does she do before checking? How does she respond to the gap? When can she increase the interval?",
      "criteria": [
        "I describe retrieval before checking the answer.",
        "I describe comparison, correction and a shorter next interval after difficult retrieval.",
        "I increase intervals after reliable retrieval and do not claim a universal schedule."
      ],
      "allowOwn": false,
      "transfer": "Use the due reviews for your stored training items. For material outside the app, plan a later self-test and adjust the interval to actual retrieval. Completing this reading course does not create new review cards."
    },
    {
      "id": "meaningful-groups",
      "title": "Build meaningful groups",
      "purpose": "Organise individual pieces of information into meaningful groups. A useful structure can help you see the material clearly and search for it systematically during recall.",
      "limit": "Grouping alone does not guarantee complete recall. The groups must make sense to you; a heading does not explain unfamiliar technical terms. If the original order matters, practise that separately.",
      "steps": [
        "Clarify your goal: the content, its order, or both.",
        "Look for shared features or relationships.",
        "Create a few manageable groups with informative headings.",
        "Explain why each item belongs in its group.",
        "Hide the source. Recall the groups first, then their contents.",
        "Compare with the original, correct missing items and try again later."
      ],
      "example": "Apple · hammer · shirt · pear · saw · jacket · banana · pliers · trousers",
      "explanation": "One possible structure: fruit (apple, pear, banana), tools (hammer, saw, pliers), clothing (shirt, jacket, trousers). The headings provide search cues. This exercise asks you to remember all nine items; their original order is not the learning goal.",
      "prompt": "Recall the three groups and as many of the nine items as possible without looking. The order within a group is up to you.",
      "criteria": [
        "I named the groups fruit, tools and clothing.",
        "I checked all nine items against the source and corrected missing or extra items.",
        "I can explain why the items fit their groups."
      ],
      "ownCriteria": [
        "My groups have meaningful headings.",
        "I recalled the content without looking and checked it against the source.",
        "I checked that grouping preserved any order or relationship that matters."
      ],
      "transfer": "Organise your own passage by ideas or a list by meaningful categories. Do not invent groups just to reach a particular number. Check the full content as well as the headings."
    },
    {
      "id": "self-explanation",
      "title": "Explain relationships yourself",
      "purpose": "Explain in your own words why a step makes sense or how two statements relate. This can reveal gaps in understanding that are easy to miss while reading.",
      "limit": "A fluent explanation can still be wrong. Check it against a reliable source and acknowledge uncertainty. This method supports practice; it does not replace subject knowledge or checking your explanation.",
      "steps": [
        "Choose a manageable relationship you want to understand.",
        "Ask why the step follows, what stays the same and what would change under different conditions.",
        "Formulate an explanation without copying the source.",
        "Compare it with the original reasoning. Separate established facts from guesses.",
        "Correct gaps and apply your explanation to a similar example.",
        "Explain the relationship again later without looking."
      ],
      "example": "Three quarters equals six eighths: 3/4 = 6/8. Halving each of four equal parts creates eight equal parts. The three selected quarters now consist of six eighths. The selected amount stays the same.",
      "explanation": "“Multiply the top and bottom by two” describes a rule. Halving the equal parts explains why the value does not change. To transfer the idea, consider why 2/3 and 4/6 describe the same proportion.",
      "prompt": "Explain without looking why 3/4 and 6/8 are equal. Then apply your reasoning to 2/3 and 4/6.",
      "criteria": [
        "I explain that each equal part is halved again.",
        "I explain why the selected amount stays the same.",
        "I applied the reasoning to 2/3 and 4/6 and checked it against the same principle."
      ],
      "ownCriteria": [
        "I answered a why or how question about my material.",
        "I checked my explanation against the source instead of treating guesses as facts.",
        "I applied my explanation to a similar example or identified a limit to its use."
      ],
      "transfer": "Choose a step in your learning material and explain why it holds. Find a similar example and check your explanation with it. If you cannot verify the reasoning reliably, record the open question instead of pretending to be certain."
    },
    {
      "id": "story-method",
      "title": "Connect items through stories",
      "purpose": "Connect items through an imagined action. The links can help you recall a short list in its intended order.",
      "limit": "A memorable story does not automatically preserve the exact wording of a text. Check whether your images lead back to the intended items.",
      "steps": [
        "Choose a few concrete items.",
        "Connect them through actions in the required order.",
        "Imagine the actions, making each image lead to the next.",
        "Hide the list and mentally follow the story.",
        "Name the items, check the order and improve unclear links."
      ],
      "example": "Key → lemon → bicycle",
      "explanation": "A giant key squeezes a lemon. Its juice makes a bicycle’s wheels turn. Both transitions are actions; three separate images would not provide those links.",
      "prompt": "Recall the three items in order and describe the actions connecting them.",
      "criteria": [
        "I named key, lemon and bicycle in that order.",
        "I explained the action from key to lemon and from lemon to bicycle.",
        "I checked my recall against the source."
      ],
      "transfer": "Try a short list of your own. If an item is missing, improve the link leading to it. The existing story lesson in training remains available.",
      "ownCriteria": [
        "I recalled my items in the required order.",
        "My story connects successive items through clear actions.",
        "I checked missing items against the original list."
      ]
    },
    {
      "id": "method-of-loci",
      "title": "Use places as memory cues",
      "purpose": "In the method of loci, you place imagined content at fixed locations along a familiar route. Walking the route in your mind provides cues for retrieving it.",
      "limit": "Learn a stable route first. Similar images at the same location can be confused. Locations support structure and order, not automatically exact wording.",
      "steps": [
        "Choose a familiar route with clearly distinct locations.",
        "Fix their order and rehearse the route without learning material.",
        "Connect one item to each location through a vivid imagined event.",
        "Walk the route without looking and name the items.",
        "Compare your recall and improve confusing locations or weak images."
      ],
      "example": "Example route: front door → shoe rack → kitchen table. Items: bread → soap → candle.",
      "explanation": "A giant loaf blocks the front door. The shoe rack overflows with soap foam. A candle glows on the kitchen table. This is only an example route; use a genuinely familiar route for your own learning.",
      "prompt": "Mentally visit the three locations. Write the item associated with each location.",
      "criteria": [
        "I assigned bread to the front door, soap to the shoe rack and candle to the kitchen table.",
        "I recalled the locations in their fixed order.",
        "I compared the associations with the source."
      ],
      "transfer": "Use the app’s existing memory palace to create a familiar route or use an available one. Start with a few locations and check that you can clearly distinguish them.",
      "allowOwn": false
    },
    {
      "id": "keyword-method",
      "title": "Connect vocabulary through keywords",
      "purpose": "A familiar word with a similar sound can provide a bridge to a foreign word’s meaning. Connect the keyword and the meaning in an image, then check the actual word.",
      "limit": "A similar sound is not the correct pronunciation. Some words offer no useful keyword. Check pronunciation, spelling and use in a sentence separately.",
      "steps": [
        "Check the new word’s meaning and correct pronunciation.",
        "Find a familiar word with a similar sound.",
        "Imagine a clear connection between that keyword and the meaning.",
        "Retrieve the meaning from the word, then the word from its meaning.",
        "Check the original pronunciation, spelling and an example sentence."
      ],
      "example": "French: pain = bread. Example: Je mange du pain. = I eat bread.",
      "explanation": "The English word “pan” can be a rough sound cue: imagine bread leaping out of a pan. French pain has a nasal vowel and is not pronounced like English pan or pain. The cue is a memory bridge, not a pronunciation model.",
      "prompt": "Which French word means bread? Write the word, its meaning and the example sentence from memory.",
      "criteria": [
        "I correctly matched pain with bread.",
        "I compared “Je mange du pain.” with the source.",
        "I distinguish the sound cue from actual French pronunciation and check a reliable pronunciation source when unsure."
      ],
      "transfer": "Try a word you actually need. Test the reverse direction too: can you retrieve the foreign form from its meaning? If the keyword confuses you, change the bridge or use direct retrieval.",
      "allowOwn": false
    },
    {
      "id": "number-images",
      "title": "Turn numbers into images",
      "purpose": "The Major System assigns consonant sounds to digits. Use them to form a word and imagine an image that can be decoded back into the number.",
      "limit": "Learn the mappings first. An image that cannot be decoded reliably does not help exact number recall. This introduction uses two digits; the existing Major lessons teach further mappings.",
      "steps": [
        "Learn a few fixed digit-to-sound pairs first.",
        "Read the sounds in the order of the digits.",
        "Add vowels to form a concrete word.",
        "Check whether the word contains additional consonant sounds that would encode extra digits.",
        "Retrieve the word from the image and decode its sounds back into the number."
      ],
      "example": "1 → t/d; 2 → n. The number 12 can become an image of a tin: t + n.",
      "explanation": "The vowel does not count here. In the reverse direction, t gives 1 and n gives 2, recovering 12. The sound pattern matters, not merely the written letters.",
      "prompt": "Which number does the image of a tin encode? Explain the reverse path through the two consonant sounds.",
      "criteria": [
        "I gave 12 as the number.",
        "I mapped t to 1 and n to 2.",
        "I explained why the vowel adds no digit."
      ],
      "transfer": "Practise further fixed mappings in the existing Major lessons before tackling longer numbers. Check that every image you create decodes to the exact intended number.",
      "allowOwn": false
    },
    {
      "id": "interleaved-practice",
      "title": "Choose between related approaches",
      "purpose": "Mix related types of tasks and choose the appropriate approach yourself. This practises selecting a method as well as applying it.",
      "limit": "First learn new approaches through clear examples. Random topic switching or multitasking is different. Benefits depend on the material and your prior knowledge.",
      "steps": [
        "Understand each approach separately first.",
        "Then mix a few related task types.",
        "Before answering, identify the type and explain your choice.",
        "Solve the task and check your choice and result separately.",
        "Work on errors specifically, then return to mixed practice."
      ],
      "example": "Rectangle: area = length × width. Triangle: area = base × corresponding height ÷ 2. A rectangle 4 cm long and 3 cm wide has an area of 12 cm². A triangle with base 4 cm and corresponding height 3 cm has an area of 6 cm².",
      "explanation": "Identical numbers do not imply identical calculations. The shape determines the rule: the triangle needs the factor one half. Mixed tasks require recognising the type before applying a rule.",
      "prompt": "Task A: a triangle with base 6 cm and corresponding height 4 cm. Task B: a rectangle 6 cm long and 4 cm wide. Give the rule and area for each.",
      "criteria": [
        "A: I chose the triangle rule and obtained 12 cm².",
        "B: I chose the rectangle rule and obtained 24 cm².",
        "I justified the different calculations using the task types, not their position in the exercise."
      ],
      "transfer": "Choose two or three related task types you have already studied. Mix them and explain which approach fits before solving each one.",
      "allowOwn": false
    }
  ]
}
