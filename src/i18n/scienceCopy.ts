/**
 * Die Texte der Seite „Was belegt ist" (Backlog F6, R-2).
 *
 * Ausgelagert wie `learnCopy` und `helpCopy` (Kaltstart 05.09.): Die Seite
 * selbst wird längst erst beim Öffnen geladen — ihre Texte standen aber im
 * Wörterbuch und damit im Kaltstart. Das waren rund 3,8 KB deutsche und 3,3 KB
 * englische Prosa auf dem Startpfad, für einen Bildschirm, den die meisten nie
 * öffnen. Im Wörterbuch bleibt nur die Überschrift; die braucht das Menü.
 *
 * **Was hier bewusst nicht steht:** welchen Stand eine Aussage hat und worauf
 * sie sich stützt. Das ist Struktur und kein Text — es steht in
 * `core/science.ts`, und ein Test hält daran fest. Eine Übersetzung darf einen
 * Satz umformulieren; sie darf aus „nicht belegt" nicht „umstritten" machen.
 */

import type { EvidenceStanding, ScienceClaimId } from '../core/science.ts'

const FALLBACK = 'en'

export interface ScienceCopy {
  note: string
  standings: Readonly<Record<EvidenceStanding, string>>
  standingNotes: Readonly<Record<EvidenceStanding, string>>
  claims: Readonly<Record<ScienceClaimId, { title: string; body: string }>>
  sources: string
  restsOn: string
  nothingRests: string
}

