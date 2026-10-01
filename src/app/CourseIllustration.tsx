import type { CourseId } from '../core/courses/progress.ts'
import type { CourseLanguage } from '../i18n/courseUi.ts'
const labels={
 de:{title:'Die Methode im Bild',meaning:['Maßnahme','Wirkung','Voraussetzung'],verbatim:['Satz 1','Satz 2','Satz 3'],recall:['Vorlage ansehen','Verdecken','Selbst abrufen','Vergleichen'],spaced:['Abrufen','Pause','Erneut abrufen','Abstand anpassen'],groups:['Obst','Werkzeug','Kleidung'],explain:['Behauptung','Begründung','Am Beispiel prüfen'],loci:['Haustür · Brot','Regal · Seife','Tisch · Kerze'],keyword:['bell','bellen','Glocke'],word:['Kranken','versicherung','s','beitrag'],number:['12','t + n','Tanne'],mixed:['Lernziel erkennen','Methode wählen','Lösung prüfen']},
 en:{title:'The method in a diagram',meaning:['Action','Effect','Condition'],verbatim:['Sentence 1','Sentence 2','Sentence 3'],recall:['Study the source','Hide it','Recall','Compare'],spaced:['Recall','Pause','Recall again','Adjust interval'],groups:['Fruit','Tools','Clothing'],explain:['Claim','Reason','Check an example'],loci:['Door · bread','Shelf · soap','Table · candle'],keyword:['pain','pan','bread'],word:['un','predict','ability'],number:['12','t + n','tin'],mixed:['Identify the goal','Choose a method','Check the solution']},
 fr:{title:'La méthode en schéma',meaning:['Mesure','Effet','Condition'],verbatim:['Phrase 1','Phrase 2','Phrase 3'],recall:['Étudier le modèle','Le masquer','Rappeler','Comparer'],spaced:['Rappel','Pause','Nouveau rappel','Adapter l’intervalle'],groups:['Fruits','Outils','Vêtements'],explain:['Affirmation','Raison','Vérifier un exemple'],loci:['Porte · pain','Étagère · savon','Table · bougie'],keyword:['bell','belle','cloche'],word:['in','compréhensible'],number:['12','t + n','tonne'],mixed:['Identifier le but','Choisir une méthode','Vérifier la solution']},
}
const keywordBridge={
 de:{roles:['Fremdwort','Klanghilfe','Bedeutung'],scene:'Eine Glocke bellt wie ein Hund.',note:'„Bellen“ ist nur die Merkhilfe. Prüfe Aussprache, Schreibweise und Beispielsatz von „bell“ am Original.',target:'en'},
 en:{roles:['Foreign word','Sound cue','Meaning'],scene:'Bread leaps out of a pan.',note:'“Pan” is only a memory cue. French “pain” has a nasal vowel; check its pronunciation, spelling and example sentence in the original.',target:'fr'},
 fr:{roles:['Mot étranger','Indice sonore','Sens'],scene:'Une très belle cloche qui sonne.',note:'« Belle » est seulement un aide-mémoire. Vérifie la prononciation, l’orthographe et la phrase d’exemple de « bell » dans l’original.',target:'en'},
}
const reconstruction={
 de:{word:'Bausteine zusammenfügen',reverse:'Vom Bild zurück zur Zahl',note:'Konsonantenlaute zählen; Vokale und doppelte Buchstaben zählen nicht zusätzlich.'},
 en:{word:'Put the word parts together',reverse:'From the image back to the number',note:'Count consonant sounds; vowels and doubled letters do not add digits.'},
 fr:{word:'Réunir les parties du mot',reverse:'De l’image au nombre',note:'Compte les sons consonantiques ; les voyelles et les lettres doublées n’ajoutent pas de chiffres.'},
}
const groupedItems={
 de:[['Apfel','Birne','Banane'],['Hammer','Säge','Zange'],['Hemd','Jacke','Hose']],
 en:[['Apple','Pear','Banana'],['Hammer','Saw','Pliers'],['Shirt','Jacket','Trousers']],
 fr:[['Pomme','Poire','Banane'],['Marteau','Scie','Pince'],['Chemise','Veste','Pantalon']],
}
const groupSymbols=[
 'M30 15c-9-8-20 0-18 12s9 20 18 15c9 5 16-3 18-15s-9-20-18-12m0 0c0-8 5-12 11-12',
 'M13 8h27v12H30v27H20V20h-7Z',
 'm20 8-15 9 7 12 8-4v23h22V25l8 4 7-12-15-9c-4 9-18 9-22 0Z',
]
export function CourseIllustration({id,locale}:{id:CourseId;locale:CourseLanguage}){
 const t=labels[locale]
 const steps=id==='text-meaning'?t.meaning:id==='text-verbatim'?t.verbatim:id==='long-words'?t.word:id==='active-recall'?t.recall:id==='spaced-practice'?t.spaced:id==='meaningful-groups'?t.groups:id==='self-explanation'?t.explain:id==='method-of-loci'?t.loci:id==='keyword-method'?t.keyword:id==='number-images'?t.number:t.mixed
 if(id==='story-method')return null
 return <figure lang={locale} className={`course-illustration illustration-${id}`}><figcaption>{t.title}</figcaption>
  {id==='self-explanation'&&<svg viewBox="0 0 300 100" role="img" aria-label="3/4 = 6/8">
   {[{parts:4,y:6},{parts:8,y:57}].map(({parts,y})=><g key={parts}>
    <rect className="fraction-selected" x="10" y={y} width="195" height="28" fill="var(--an-gold,#c2a564)"/>
    <rect className="fraction-whole" x="10" y={y} width="260" height="28" fill="none" stroke="currentColor"/>
    {Array.from({length:parts-1},(_,i)=><path key={i} d={`M${10+(i+1)*260/parts} ${y}v28`} stroke="currentColor"/>)}
   </g>)}
   <text x="275" y="27" fill="currentColor" fontSize="11">3/4</text><text x="275" y="78" fill="currentColor" fontSize="11">6/8</text>
  </svg>}
  {id==='interleaved-practice'&&<svg viewBox="0 0 300 120" role="img" aria-label="4 × 3 = 12; 4 × 3 ÷ 2 = 6">
   <rect x="15" y="12" width="100" height="75" fill="#c2a564" fillOpacity=".35" stroke="currentColor"/><path d="M170 87V12L270 87Z" fill="#c2a564" fillOpacity=".35" stroke="currentColor"/>
   <text x="40" y="110" fill="currentColor">12 cm²</text><text x="200" y="110" fill="currentColor">6 cm²</text>
  </svg>}
  {id==='method-of-loci'&&<svg viewBox="0 0 330 145" role="img" aria-label={t.loci.join(' → ')}>
   <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
    <path d="M30 112V20h50v92M70 65h3"/>
    <path d="M22 69c-7-25 57-29 64-8l-4 25-57 6Z" fill="var(--an-gold,#c2a564)"/>
    <path d="m39 60 4 17m11-20 4 17m10-20 4 17"/>
    <path d="M128 112V35h65v77m-65-47h65m-65 25h65"/>
    {[{x:137,y:60,r:10},{x:155,y:51,r:13},{x:176,y:61,r:12},{x:146,y:80,r:12},{x:166,y:87,r:15},{x:184,y:100,r:11}].map(({x,y,r})=><circle key={x} cx={x} cy={y} r={r} fill="var(--an-bg,#142523)"/>)}
    <path d="M239 85h70v10h-70Zm8 10v20m54-20v20"/>
    <path d="M267 85V48h14v37Z" fill="var(--an-gold,#c2a564)"/>
    <path d="M274 46c-13-8 0-17 0-24 9 12 11 18 0 24Z" fill="var(--an-gold,#c2a564)"/>
    <path d="M94 123h24m-6-5 6 5-6 5m88-5h24m-6-5 6 5-6 5"/>
   </g>
   <g fill="currentColor" textAnchor="middle" fontSize="13"><text x="55" y="137">1</text><text x="160" y="137">2</text><text x="274" y="137">3</text></g>
  </svg>}
  {id==='keyword-method'&&<>
   <svg viewBox="0 0 300 135" role="img" aria-label={keywordBridge[locale].scene}>
    <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
     {locale==='en'?<>
      <path d="M65 87h120c-4 28-116 28-120 0Zm120 0 55-15"/>
      <path d="M97 53c-14-29 54-38 57-10l-1 25-55 5Z" fill="var(--an-gold,#c2a564)"/>
      <path d="m111 42 4 13m13-15 4 13m-49 20-8-16m87 14 10-18"/>
     </>:<>
      <path d="M125 93c14-13 6-52 30-52s16 39 30 52Zm20 2c0 18 20 18 20 0m-10-54v-9" fill="var(--an-gold,#c2a564)"/>
      <path d="M113 52c-13 13-13 28 0 39m83-39c13 13 13 28 0 39"/>
      {locale==='de'?<><path d="m41 79 12-24 18 8 14 16-12 9v23H37V86Zm12-24-15-7 3 31m44 0h13m-31-9h1"/><path d="m98 65 9-5m-9 29 9 5"/></>:<path d="m75 35 4 12 12 4-12 4-4 12-4-12-12-4 12-4Zm150-9 3 9 9 3-9 3-3 9-3-9-9-3 9-3Z"/>}
     </>}
    </g>
   </svg>
   <p>{keywordBridge[locale].scene}</p>
  </>}
  {id==='number-images'&&<svg viewBox="0 0 300 120" role="img" aria-label={t.number[2]}>
   <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
    {locale==='de'?<><path d="M150 10 120 46h15l-30 32h30l-35 25h100l-35-25h30l-30-32h15Z" fill="var(--an-gold,#c2a564)"/><path d="M145 103v12h10v-12"/></>:locale==='en'?<><ellipse cx="150" cy="25" rx="36" ry="12"/><path d="M114 25v68c0 16 72 16 72 0V25M114 45c0 16 72 16 72 0m-72 28c0 16 72 16 72 0"/></>:<><path d="m80 102 65-77 75 77Z" fill="var(--an-gold,#c2a564)"/><path d="M95 102h110v12H95Z"/><text x="150" y="89" textAnchor="middle" fill="currentColor" stroke="none" fontSize="18">1 t</text></>}
   </g>
  </svg>}
  <ol>{steps.map((label,index)=><li key={label}>
   <span className="illustration-number" aria-hidden="true">{index+1}</span>
   {id==='keyword-method'?<><small>{keywordBridge[locale].roles[index]}</small><p lang={index===0?keywordBridge[locale].target:locale}><strong>{label}</strong></p></>:label}
   {id==='meaningful-groups'&&<>
    <svg viewBox="0 0 64 56" aria-hidden="true" height="56"><path d={groupSymbols[index]} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
    {groupedItems[locale][index].map(item=><p key={item}>{item}</p>)}
   </>}
  </li>)}</ol>
  {id==='keyword-method'&&<p className="keyword-pronunciation-note">{keywordBridge[locale].note}</p>}
  {id==='long-words'&&<div className="word-reconstruction">
   <p>{reconstruction[locale].word}</p>
   <p aria-hidden="true">{t.word.join(' + ')} →</p>
   <p><strong style={{overflowWrap:'anywhere'}}>{t.word.join('')}</strong></p>
  </div>}
  {id==='number-images'&&<div className="number-reconstruction">
   <p>{reconstruction[locale].reverse}</p>
   <p>{t.number[2]} → t → 1; n → 2 ⇒ <strong>12</strong></p>
   <p>{reconstruction[locale].note}</p>
  </div>}
 </figure>
}

/** Reveal only steps already explained by the selected narration. */
export function CourseStepIllustration({steps,current,locale,language}:{steps:readonly string[];current:number;locale:CourseLanguage;language:string}){
 const title={de:'Schritt für Schritt',en:'Step by step',fr:'Étape par étape'}[locale]
 return <figure className="course-illustration course-step-illustration">
  <figcaption>{title}</figcaption>
  <ol lang={language} dir="auto">{steps.slice(0,current+1).map((text,index)=><li key={index} aria-current={index===current?'step':undefined}>
   <span className="illustration-number" aria-hidden="true">{index+1}</span>{text}
  </li>)}</ol>
 </figure>
}
