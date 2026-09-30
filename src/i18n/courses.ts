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
    }
  ]
}
