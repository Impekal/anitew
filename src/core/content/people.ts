/**
 * Bekannte Persönlichkeiten als Fakten — ohne jedes Bild (Nutzerwunsch 02.09.).
 *
 * Der Wunsch war: „Am besten sogar bekannte Persönlichkeiten, damit man auch
 * gleich lernt." Hier steht die Umsetzung, die **kein** Bildrecht berührt:
 * Es gibt kein Foto, keine Zeichnung, keine Silhouette. Nur Name und drei
 * weithin veröffentlichte Angaben zur Person — Geburtsjahr, Fach, Herkunft.
 *
 * ── Drei Entscheidungen, jede aus einem Fehler gelernt ────────────────────
 *
 * **Geburtsjahr statt Alter.** Der Nutzer schrieb im Beispiel „Mark
 * Zuckerberg, 40ans" und hat sich dabei selbst um zwei Jahre vertan — er ist
 * Jahrgang 1984. Genau das ist der Punkt: Ein Alter verfällt jedes Jahr, und
 * eine Gedächtnis-App, die Falsches einübt, ist schlimmer als eine ohne
 * dieses Modul. Ein Geburtsjahr verfällt nie.
 *
 * **Bausteine statt Prosa.** Fach und Herkunft kommen aus zwei kleinen
 * Tabellen, die einmal übersetzt werden. Ein Satz je Person und Sprache wären
 * fast zweihundert Sätze — jeder eine eigene Gelegenheit für einen Fehler,
 * und keiner davon leicht nachzuprüfen. Eine Tabelle mit dreizehn Fächern und
 * zwanzig Herkünften liest sich in zwei Minuten durch.
 *
 * **Herkunft, nicht Staat.** Leonardo da Vinci wurde 1452 geboren; einen
 * Staat Italien gab es da nicht. „Herkunft" ist die Angabe, die stimmt.
 *
 * ── Warum das hier gehen darf, wo Bilder es nicht dürfen ──────────────────
 *
 * §22 KUG schützt das *Bildnis* — jede erkennbare Abbildung, Zeichnung und
 * Karikatur eingeschlossen. Weithin veröffentlichte Lebensdaten einer Person
 * der Zeitgeschichte zu nennen, ist etwas anderes und alltäglich: Es steht so
 * in jedem Lexikon. Deshalb dieses Modul ohne Bild und das Bildermodul nicht.
 *
 * ── Und was das Modul nicht ist ───────────────────────────────────────────
 *
 * Ein **endlicher, kuratierter** Vorrat, wie die Zwillinge (D-027) und anders
 * als Gesichter, Zahlen und Gänge: Der ist irgendwann durchgesehen. Das ist
 * hier in Ordnung, weil es nicht um immer neue Aufgaben geht, sondern um
 * einen festen Stoff, den man wirklich können soll. Ist alles terminiert,
 * nimmt der Vorratsfilter das Modul still aus der Lernrotation; das
 * Wiedersehen des Gelernten bleibt davon unberührt.
 */

import type { Language } from '../language.ts'
import { OWN_SEPARATOR } from './own.ts'
import { PERSON_PART_SEPARATOR } from './peopleCard.ts'
import { createRng } from '../rng.ts'

/** Das Fach, in dem jemand bekannt wurde. */
export const PERSON_FIELDS = [
  'football',
  'tennis',
  'athletics',
  'physics',
  'chemistry',
  'mathematics',
  'biology',
  'painting',
  'music',
  'literature',
  'politics',
  'technology',
  'activism',
  'aviation',
  'history',
  'business',
  'boxing',
  'basketball',
  'gymnastics',
] as const
export type PersonField = (typeof PERSON_FIELDS)[number]

/** Woher jemand stammt. Herkunft, nicht Staatsangehörigkeit — siehe oben. */
export const PERSON_ORIGINS = [
  'ar',
  'at',
  'bf',
  'bj',
  'br',
  'ch',
  'ci',
  'cm',
  'co',
  'de',
  'eg',
  'es',
  'et',
  'fr',
  'gb',
  'gh',
  'in',
  'it',
  'jm',
  'ke',
  'lr',
  'ml',
  'mx',
  'ng',
  'nl',
  'pk',
  'pl',
  'pt',
  'se',
  'sn',
  'tg',
  'us',
  'za',
] as const