const COPY: Record<string, ScienceCopy> = {
  de: {
  /*
    Die Seite, die in dieser Branche fehlt (F6).

    Zwei Dinge macht sie zugleich: Sie erklärt, warum ANITEW so gebaut ist,
    wie es gebaut ist — und sie nennt die Stelle, an der das Wissen aufhört.
    Der zweite Teil ist der wichtigere. Wer nur die stützenden Studien
    zitiert, betreibt Werbung mit Fußnoten.

    Der Stand einer Aussage steht nicht hier, sondern in `core/science.ts`:
    Eine Übersetzung darf einen Satz umformulieren, aber aus „nicht belegt“
    nicht „umstritten“ machen.
  */
  note: 'ANITEW steht auf ein paar Befunden, die seit Jahrzehnten halten — und lässt weg, was nur gut klingt. Beides steht hier, mit Quellen.',
  standings: {
    established: 'Gut belegt',
    narrow: 'Belegt, aber nur dafür',
    unsupported: 'Nicht belegt',
    unmeasured: 'Nicht gemessen',
  },
  standingNotes: {
    established: 'Vielfach wiederholt, in unabhängigen Arbeiten. Darauf ist die App gebaut.',
    narrow: 'Der Effekt ist da — er gilt aber für das, was geübt wurde, und nicht darüber hinaus.',
    unsupported: 'Wird von Gedächtnis-Apps regelmäßig behauptet und hält der Prüfung nicht stand. ANITEW behauptet es deshalb nicht.',
    unmeasured: 'Niemand hat es gemessen. Auch wir nicht.',
  },
  claims: {
    spacing: {
      title: 'Verteiltes Üben schlägt Blockübung',
      body: 'Derselbe Aufwand, über Tage verteilt, bringt deutlich mehr als am Stück. Deshalb plant ANITEW Wiederholungen, statt dich lange üben zu lassen.',
    },
    retrieval: {
      title: 'Abrufen lernt, Ansehen nicht',
      body: 'Etwas aus dem Kopf zu holen ist der Lernvorgang selbst — Wiederlesen fühlt sich besser an und bringt weniger. Deshalb fragt die App ab, statt vorzuzeigen.',
    },
    forgetting: {
      title: 'Vergessen verläuft vorhersagbar',
      body: 'Die Kurve ist alt und wurde 2015 sauber wiederholt. Vergessen ist kein Defekt, sondern der Grund, warum ein Termin überhaupt planbar ist.',
    },
    mnemonics: {
      title: 'Merktechniken heben die Leistung — in der geübten Aufgabe',
      body: 'Sechs Wochen Loci-Training verändern messbar, wie viele Wörter einer Liste jemand behält. Was daraus für Namen, Termine oder deinen Alltag folgt, ist damit **nicht** gezeigt. ANITEW bringt dir die Technik bei und behauptet über den Rest nichts.',
    },
    brainTraining: {
      title: 'Gehirnjogging macht nicht allgemein klüger',
      body: 'Große Untersuchungen finden dasselbe: Man wird besser in den Übungen und sonst nirgends. Ein Arbeitsgedächtnistraining hebt weder Intelligenz noch Alltagsleistung. ANITEW verspricht es deshalb nicht — und der Werbespruch heißt genau darum „Technik, kein Talent“.',
    },
    dementiaPrevention: {
      title: '„Gehirntraining senkt das Demenzrisiko“',
      body: 'Diese Schlagzeile werden Sie finden, deshalb steht sie hier. Zwei Auswertungen **derselben** Studie fanden ein geringeres Risiko nach Geschwindigkeitstraining. Aber: Demenz war nicht der Endpunkt, für den die Studie gebaut war; das erste Ergebnis lag knapp unter der Signifikanzschwelle; kein unabhängiger Versuch hat es wiederholt; und eine veröffentlichte Gegenanalyse zeigt, dass nach Korrektur für mehrfaches Testen alle Intervalle die 1 einschließen. Die Autoren widersprechen. Der Streit läuft — ANITEW baut darauf nichts.',
    },
    rewards: {
      title: 'Belohnungen können die eigene Motivation verdrängen',
      body: 'Deshalb gibt es hier keine Punkte, keine Level und nichts Freizuschalten. Der Befund ist gut untersucht — allerdings an Aufgaben im Labor, nicht an Apps: Dass eine App **ohne** Punkte besser wirkt, ist nirgends gezeigt, und ANITEW behauptet es nicht. Die Entscheidung ist eine Haltung, keine Ableitung: Wiederkommen soll sich lohnen, weil etwas bleibt — nicht, weil eine Zahl sonst kaputtgeht. Was stattdessen da ist, kommt aus deinen echten Zahlen: die Serie mit Schutztagen, die wachsende Memory World und die Messung.',
    },
    everyday: {
      title: 'Ob ANITEW deinem Alltag hilft',
      body: 'Dazu gibt es keine Studie, weil es diese App noch keine gibt. Was wir messen können, misst die Messung: wie viele von zwanzig Wörtern am Folgetag noch da sind. Alles darüber hinaus wäre geraten — und geraten wird hier nicht.',
    },
  },
  sources: 'Quellen',
  restsOn: 'Daran hängt in der App:',
  nothingRests: 'Darauf ist in der App nichts gebaut.',

  },
  en: {
  note: 'ANITEW rests on a handful of findings that have held for decades — and leaves out what merely sounds good. Both are here, with sources.',
  standings: {
    established: 'Well established',
    narrow: 'Established, but only for that',
    unsupported: 'Not established',
    unmeasured: 'Not measured',
  },
  standingNotes: {
    established: 'Replicated many times, in independent work. The app is built on it.',
    narrow: 'The effect is real — it holds for what was practised, and not beyond it.',
    unsupported: 'Routinely claimed by memory apps and it does not survive scrutiny. So ANITEW does not claim it.',
    unmeasured: 'Nobody has measured it. Us included.',
  },
  claims: {
    spacing: {
      title: 'Spaced practice beats massed practice',
      body: 'The same effort spread over days does markedly more than the same effort in one sitting. That is why ANITEW schedules reviews instead of letting you drill.',
    },
    retrieval: {
      title: 'Retrieval teaches, looking does not',
      body: 'Pulling something out of your head is the learning event itself — rereading feels better and does less. That is why the app asks instead of showing.',
    },
    forgetting: {
      title: 'Forgetting follows a predictable curve',
      body: 'The curve is old and was cleanly replicated in 2015. Forgetting is not a defect; it is the reason a review date can be planned at all.',
    },
    mnemonics: {
      title: 'Mnemonic training raises performance — in the task practised',
      body: 'Six weeks of loci training measurably changes how many words of a list someone keeps. What follows from that for names, appointments or your everyday life is **not** shown by it. ANITEW teaches you the technique and claims nothing about the rest.',
    },
    brainTraining: {
      title: 'Brain training does not make you generally smarter',
      body: 'Large studies keep finding the same thing: you get better at the exercises and nowhere else. Working-memory training lifts neither intelligence nor everyday performance. So ANITEW does not promise it — and that is exactly why the tagline says "a skill, not a gift".',
    },
    dementiaPrevention: {
      title: '“Brain training lowers dementia risk”',
      body: 'You will meet this headline, which is why it is here. Two analyses of **the same** trial found a lower risk after speed training. But: dementia was not the endpoint the trial was built for; the first result sat just under the significance threshold; no independent trial has repeated it; and a published reanalysis shows that after correcting for multiple testing, every interval includes 1. The authors disagree. The dispute is live — ANITEW builds nothing on it.',
    },
    rewards: {
      title: 'Rewards can crowd out your own motivation',
      body: 'That is why there are no points, no levels and nothing to unlock here. The finding is well studied — but on laboratory tasks, not on apps: that an app **without** points works better has not been shown anywhere, and ANITEW does not claim it. The decision is a stance, not a deduction: coming back should be worth it because something stays — not because a number would otherwise break. What is here instead comes from your real numbers: the streak with protected days, the growing Memory World and the measurement.',
    },
    everyday: {
      title: 'Whether ANITEW helps your everyday life',
      body: 'There is no study, because there is no study of this app yet. What we can measure, the measurement measures: how many of twenty words are still there the next day. Anything beyond that would be a guess — and guessing is not done here.',
    },
  },
  sources: 'Sources',
  restsOn: 'What rests on it in the app:',
  nothingRests: 'Nothing in the app is built on it.',

  },
  fr: {
  note: 'ANITEW repose sur quelques résultats qui tiennent depuis des décennies — et laisse de côté ce qui sonne seulement bien. Les deux sont ici, avec les sources.',
  standings: {
    established: 'Bien établi',
    narrow: 'Établi, mais seulement pour cela',
    unsupported: 'Non établi',
    unmeasured: 'Non mesuré',
  },
  standingNotes: {
    established: 'Répliqué de nombreuses fois, par des travaux indépendants. L’app est construite dessus.',
    narrow: 'L’effet existe — mais il vaut pour ce qui a été exercé, pas au-delà.',
    unsupported: 'Régulièrement affirmé par les apps de mémoire, et cela ne résiste pas à l’examen. ANITEW ne l’affirme donc pas.',
    unmeasured: 'Personne ne l’a mesuré. Nous non plus.',
  },
  claims: {
    spacing: {
      title: 'La pratique espacée bat la pratique massée',
      body: 'Le même effort, réparti sur des jours, apporte nettement plus qu’en une seule fois. C’est pourquoi ANITEW planifie des révisions au lieu de te faire réviser longtemps.',
    },
    retrieval: {
      title: 'Le rappel apprend, la relecture non',
      body: 'Sortir quelque chose de sa tête est l’acte d’apprentissage lui-même — relire donne une meilleure sensation et apporte moins. C’est pourquoi l’app interroge au lieu de montrer.',
    },
    forgetting: {
      title: 'L’oubli suit une courbe prévisible',
      body: 'La courbe est ancienne et a été proprement répliquée en 2015. Oublier n’est pas un défaut ; c’est la raison pour laquelle une échéance peut être planifiée.',
    },
    mnemonics: {
      title: 'Les techniques de mémorisation élèvent la performance — dans la tâche exercée',
      body: 'Six semaines d’entraînement des loci changent de façon mesurable combien de mots d’une liste quelqu’un retient. Ce qui en découle pour les noms, les rendez-vous ou ton quotidien n’est **pas** démontré par là. ANITEW t’apprend la technique et n’affirme rien sur le reste.',
    },
    brainTraining: {
      title: 'La gym cérébrale ne rend pas globalement plus intelligent',
      body: 'Les grandes études trouvent la même chose : on devient meilleur dans les exercices et nulle part ailleurs. Un entraînement de la mémoire de travail n’élève ni l’intelligence ni la performance au quotidien. ANITEW ne le promet donc pas — et c’est exactement pour cela que le slogan dit « une technique, pas un don ».',
    },
    dementiaPrevention: {
      title: '« L’entraînement cérébral réduit le risque de démence »',
      body: 'Vous rencontrerez ce titre, c’est pourquoi il figure ici. Deux analyses de **la même** étude ont trouvé un risque plus faible après l’entraînement à la vitesse. Mais : la démence n’était pas le critère pour lequel l’étude avait été conçue ; le premier résultat était juste sous le seuil de signification ; aucun essai indépendant ne l’a répété ; et une réanalyse publiée montre qu’après correction pour tests multiples, tous les intervalles incluent 1. Les auteurs contestent. Le débat est ouvert — ANITEW ne construit rien dessus.',
    },
    rewards: {
      title: 'Les récompenses peuvent évincer la motivation propre',
      body: 'C’est pourquoi il n’y a ici ni points, ni niveaux, ni rien à débloquer. Le résultat est bien étudié — mais sur des tâches de laboratoire, pas sur des apps : qu’une app **sans** points fonctionne mieux n’a été montré nulle part, et ANITEW ne l’affirme pas. La décision est une posture, pas une déduction : revenir doit valoir la peine parce que quelque chose reste — pas parce qu’un chiffre se casserait sinon. Ce qui existe à la place vient de tes vrais chiffres : la série avec ses jours de protection, la Memory World qui grandit et la mesure.',
    },
    everyday: {
      title: 'Si ANITEW aide ton quotidien',
      body: 'Il n’y a pas d’étude là-dessus, parce qu’il n’y a pas encore d’étude de cette app. Ce que nous pouvons mesurer, la mesure le mesure : combien de vingt mots sont encore là le lendemain. Tout au-delà serait deviné — et ici, on ne devine pas.',
    },
  },
  sources: 'Sources',
  restsOn: 'Ce qui en dépend dans l’app :',
  nothingRests: 'Rien dans l’app n’est construit dessus.',

  },
  es: {
  note: 'ANITEW se apoya en unos pocos hallazgos que aguantan desde hace décadas — y deja fuera lo que solo suena bien. Ambos están aquí, con fuentes.',
  standings: {
    established: 'Bien demostrado',
    narrow: 'Demostrado, pero solo para eso',
    unsupported: 'No demostrado',
    unmeasured: 'No medido',
  },
  standingNotes: {
    established: 'Replicado muchas veces, en trabajos independientes. Sobre esto está construida la app.',
    narrow: 'El efecto existe — pero vale para lo que se practicó, y no más allá.',
    unsupported: 'Las apps de memoria lo afirman con regularidad y no resiste el examen. Por eso ANITEW no lo afirma.',
    unmeasured: 'Nadie lo ha medido. Nosotros tampoco.',
  },
  claims: {
    spacing: {
      title: 'Practicar espaciado gana a practicar de golpe',
      body: 'El mismo esfuerzo, repartido en días, rinde claramente más que de una sentada. Por eso ANITEW planifica repasos en vez de dejarte practicar largo rato.',
    },
    retrieval: {
      title: 'Recuperar enseña, mirar no',
      body: 'Sacar algo de la cabeza es el propio acto de aprender — releer sienta mejor y rinde menos. Por eso la app pregunta en vez de enseñar.',
    },
    forgetting: {
      title: 'El olvido sigue una curva previsible',
      body: 'La curva es antigua y fue replicada limpiamente en 2015. Olvidar no es un defecto, sino la razón de que una fecha de repaso se pueda planificar.',
    },
    mnemonics: {
      title: 'Las mnemotecnias elevan el rendimiento — en la tarea practicada',
      body: 'Seis semanas de entrenamiento de loci cambian de forma medible cuántas palabras de una lista alguien conserva. Lo que de ahí se siga para nombres, citas o tu día a día **no** queda demostrado con eso. ANITEW te enseña la técnica y no afirma nada sobre el resto.',
    },
    brainTraining: {
      title: 'La gimnasia cerebral no te hace más listo en general',
      body: 'Los grandes estudios encuentran lo mismo: mejoras en los ejercicios y en ningún otro sitio. Un entrenamiento de memoria de trabajo no eleva ni la inteligencia ni el rendimiento diario. Por eso ANITEW no lo promete — y justo por eso el lema dice «una técnica, no un talento».',
    },
    dementiaPrevention: {
      title: '«El entrenamiento cerebral reduce el riesgo de demencia»',
      body: 'Se encontrará con este titular, y por eso está aquí. Dos análisis del **mismo** estudio hallaron menor riesgo tras el entrenamiento de velocidad. Pero: la demencia no era el objetivo para el que se diseñó el estudio; el primer resultado quedó justo por debajo del umbral de significación; ningún ensayo independiente lo ha repetido; y un reanálisis publicado muestra que, tras corregir por pruebas múltiples, todos los intervalos incluyen el 1. Los autores discrepan. La disputa sigue abierta — ANITEW no construye nada sobre ella.',
    },
    rewards: {
      title: 'Las recompensas pueden desplazar la motivación propia',
      body: 'Por eso aquí no hay puntos, ni niveles, ni nada que desbloquear. El hallazgo está bien estudiado — aunque en tareas de laboratorio, no en apps: que una app **sin** puntos funcione mejor no se ha demostrado en ningún sitio, y ANITEW no lo afirma. La decisión es una postura, no una deducción: volver debe valer la pena porque algo se queda — no porque si no se rompa un número. Lo que hay en su lugar sale de tus números reales: la racha con días de protección, la Memory World que crece y la medición.',
    },
    everyday: {
      title: 'Si ANITEW ayuda a tu día a día',
      body: 'No hay estudio sobre eso, porque todavía no hay estudio de esta app. Lo que podemos medir, lo mide la medición: cuántas de veinte palabras siguen ahí al día siguiente. Todo lo demás sería adivinar — y aquí no se adivina.',
    },
  },
  sources: 'Fuentes',
  restsOn: 'Lo que depende de ello en la app:',
  nothingRests: 'Sobre esto no está construido nada en la app.',

  },
  it: {
  note: 'ANITEW poggia su pochi risultati che reggono da decenni — e lascia fuori ciò che suona solo bene. Entrambi stanno qui, con le fonti.',
  standings: {
    established: 'Ben dimostrato',
    narrow: 'Dimostrato, ma solo per quello',
    unsupported: 'Non dimostrato',
    unmeasured: 'Non misurato',
  },
  standingNotes: {
    established: 'Replicato molte volte, in lavori indipendenti. Su questo è costruita l’app.',
    narrow: 'L’effetto c’è — ma vale per ciò che è stato esercitato, non oltre.',
    unsupported: 'Le app di memoria lo affermano regolarmente e non regge alla verifica. Perciò ANITEW non lo afferma.',
    unmeasured: 'Nessuno l’ha misurato. Nemmeno noi.',
  },
  claims: {
    spacing: {
      title: 'La pratica distribuita batte la pratica concentrata',
      body: 'Lo stesso sforzo, distribuito su più giorni, rende nettamente di più che tutto in una volta. Per questo ANITEW pianifica ripassi invece di farti esercitare a lungo.',
    },
    retrieval: {
      title: 'Richiamare insegna, guardare no',
      body: 'Tirare fuori qualcosa dalla testa è l’atto stesso dell’apprendere — rileggere dà una sensazione migliore e rende meno. Per questo l’app interroga invece di mostrare.',
    },
    forgetting: {
      title: 'Dimenticare segue una curva prevedibile',
      body: 'La curva è antica ed è stata replicata in modo pulito nel 2015. Dimenticare non è un difetto, è la ragione per cui una scadenza si può pianificare.',
    },
    mnemonics: {
      title: 'Le mnemotecniche alzano la prestazione — nel compito esercitato',
      body: 'Sei settimane di allenamento dei loci cambiano in modo misurabile quante parole di una lista qualcuno conserva. Cosa ne segua per nomi, appuntamenti o la tua vita quotidiana **non** è dimostrato da questo. ANITEW ti insegna la tecnica e non afferma nulla sul resto.',
    },
    brainTraining: {
      title: 'La ginnastica cerebrale non rende più intelligenti in generale',
      body: 'I grandi studi trovano la stessa cosa: si migliora negli esercizi e da nessun’altra parte. Un allenamento della memoria di lavoro non alza né l’intelligenza né la prestazione quotidiana. ANITEW perciò non lo promette — e proprio per questo il motto dice «una tecnica, non un talento».',
    },
    dementiaPrevention: {
      title: '«L’allenamento cerebrale riduce il rischio di demenza»',
      body: 'Incontrerete questo titolo, ed è per questo che sta qui. Due analisi dello **stesso** studio hanno trovato un rischio minore dopo l’allenamento della velocità. Ma: la demenza non era l’esito per cui lo studio era stato costruito; il primo risultato stava appena sotto la soglia di significatività; nessuna sperimentazione indipendente lo ha ripetuto; e una rianalisi pubblicata mostra che, corretti i test multipli, tutti gli intervalli includono 1. Gli autori dissentono. La disputa è aperta — ANITEW non ci costruisce nulla sopra.',
    },
    rewards: {
      title: 'I premi possono spiazzare la motivazione propria',
      body: 'Per questo qui non ci sono punti, né livelli, né nulla da sbloccare. Il risultato è ben studiato — però su compiti di laboratorio, non su app: che un’app **senza** punti funzioni meglio non è dimostrato da nessuna parte, e ANITEW non lo afferma. La decisione è una postura, non una deduzione: tornare deve valere la pena perché qualcosa resta — non perché altrimenti si rompe un numero. Ciò che c’è al suo posto viene dai tuoi numeri veri: la serie con i giorni di protezione, la Memory World che cresce e la misurazione.',
    },
    everyday: {
      title: 'Se ANITEW aiuta la tua vita quotidiana',
      body: 'Su questo non c’è uno studio, perché di questa app non c’è ancora uno studio. Ciò che possiamo misurare lo misura la misurazione: quante di venti parole ci sono ancora il giorno dopo. Tutto il resto sarebbe indovinare — e qui non si indovina.',
    },
  },
  sources: 'Fonti',
  restsOn: 'Cosa ne dipende nell’app:',
  nothingRests: 'Su questo nell’app non è costruito nulla.',

  },
  pt: {
  note: 'ANITEW assenta em alguns resultados que aguentam há décadas — e deixa de fora o que só soa bem. Ambos estão aqui, com fontes.',
  standings: {
    established: 'Bem comprovado',
    narrow: 'Comprovado, mas só para isso',
    unsupported: 'Não comprovado',
    unmeasured: 'Não medido',
  },
  standingNotes: {
    established: 'Replicado muitas vezes, em trabalhos independentes. Sobre isto a app está construída.',
    narrow: 'O efeito existe — mas vale para o que foi praticado, e não para além disso.',
    unsupported: 'As apps de memória afirmam-no com regularidade e não resiste ao exame. Por isso a ANITEW não o afirma.',
    unmeasured: 'Ninguém o mediu. Nós também não.',
  },
  claims: {
    spacing: {
      title: 'Praticar espaçado ganha a praticar de seguida',
      body: 'O mesmo esforço, espalhado por dias, rende claramente mais do que de uma vez. Por isso a ANITEW planeia revisões em vez de te deixar praticar muito tempo.',
    },
    retrieval: {
      title: 'Recuperar ensina, olhar não',
      body: 'Tirar algo da cabeça é o próprio ato de aprender — reler sabe melhor e rende menos. Por isso a app pergunta em vez de mostrar.',
    },
    forgetting: {
      title: 'O esquecimento segue uma curva previsível',
      body: 'A curva é antiga e foi replicada de forma limpa em 2015. Esquecer não é defeito; é a razão de uma data de revisão se poder planear.',
    },
    mnemonics: {
      title: 'As mnemónicas elevam o desempenho — na tarefa praticada',
      body: 'Seis semanas de treino de loci mudam de forma mensurável quantas palavras de uma lista alguém guarda. O que daí se segue para nomes, compromissos ou o teu dia a dia **não** fica demonstrado com isso. A ANITEW ensina-te a técnica e não afirma nada sobre o resto.',
    },
    brainTraining: {
      title: 'A ginástica cerebral não torna mais inteligente em geral',
      body: 'Os grandes estudos encontram o mesmo: melhora-se nos exercícios e em mais lado nenhum. Um treino de memória de trabalho não eleva nem a inteligência nem o desempenho diário. A ANITEW por isso não o promete — e é exatamente por isso que o lema diz «uma técnica, não um talento».',
    },
    dementiaPrevention: {
      title: '«O treino cerebral reduz o risco de demência»',
      body: 'Vai encontrar este título, e é por isso que está aqui. Duas análises do **mesmo** estudo encontraram menor risco após o treino de velocidade. Mas: a demência não era o desfecho para o qual o estudo foi construído; o primeiro resultado ficou mesmo abaixo do limiar de significância; nenhum ensaio independente o repetiu; e uma reanálise publicada mostra que, corrigidos os testes múltiplos, todos os intervalos incluem o 1. Os autores discordam. A disputa continua — a ANITEW não constrói nada sobre isso.',
    },
    rewards: {
      title: 'As recompensas podem afastar a motivação própria',
      body: 'Por isso aqui não há pontos, nem níveis, nem nada para desbloquear. O resultado está bem estudado — mas em tarefas de laboratório, não em apps: que uma app **sem** pontos funcione melhor não está demonstrado em lado nenhum, e a ANITEW não o afirma. A decisão é uma postura, não uma dedução: voltar deve valer a pena porque algo fica — não porque senão um número se parte. O que existe em vez disso vem dos teus números reais: a série com dias de proteção, a Memory World que cresce e a medição.',
    },
    everyday: {
      title: 'Se a ANITEW ajuda o teu dia a dia',
      body: 'Sobre isso não há estudo, porque ainda não há estudo desta app. O que podemos medir, mede-o a medição: quantas de vinte palavras ainda lá estão no dia seguinte. Tudo para além disso seria adivinhar — e aqui não se adivinha.',
    },
  },
  sources: 'Fontes',
  restsOn: 'O que depende disto na app:',
  nothingRests: 'Sobre isto nada na app está construído.',

  },
}

/** Die Texte für eine Sprache, mit Englisch als Rückfall. */
export function scienceCopyFor(language: string): ScienceCopy {
  return COPY[language] ?? (COPY[FALLBACK] as ScienceCopy)
}
