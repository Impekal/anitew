/**
 * Die Texte des Menschen-Szenarios in allen sechs App-Sprachen
 * (Gerätebild 01.09.).
 *
 * Hier stand `startsWith('de') ? DE : EN` — eine von sechs
 * Zwei-Sprachen-Inseln, die ein Foto vom Telefon sichtbar gemacht hat.
 * `tests/core/languageIslands.test.ts` hält das Muster jetzt heraus.
 */
interface PeopleScenarioCopy {
  readonly heading: string
  readonly intro: string
  readonly name: string
  readonly facts: string
  readonly add: string
  readonly preview: string
  readonly confirm: string
  readonly saved: string
  readonly local: string
  readonly remove: string
  readonly needsFacts: string
}

const DE: PeopleScenarioCopy = {
  heading: 'Neue Menschen merken',
  intro: 'Bis zu sechs Menschen. Name plus ein paar Merkmale — daraus werden persönliche Abruffragen.',
  name: 'Name',
  facts: 'Merkmale, z. B. Madrid, Cello, Datenanalyse',
  add: 'Person hinzufügen',
  preview: 'Training vorbereiten',
  confirm: 'Bestätigen und merken',
  saved: 'Bestätigt. Diese Menschen können jetzt in deinen Memory-Runden auftauchen.',
  local: 'Bleibt lokal. Erst deine Bestätigung schreibt etwas in dein Gedächtnis.',
  remove: 'Entfernen',
  needsFacts: 'Mindestens eine Person braucht einen Namen und ein Merkmal.',
}

const EN: PeopleScenarioCopy = {
  heading: 'Remember new people',
  intro: 'Up to six people. Add a name and a few details to turn them into personal recall prompts.',
  name: 'Name',
  facts: 'Details, e.g. Madrid, cello, data analysis',
  add: 'Add person',
  preview: 'Prepare training',
  confirm: 'Confirm and remember',
  saved: 'Confirmed. These people can now appear in your Memory rounds.',
  local: 'Stays local. Nothing enters your memory until you confirm it.',
  remove: 'Remove',
  needsFacts: 'At least one person needs a name and one detail.',
}

const FR: PeopleScenarioCopy = {
  heading: 'Retenir de nouvelles personnes',
  intro:
    'Jusqu’à six personnes. Un nom et quelques détails — ils deviennent des questions de rappel personnelles.',
  name: 'Nom',
  facts: 'Détails, p. ex. Madrid, violoncelle, analyse de données',
  add: 'Ajouter une personne',
  preview: 'Préparer l’entraînement',
  confirm: 'Confirmer et retenir',
  saved: 'Confirmé. Ces personnes peuvent maintenant apparaître dans tes manches Mémoire.',
  local: 'Reste en local. Rien n’entre dans ta mémoire tant que tu n’as pas confirmé.',
  remove: 'Retirer',
  needsFacts: 'Au moins une personne a besoin d’un nom et d’un détail.',
}

const ES: PeopleScenarioCopy = {
  heading: 'Recordar personas nuevas',
  intro:
    'Hasta seis personas. Un nombre y unos cuantos detalles: se convierten en preguntas de recuerdo personales.',
  name: 'Nombre',
  facts: 'Detalles, p. ej. Madrid, violonchelo, análisis de datos',
  add: 'Añadir persona',
  preview: 'Preparar el entrenamiento',
  confirm: 'Confirmar y recordar',
  saved: 'Confirmado. Estas personas ya pueden aparecer en tus rondas de Memoria.',
  local: 'Se queda en local. Nada entra en tu memoria hasta que lo confirmes.',
  remove: 'Quitar',
  needsFacts: 'Al menos una persona necesita un nombre y un detalle.',
}

const IT: PeopleScenarioCopy = {
  heading: 'Ricordare persone nuove',
  intro:
    'Fino a sei persone. Un nome e qualche dettaglio: diventano domande di richiamo personali.',
  name: 'Nome',
  facts: 'Dettagli, per es. Madrid, violoncello, analisi dei dati',
  add: 'Aggiungi persona',
  preview: 'Prepara l’allenamento',
  confirm: 'Conferma e ricorda',
  saved: 'Confermato. Queste persone possono ora comparire nei tuoi turni Memoria.',
  local: 'Resta in locale. Nulla entra nella tua memoria finché non confermi.',
  remove: 'Rimuovi',
  needsFacts: 'Almeno una persona ha bisogno di un nome e di un dettaglio.',
}

const PT: PeopleScenarioCopy = {
  heading: 'Guardar pessoas novas',
  intro:
    'Até seis pessoas. Um nome e alguns detalhes — tornam-se perguntas de evocação pessoais.',
  name: 'Nome',
  facts: 'Detalhes, p. ex. Madrid, violoncelo, análise de dados',
  add: 'Adicionar pessoa',
  preview: 'Preparar o treino',
  confirm: 'Confirmar e guardar',
  saved: 'Confirmado. Estas pessoas podem agora surgir nas tuas rondas de Memória.',
  local: 'Fica em local. Nada entra na tua memória enquanto não confirmares.',
  remove: 'Remover',
  needsFacts: 'Pelo menos uma pessoa precisa de um nome e de um detalhe.',
}

const COPY: Record<string, PeopleScenarioCopy> = { de: DE, en: EN, fr: FR, es: ES, it: IT, pt: PT }

/** Deutsch ist die Quelle (D-007); alles Unbekannte fällt darauf zurück. */
export function peopleScenarioCopyFor(language: string): PeopleScenarioCopy {
  return COPY[language.toLowerCase().slice(0, 2)] ?? DE
}

export function peopleScenarioCopyForCurrentUi(): PeopleScenarioCopy {
  return peopleScenarioCopyFor(document.documentElement.lang)
}
