/**
 * Die Texte fuer „Geistig aktiv bleiben" (Geraetewunsch 31.08.).
 *
 * Warum sie nicht im Woerterbuch stehen: Sechs Tipps mit Titel, Text und
 * Tagessatz in sechs Sprachen sind rund zwei Kilobyte gzip — im Kaltstart
 * gemessen (P4). Gebraucht werden sie an genau zwei Stellen, die beide
 * verzoegert laden: die Seite selbst und das Tages-Pop-up. Dasselbe Muster
 * wie bei `firstRunLayerCopy.ts`.
 *
 * Die Sperrliste gilt hier trotzdem: `tests/core/claims.test.ts` prueft
 * diese Datei mit — sonst waere das Auslagern ein Weg an der Regel vorbei,
 * und genau das darf es nicht sein.
 */

export interface BrainTipCopy {
  title: string
  body: string
  /** Die Kurzfassung fuer das Tages-Pop-up: ein Satz im Vorbeigehen. */
  daily: string
}

export interface BrainCareCopy {
  heading: string
  note: string
  honest: string
  daily: string
  dailyOff: string
  dailyOn: string
  dismiss: string
  /** Der Weg ins fordernde Training (Geraetewunsch 31.08.). */
  demanding: string
  demandingNote: string
  tips: Record<string, BrainTipCopy>
}


const DE: BrainCareCopy = {

    /*
      Geistig aktiv bleiben (Geraetewunsch 31.08.).

      Gefragt war, ob der Bereich ausdruecklich als Vorsorge gegen eine
      Erkrankung auftreten soll. Er tut es nicht — und das ist keine
      Zurueckhaltung aus Feigheit, sondern die bestehende Regel des Hauses:
      Die Sperrliste in tests/core/claims.test.ts hält genau diese Wörter
      aus allen sichtbaren Texten heraus (F7, R5), und sie hat diesen Entwurf
      beim ersten Lauf zu Recht umgeworfen. Der Bereich sagt deshalb, was mit
      geistiger Gesundheit zusammenhängt — auf Bevoelkerungsebene, mit
      unterschiedlich gutem Beleg — und verspricht keinem einzelnen Menschen
      Schutz. Die ausfuehrliche Begruendung steht in core/brainCare.ts; ein
      zweiter Test verbietet hier zusaetzlich „schuetzt vor" und „verhindert".

      `daily` ist die Kurzfassung für das Tages-Pop-up: ein Satz, den man im
      Vorbeigehen liest.
    */
    heading: 'Geistig aktiv bleiben',
    note: 'Was mit einem wachen Kopf zusammenhängt — und wie gut das jeweils belegt ist. Dieselbe Skala wie auf „Was belegt ist".',
    honest: 'Das hier sind Zusammenhänge aus Bevölkerungsdaten, keine Zusagen für dich. Kein Punkt auf dieser Seite ist ein Ersatz für ärztlichen Rat, und keiner davon macht ANITEW zu einer Gesundheitsanwendung.',
    daily: 'Tipp des Tages',
    dailyOff: 'Keinen Tipp mehr zeigen',
    dailyOn: 'Tipp des Tages zeigen',
    dismiss: 'Verstanden',
    demanding: 'Fordernde Einheit starten',
  demandingNote: 'Fünfzehn Minuten, die volle Bandbreite: Rückwärts, Zwillinge, Gedächtnispalast. Anspruch entsteht hier aus dem Training selbst — es gibt keine zweite, schwerere App darin.',
  tips: {
      sleep: {
        title: 'Schlaf räumt auf, was du gelernt hast',
        body: 'Während du schläfst, wird Gelerntes im Gedächtnis gefestigt — das ist einer der bestuntersuchten Befunde der Gedächtnisforschung. Praktisch heisst das: Eine Einheit am Abend und danach ordentlich Schlaf ist mehr wert als dieselbe Einheit in einer durchwachten Nacht.',
        daily: 'Nach dem Lernen schlafen — Schlaf festigt, was tagsüber dazukam.',
      },
      move: {
        title: 'Bewegung zeigt sich in kognitiven Tests',
        body: 'Ausdauer- und Krafttraining verbessern in Studien mit Menschen über 50 messbar die Leistung in kognitiven Tests. Was daraus für den Alltag folgt, ist damit nicht gezeigt — der Effekt ist real, aber an Tests gemessen, nicht am Leben.',
        daily: 'Ein zügiger Spaziergang zählt. Bewegung wirkt sich messbar auf kognitive Tests aus.',
      },
      risk: {
        title: 'Einiges lässt sich beeinflussen, vieles nicht',
        body: 'Eine große Übersichtsarbeit hat Faktoren zusammengetragen, die über ein ganzes Leben mit der geistigen Gesundheit im Alter zusammenhängen — darunter Hörverlust, Bluthochdruck, Rauchen, Bewegungsmangel und soziale Isolation. Das sind Zusammenhänge in großen Gruppen, keine Rechnung für einen einzelnen Menschen: Wer alles richtig macht, hat trotzdem keine Garantie, und wer erkrankt, hat nichts falsch gemacht.',
        daily: 'Hörgerät, Blutdruck, Bewegung: Manches hängt mit kognitiver Gesundheit zusammen — als Zusammenhang, nicht als Garantie.',
      },
      food: {
        title: 'Von der Ernährung ist weniger belegt, als oft behauptet',
        body: 'Die MIND-Diät galt als vielversprechend, bis eine kontrollierte Studie sie direkt prüfte: Über drei Jahre unterschied sich die kognitive Entwicklung nicht bedeutsam von der Vergleichsgruppe. Gesunde Ernährung bleibt aus vielen anderen Gründen sinnvoll — als Gedächtnismittel ist sie nicht belegt.',
        daily: 'Kein Essen macht das Gedächtnis besser. Die bekannteste Gedächtnis-Diät hielt der Prüfung nicht stand.',
      },
      think: {
        title: 'Was du nachschlägst, merkst du dir anders',
        body: 'Wer weiß, dass eine Information jederzeit verfügbar ist, behält eher, **wo** sie steht, als **was** dort steht. Das ist gut gezeigt — was es langfristig bedeutet, wenn Suchmaschinen und KI immer mehr Denkarbeit übernehmen, weiß niemand: Dazu gibt es keine Langzeitdaten. Wer etwas behalten will, kann es selbst versuchen, bevor er fragt.',
        daily: 'Erst selbst nachdenken, dann nachschlagen — was man abruft, bleibt eher.',
      },
      social: {
        title: 'Gesellschaft hängt mit kognitiver Gesundheit zusammen',
        body: 'In Langzeitbeobachtungen geht häufiger Kontakt zu anderen Menschen mit geistiger Gesundheit im Alter einher. Beobachtungen sind keine Ursachen: Es kann ebenso sein, dass sich zurückzieht, wer bereits Veränderungen bemerkt. Für sich allein ist Geselligkeit trotzdem selten die schlechteste Idee.',
        daily: 'Verabrede dich mit jemandem. Kontakt geht in Langzeitdaten mit kognitiver Gesundheit einher.',
      },
    },
}

