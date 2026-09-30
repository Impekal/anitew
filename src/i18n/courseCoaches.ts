import type { CourseLanguage } from './courseUi.ts'
export const courseCoachCopy = {
  de: {
    title: 'Deine Kurs-Coaches', mode: 'Coach-Zuordnung', standard: 'Standard je Kurs', global: 'Ein Coach für alle Kurse', custom: 'Selbst je Kurs auswählen',
    all: 'Coach für alle Kurse', inherit: 'Kursstandard', names: { original: 'Jüngerer Coach', lin: 'Lin', rafael: 'Rafael' },
    note: 'Fiktive KI-Coaches als Standbilder. Sprechvideos sind noch in Arbeit. Deine Zuordnung gilt in allen Kurssprachen.',
    saved: 'Coach-Auswahl gespeichert.', failed: 'Die Auswahl gilt für diesen Besuch, konnte aber nicht gespeichert werden. Bitte erneut speichern.',
    loadFailed: 'Die gespeicherte Auswahl ist nicht verfügbar. Du kannst für diesen Besuch einen Coach wählen.', retry: 'Erneut speichern', portrait: 'Fiktiver KI-Coach als Standbild',
  },
  en: {
    title: 'Your course coaches', mode: 'Coach assignment', standard: 'Default for each course', global: 'One coach for all courses', custom: 'Choose for each course',
    all: 'Coach for all courses', inherit: 'Course default', names: { original: 'Younger coach', lin: 'Lin', rafael: 'Rafael' },
    note: 'Fictional AI coaches shown as still portraits. Speaking videos are still in development. Your assignment applies in every course language.',
    saved: 'Coach selection saved.', failed: 'This selection applies to this visit but could not be saved. Please try saving again.',
    loadFailed: 'Your saved selection is unavailable. You can choose a coach for this visit.', retry: 'Save again', portrait: 'Fictional AI coach shown as a still portrait',
  },
  fr: {
    title: 'Tes coachs de cours', mode: 'Choix des coachs', standard: 'Coach par défaut pour chaque cours', global: 'Un coach pour tous les cours', custom: 'Choisir pour chaque cours',
    all: 'Coach pour tous les cours', inherit: 'Choix par défaut du cours', names: { original: 'Coach plus jeune', lin: 'Lin', rafael: 'Rafael' },
    note: 'Coachs fictifs créés par IA, présentés en portraits fixes. Les vidéos parlantes sont encore en préparation. Ton choix vaut pour toutes les langues des cours.',
    saved: 'Choix du coach enregistré.', failed: 'Ce choix s’applique à cette visite, mais n’a pas pu être enregistré. Réessaie de l’enregistrer.',
    loadFailed: 'Ton choix enregistré est indisponible. Tu peux choisir un coach pour cette visite.', retry: 'Réessayer l’enregistrement', portrait: 'Coach fictif créé par IA, en portrait fixe',
  },
} satisfies Record<CourseLanguage, unknown>
