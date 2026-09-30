export type CourseLanguage = 'de' | 'en' | 'fr'
export const courseLanguage = (language: string): CourseLanguage => language === 'de' || language === 'fr' ? language : 'en'
const french = {
  "Saved progress is unavailable.": "La progression enregistrée est indisponible.",
  "Read, recall and compare. These exercises work offline. The existing training lessons remain available. Coach videos are still being developed.": "Lis, rappelle et compare. Ces exercices fonctionnent hors ligne. Les leçons d’entraînement existantes restent disponibles. Les vidéos des coachs sont encore en préparation.",
  "Completion records practice, not measured memory performance.": "La validation indique qu’un exercice a été effectué, pas une mesure de la mémoire.",
  "Exercise practised": "Exercice effectué",
  "Open course": "Ouvrir le cours",
  "Progress could not be saved. Your answer is still here; please retry.": "La progression n’a pas pu être enregistrée. Ta réponse est toujours présente ; réessaie.",
  "Back to courses": "Retour aux cours",
  "What is it for?": "Qu’est-ce que c’est et à quoi cela sert-il ?",
  "Limits and prerequisites": "Limites et prérequis",
  "How to practise": "Comment procéder",
  "Worked example": "Exemple expliqué",
  "Practise with your own material": "S’entraîner avec son propre contenu",
  "Your text or word (for this attempt only)": "Ton texte ou ton mot (pour cet essai uniquement)",
  "Your material and answer are neither saved nor sent. They are discarded when you leave this course.": "Ton contenu et ta réponse ne sont ni enregistrés ni envoyés. Ils sont effacés lorsque tu quittes ce cours.",
  "Use my material instead of the example": "Utiliser mon contenu à la place de l’exemple",
  "Hide source and practise": "Masquer le modèle et s’entraîner",
  "Recall your material without looking, following the course goal.": "Rappelle ton contenu sans regarder, en suivant l’objectif du cours.",
  "Your answer": "Ta réponse",
  "Compare with the source": "Comparer avec le modèle",
  "Study again": "Revoir le contenu",
  "Original": "Original",
  "Compare for yourself. Check each item after reviewing it and correcting mistakes. This is not an automatic score.": "Compare toi-même. Coche chaque point après l’avoir vérifié et avoir corrigé les erreurs. Il ne s’agit pas d’une note automatique.",
  "Recall again without looking": "Réessayer sans modèle",
  "Complete exercise": "Terminer l’exercice",
  "Exercise practised and saved.": "Exercice effectué et progression enregistrée.",
  "Try recalling it again later. If it is difficult, shorten the passage or clarify uncertain parts.": "Essaie de rappeler le contenu plus tard. Si c’est difficile, raccourcis le passage ou clarifie les points incertains.",
  "Practise again": "S’entraîner à nouveau"
} as const
export function courseCopy(language: CourseLanguage, german: string, english: keyof typeof french): string {
  return language === 'fr' ? french[english] : language === 'de' ? german : english
}
export const courseStages = {
  de: { learn: 'Erklärung', recall: 'Selbst abrufen', compare: 'Vergleichen', done: 'Weiterüben' },
  en: { learn: 'Learn', recall: 'Recall', compare: 'Compare', done: 'Keep practising' },
  fr: { learn: 'Explication', recall: 'Rappel', compare: 'Comparaison', done: 'Poursuivre' },
} as const
