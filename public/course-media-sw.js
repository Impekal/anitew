/* The player needs complete cached audio plus HTTP Range responses for seeking.
 * Keep this cache version aligned with audio revisions in the story manifest. */
const COURSE_MEDIA_CACHE = 'anitew-story-audio-v1'
self.addEventListener('install', event => {
  event.waitUntil(caches.open(COURSE_MEDIA_CACHE).then(cache => cache.addAll([
    '/course-media/story/de.m4a', '/course-media/story/en.m4a', '/course-media/story/fr.m4a',
  ])))
})
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys
    .filter(key => key.startsWith('anitew-story-audio-') && key !== COURSE_MEDIA_CACHE)
    .map(key => caches.delete(key)))))
})
