/**
 * Die Texte der Technik-Lektionen (Reserve P4, gezogen am 02.09.).
 *
 * Warum sie hier stehen und nicht im Wörterbuch: `de` und `en` liegen im
 * Kaltstart-Bündel, und das stand am 02.09. bei 166,8 von 167 KB. Diese
 * Zeilen — die vollständigen Erklärungen zu Major-System, Story, Link und
 * Palast — braucht aber **nur**, wer eine Einheit startet, und der
 * Einheiten-Bildschirm lädt ohnehin verzögert (`SessionScreen.tsx`).
 *
 * Der Nutzer hatte für genau diesen Fall entschieden: nicht die Grenze
 * heben, sondern auslagern. Dasselbe Muster wie `ownPalaceCopy.ts`,
 * `brainCareCopy.ts`, `driveCopy.ts`, `panelCopy.ts`, `editCopy.ts`.
 *
 * Deutsch bleibt verbindlich (D-007): `DE` ist die Quelle, der Typ leitet
 * sich daraus ab.
 */

const DE = {
  /*
    Geschichte und Verknüpfung (D5 · D-013): je eine Lektion, drei
    Schritte, imperativ. Kein Beispiel-Merkbild von uns — selbst gebaute
    sitzen besser (dieselbe Entscheidung wie beim Major-System).
  */
  story: {
    heading: 'Neue Technik',
    intro: 'Die Geschichten-Methode',
    steps: [
      'Nimm die Wörter der Reihe nach.',
      'Verbinde je zwei zu einer kleinen Handlung — je absurder, desto fester.',
      'Beim Abruf erzählst du einfach weiter: Ein Bild zieht das nächste.',
    ],
    build: 'Bau deine eigene Geschichte — vorgekaute hält nicht.',
    ready: 'Tippen — die erste Runde gehört ihr.',
  },
  link: {
    heading: 'Neue Technik',
    intro: 'Die Verknüpfung',
    steps: [
      'Such am Gesicht das Merkmal, das dir zuerst auffällt.',
      'Mach aus dem Namen ein Bild — eine „Rose“ blüht, ein „Stein“ wiegt.',
      'Häng das Bild an das Merkmal: groß, unübersehbar, in Bewegung.',
    ],
    build: 'Dein Bild, dein Haken — fremde halten nicht.',
    ready: 'Tippen — das erste Gesicht wartet.',
  },
  /*
    D5 — die Technik wird beigebracht, nicht nur abgefragt. Das ist der
    Unterschied zu jeder Brain-Game-App, und deshalb steht hier Prosa und
    kein Etikett.
  */
  heading: 'Merktechnik',
  majorName: 'Das Major-System',
  /*
    Das Verfahren, bevor die erste Ziffer verlangt wird (Gerätemeldung 01.09.).

    Gemeldet wurde: „Man sagt plötzlich ‚die kleine 2 hat 2 Striche wie n‘
    und dann wird von einem erwartet, dass man 6-stellige Zahlen inklusive 2
    behält … da hat man keine Ahnung, worum es geht.“

    Der Befund war strukturell und nicht Geschmack: Palast, Geschichte und
    Verknüpfung hatten je eine Lektion mit drei Schritten — das
    Major-System, die Technik mit den meisten Teilen, hatte keine. Seine
    erste Lektion war bereits die Ziffer 1.

    Deshalb hier dieselbe Form, und das Beispiel bewusst in **beide**
    Richtungen: Wer nur 4–7 → „Rakete“ liest, weiß immer noch nicht, wie
    er aus dem Bild die Ziffern zurückbekommt — und genau das verlangt der
    Abruf.
  */
  method: {
    what: 'Das Major-System ist eine Methode, um sich Zahlen zu merken — seit über zweihundert Jahren in Gebrauch. Der Gedanke dahinter: Ziffern sind schwer zu behalten, Bilder nicht.',
    helps: 'Damit behältst du eine PIN, eine Telefonnummer, ein Datum, eine Hausnummer — alles, was aus Ziffern besteht.',
    steps: [
      'Jede Ziffer steht für einen Laut. Die 1 ist ein t, die 2 ein n. Zehn Ziffern, zehn Laute — du lernst sie einzeln, nicht alle auf einmal.',
      'Aus den Lauten machst du ein Wort. Vokale setzt du frei dazwischen: 4 und 7 sind r und k — daraus wird „Rakete“.',
      'Das Wort ist ein Bild, und Bilder bleiben. Zum Erinnern liest du zurück: Rakete → r, k → 4, 7.',
    ],
    build: 'Die Wörter baust du selbst. Ein Wort, das dir einfällt, sitzt fester als eines, das dir jemand vorsetzt.',
    ready: 'Weiter zur ersten Ziffer.',
  },
  /*
    Steht über **jeder** Ziffernlektion.

    Früher nur beim allerersten Mal — danach stand dort nur noch der Name
    der Technik. Der Gedanke war G-2 (kein Möbel), die Wirkung war die
    gemeldete: Ab der zweiten Ziffer erklärte nichts mehr, was zu tun ist.
    Ein Name ist keine Erklärung, und ein Satz ist kein Möbel.
  */
  intro: 'Ziffern sind schwer zu behalten, Bilder nicht. Jede Ziffer bekommt einen Laut — daraus wird ein Wort, und ein Wort merkt man sich.',
  // Der Satz nach der Lektion. Kein Lob (G-5), nur der nächste Schritt.
  ready: 'Ab jetzt steht sie unter den Zahlen.',
  // Die Brücke je Ziffer. Sie ist der eigentliche Inhalt der Lektion:
  // Ohne Bild ist die Zuordnung Willkür, und Willkür merkt sich niemand.
  hooks: {
    0: 'Die Null ist rund wie ein zischendes S — und „Zero“ beginnt mit Z.',
    1: 'Das kleine t hat einen Abstrich, genau wie die Eins.',
    2: 'Das kleine n hat zwei Abstriche.',
    3: 'Das kleine m hat drei Abstriche.',
    4: '„vieR“ endet auf r. Das ist die ganze Brücke.',
    5: 'Die römische Fünfzig ist ein L — und die offene Hand mit fünf Fingern bildet eines.',
    6: 'Ein gespiegeltes j ist eine Sechs. Dazu der weiche Zischlaut: sch, ch, j.',
    7: 'Zwei Siebenen aneinandergelegt ergeben ein K.',
    8: 'Das geschriebene f hat zwei Schlaufen — wie die Acht.',
    9: 'Die Neun gespiegelt ist ein p, gedreht ein b.',
  },
  // Steht unter der Zahl beim Einprägen, sobald die erste Ziffer sitzt.
  hint: 'Mach ein Wort daraus. Vokale sind frei.',
  progress: 'Ziffern gelernt',
}

