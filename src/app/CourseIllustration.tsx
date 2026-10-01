import type { CourseId } from '../core/courses/progress.ts'
import type { CourseLanguage } from '../i18n/courseUi.ts'
const labels={
 de:{title:'Die Methode im Bild',meaning:['Maßnahme','Wirkung','Voraussetzung'],verbatim:['Satz 1','Satz 2','Satz 3'],recall:['Vorlage ansehen','Verdecken','Selbst abrufen','Vergleichen'],spaced:['Abrufen','Pause','Erneut abrufen','Abstand anpassen'],groups:['Obst','Werkzeug','Kleidung'],explain:['Behauptung','Begründung','Am Beispiel prüfen'],loci:['Haustür · Brot','Regal · Seife','Tisch · Kerze'],keyword:['bell','bellender Hund','Glocke'],word:['Kranken','versicherung','s','beitrag'],number:['12','t + n','Tanne'],mixed:['Lernziel erkennen','Methode wählen','Lösung prüfen']},
 en:{title:'The method in a diagram',meaning:['Action','Effect','Condition'],verbatim:['Sentence 1','Sentence 2','Sentence 3'],recall:['Study the source','Hide it','Recall','Compare'],spaced:['Recall','Pause','Recall again','Adjust interval'],groups:['Fruit','Tools','Clothing'],explain:['Claim','Reason','Check an example'],loci:['Door · bread','Shelf · soap','Table · candle'],keyword:['pain','pan → jumping bread','bread'],word:['un','predict','ability'],number:['12','t + n','tin'],mixed:['Identify the goal','Choose a method','Check the solution']},
 fr:{title:'La méthode en schéma',meaning:['Mesure','Effet','Condition'],verbatim:['Phrase 1','Phrase 2','Phrase 3'],recall:['Étudier le modèle','Le masquer','Rappeler','Comparer'],spaced:['Rappel','Pause','Nouveau rappel','Adapter l’intervalle'],groups:['Fruits','Outils','Vêtements'],explain:['Affirmation','Raison','Vérifier un exemple'],loci:['Porte · pain','Étagère · savon','Table · bougie'],keyword:['bell','belle','cloche'],word:['in','compréhensible'],number:['12','t + n','tonne'],mixed:['Identifier le but','Choisir une méthode','Vérifier la solution']},
}
export function CourseIllustration({id,locale}:{id:CourseId;locale:CourseLanguage}){
 const t=labels[locale]
 const steps=id==='text-meaning'?t.meaning:id==='text-verbatim'?t.verbatim:id==='long-words'?t.word:id==='active-recall'?t.recall:id==='spaced-practice'?t.spaced:id==='meaningful-groups'?t.groups:id==='self-explanation'?t.explain:id==='method-of-loci'?t.loci:id==='keyword-method'?t.keyword:id==='number-images'?t.number:t.mixed
 if(id==='story-method')return null
 return <figure className={`course-illustration illustration-${id}`}><figcaption>{t.title}</figcaption>
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
  <ol>{steps.map((label,index)=><li key={label}><span className="illustration-number" aria-hidden="true">{index+1}</span>{label}</li>)}</ol>
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
