/**
 * Adressen, die der PWA-Navigations-Fallback **nicht** mit der gecachten
 * index.html beantworten darf.
 *
 * Warum das eine eigene Datei ist: Diese Liste stand in `vite.config.ts` und
 * war dort nicht prüfbar. Sie war außerdem falsch — auf eine Weise, die man
 * nur in der Auslieferung sieht, nie in `vite preview`.
 *
 * Der Fehler (gemeldet vom Gerät, 30.08.): Ein Tipp auf „Impressum" oder
 * „Datenschutz" brachte den Nutzer auf den Startbildschirm zurück, ohne Text.
 * Die Kette, nachgemessen gegen `wrangler dev --local`, also gegen das echte
 * Asset-Verhalten von Cloudflare:
 *
 *   1. Der Link zeigt auf `/impressum.html`.
 *   2. Cloudflare Static Assets antwortet mit `307 -> /impressum`
 *      (`html_handling: auto-trailing-slash`, die Voreinstellung).
 *   3. Die Umleitung erzeugt eine **neue** Navigation auf `/impressum`.
 *   4. Die alte Sperrliste kannte nur `/^\/impressum\.html$/` — ohne Endung
 *      traf sie nicht. Der Service Worker fing die Navigation ab und lieferte
 *      die App-Shell. Für den Menschen sah es aus, als springe ANITEW einfach
 *      auf den Startbildschirm.
 *
 * `vite preview` leitet nicht um und liefert die Seite direkt aus — deshalb
 * war der Weg in jedem Testlauf grün und trotzdem auf dem Telefon kaputt.
 * Beide Schreibweisen gehören also in die Liste.
 */
export const NAVIGATION_DENYLIST: readonly RegExp[] = [
  // Echte Worker-Endpunkte, keine Seiten der App.
  /^\/oauth\/google\//,
  /^\/push\//,
  // Die Rechtstexte sind eigene Dokumente. Mit und ohne `.html`, siehe oben.
  /^\/impressum(\.html)?$/,
  /^\/datenschutz(\.html)?$/,
]