/**
 * Welche Herkünfte in Afrika liegen.
 *
 * Steht hier, weil ein Test damit etwas prüfen kann, was **objektiv** ist:
 * den Anteil der Menschen, die aus Afrika stammen. Siehe den Kommentar an der
 * Liste selbst — die Vorgabe des Nutzers geht weiter, aber weiter reicht auch
 * kein ehrlicher Test.
 */
export const AFRICAN_ORIGINS: readonly PersonOrigin[] = [
  'bf', 'bj', 'ci', 'cm', 'eg', 'et', 'gh', 'ke', 'lr', 'ml', 'ng', 'sn', 'tg', 'za',
]
export type PersonOrigin = (typeof PERSON_ORIGINS)[number]

export interface Person {
  readonly name: string
  /** Geburtsjahr — nie ein Alter. */
  readonly born: number
  readonly field: PersonField
  readonly origin: PersonOrigin
}

/**
 * Der Vorrat.
 *
 * Ausgewählt nach einer einzigen Regel: Die drei Angaben müssen in jedem
 * Nachschlagewerk gleich lauten. Wer nur in einem Land bekannt ist oder
 * dessen Daten strittig sind, steht hier nicht — das Modul soll Wissen
 * festigen und nicht Streitfälle einüben.
 *
 * Die Liste ist bewusst gemischt: lebende und verstorbene Menschen, fünf
 * Jahrhunderte, Sport neben Wissenschaft neben Kunst. Wer nur Fußballer
 * lernte, lernte am Ende die Position in der Liste.
 *
 * ── Die Zusammensetzung ist eine Vorgabe, keine Laune (02.09.) ────────────
 *
 * Der Nutzer hat verlangt: „In der Liste von Prominenten müssen auch viele
 * Afrikaner und schwarze Menschen sein: beides insgesamt mindestens 50%."
 *
 * Der erste Anlauf war fast rein europäisch-nordamerikanisch — sechs von
 * neunundzwanzig. Das ist keine Kleinigkeit: Eine Gedächtnis-App zeigt einem
 * über Wochen dieselben Menschen, und wer dabei nie jemanden sieht, der ihm
 * ähnelt oder aus seiner Gegend kommt, lernt nebenbei etwas darüber, wer
 * bemerkenswert ist. Die Liste ist deshalb erweitert worden.
 *
 * **Was ein Test davon prüfen kann und was nicht:** Der Anteil der Menschen
 * aus Afrika ist objektiv — er steht in `origin` und wird geprüft. Ob jemand
 * schwarz ist, steht hier bewusst **nicht** in den Daten: Das wäre ein
 * Merkmal, das die App über reale Personen behauptet, und für die Aufgabe
 * — Name, Jahr, Fach, Herkunft — braucht sie es nicht. Diese Hälfte der
 * Vorgabe ist deshalb erfüllt, aber nicht automatisch bewacht.
 */
