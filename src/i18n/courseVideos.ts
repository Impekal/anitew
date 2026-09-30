import type { CourseId } from '../core/courses/progress.ts'
import type { CoachId } from '../core/courses/coaches.ts'
import type { SpokenLanguage } from '../core/courses/media.ts'
import type { DownloadAsset } from '../app/courseDownloads.ts'
export interface CourseVideo extends DownloadAsset { course:CourseId; coach:CoachId; language:SpokenLanguage; mime:'video/mp4' }
// Only complete locally bundled clips are listed here. No synthesized fallback.
export const courseVideos:CourseVideo[]=[]
export function courseVideo(course:CourseId,language:SpokenLanguage,coach:CoachId|null){
 return courseVideos.find(video=>video.course===course&&video.language===language&&video.coach===coach)
}
export const courseVideoCopy={
 de:{failed:'Das Video ist gerade nicht abspielbar. Ton und Lesekurs bleiben verfügbar.',format:'Darstellung',audio:'Ton und Illustration',video:'Video-Probe',note:'Video-Probe mit deinem gewählten KI-Coach. Die Bewegung ist noch in Prüfung. Lesen und Ton bleiben verfügbar.'},
 en:{failed:'The video is unavailable right now. Audio and reading remain available.',format:'Presentation',audio:'Audio and illustration',video:'Video preview',note:'Video preview with your selected AI coach. Motion quality is still under review. Reading and audio remain available.'},
 fr:{failed:'La vidéo est indisponible. L’audio et le cours écrit restent accessibles.',format:'Présentation',audio:'Audio et illustration',video:'Aperçu vidéo',note:'Aperçu vidéo avec le coach IA choisi. La qualité des mouvements reste à vérifier. La lecture et l’audio restent disponibles.'},
}