const EN: BrainCareCopy = {

    heading: 'Staying mentally active',
    note: 'What goes together with a clear head — and how well each of it is supported. The same scale as on „What the evidence says".',
    honest: 'These are associations from population data, not promises for you. Nothing on this page replaces medical advice, and none of it makes ANITEW a health application.',
    daily: 'Tip of the day',
    dailyOff: 'Stop showing tips',
    dailyOn: 'Show tip of the day',
    dismiss: 'Got it',
    demanding: 'Start a demanding session',
  demandingNote: 'Fifteen minutes, the full range: reverse, twins, memory palace. Difficulty comes from the training itself — there is no second, harder app inside this one.',
  tips: {
      sleep: {
        title: 'Sleep settles what you learned',
        body: 'While you sleep, what you learned is consolidated in memory — one of the best studied findings in memory research. In practice: a session in the evening followed by proper sleep is worth more than the same session on a sleepless night.',
        daily: 'Sleep after learning — sleep settles what the day added.',
      },
      move: {
        title: 'Exercise shows up in cognitive tests',
        body: 'In studies with people over 50, endurance and strength training measurably improve performance on cognitive tests. What follows for everyday life is not shown by that — the effect is real, but measured on tests, not on living.',
        daily: 'A brisk walk counts. Exercise measurably affects cognitive test performance.',
      },
      risk: {
        title: 'Some things can be influenced, many cannot',
        body: 'A large review gathered factors that go together with cognitive health across a lifetime — among them hearing loss, high blood pressure, smoking, inactivity and social isolation. These are associations in large groups, not arithmetic for one person: doing everything right is still no guarantee, and falling ill is no one’s fault.',
        daily: 'Hearing aid, blood pressure, movement: some things go together with cognitive health — as association, not guarantee.',
      },
      food: {
        title: 'Less about food is supported than is often claimed',
        body: 'The MIND diet looked promising until a controlled trial tested it directly: over three years, cognitive change did not differ meaningfully from the comparison group. Eating well remains sensible for many other reasons — as a memory measure it is not supported.',
        daily: 'No food improves memory. The best known memory diet did not hold up when tested.',
      },
      think: {
        title: 'What you look up, you remember differently',
        body: 'People who know information stays available tend to remember **where** it is rather than **what** it says. That is well shown — what it means in the long run, as search engines and AI take over more thinking, nobody knows: there is no long-term data. If you want to keep something, try it yourself before you ask.',
        daily: 'Think first, look up second — what you retrieve is what tends to stay.',
      },
      social: {
        title: 'Company goes together with cognitive health',
        body: 'In long-term observations, frequent contact with other people goes together with better cognitive health in later life. Observations are not causes: it may equally be that people withdraw once they notice changes. On its own, company is still rarely the worst idea.',
        daily: 'Arrange to see someone. Contact goes together with cognitive health in long-term data.',
      },
    },
}