export const PEOPLE: readonly Person[] = [
  { name: 'Leonardo da Vinci', born: 1452, field: 'painting', origin: 'it' },
  { name: 'Wolfgang Amadeus Mozart', born: 1756, field: 'music', origin: 'at' },
  { name: 'Charles Darwin', born: 1809, field: 'biology', origin: 'gb' },
  { name: 'Ada Lovelace', born: 1815, field: 'mathematics', origin: 'gb' },
  { name: 'Vincent van Gogh', born: 1853, field: 'painting', origin: 'nl' },
  { name: 'Marie Curie', born: 1867, field: 'physics', origin: 'pl' },
  { name: 'Mahatma Gandhi', born: 1869, field: 'politics', origin: 'in' },
  { name: 'Albert Einstein', born: 1879, field: 'physics', origin: 'de' },
  { name: 'Amelia Earhart', born: 1897, field: 'aviation', origin: 'us' },
  { name: 'Frida Kahlo', born: 1907, field: 'painting', origin: 'mx' },
  { name: 'Simone de Beauvoir', born: 1908, field: 'literature', origin: 'fr' },
  { name: 'Alan Turing', born: 1912, field: 'mathematics', origin: 'gb' },
  { name: 'Rosa Parks', born: 1913, field: 'activism', origin: 'us' },
  { name: 'Nelson Mandela', born: 1918, field: 'politics', origin: 'za' },
  { name: 'Gabriel García Márquez', born: 1927, field: 'literature', origin: 'co' },
  { name: 'Pelé', born: 1940, field: 'football', origin: 'br' },
  { name: 'Angela Merkel', born: 1954, field: 'politics', origin: 'de' },
  { name: 'Bill Gates', born: 1955, field: 'technology', origin: 'us' },
  { name: 'Steve Jobs', born: 1955, field: 'technology', origin: 'us' },
  { name: 'Barack Obama', born: 1961, field: 'politics', origin: 'us' },
  { name: 'Serena Williams', born: 1981, field: 'tennis', origin: 'us' },
  { name: 'Roger Federer', born: 1981, field: 'tennis', origin: 'ch' },
  { name: 'Mark Zuckerberg', born: 1984, field: 'technology', origin: 'us' },
  { name: 'Cristiano Ronaldo', born: 1985, field: 'football', origin: 'pt' },
  { name: 'Rafael Nadal', born: 1986, field: 'tennis', origin: 'es' },
  { name: 'Usain Bolt', born: 1986, field: 'athletics', origin: 'jm' },
  { name: 'Lionel Messi', born: 1987, field: 'football', origin: 'ar' },
  { name: 'Malala Yousafzai', born: 1997, field: 'activism', origin: 'pk' },
  { name: 'Greta Thunberg', born: 2003, field: 'activism', origin: 'se' },
  { name: 'Léopold Sédar Senghor', born: 1906, field: 'literature', origin: 'sn' },
  { name: 'Naguib Mahfouz', born: 1911, field: 'literature', origin: 'eg' },
  { name: 'Jesse Owens', born: 1913, field: 'athletics', origin: 'us' },
  { name: 'Katherine Johnson', born: 1918, field: 'mathematics', origin: 'us' },
  { name: 'Cheikh Anta Diop', born: 1923, field: 'history', origin: 'sn' },
  { name: 'Maya Angelou', born: 1928, field: 'literature', origin: 'us' },
  { name: 'Martin Luther King Jr.', born: 1929, field: 'activism', origin: 'us' },
  { name: 'Chinua Achebe', born: 1930, field: 'literature', origin: 'ng' },
  { name: 'Desmond Tutu', born: 1931, field: 'activism', origin: 'za' },
  { name: 'Toni Morrison', born: 1931, field: 'literature', origin: 'us' },
  { name: 'Miriam Makeba', born: 1932, field: 'music', origin: 'za' },
  { name: 'Abebe Bikila', born: 1932, field: 'athletics', origin: 'et' },
  { name: 'Nina Simone', born: 1933, field: 'music', origin: 'us' },
  { name: 'Wole Soyinka', born: 1934, field: 'literature', origin: 'ng' },
  { name: 'Kofi Annan', born: 1938, field: 'politics', origin: 'gh' },
  { name: 'Ellen Johnson Sirleaf', born: 1938, field: 'politics', origin: 'lr' },
  { name: 'Fela Kuti', born: 1938, field: 'music', origin: 'ng' },
  { name: 'Wangari Maathai', born: 1940, field: 'activism', origin: 'ke' },
  { name: 'Muhammad Ali', born: 1942, field: 'boxing', origin: 'us' },
  { name: 'Bob Marley', born: 1945, field: 'music', origin: 'jm' },
  { name: 'Salif Keita', born: 1949, field: 'music', origin: 'ml' },
  { name: 'Thomas Sankara', born: 1949, field: 'politics', origin: 'bf' },
  { name: 'Aliko Dangote', born: 1957, field: 'business', origin: 'ng' },
  { name: 'Youssou N’Dour', born: 1959, field: 'music', origin: 'sn' },
  { name: 'Angélique Kidjo', born: 1960, field: 'music', origin: 'bj' },
  { name: 'Michael Jordan', born: 1963, field: 'basketball', origin: 'us' },
  { name: 'George Weah', born: 1966, field: 'football', origin: 'lr' },
  { name: 'Haile Gebrselassie', born: 1973, field: 'athletics', origin: 'et' },
  { name: 'Chimamanda Ngozi Adichie', born: 1977, field: 'literature', origin: 'ng' },
  { name: 'Didier Drogba', born: 1978, field: 'football', origin: 'ci' },
  { name: 'Samuel Eto’o', born: 1981, field: 'football', origin: 'cm' },
  { name: 'Emmanuel Adebayor', born: 1984, field: 'football', origin: 'tg' },
  { name: 'Sadio Mané', born: 1992, field: 'football', origin: 'sn' },
  { name: 'Mohamed Salah', born: 1992, field: 'football', origin: 'eg' },
  { name: 'Simone Biles', born: 1997, field: 'gymnastics', origin: 'us' },
  { name: 'Kylian Mbappé', born: 1998, field: 'football', origin: 'fr' },
]

