import type { CourseId } from '../core/courses/progress.ts'
export interface ReadingCourse { id: CourseId; title: string; purpose: string; limit: string; steps: string[]; example: string; explanation: string; prompt: string; criteria: string[]; transfer: string }
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
    }
  ]
}