export type LessonCopy = typeof DE

const EN = {
  story: {
    heading: 'New technique',
    intro: 'The story method',
    steps: [
      'Take the words in order.',
      'Join each pair into a little scene — the more absurd, the firmer it holds.',
      'At recall, just keep telling: each image pulls the next.',
    ],
    build: 'Build your own story — pre-chewed ones don’t hold.',
    ready: 'Tap — the first round belongs to it.',
  },
  link: {
    heading: 'New technique',
    intro: 'The link',
    steps: [
      'Find the feature of the face that strikes you first.',
      'Turn the name into an image — a “Rose” blooms, a “Stone” weighs.',
      'Hang the image on the feature: big, unmissable, moving.',
    ],
    build: 'Your image, your hook — borrowed ones don’t hold.',
    ready: 'Tap — the first face is waiting.',
  },
  heading: 'Technique',
  majorName: 'The Major System',
  method: {
    what: 'The Major system is a way of remembering numbers, in use for over two hundred years. The idea behind it: digits are hard to hold on to, pictures are not.',
    helps: 'You use it for a PIN, a phone number, a date, a house number — anything made of digits.',
    steps: [
      'Every digit stands for a sound. 1 is a t, 2 is an n. Ten digits, ten sounds — you learn them one at a time, not all at once.',
      'From the sounds you make a word. Vowels go in freely: 4 and 7 are r and k — that gives you "rocket".',
      'The word is a picture, and pictures stay. To remember, you read it back: rocket → r, k → 4, 7.',
    ],
    build: 'You build the words yourself. A word you thought of holds better than one handed to you.',
    ready: 'On to the first digit.',
  },
  intro: 'Digits are hard to hold, pictures are not. Every digit gets a sound — the sounds make a word, and a word stays.',
  ready: 'From now on it sits under the numbers.',
  hooks: {
    0: 'Zero is round like a hissing S — and "zero" starts with Z.',
    1: 'A lowercase t has one downstroke, just like the 1.',
    2: 'A lowercase n has two downstrokes.',
    3: 'A lowercase m has three downstrokes.',
    4: '"fouR" ends in r. That is the whole bridge.',
    5: 'Roman fifty is an L — and an open hand of five fingers makes one.',
    6: 'A mirrored j is a six. With it the soft hush: sh, ch, j.',
    7: 'Two sevens set together make a K.',
    8: 'A handwritten f has two loops — like the eight.',
    9: 'Nine mirrored is a p, turned around a b.',
  },
  hint: 'Make a word of it. Vowels are free.',
  progress: 'digits learned',
} satisfies LessonCopy

