import type { Language } from '../core/index.ts'
import type { CourseId } from '../core/courses/progress.ts'
import type { CoachId } from '../core/courses/coaches.ts'
import type { SpokenLanguage } from '../core/courses/media.ts'
import type { DownloadAsset } from '../app/courseDownloads.ts'
/** Verified attribution for this video's actual production pipeline. */
export interface CourseVideoCredit { name:string; url:string; license:string }
export interface CourseVideo extends DownloadAsset {
 course:CourseId; coach:CoachId; language:SpokenLanguage; mime:'video/mp4'
 duration:number; cues:ReadonlyArray<{start:number;end:number}>
 /** Optional complete subtitle tracks for this edited video, in app languages. */
 captions?:Partial<Record<Language,readonly string[]>>
 credits:readonly CourseVideoCredit[]
}
// Complete locally bundled courses only; each video supplies its edited caption timeline.
export const courseVideos:CourseVideo[]=[
  {
    "course": "story-method",
    "coach": "rafael",
    "language": "en",
    "mime": "video/mp4",
    "src": "/course-media/video/atta-story-en-798e41c0c793.mp4",
    "bytes": 1775668,
    "sha256": "798e41c0c79399926a50b2f7984533e86ad375fb480fd743382d7eae8b116da3",
    "duration": 98.67999999999999,
    "cues": [
      {
        "start": 0,
        "end": 2.72
      },
      {
        "start": 2.72,
        "end": 5.76
      },
      {
        "start": 5.76,
        "end": 9
      },
      {
        "start": 9,
        "end": 16.16
      },
      {
        "start": 16.16,
        "end": 22.64
      },
      {
        "start": 22.64,
        "end": 26.72
      },
      {
        "start": 26.72,
        "end": 33.0
      },
      {
        "start": 33.0,
        "end": 37.4
      },
      {
        "start": 37.4,
        "end": 42.44
      },
      {
        "start": 42.44,
        "end": 47.12
      },
      {
        "start": 47.12,
        "end": 52.52
      },
      {
        "start": 52.52,
        "end": 58.48
      },
      {
        "start": 58.48,
        "end": 61.96
      },
      {
        "start": 61.96,
        "end": 66.56
      },
      {
        "start": 66.56,
        "end": 69.08
      },
      {
        "start": 69.08,
        "end": 73.36
      },
      {
        "start": 73.36,
        "end": 76.44
      },
      {
        "start": 76.44,
        "end": 80.63999999999999
      },
      {
        "start": 80.63999999999999,
        "end": 86.08
      },
      {
        "start": 86.08,
        "end": 92.6
      },
      {
        "start": 92.6,
        "end": 98.67999999999999
      }
    ],
    "credits": [
      {
        "name": "MultiTalk",
        "url": "https://github.com/MeiGen-AI/MultiTalk",
        "license": "Apache-2.0"
      },
      {
        "name": "Wan2.1 / city96 GGUF",
        "url": "https://huggingface.co/city96/Wan2.1-I2V-14B-480P-gguf",
        "license": "Apache-2.0"
      },
      {
        "name": "Created with WanGP",
        "url": "https://github.com/deepbeepmeep/Wan2GP",
        "license": "WanGP Community License 2.0 (rendering tool)"
      },
      {
        "name": "Atta voice \u00b7 Qwen3-TTS",
        "url": "https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base",
        "license": "Apache-2.0"
      }
    ]
  }
]
export function courseVideo(course:CourseId,language:SpokenLanguage,coach:CoachId|null){
 return courseVideos.find(video=>video.course===course&&video.language===language&&video.coach===coach)
}
export const courseVideoCopy={
 de:{failed:'Das Video ist gerade nicht abspielbar. Ton und Lesekurs bleiben verfügbar.',format:'Darstellung',audio:'Ton und Illustration',video:'Videokurs',note:'Mit deinem gewählten KI-Coach und Illustrationen. Du kannst jederzeit zum Lesekurs oder zur Tonspur wechseln.'},
 en:{failed:'The video is unavailable right now. Audio and reading remain available.',format:'Presentation',audio:'Audio and illustration',video:'Video course',note:'With your selected AI coach and illustrations. You can switch to reading or audio at any time.'},
 fr:{failed:'La vidéo est indisponible. L’audio et le cours écrit restent accessibles.',format:'Présentation',audio:'Audio et illustration',video:'Cours vidéo',note:'Avec le coach IA choisi et des illustrations. Vous pouvez passer à la lecture ou à l’audio à tout moment.'},
}