/*
  Nur die sechs übersetzten Sprachen stehen hier drin — deshalb `Partial`.
  Fehlt eine, liefert `hasPeoplePool` `false` und der Vorratsfilter nimmt das
  Modul still aus der Rotation, statt englische Wörter in eine türkische
  Einheit zu mischen.
*/
type Table<K extends string> = Readonly<Partial<Record<Language, Readonly<Record<K, string>>>>>

const FIELDS: Table<PersonField> = {
  de: {
    football: 'Fußball', tennis: 'Tennis', athletics: 'Leichtathletik',
    physics: 'Physik', chemistry: 'Chemie', mathematics: 'Mathematik',
    biology: 'Biologie', painting: 'Malerei', music: 'Musik',
    literature: 'Literatur', politics: 'Politik', technology: 'Technik',
    activism: 'Aktivismus', aviation: 'Luftfahrt',
    history: 'Geschichte', business: 'Wirtschaft', boxing: 'Boxen',
    basketball: 'Basketball', gymnastics: 'Turnen',
  },
  en: {
    football: 'football', tennis: 'tennis', athletics: 'athletics',
    physics: 'physics', chemistry: 'chemistry', mathematics: 'mathematics',
    biology: 'biology', painting: 'painting', music: 'music',
    literature: 'literature', politics: 'politics', technology: 'technology',
    activism: 'activism', aviation: 'aviation',
    history: 'history', business: 'business', boxing: 'boxing',
    basketball: 'basketball', gymnastics: 'gymnastics',
  },
  fr: {
    football: 'football', tennis: 'tennis', athletics: 'athlétisme',
    physics: 'physique', chemistry: 'chimie', mathematics: 'mathématiques',
    biology: 'biologie', painting: 'peinture', music: 'musique',
    literature: 'littérature', politics: 'politique', technology: 'technique',
    activism: 'militantisme', aviation: 'aviation',
    history: 'histoire', business: 'affaires', boxing: 'boxe',
    basketball: 'basket-ball', gymnastics: 'gymnastique',
  },
  es: {
    football: 'fútbol', tennis: 'tenis', athletics: 'atletismo',
    physics: 'física', chemistry: 'química', mathematics: 'matemáticas',
    biology: 'biología', painting: 'pintura', music: 'música',
    literature: 'literatura', politics: 'política', technology: 'tecnología',
    activism: 'activismo', aviation: 'aviación',
    history: 'historia', business: 'negocios', boxing: 'boxeo',
    basketball: 'baloncesto', gymnastics: 'gimnasia',
  },
  it: {
    football: 'calcio', tennis: 'tennis', athletics: 'atletica',
    physics: 'fisica', chemistry: 'chimica', mathematics: 'matematica',
    biology: 'biologia', painting: 'pittura', music: 'musica',
    literature: 'letteratura', politics: 'politica', technology: 'tecnologia',
    activism: 'attivismo', aviation: 'aviazione',
    history: 'storia', business: 'imprenditoria', boxing: 'pugilato',
    basketball: 'pallacanestro', gymnastics: 'ginnastica',
  },
  pt: {
    football: 'futebol', tennis: 'ténis', athletics: 'atletismo',
    physics: 'física', chemistry: 'química', mathematics: 'matemática',
    biology: 'biologia', painting: 'pintura', music: 'música',
    literature: 'literatura', politics: 'política', technology: 'tecnologia',
    activism: 'ativismo', aviation: 'aviação',
    history: 'história', business: 'negócios', boxing: 'boxe',
    basketball: 'basquetebol', gymnastics: 'ginástica',
  },
}