const FR = {
  story: {
    heading: 'Nouvelle technique',
    intro: 'La méthode des histoires',
    steps: [
      'Prends les mots dans l’ordre.',
      'Relie-les deux par deux en une petite action — plus c’est absurde, mieux ça tient.',
      'Au rappel, tu continues simplement à raconter : une image tire la suivante.',
    ],
    build: 'Construis ta propre histoire — les prémâchées ne tiennent pas.',
    ready: 'Touche — la première manche lui appartient.',
  },
  link: {
    heading: 'Nouvelle technique',
    intro: 'Le lien',
    steps: [
      'Cherche sur le visage le trait qui te frappe en premier.',
      'Fais du nom une image — une « Rose » fleurit, une « Pierre » pèse.',
      'Accroche l’image au trait : grande, immanquable, en mouvement.',
    ],
    build: 'Ton image, ton crochet — les empruntés ne tiennent pas.',
    ready: 'Touche — le premier visage attend.',
  },
  heading: 'Technique de mémorisation',
  majorName: 'Le système Major',
  method: {
    what: 'Le système Major est une façon de retenir les nombres, utilisée depuis plus de deux cents ans. L’idée : les chiffres sont difficiles à garder en tête, les images non.',
    helps: 'Tu t’en sers pour un code, un numéro de téléphone, une date, un numéro de rue — tout ce qui est fait de chiffres.',
    steps: [
      'Chaque chiffre correspond à un son. Le 1 est un t, le 2 est un n. Dix chiffres, dix sons — tu les apprends un par un, pas tous d’un coup.',
      'Avec les sons tu formes un mot. Les voyelles, tu les places librement : 4 et 7 sont r et k — cela donne « roc ».',
      'Le mot devient une image, et les images restent. Pour te souvenir, tu relis à l’envers : roc → r, k → 4, 7.',
    ],
    build: 'Les mots, tu les construis toi-même. Un mot qui te vient tient mieux qu’un mot qu’on te donne.',
    ready: 'On passe au premier chiffre.',
  },
  intro: 'Les chiffres sont durs à garder, pas les images. Chaque chiffre reçoit un son — cela fait un mot, et un mot se retient.',
  ready: 'À partir de maintenant, elle est là sous les nombres.',
  hooks: {
    0: 'Le zéro est rond comme un S qui siffle — et « zéro » commence par un z.',
    1: 'Le t minuscule a un jambage, exactement comme le 1.',
    2: 'Le n minuscule a deux jambages.',
    3: 'Le m minuscule a trois jambages.',
    4: '« quatRe » porte le r. C’est tout le pont.',
    5: 'Le cinquante romain est un L — et la main ouverte, cinq doigts, en forme un.',
    6: 'Un j en miroir est un six. Avec lui, le son doux : ch, j.',
    7: 'Deux sept posés l’un contre l’autre font un K.',
    8: 'Le f manuscrit a deux boucles — comme le huit.',
    9: 'Le neuf en miroir est un p, retourné un b.',
  },
  hint: 'Fais-en un mot. Les voyelles sont libres.',
  progress: 'chiffres appris',
} satisfies LessonCopy

