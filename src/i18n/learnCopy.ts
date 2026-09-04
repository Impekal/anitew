/**
 * Der Lernbereich, in sechs Sprachen (Nutzerwunsch 03.09.).
 *
 * Ausgelagert wie `lessonCopy` und `driveCopy`: Diese Sätze werden erst
 * gebraucht, wenn jemand den Bereich öffnet, und haben im Kaltstart nichts
 * verloren.
 *
 * Die Lektionstexte selbst stehen **nicht** hier — sie liegen in
 * `lessonCopy.ts` und im Wörterbuch beim Palast. Sie hier ein zweites Mal zu
 * führen hieße, zwei Wahrheiten über denselben Unterricht zu haben.
 */

const FALLBACK = 'en'

export interface LearnCopy {
  heading: string
  /** Was dieser Bereich ist — und was er nicht ist. */
  intro: string
  /** „2 von 4 Methoden durch" */
  progress: string
  /** Der Fortschritt innerhalb des Major-Systems: „3 von 11 Schritten". */
  steps: string
  titles: Readonly<Record<'story' | 'link' | 'major' | 'palace', string>>
  /** Eine Zeile je Methode: wofür sie gut ist. */
  purposes: Readonly<Record<'story' | 'link' | 'major' | 'palace', string>>
  /** Der Knopf, wenn noch nichts gelernt ist. */
  begin: string
  /** Der Knopf, wenn es weitergeht. */
  resume: string
  /** Der Knopf, wenn die Lektion durch ist. */
  again: string
  done: string
  practise: string
  /** Was „Üben" wirklich tut — ohne Beschönigung. */
  practiseNote: string
  close: string
  restart: string
  restartAll: string
  /** Die Rückfrage vor dem Zurücksetzen. */
  restartAsk: string
  restartAllAsk: string
  /** Was ein Zurücksetzen anfasst — und was nicht. */
  restartNote: string
  cancel: string
  /** Die nächste Major-Ziffer. */
  nextDigit: string
  /** Die gelernten Ziffern-Laut-Paare, als Überschrift über der Tabelle. */
  hooksHeading: string
  /**
   * Warum die Ziffern nicht bei 0 anfangen (Nutzerfrage 04.09.).
   *
   * Die Reihenfolge war von Anfang an didaktisch gewählt — nur stand der
   * Grund im Quelltext und nirgends auf dem Bildschirm. Wer eine Ordnung
   * sieht, die er nicht versteht, hält sie für einen Fehler. Zu Recht.
   */
  orderWhy: string
  /** Der Übungsraum zu einer Methode. */
  practiseHeading: string
  /** Was diese Runde enthält — je Methode eine Zeile. */
  practiseWhat: Readonly<Record<'story' | 'link' | 'major' | 'palace', string>>
  /** Die Längenwahl. */
  lengthHeading: string
  startRound: string
  back: string
}

