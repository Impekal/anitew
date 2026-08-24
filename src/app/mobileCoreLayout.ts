import '../anitew-mobile-core.css'
import './experienceRefinement.ts'

/**
 * Mobile Core geometry belongs to the lazy signature layer, not the cold start.
 * Keep this wrapper deliberately visual: Google Drive authorization is handled
 * by the active Drive architecture and must not be coupled to layout loading.
 */