const ORIGINS: Table<PersonOrigin> = {
  de: {
    ar: 'Argentinien', at: 'Österreich', br: 'Brasilien', co: 'Kolumbien',
    de: 'Deutschland', es: 'Spanien', fr: 'Frankreich', gb: 'Großbritannien',
    in: 'Indien', it: 'Italien', jm: 'Jamaika', mx: 'Mexiko',
    nl: 'Niederlande', pk: 'Pakistan', pl: 'Polen', pt: 'Portugal',
    se: 'Schweden', ch: 'Schweiz', us: 'USA', za: 'Südafrika',
    bf: 'Burkina Faso', bj: 'Benin', ci: 'Elfenbeinküste', cm: 'Kamerun',
    eg: 'Ägypten', et: 'Äthiopien', gh: 'Ghana', ke: 'Kenia', lr: 'Liberia',
    ml: 'Mali', ng: 'Nigeria', sn: 'Senegal', tg: 'Togo',
  },
  en: {
    ar: 'Argentina', at: 'Austria', br: 'Brazil', co: 'Colombia',
    de: 'Germany', es: 'Spain', fr: 'France', gb: 'Britain',
    in: 'India', it: 'Italy', jm: 'Jamaica', mx: 'Mexico',
    nl: 'Netherlands', pk: 'Pakistan', pl: 'Poland', pt: 'Portugal',
    se: 'Sweden', ch: 'Switzerland', us: 'USA', za: 'South Africa',
    bf: 'Burkina Faso', bj: 'Benin', ci: 'Ivory Coast', cm: 'Cameroon',
    eg: 'Egypt', et: 'Ethiopia', gh: 'Ghana', ke: 'Kenya', lr: 'Liberia',
    ml: 'Mali', ng: 'Nigeria', sn: 'Senegal', tg: 'Togo',
  },
  fr: {
    ar: 'Argentine', at: 'Autriche', br: 'Brésil', co: 'Colombie',
    de: 'Allemagne', es: 'Espagne', fr: 'France', gb: 'Grande-Bretagne',
    in: 'Inde', it: 'Italie', jm: 'Jamaïque', mx: 'Mexique',
    nl: 'Pays-Bas', pk: 'Pakistan', pl: 'Pologne', pt: 'Portugal',
    se: 'Suède', ch: 'Suisse', us: 'États-Unis', za: 'Afrique du Sud',
    bf: 'Burkina Faso', bj: 'Bénin', ci: 'Côte d’Ivoire', cm: 'Cameroun',
    eg: 'Égypte', et: 'Éthiopie', gh: 'Ghana', ke: 'Kenya', lr: 'Liberia',
    ml: 'Mali', ng: 'Nigeria', sn: 'Sénégal', tg: 'Togo',
  },
  es: {
    ar: 'Argentina', at: 'Austria', br: 'Brasil', co: 'Colombia',
    de: 'Alemania', es: 'España', fr: 'Francia', gb: 'Gran Bretaña',
    in: 'India', it: 'Italia', jm: 'Jamaica', mx: 'México',
    nl: 'Países Bajos', pk: 'Pakistán', pl: 'Polonia', pt: 'Portugal',
    se: 'Suecia', ch: 'Suiza', us: 'EE. UU.', za: 'Sudáfrica',
    bf: 'Burkina Faso', bj: 'Benín', ci: 'Costa de Marfil', cm: 'Camerún',
    eg: 'Egipto', et: 'Etiopía', gh: 'Ghana', ke: 'Kenia', lr: 'Liberia',
    ml: 'Malí', ng: 'Nigeria', sn: 'Senegal', tg: 'Togo',
  },
  it: {
    ar: 'Argentina', at: 'Austria', br: 'Brasile', co: 'Colombia',
    de: 'Germania', es: 'Spagna', fr: 'Francia', gb: 'Gran Bretagna',
    in: 'India', it: 'Italia', jm: 'Giamaica', mx: 'Messico',
    nl: 'Paesi Bassi', pk: 'Pakistan', pl: 'Polonia', pt: 'Portogallo',
    se: 'Svezia', ch: 'Svizzera', us: 'USA', za: 'Sudafrica',
    bf: 'Burkina Faso', bj: 'Benin', ci: 'Costa d’Avorio', cm: 'Camerun',
    eg: 'Egitto', et: 'Etiopia', gh: 'Ghana', ke: 'Kenya', lr: 'Liberia',
    ml: 'Mali', ng: 'Nigeria', sn: 'Senegal', tg: 'Togo',
  },
  pt: {
    ar: 'Argentina', at: 'Áustria', br: 'Brasil', co: 'Colômbia',
    de: 'Alemanha', es: 'Espanha', fr: 'França', gb: 'Grã-Bretanha',
    in: 'Índia', it: 'Itália', jm: 'Jamaica', mx: 'México',
    nl: 'Países Baixos', pk: 'Paquistão', pl: 'Polónia', pt: 'Portugal',
    se: 'Suécia', ch: 'Suíça', us: 'EUA', za: 'África do Sul',
    bf: 'Burquina Faso', bj: 'Benim', ci: 'Costa do Marfim', cm: 'Camarões',
    eg: 'Egito', et: 'Etiópia', gh: 'Gana', ke: 'Quénia', lr: 'Libéria',
    ml: 'Mali', ng: 'Nigéria', sn: 'Senegal', tg: 'Togo',
  },
}

