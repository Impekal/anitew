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

export function peopleScenarioCopyForCurrentUi(): PeopleScenarioCopy {
  return document.documentElement.lang.toLocaleLowerCase().startsWith('de') ? DE : EN
}
