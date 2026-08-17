/**
 * Die App holt sich neue Fassungen von selbst.
 *
 * Vorher tat sie das nur halb, und das ist ein klassischer Fallstrick bei
 * installierten Web-Apps: Der Service Worker lädt die neue Fassung im
 * Hintergrund und übernimmt auch — aber die **bereits offene Seite behält die
 * Dateien, die sie beim Öffnen bekommen hat**. Erst die *zweite* Neuladung
 * zeigt die Änderung. Von außen sieht das aus, als wäre nichts passiert; man
 * sucht dann den Fehler in der Änderung statt im Zwischenspeicher. Genau das
 * ist passiert, nachdem der Schein für den hellen Modus korrigiert war.
 *
 * Hier steht deshalb das übliche, verlässliche Muster:
 *
 * 1. Beim Start und bei jeder Rückkehr aus dem Hintergrund wird nachgefragt,
 *    ob es etwas Neues gibt. Ohne das prüft eine installierte App unter
 *    Umständen tagelang nicht.
 * 2. Sobald der neue Service Worker die Seite übernimmt, wird **einmal** neu
 *    geladen. Danach laufen Code und Gestaltung aus derselben Fassung.
 *
 * Die Bedingung `hadController` ist der Grund, warum das nicht in einer
 * Schleife endet: Beim allerersten Besuch gibt es noch keinen Service Worker,
 * die Übernahme ist dann keine Aktualisierung, sondern die Erstinstallation —
 * und ein Neuladen wäre nur ein Flackern ohne Anlass.
 */
export function keepUpToDate(): void {
  if (!('serviceWorker' in navigator)) return

  const hadController = navigator.serviceWorker.controller !== null
  let reloading = false

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || reloading) return
    reloading = true
    window.location.reload()
  })

  const check = () => {
    void navigator.serviceWorker
      .getRegistration()
      .then((registration) => registration?.update())
      .catch(() => {
        // Kein Netz, kein Problem — beim nächsten Mal wieder.
      })
  }

  check()
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) check()
  })
}