const COPY: Record<string, LearnCopy> = {
  de: {
    heading: 'Lernen',
    intro:
      'Alle Methoden an einem Ort, ohne Uhr. Lies eine Lektion so oft du willst — sie läuft dir nicht weg, und du kannst jederzeit weitermachen oder von vorn anfangen.',
    progress: '{known} von {total} Methoden durch',
    steps: '{known} von {total} Schritten',
    titles: {
      story: 'Die Geschichten-Methode',
      link: 'Die Verknüpfung',
      major: 'Das Major-System',
      palace: 'Der Gedächtnispalast',
    },
    purposes: {
      story: 'Für Wörter: eine Kette von Bildern, an der eines das nächste zieht.',
      link: 'Für Namen und Gesichter: ein Bild an das Merkmal hängen, das zuerst auffällt.',
      major: 'Für Zahlen: jede Ziffer bekommt einen Laut, aus Lauten werden Wörter.',
      palace: 'Für Reihenfolgen: Dinge an Orte legen, die du ohnehin auswendig kannst.',
    },
    begin: 'Lernen',
    resume: 'Weiterlernen',
    again: 'Noch einmal lesen',
    done: 'Durch',
    practise: 'Üben',
    practiseNote:
      'Üben heißt: Die nächste Einheit gibt dieser Methode den meisten Raum. Es zählt wie jedes Training — die Wiederholungen werden geplant, und das Profil bekommt seine Zahlen.',
    close: 'Zuklappen',
    restart: 'Diese Lektion neu anfangen',
    restartAll: 'Alles neu anfangen',
    restartAsk: 'Diese Lektion wieder auf Anfang stellen?',
    restartAllAsk: 'Alle vier Lektionen wieder auf Anfang stellen?',
    restartNote:
      'Zurückgesetzt wird der Unterricht, nicht dein Gedächtnis: Wiederholungstermine, Erinnerungen und Paläste bleiben, wie sie sind.',
    cancel: 'Abbrechen',
    nextDigit: 'Als Nächstes: die {digit}',
    hooksHeading: 'Ziffer und Laut',
    orderWhy:
      'Warum nicht 0, 1, 2 …? Weil zuerst die Ziffern kommen, deren Brücke man sieht: 1, 2 und 3 hängen an der Zahl der Abstriche, 4 und 5 an einem Wort und einer Zahl, 9 und 8 an der Form. Die 0 und die 6 stehen hinten — ihre Brücke ist die schwächste, und wer dort anfängt, hält die ganze Technik für willkürlich.',
    practiseHeading: 'Üben',
    practiseWhat: {
      story: 'Eine Reihe Wörter zum Einprägen und Abrufen — nichts anderes.',
      link: 'Gesichter mit Namen zum Einprägen und Abrufen — nichts anderes.',
      major: 'Zahlen zum Einprägen und Abrufen — nichts anderes.',
      palace: 'Gänge durch einen Palast, Ort für Ort — nichts anderes.',
    },
    lengthHeading: 'Wie lange?',
    startRound: 'Runde starten',
    back: 'Zurück',
  },
  en: {
    heading: 'Learn',
    intro:
      'Every method in one place, no clock running. Read a lesson as often as you like — it will not run away, and you can continue or start over whenever you want.',
    progress: '{known} of {total} methods done',
    steps: '{known} of {total} steps',
    titles: {
      story: 'The story method',
      link: 'The link',
      major: 'The major system',
      palace: 'The memory palace',
    },
    purposes: {
      story: 'For words: a chain of images where one pulls the next.',
      link: 'For names and faces: hang an image on the feature you notice first.',
      major: 'For numbers: every digit gets a sound, sounds make words.',
      palace: 'For order: put things in places you already know by heart.',
    },
    begin: 'Learn',
    resume: 'Continue',
    again: 'Read again',
    done: 'Done',
    practise: 'Practise',
    practiseNote:
      'Practising means: the next session gives this method the most room. It counts like any training — reviews get scheduled and the profile gets its numbers.',
    close: 'Collapse',
    restart: 'Start this lesson over',
    restartAll: 'Start everything over',
    restartAsk: 'Put this lesson back to the beginning?',
    restartAllAsk: 'Put all four lessons back to the beginning?',
    restartNote:
      'This resets the teaching, not your memory: review dates, memories and palaces stay as they are.',
    cancel: 'Cancel',
    nextDigit: 'Next: the {digit}',
    hooksHeading: 'Digit and sound',
    orderWhy:
      'Why not 0, 1, 2 …? Because the digits whose bridge you can see come first: 1, 2 and 3 hang on the number of downstrokes, 4 and 5 on a word and a number, 9 and 8 on the shape. The 0 and the 6 come last — their bridge is the weakest, and starting there makes the whole technique look arbitrary.',
    practiseHeading: 'Practise',
    practiseWhat: {
      story: 'A row of words to memorise and recall — nothing else.',
      link: 'Faces with names to memorise and recall — nothing else.',
      major: 'Numbers to memorise and recall — nothing else.',
      palace: 'Walks through a palace, place by place — nothing else.',
    },
    lengthHeading: 'How long?',
    startRound: 'Start a round',
    back: 'Back',
  },
  fr: {
    heading: 'Apprendre',
    intro:
      'Toutes les méthodes au même endroit, sans chrono. Relis une leçon autant que tu veux — elle ne s’en va pas, et tu peux continuer ou repartir de zéro à tout moment.',
    progress: '{known} méthodes sur {total} terminées',
    steps: '{known} étapes sur {total}',
    titles: {
      story: 'La méthode des histoires',
      link: 'L’association',
      major: 'Le système majeur',
      palace: 'Le palais de mémoire',
    },
    purposes: {
      story: 'Pour les mots : une chaîne d’images où chacune tire la suivante.',
      link: 'Pour les noms et les visages : accrocher une image au trait qui saute aux yeux.',
      major: 'Pour les nombres : chaque chiffre reçoit un son, les sons font des mots.',
      palace: 'Pour l’ordre : poser des choses dans des lieux que tu connais déjà par cœur.',
    },
    begin: 'Apprendre',
    resume: 'Continuer',
    again: 'Relire',
    done: 'Terminé',
    practise: 'S’entraîner',
    practiseNote:
      'S’entraîner veut dire : la prochaine séance donne le plus de place à cette méthode. Cela compte comme tout entraînement — les révisions sont planifiées et le profil reçoit ses chiffres.',
    close: 'Replier',
    restart: 'Recommencer cette leçon',
    restartAll: 'Tout recommencer',
    restartAsk: 'Remettre cette leçon au début ?',
    restartAllAsk: 'Remettre les quatre leçons au début ?',
    restartNote:
      'Cela remet à zéro l’enseignement, pas ta mémoire : les échéances de révision, les souvenirs et les palais restent tels quels.',
    cancel: 'Annuler',
    nextDigit: 'Ensuite : le {digit}',
    hooksHeading: 'Chiffre et son',
    orderWhy:
      'Pourquoi pas 0, 1, 2 … ? Parce que viennent d’abord les chiffres dont on voit le pont : 1, 2 et 3 tiennent au nombre de jambages, 4 et 5 à un mot et à un nombre, 9 et 8 à la forme. Le 0 et le 6 arrivent en dernier — leur pont est le plus faible, et commencer par là fait passer toute la technique pour arbitraire.',
    practiseHeading: 'S’entraîner',
    practiseWhat: {
      story: 'Une série de mots à mémoriser et à restituer — rien d’autre.',
      link: 'Des visages avec des noms à mémoriser et à restituer — rien d’autre.',
      major: 'Des nombres à mémoriser et à restituer — rien d’autre.',
      palace: 'Des parcours dans un palais, lieu après lieu — rien d’autre.',
    },
    lengthHeading: 'Combien de temps ?',
    startRound: 'Lancer une manche',
    back: 'Retour',
  },
  es: {
    heading: 'Aprender',
    intro:
      'Todos los métodos en un sitio, sin reloj. Lee una lección tantas veces como quieras: no se va a ninguna parte, y puedes continuar o empezar de nuevo cuando quieras.',
    progress: '{known} de {total} métodos terminados',
    steps: '{known} de {total} pasos',
    titles: {
      story: 'El método de la historia',
      link: 'La asociación',
      major: 'El sistema mayor',
      palace: 'El palacio de la memoria',
    },
    purposes: {
      story: 'Para palabras: una cadena de imágenes donde cada una tira de la siguiente.',
      link: 'Para nombres y caras: colgar una imagen del rasgo que salta a la vista.',
      major: 'Para números: cada cifra recibe un sonido, y los sonidos forman palabras.',
      palace: 'Para el orden: dejar cosas en lugares que ya te sabes de memoria.',
    },
    begin: 'Aprender',
    resume: 'Continuar',
    again: 'Leer otra vez',
    done: 'Terminado',
    practise: 'Practicar',
    practiseNote:
      'Practicar significa: la próxima sesión da más espacio a este método. Cuenta como cualquier entrenamiento: los repasos se planifican y el perfil recibe sus números.',
    close: 'Plegar',
    restart: 'Empezar esta lección de nuevo',
    restartAll: 'Empezar todo de nuevo',
    restartAsk: '¿Volver a poner esta lección al principio?',
    restartAllAsk: '¿Volver a poner las cuatro lecciones al principio?',
    restartNote:
      'Esto reinicia la enseñanza, no tu memoria: las fechas de repaso, los recuerdos y los palacios se quedan como están.',
    cancel: 'Cancelar',
    nextDigit: 'A continuación: el {digit}',
    hooksHeading: 'Cifra y sonido',
    orderWhy:
      '¿Por qué no 0, 1, 2…? Porque primero vienen las cifras cuyo puente se ve: 1, 2 y 3 dependen del número de trazos, 4 y 5 de una palabra y de un número, 9 y 8 de la forma. El 0 y el 6 van al final: su puente es el más débil, y empezar por ahí hace que toda la técnica parezca arbitraria.',
    practiseHeading: 'Practicar',
    practiseWhat: {
      story: 'Una serie de palabras para memorizar y recordar, nada más.',
      link: 'Caras con nombres para memorizar y recordar, nada más.',
      major: 'Números para memorizar y recordar, nada más.',
      palace: 'Recorridos por un palacio, lugar a lugar, nada más.',
    },
    lengthHeading: '¿Cuánto tiempo?',
    startRound: 'Empezar una ronda',
    back: 'Volver',
  },
  it: {
    heading: 'Imparare',
    intro:
      'Tutti i metodi in un posto solo, senza cronometro. Rileggi una lezione quante volte vuoi — non scappa, e puoi continuare o ricominciare quando ti pare.',
    progress: '{known} metodi su {total} completati',
    steps: '{known} passi su {total}',
    titles: {
      story: 'Il metodo della storia',
      link: 'L’associazione',
      major: 'Il sistema maggiore',
      palace: 'Il palazzo della memoria',
    },
    purposes: {
      story: 'Per le parole: una catena di immagini in cui una tira l’altra.',
      link: 'Per nomi e volti: appendere un’immagine al tratto che salta all’occhio.',
      major: 'Per i numeri: ogni cifra riceve un suono, e i suoni fanno parole.',
      palace: 'Per l’ordine: posare cose in luoghi che già sai a memoria.',
    },
    begin: 'Imparare',
    resume: 'Continuare',
    again: 'Rileggere',
    done: 'Fatto',
    practise: 'Esercitarsi',
    practiseNote:
      'Esercitarsi significa: la prossima sessione dà più spazio a questo metodo. Conta come ogni allenamento — i ripassi vengono pianificati e il profilo riceve i suoi numeri.',
    close: 'Chiudere',
    restart: 'Ricominciare questa lezione',
    restartAll: 'Ricominciare tutto',
    restartAsk: 'Riportare questa lezione all’inizio?',
    restartAllAsk: 'Riportare tutte e quattro le lezioni all’inizio?',
    restartNote:
      'Si azzera l’insegnamento, non la tua memoria: scadenze di ripasso, ricordi e palazzi restano come sono.',
    cancel: 'Annullare',
    nextDigit: 'Poi: il {digit}',
    hooksHeading: 'Cifra e suono',
    orderWhy:
      'Perché non 0, 1, 2…? Perché vengono prima le cifre di cui si vede il ponte: 1, 2 e 3 dipendono dal numero delle aste, 4 e 5 da una parola e da un numero, 9 e 8 dalla forma. Lo 0 e il 6 stanno in fondo: il loro ponte è il più debole, e cominciare da lì fa sembrare arbitraria tutta la tecnica.',
    practiseHeading: 'Esercitarsi',
    practiseWhat: {
      story: 'Una serie di parole da memorizzare e richiamare — nient’altro.',
      link: 'Volti con nomi da memorizzare e richiamare — nient’altro.',
      major: 'Numeri da memorizzare e richiamare — nient’altro.',
      palace: 'Percorsi in un palazzo, luogo dopo luogo — nient’altro.',
    },
    lengthHeading: 'Quanto a lungo?',
    startRound: 'Iniziare un turno',
    back: 'Indietro',
  },
  pt: {
    heading: 'Aprender',
    intro:
      'Todos os métodos num só sítio, sem relógio. Lê uma lição as vezes que quiseres — não foge, e podes continuar ou recomeçar quando te apetecer.',
    progress: '{known} de {total} métodos concluídos',
    steps: '{known} de {total} passos',
    titles: {
      story: 'O método das histórias',
      link: 'A associação',
      major: 'O sistema maior',
      palace: 'O palácio da memória',
    },
    purposes: {
      story: 'Para palavras: uma cadeia de imagens em que uma puxa a seguinte.',
      link: 'Para nomes e rostos: pendurar uma imagem no traço que salta à vista.',
      major: 'Para números: cada algarismo recebe um som, e os sons formam palavras.',
      palace: 'Para a ordem: pousar coisas em lugares que já sabes de cor.',
    },
    begin: 'Aprender',
    resume: 'Continuar',
    again: 'Ler outra vez',
    done: 'Concluído',
    practise: 'Praticar',
    practiseNote:
      'Praticar quer dizer: a próxima sessão dá mais espaço a este método. Conta como qualquer treino — as revisões são planeadas e o perfil recebe os seus números.',
    close: 'Fechar',
    restart: 'Recomeçar esta lição',
    restartAll: 'Recomeçar tudo',
    restartAsk: 'Voltar a pôr esta lição no início?',
    restartAllAsk: 'Voltar a pôr as quatro lições no início?',
    restartNote:
      'Isto repõe o ensino, não a tua memória: datas de revisão, memórias e palácios ficam como estão.',
    cancel: 'Cancelar',
    nextDigit: 'A seguir: o {digit}',
    hooksHeading: 'Algarismo e som',
    orderWhy:
      'Porquê não 0, 1, 2…? Porque vêm primeiro os algarismos cuja ponte se vê: 1, 2 e 3 dependem do número de hastes, 4 e 5 de uma palavra e de um número, 9 e 8 da forma. O 0 e o 6 ficam no fim — a sua ponte é a mais fraca, e começar por aí faz toda a técnica parecer arbitrária.',
    practiseHeading: 'Praticar',
    practiseWhat: {
      story: 'Uma série de palavras para memorizar e recordar — nada mais.',
      link: 'Rostos com nomes para memorizar e recordar — nada mais.',
      major: 'Números para memorizar e recordar — nada mais.',
      palace: 'Percursos por um palácio, lugar a lugar — nada mais.',
    },
    lengthHeading: 'Quanto tempo?',
    startRound: 'Começar uma ronda',
    back: 'Voltar',
  },
}

export function learnCopyFor(language: string): LearnCopy {
  const tag = language.slice(0, 2).toLowerCase()
  return COPY[tag] ?? (COPY[FALLBACK] as LearnCopy)
}
