import { compareVerbatim } from '../core/courses/verbatim.ts'
import type { CourseLanguage } from '../i18n/courseUi.ts'
const copy={de:{title:'Wortlaut vergleichen',note:'Wörter, Groß-/Kleinschreibung und Satzzeichen werden verglichen; Abstände nicht. Das ist keine Bewertung des Inhalts oder deiner Gedächtnisleistung.',missing:'In deiner Antwort fehlt',extra:'Zusätzlich in deiner Antwort',same:'Wortlaut stimmt überein.',long:'Für diesen langen Text vergleiche bitte abschnittsweise mit der Vorlage.'},en:{title:'Compare exact wording',note:'Words, capitalization and punctuation are compared; spacing is ignored. This does not assess meaning or memory ability.',missing:'Missing from your answer',extra:'Extra in your answer',same:'The wording matches.',long:'For this long text, compare with the source one passage at a time.'},fr:{title:'Comparer le texte exact',note:'Les mots, majuscules et signes de ponctuation sont comparés ; les espaces ne le sont pas. Ce n’est pas une évaluation du sens ou de ta mémoire.',missing:'Absent de ta réponse',extra:'En plus dans ta réponse',same:'Le texte correspond.',long:'Pour ce texte long, compare chaque passage avec le modèle.'}}
export function VerbatimComparison({source,answer,locale}:{source:string;answer:string;locale:CourseLanguage}){
 const t=copy[locale],differences=compareVerbatim(source,answer)
 return <section className="course-word-diff"><h4>{t.title}</h4><p className="hint">{t.note}</p>
 {differences===null?<p>{t.long}</p>:differences.every(item=>item.kind==='same')?<p>{t.same}</p>:<ul>{(['missing','extra'] as const).map(kind=><li key={kind}><strong>{t[kind]}:</strong> {differences.filter(item=>item.kind===kind).map(item=>item.text).join(' ')||'—'}</li>)}</ul>}
 </section>
}