const FR: BrainCareCopy = {

    heading: 'Rester actif mentalement',
    note: 'Ce qui va de pair avec un esprit clair — et la solidité des preuves. La même échelle que sur « Ce qui est établi ».',
    honest: 'Ce sont des associations issues de données de population, pas des promesses pour vous. Rien ici ne remplace un avis médical, et rien ne fait d’ANITEW une application de santé.',
    daily: 'Conseil du jour',
    dailyOff: 'Ne plus afficher de conseil',
    dailyOn: 'Afficher le conseil du jour',
    dismiss: 'Compris',
    demanding: 'Lancer une séance exigeante',
  demandingNote: 'Quinze minutes, toute l’étendue : à rebours, jumeaux, palais de mémoire. L’exigence vient de l’entraînement lui-même — il n’y a pas de seconde application plus difficile à l’intérieur.',
  tips: {
      sleep: {
        title: 'Le sommeil range ce que tu as appris',
        body: 'Pendant le sommeil, ce qui a été appris se consolide en mémoire — l’un des résultats les mieux étayés de la recherche. En pratique : une séance le soir suivie d’un vrai sommeil vaut mieux que la même séance après une nuit blanche.',
        daily: 'Dors après avoir appris — le sommeil fixe ce que la journée a apporté.',
      },
      move: {
        title: 'L’activité physique se voit dans les tests cognitifs',
        body: 'Chez les personnes de plus de 50 ans, l’endurance et la musculation améliorent de façon mesurable les résultats aux tests cognitifs. Ce que cela implique au quotidien n’est pas démontré : l’effet est réel, mais mesuré sur des tests, pas sur la vie.',
        daily: 'Une marche rapide compte. L’activité physique agit de façon mesurable sur les tests cognitifs.',
      },
      risk: {
        title: 'Certaines choses se modifient, beaucoup non',
        body: 'Une grande synthèse a réuni des facteurs associés à la santé cognitive tout au long de la vie — perte auditive, hypertension, tabac, sédentarité, isolement social. Ce sont des associations dans de grands groupes, pas un calcul pour une personne : tout bien faire ne garantit rien, et tomber malade n’est la faute de personne.',
        daily: 'Audition, tension, mouvement : certaines choses vont de pair avec la santé cognitive — association, pas garantie.',
      },
      food: {
        title: 'L’alimentation est moins étayée qu’on ne le dit',
        body: 'Le régime MIND semblait prometteur jusqu’à un essai contrôlé : sur trois ans, l’évolution cognitive ne différait pas de façon notable du groupe de comparaison. Bien manger reste utile pour d’autres raisons — comme moyen mnésique, ce n’est pas établi.',
        daily: 'Aucun aliment n’améliore la mémoire. Le régime mémoire le plus connu n’a pas résisté à l’essai.',
      },
      think: {
        title: 'Ce que tu cherches, tu le retiens autrement',
        body: 'Qui sait qu’une information restera disponible retient plutôt **où** elle se trouve que **ce qu’elle dit**. C’est bien montré — ce que cela donne à long terme, alors que moteurs de recherche et IA prennent en charge de plus en plus de réflexion, personne ne le sait : il n’existe pas de données longues. Pour retenir, essaie d’abord toi-même.',
        daily: 'Réfléchis d’abord, cherche ensuite — ce que l’on rappelle est ce qui reste.',
      },
      social: {
        title: 'La compagnie va de pair avec la santé cognitive',
        body: 'Dans les suivis longs, des contacts fréquents vont de pair avec une meilleure santé cognitive. Une observation n’est pas une cause : il se peut aussi qu’on se retire lorsqu’on remarque des changements. En soi, voir du monde reste rarement une mauvaise idée.',
        daily: 'Vois quelqu’un. Le contact va de pair avec la santé cognitive dans les données longues.',
      },
    },
}

