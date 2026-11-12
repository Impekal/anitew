import { courseExtraCaptions } from './courseExtraCaptions.ts'
import { courseLibraryMedia } from './courseLibraryMedia.ts'
import type { CourseId } from '../core/courses/progress.ts'
import type { CourseLanguage } from './courseUi.ts'

// The three authored versions share cue sections, but mnemonic examples differ.
// Translate the spoken example; never substitute another language's exercise.
const examples = {
 'long-words': {
  de: {en:['Krankenversicherungsbeitrag','Kranken | versicherung | s | beitrag: a health insurance contribution. The s connects word parts; it has no separate meaning here. These are meaning units, not syllables.'],fr:['Krankenversicherungsbeitrag','Kranken | versicherung | s | beitrag : la cotisation à l’assurance maladie. Le s relie les éléments ; il ne porte pas de sens autonome ici. Ce découpage montre des éléments de sens, pas des syllabes.']},
  en: {de:['unpredictability','un | predict | ability: die Eigenschaft, schwer oder gar nicht vorhersagbar zu sein. Das letzte e von „predictable“ bleibt in „unpredictability“ nicht erhalten. Dies sind hilfreiche Bedeutungsbausteine, keine Ausspracheanleitung.'],fr:['unpredictability','un | predict | ability : le caractère difficile ou impossible à prévoir. Le e final de « predictable » disparaît dans « unpredictability ». Ce sont des unités de sens utiles, pas un guide de prononciation.']},
  fr: {de:['incompréhensible','in | compréhensible: etwas, das man nicht verstehen kann. „in“ verneint hier „compréhensible“. „Compréhensible“ hängt mit dem Verb „comprendre“ zusammen. Die Bausteine helfen beim Verstehen; sie sind keine Umschrift der Aussprache.'],en:['incompréhensible','in | compréhensible: something that cannot be understood. Here, “in” negates “compréhensible”. “Compréhensible” is related to the verb “comprendre”. This division helps with meaning; it is not a transcription of pronunciation.']},
 },
 'keyword-method': {
  de: {en:['English: bell = Glocke (German). Example: The bell rings. = Die Glocke läutet.','The German word “bellen” can provide a sound cue: imagine a bell barking like a dog. “Bellen” is the mnemonic, not the English pronunciation of bell.'],fr:['Anglais : bell = Glocke en allemand, « cloche » en français. Exemple : The bell rings. = Die Glocke läutet.','Le mot allemand « bellen » peut servir d’indice sonore : imagine une cloche qui aboie comme un chien. « Bellen » est l’aide-mémoire, pas la prononciation anglaise de bell.']},
  en: {de:['Französisch: pain = Brot. Beispielsatz: Je mange du pain. = Ich esse Brot.','Das englische Wort „pan“ kann als ungefähre Klangbrücke dienen: Stelle dir Brot vor, das aus einer Pfanne springt. Französisch „pain“ hat einen Nasalvokal und wird nicht wie englisch „pan“ oder „pain“ ausgesprochen. Die Brücke ist eine Merkhilfe, kein Aussprachemodell.'],fr:['Français : pain = bread en anglais. Exemple : Je mange du pain. = I eat bread.','Le mot anglais « pan » peut servir d’indice sonore approximatif : imagine du pain qui saute d’une poêle. Le français « pain » contient une voyelle nasale et ne se prononce pas comme les mots anglais « pan » ou « pain ». Cet indice aide à mémoriser, pas à prononcer.']},
  fr: {de:['Englisch: bell = cloche auf Französisch, Glocke auf Deutsch. Beispiel: The bell rings. = La cloche sonne.','Das französische Wort „belle“ kann als Klangbrücke dienen: Stelle dir eine sehr schöne Glocke vor, die läutet. „Belle“ ist die Merkhilfe, keine Umschrift der englischen Aussprache von bell.'],en:['English: bell = cloche in French. Example: The bell rings. = La cloche sonne.','The French word “belle” can be a sound cue: imagine a very beautiful bell ringing. “Belle” is the mnemonic, not a transcription of the English pronunciation of bell.']},
 },
 'number-images': {
  de: {en:['1 → t/d; 2 → n. The number 12 can become an image of a fir tree, “Tanne” in German: t + n.','In reverse, t gives 1 and n gives 2: this recovers 12. The consonant sounds of “Tanne” matter, not just its spelling.'],fr:['1 → t/d ; 2 → n. Le nombre 12 peut devenir l’image d’un sapin, « Tanne » en allemand : t + n.','Dans l’autre sens, t donne 1 et n donne 2 : on retrouve 12. Ce sont les sons consonantiques de « Tanne » qui comptent, pas seulement les lettres.']},
  en: {de:['1 → t/d; 2 → n. Die Zahl 12 kann zum Bild einer Dose werden, englisch „tin“: t + n.','Rückwärts ergibt t die 1 und n die 2, also wieder 12. Entscheidend sind die Konsonantenlaute des englischen Wortes „tin“, nicht nur die geschriebenen Buchstaben.'],fr:['1 → t/d ; 2 → n. Le nombre 12 peut devenir l’image d’une boîte en métal, « tin » en anglais : t + n.','Dans l’autre sens, t donne 1 et n donne 2 : on retrouve 12. Les sons consonantiques du mot anglais « tin » comptent, pas seulement les lettres.']},
  fr: {de:['1 → t/d; 2 → n. Die Zahl 12 kann zum Bild einer Tonne Sand werden, französisch „tonne“: t + n.','Rückwärts ergibt t die 1 und n die 2, also wieder 12. Entscheidend sind die Konsonantenlaute des französischen Wortes „tonne“, nicht nur die geschriebenen Buchstaben.'],en:['1 → t/d; 2 → n. The number 12 can become an image of a tonne of sand, “tonne” in French: t + n.','In reverse, t gives 1 and n gives 2: this recovers 12. The consonant sounds of the French word “tonne” matter, not just the written letters.']},
 },
} as const

