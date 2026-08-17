/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

/** Wird in vite.config.ts eingesetzt — siehe dort. */
declare const __ANITEW_BUILD__: {
  readonly version: string
  readonly commit: string
  readonly builtAt: string
}