const ES: BrainCareCopy = {

    heading: 'Mantenerse mentalmente activo',
    note: 'Lo que acompaña a una mente despierta — y cuán bien está respaldado. La misma escala que en «Qué está probado».',
    honest: 'Son asociaciones de datos poblacionales, no promesas para ti. Nada de esto sustituye el consejo médico, y nada convierte a ANITEW en una aplicación de salud.',
    daily: 'Consejo del día',
    dailyOff: 'Dejar de mostrar consejos',
    dailyOn: 'Mostrar el consejo del día',
    dismiss: 'Entendido',
    demanding: 'Empezar una sesión exigente',
  demandingNote: 'Quince minutos, todo el rango: al revés, gemelos, palacio de la memoria. La dificultad surge del propio entrenamiento — no hay una segunda aplicación más difícil dentro.',
  tips: {
      sleep: {
        title: 'El sueño ordena lo aprendido',
        body: 'Mientras duermes, lo aprendido se consolida en la memoria — uno de los hallazgos mejor estudiados. En la práctica: una sesión por la tarde y luego dormir bien vale más que la misma sesión tras una noche en vela.',
        daily: 'Duerme después de aprender: el sueño fija lo que se sumó durante el día.',
      },
      move: {
        title: 'El ejercicio se nota en las pruebas cognitivas',
        body: 'En estudios con personas mayores de 50, el entrenamiento de resistencia y de fuerza mejora de forma medible el rendimiento en pruebas cognitivas. Lo que eso significa en la vida diaria no está demostrado: el efecto es real, pero medido en pruebas, no en la vida.',
        daily: 'Un paseo a buen ritmo cuenta. El ejercicio influye de forma medible en las pruebas cognitivas.',
      },
      risk: {
        title: 'Algunas cosas se pueden influir, muchas no',
        body: 'Una gran revisión reunió factores asociados a la salud cognitiva a lo largo de la vida: pérdida auditiva, hipertensión, tabaco, sedentarismo, aislamiento social. Son asociaciones en grupos grandes, no un cálculo para una persona: hacerlo todo bien no garantiza nada, y enfermar no es culpa de nadie.',
        daily: 'Audición, tensión, movimiento: algunas cosas acompañan a la salud cognitiva — asociación, no garantía.',
      },
      food: {
        title: 'De la alimentación hay menos pruebas de las que se dicen',
        body: 'La dieta MIND parecía prometedora hasta que un ensayo controlado la probó: en tres años, el cambio cognitivo no se diferenció de forma relevante del grupo de comparación. Comer bien sigue teniendo sentido por otras razones — como recurso de memoria, no está probado.',
        daily: 'Ningún alimento mejora la memoria. La dieta de memoria más conocida no resistió el ensayo.',
      },
      think: {
        title: 'Lo que consultas, lo recuerdas de otra manera',
        body: 'Quien sabe que una información seguirá disponible retiene más **dónde** está que **qué** dice. Eso está bien mostrado — qué significa a largo plazo, mientras buscadores e IA asumen cada vez más trabajo mental, no lo sabe nadie: no hay datos a largo plazo. Si quieres retener algo, inténtalo tú antes de preguntar.',
        daily: 'Piensa primero, consulta después: lo que se recupera es lo que suele quedarse.',
      },
      social: {
        title: 'La compañía acompaña a la salud cognitiva',
        body: 'En seguimientos largos, el contacto frecuente con otras personas acompaña a una mejor salud cognitiva. Observar no es causar: también puede ser que uno se retire al notar cambios. Por sí misma, la compañía rara vez es la peor idea.',
        daily: 'Queda con alguien. El contacto acompaña a la salud cognitiva en los datos largos.',
      },
    },
}

