/**
 * Namen fürs Modul „Namen & Gesichter“ (Backlog D9, L6).
 *
 * Drei Regeln, nach denen diese Listen gebaut sind — dieselben wie bei den
 * Wörtern, nur schärfer:
 *
 * 1. **Untereinander verschieden.** Kein Anna neben Hanna, kein Martin neben
 *    Marvin. Sonst misst der Abruf, wie gut jemand Ähnliches auseinanderhält,
 *    und nicht, ob er sich den Namen gemerkt hat (Interferenz, C6).
 * 2. **Je Sprachraum eigen, nicht übersetzt.** Ein deutscher Namenspool in
 *    einem englischen Training wäre kein Training, sondern eine Vokabelprüfung.
 * 3. **Gemischt.** Geschlechter und Herkünfte über die Liste verteilt — wer
 *    nur eine Sorte Namen übt, übt nur eine Sorte Namen.
 *
 * Die Gesichter dazu entstehen aus dem Namen (siehe `faces.ts`): Derselbe Name
 * ergibt immer dasselbe Gesicht, heute wie in drei Wochen.
 */

import { FALLBACK_LANGUAGE, type Language } from '../language.ts'

/*
 * Warum die Listen zweigeteilt sind.
 *
 * Der Gesichtsgenerator würfelt den Bart aus dem Namen. Vorher stand deshalb
 * mit einer Wahrscheinlichkeit von rund einem Viertel eine Margarethe mit
 * Vollbart auf dem Bildschirm — und das liest sich nicht als Vielfalt,
 * sondern als Fehler. Wer einen Fehler sieht, schaut auf den Fehler und nicht
 * auf das Gesicht, das er sich merken soll.
 *
 * Die Trennung ist ausdrücklich **keine Aussage darüber, wie Menschen
 * aussehen** — es gibt bärtige Frauen, und Regel 3 oben bleibt. Sie ist eine
 * Aussage über eine Zeichnung aus fünf Strichen: Die kann Zwischentöne nicht
 * transportieren, also zeichnet sie das Naheliegende und behauptet nicht mehr,
 * als sie zeigen kann. Kahlköpfigkeit bleibt bewusst für alle möglich — die
 * fällt nicht als Fehler auf, der Vollbart schon.
 */
const deFeminine = [
  'Beata', 'Dilara', 'Farida', 'Hedwig', 'Jolanda', 'Ludmilla', 'Nadja', 'Pia',
  'Rosalie', 'Theresa', 'Valeska', 'Xenia', 'Zora', 'Carlotta', 'Elif', 'Greta',
  'Ingrid', 'Katharina', 'Margarethe', 'Olivia', 'Rebekka', 'Tamara', 'Viktoria', 'Yasmin',
]

const deMasculine = [
  'Anton', 'Clemens', 'Emil', 'Gustav', 'Ibrahim', 'Konrad', 'Matteo', 'Oskar',
  'Quentin', 'Samir', 'Ulrich', 'Wilhelm', 'Yusuf', 'Bruno', 'Detlef', 'Ferdinand',
  'Hannes', 'Jakob', 'Leopold', 'Norbert', 'Piotr', 'Severin', 'Urs', 'Waldemar',
]

const enFeminine = [
  'Bridget', 'Delphine', 'Fiona', 'Harriet', 'Josephine', 'Lorraine', 'Nadine', 'Penelope',
  'Rosalind', 'Tabitha', 'Vivienne', 'Ximena', 'Yolanda', 'Cordelia', 'Eleanor', 'Gwendolyn',
  'Imogen', 'Kimberly', 'Matilda', 'Ottoline', 'Rowena', 'Theodora', 'Winifred',
]

const enMasculine = [
  'Alfred', 'Casper', 'Edmund', 'Gerald', 'Ignatius', 'Kenneth', 'Malcolm', 'Osborne',
  'Quincy', 'Sullivan', 'Ulysses', 'Wendell', 'Zachary', 'Bartholomew', 'Desmond', 'Fitzgerald',
  'Horace', 'Jasper', 'Leonard', 'Nathaniel', 'Percival', 'Sebastian', 'Vernon',
]

/** Fügt die beiden Hälften abwechselnd zusammen. */
function interleave(a: readonly string[], b: readonly string[]): readonly string[] {
  const out: string[] = []
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const first = a[i]
    const second = b[i]
    if (first !== undefined) out.push(first)
    if (second !== undefined) out.push(second)
  }
  return out
}

const frFeminine = [
  'Amandine', 'Bérénice', 'Coralie', 'Delphine', 'Émeline', 'Fanny', 'Gaëlle', 'Hortense',
  'Inès', 'Joséphine', 'Léonie', 'Margaux', 'Noémie', 'Ombeline', 'Pauline', 'Rachel',
  'Solène', 'Tiphaine', 'Violette', 'Yseult', 'Capucine', 'Élodie', 'Maëlys', 'Sidonie',
]