/** Gibt es diesen Vorrat in dieser Sprache? */
export function hasPeoplePool(language: Language): boolean {
  return FIELDS[language] !== undefined && ORIGINS[language] !== undefined
}

/*
  Die beiden Nachschlager geben `undefined` zurück, wenn ein Wort fehlt —
  und nicht etwa die Kennung.

  Das ist für die Prüfbarkeit da, und es war ein Fund beim Schreiben der
  Tests: Ein Wächter, der im fertigen Satz nach der Kennung sucht, kann eine
  Lücke gar nicht finden. Auf Englisch **ist** `painting` das richtige Wort;
  „1452 · painting · Italy" ist einmal richtig und einmal ein Ausfall, und von
  außen sehen beide gleich aus. Nachgeschlagen wird deshalb hier, wo die
  Lücke eine Lücke bleibt.
*/
export function personFieldWord(field: PersonField, language: Language): string | undefined {
  return FIELDS[language]?.[field]
}

export function personOriginWord(origin: PersonOrigin, language: Language): string | undefined {
  return ORIGINS[language]?.[origin]
}

/**
 * Die Antwortseite einer Karte: „1987 · Fußball · Argentinien".
 *
 * Drei Angaben, durch dasselbe Zeichen getrennt wie überall in der App. Sie
 * stehen in dieser Reihenfolge, weil das Jahr die Angabe ist, die man am
 * ehesten vergisst — es steht vorn, wo man hinsieht.
 */
export function personAnswer(person: Person, language: Language): string {
  const fach = personFieldWord(person.field, language) ?? personFieldWord(person.field, 'en')
  const herkunft = personOriginWord(person.origin, language) ?? personOriginWord(person.origin, 'en')
  const teile = [String(person.born), fach ?? person.field, herkunft ?? person.origin]
  return teile.join(PERSON_PART_SEPARATOR)
}

/**
 * Der Vorrat des Moduls: Name → Jahr, Fach, Herkunft.
 *
 * Gemischt aus dem Seed und nicht sortiert: Sonst käme die Liste immer in
 * derselben Reihenfolge, und nach zwei Wochen lernte man die Reihenfolge mit.
 */
export function peoplePool(language: Language, seed: string): readonly string[] {
  if (!hasPeoplePool(language)) return []
  const rng = createRng(`people:${seed}`)
  const gemischt = [...PEOPLE]
  for (let i = gemischt.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng.next() * (i + 1))
    const hier = gemischt[i] as Person
    gemischt[i] = gemischt[j] as Person
    gemischt[j] = hier
  }
  return gemischt.map((person) => `${person.name}${OWN_SEPARATOR}${personAnswer(person, language)}`)
}