const IT: BrainCareCopy = {

    heading: 'Restare mentalmente attivi',
    note: 'Ciò che accompagna una mente lucida — e quanto è solido ogni punto. La stessa scala di «Che cosa è provato».',
    honest: 'Sono associazioni da dati di popolazione, non promesse per te. Nulla qui sostituisce il parere medico, e nulla rende ANITEW un’applicazione sanitaria.',
    daily: 'Consiglio del giorno',
    dailyOff: 'Non mostrare più consigli',
    dailyOn: 'Mostra il consiglio del giorno',
    dismiss: 'Capito',
    demanding: 'Avvia una sessione impegnativa',
  demandingNote: 'Quindici minuti, l’intera gamma: all’indietro, gemelli, palazzo della memoria. La difficoltà nasce dall’allenamento stesso — non c’è una seconda app più difficile qui dentro.',
  tips: {
      sleep: {
        title: 'Il sonno mette in ordine ciò che hai imparato',
        body: 'Mentre dormi, quanto appreso viene consolidato in memoria — uno dei risultati meglio studiati della ricerca. In pratica: una sessione la sera e poi un sonno vero vale più della stessa sessione dopo una notte in bianco.',
        daily: 'Dormi dopo aver imparato: il sonno fissa ciò che la giornata ha aggiunto.',
      },
      move: {
        title: 'Il movimento si vede nei test cognitivi',
        body: 'In studi su persone oltre i 50 anni, allenamento di resistenza e di forza migliorano in modo misurabile i risultati ai test cognitivi. Che cosa ne segua per la vita quotidiana non è dimostrato: l’effetto è reale, ma misurato su test, non sulla vita.',
        daily: 'Una camminata veloce conta. Il movimento incide in modo misurabile sui test cognitivi.',
      },
      risk: {
        title: 'Alcune cose si possono influenzare, molte no',
        body: 'Un’ampia rassegna ha raccolto fattori associati alla salute cognitiva nell’arco della vita: perdita uditiva, pressione alta, fumo, sedentarietà, isolamento sociale. Sono associazioni in grandi gruppi, non un calcolo per una persona: fare tutto bene non garantisce nulla, e ammalarsi non è colpa di nessuno.',
        daily: 'Udito, pressione, movimento: alcune cose accompagnano la salute cognitiva — associazione, non garanzia.',
      },
      food: {
        title: 'Sull’alimentazione è provato meno di quanto si dica',
        body: 'La dieta MIND sembrava promettente finché uno studio controllato non l’ha messa alla prova: in tre anni l’andamento cognitivo non è differito in modo rilevante dal gruppo di confronto. Mangiare bene resta sensato per altri motivi — come strumento di memoria non è provato.',
        daily: 'Nessun cibo migliora la memoria. La dieta della memoria più nota non ha retto alla prova.',
      },
      think: {
        title: 'Ciò che cerchi, lo ricordi in modo diverso',
        body: 'Chi sa che un’informazione resterà disponibile ricorda più **dove** si trova che **che cosa** dice. È ben mostrato — che cosa significhi a lungo termine, mentre motori di ricerca e IA assumono sempre più lavoro mentale, non lo sa nessuno: mancano dati lunghi. Se vuoi trattenere qualcosa, provaci tu prima di chiedere.',
        daily: 'Prima pensa, poi cerca: ciò che si richiama è ciò che tende a restare.',
      },
      social: {
        title: 'La compagnia accompagna la salute cognitiva',
        body: 'Negli studi lunghi, contatti frequenti con altre persone accompagnano una migliore salute cognitiva. Osservare non è causare: può anche darsi che ci si ritiri quando si notano cambiamenti. Di per sé, la compagnia è raramente l’idea peggiore.',
        daily: 'Vedi qualcuno. Il contatto accompagna la salute cognitiva nei dati lunghi.',
      },
    },
}

