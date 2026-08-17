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
 *
 * **Warum die Rückkehr aus dem Hintergrund der wichtigste Auslöser ist:** Eine
 * vom Startbildschirm installierte App wird auf iOS in aller Regel nur geweckt
 * und nicht neu geladen. Ohne die Nachfrage beim Sichtbarwerden prüft sie
 * deshalb nie, ob es etwas Neues gibt — und man hilft sich mit Deinstallieren
 * und Neuinstallieren. Genau dieser Weg soll hier verschwinden.
 */
export function keepUpToDate(): void {
  if (!('serviceWorker' in navigator)) return

  const hadController = navigator.serviceWorker.controller !== null
  let reloading = false

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || reloading) return
    reloading = true
    reloadWhenNotTraining()
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

/**
 * Neu laden ja — aber nicht mitten in einer Trainingseinheit.
 *
 * Die Einheit überlebt einen Neustart (B5), sie wäre also nicht verloren. Aber
 * der Bildschirm würde mitten im Einprägen wegspringen und danach mit
 * „Fortsetzen“ wieder dastehen. Eine App, die einem beim Merken eines Wortes
 * unter den Händen neu startet, hat den denkbar schlechtesten Moment gewählt
 * (D-011/G-1).
 *
 * Woran die laufende Einheit zu erkennen ist: an demselben Merkmal, mit dem
 * sie schon das Netz im Hintergrund zurückdrängt. Es gibt keinen zweiten
 * Zustand zu pflegen — und keinen, der mit dem ersten aus dem Tritt geraten
 * könnte.
 */
function reloadWhenNotTraining(): void {
  const isTraining = () => document.documentElement.dataset.focus === 'on'
  if (!isTraining()) {
    window.location.reload()
    return
  }

  const observer = new MutationObserver(() => {
    if (isTraining()) return
    observer.disconnect()
    window.location.reload()
  })
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-focus'],
  })
}