const ES = {
  story: {
    heading: 'Técnica nueva',
    intro: 'El método de la historia',
    steps: [
      'Toma las palabras en orden.',
      'Une cada dos en una pequeña acción — cuanto más absurda, más firme.',
      'Al recuperar, sigue contando sin más: una imagen tira de la siguiente.',
    ],
    build: 'Construye tu propia historia — las masticadas no aguantan.',
    ready: 'Toca — la primera ronda es suya.',
  },
  link: {
    heading: 'Técnica nueva',
    intro: 'La vinculación',
    steps: [
      'Busca en la cara el rasgo que te llame primero.',
      'Convierte el nombre en imagen — una «Rosa» florece, una «Piedra» pesa.',
      'Cuelga la imagen del rasgo: grande, imposible de no ver, en movimiento.',
    ],
    build: 'Tu imagen, tu gancho — los ajenos no aguantan.',
    ready: 'Toca — la primera cara espera.',
  },
  heading: 'Mnemotecnia',
  majorName: 'El sistema Major',
  method: {
    what: 'El sistema Major es una manera de recordar números, en uso desde hace más de doscientos años. La idea: las cifras cuesta retenerlas, las imágenes no.',
    helps: 'Te sirve para un PIN, un número de teléfono, una fecha, un número de portal — todo lo que esté hecho de cifras.',
    steps: [
      'Cada cifra representa un sonido. El 1 es una t, el 2 una n. Diez cifras, diez sonidos — los aprendes de uno en uno, no todos a la vez.',
      'Con los sonidos formas una palabra. Las vocales las pones libremente: 4 y 7 son r y k — de ahí sale «roca».',
      'La palabra es una imagen, y las imágenes quedan. Para recordar lees al revés: roca → r, k → 4, 7.',
    ],
    build: 'Las palabras las construyes tú. Una palabra que se te ocurre aguanta mejor que una que te dan.',
    ready: 'Vamos a la primera cifra.',
  },
  intro: 'Las cifras cuestan de retener, las imágenes no. Cada cifra recibe un sonido — de ahí sale una palabra, y una palabra se recuerda.',
  ready: 'Desde ahora está ahí, debajo de los números.',
  hooks: {
    0: 'El cero es redondo como una S que silba — y «cero» suena con s.',
    1: 'La t minúscula tiene un trazo, igual que el 1.',
    2: 'La n minúscula tiene dos trazos.',
    3: 'La m minúscula tiene tres trazos.',
    4: '«cuatRo» lleva la r. Ese es todo el puente.',
    5: 'El cincuenta romano es una L — y la mano abierta, con cinco dedos, forma una.',
    6: 'Una j reflejada es un seis. Con ella el sonido suave: ch, y.',
    7: 'Dos sietes juntos forman una K.',
    8: 'La f manuscrita tiene dos lazos — como el ocho.',
    9: 'El nueve reflejado es una p, girado una b.',
  },
  hint: 'Haz una palabra con ello. Las vocales son libres.',
  progress: 'cifras aprendidas',
} satisfies LessonCopy

const IT = {
  story: {
    heading: 'Nuova tecnica',
    intro: 'Il metodo della storia',
    steps: [
      'Prendi le parole in ordine.',
      'Lega ogni coppia in una piccola azione — più è assurda, più tiene.',
      'Al richiamo continui semplicemente a raccontare: un’immagine tira la prossima.',
    ],
    build: 'Costruisci la tua storia — quelle premasticate non tengono.',
    ready: 'Tocca — il primo turno è suo.',
  },
  link: {
    heading: 'Nuova tecnica',
    intro: 'Il collegamento',
    steps: [
      'Cerca sul viso il tratto che ti colpisce per primo.',
      'Fai del nome un’immagine — una «Rosa» fiorisce, un «Sasso» pesa.',
      'Appendi l’immagine al tratto: grande, impossibile da non vedere, in movimento.',
    ],
    build: 'La tua immagine, il tuo gancio — quelli altrui non tengono.',
    ready: 'Tocca — il primo viso aspetta.',
  },
  heading: 'Mnemotecnica',
  majorName: 'Il sistema Major',
  method: {
    what: 'Il sistema Major è un modo per ricordare i numeri, in uso da più di duecento anni. L’idea: le cifre si trattengono male, le immagini bene.',
    helps: 'Ti serve per un PIN, un numero di telefono, una data, un numero civico — tutto ciò che è fatto di cifre.',
    steps: [
      'Ogni cifra corrisponde a un suono. L’1 è una t, il 2 una n. Dieci cifre, dieci suoni — li impari uno alla volta, non tutti insieme.',
      'Con i suoni formi una parola. Le vocali le metti liberamente: 4 e 7 sono r e k — ne viene «arco».',
      'La parola è un’immagine, e le immagini restano. Per ricordare leggi a ritroso: arco → r, k → 4, 7.',
    ],
    build: 'Le parole le costruisci tu. Una parola che ti viene in mente tiene meglio di una che ti viene data.',
    ready: 'Passiamo alla prima cifra.',
  },
  intro: 'Le cifre sono dure da tenere, le immagini no. Ogni cifra riceve un suono — ne esce una parola, e una parola si ricorda.',
  ready: 'Da adesso sta lì, sotto i numeri.',
  hooks: {
    0: 'Lo zero è rotondo come una S che sibila — e «zero» comincia con la z.',
    1: 'La t minuscola ha un’asta, proprio come l’1.',
    2: 'La n minuscola ha due aste.',
    3: 'La m minuscola ha tre aste.',
    4: '«quattRo» porta la r. È tutto il ponte.',
    5: 'Il cinquanta romano è una L — e la mano aperta, cinque dita, ne forma una.',
    6: 'Una j allo specchio è un sei. Con lei il suono morbido: sci, gi.',
    7: 'Due sette accostati fanno una K.',
    8: 'La f scritta a mano ha due asole — come l’otto.',
    9: 'Il nove allo specchio è una p, girato una b.',
  },
  hint: 'Fanne una parola. Le vocali sono libere.',
  progress: 'cifre imparate',
} satisfies LessonCopy