const PT: BrainCareCopy = {

    heading: 'Manter-se mentalmente ativo',
    note: 'O que acompanha uma mente desperta — e quão bem cada ponto está apoiado. A mesma escala de «O que está provado».',
    honest: 'São associações de dados populacionais, não promessas para si. Nada aqui substitui aconselhamento médico, e nada faz do ANITEW uma aplicação de saúde.',
    daily: 'Dica do dia',
    dailyOff: 'Deixar de mostrar dicas',
    dailyOn: 'Mostrar a dica do dia',
    dismiss: 'Entendido',
    demanding: 'Iniciar uma sessão exigente',
  demandingNote: 'Quinze minutos, toda a amplitude: ao contrário, gémeos, palácio da memória. A exigência vem do próprio treino — não há uma segunda aplicação mais difícil aqui dentro.',
  tips: {
      sleep: {
        title: 'O sono arruma o que aprendeste',
        body: 'Enquanto dormes, o aprendido é consolidado na memória — um dos achados mais bem estudados da investigação. Na prática: uma sessão à noite seguida de sono a sério vale mais do que a mesma sessão após uma noite em claro.',
        daily: 'Dorme depois de aprender: o sono fixa o que o dia acrescentou.',
      },
      move: {
        title: 'O exercício aparece nos testes cognitivos',
        body: 'Em estudos com pessoas com mais de 50 anos, treino de resistência e de força melhoram de forma mensurável o desempenho em testes cognitivos. O que daí decorre para o dia a dia não está demonstrado: o efeito é real, mas medido em testes, não na vida.',
        daily: 'Uma caminhada rápida conta. O exercício influencia de forma mensurável os testes cognitivos.',
      },
      risk: {
        title: 'Algumas coisas dá para influenciar, muitas não',
        body: 'Uma grande revisão reuniu fatores associados à saúde cognitiva ao longo da vida: perda auditiva, hipertensão, tabaco, sedentarismo, isolamento social. São associações em grandes grupos, não uma conta para uma pessoa: fazer tudo bem não garante nada, e adoecer não é culpa de ninguém.',
        daily: 'Audição, tensão, movimento: algumas coisas acompanham a saúde cognitiva — associação, não garantia.',
      },
      food: {
        title: 'Sobre alimentação há menos provas do que se diz',
        body: 'A dieta MIND parecia promissora até um ensaio controlado a testar: ao longo de três anos, a evolução cognitiva não diferiu de forma relevante do grupo de comparação. Comer bem continua a fazer sentido por outras razões — como recurso de memória, não está provado.',
        daily: 'Nenhum alimento melhora a memória. A dieta de memória mais conhecida não resistiu ao ensaio.',
      },
      think: {
        title: 'O que procuras, lembras de outra maneira',
        body: 'Quem sabe que uma informação continuará disponível retém mais **onde** está do que **o que** diz. Isso está bem mostrado — o que significa a longo prazo, enquanto motores de busca e IA assumem cada vez mais trabalho mental, ninguém sabe: não há dados longos. Se queres reter algo, tenta primeiro sozinho.',
        daily: 'Pensa primeiro, procura depois: o que se recupera é o que tende a ficar.',
      },
      social: {
        title: 'A companhia acompanha a saúde cognitiva',
        body: 'Em acompanhamentos longos, o contacto frequente com outras pessoas acompanha uma melhor saúde cognitiva. Observar não é causar: também pode ser que alguém se retire ao notar mudanças. Por si só, companhia raramente é a pior ideia.',
        daily: 'Combina com alguém. O contacto acompanha a saúde cognitiva nos dados longos.',
      },
    },
}

const BY_LANGUAGE: Record<string, BrainCareCopy> = { de: DE, en: EN, fr: FR, es: ES, it: IT, pt: PT }

/**
 * Die Texte in der Sprache der Oberflaeche.
 *
 * Faellt geschlossen auf Englisch zurueck — wie ueberall in der App: Lieber
 * eine Sprache, die jemand vielleicht nicht spricht, als eine leere Seite.
 */
export function brainCareCopyFor(language: string): BrainCareCopy {
  const base = (language || 'en').slice(0, 2).toLowerCase()
  return BY_LANGUAGE[base] ?? EN
}
