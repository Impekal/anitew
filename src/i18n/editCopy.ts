/**
 * Die Texte fürs Berichtigen eigener Inhalte, in allen sechs App-Sprachen
 * (Nutzerwunsch 02.09.).
 *
 * Wörtlich gewünscht: „Man kann den Begriff löschen — aber vielleicht hat man
 * ihn auch nur falsch geschrieben und möchte das korrigieren. Gilt auch für
 * connections."
 *
 * Warum nicht im Wörterbuch: `de` und `en` liegen im Kaltstart-Bündel (P4),
 * und das steht seit dem 02.09. bei 166 von 167 KB. Diese Zeilen braucht nur,
 * wer „Mein Gedächtnis" oder „Eigene Inhalte" öffnet — beide laden verzögert.
 * Dasselbe Muster wie `ownPalaceCopy.ts`, `brainCareCopy.ts`, `driveCopy.ts`.
 */

/** Die fünf Arten einer Verbindung, so wie `MemoryRelation` sie kennt. */
export interface RelationNames {
  readonly association: string
  readonly sequence: string
  readonly context: string
  readonly contrast: string
  readonly custom: string
}

export interface EditCopy {
  readonly edit: string
  readonly save: string
  readonly cancel: string
  readonly name: string
  readonly detail: string
  readonly question: string
  readonly answer: string
  readonly connections: string
  readonly relation: string
  readonly relations: RelationNames
  readonly disconnect: string
  /** Wenn der neue Name schon vergeben ist. Sagt auch, warum das Nein gilt. */
  readonly taken: string
  readonly failed: string
}

const DE: EditCopy = {
  edit: 'Ändern',
  save: 'Übernehmen',
  cancel: 'Abbrechen',
  name: 'Name',
  detail: 'Beschreibung',
  question: 'Frage',
  answer: 'Antwort',
  connections: 'Verbindungen',
  relation: 'Art',
  relations: {
    association: 'Verknüpfung',
    sequence: 'Reihenfolge',
    context: 'Zusammenhang',
    contrast: 'Gegensatz',
    custom: 'Eigene',
  },
  disconnect: 'Verbindung entfernen',
  taken: 'Diesen Namen gibt es schon. Zwei zusammenzulegen ist etwas anderes, als einen Tippfehler zu berichtigen — und es würde einen der beiden Wiederholungsverläufe kosten.',
  failed: 'Das hat nicht geklappt. Es wurde nichts verändert.',
}

const EN: EditCopy = {
  edit: 'Change',
  save: 'Apply',
  cancel: 'Cancel',
  name: 'Name',
  detail: 'Description',
  question: 'Question',
  answer: 'Answer',
  connections: 'Connections',
  relation: 'Kind',
  relations: {
    association: 'Association',
    sequence: 'Sequence',
    context: 'Context',
    contrast: 'Contrast',
    custom: 'Own',
  },
  disconnect: 'Remove connection',
  taken: 'That name is already taken. Merging two is something else than fixing a typo — and it would cost one of the two review histories.',
  failed: 'That did not work. Nothing was changed.',
}

const FR: EditCopy = {
  edit: 'Modifier',
  save: 'Valider',
  cancel: 'Annuler',
  name: 'Nom',
  detail: 'Description',
  question: 'Question',
  answer: 'Réponse',
  connections: 'Connexions',
  relation: 'Type',
  relations: {
    association: 'Association',
    sequence: 'Séquence',
    context: 'Contexte',
    contrast: 'Contraste',
    custom: 'Propre',
  },
  disconnect: 'Retirer la connexion',
  taken: 'Ce nom existe déjà. Fusionner deux entrées est autre chose que corriger une faute — et cela coûterait l’un des deux historiques de révision.',
  failed: 'Cela n’a pas marché. Rien n’a été modifié.',
}

const ES: EditCopy = {
  edit: 'Cambiar',
  save: 'Aplicar',
  cancel: 'Cancelar',
  name: 'Nombre',
  detail: 'Descripción',
  question: 'Pregunta',
  answer: 'Respuesta',
  connections: 'Conexiones',
  relation: 'Tipo',
  relations: {
    association: 'Asociación',
    sequence: 'Secuencia',
    context: 'Contexto',
    contrast: 'Contraste',
    custom: 'Propia',
  },
  disconnect: 'Quitar la conexión',
  taken: 'Ese nombre ya existe. Fusionar dos no es lo mismo que corregir una errata — y costaría uno de los dos historiales de repaso.',
  failed: 'No ha funcionado. No se ha cambiado nada.',
}

const IT: EditCopy = {
  edit: 'Modificare',
  save: 'Applicare',
  cancel: 'Annullare',
  name: 'Nome',
  detail: 'Descrizione',
  question: 'Domanda',
  answer: 'Risposta',
  connections: 'Collegamenti',
  relation: 'Tipo',
  relations: {
    association: 'Associazione',
    sequence: 'Sequenza',
    context: 'Contesto',
    contrast: 'Contrasto',
    custom: 'Proprio',
  },
  disconnect: 'Togliere il collegamento',
  taken: 'Questo nome esiste già. Unire due voci è altro che correggere un refuso — e costerebbe uno dei due storici di ripasso.',
  failed: 'Non ha funzionato. Non è stato cambiato nulla.',
}

const PT: EditCopy = {
  edit: 'Alterar',
  save: 'Aplicar',
  cancel: 'Cancelar',
  name: 'Nome',
  detail: 'Descrição',
  question: 'Pergunta',
  answer: 'Resposta',
  connections: 'Ligações',
  relation: 'Tipo',
  relations: {
    association: 'Associação',
    sequence: 'Sequência',
    context: 'Contexto',
    contrast: 'Contraste',
    custom: 'Própria',
  },
  disconnect: 'Remover a ligação',
  taken: 'Esse nome já existe. Juntar duas é outra coisa do que corrigir uma gralha — e custaria um dos dois históricos de revisão.',
  failed: 'Não resultou. Nada foi alterado.',
}

const COPY: Record<string, EditCopy> = { de: DE, en: EN, fr: FR, es: ES, it: IT, pt: PT }

/** Der Wortlaut zur Oberflächensprache; Englisch, wo es keinen eigenen gibt. */
export function editCopyFor(language: string): EditCopy {
  return COPY[language.slice(0, 2).toLocaleLowerCase()] ?? EN
}