const PT = {
  story: {
    heading: 'Técnica nova',
    intro: 'O método da história',
    steps: [
      'Pega nas palavras por ordem.',
      'Liga cada duas numa pequena ação — quanto mais absurda, mais firme.',
      'Ao recuperar, continuas simplesmente a contar: uma imagem puxa a seguinte.',
    ],
    build: 'Constrói a tua própria história — as mastigadas não seguram.',
    ready: 'Toca — a primeira ronda é dela.',
  },
  link: {
    heading: 'Técnica nova',
    intro: 'A ligação',
    steps: [
      'Procura no rosto o traço que te salta primeiro à vista.',
      'Faz do nome uma imagem — uma «Rosa» floresce, uma «Pedra» pesa.',
      'Pendura a imagem no traço: grande, impossível de não ver, em movimento.',
    ],
    build: 'A tua imagem, o teu gancho — os emprestados não seguram.',
    ready: 'Toca — o primeiro rosto espera.',
  },
  heading: 'Mnemónica',
  majorName: 'O sistema Major',
  method: {
    what: 'O sistema Major é uma forma de recordar números, em uso há mais de duzentos anos. A ideia: os algarismos são difíceis de guardar, as imagens não.',
    helps: 'Serve-te para um PIN, um número de telefone, uma data, um número de porta — tudo o que é feito de algarismos.',
    steps: [
      'Cada algarismo corresponde a um som. O 1 é um t, o 2 um n. Dez algarismos, dez sons — aprendes um de cada vez, não todos ao mesmo tempo.',
      'Com os sons formas uma palavra. As vogais pões livremente: 4 e 7 são r e k — daí sai «arca».',
      'A palavra é uma imagem, e as imagens ficam. Para recordar lês ao contrário: arca → r, k → 4, 7.',
    ],
    build: 'As palavras constróis tu. Uma palavra que te ocorre segura melhor do que uma que te dão.',
    ready: 'Vamos ao primeiro algarismo.',
  },
  intro: 'Algarismos são difíceis de guardar, imagens não. Cada algarismo recebe um som — daí sai uma palavra, e uma palavra fica.',
  ready: 'A partir de agora está ali, debaixo dos números.',
  hooks: {
    0: 'O zero é redondo como um S que assobia — e «zero» começa por z.',
    1: 'O t minúsculo tem uma haste, tal como o 1.',
    2: 'O n minúsculo tem duas hastes.',
    3: 'O m minúsculo tem três hastes.',
    4: '«quatRo» leva o r. É toda a ponte.',
    5: 'O cinquenta romano é um L — e a mão aberta, cinco dedos, forma um.',
    6: 'Um j ao espelho é um seis. Com ele o som suave: ch, j.',
    7: 'Dois setes encostados fazem um K.',
    8: 'O f manuscrito tem duas laçadas — como o oito.',
    9: 'O nove ao espelho é um p, virado um b.',
  },
  hint: 'Faz disso uma palavra. As vogais são livres.',
  progress: 'algarismos aprendidos',
} satisfies LessonCopy

const COPY: Record<string, LessonCopy> = { de: DE, en: EN, fr: FR, es: ES, it: IT, pt: PT }

/** Der Wortlaut zur Oberflächensprache; Englisch, wo es keinen eigenen gibt. */
export function lessonCopyFor(language: string): LessonCopy {
  return COPY[language.slice(0, 2).toLocaleLowerCase()] ?? EN
}