// Preserve the actual exercise, including writing/speaking and the reverse path.
// A generic request to explain a mnemonic omits parts of the narrated task.
const recallPrompts = {
 'keyword-method': {
  de:{en:'Which English word means Glocke (bell)? Write the word, its meaning and the example sentence from memory.',fr:'Quel mot anglais signifie Glocke (cloche) ? Écris le mot, son sens et la phrase d’exemple de mémoire.'},
  en:{de:'Welche französische Vokabel bedeutet Brot? Schreibe die Vokabel, ihre Bedeutung und den Beispielsatz aus dem Gedächtnis.',fr:'Quel mot français signifie pain ? Écris le mot, son sens et la phrase d’exemple de mémoire.'},
  fr:{de:'Welche englische Vokabel bedeutet cloche (Glocke)? Schreibe die Vokabel, ihre Bedeutung und den Beispielsatz aus dem Gedächtnis.',en:'Which English word means cloche (bell)? Write the word, its meaning and the example sentence from memory.'},
 },
 'number-images': {
  de:{en:'Which number does the image of a fir tree, German “Tanne”, encode? Explain the reverse path through the two consonant sounds.',fr:'Quel nombre code l’image d’un sapin, « Tanne » en allemand ? Explique le retour par les deux consonnes prononcées.'},
  en:{de:'Welche Zahl steckt im Bild einer Dose, englisch „tin“? Erkläre den Rückweg über die beiden Konsonantenlaute.',fr:'Quel nombre code l’image d’une boîte en métal, « tin » en anglais ? Explique le retour par les deux consonnes prononcées.'},
  fr:{de:'Welche Zahl steckt im Bild einer Tonne Sand, französisch „tonne“? Erkläre den Rückweg über die beiden Konsonantenlaute.',en:'Which number does the image of a tonne of sand, French “tonne”, encode? Explain the reverse path through the two consonant sounds.'},
 },
} as const

export function libraryCaptions(id:Exclude<CourseId,'story-method'>,spoken:CourseLanguage,target:string):string[]|undefined {
 if(target!=='de'&&target!=='en'&&target!=='fr')return courseExtraCaptions[id]?.[spoken]?.[target]
 const source=courseLibraryMedia[id][spoken]
 const translated:string[]=courseLibraryMedia[id][target].cues.map(cue=>cue.text)
 if(spoken===target)return translated
 const table=examples as Partial<Record<string,Partial<Record<CourseLanguage,Partial<Record<CourseLanguage,readonly string[]>>>>>>
 const replacement=table[id]?.[spoken]?.[target]
 if(replacement) {
  for(const [index,cue] of source.cues.entries()) {
   if(cue.section==='example')translated[index]=replacement[0]!
   if(cue.section==='explanation')translated[index]=replacement[1]!
   if(id==='long-words'&&cue.section==='step-2') {
    translated[index]=spoken==='de'
     ? target==='fr'?'Observe les éléments de liaison, comme le s dans Versicherungsbeitrag.':'Notice connecting elements such as the s in Versicherungsbeitrag.'
     : target==='de'?'Achte auf Änderungen der Schreibweise und auf Verbindungselemente.':translated[index]!
   }
   if(cue.section==='recall'&&(id==='keyword-method'||id==='number-images')) {
    const prompts=recallPrompts[id][spoken] as Partial<Record<CourseLanguage,string>>
    translated[index]=prompts[target]??translated[index]!
   }
  }
 }
 return translated
}