const frMasculine = [
  'Aurélien', 'Baptiste', 'Corentin', 'Damien', 'Émile', 'Fabrice', 'Gaspard', 'Hugo',
  'Isidore', 'Joachim', 'Ludovic', 'Maxime', 'Nicolas', 'Octave', 'Pascal', 'Quentin',
  'Rémi', 'Sylvain', 'Thibault', 'Valentin', 'Xavier', 'Yann', 'Basile', 'Côme',
]

const esFeminine = [
  'Almudena', 'Beatriz', 'Candela', 'Dolores', 'Estrella', 'Fátima', 'Gloria', 'Inés',
  'Jimena', 'Leonor', 'Marisol', 'Nuria', 'Paloma', 'Raquel', 'Soledad', 'Teresa',
  'Verónica', 'Yolanda', 'Adela', 'Celia', 'Elvira', 'Irene', 'Lucía', 'Pilar',
]

const esMasculine = [
  'Agustín', 'Baltasar', 'César', 'Damián', 'Eloy', 'Fabián', 'Gonzalo', 'Héctor',
  'Ismael', 'Joaquín', 'Leandro', 'Mateo', 'Nicolás', 'Óscar', 'Pablo', 'Rodrigo',
  'Salvador', 'Tomás', 'Vicente', 'Xabier', 'Bruno', 'Gael', 'Íñigo', 'Ramiro',
]

const itFeminine = [
  'Alessia', 'Bianca', 'Chiara', 'Donatella', 'Elisa', 'Federica', 'Giada', 'Ilaria',
  'Laura', 'Mirella', 'Nadia', 'Paola', 'Renata', 'Silvia', 'Teresa', 'Valentina',
  'Zoe', 'Arianna', 'Camilla', 'Eleonora', 'Francesca', 'Giorgia', 'Ludovica', 'Serena',
]

const itMasculine = [
  'Aldo', 'Cristiano', 'Davide', 'Enzo', 'Federico', 'Giulio', 'Ivan', 'Leonardo',
  'Massimo', 'Nicola', 'Ottavio', 'Paolo', 'Riccardo', 'Salvatore', 'Tiziano', 'Valerio',
  'Walter', 'Emanuele', 'Gabriele', 'Maurizio', 'Renato', 'Sergio', 'Tommaso', 'Vincenzo',
]

const ptFeminine = [
  'Adriana', 'Bárbara', 'Clarice', 'Débora', 'Eloá', 'Fabiana', 'Helena', 'Ivone',
  'Jéssica', 'Lígia', 'Madalena', 'Nara', 'Priscila', 'Quitéria', 'Rita', 'Sílvia',
  'Tainá', 'Valéria', 'Yara', 'Zélia', 'Aparecida', 'Cecília', 'Flávia', 'Mônica',
]

const ptMasculine = [
  'Afonso', 'Breno', 'Caetano', 'Davi', 'Estevão', 'Fábio', 'Gilberto', 'Heitor',
  'Ivo', 'Júlio', 'Leandro', 'Murilo', 'Nélio', 'Otávio', 'Rafael', 'Saulo',
  'Tiago', 'Vítor', 'Wagner', 'Zeca', 'Augusto', 'Cássio', 'Henrique', 'Márcio',
]

const POOLS: Partial<Record<Language, readonly string[]>> = {
  de: interleave(deMasculine, deFeminine),
  en: interleave(enMasculine, enFeminine),
  fr: interleave(frMasculine, frFeminine),
  es: interleave(esMasculine, esFeminine),
  it: interleave(itMasculine, itFeminine),
  pt: interleave(ptMasculine, ptFeminine),
}

const FEMININE: ReadonlySet<string> = new Set([
  ...deFeminine,
  ...enFeminine,
  ...frFeminine,
  ...esFeminine,
  ...itFeminine,
  ...ptFeminine,
])

export function namePool(language: Language): readonly string[] {
  return POOLS[language] ?? (POOLS[FALLBACK_LANGUAGE] as readonly string[])
}

export function hasNamePool(language: Language): boolean {
  return POOLS[language] !== undefined
}

/**
 * Darf zu diesem Namen ein Bart gezeichnet werden?
 *
 * Ein unbekannter Name — später etwa aus einer eigenen Liste — ergibt `true`.
 * Das ist die harmlosere Richtung: Ein Bart, der nicht passt, ist ein schiefes
 * Bild; eine Regel, die stillschweigend alle Bärte abschaltet, wäre ein
 * verschwundenes Merkmal.
 */
export function beardFits(name: string): boolean {
  return !FEMININE.has(name)
}
